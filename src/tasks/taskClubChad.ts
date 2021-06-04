import fail from '../helpers/fail.js';
import { mj } from '../helpers/m.js';
import { HeheBot, HtmlString, TASK_FETCH_HOME } from '../class/HeheBot.js';
import { reorderTeam } from './taskChampionsFight.js';

const TASK_NOTE = 'club';

const MIN_DELAY_BETWEEN_CHAD_FIGHTS_MS = 1000 * 60 * 60 * 24; // 24hr
const MIN_TICKETS_TO_FIGHT = 500;

async function claimChadReward(bot: HeheBot) {
    const html = await bot.fetchHtml('/clubs.html');

    if (html.match(/Champion is impressed/i)) {
        await bot.incCache({ chadRewards: 1 });
    } else {
        throw fail('taskClubChad', 'canClaimChadReward but reward not found');
    }
}

async function fightChad(bot: HeheBot) {
    const html = await bot.fetchHtml('/club-champion.html');

    const championData = mj(html, /championData = (\{.*?\});/i, true);

    if (!championData) {
        throw fail('fightChamp', 'championData parse fail');
    }

    const currentTickets = championData.champion.currentTickets;

    if (currentTickets < MIN_TICKETS_TO_FIGHT) {
        bot.state.chadError = `chad fight need more tickets; have: ${currentTickets}; safe amount: ${MIN_TICKETS_TO_FIGHT}`;
        return false;
    }

    const teamIds = await reorderTeam(bot, championData, 'club_champion');

    const result = await attackChamp(bot, String(championData.champion.id), teamIds);

    return result;
}

async function attackChamp(bot: HeheBot, champId: string, teamIds: string[]): Promise<boolean> {
    const json = await bot.fetchAjax({
        'class': 'TeamBattle',
        'battle_type': 'club_champion',
        'battles_amount': '1',
        'defender_id': champId,
        'attacker[team][]': teamIds,
    });

    if (!json.success) {
        throw fail('attackChamp', champId, teamIds, json);
    } else {
        await bot.incCache({ chadFights: 1 });
        return true;
    }
}

export default async function taskClubChad(bot: HeheBot) {
    const canClaimChadReward = bot.state.notificationData?.clubs?.includes('reward');

    if (canClaimChadReward) {
        await claimChadReward(bot);
    }

    const hasFightNotification = bot.state.notificationData?.clubs?.includes('action');
    const lastChadFightMs = bot.cache.lastChadFightMs || 0;
    const nowMs = Date.now();
    const canFightByTimeDelay = lastChadFightMs + MIN_DELAY_BETWEEN_CHAD_FIGHTS_MS <= nowMs;

    if (hasFightNotification && canFightByTimeDelay) {
        await fightChad(bot);
        bot.cache.lastChadFightMs = nowMs;
    }
}
