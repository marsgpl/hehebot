import lowest from '../helpers/lowest.js';
import fail from '../helpers/fail.js';
import { HeheBot, JsonObject, TASK_FETCH_HOME } from '../class/HeheBot.js';

const TASK_NOTE = 'activities';

// home.html
// var missions_datas = {"next_missions":71964};
// var missions_datas = {"reward":true};
// var missions_datas = [];
// var missions_datas = {"duration":"963","remaining_time":"148"};

// {"id_member_mission":"972574934","id_mission":"8","duration":"71","remaining_time":"-10"}
// {"id_member_mission":"972574935","id_mission":"884","duration":"64","remaining_time":null,"remaining_cost":4}

async function claimMissionReward(bot: HeheBot, mission: JsonObject) {
    const json = await bot.fetchAjax({
        'class': 'Missions',
        'action': 'claim_reward',
        'id_mission': String(mission.id_mission),
        'id_member_mission': String(mission.id_member_mission),
    });

    if (!json.success) {
        throw fail('claimMissionReward', mission, json);
    }

    await bot.incCache({missionsCompleted: 1});
}

async function startMission(bot: HeheBot, mission: JsonObject) {
    const json = await bot.fetchAjax({
        'class': 'Missions',
        'action': 'start_mission',
        'id_mission': String(mission.id_mission),
        'id_member_mission': String(mission.id_member_mission),
    });

    if (!json.success) {
        throw fail('claimMissionReward', mission, json);
    }

    await bot.incCache({missionsStarted: 1});
}

async function claimMissionsFinalGift(bot: HeheBot) {
    const json = await bot.fetchAjax({
        'class': 'Missions',
        'action': 'give_gift',
    });

    if (!json.success) {
        throw fail('claimMissionGift', json);
    }

    await bot.incCache({missionsFinalGifts: 1});
}

async function claimContestReward(bot: HeheBot, contestId: string) {
    const json = await bot.fetchAjax({
        'namespace': 'h\\Contest',
        'class': 'Contest',
        'action': 'give_reward',
        'id_contest': contestId,
    });

    if (!json.success) {
        throw fail('claimContestReward', json);
    }

    await bot.incCache({contestRewardsClaimed: 1});
}

export default async function taskActivities(bot: HeheBot) {
    const canCollectPrize =
        bot.state.notificationData?.activities?.includes('reward') ||
        bot.state.missions_datas?.reward;

    const canStartMission =
        bot.state.notificationData?.activities?.includes('action');

    if (!canCollectPrize && !canStartMission) {
        const stateChangeIn = lowest(
            Number(bot.state.missions_datas?.remaining_time),
            Number(bot.state.missions_datas?.pop_remaining_time));

        if (stateChangeIn) {
            bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, stateChangeIn);
        }

        return;
    }

    const html = await bot.fetchHtml('/activities.html');

    const missions: JsonObject[] = [];
    try {
        const missionsM = html.matchAll(/<div.*?class=.?mission_object.*?data-d='(\{.*?\})'/ig);
        for (const [, missionJson] of missionsM) {
            const mission = JSON.parse(missionJson);
            mission.duration = Number(mission.duration);
            missions.push(mission);
        }
        missions.sort(({ duration: durationA }, { duration: durationB }) => {
            if (durationA > durationB) {
                return 1;
            } else if (durationA < durationB) {
                return -1;
            } else {
                return 0;
            }
        });
    } catch (error) {
        throw fail('taskActivities', 'parse missions', error);
    }

    bot.state.missions = missions;

    const claimable = missions.find(mission =>
        mission.remaining_time !== null &&
        Number(mission.remaining_time) <= 0);

    const current = missions.find(mission =>
        mission.remaining_time !== null &&
        Number(mission.remaining_time) > 0);

    const startable = !current &&
        missions.find(mission =>
            mission.remaining_time === null);

    if (claimable) {
        await claimMissionReward(bot, claimable);
    }

    if (
        !html.match(/mission_gift = 1;/i) &&
        (!missions.length || (missions.length === 1 && claimable))
    ) {
        await claimMissionsFinalGift(bot);
    }

    if (startable) {
        await startMission(bot, startable);
        bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, startable.duration);
    }

    if (current) {
        bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, current.duration);
    }

    if (bot.state.missions_datas?.next_missions) {
        bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, bot.state.missions_datas?.next_missions);
    }

    // contests

    const finishedContestsM = html.matchAll(
        /<div class="contest[" ].*?id_contest="([0-9]+)">\s*<div class="contest_header ended"/ig);

    for (const [, contestId] of finishedContestsM) {
        await claimContestReward(bot, contestId);
    }
}
