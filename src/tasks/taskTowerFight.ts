import fail from '../helpers/fail.js';
import { mj } from '../helpers/m.js';
import { FormData } from '../class/Browser.js';
import { HeheBot, JsonObject, TASK_FETCH_HOME } from '../class/HeheBot.js';

const TASK_NOTE = 'tower';

const MAX_CHALLENGES_PER_OPPONENT = 3;

async function fetchTower(bot: HeheBot): Promise<[JsonObject, JsonObject[]]> {
    const html = await bot.fetchHtml('/tower-of-fame.html');

    const player = mj(html, /heroLeaguesData = (\{.*?\});/i);

    if (!player || !player.level) {
        throw fail('fetchTower', 'player not found', player);
    }

    player.level = Number(player.level);

    const opponents: JsonObject[] = [];

    // {"id_player":"727575","nb_challenges_played":"2","level":"197","place":1}

    const opponentsM = html.matchAll(/leagues_list.push\(\s*(\{.*?\})\s*\);/ig);

    for (const [, opponentRaw] of opponentsM) {
        const opponent: JsonObject = JSON.parse(opponentRaw);

        opponent.level = Number(opponent.level);
        opponent.place = Number(opponent.place);
        opponent.nb_challenges_played = Number(opponent.nb_challenges_played);

        if (
            isNaN(opponent.level) ||
            isNaN(opponent.place) ||
            isNaN(opponent.nb_challenges_played)
        ) {
            throw fail('fetchTower', 'parse opponents', opponent);
        }

        if (opponent.nb_challenges_played >= MAX_CHALLENGES_PER_OPPONENT) {
            continue;
        }

        opponents.push(opponent);
    }

    opponents.sort((A, B) => {
        if (A.level > B.level) {
            return 1;
        } else if (A.level < B.level) {
            return -1;
        } else {
            return 0;
        }
    });

    return [player, opponents];
}

// var hh_battle_players = [
//     {"id_member":"452891","orgasm":109417,"ego":154835.25,"x":0,"curr_ego":154835.25,"nb_org":0,"figure":5},
//     {"id_member":"1391863","orgasm":44737,"ego":47047,"x":0,"curr_ego":47047,"nb_org":0,"figure":1}
// ];

// playerLeaguesData: { id_member: 64976, level: '366', match_history: [ null, null, null ], mojo: 12510, ico: 'https://hh2.hh-content.com/pictures/hero/ico/165.jpg', team: { '1': { level: 365, caracs: [Object], position_img: 'dolphin.png', dmg: 4836, orgasm: 250390, figure: 2, class: '1', rarity: 'legendary', Name: 'Bellona', ico: 'https://hh2.hh-content.com/pictures/girls/946021548/ico5.png', Graded2: '<g ></g><g ></g><g ></g><g ></g><g ></g>' }, '2': { level: 365, caracs: [Object], position_img: 'sodomy.png', dmg: 4928, orgasm: 255500, figure: 4, class: '1', rarity: 'legendary', Name: 'Jezebel', ico: 'https://hh2.hh-content.com/pictures/girls/41414350/ico5.png', Graded2: '<g ></g><g ></g><g ></g><g ></g><g ></g>' }, '3': { level: 365, caracs: [Object], position_img: 'missionary.png', dmg: 4836, orgasm: 250390, figure: 3, class: '1', rarity: 'legendary', Name: 'Kumiko', ico: 'https://hh2.hh-content.com/pictures/girls/960719275/ico5.png', Graded2: '<g ></g><g ></g><g ></g><g ></g><g ></g>' } }, caracs: { carac1: 31071, carac2: 29534, carac3: 30337, endurance: 244782, chance: 36450, ego: 297981, damage: 45580, def_carac1: 18047, def_carac2: 18189, def_carac3: 17906, damage_max: 58273.2, def_carac1_max: 30740.2, def_carac2_max: 30882.2, def_carac3_max: 30599.2 }, Name: 'billy', class: 1, club: { name: 'FOLLAPLUS', id_club: 1202 }, rewards: { data: { loot: false, rewards: [Array] } }, opponent: true }

async function fetchOpponentData(bot: HeheBot, opponentId: string): Promise<JsonObject | undefined> {
    const json = await bot.fetchAjax({
        'namespace': 'h\\Leagues',
        'class': 'Leagues',
        'action': 'get_opponent_info',
        'opponent_id': opponentId,
    });

    // { success: false, error: "You can't fight him." }

    if (json.error?.match(/fight him/i)) {
        // can't fight him, go to next
        return json;
    }

    // const playerLeaguesData = mj(json.html, /playerLeaguesData = (\{.*?\});/);

    const html = await bot.fetchHtml(`/battle.html?league_battle=1&id_member=${opponentId}`);

    const hh_battle_players = mj(html, /hh_battle_players = (\[.*?\]);/im);

    if (Array.isArray(hh_battle_players)) {
        return hh_battle_players[1];
    }
}

