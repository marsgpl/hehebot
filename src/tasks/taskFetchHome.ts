import {
    HeheBot,
    JsonObject,
    HtmlString,
    HeheBotState,
    TASK_STORY,
    TASK_ACTIVITIES,
    TASK_MARKET,
    TASK_FIGHT_TROLL,
    TASK_SEASON_FIGHT,
    TASK_COLLECT_SALARIES,
    TASK_CLAIM_DAILY_REWARD,
    TASK_OPEN_DAILY_FREE_PACHINKO,
    TASK_CLUB_CHAD,
    TASK_SEASON_CLAIM_REWARD,
    TASK_TOWER_FIGHT,
    TASK_CHAMPIONS_FIGHT,
    TASK_PATH_EVENT_CLAIM_REWARD,
    TASK_TOWER_CLAIM_LEAGUE_REWARD,
    TASK_FETCH_HOME,
    TASK_DOWNLOAD_IMAGES,
} from '../class/HeheBot.js';
import fail from '../helpers/fail.js';
import { m, mj } from '../helpers/m.js';

const TASK_NOTE = 'cycle';

function parseSeasonRewards(html: HtmlString, state: HeheBotState): JsonObject[] {
    const { seasonId, seasonMojo } = state;

    const seasonRewards: JsonObject[] = [];

    if (!seasonId) {
        return seasonRewards;
    }

    const tierM = html.matchAll(/tier\['(.*?)'\] = '(.*?)';/gi);

    let tier: JsonObject = {};

    for (const [, key, value] of tierM) {
        if (key === 'id_season' && tier.id_season) {
            seasonRewards.push(tier);
            tier = {};
        }

        tier[key] = Number(value);
    }

    if (tier.id_season) {
        seasonRewards.push(tier);
    }

    if (!seasonRewards.length) {
        throw fail('parseSeasonRewards', 'empty');
    }

    seasonRewards.forEach(tier => {
        if (
            tier.tier === undefined ||
            tier.mojo_required === undefined ||
            tier.free_reward_picked === undefined ||
            tier.pass_reward_picked === undefined
        ) {
            throw fail('parseSeasonRewards', 'bad tier', tier);
        }

        tier.rewardClaimable = tier.mojo_required <= seasonMojo!;
    });

    return seasonRewards;
}

async function serveNewbieAcc(bot: HeheBot, html: HtmlString, heroInfo: JsonObject) {
    let currentQuestId = m(heroInfo.questing?.current_url || '', /\/(\d+)$/);

    if (!currentQuestId) {
        throw fail('serveNewbieAcc', 'currentQuestId is null', heroInfo);
    }

    while (true) {
        const json = await bot.fetchAjax({
            'class': 'Quest',
            'action': 'next',
            'id_quest': currentQuestId,
        });

        let err = json.error || json.error_message;

        if (!json.success) {
            if (err?.match(/have the wanted item/i)) {
                return;
            } else if (err?.match(/have enough energy/i)) {
                return;
            } else if (err?.match(/have enough money/i)) {
                return;
            } else {
                throw fail('taskStory', json);
            }
        }

        await bot.incCache({ storyStepsDone: 1 });

        const isEnded = json.next_step?.ended;

        currentQuestId = String(json.next_step?.id_quest || '');

        if (isEnded) {
            return;
        }

        if (!currentQuestId) {
            throw fail('taskStory', 'currentQuestId', json);
        }
    }
}

