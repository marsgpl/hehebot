import fail from '../helpers/fail.js';
import { mj } from '../helpers/m.js';
import { FormData } from '../class/Browser.js';
import { HeheBot, HEHE_HOST, JsonObject, TASK_FETCH_HOME } from '../class/HeheBot.js';

const TASK_NOTE = 'tower';

const MAX_CHALLENGES_PER_OPPONENT = 3;

async function fetchTower(bot: HeheBot): Promise<[JsonObject, JsonObject[]] | 'home'> {
    const html = await bot.fetchHtml('/tower-of-fame.html');

    if (html === 'home') {
        return 'home';
    }

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

async function fetchOpponentData(bot: HeheBot, opponentId: string): Promise<JsonObject | undefined> {
    const json = await bot.fetchAjax({
        'namespace': 'h\\Leagues',
        'class': 'Leagues',
        'action': 'get_opponent_info',
        'opponent_id': opponentId,
    });

    // { success: false, error: "You can't fight him." }

    let err = json.error || json.error_message;

    if (err?.match(/fight him/i)) {
        // can't fight him, go to next
        return json;
    }

    const html = await bot.fetchHtml(`/tower-of-fame.html?number_of_battles=1&id_opponent=${opponentId}`);

    return {};
}

// {"rewards":{"data":{"loot":true,"rewards":[{"type":"xp","value":"\u003Cp\u003E+60\u003C\/p\u003E","currency":true,"slot_class":true},{"type":"league_points","value":"\u003Cp\u003E+3p\u003C\/p\u003E","slot_class":true,"avatar_id":null}]},"title":"You lost!","heroChangesUpdate":{"league_points":3,"xp":8040776},"sub_title":"This one was tough, but don\u2019t worry - you can improve your performances by upgrading your stats, buying better equipment and using boosters.\u003Cbr\u003EYou\u0027ve earned \u003Cspan class=\u0022leagues-points\u0022\u003E3\u003C\/span\u003E Points and a bonus of \u003Cspan class=\u0022leagues-points\u0022\u003E0\u003C\/span\u003E Points for your remaining Ego!","redirectUrl":"\/tower-of-fame.html","lose":true},"result":"won","hero_changes":{"energy_challenge":14,"energy_challenge_recharge_time":2100,"ts_challenge":1626897880},"rounds":[{"hero_hit":{"id_hitter_girl":"960719275","totalDamage":18497,"is_critical":false,"defender":{"ego":350528}},"opponent_hit":{"id_hitter_girl":"948443498","totalDamage":38227,"is_critical":false,"defender":{"ego":248287}}},{"hero_hit":{"id_hitter_girl":"946021548","totalDamage":18497,"is_critical":false,"defender":{"ego":332031}},"opponent_hit":{"id_hitter_girl":"451654840","totalDamage":76454,"is_critical":true,"defender":{"ego":171833}}},{"hero_hit":{"id_hitter_girl":"230856770","totalDamage":18497,"is_critical":false,"defender":{"ego":313534}},"opponent_hit":{"id_hitter_girl":"503862914","totalDamage":38227,"is_critical":false,"defender":{"ego":133606}}},{"hero_hit":{"id_hitter_girl":"1","totalDamage":18497,"is_critical":false,"defender":{"ego":295037}},"opponent_hit":{"id_hitter_girl":"1","totalDamage":76454,"is_critical":true,"defender":{"ego":57152}}},{"hero_hit":{"id_hitter_girl":"4","totalDamage":18497,"is_critical":false,"defender":{"ego":276540}},"opponent_hit":{"id_hitter_girl":"4","totalDamage":38227,"is_critical":false,"defender":{"ego":18925}}},{"hero_hit":{"id_hitter_girl":"7","totalDamage":18497,"is_critical":false,"defender":{"ego":258043}},"opponent_hit":{"id_hitter_girl":"5","totalDamage":38227,"is_critical":false,"defender":{"ego":-19302}}}],"success":true}

async function attackOpponent(bot: HeheBot, opponentId: string): Promise<false | number> {
    const json = await bot.fetchAjax({
        'action': 'do_league_battles',
        'id_opponent': String(opponentId),
        'number_of_battles': '1',
    }, `https://${HEHE_HOST}/league-battle.html?number_of_battles=1&id_opponent=${opponentId}`);

    let err = json.error || json.error_message;

    if (
        err?.match(/Not enough/i) ||
        err?.match(/challenge energy/i) ||
        json.success === false // new update
    ) {
        return false;
    }

    if (!json.success) {
        throw fail('attackOpponent', opponentId, json);
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

    const result = await fetchTower(bot);

    if (result === 'home') {
        bot.state.towerError = 'tower not available';
        return;
    } else {
        bot.state.towerError = undefined;
    }

    const [, opponents] = result;

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
            const result = await attackOpponent(bot, opponent.id_player);

            if (result === false) {
                outOfEnergy = true;
                break;
            } else {
                fullRechargeIn = result;
            }

            opponent.nb_challenges_played++;

            if (opponent.nb_challenges_played < MAX_CHALLENGES_PER_OPPONENT) {
                await fetchOpponentData(bot, opponent.id_player);
            }
        }
    }

    if (fullRechargeIn) {
        bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, fullRechargeIn);
    }
}
