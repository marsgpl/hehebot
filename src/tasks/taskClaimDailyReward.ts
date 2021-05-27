import fail from '../helpers/fail.js';
import { HeheBot, TASK_FETCH_HOME } from '../class/HeheBot.js';

const TASK_NOTE = 'daily';

const DELAY_BETWEEN_CLAIMS_S = 3600 * 2; // 2 hours

export default async function taskClaimDailyReward(bot: HeheBot) {
    const nowMs = Date.now();
    const lastClaimAttemptMs = bot.cache.dailyRewardLastClaimAttemptMs || 0;
    const claimedAgoMs = nowMs - lastClaimAttemptMs;
    const claimIn = Math.max(0, Math.round(DELAY_BETWEEN_CLAIMS_S - (claimedAgoMs / 1000)));

    if (claimIn) {
        return bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, claimIn);
    }

    const json = await bot.fetchAjax({
        'class': 'RewardNotification',
        'action': 'show_pending',
    });

    if (!json.success) {
        throw fail('taskClaimDailyReward', json);
    }

    bot.cache.dailyRewardLastClaimAttemptMs = nowMs;

    if (json.data?.loot) {
        await bot.incCache({ dailyRewardLootClaims: 1 });
    } else {
        await bot.saveCache();
    }

    bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, DELAY_BETWEEN_CLAIMS_S);
}
