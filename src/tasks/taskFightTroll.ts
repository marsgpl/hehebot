import { FormData } from '../class/Browser.js';
import { HeheBot, JsonObject, TASK_FETCH_HOME } from '../class/HeheBot.js';
import fail from '../helpers/fail.js';
import { mj } from '../helpers/m.js';

// trollInfo = {"id_troll":"1","id_world":"2"};

async function fetchTrollInfo(bot: HeheBot, worldId: number): Promise<JsonObject | null> {
    const html = await bot.fetchHtml(`/world/${worldId}`);

    const trollInfo = mj(html, /trollInfo = (\{.*?\});/i);

    return trollInfo;
}

// var hh_battle_players = [
//     {"id_member":"3806182","orgasm":216,"ego":776.7,"x":0,"curr_ego":776.7,"nb_org":0,"figure":1},
//     {"id_troll":"1","orgasm":863,"ego":365.15,"x":0,"curr_ego":365.15,"nb_org":0,"figure":3,"id_world":"2"}
// ];

async function fetchTrollData(bot: HeheBot, trollId: string): Promise<JsonObject | undefined> {
    const html = await bot.fetchHtml(`/battle.html?id_troll=${trollId}`);

    const hh_battle_players = mj(html.replace(/[\n\t]/g, ' '), /hh_battle_players = (\[.*?\]);/im);

    if (Array.isArray(hh_battle_players)) {
        return hh_battle_players.find(data => data.id_troll);
    }
}

// {"log":[{"damage":127.5,"x":202,"attacker_ability":"critical","defender_ability":"","heal":0,"c":1,"f":"3:10"},{"damage":40,"x":146,"attacker_ability":"","defender_ability":"","heal":0},{"damage":77,"x":202,"attacker_ability":"","defender_ability":"","heal":0},{"damage":40,"x":146,"attacker_ability":"","defender_ability":"","heal":0},{"damage":127,"x":302,"attacker_ability":"","defender_ability":"","heal":0,"o":1,"f":"2:7"},{"damage":0,"x":146,"attacker_ability":"","defender_ability":"block","heal":0},{"damage":79,"x":206,"attacker_ability":"","defender_ability":"","heal":0}],"end":{"rewards":{"data":{"loot":true,"rewards":[{"type":"soft_currency","value":"\u003Cp\u003E800\u003C\/p\u003E","currency":true,"slot_class":true}]},"title":"You won!","heroChangesUpdate":{"soft_currency":"23558","energy_fight":9,"energy_fight_recharge_time":4497,"ts_fight":1622049869},"sub_title":"Only you can give them an orgasm!","lose":false},"result":"won","battle_won":true,"updated_infos":{"energy_fight":-1,"energy_fight_recharge_time":4497,"energy_challenge_recharge_time":0,"energy_kiss_recharge_time":1276},"drops":{"hero":{"soft_currency":800},"orbs":[],"items":[],"girl_shards":[],"equipment":[],"skins":[],"team":[],"personalization":[],"club":[]}},"objective_points":{"contests":{"name":"All Shall Fear Your Skills!","points_gained":200}},"success":true}

// {"success":false,"error":"Not enough fight energy."}

async function attackTroll(bot: HeheBot, trollData: JsonObject): Promise<false | number> {
    const trollParams: FormData = {};

    Object.keys(trollData).forEach(key => {
        trollParams[`who[${key}]`] = String(trollData[key]);
    });

    const json = await bot.fetchAjax({
        class: 'Battle',
        action: 'fight',
        battles_amount: '0',
        ...trollParams,
    });

    if (json.error?.match(/fight energy/i)) {
        return false;
    }

    if (!json.success) {
        throw fail('attackTroll', json);
    }

    const isWin = json.end?.battle_won || json.end?.result === 'win';

    if (!isWin) {
        throw fail('attackTroll', 'we lost', json);
    }

    const fullRechargeIn = Number(json.end?.updated_infos?.energy_fight_recharge_time) || 0;

    bot.cache.trollFights = (bot.cache.trollFights || 0) + 1;
    await bot.saveCache();

    // check if we gained some quest items in loot
    const rewards = JSON.stringify(json.end?.rewards?.data?.rewards);
    if (rewards?.match(/quest/i)) {
        bot.state.storyBlocked = undefined;
    }

    return fullRechargeIn;
}

export default async function taskFightTroll(bot: HeheBot) {
    const worldId = Number(bot.state.heroInfo?.questing?.id_world);
    const energyNow = Number(bot.state.heroEnergies?.fight?.amount);
    const energyMax = Number(bot.state.heroEnergies?.fight?.max_amount);
    let fullRechargeIn = Number(bot.state.heroEnergies?.fight?.recharge_time);

    if (!worldId || !energyMax || (energyNow < energyMax && !fullRechargeIn)) {
        throw fail('taskFightTroll', 'incomplete data', bot.state);
    }

    if (fullRechargeIn) {
        if (bot.state.storyBlocked && energyNow) {
            // allow troll fight as soon as possible because story is blocked!
        } else {
            return bot.pushTaskIn(TASK_FETCH_HOME, 'troll', fullRechargeIn)
        }
    }

    const trollInfo = await fetchTrollInfo(bot, worldId);
    const trollId = String(trollInfo?.id_troll);

    if (!trollId) {
        throw fail('taskFightTroll', 'trollId fetch failed', trollInfo);
    }

    while (true) {
        const trollData = await fetchTrollData(bot, trollId);

        if (!trollData) {
            throw fail('taskFightTroll', 'trollData fetch failed');
        }

        const result = await attackTroll(bot, trollData);

        if (result === false) {
            // out of energy
            break;
        } else {
            fullRechargeIn = result;
        }
    }

    if (fullRechargeIn) {
        bot.pushTaskIn(TASK_FETCH_HOME, 'troll', fullRechargeIn);
    }
}
