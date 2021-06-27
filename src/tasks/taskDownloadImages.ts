import fs from 'fs';

import fail from '../helpers/fail.js';
import { m, mj } from '../helpers/m.js';
import { HeheBot, JsonObject } from '../class/HeheBot.js';

const BASE_QUEST_URL = '/quest/';

// ['So...','a42da9c0','p2a' ]
type Step = [string, number | string, string | undefined];

async function fetchQuest(bot: HeheBot, questId: string, saveTo: string, saveToFilePrefix: string = ''): Promise<string> {
    const html = await bot.fetchHtml(BASE_QUEST_URL + questId);

    // /img/quests/1/1/800x/p1a.jpg
    const imgPath = m(html, /<img rel="1" class="picture" src="(.*?)"/i);
    if (!imgPath) throw fail('fetchQuest', 'questId', 'imgPath', imgPath);

    // [['',0,'p1a'],['',0,'p1b'],['So...','a42da9c0','p2a' ],...]
    const steps: Step[] | null = mj(html, /Q.steps = (\[.*?\]);/i) as Step[] | null;

    if (!Array.isArray(steps) || !steps.length) {
        throw fail('fetchQuest', 'questId', 'steps', steps);
    }

    for (let index = 0; index < steps.length; ++index) {
        const step = steps[index];

        if ((step as any).picture) {
            const imgUrl = `${bot.getBaseUrl()}${(step as any).picture}`;
            await bot.fetchImage(imgUrl, saveTo, saveToFilePrefix);
        } else if (Array.isArray(step)) {
            const [,,imgName] = steps[index];
            if (!imgName) continue;

            // ['', 'img', 'quests', '1', '1', '800x', 'p1a.jpg']
            const imgPathParts = imgPath.split('/');

            imgPathParts[4] = String(index + 1);
            imgPathParts[5] = '1600x';
            imgPathParts[6] = `${imgName}.jpg`;

            const imgUrl = `${bot.getBaseUrl()}${imgPathParts.join('/')}`;

            await bot.fetchImage(imgUrl, saveTo, saveToFilePrefix);
        } else {
            throw fail('fetchQuest', 'unknown step format', step);
        }
    }

    // { prev: null, next: 2 }
    const nav = mj(html, /Q.nav = (\{.*?\});/i);

    if (!nav?.next) {
        // throw fail('fetchQuest', 'questId', 'nav', nav);
        return '';
    }

    return String(nav.next);
}

export default async function taskDownloadImages(bot: HeheBot) {
    const {
        saveQuestsTo,
        saveSideQuestsTo,
        saveGirlsQuestsTo,
        girlStartId,
        questStartId,
    } = bot.config.downloadParams || {};

    if (
        !saveQuestsTo ||
        !saveSideQuestsTo ||
        !saveGirlsQuestsTo ||
        girlStartId === undefined ||
        questStartId === undefined
    ) {
        throw fail('taskDownloadImages: incomplete config');
    }

    console.log('🔸 downloading girls quest images ...');

    if (!fs.existsSync(saveGirlsQuestsTo)) {
        fs.mkdirSync(saveGirlsQuestsTo);
    }

    await downloadGirlsImages(bot, girlStartId, saveGirlsQuestsTo);

    // console.log('🔸 downloading quest images ...');

    if (!fs.existsSync(saveQuestsTo)) {
        fs.mkdirSync(saveQuestsTo);
    }

    let questId: string | undefined = String(questStartId || '');
    do {
        questId = await fetchQuest(bot, questId, saveQuestsTo, `${questStartId}-`);
    } while (questId);

    console.log('🔸 side quests are not implemented yet');

    if (!fs.existsSync(saveSideQuestsTo)) {
        fs.mkdirSync(saveSideQuestsTo);
    }

    process.exit(0);
}

async function downloadGirlsImages(bot: HeheBot, girlStartId: number, saveTo: string) {
    const html = await bot.fetchHtml('/harem.html');

    const girlsDataList: JsonObject = {};

    const girlsDataListM = html.matchAll(/girlsDataList\[.?([0-9]+).?\] = (\{.*?\});/ig);

    for (const [, id, data] of girlsDataListM) {
        girlsDataList[id] = JSON.parse(data);
        if (!girlsDataList[id].own) {
            delete girlsDataList[id];
        }
    }

    for (const girlId in girlsDataList) {
        if (Number(girlId) < girlStartId) {
            console.log(`🔸 skipping ${girlId}: girlId < girlStartId`);
            continue;
        }

        const girlData = girlsDataList[girlId];

        if (!girlData.quests) {
            continue;
        }

        // for (const index in girlData.quests) {
            // let { status, id_quest: questId } = girlData.quests[index];
            const quest = girlData.quests[Object.keys(girlData.quests)[0]];
            let { status, id_quest: questId } = quest;

            // if (status === 'done') {
                console.log('🔸 girlId:', girlId);
                console.log('🔸 questId:', questId);
                try {
                    do {
                        questId = await fetchQuest(bot, questId, saveTo, `${girlId}-`);
                    } while (questId);
                } catch (error) {
                    console.log('🔸 error:', error);
                }
            // }
        // }
    }
}

// girlsDataList['864899873'] = {"id_girl":"864899873","rarity":"legendary","source_sentence":"Rescue me from <i>Silvanus<\/i> tier <i>3<\/i>!","source_selector":["world","7","troll",6],"Name":"Preya","graded":0,"ico":"https:\/\/hh2.hh-content.com\/pictures\/girls\/864899873\/ico0.png","avatar":"https:\/\/hh2.hh-content.com\/pictures\/girls\/864899873\/avb0.png","Graded2":"<g class=\"grey\"><\/g><g class=\"grey\"><\/g><g class=\"grey\"><\/g>","shards":0,"own":false,"ref":{"id_girl_ref":"323","full_name":"Preya Ariola","id_girl_clicker":"0","desc":"Preya was born to be the protector of her underwater Kingdom, so her spirit was fused with one of the great magical machine creatures that guard her domain. Silvanus and other evil doers often try to break that connection so they can run amok in Preya\u2019s lands. That\u2019s why she needs to keep herself lively and vibrant, and she is always looking for someone to stir her passion and enliven her spirit.","location":"Magic Forest Great Lake","career":"Guardian of the Lake","eyes":"<span class=\"hh_colors cFF0\">Blond<\/span>","hair":"<span class=\"hh_colors cF99\">Pink<\/span>","hobbies":{"food":"Grilled fish","hobby":"Mechanics","fetish":"Aquaphilia"},"anniv":"September 29th","zodiac":"\u264e\ufe0e Libra","variations":["864899873"]}};
