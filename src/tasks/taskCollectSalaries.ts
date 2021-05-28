import { HeheBot, TASK_FETCH_HOME } from '../class/HeheBot.js';
import fail from '../helpers/fail.js';

const TASK_NOTE = 'salary';

const COLLECT_MIN_DELAY_MS = 10 * 60 * 1000; // 10 minutes

// {"time":120,"money":100,"success":true}

async function collectGirlSalary(bot: HeheBot, girlId: string): Promise<[number, number]> {
    const json = await bot.fetchAjax({
        'class': 'Girl',
        'id_girl': girlId,
        'action': 'get_salary',
    });

    const collected = Number(json.money) || 0;
    const nextPayIn = Number(json.time) || 0;

    if (!json.success || !collected || !nextPayIn) {
        throw fail('collectGirlSalary', `girlId=${girlId}`, json);
    }

    return [collected, nextPayIn];
}

export default async function taskCollectSalaries(bot: HeheBot) {
    const girls = bot.state.girls;
    if (!girls) throw fail('taskCollectSalaries', 'no girls');

    if (bot.cache.lastSalaryCollectTs) {
        const delta = Date.now() - bot.cache.lastSalaryCollectTs;
        if (delta < COLLECT_MIN_DELAY_MS) {
            return bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, (COLLECT_MIN_DELAY_MS - delta) / 1000);
        }
    }

    let collectedOverall = 0;
    let closestPayIn = 0;

    for (const girlId in girls) {
        const girl = girls[girlId];
        const payIn = Number(girl.pay_in) || 0;

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

    bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, closestPayIn);
}
