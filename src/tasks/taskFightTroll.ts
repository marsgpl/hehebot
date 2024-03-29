import { FormData } from '../class/Browser.js';
import { HeheBot, HEHE_HOST, JsonObject, TASK_FETCH_HOME } from '../class/HeheBot.js';
import fail from '../helpers/fail.js';
import { mj } from '../helpers/m.js';

const TASK_NOTE = 'troll';

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
    if (bot.config.forceTrollId) {
        trollId = String(bot.config.forceTrollId);
    }

    const html = await bot.fetchHtml(`/troll-pre-battle.html?id_opponent=${trollId}`);

    return {};
}

// {"log":[{"damage":127.5,"x":202,"attacker_ability":"critical","defender_ability":"","heal":0,"c":1,"f":"3:10"},{"damage":40,"x":146,"attacker_ability":"","defender_ability":"","heal":0},{"damage":77,"x":202,"attacker_ability":"","defender_ability":"","heal":0},{"damage":40,"x":146,"attacker_ability":"","defender_ability":"","heal":0},{"damage":127,"x":302,"attacker_ability":"","defender_ability":"","heal":0,"o":1,"f":"2:7"},{"damage":0,"x":146,"attacker_ability":"","defender_ability":"block","heal":0},{"damage":79,"x":206,"attacker_ability":"","defender_ability":"","heal":0}],"end":{"rewards":{"data":{"loot":true,"rewards":[{"type":"soft_currency","value":"\u003Cp\u003E800\u003C\/p\u003E","currency":true,"slot_class":true}]},"title":"You won!","heroChangesUpdate":{"soft_currency":"23558","energy_fight":9,"energy_fight_recharge_time":4497,"ts_fight":1622049869},"sub_title":"Only you can give them an orgasm!","lose":false},"result":"won","battle_won":true,"updated_infos":{"energy_fight":-1,"energy_fight_recharge_time":4497,"energy_challenge_recharge_time":0,"energy_kiss_recharge_time":1276},"drops":{"hero":{"soft_currency":800},"orbs":[],"items":[],"girl_shards":[],"equipment":[],"skins":[],"team":[],"personalization":[],"club":[]}},"objective_points":{"contests":{"name":"All Shall Fear Your Skills!","points_gained":200}},"success":true}

// {"success":false,"error":"Not enough fight energy."}

async function attackTroll(bot: HeheBot, trollId: string): Promise<false | number> {
    // https://www.hentaiheroes.com/troll-battle.html?number_of_battles=1&id_opponent=13

    const json = await bot.fetchAjax({
        'action': 'do_troll_battles',
        'id_opponent': String(trollId),
        'number_of_battles': '1',
    }, `https://${HEHE_HOST}/troll-battle.html?number_of_battles=1&id_opponent=${trollId}`);

    let err = json.error || json.error_message;

    if (
        err?.match(/Not enough/i) ||
        err?.match(/fight energy/i) ||
        json.success === false // new update
    ) {
        return false;
    }

    if (!json.success) {
        throw fail('attackTroll', trollId, json);
    }

    if (json.result !== 'won') {
        throw fail('attackTroll', 'we lost', json);
    }

    const fullRechargeIn = Number(json.end?.updated_infos?.energy_fight_recharge_time) || 0;

    await bot.incCache({ trollFights: 1 });

    // check if we gained some quest items in loot
    const rewards = JSON.stringify(json.end?.rewards?.data?.rewards);
    if (rewards?.match(/quest/i)) {
        bot.state.storyError = undefined;
    }

    return fullRechargeIn;
}

export default async function taskFightTroll(bot: HeheBot) {
    const worldId = Number(bot.state.heroInfo?.questing?.id_world);
    const energyNow = Number(bot.state.heroEnergies?.fight?.amount);
    const energyMax = Number(bot.state.heroEnergies?.fight?.max_amount);
    let fullRechargeIn = Number(bot.state.heroEnergies?.fight?.recharge_time);

    if (!worldId || !energyMax) {
        throw fail('taskFightTroll', 'incomplete data', bot.state);
    }

    if (fullRechargeIn) {
        if (bot.state.storyError && energyNow) {
            // allow troll fight as soon as possible because story is blocked!
        } else {
            return bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, fullRechargeIn);
        }
    }

    if (!energyNow) {
        throw fail('taskFightTroll', 'energyNow=0 and fullRechargeIn=0', bot.state);
    }

    const trollInfo = await fetchTrollInfo(bot, worldId);
    const trollId = String(trollInfo?.id_troll);

    if (!trollInfo || !trollId || trollId === 'undefined') {
        bot.state.trollError = 'troll not available';
        return;
        // throw fail('taskFightTroll', 'trollId fetch failed', trollInfo);
    } else {
        bot.state.trollError = undefined;
    }

    while (true) {
        const trollData = await fetchTrollData(bot, trollId);

        if (!trollData) {
            throw fail('taskFightTroll', 'trollData fetch failed');
        }

        const result = await attackTroll(bot, trollId);

        if (result === false) {
            // out of energy
            break;
        } else {
            fullRechargeIn = result;
        }
    }

    if (fullRechargeIn) {
        bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, fullRechargeIn);
    }
}
