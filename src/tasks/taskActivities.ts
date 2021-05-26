import lowest from '../helpers/lowest.js';
import fail from '../helpers/fail.js';
import { HeheBot, JsonObject, TASK_FETCH_HOME } from '../class/HeheBot.js';

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

    bot.cache.missionsCompleted = (bot.cache.missionsCompleted || 0) + 1;
    await bot.saveCache();
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

    bot.cache.missionsStarted = (bot.cache.missionsStarted || 0) + 1;
    await bot.saveCache();
}

async function claimMissionsFinalGift(bot: HeheBot) {
    const json = await bot.fetchAjax({
        'class': 'Missions',
        'action': 'give_gift',
    });

    if (!json.success) {
        throw fail('claimMissionGift', json);
    }

    bot.cache.missionsFinalGifts = (bot.cache.missionsFinalGifts || 0) + 1;
    await bot.saveCache();
}

export default async function taskActivities(bot: HeheBot) {
    const canCollectPrize = bot.state.notificationData?.activities?.includes('reward');
    const canStartMission = bot.state.notificationData?.activities?.includes('action');

    if (!canCollectPrize && !canStartMission) {
        const stateChangeIn = lowest(
            Number(bot.state.missions_datas?.remaining_time),
            Number(bot.state.missions_datas?.pop_remaining_time));

        if (stateChangeIn) {
            return bot.pushTaskIn(TASK_FETCH_HOME, 'activities', stateChangeIn);
        } else {
            throw fail('taskActivities',
                'no notification and no stateChangeIn',
                bot.state.notificationData,
                bot.state.missions_datas);
        }
    }

    const html = await bot.requestHtml('/activities.html');

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

    bot.setState({
        missions,
    });

    if (!missions.length && !html.match(/mission_gift = 1;/i)) {
        await claimMissionsFinalGift(bot);
    }

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

    if (startable) {
        await startMission(bot, startable);
        bot.pushTaskIn(TASK_FETCH_HOME, 'activities', startable.duration);
    }

    if (current) {
        bot.pushTaskIn(TASK_FETCH_HOME, 'activities', current.duration);
    }

    if (bot.state.missions_datas?.next_missions) {
        bot.pushTaskIn(TASK_FETCH_HOME, 'activities', bot.state.missions_datas?.next_missions);
    }
}