// {"log":[{"damage":19476,"x":44798,"attacker_ability":"","defender_ability":"","heal":0,"f":"1:3"},{"damage":0,"x":12748,"attacker_ability":"","defender_ability":"block","heal":0},{"damage":19476,"x":44798,"attacker_ability":"","defender_ability":"","heal":0},{"damage":0,"x":12748,"attacker_ability":"","defender_ability":"","heal":0},{"damage":19476,"x":44798,"attacker_ability":"","defender_ability":"","heal":0}],"end":{"rewards":{"data":{"loot":true,"rewards":[{"type":"xp","value":"\u003Cp\u003E+181\u003C\/p\u003E","currency":true,"slot_class":true},{"type":"league_points","value":"\u003Cp\u003E+25p\u003C\/p\u003E","slot_class":true,"avatar_id":null}]},"title":"You won!","heroChangesUpdate":{"league_points":null,"xp":"1281715","energy_challenge":4,"energy_challenge_recharge_time":21925,"ts_challenge":1622164270},"sub_title":"Only you can give them an orgasm!\u003Cbr\u003EYou\u0027ve earned \u003Cspan class=\u0022leagues-points\u0022\u003E15\u003C\/span\u003E Points and a bonus of \u003Cspan class=\u0022leagues-points\u0022\u003E10\u003C\/span\u003E Points for your remaining Ego!","lose":false},"result":"won","battle_won":true,"updated_infos":{"energy_challenge":-1,"energy_fight_recharge_time":28733,"energy_challenge_recharge_time":21925,"energy_kiss_recharge_time":33015},"drops":{"hero":{"league_points":25,"xp":181},"orbs":[],"items":[],"girl_shards":[],"equipment":[],"skins":[],"team":[],"personalization":[],"club":[]}},"success":true}

async function attackOpponent(bot: HeheBot, opponentData: JsonObject): Promise<false | number> {
    const fightParams: FormData = {};

    Object.keys(opponentData).forEach(key => {
        fightParams[`who[${key}]`] = String(opponentData[key]);
    });

    const json = await bot.fetchAjax({
        'class': 'Battle',
        'action': 'fight',
        'battles_amount': '0',
        ...fightParams,
    });

    if (json.error?.match(/Not enough/i) || json.error?.match(/challenge energy/i)) {
        return false;
    }

    if (!json.success) {
        throw fail('attackOpponent', opponentData, json);
    }

    const isWin = (json.end?.battle_won || json.end?.result === 'win') &&
        json.end?.rewards?.title.match(/won/i);

    if (isWin) {
        await bot.incCache({ towerWins: 1 });
    } else {
        await bot.incCache({ towerLosses: 1 });
    }

    // "energy_fight_recharge_time":28733, - troll
    // "energy_challenge_recharge_time":21925, - tower
    // "energy_kiss_recharge_time":33015 - season

    const fullRechargeIn = Number(json.end?.updated_infos?.energy_challenge_recharge_time) || 0;

    return fullRechargeIn;
}

export default async function taskTowerFight(bot: HeheBot) {
    const energyNow = Number(bot.state.heroEnergies?.challenge?.amount);
    const energyMax = Number(bot.state.heroEnergies?.challenge?.max_amount);

    let fullRechargeIn = Number(bot.state.heroEnergies?.challenge?.recharge_time);

    if (!energyMax) {
        throw fail('taskTowerFight', 'incomplete data', bot.state);
    }

    if (fullRechargeIn) {
        return bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, fullRechargeIn);
    }

    if (!energyNow) {
        throw fail('taskTowerFight', 'energyNow=0 and fullRechargeIn=0', bot.state);
    }

    const [, opponents] = await fetchTower(bot);

    let outOfEnergy = false;

    for (const i in opponents) {
        if (outOfEnergy) break;

        const opponent = opponents[i];

        if (opponent.nb_challenges_played >= MAX_CHALLENGES_PER_OPPONENT) continue;

        const opponentData = await fetchOpponentData(bot, opponent.id_player);

        if (!opponentData) {
            throw fail('taskTowerFight', 'opponentData fetch failed');
        }

        if (opponentData.error) {
            // allowed error
            continue;
        }

        while (opponent.nb_challenges_played < MAX_CHALLENGES_PER_OPPONENT) {
            const result = await attackOpponent(bot, opponentData);

            if (result === false) {
                outOfEnergy = true;
                break;
            } else {
                fullRechargeIn = result;
            }

            opponent.nb_challenges_played++;
        }
    }

    if (fullRechargeIn) {
        bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, fullRechargeIn);
    }
}
