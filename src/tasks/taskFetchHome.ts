import { HeheBot, JsonObject, TASK_COLLECT_SALARIES, TASK_ACTIVITIES } from '../class/HeheBot.js';
import fail from '../helpers/fail.js';
import { m, mj } from '../helpers/m.js';

export default async function taskFetchHome(bot: HeheBot) {
    const html = await bot.requestHtml('/home.html');

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

    bot.setState({
        girls,
        memberInfo,
        heroInfo,
        heroEnergies,
        notificationData,
        missions_datas,
        serverDate: new Date(serverTs * 1000),
        timeDeltaMs: !bot.cache.lastRequestTs ? 0 : bot.cache.lastRequestTs - serverTs * 1000,
    });

    bot.pushTask(TASK_COLLECT_SALARIES, 'cycle');
    bot.pushTask(TASK_ACTIVITIES, 'cycle');
}
