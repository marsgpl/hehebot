import fail from '../helpers/fail.js';
import { m } from '../helpers/m.js';
import { HeheBot, JsonObject, TASK_FETCH_HOME } from '../class/HeheBot.js';

const TASK_NOTE = 'story';

const LAST_FINISH_CHECK_DELAY_MS = 1000 * 60 * 60 * 8; // 8h

// {"next_step":{"ended":1,"win":[["quest","4","1"]],"num_step":0},"changes":{"energy_quest_recharge_time":0},"success":true}

// {"next_step":{"ended":1,"win":{"girls":[{"id_girl":"7","name":"Red Battler","ico":"https:\/\/hh2.hh-content.com\/pictures\/girls\/7\/ico0.png","avatar":"https:\/\/hh2.hh-content.com\/pictures\/girls\/7\/ava0.png","black_avatar":"https:\/\/hh2.hh-content.com\/pictures\/girls\/7\/avb0.png","rarity":"starting","type":"girl_shards","previous_value":0,"value":100}],"shards":[{"id_girl":"7","name":"Red Battler","ico":"https:\/\/hh2.hh-content.com\/pictures\/girls\/7\/ico0.png","rarity":"starting","type":"girl_shards","previous_value":0,"value":100}]},"num_step":0},"changes":{"energy_quest_recharge_time":448},"success":true}

// {"next_step":{"id_quest":"3","num_step":37,"portrait":"\/img\/quests\/p\/a42da9c0\/p.png","picture":"\/img\/quests\/3\/37\/1600x\/P06d.jpg","item":null,"cost":[],"win":[["quest","4","1"]],"dialogue":"And count on me to open many new quests for you!","end":true},"changes":{"energy_quest":74,"energy_quest_recharge_time":0,"ts_quest":1621999186,"xp":11876},"success":true}

// {"success":false,"error":"You don\u0027t have the wanted item."}

// side:

// {"next_step":{"id_quest":"1000301","num_step":2,"portrait":null,"picture":null,"item":null,"cost":{"*":51},"win":"xp:281","dialogue":"I just finished working on your car! That blown tire is all fixed and I even took a look at your engine. I guess I did really well, because I even have some extra parts left over. It\u2019s okay though, you don\u2019t need your breaks, right?"},"changes":{"energy_quest":510,"energy_quest_recharge_time":0,"ts_quest":1623239233,"xp":16165322},"success":true}

// {"next_step":{"ended":1,"win":{"rewards":{"data":{"loot":true,"rewards":[{"type":"orbs","value":"\u003Cspan class=\u0022orb_icon o_g10\u0022\u003E\u003C\/span\u003E \u003Cp\u003E5\u003C\/p\u003E","currency":true,"slot_class":true}]},"title":"Reward","heroChangesUpdate":[]},"result":"won"},"num_step":0},"changes":{"energy_quest_recharge_time":39591},"success":true}

async function performSideQuests(bot: HeheBot): Promise<void> {
    const now = Date.now();
    const lastFinishCheck = bot.cache.sideQuestsFinishedTs || 0;

    if (lastFinishCheck + LAST_FINISH_CHECK_DELAY_MS > now) {
        // if all side quests finished, we sleep for 8h
        // once in 8 hours we check side quests again
        return;
    }

    const html = await bot.fetchHtml('/side-quests.html');

    let sideQuestsInfo: JsonObject[] = [];

    const progressM = html.matchAll(/class="side-quest-progress".*?>Progress: ([0-9]+)\/([0-9]+)/gi);

    for (const [, progressNow, progressMax] of progressM) {
        sideQuestsInfo.push({
            progressNow,
            progressMax,
        });
    }

    const hrefM = html.matchAll(/class="side-quest-button .*? href="([^"]+)"/gi);

    let i = 0;
    for (const [, href] of hrefM) {
        sideQuestsInfo[i++].href = href;
    }

    if (sideQuestsInfo.length < 1) {
        throw fail('performSideQuests', 'zero side quests were parsed');
    }

    sideQuestsInfo = sideQuestsInfo.filter(quest =>
        quest.progressNow < quest.progressMax);

    if (sideQuestsInfo.length < 1) {
        // all side quests finished
        bot.cache.sideQuestsFinishedTs = Date.now();
        return;
    } else {
        bot.cache.sideQuestsFinishedTs = 0;
    }

    for (let i = 0; i < sideQuestsInfo.length; ++i) {
        const quest = sideQuestsInfo[i];

        let fullRechargeIn = 0;
        let currentQuestId = m(quest.href || '', /\/(\d+)$/);

        if (!currentQuestId) {
            throw fail('performSideQuests', 'currentQuestId is null', sideQuestsInfo);
        }

        while (true) {
            const json = await bot.fetchAjax({
                'class': 'Quest',
                'action': 'next',
                'id_quest': currentQuestId,
            });

            if (!json.success) {
                if (json.error?.match(/have the wanted item/i)) {
                    bot.state.storyError = 'side quest: ' + JSON.stringify(json);
                    return;
                } else if (json.error?.match(/have enough energy/i)) {
                    break;
                } else {
                    throw fail('performSideQuests', json);
                }
            }

            await bot.incCache({ sideQuestsStepsDone: 1 });

            const isEnded = json.next_step?.ended;

            currentQuestId = String(json.next_step?.id_quest || '');
            fullRechargeIn = Number(json.changes?.energy_quest_recharge_time);

            if (isEnded) {
                bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, fullRechargeIn || 0);
                break;
            }

            if (!currentQuestId) {
                throw fail('taskStory', 'currentQuestId', json);
            }
        }
    }
}

export default async function taskStory(bot: HeheBot) {
    const energyNow = Number(bot.state.heroEnergies?.quest?.amount);
    const energyMax = Number(bot.state.heroEnergies?.quest?.max_amount);

    let currentQuestId = String(bot.state.heroInfo?.questing?.id_quest);
    let fullRechargeIn = Number(bot.state.heroEnergies?.quest?.recharge_time);

    if (energyNow >= energyMax / 2 && bot.state.sideQuestsAvailable) {
        await performSideQuests(bot);
    }

    if (bot.state.storyError) return;


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
                bot.state.storyError = json;
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
