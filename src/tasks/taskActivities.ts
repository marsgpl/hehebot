import lowest from '../helpers/lowest.js';
import fail from '../helpers/fail.js';
import { mj } from '../helpers/m.js';
import { HeheBot, JsonObject, TASK_ACTIVITIES, TASK_FETCH_HOME } from '../class/HeheBot.js';

const TASK_NOTE = 'activities';

const MAX_DELAY_BEFORE_CHECK_MS = 1000 * 60 * 60 * 4; // check every 4h

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

    await bot.incCache({ missionsCompleted: 1 });
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

    await bot.incCache({ missionsStarted: 1 });
}

async function claimMissionsFinalGift(bot: HeheBot) {
    const json = await bot.fetchAjax({
        'class': 'Missions',
        'action': 'give_gift',
    });

    if (!json.success) {
        throw fail('claimMissionGift', json);
    }

    await bot.incCache({ missionsFinalGifts: 1 });
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

    await bot.incCache({ contestRewardsClaimed: 1 });
}

export default async function taskActivities(bot: HeheBot, isForced?: boolean) {
    const needToCheckByTmt =
        !bot.cache.lastActivitiesCheckTs ||
        bot.cache.lastActivitiesCheckTs + MAX_DELAY_BEFORE_CHECK_MS < Date.now();

    const canCollectPrize =
        bot.state.notificationData?.activities?.includes('reward') ||
        bot.state.missions_datas?.reward;

    const canStartMission =
        bot.state.notificationData?.activities?.includes('action');

    if (!canCollectPrize && !canStartMission && !isForced && !needToCheckByTmt) {
        const stateChangeIn = lowest(
            Number(bot.state.missions_datas?.remaining_time),
            Number(bot.state.missions_datas?.pop_remaining_time));

        if (stateChangeIn) {
            bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, stateChangeIn);
        }

        return;
    }

    const html = await bot.fetchHtml('/activities.html');

    bot.cache.lastActivitiesCheckTs = Date.now();

    // missions

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

    // pop

    const pops = mj(html, /pop_data\s*=\s*(\{.*?\});/, true);
    let popClaims = 0;
    const assignedGirls: {[key: string]: true} = {};

    if (!pops) {
        bot.state.popError = 'pop_data not found';
    } else {
        bot.state.popError = undefined;

        for (const popKey in pops) {
            const popData = pops[popKey];
            const popId = String(popData.id_places_of_power);

            if (popData.locked) continue;

            if (!popId) {
                throw fail('pop activities', 'popId=0', popData);
            }

            const isStartable = popData.status === 'can_start';
            const isFinished = popData.status === 'pending_reward';
            const inProgress = popData.status === 'in_progress';
            const isUpgradable = Number(popData.max_level || 0) > Number(popData.level || 0) &&
                popData.levelup_cost;

            // "time_to_finish":"25200"
            // "remaining_time":"25170"

            if (!isStartable && !isFinished && !inProgress) {
                throw fail('activities pop', 'pop_data format fail', popKey, popData);
            }

            // if (isUpgradable) {
            //     while (await upgradePop(bot, popId, popData)) {}
            // }

            if (isFinished) {
                await claimPopReward(bot, popId, popData);
                popClaims++;
            } else if (isStartable) {
                await startPop(bot, popId, popData, assignedGirls);
                bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, Number(popData.time_to_finish) || 0);
            } else { // inProgress
                bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, Number(popData.remaining_time) || 0);
            }
        }
    }

    if (popClaims > 0) {
        bot.pushTask(TASK_ACTIVITIES, TASK_NOTE, null, {isForced: true});
    }
}

