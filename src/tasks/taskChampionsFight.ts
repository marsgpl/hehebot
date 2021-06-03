import fail from '../helpers/fail.js';
import { m, mj } from '../helpers/m.js';
import { HeheBot, JsonObject, TASK_FETCH_HOME } from '../class/HeheBot.js';
import isClassAStrongerThanClassB from '../helpers/isClassAStrongerThanClassB.js';

const TASK_NOTE = 'champs';

const MIN_TICKETS_TO_FIGHT = 1;

export default async function taskChampionsFight(bot: HeheBot) {
    const canFight = bot.state.notificationData?.champions?.includes('action');

    if (bot.state.champAvailIn) {
        return bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, bot.state.champAvailIn);
    }

    if (!canFight) {
        throw fail('taskChampionsFight', 'notification missing and champAvailIn is false');
    }

    const html = await bot.fetchHtml('/champions-map.html');

    const champs: JsonObject = {};

    const unlockedChampsM = html.matchAll(/<a href="champions\/([0-9]+)".*?<\/a>/ig);

    for (const [champHtml, champIndex] of unlockedChampsM) {
        const canFightIn = Number(m(champHtml, /<div rel="timer" timer="([0-9]+)">/i));

        const champ: JsonObject = {
            index: champIndex,
            canFightIn,
        };

        champs[champIndex] = champ;
    }

    for (const champIndex in champs) {
        const champ = champs[champIndex];

        if (champ.canFightIn) {
            bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, champ.canFightIn);
        } else {
            const result = await fightChamp(bot, champ);
            if (!result) break;
        }
    }

    bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, 15 * 60);
}

async function fightChamp(bot: HeheBot, champ: JsonObject): Promise<boolean> {
    const html = await bot.fetchHtml(`/champions/${champ.index}`);

    const championData = mj(html, /championData = (\{.*?\});/i, true);

    if (!championData) {
        throw fail('fightChamp', 'championData parse fail');
    }

    const currentTickets = championData.champion.currentTickets;

    if (currentTickets < MIN_TICKETS_TO_FIGHT) {
        bot.state.champError = `champ fight need more tickets; have: ${currentTickets}; safe amount: ${MIN_TICKETS_TO_FIGHT}`;
        return false;
    }

    const teamIds = await reorderTeam(bot, championData);

    const result = await attackChamp(bot, String(championData.champion.id), teamIds);

    return result;
}

async function attackChamp(
    bot: HeheBot,
    champId: string,
    teamIds: string[],
): Promise<boolean> {
    const json = await bot.fetchAjax({
        'class': 'TeamBattle',
        'battle_type': 'champion',
        'battles_amount': '1',
        'defender_id': champId,
        'attacker[team][]': teamIds,
    });

    if (!json.success) {
        throw fail('attackChamp', champId, teamIds, json);
    } else {
        await bot.incCache({ champFights: 1 });
        return true;
    }
}

async function reorderTeam(bot: HeheBot, championData: JsonObject): Promise<string[]> {
    const champPoses = championData.champion.poses; // [ 10, 2, 5, 11, 11 ]
    const champClass = championData.champion.class;
    const team: JsonObject[] = championData.team; // [{id_girl,class,figure,damage},...]

    const finalTeam: JsonObject[] = [];
    const draft: JsonObject = {};

    team.forEach(member => {
        member.damage = Number(member.damage) || 0;
        member.figure = Number(member.figure) || 0;
        member.isStrongerClass = isClassAStrongerThanClassB(member.class, champClass);
        member.isWeakerClass = isClassAStrongerThanClassB(champClass, member.class);

        if (!member.damage) {
            throw fail('taskChampionsFight', 'reorderTeam', 'damage=0', championData);
        }

        draft[member.id_girl] = member;
    });

    const teamOrderBefore = getTeamIds(team).join(',');

    while (finalTeam.length < team.length) {
        const currentFigure = Number(champPoses[finalTeam.length % champPoses.length]) || 0;

        let biggestDamage = 0;
        let selectedGirlId: string = '';

        Object.keys(draft).forEach(girlId => {
            const girl = draft[girlId];

            let girlFinalDamage = girl.damage;

            if (girl.figure && girl.figure === currentFigure) {
                girlFinalDamage += girl.damage * 0.2;
            }

            if (girl.isStrongerClass) {
                girlFinalDamage += girl.damage * 0.2;
            } else if (girl.isWeakerClass) {
                girlFinalDamage -= girl.damage * 0.2;
            }

            if (girlFinalDamage > biggestDamage) {
                biggestDamage = girlFinalDamage;
                selectedGirlId = girlId;
            }
        });

        if (!selectedGirlId || !biggestDamage) {
            throw fail('taskChampionsFight', 'reorderTeam draft pick', '!selectedGirlId || !biggestDamage', championData);
        }

        finalTeam.push(draft[selectedGirlId]);
        delete draft[selectedGirlId];
    }

    const finalTeamIds = getTeamIds(finalTeam);
    const teamOrderAfter = finalTeamIds.join(',');

    if (teamOrderBefore !== teamOrderAfter) {
        const json = await bot.fetchAjax({
            'class': 'ChampionController',
            'namespace': 'h\\Champions',
            'action': 'team_reorder',
            'team_order[]': finalTeamIds,
            'id_champion': String(championData.champion.id),
            'champion_type': 'champion',
        });

        if (!json.success) {
            throw fail('taskChampionsFight', 'reorderTeam', getTeamIds(finalTeam));
        }
    }

    return finalTeamIds;
}

function getTeamIds(team: JsonObject[]): string[] {
    return team.map((member: JsonObject) => String(member.id_girl));
}
