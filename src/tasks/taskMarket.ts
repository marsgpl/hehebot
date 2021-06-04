import fail from '../helpers/fail.js';
import { HeheBot, HtmlString, JsonObject, TASK_FETCH_HOME, TASK_MARKET } from '../class/HeheBot.js';
import { m } from '../helpers/m.js';
import htmlspecialcharsDecode from '../helpers/htmlspecialcharsDecode.js';

const TASK_NOTE = 'market';

const AFFECTION_MAX_OVERFLOW_VALUE = 30;

export default async function taskMarket(bot: HeheBot, isForced?: boolean) {
    const haveNewGoods = bot.state.notificationData?.shop?.includes('action');

    if (!haveNewGoods && !isForced) {
        return bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, 1 * 60 * 60); // 1h
    }

    const html = await bot.fetchHtml('/shop.html');

    const restockIn = parseRestockIn(html);

    if (restockIn) {
        bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, restockIn);
    }

    const paths = findUpgradableGirlsPaths(html);

    if (paths) {
        for (const i in paths) {
            await upgradeGirl(bot, null, paths[i]);
            return bot.pushTask(TASK_MARKET, TASK_NOTE, null, {isForced: true});
        }
    }

    const items = parseItems(html);
    const girls = parseGirls(html);

    const itemsForSale = items.filter(item => !item.id_member);
    const itemsForUse = items.filter(item =>
        !!item.id_member &&
        item.count &&
        item.value &&
        item.id_m_i?.length);

    const expForSale = itemsForSale.filter(item => item.type === 'potion');
    const expForUse = itemsForUse.filter(item => item.type === 'potion');

    const affForSale = itemsForSale.filter(item => item.type === 'gift');
    const affForUse = itemsForUse.filter(item => item.type === 'gift');

    if (expForSale.length) {
        await buyAllItems(bot, expForSale);
    }

    if (affForSale.length) {
        await buyAllItems(bot, affForSale);
    }

    await applyExpToGirls(bot, girls, expForUse);
    await applyAffToGirls(bot, girls, affForUse);
}

function findUpgradableGirlsPaths(html: HtmlString): string[] {
    const paths: string[] = [];

    const pathsM = html.matchAll(/<a href="(\/quest\/[0-9]+)">Upgrade/ig);

    for (const [, path] of pathsM) {
        paths.push(path);
    }

    return paths;
}

// {"next_step":{"ended":1,"win":[["grade","25","1","Hikea","https:\/\/hh2.hh-content.com\/pictures\/girls\/25\/ico1.png","\u2605\u2606\u2606"]],"num_step":0},"changes":{"soft_currency":2347198423,"energy_quest_recharge_time":18107},"success":true}

async function upgradeGirl(bot: HeheBot, girl: JsonObject | null, questPath: string) {
    // const html = await bot.fetchHtml(questPath);

    const questId = m(questPath, /([0-9]+)/);

    const json = await bot.fetchAjax({
        'class': 'Quest',
        'action': 'next',
        'id_quest': questId,
    });

    if (!json.success) {
        throw fail('upgradeGirl', girl, questPath, json);
    }

    if (json.changes?.hard_currency !== undefined) {
        throw fail('upgradeGirl', 'girl star was upgraded for hard currency wtf? not enough soft currency?', girl, questPath, json);
    }

    await bot.incCache({
        girlStarUpgrades: 1,
    });

    bot.pushTask(TASK_MARKET, TASK_NOTE, null, {isForced: true});
}

