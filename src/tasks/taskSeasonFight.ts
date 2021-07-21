import htmlspecialcharsDecode from '../helpers/htmlspecialcharsDecode.js';
import { HeheBot, JsonObject, TASK_FETCH_HOME } from '../class/HeheBot.js';
import { mj } from '../helpers/m.js';
import fail from '../helpers/fail.js';

const TASK_NOTE = 'season';

interface HeheSeasonFightResult {
    error?: any;
    win?: boolean;
    fullRechargeIn?: number;
}

async function fetchArena(bot: HeheBot): Promise<[JsonObject, JsonObject[]]> {
    const html = await bot.fetchHtml('/season-arena.html');

    const player: JsonObject = {};

    player.caracs = mj(html, /ca-player-caracs="(.*?)"/i);

    if (!player.caracs?.damage) {
        throw fail('fetchArena', 'playerCaracs not found', player.caracs);
    }

    player.avgs = getAvgs(player.caracs);

    checkPlayer(player);

    const opponents: JsonObject[] = [];

    const statsM = html.matchAll(/ca-opponent-stats="(.*?)"/ig);

    for (const [, stat] of statsM) {
        try {
            const opponent = JSON.parse(htmlspecialcharsDecode(stat));

            opponent.mojoForWin = Number(opponent.rewards?.data?.rewards?.find((reward: any) =>
                reward.type === 'victory_points')?.value.match(/\d+/)?.[0]);

            if (!opponent.mojoForWin) {
                throw fail('mojoForWin', opponent);
            }

            opponent.avgs = getAvgs(opponent.caracs);
            opponent.powerDiff = isAStrongerThanB(player, opponent);

            checkPlayer(opponent);

            opponents.push(opponent);
        } catch (error) {
            throw fail('fetchArena', 'parse opponent', error);
        }
    }

    if (!opponents.length) {
        throw fail('fetchArena', 'opponents not found');
    }

    return [player, opponents];
}

function getAvgs(caracs: JsonObject): JsonObject {
    return {
        hp: (caracs.endurance + caracs.ego) / 2,
        atk: caracs.damage,
        def: caracs.defense,
    }
}

function checkPlayer(player: JsonObject) {
    const { hp, atk, def } = player.avgs;

    if (!hp || !atk || !def) {
        throw fail('checkAvgs', 'invalid avgs', player);
    }
}

/**
 * positive: A stronger
 * negative: B stronger
 */
function isAStrongerThanB(A: JsonObject, B: JsonObject): number {
    const aNeedTurns = B.avgs.hp / (A.avgs.atk - B.avgs.def);
    const bNeedTurns = A.avgs.hp / (B.avgs.atk - A.avgs.def);

    return bNeedTurns - aNeedTurns;
}

function selectOpponent(player: JsonObject, opponents: JsonObject[]): JsonObject | null {
    const canBeatThem = opponents.filter(opponent => opponent.powerDiff > 0);

    if (canBeatThem.length) {
        canBeatThem.sort((a, b) => {
            if (a.mojoForWin > b.mojoForWin) {
                return -1;
            } else if (a.mojoForWin < b.mojoForWin) {
                return 1;
            } else {
                return 0;
            }
        });

        return canBeatThem[0];
    } else {
        opponents.sort((a, b) => {
            if (a.powerDiff > b.powerDiff) {
                return -1;
            } else if (a.powerDiff < b.powerDiff) {
                return 1;
            } else {
                return 0;
            }
        });

        return opponents[0];
    }
}

