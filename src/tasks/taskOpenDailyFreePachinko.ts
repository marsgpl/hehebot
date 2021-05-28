import fail from '../helpers/fail.js';
import { m, mj } from '../helpers/m.js';
import { HeheBot } from '../class/HeheBot.js';

const TASK_NOTE = 'daily';

// var pachinkoVar = { tutorial: 2, orbs_tutorial: 0, next_game: 0, great_free: true , epic_no_girls: 0, mythic_no_girls: 0, event_no_girls: 1 };

// {"rewards":{"data":{"loot":true,"rewards":[{"type":"armor","value":"... messy html ..."}]},"title":"Rewards","heroChangesUpdate":{"soft_currency":52849341,"hard_currency":"2703"}},"result":"won","objective_points":{"contests":{"name":"Show off in the Casino","points_gained":500}},"success":true}
// {"rewards":{"data":{"loot":true,"rewards":[{"type":"avatar","value":"\u003Cimg src=\u0022https:\/\/hh2.hh-content.com\/pictures\/hero\/ico\/792.jpg?2\u0022\u003E","slot_class":true,"avatar_id":"792"}]},"title":"Rewards","heroChangesUpdate":{"soft_currency":"351660","hard_currency":"2010"}},"result":"won","success":true}

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
    const isMythicFree = !isGreatFree;

    const heroInfo = mj(html, /Hero\.infos = (\{.*?\});/i);
    if (!heroInfo?.id) throw fail('taskOpenDailyFreePachinko', 'heroInfo');

    const hardCurrencyBefore = heroInfo.hard_currency;
    const softCurrencyBefore = heroInfo.soft_currency;

    let hardCurrencyAfter = hardCurrencyBefore;
    let softCurrencyAfter = softCurrencyBefore;

    if (
        typeof hardCurrencyBefore !== 'number' ||
        typeof softCurrencyBefore !== 'number'
    ) {
        throw fail('taskOpenDailyFreePachinko', 'currency parse fail');
    }

    if (isGreatFree) {
        const json = await bot.fetchAjax({
            'class': 'Pachinko',
            'action': 'play',
            'what': 'pachinko1',
            'how_many': '1',
            'orbs': '',
        });

        if (!json.success) {
            throw fail('taskOpenDailyFreePachinko', 'great', json);
        }

        hardCurrencyAfter = Number(json.rewards?.heroChangesUpdate?.hard_currency);
        softCurrencyAfter = Number(json.rewards?.heroChangesUpdate?.soft_currency);

        if (
            hardCurrencyBefore !== hardCurrencyAfter ||
            softCurrencyBefore !== softCurrencyAfter
        ) {
            throw fail('taskOpenDailyFreePachinko', 'great',
                'free pachinko was not free',
                {
                    hardCurrencyBefore,
                    hardCurrencyAfter,
                    softCurrencyBefore,
                    softCurrencyAfter,
                }, json);
        }

        await bot.incCache({ freeDailyPachinkoOpened: 1 });
    }

    if (isMythicFree) {
        const json = await bot.fetchAjax({
            'class': 'Pachinko',
            'action': 'play',
            'what': 'pachinko5',
            'how_many': '1',
            'orbs': '',
        });

        if (!json.success) {
            throw fail('taskOpenDailyFreePachinko', 'mythic', json);
        }

        hardCurrencyAfter = Number(json.rewards?.heroChangesUpdate?.hard_currency);
        softCurrencyAfter = Number(json.rewards?.heroChangesUpdate?.soft_currency);

        if (
            hardCurrencyBefore !== hardCurrencyAfter ||
            softCurrencyBefore !== softCurrencyAfter
        ) {
            throw fail('taskOpenDailyFreePachinko', 'mythic',
                'free pachinko was not free',
                {
                    hardCurrencyBefore,
                    hardCurrencyAfter,
                    softCurrencyBefore,
                    softCurrencyAfter,
                }, json);
        }

        await bot.incCache({ freeDailyPachinkoOpened: 1 });
    }
}