async function applyAffToGirls(bot: HeheBot, girls: JsonObject[], affItems: JsonObject[]) {
    // value ASC
    affItems.sort((A, B) => {
        if (A.value > B.value) {
            return 1;
        } else if (A.value < B.value) {
            return -1;
        } else {
            return 0;
        }
    });

    // can_upgrade on top
    // then Affection.maxed on top
    // then Affection.left ASC
    girls.sort((A, B) => {
        if (A.can_upgrade && B.can_upgrade) {
            return 0;
        } else if (A.can_upgrade) {
            return -1;
        } else if (B.can_upgrade) {
            return 1;
        } else if (A.Affection.maxed && B.Affection.maxed) {
            return 0;
        } else if (A.Affection.maxed) {
            return 1;
        } else if (B.Affection.maxed) {
            return -1;
        } else if (A.Affection.left > B.Affection.left) {
            return 1;
        } else if (A.Affection.left < B.Affection.left) {
            return -1;
        } else {
            return 0;
        }
    });

    for (const i in girls) {
        const girl = girls[i];

        let upgradable = girl.can_upgrade;
        let needAff = girl.Affection.left;

        if (upgradable) {
            throw fail('applyAffToGirls', 'non-upgraded upgradable girl found');
        } else if (girl.Affection.maxed || needAff <= 0) {
            continue; // can't affect more
        } else {
            while (needAff > 0 && affItems.length && !upgradable) {
                let used = 0;

                for (let ii = affItems.length - 1; ii >= 0; --ii) {
                    const item = affItems[ii];

                    if (item.value - AFFECTION_MAX_OVERFLOW_VALUE > needAff) continue;
                    if (!item.id_m_i.length) continue;

                    used++;

                    // {"can_upgrade":{"upgradable":false},"affection":1510,"success":true}
                    // {"can_upgrade":{"upgradable":true,"quest":"\/quest\/1000182"},"affection":1820,"success":true}

                    const json = await bot.fetchAjax({
                        'class': 'Item',
                        'action': 'give_affection',
                        'id_m_i': item.id_m_i[item.id_m_i.length - 1],
                        'id_item': item.id_item,
                        'type': 'gift',
                        'who': girl.id,
                    });

                    if (!json.success || !json.affection) {
                        throw fail('applyAffToGirls', item, girl, json);
                    }

                    const affDelta = json.affection - girl.Affection.cur;
                    girl.Affection.cur = json.affection;

                    needAff -= affDelta;

                    if (json.can_upgrade?.upgradable) {
                        needAff = 0;
                        girl.can_upgrade = true;
                        await upgradeGirl(bot, girl, json.can_upgrade.quest);
                    }

                    bot.incCache({
                        affItemsUsed: 1,
                        affAppliedToGirls: affDelta,
                    });

                    item.id_m_i.pop();
                    item.count--;

                    if (item.count <= 0 || !item.id_m_i.length) {
                        affItems.pop();
                    }

                    break;
                }

                if (!used) break;
            }
        }
    }
}

async function applyExpToGirls(bot: HeheBot, girls: JsonObject[], expBooks: JsonObject[]) {
    // value ASC
    expBooks.sort((A, B) => {
        if (A.value > B.value) {
            return 1;
        } else if (A.value < B.value) {
            return -1;
        } else {
            return 0;
        }
    });

    while (expBooks.length && girls.length) {
        // exp ASC
        girls.sort((girlA, girlB) => {
            if (girlA.Xp.level > girlB.Xp.level) {
                return 1;
            } else if (girlA.Xp.level < girlB.Xp.level) {
                return -1;
            } else {
                return 0;
            }
        });

        const girl = girls[0]; // least experienced
        const book = expBooks[expBooks.length - 1]; // highest xp value

        if (girl.Xp.maxed) break;

        if (!book.id_m_i.length) {
            throw fail('applyExpToGirls', 'book.id_m_i.length=0', book, girl);
        }

        const json = await bot.fetchAjax({
            'class': 'Item',
            'action': 'give_xp',
            'id_m_i': book.id_m_i[book.id_m_i.length - 1],
            'id_item': book.id_item,
            'type': 'potion',
            'who': girl.id,
        });

        if (!json.success || !json.girl?.Xp) {
            throw fail('applyExpToGirls', book, girl, json);
        }

        girl.Xp = json.girl.Xp;

        bot.incCache({
            xpBooksUsed: 1,
            xpAppliedToGirls: book.value,
        });

        book.id_m_i.pop();
        book.count--;

        if (book.count <= 0 || !book.id_m_i.length) {
            expBooks.pop();
        }
    }
}

function parseGirls(html: HtmlString): JsonObject[] {
    const girls: JsonObject[] = [];

    const girlsM = html.matchAll(/<div[^>]*?id_girl="([0-9]+)"[^>]*?data-g="(\{.*?\})"/ig);

    for (const [, id, data] of girlsM) {
        const girl = JSON.parse(htmlspecialcharsDecode(data));
        girl.id = id;
        girl.idInt = Number(id);
        girls.push(girl);
    }

    return girls;
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

        if (!json.success || !json.changes) {
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

function parseItems(html: HtmlString): JsonObject[] {
    const items: JsonObject[] = [];

    const lotsM = html.matchAll(/<div class="slot[^>]*?" rarity="([^"]*?)" id_item="([0-9]+)" subtype="([0-9]+)"[^>]*?data-d="({[^"]*?})">/ig);

    for (let [, rarity, id, subtype, data] of lotsM) {
        const parsedData = JSON.parse(htmlspecialcharsDecode(data));

        if (!parsedData) {
            throw fail('taskMarket', 'parseItems', data);
        }

        parsedData.count = Number(parsedData.count);
        parsedData.value = Number(parsedData.value);

        items.push(parsedData);
    }

    return items;
}

function parseRestockIn(html: HtmlString): number {
    return Number(m(html, /New stock in: <span rel="count" time="([0-9]+)">/i)) || 0;
}
