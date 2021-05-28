import fail from '../helpers/fail.js';
import { mj } from '../helpers/m.js';
import { HeheBot, JsonObject } from '../class/HeheBot.js';

const TASK_NOTE = 'party';

// {"rewards":{"data":{"loot":true,"rewards":[{"type":"energy_quest","value":"\u003Cp\u003E+30\u003C\/p\u003E","currency":true,"slot_class":true}]},"title":"You won!","heroChangesUpdate":{"energy_quest":56,"energy_quest_recharge_time":19722,"ts_quest":1622151774}},"result":"won","success":true}

export default async function taskPathEventClaimReward(bot: HeheBot) {
    const canClaim = bot.state.notificationData?.path_event?.includes('reward');

    if (!canClaim) {
        return;
    }

    const html = await bot.fetchHtml('/path-of-attraction.html');

    const pathOfAttractionData = mj(html, /pathOfAttractionData = (\{.*?\});/, true);
    const objectives: JsonObject[] = pathOfAttractionData?.objectives;
    const currentStep = Number(pathOfAttractionData?.current_step);
    const arePremiumRewardsUnlocked = Boolean(pathOfAttractionData?.unlocked);

    if (!objectives || isNaN(currentStep)) {
        throw fail('taskPathEventClaimReward', 'parse data fail', pathOfAttractionData);
    }

    for (const i in objectives) {
        const objective = objectives[i];
        const step = Number(objective.num_step);
        const canClaim = step < currentStep;
        const isFreeRewardClaimed = objective.free_reward_picked;
        const isPremiumRewardClaimed = objective.locked_reward_picked;

        if (!canClaim) continue;

        if (!isFreeRewardClaimed) {
            const json = await bot.fetchAjax({
                'class': 'PathOfAttraction',
                'action': 'claim',
                'claim_key': `free_${step}`,
            });

            if (!json.success) {
                throw fail('taskPathEventClaimReward', 'free', objective, 'response', json, pathOfAttractionData);
            }

            await bot.incCache({ pathEventFreeRewardsClaimed: 1 });
        }

        if (!isPremiumRewardClaimed && arePremiumRewardsUnlocked) {
            const json = await bot.fetchAjax({
                'class': 'PathOfAttraction',
                'action': 'claim',
                'claim_key': `locked_${step}`,
            });

            if (!json.success) {
                throw fail('taskPathEventClaimReward', 'premium', objective, 'response', json, pathOfAttractionData);
            }

            await bot.incCache({ pathEventPremiumRewardsClaimed: 1 });
        }
    }
}
