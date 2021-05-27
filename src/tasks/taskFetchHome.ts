import {
    HeheBot,
    JsonObject,
    TASK_STORY,
    TASK_ACTIVITIES,
    TASK_MARKET_BUY,
    TASK_FIGHT_TROLL,
    TASK_SEASON_FIGHT,
    TASK_COLLECT_SALARIES,
    TASK_CLAIM_DAILY_REWARD,
    TASK_OPEN_DAILY_FREE_PACHINKO,
    TASK_CLUB_FIGHT,
    TASK_SEASON_CLAIM_REWARD,
    TASK_TOWER_FIGHT,
    TASK_CHAMPIONS_FIGHT,
    TASK_SLUMBER_PARTY_CLAIM_REWARD,
    TASK_TOWER_CLAIM_LEAGUE_REWARD,
} from '../class/HeheBot.js';
import fail from '../helpers/fail.js';
import { m, mj } from '../helpers/m.js';

const TASK_NOTE = 'cycle';

export default async function taskFetchHome(bot: HeheBot) {
    const html = await bot.fetchHtml('/home.html');

    const girls: JsonObject = {};
    try {
        const girlsM = html.matchAll(/girlsDataList\[.*?([0-9]+).*?\] = (\{.*?\});/ig);
        for (const [, girlId, girl] of girlsM) {
            girls[girlId] = JSON.parse(girl);
        }
    } catch (error) {
        throw fail('taskFetchHome', 'girls');
    }

    const memberInfo = mj(html, /memberInfo = (\{.*?\});/i);
    if (!memberInfo?.Name) throw fail('taskFetchHome', 'memberInfo');

    const heroInfo = mj(html, /Hero\.infos = (\{.*?\});/i);
    if (!heroInfo?.id) throw fail('taskFetchHome', 'heroInfo');

    const heroEnergies = mj(html, /Hero\.energies = (\{.*?\});/i);
    if (!heroEnergies?.quest) throw fail('taskFetchHome', 'heroEnergies');

    const notificationData = mj(html, /notificationData = (\{.*?\});/i);
    if (!notificationData?.activities) throw fail('taskFetchHome', 'notificationData');

    const missions_datas = mj(html, /missions_datas = (\{.*?\});/i) || {};

    const serverTs = Number(m(html, /server_now_ts = ([0-9]+)/i));
    if (isNaN(serverTs) || !serverTs) throw fail('taskFetchHome', 'serverTs');

    const season_season_id = Number(m(html, /season_season_id = .?([0-9]+).?/i));

    bot.setStateMultiple({
        girls,
        memberInfo,
        heroInfo,
        heroEnergies,
        notificationData,
        missions_datas,
        season_season_id,
        serverDate: new Date(serverTs * 1000),
        timeDeltaMs: !bot.cache.lastRequestTs ? 0 : bot.cache.lastRequestTs - serverTs * 1000,
    });

    bot.pushTask(TASK_CLAIM_DAILY_REWARD, TASK_NOTE);
    bot.pushTask(TASK_OPEN_DAILY_FREE_PACHINKO, TASK_NOTE);
    bot.pushTask(TASK_TOWER_CLAIM_LEAGUE_REWARD, TASK_NOTE);
    bot.pushTask(TASK_SLUMBER_PARTY_CLAIM_REWARD, TASK_NOTE);
    bot.pushTask(TASK_SEASON_CLAIM_REWARD, TASK_NOTE);
    bot.pushTask(TASK_ACTIVITIES, TASK_NOTE);
    bot.pushTask(TASK_CLUB_FIGHT, TASK_NOTE);
    bot.pushTask(TASK_CHAMPIONS_FIGHT, TASK_NOTE);
    bot.pushTask(TASK_SEASON_FIGHT, TASK_NOTE);
    bot.pushTask(TASK_TOWER_FIGHT, TASK_NOTE);
    bot.pushTask(TASK_COLLECT_SALARIES, TASK_NOTE);
    bot.pushTask(TASK_FIGHT_TROLL, TASK_NOTE);
    bot.pushTask(TASK_STORY, TASK_NOTE);
    bot.pushTask(TASK_MARKET_BUY, TASK_NOTE);
}