export default async function taskFetchHome(bot: HeheBot) {
    const html = await bot.fetchHtml('/home.html');

    const girls: JsonObject = {};
    try {
        const girlsM = html.matchAll(/girlsDataList\[.*?([0-9]+).*?\] = (\{.*?\});/ig);
        for (const [, girlId, girl] of girlsM) {
            girls[girlId] = JSON.parse(girl);
        }
    } catch (error) {
        throw fail('taskFetchHome', 'girls');
    }

    const canCollectSalarySum = Number(m(html, /Collect\s*<span\s*class=.sum.\s*amount=.([0-9]+).>/) || 0);

    const heroInfo = mj(html, /Hero\.infos = (\{.*?\});/i);
    if (!heroInfo?.id) throw fail('taskFetchHome', 'heroInfo');

    if (html.match(/Q\.steps/i)) {
        await serveNewbieAcc(bot, html, heroInfo);
        return bot.pushTask(TASK_FETCH_HOME, TASK_NOTE);
    }

    const memberInfo = mj(html, /memberInfo = (\{.*?\});/i);
    if (!memberInfo?.Name) throw fail('taskFetchHome', 'memberInfo');

    const heroEnergies = mj(html, /Hero\.energies = (\{.*?\});/i);
    if (!heroEnergies?.quest) throw fail('taskFetchHome', 'heroEnergies');

    const notificationData = mj(html, /notificationData = (\{.*?\});/i);
    if (!notificationData?.activities) throw fail('taskFetchHome', 'notificationData');

    const missions_datas = mj(html, /missions_datas = (\{.*?\});/i) || {};

    const serverTs = Number(m(html, /server_now_ts = ([0-9]+)/i));
    if (isNaN(serverTs) || !serverTs) throw fail('taskFetchHome', 'serverTs');

    const seasonId = Number(m(html, /season_season_id = '([0-9]+)'/i));
    const seasonMojo = Number(m(html, /season_mojo_s = '([0-9]+)'/i)) || 0;
    const seasonHasPass = Boolean(Number(m(html, /season_has_pass = '([0-9]+)'/i)));

    const champTimer = Number(m(html, /<span class="champion-timer".*?timer="([0-9]+)">/i));
    const champAvailIn = champTimer ? champTimer - serverTs : NaN;

    const sideQuestsAvailable = Boolean(html.match(/(side\-quests\.html)/i));

    bot.setStateMultiple({
        canCollectSalarySum,
        girls,
        memberInfo,
        heroInfo,
        heroEnergies,
        notificationData,
        missions_datas,
        seasonId,
        seasonMojo,
        seasonHasPass,
        champAvailIn,
        sideQuestsAvailable,
        serverDate: new Date(serverTs * 1000),
        timeDeltaMs: !bot.cache.lastRequestTs ? 0 : bot.cache.lastRequestTs - serverTs * 1000,
    });

    bot.state.seasonRewards = parseSeasonRewards(html, bot.state);

    if (bot.config.onlyDownloadImages) {
        bot.pushTask(TASK_DOWNLOAD_IMAGES, TASK_NOTE);
    } else {
        bot.pushTask(TASK_CLAIM_DAILY_REWARD, TASK_NOTE);
        // bot.pushTask(TASK_OPEN_DAILY_FREE_PACHINKO, TASK_NOTE);
        bot.pushTask(TASK_TOWER_CLAIM_LEAGUE_REWARD, TASK_NOTE);
        bot.pushTask(TASK_PATH_EVENT_CLAIM_REWARD, TASK_NOTE);
        bot.pushTask(TASK_SEASON_CLAIM_REWARD, TASK_NOTE);
        bot.pushTask(TASK_ACTIVITIES, TASK_NOTE);
        bot.pushTask(TASK_CLUB_CHAD, TASK_NOTE);
        bot.pushTask(TASK_CHAMPIONS_FIGHT, TASK_NOTE);
        bot.pushTask(TASK_SEASON_FIGHT, TASK_NOTE);
        bot.pushTask(TASK_TOWER_FIGHT, TASK_NOTE);
        bot.pushTask(TASK_COLLECT_SALARIES, TASK_NOTE);
        bot.pushTask(TASK_FIGHT_TROLL, TASK_NOTE);
        bot.pushTask(TASK_STORY, TASK_NOTE);
        // bot.pushTask(TASK_MARKET, TASK_NOTE, null, {isForced: true});
        bot.pushTask(TASK_MARKET, TASK_NOTE);

        bot.pushTaskIn(TASK_FETCH_HOME, TASK_NOTE, 15 * 60);
    }
}
