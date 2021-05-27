import fail from '../helpers/fail.js';
import { HeheBot, TASK_FETCH_HOME } from '../class/HeheBot.js';

const TASK_NOTE = 'story';

// {"next_step":{"ended":1,"win":[["quest","4","1"]],"num_step":0},"changes":{"energy_quest_recharge_time":0},"success":true}

// {"next_step":{"ended":1,"win":{"girls":[{"id_girl":"7","name":"Red Battler","ico":"https:\/\/hh2.hh-content.com\/pictures\/girls\/7\/ico0.png","avatar":"https:\/\/hh2.hh-content.com\/pictures\/girls\/7\/ava0.png","black_avatar":"https:\/\/hh2.hh-content.com\/pictures\/girls\/7\/avb0.png","rarity":"starting","type":"girl_shards","previous_value":0,"value":100}],"shards":[{"id_girl":"7","name":"Red Battler","ico":"https:\/\/hh2.hh-content.com\/pictures\/girls\/7\/ico0.png","rarity":"starting","type":"girl_shards","previous_value":0,"value":100}]},"num_step":0},"changes":{"energy_quest_recharge_time":448},"success":true}

// {"next_step":{"id_quest":"3","num_step":37,"portrait":"\/img\/quests\/p\/a42da9c0\/p.png","picture":"\/img\/quests\/3\/37\/1600x\/P06d.jpg","item":null,"cost":[],"win":[["quest","4","1"]],"dialogue":"And count on me to open many new quests for you!","end":true},"changes":{"energy_quest":74,"energy_quest_recharge_time":0,"ts_quest":1621999186,"xp":11876},"success":true}

// {"success":false,"error":"You don\u0027t have the wanted item."}

export default async function taskStory(bot: HeheBot) {
    if (bot.state.storyBlocked) return;

    const energyNow = Number(bot.state.heroEnergies?.quest?.amount);
    const energyMax = Number(bot.state.heroEnergies?.quest?.max_amount);

    let currentQuestId = String(bot.state.heroInfo?.questing?.id_quest);
    let fullRechargeIn = Number(bot.state.heroEnergies?.quest?.recharge_time);

    if (!energyMax || !currentQuestId) {
        throw fail('taskStory', 'incomplete data', bot.state);
    }

    if (fullRechargeIn) {
        return bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, fullRechargeIn);
    }

    if (!energyNow) {
        throw fail('taskStory', 'energyNow=0 and fullRechargeIn=0', bot.state);
    }

    while (true) {
        const json = await bot.fetchAjax({
            'class': 'Quest',
            'action': 'next',
            'id_quest': currentQuestId,
        });

        if (!json.success) {
            if (json.error?.match(/have the wanted item/i)) {
                bot.state.storyBlocked = json;
                return;
            } else if (json.error?.match(/have enough energy/i)) {
                break;
            } else {
                throw fail('taskStory', json);
            }
        }

        await bot.incCache({ storyStepsDone: 1 });

        const isEnded = json.next_step?.ended;

        currentQuestId = String(json.next_step?.id_quest || '');
        fullRechargeIn = Number(json.changes?.energy_quest_recharge_time);

        if (isEnded) {
            return bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, fullRechargeIn || 0);
        }

        if (!currentQuestId) {
            throw fail('taskStory', 'currentQuestId', json);
        }
    }

    if (fullRechargeIn) {
        bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, fullRechargeIn);
    }
}