// {"level_power":4704000,"next_level_power":5268480,"max_team_power":11200,"next_max_team_power":12544,"changes":{"hard_currency":-600},"rewards":[{"loot":true,"rewards":[{"type":"ticket","value":"\u003Cp\u003E2\u003C\/p\u003E","currency":true,"slot_class":true},{"type":"orbs","value":"\u003Cspan class=\u0022orb_icon o_m1\u0022\u003E\u003C\/span\u003E \u003Cp\u003E1\u003C\/p\u003E","currency":true,"slot_class":true},{"type":"orbs","value":"\u003Cspan class=\u0022orb_icon o_g10\u0022\u003E\u003C\/span\u003E \u003Cp\u003E1\u003C\/p\u003E","currency":true,"slot_class":true}],"shards":[{"id_girl":827706883,"type":"girl_shards","slot_class":false,"rarity":"legendary","ico":"https:\/\/hh2.hh-content.com\/pictures\/girls\/827706883\/ico0.png","avatar":"https:\/\/hh2.hh-content.com\/pictures\/girls\/827706883\/ava0.png","black_avatar":"https:\/\/hh2.hh-content.com\/pictures\/girls\/827706883\/avb0.png","name":"Pit\u2019chun","girl_class":"1","caracs":{"carac1":5.4,"carac2":2.3,"carac3":2},"previous_value":10,"value":12}]},{"name":"pop_1_3","loot":true,"rewards":[{"type":"ticket","value":"\u003Cp\u003E2\u003C\/p\u003E","currency":true,"slot_class":true},{"type":"orbs","value":"\u003Cspan class=\u0022orb_icon o_m1\u0022\u003E\u003C\/span\u003E \u003Cp\u003E1\u003C\/p\u003E","currency":true,"slot_class":true},{"type":"orbs","value":"\u003Cspan class=\u0022orb_icon o_g10\u0022\u003E\u003C\/span\u003E \u003Cp\u003E1\u003C\/p\u003E","currency":true,"slot_class":true}],"shards":[{"id_girl":827706883,"type":"girl_shards","slot_class":false,"rarity":"legendary","ico":"https:\/\/hh2.hh-content.com\/pictures\/girls\/827706883\/ico0.png","avatar":"https:\/\/hh2.hh-content.com\/pictures\/girls\/827706883\/ava0.png","black_avatar":"https:\/\/hh2.hh-content.com\/pictures\/girls\/827706883\/avb0.png","name":"Pit\u2019chun","girl_class":"1","caracs":{"carac1":5.4,"carac2":2.3,"carac3":2},"previous_value":10,"value":13}]}],"success":true}

async function upgradePop(bot: HeheBot, popId: string, popData: JsonObject): Promise<boolean> {
    const params = {
        'namespace': 'h\\PlacesOfPower',
        'class': 'PlaceOfPower',
        'action': 'levelup',
        'id_place_of_power': popId,
    };

    let json = await bot.fetchAjax(params);

    if (!json.success) {
        params.class = 'TempPlaceOfPower';
        json = await bot.fetchAjax(params);
    }

    return Boolean(json.success);
}

// {"rewards":{"data":{"loot":true,"rewards":[{"type":"orbs","value":"\u003Cspan class=\u0022orb_icon o_g10\u0022\u003E\u003C\/span\u003E \u003Cp\u003E3\u003C\/p\u003E","currency":true,"slot_class":true}]},"title":"Rewards","heroChangesUpdate":[]},"result":"won","pop_unavailable":false,"success":true}

async function claimPopReward(bot: HeheBot, popId: string, popData: JsonObject): Promise<void> {
    const params = {
        'namespace': 'h\\PlacesOfPower',
        'class': 'PlaceOfPower',
        'action': 'claim',
        'id_place_of_power': popId,
    };

    let json = await bot.fetchAjax(params);

    if (!json.success) {
        params.class = 'TempPlaceOfPower';
        json = await bot.fetchAjax(params);
    }

    if (!json.success) {
        throw fail('claimPopReward', `popId=${popId}`, json, popData);
    }

    await bot.incCache({ popRewardsClaimed: 1 });
}

async function startPop(bot: HeheBot, popId: string, popData: JsonObject, assignedGirls: JsonObject): Promise<void> {
    const needPower = Number(popData.max_team_power) || 0;
    let currentPower = 0;
    const girlsIds: string[] = [];

    if (!needPower) {
        throw fail('startPop', 'needPower=0', popData);
    }

    popData.girls.forEach((girl: JsonObject) => {
        const girlId = String(Number(girl.id_girl) || '');

        const girlMaxPower = Math.max(
            Number(girl.carac_1),
            Number(girl.carac_2),
            Number(girl.carac_3),
        );

        if (!girlId || !girlMaxPower) {
            throw fail('startPop', 'assign girls', 'bad girl data', girl, popData);
        }

        if (currentPower >= needPower) return;
        if (assignedGirls[girlId]) return;
        if (Number(girl.assigned) === 1) return;

        girlsIds.push(girlId);

        currentPower += girlMaxPower;
    });

    if (needPower / 10 > currentPower) {
        bot.state.popError = `not enough power for pop id=${popId}`;
        return;
    } else {
        bot.state.popError = undefined;
    }

    const params = {
        'namespace': 'h\\PlacesOfPower',
        'class': 'PlaceOfPower',
        'action': 'start',
        'id_place_of_power': popId,
        'selected_girls[]': girlsIds,
    };

    let json = await bot.fetchAjax(params);

    if (!json.success) {
        params.class = 'TempPlaceOfPower';
        json = await bot.fetchAjax(params);
    }

    if (!json.success) {
        throw fail('startPop', json, popData);
    }

    assignedGirls = {
        ...assignedGirls,
        ...girlsIds.reduce((acc: JsonObject, girlId) => {
            acc[girlId] = true;
            return acc;
        }, {}),
    };

    await bot.incCache({ popStarted: 1 });
}
