import fail from '../helpers/fail.js';
import { HeheBot, HtmlString, JsonObject, TASK_FETCH_HOME } from '../class/HeheBot.js';
import { m } from '../helpers/m.js';
import htmlspecialcharsDecode from '../helpers/htmlspecialcharsDecode.js';

const TASK_NOTE = 'market';

export default async function taskMarket(bot: HeheBot) {
    const haveNewGoods = bot.state.notificationData?.shop?.includes('action');

    if (!haveNewGoods) {
        return bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, 1 * 60 * 60); // 1h
    }

    const html = await bot.fetchHtml('/shop.html');

    const restockIn = parseRestockIn(html);

    if (restockIn) {
        bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, restockIn);
    }

    const items = parseItems(html);
    const itemsForSale = items.filter(item => !item.id_member);

    const expForSale = filterExpForSale(itemsForSale);
    const affForSale = filterAffForSale(itemsForSale);

    if (expForSale.length) {
        await buyAllItems(bot, expForSale);
    }

    if (affForSale.length) {
        await buyAllItems(bot, affForSale);
    }
}

async function buyAllItems(bot: HeheBot, items: JsonObject[]): Promise<boolean> {
    let money = Number(bot.state.heroInfo?.soft_currency) || 0;

    for (let i in items) {
        const item = items[i];
        const price_hc = Number(item.price_hc) || 0;
        const price = Number(item.price) || 0;

        if (price_hc) {
            throw fail('taskMarket', 'buyAllItems', 'price_hc != 0', item);
        }

        if (money < price) {
            return false;
        }

        const json = await bot.fetchAjax({
            'class': 'Item',
            'action': 'buy',
            'id_item': String(item.id_item),
            'type': item.type,
            'who': '1',
        });

        if (!json.success) {
            throw fail('taskMarket', 'buyAllItems', json);
        }

        money = json.changes.soft_currency;

        bot.incCache({
            marketItemsBought: 1,
            marketMoneySpent: price,
        });
    }

    return true;
}

function filterExpForSale(itemsForSale: JsonObject[]): JsonObject[] {
    return itemsForSale.filter(item => item.type === 'potion');
}

function filterAffForSale(itemsForSale: JsonObject[]): JsonObject[] {
    return itemsForSale.filter(item => item.type === 'gift');
}

function parseItems(html: HtmlString): JsonObject[] {
    const items: JsonObject[] = [];

    const lotsM = html.matchAll(/<div class="slot[^>]*?" rarity="([^"]*?)" id_item="([0-9]+)" subtype="([0-9]+)"[^>]*?data-d="({[^"]*?})">/ig);

    for (let [, rarity, id, subtype, data] of lotsM) {
        const parsedData = JSON.parse(htmlspecialcharsDecode(data));

        if (!parsedData) {
            throw fail('taskMarket', 'parseItems', data);
        }

        items.push(parsedData);
    }

    return items;
}

function parseRestockIn(html: HtmlString): number {
    return Number(m(html, /New stock in: <span rel="count" time="([0-9]+)">/i)) || 0;
}
