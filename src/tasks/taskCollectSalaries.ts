import { HeheBot, JsonObject, TASK_FETCH_HOME } from '../class/HeheBot.js';
import fail from '../helpers/fail.js';

const TASK_NOTE = 'salary';

const COLLECT_MIN_DELAY_MS = 10 * 60 * 1000; // 10 minutes
const NOOB_COLLECT_MIN_DELAY_MS = 10 * 60; // 1 minute
const NOOB_UNTIL_LEVEL = 50;

// {"time":120,"money":100,"success":true}

async function collectGirlSalary(bot: HeheBot, girlId: string): Promise<[number, number]> {
    const json = await bot.fetchAjax({
        'class': 'Girl',
        'id_girl': girlId,
        'action': 'get_salary',
    });

    const collected = Number(json.money) || 0;
    const nextPayIn = Number(json.time) || 0;
console.log('🔸 json:', json);
console.log('🔸 nextPayIn:', nextPayIn);
    if (!json.success || !collected || !nextPayIn) {
        throw fail('collectGirlSalary', `girlId=${girlId}`, json);
    }

    return [collected, nextPayIn];
}

export default async function taskCollectSalaries(bot: HeheBot) {
    const { canCollectSalarySum } = bot.state;
    if (!canCollectSalarySum) return;

    // const girls = bot.state.girls;
    // if (!girls!.length) throw fail('taskCollectSalaries', 'no girls');

    const minDelay = bot.state.heroInfo?.level < NOOB_UNTIL_LEVEL ?
        NOOB_COLLECT_MIN_DELAY_MS :
        COLLECT_MIN_DELAY_MS;

    if (bot.cache.lastSalaryCollectTs) {
        const delta = Date.now() - bot.cache.lastSalaryCollectTs;
        if (delta < minDelay) {
            return bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, (minDelay - delta) / 1000);
        }
    }

    const html = await bot.fetchHtml('/harem.html');

    const girls: JsonObject = {};
    try {
        const girlsM = html.matchAll(/girlsDataList\[.*?([0-9]+).*?\] = (\{.*?\});/ig);
        for (const [, girlId, girl] of girlsM) {
            const girlData = JSON.parse(girl);
            if (girlData.own) {
                girls[girlId] = girlData;
            }
        }
        if (!Object.keys(girls).length) {
            throw 'no girls';
        }
    } catch (error) {
        throw fail('taskFetchHome', 'girls');
    }

    bot.state.girls = girls;

    let collectedOverall = 0;
    let closestPayIn = 0;

    for (const girlId in girls) {
        const girl = girls[girlId];
        const payIn = Number(girl.pay_in) || 0;

        if (!girl.own) continue;

        if (payIn <= 0) {
            const [collected, nextPayIn] = await collectGirlSalary(bot, girlId);
            collectedOverall += collected;
            closestPayIn = closestPayIn ? Math.min(closestPayIn, nextPayIn) : nextPayIn;
        } else {
            closestPayIn = closestPayIn ? Math.min(closestPayIn, payIn) : payIn;
        }
    }

    if (collectedOverall > 0) {
        bot.cache.lastSalaryCollectTs = Date.now();
        await bot.incCache({ salaryCollected: collectedOverall });
    }

    if (!closestPayIn) {
        throw fail('taskCollectSalaries', 'closestPayIn', closestPayIn);
    }

    bot.state.canCollectSalarySum = 0;
    bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, closestPayIn);
}
