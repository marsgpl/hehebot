import fail from '../helpers/fail.js';
import { HeheBot, TASK_FETCH_HOME } from '../class/HeheBot.js';

const TASK_NOTE = 'tower';

// {"rewards":{"title":"Rewards","subTitle":"Season rewards","list":[{"field":"Wanker I","rank":"14\u003Csup\u003Eth\u003C\/sup\u003E","data":{"loot":true,"rewards":[{"type":"hard_currency","value":"\u003Cp\u003E24\u003C\/p\u003E","currency":true,"slot_class":true},{"type":"energy_kiss","value":"\u003Cp\u003E+3\u003C\/p\u003E","currency":true,"slot_class":true}]}}],"heroChangesUpdate":{"energy_kiss":4,"energy_kiss_recharge_time":18605,"ts_kiss":1622119250,"hard_currency":2426}},"success":true}

export default async function taskTowerClaimLeagueReward(bot: HeheBot) {
    const canClaim = bot.state.notificationData?.leaderboard?.includes('reward');

    if (!canClaim) {
        return;
    }

    const json = await bot.fetchAjax({
        'namespace': 'h\\Leagues',
        'class': 'Leagues',
        'action': 'claim_rewards',
    });

    if (!json.success) {
        throw fail('taskTowerClaimLeagueReward', json);
    }

    await bot.incCache({ towerLeagueRewardsClaimed: 1 });
}
