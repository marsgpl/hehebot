import fail from '../helpers/fail.js';
import { m } from '../helpers/m.js';
import { HeheBot } from '../class/HeheBot.js';

const TASK_NOTE = 'daily';

// var pachinkoVar = { tutorial: 2, orbs_tutorial: 0, next_game: 0, great_free: true , epic_no_girls: 0, mythic_no_girls: 0, event_no_girls: 1 };

// {"rewards":{"data":{"loot":true,"rewards":[{"type":"armor","value":"... messy html ..."}]},"title":"Rewards","heroChangesUpdate":{"soft_currency":52849341,"hard_currency":"2703"}},"result":"won","objective_points":{"contests":{"name":"Show off in the Casino","points_gained":500}},"success":true}

export default async function taskOpenDailyFreePachinko(bot: HeheBot) {
    if (!bot.state.notificationData?.pachinko?.includes('action')) {
        return;
    }

    const html = await bot.fetchHtml('/pachinko.html');

    const pachinkoVar = m(html, /pachinkoVar = (\{.*?\});/i);
    if (!pachinkoVar) {
        throw fail('taskOpenDailyFreePachinko', 'pachinkoVar', pachinkoVar);
    }

    const isGreatFree = pachinkoVar.match(/great_free\s*:\s*(true|1)/i);

    if (!isGreatFree) {
        return;
    }

    const json = await bot.fetchAjax({
        'class': 'Pachinko',
        'action': 'play',
        'what': 'pachinko1',
        'how_many': '1',
        'orbs': '',
    });

    if (!json.success) {
        throw fail('taskOpenDailyFreePachinko', json);
    }

    await bot.incCache({ freeDailyPachinkoOpened: 1 });
}
