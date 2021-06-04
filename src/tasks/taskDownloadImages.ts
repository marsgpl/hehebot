import fail from '../helpers/fail.js';
import { HeheBot, HEHE_BASE_URL } from '../class/HeheBot.js';
import { m, mj } from '../helpers/m.js';

const QUEST_ID_FROM = '1';
const SAVE_TO = './images/';
const BASE_QUEST_URL = '/quest/';

// ['So...','a42da9c0','p2a' ]
type Step = [string, number | string, string | undefined];

async function fetchQuest(bot: HeheBot, questId: string, saveTo: string): Promise<string> {
    const html = await bot.fetchHtml(BASE_QUEST_URL + questId);

    // /img/quests/1/1/800x/p1a.jpg
    const imgPath = m(html, /<img rel="1" class="picture" src="(.*?)"/i);
    if (!imgPath) throw fail('fetchQuest', 'questId', 'imgPath', imgPath);

    // [['',0,'p1a'],['',0,'p1b'],['So...','a42da9c0','p2a' ],...]
    const steps: Step[] | null = mj(html, /Q.steps = (\[.*?\]);/i) as Step[] | null;
    if (!steps) throw fail('fetchQuest', 'questId', 'steps', steps);

    for (let index = 0; index < steps.length; ++index) {
        const [,,imgName] = steps[index];
        if (!imgName) continue;

        // ['', 'img', 'quests', '1', '1', '800x', 'p1a.jpg']
        const imgPathParts = imgPath.split('/');

        imgPathParts[4] = String(index + 1);
        imgPathParts[5] = '1600x';
        imgPathParts[6] = `${imgName}.jpg`;

        const imgUrl = `${HEHE_BASE_URL}${imgPathParts.join('/')}`;

        await bot.fetchImage(imgUrl, saveTo);
    }

    // { prev: null, next: 2 }
    const nav = mj(html, /Q.nav = (\{.*?\});/i);
    if (!nav?.next) throw fail('fetchQuest', 'questId', 'nav', nav);

    return String(nav.next);
}

export default async function taskDownloadImages(bot: HeheBot) {
    let questId = QUEST_ID_FROM;

    do {
        questId = await fetchQuest(bot, questId, SAVE_TO);
    } while (questId);
}
