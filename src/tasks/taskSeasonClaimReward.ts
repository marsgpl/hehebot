import fail from '../helpers/fail.js';
import { HeheBot, TASK_FETCH_HOME } from '../class/HeheBot.js';

const TASK_NOTE = 'season';

// {"rewards":{"data":{"loot":true,"rewards":[{"type":"energy_kiss","value":"\u003Cp\u003E+2\u003C\/p\u003E","currency":true,"slot_class":true}]},"title":"You won!","heroChangesUpdate":{"energy_kiss":5,"energy_kiss_recharge_time":15753,"ts_kiss":1622116350}},"result":"won","success":true}

export default async function taskSeasonClaimReward(bot: HeheBot) {
    const { seasonId, seasonRewards, seasonHasPass } = bot.state;

    if (!seasonId || !seasonRewards || seasonHasPass === undefined) {
        bot.state.seasonError = 'no season data';
        return;
    }

    for (const index in seasonRewards) {
        const tier = seasonRewards[index];

        if (!tier.rewardClaimable) continue;

        if (!tier.free_reward_picked) {
            const json = await bot.fetchAjax({
                'class': 'Season',
                'namespace': 'h\\Season',
                'action': 'claim',
                'key': `free_${tier.tier}`,
            });

            if (!json.success) {
                throw fail('taskSeasonClaimReward', 'free', 'tier', tier, 'response', json);
            }

            await bot.incCache({ seasonFreeRewardsClaimed: 1 });
        }

        if (!tier.pass_reward_picked && seasonHasPass) {
            const json = await bot.fetchAjax({
                'class': 'Season',
                'namespace': 'h\\Season',
                'action': 'claim',
                'key': `pass_${tier.tier}`,
            });

            if (!json.success) {
                throw fail('taskSeasonClaimReward', 'pass', 'tier', tier, 'response', json);
            }

            await bot.incCache({ seasonPassRewardsClaimed: 1 });
        }
    }
}