// {"log":[{"damage":14953,"x":41548,"attacker_ability":"","defender_ability":"","heal":0,"f":"2:8"},{"damage":6666.5,"x":51412,"attacker_ability":"","defender_ability":"block","heal":0},{"damage":14953,"x":41548,"attacker_ability":"","defender_ability":"","heal":0},{"damage":6666.5,"x":51412,"attacker_ability":"","defender_ability":"","heal":0},{"damage":14953,"x":41548,"attacker_ability":"","defender_ability":"","heal":0},{"damage":17053.5,"x":51412,"attacker_ability":"","defender_ability":"","heal":0},{"damage":25340,"x":62322,"attacker_ability":"","defender_ability":"","heal":0,"o":1,"f":"3:10"},{"damage":29906.5,"x":77118,"attacker_ability":"","defender_ability":"","heal":0,"o":1,"f":"3:11"},{"damage":13767,"x":46260,"attacker_ability":"","defender_ability":"","heal":0},{"damage":4946.75,"x":56674,"attacker_ability":"","defender_ability":"block","heal":0},{"damage":13767,"x":46260,"attacker_ability":"","defender_ability":"","heal":0},{"damage":4946.75,"x":56674,"attacker_ability":"","defender_ability":"","heal":0},{"damage":13767,"x":46260,"attacker_ability":"","defender_ability":"","heal":0},{"damage":16511.75,"x":56674,"attacker_ability":"","defender_ability":"","heal":0},{"damage":25333,"x":69392,"attacker_ability":"","defender_ability":"","heal":0,"o":1,"f":"3:12"},{"damage":18286.75,"x":85010,"attacker_ability":"","defender_ability":"block","heal":0,"o":1,"f":"3:9"},{"damage":12168.75,"x":49570,"attacker_ability":"","defender_ability":"","heal":0}],"end":{"rewards":{"data":{"loot":true,"rewards":[{"type":"victory_points","value":"\u003Cp\u003E20\u003C\/p\u003E","currency":true,"slot_class":true}],"team":{"type":"girls_xp_affection","slot_class":true,"value":{"girls":[{"id_girl":"17","rarity":"common","ico":"https:\/\/hh2.hh-content.com\/pictures\/girls\/17\/ico5.png","team_position":"Alpha","affection":"","xp":"\u003Cp\u003E+5 XP\u003C\/p\u003E"},{"id_girl":"4","rarity":"starting","ico":"https:\/\/hh2.hh-content.com\/pictures\/girls\/4\/ico5.png","team_position":"Beta","affection":"","xp":"\u003Cp\u003E+5 XP\u003C\/p\u003E"},{"id_girl":"28","rarity":"common","ico":"https:\/\/hh2.hh-content.com\/pictures\/girls\/28\/ico3.png","team_position":"Omega","affection":"","xp":"\u003Cp\u003E+5 XP\u003C\/p\u003E"}]}}},"title":"You won!","heroChangesUpdate":{"victory_points":null,"energy_kiss":50,"energy_kiss_recharge_time":0,"ts_kiss":1622052968},"sub_title":"Only you can give them an orgasm!","lose":false},"result":"won","battle_won":true,"updated_infos":{"energy_kiss":-1,"energy_fight_recharge_time":23365,"energy_challenge_recharge_time":17943,"energy_kiss_recharge_time":0},"drops":{"hero":{"victory_points":20},"orbs":[],"items":[],"girl_shards":[],"equipment":[],"skins":[],"team":{"xp":5,"affection":5},"personalization":[],"club":[]}},"objective_points":{"contests":{"name":"All Shall Fear Your Skills!","points_gained":150}},"success":true}

async function fightOpponent(bot: HeheBot, opponent: JsonObject): Promise<HeheSeasonFightResult> {
    const json = await bot.fetchAjax({
        'class': 'Battle',
        'action': 'fight',
        'who[id_member]': String(opponent.id_member),
        'who[id_season_arena]': String(opponent.id_member),
        'who[orgasm]': String(opponent.team['1'].orgasm),
        'who[ego]': String(opponent.caracs.ego),
        'who[x]': '0',
        'who[curr_ego]': String(opponent.caracs.ego),
        'who[nb_org]': '0',
        'who[figure]': String(opponent.team['1'].figure + 1),
        'battles_amount': '0',
    });

    if (!json.success) {
        return {
            error: json,
        }
    }

    return {
        win: (json.end?.result === 'won' || json.end?.battle_won) &&
            json.end?.rewards?.title.match(/won/i),
        fullRechargeIn: json.end?.updated_infos.energy_kiss_recharge_time,
    };
}

export default async function taskSeasonFight(bot: HeheBot) {
    const { seasonId } = bot.state;

    const energyNow = Number(bot.state.heroEnergies?.kiss?.amount);
    const energyMax = Number(bot.state.heroEnergies?.kiss?.max_amount);

    let fullRechargeIn = Number(bot.state.heroEnergies?.kiss?.recharge_time);

    if (!seasonId) {
        bot.state.seasonError = 'seasonId not found';
        return;
    }

    if (!energyMax) {
        throw fail('taskSeasonFight', 'incomplete data', bot.state);
    }

    if (fullRechargeIn) {
        return bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, fullRechargeIn);
    }

    if (!energyNow) {
        throw fail('taskSeasonFight', 'energyNow=0 and fullRechargeIn=0', bot.state);
    }

    let losses = 0;

    while (true) {
        const [player, opponents] = await fetchArena(bot);

        const opponent = selectOpponent(player, opponents);

        if (!opponent?.id_member) {
            throw fail('taskSeasonFight', 'unable to select opponent', player, opponents);
        }

        const result = await fightOpponent(bot, opponent);

        if (result.error) {
            if (
                result.error.error?.match(/Not enough/i) ||
                result.error.error?.match(/kiss energy/i)
            ) {
                break;
            } else {
                throw fail('taskSeasonFight', 'error from fightOpponent', result.error);
            }
        } else {
            if (result.fullRechargeIn !== undefined) {
                fullRechargeIn = result.fullRechargeIn;
            }

            if (result.win) {
                await bot.incCache({ seasonFightWins: 1 });
            } else {
                await bot.incCache({ seasonFightLoses: 1 });

                losses++;

                // if (losses >= 5) {
                //     bot.state.seasonError = 'bot loses too much at season';
                //     break;
                // }
            }
        }
    }

    if (fullRechargeIn) {
        bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, fullRechargeIn);
    }
}
