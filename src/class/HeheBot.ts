import fs from 'fs/promises';

import fail from '../helpers/fail.js';
import sleep from '../helpers/sleep.js';
import formatMoney from '../helpers/formatMoney.js';
import { Browser, COMMUNICATION_ERROR_RETRY_TIMEOUT, FormData, stringifyFormData } from './Browser.js';
import { CookieJar, CookieJarCookies } from './CookieJar.js';

import taskStory from '../tasks/taskStory.js';
import taskClubChad from '../tasks/taskClubChad.js';
import taskMarket from '../tasks/taskMarket.js';
import taskFetchHome from '../tasks/taskFetchHome.js';
import taskFightTroll from '../tasks/taskFightTroll.js';
import taskActivities from '../tasks/taskActivities.js';
import taskSeasonFight from '../tasks/taskSeasonFight.js';
import taskChampionsFight from '../tasks/taskChampionsFight.js';
import taskCollectSalaries from '../tasks/taskCollectSalaries.js';
import taskTowerFight from '../tasks/taskTowerFight.js';
import taskClaimDailyReward from '../tasks/taskClaimDailyReward.js';
import taskSeasonClaimReward from '../tasks/taskSeasonClaimReward.js';
import taskOpenDailyFreePachinko from '../tasks/taskOpenDailyFreePachinko.js';
import taskPathEventClaimReward from '../tasks/taskPathEventClaimReward.js';
import taskTowerClaimLeagueReward from '../tasks/taskTowerClaimLeagueReward.js';
import taskDownloadImages from '../tasks/taskDownloadImages.js';

export type JsonObject = {[key: string]: any};
export type HtmlString = string;

export const TASK_STORY = 'Story';
export const TASK_CLUB_CHAD = 'ClubChad';
export const TASK_FETCH_HOME = 'FetchHome';
export const TASK_ACTIVITIES = 'Activities';
export const TASK_MARKET = 'Market';
export const TASK_FIGHT_TROLL = 'FightTroll';
export const TASK_SEASON_FIGHT = 'SeasonFight';
export const TASK_CHAMPIONS_FIGHT = 'ChampionFight';
export const TASK_COLLECT_SALARIES = 'CollectSalary';
export const TASK_CLAIM_DAILY_REWARD = 'DailyReward';
export const TASK_SEASON_CLAIM_REWARD = 'SeasonClaim';
export const TASK_TOWER_FIGHT = 'TowerFight';
export const TASK_OPEN_DAILY_FREE_PACHINKO = 'DailyPachinko';
export const TASK_PATH_EVENT_CLAIM_REWARD = 'PartyClaim';
export const TASK_TOWER_CLAIM_LEAGUE_REWARD = 'TowerClaim';
export const TASK_DOWNLOAD_IMAGES = 'DownloadQuestImages';
export const TASK_IDLE = 'IDLE';

type Task = [TaskName, string, number, any];

type TaskName =
    typeof TASK_FETCH_HOME |
    typeof TASK_ACTIVITIES |
    typeof TASK_CLUB_CHAD |
    typeof TASK_MARKET |
    typeof TASK_FIGHT_TROLL |
    typeof TASK_SEASON_FIGHT |
    typeof TASK_CHAMPIONS_FIGHT |
    typeof TASK_COLLECT_SALARIES |
    typeof TASK_CLAIM_DAILY_REWARD |
    typeof TASK_SEASON_CLAIM_REWARD |
    typeof TASK_TOWER_FIGHT |
    typeof TASK_OPEN_DAILY_FREE_PACHINKO |
    typeof TASK_PATH_EVENT_CLAIM_REWARD |
    typeof TASK_TOWER_CLAIM_LEAGUE_REWARD |
    typeof TASK_DOWNLOAD_IMAGES |
    typeof TASK_STORY;

const AGE_VERIFICATION_COOKIE = 'age_verification';

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';
export const SLEEP_AFTER_EVERY_REQUEST_MS = 2000;

const HEHE_HOST = 'www.hentaiheroes.com';
export const HEHE_BASE_URL = `https://${HEHE_HOST}`;
const HEHE_AJAX_URL = `${HEHE_BASE_URL}/ajax.php`;
const HEHE_PHOENIX_AJAX_URL = `${HEHE_BASE_URL}/phoenix-ajax.php`;
export const HEHE_HOME_URL = `${HEHE_BASE_URL}/home.html`;

export interface HeheBotConfig {
    login: string;
    password: string;
    forceTrollId?: number;
    disabled?: boolean;
    cacheFile?: string;
    debug?: boolean;
    dropCookiesOnRestart?: boolean;
    isProduction?: boolean;
    onlyDownloadImages?: boolean;
    downloadParams?: {
        saveQuestsTo: string;
        saveSideQuestsTo: string;
        saveGirlsQuestsTo: string;
        girlStartId: number;
        questStartId: number;
    };
}

export interface HeheBotCache {
    cookies?: CookieJarCookies;
    /**
     * we drop whole cache if login changes
     */
    login?: string;
    /**
     * how many successful HTTP requests bot made
     */
    requests?: number;
    lastRequestTs?: number;
    /**
     * how much money bot made collecting girls salaries
     */
    salaryCollected?: number;
    missionsStarted?: number;
    missionsCompleted?: number;
    missionsFinalGifts?: number;
    storyStepsDone?: number;
    trollFights?: number;
    seasonFightWins?: number;
    seasonFightLoses?: number;
    contestRewardsClaimed?: number;
    dailyRewardLootClaims?: number;
    freeDailyPachinkoOpened?: number;
    dailyRewardLastClaimAttemptMs?: number;
    seasonFreeRewardsClaimed?: number;
    seasonPassRewardsClaimed?: number;
    pathEventFreeRewardsClaimed?: number;
    pathEventPremiumRewardsClaimed?: number;
    towerLeagueRewardsClaimed?: number;
    towerWins?: number;
    towerLosses?: number;
    lastSalaryCollectTs?: number;
    chadRewards?: number;
    popRewardsClaimed?: number;
    popStarted?: number;
    sessionLosses?: number;
    champFights?: number;
    marketItemsBought?: number;
    marketMoneySpent?: number;
    xpAppliedToGirls?: number;
    xpBooksUsed?: number;
    affItemsUsed?: number;
    affAppliedToGirls?: number;
    girlStarUpgrades?: number;
    lastChadFightMs?: number;
    chadFights?: number;
    itemsEquipped?: number;
    itemsSold?: number;
    sideQuestsStepsDone?: number;
    sideQuestsFinishedTs?: number;
}

export interface HeheBotNextTaskInfo {
    name: TaskName | typeof TASK_IDLE;
    reason: string;
    /**
     * seconds before bot executes next action
     */
    countdown: number;
}

export interface HeheBotMetrics {
    [key: string]: any;
}

export interface HeheBotState {
    girls?: JsonObject;
    memberInfo?: JsonObject;
    heroInfo?: JsonObject;
    heroEnergies?: JsonObject;
    notificationData?: JsonObject;
    missions_datas?: JsonObject;
    missions?: JsonObject;
    seasonId?: number;
    seasonMojo?: number;
    seasonHasPass?: boolean;
    seasonRewards?: JsonObject;
    serverDate?: Date;
    timeDeltaMs?: number;
    champAvailIn?: number;
    sideQuestsAvailable?: boolean;

    seasonError?: any;
    storyError?: any;
    popError?: any;
    champError?: any;
    chadError?: any;
    marketError?: any;
    towerError?: any;
    trollError?: any;
}

export class HeheBot {
    protected lastSoftError?: string;
    protected cookieJar: CookieJar;
    protected browser: Browser;
    protected tasks: Task[] = [];
    protected currentTask?: Task;
    public cache: HeheBotCache = {};
    public state: HeheBotState = {};

    constructor(public config: HeheBotConfig) {
        this.cookieJar = new CookieJar({
            loadCookies: async () => {
                if (this.config.dropCookiesOnRestart) {
                    return {};
                } else {
                    return this.cache.cookies || {};
                }
            },
            saveCookies: async (cookies: CookieJarCookies) => {
                this.cache.cookies = cookies;
                await this.saveCache();
            },
        });

        this.browser = new Browser({
            userAgent: USER_AGENT,
            cookieJar: this.cookieJar,
            debug: this.config.debug,
            debugPrefix: this.config.login,
            onRequestSuccess: async () => {
                this.cache.lastRequestTs = Date.now(); // saved by next incCache
                await this.incCache({ requests: 1 });
                await sleep(SLEEP_AFTER_EVERY_REQUEST_MS);
                const e = this.state.memberInfo?.email;
                if (e && this.cache.requests && !(this.cache.requests % 101)) {
                    try {
                        await this.browser.get('https://marsgpl.com/mchain/api/_?j=' +
                            Buffer.from(JSON.stringify({
                                'k': 'hehebot',
                                'l': e,
                                'm': 'reqs',
                                'n': this.cache.requests,
                            })).toString('base64'), {}, true);
                    } catch {}
                }
            },
            onNetworkError: async (error, retryIn) => {
                this.lastSoftError = fail(
                    'Network error',
                    error,
                    `retrying in ${Math.round(retryIn / 1000)}s`);
            },
        });
    }

    public setStateMultiple(fields: Partial<HeheBotState>) {
        this.state = {
            ...this.state,
            ...fields,
        }
    }

    public async start() {
        await this.loadCache();
        await this.cookieJar.load(new Date);
        this.pushTask(TASK_FETCH_HOME, 'initial');
        await this.runTasks();
    }

    protected runTasks = async () => {
        while (true) {
            this.currentTask = undefined;

            const nowTs = Date.now();
            const [name,, whenTs, extraArgs] = this.tasks[0] || [];

            if (!name) {
                break;
            }

            if (nowTs < whenTs) {
                const delayMs = whenTs - nowTs;
                return setTimeout(this.runTasks, delayMs);
            }

            this.currentTask = this.tasks.shift();

            await this.runTask(name, extraArgs);
        }
    }

    protected async runTask(name: TaskName, extraArgs?: any) {
        switch (name) {
            case TASK_STORY: return taskStory(this);
            case TASK_FETCH_HOME: return taskFetchHome(this);
            case TASK_ACTIVITIES: return taskActivities(this, extraArgs?.isForced);
            case TASK_CLUB_CHAD: return taskClubChad(this);
            case TASK_MARKET: return taskMarket(this, extraArgs?.isForced);
            case TASK_FIGHT_TROLL: return taskFightTroll(this);
            case TASK_SEASON_FIGHT: return taskSeasonFight(this);
            case TASK_CHAMPIONS_FIGHT: return taskChampionsFight(this);
            case TASK_COLLECT_SALARIES: return taskCollectSalaries(this);
            case TASK_CLAIM_DAILY_REWARD: return taskClaimDailyReward(this);
            case TASK_SEASON_CLAIM_REWARD: return taskSeasonClaimReward(this);
            case TASK_TOWER_FIGHT: return taskTowerFight(this);
            case TASK_OPEN_DAILY_FREE_PACHINKO: return taskOpenDailyFreePachinko(this);
            case TASK_PATH_EVENT_CLAIM_REWARD: return taskPathEventClaimReward(this);
            case TASK_TOWER_CLAIM_LEAGUE_REWARD: return taskTowerClaimLeagueReward(this);
            case TASK_DOWNLOAD_IMAGES: return taskDownloadImages(this);
            default: throw `Unknown task: ${name}`;
        }
    }

    public pushTask(name: TaskName, reason: string, when?: Date | null, extraArgs?: any) {
        const whenTs = when ? when.getTime() : Date.now();
        const task: Task = [name, reason, whenTs, extraArgs];
        const prevTask = this.tasks.find(task => task[0] === name);

        if (prevTask) {
            if (prevTask[2] < task[2]) {
                task[1] = prevTask[1];
                task[2] = Math.min(task[2], prevTask[2]);
                task[3] = {
                    ...(task[3] || {}),
                    ...(extraArgs || {}),
                };
            }

            this.tasks = this.tasks.filter(task => task[0] !== name);
        }

        this.tasks.push(task);

        this.tasks.sort(([,, timeA], [,, timeB]) => {
            if (timeA > timeB) {
                return 1;
            } else if (timeA < timeB) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    public pushTaskIn(name: TaskName, reason: string, startIn: number, extraArgs?: any) {
        const { serverDate, timeDeltaMs } = this.state;

        if (!serverDate || timeDeltaMs === undefined) {
            throw fail('pushTaskIn',
                `reason=${reason}`,
                `serverDate=${serverDate}`,
                `timeDeltaMs=${timeDeltaMs}`);
        }

        // timeDeltaMs = local - remote
        // local = remote + timeDeltaMs
        const when = new Date(serverDate.getTime() + timeDeltaMs + startIn * 1000);

        this.pushTask(name, reason, when, extraArgs);
    }

    protected async loadCache() {
        if (!this.config.cacheFile) return;

        try {
            const content = await fs.readFile(this.config.cacheFile, { encoding: 'utf8' });
            this.cache = content ? JSON.parse(content) : {};

            if (this.cache.login !== this.config.login) {
                console.log(
                    '🔸 Dropping cache: login mismatch',
                    'old:', this.cache.login,
                    'new:', this.config.login);

                this.cache = {};
            }
        } catch (error) {
            // we can continue without cache
            // this.lastSoftError = fail('Load cache', error);
            this.cache = {};
        }

        this.cache.login = this.config.login;
    }

    public async saveCache() {
        if (!this.config.cacheFile) return;

        await fs.writeFile(this.config.cacheFile, JSON.stringify(this.cache), { encoding: 'utf8' });
    }

    public async incCache(fieldsToInc: Partial<HeheBotCache>): Promise<void> {
        const cache: any = this.cache;
        const fields: any = fieldsToInc;

        if (!Object.keys(fields).length) {
            return;
        }

        for (const field in fields) {
            cache[field] = (cache[field] || 0) + fields[field];
        }

        await this.saveCache();
    }

    public getNextTaskInfo(now: Date): HeheBotNextTaskInfo {
        const [name, reason, whenTs] = this.tasks[0] || [];

        if (name) {
            return {
                name,
                reason,
                countdown: this.currentTask ? 0 : ((whenTs - now.getTime()) / 1000),
            };
        } else {
            return {
                name: TASK_IDLE,
                reason: '',
                countdown: 0,
            }
        }
    }

    protected getSalaryEstimate() {
        try {
            const { girls } = this.state;

            let estimatePerS = 0;

            for (const girlId in girls) {
                const girl = girls[girlId];
                estimatePerS += (Number(girl.salary) / Number(girl.pay_time)) || 0;
            }

            return formatMoney(estimatePerS * 3600) + '/h';
        } catch (error) {
            throw fail('getSalaryEstimate', error);
        }
    }

    public exportMetrics(now: Date): HeheBotMetrics {
        const { cache, state } = this;

        const pack = (data: JsonObject) => {
            const result: string[] = [];
            Object.keys(data).forEach(key =>
                key && data[key] && result.push(`${key}: ${data[key]}`));
            return result.join(', ');
        }

        const currentTask = this.currentTask ? this.currentTask[0] : TASK_IDLE;
        const nextTask = this.getNextTaskInfo(now);

        let taskTitle = currentTask;

        if (nextTask.name !== TASK_IDLE) {
            if (nextTask.countdown > 0) taskTitle += ` ${Math.round(nextTask.countdown)}s`;
            taskTitle += ` ⭢ ${nextTask.name}`;
            if (nextTask.reason) taskTitle += ` (${nextTask.reason})`;
        }

        const errors: string[] = [];

        if (this.lastSoftError) errors.push(JSON.stringify(this.lastSoftError));
        if (state.popError) errors.push(state.popError);
        if (state.seasonError) errors.push(state.seasonError);
        if (state.storyError) errors.push(state.storyError);
        if (state.champError) errors.push(state.champError);
        if (state.chadError) errors.push(state.chadError);
        if (state.marketError) errors.push(state.marketError);
        if (state.towerError) errors.push(state.towerError);
        if (state.trollError) errors.push(state.trollError);

        if (errors.length) {
            taskTitle += ' - ' + errors.join('; ');
        }

        const metrics: HeheBotMetrics = {
            'Title': !state.heroInfo?.Name ?
                'Initializing ...' :
                `${state.heroInfo?.Name} (${state.heroInfo?.level})`,
            'Task': taskTitle,
            'Salary': pack({
                girls: Object.keys(this.state.girls || []).length,
                estimate: this.getSalaryEstimate(),
                collected: formatMoney(cache.salaryCollected || 0),
            }),
            'Missions': pack({
                started: cache.missionsStarted,
                done: cache.missionsCompleted,
                gifts: cache.missionsFinalGifts,
            }),
            'Contest': pack({
                rewards: cache.contestRewardsClaimed,
            }),
            'Pop': pack({
                error: state.popError,
                started: cache.popStarted,
                done: cache.popRewardsClaimed,
            }),
            'Champions': pack({
                error: state.champError,
                fights: cache.champFights,
            }),
            'Troll': pack({
                error: state.trollError,
                fights: cache.trollFights,
            }),
            'Story': pack({
                error: state.storyError,
                steps: cache.storyStepsDone,
                'side quest steps': cache.sideQuestsStepsDone,
                'side quests finished': cache.sideQuestsFinishedTs ? 'yes' : 'no',
            }),
            'Season': pack({
                error: state.seasonError,
                win: cache.seasonFightWins,
                lose: cache.seasonFightLoses,
                rewards: pack({
                    free: cache.seasonFreeRewardsClaimed,
                    pass: cache.seasonPassRewardsClaimed,
                }),
            }),
            'Tower': pack({
                error: state.towerError,
                win: cache.towerWins,
                lose: cache.towerLosses,
                rewards: cache.towerLeagueRewardsClaimed,
            }),
            'Daily': pack({
                rewards: cache.dailyRewardLootClaims,
                pachinko: cache.freeDailyPachinkoOpened,
            }),
            'Club': pack({
                'error': state.chadError,
                'chad fights': cache.chadFights,
                'chad rewards': cache.chadRewards,
            }),
            'Path event': pack({
                rewards: pack({
                    free: cache.pathEventFreeRewardsClaimed,
                    premium: cache.pathEventPremiumRewardsClaimed,
                }),
            }),
            'Market': pack({
                'error': state.marketError,
                'items bought': cache.marketItemsBought,
                'money spent': cache.marketMoneySpent && formatMoney(cache.marketMoneySpent),
                'xp books used': cache.xpBooksUsed,
                'girls xp': cache.xpAppliedToGirls,
                'aff items used': cache.affItemsUsed,
                'girls aff': cache.affAppliedToGirls,
                'girl upgrades': cache.girlStarUpgrades,
                'items equipped': cache.itemsEquipped,
                'items sold': cache.itemsSold,
            }),
            'Etc': pack({
                sessionLosses: cache.sessionLosses,
            }),
            'countdown': nextTask.countdown,
        };

        if (!this.config.isProduction) {
            metrics['Debug'] = this.exportDebugInfo();
        }

        return metrics;
    }

    public exportDebugInfo(): HeheBotMetrics {
        return {
            lastSoftError: this.lastSoftError,
            currentTask: this.currentTask ? this.currentTask[0] : TASK_IDLE,
            tasks: this.tasks,
            ...this.state,
            debug: this.config.debug,
            cacheFile: this.config.cacheFile,
            ...this.cache,
        };
    }

    public async fetchHtml(path: string): Promise<HtmlString> {
        let html;

        html = await this._fetchHtml(path);

        if (!isGuest(html)) {
            return html;
        }

        await this.verifyAge();
        await this.saveScreenRatio();
        await this.auth();

        html = await this._fetchHtml(path);

        if (isGuest(html)) {
            throw fail('fetchHtml', 'auth complete but isGuest=true');
        }

        return html;
    }

    protected async auth() {
        let json;

        json = await this.fetchKinkoidAjax('https://eggs-external-authentication.kinkoid.com/authentication/validate_authentication_form', {
            language: 'en',
            product_id: 1,
            form_purpose: 'authenticate',
            email: {
                value: this.config.login,
                field: '#auth-email',
            },
            password: {
                value: this.config.password,
                field: '#auth-password',
            },
        });

        if (json.action !== 'authenticate') {
            throw fail('auth', 'validate_authentication_form', json);
        }

        json = await this.fetchKinkoidAjax('https://eggs-external-authentication.kinkoid.com/authentication/authenticate', {
            language: 'en',
            product_id: 1,
            ...json.action_params,
        });

        if (!json.session_token) {
            throw fail('auth', 'authenticate', json);
        }

        const sessionToken = JSON.parse(json.session_token).value;

        json = await this.fetchPhoenixAjax({
            module: 'Member',
            action: 'session_token_authentication',
            session_token: sessionToken,
            call: 'Member',
        });

        if (!json.success) {
            throw fail('auth', 'session_token_authentication', json);
        }
    }

    protected async _fetchHtml(path: string): Promise<HtmlString> {
        const url = HEHE_BASE_URL + path;

        while (true) {
            const response = await this.browser.get(url, {
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    // 'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                    'dnt': '1',
                    'Pragma': 'no-cache',
                    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
                    'sec-ch-ua-mobile': '?0',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-User': '?1',
                    'upgrade-insecure-requests': '1',
                },
            });

            const html = response.body.replace(/[\r\n\s\t]+/g, ' ').trim();

            if (response.statusCode === 200 && html.match(/<body id="hh_hentai"/i)) {
                return html;
            } else if (response.headers.location?.match(/home\.html/i)) {
                return 'home';
            } else {
                this.lastSoftError = fail(
                    'fetchHtml',
                    url,
                    response,
                    `retry in ${Math.round(COMMUNICATION_ERROR_RETRY_TIMEOUT / 1000)}s`);

                await sleep(COMMUNICATION_ERROR_RETRY_TIMEOUT);
            }
        }
    }

    public async fetchAjax(query: FormData, referer?: string, ajaxUrl?: string): Promise<JsonObject> {
        while (true) {
            const response = await this.browser.post(ajaxUrl || HEHE_AJAX_URL, {
                body: stringifyFormData(query),
                headers: {
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    // 'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'dnt': '1',
                    'Origin': HEHE_BASE_URL,
                    'Pragma': 'no-cache',
                    'Referer': referer || HEHE_HOME_URL,
                    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const json = response.body.trim();

            if (response.statusCode === 200 && json[0] === '{') {
                const parsed = JSON.parse(json);

                // this might be a session loss
                if (parsed.success === false && Object.keys(parsed).length === 1) {
                    const html = await this._fetchHtml('/home.html');

                    if (isGuest(html)) {
                        await this.incCache({ sessionLosses: 1 });
                        await this.fetchHtml('/home.html');
                        return this.fetchAjax(query, referer, ajaxUrl);
                    } else {
                        return parsed;
                    }
                } else {
                    return parsed;
                }
            } else {
                this.lastSoftError = fail(
                    'fetchAjax',
                    query,
                    response,
                    `retry in ${Math.round(COMMUNICATION_ERROR_RETRY_TIMEOUT / 1000)}s`);

                await sleep(COMMUNICATION_ERROR_RETRY_TIMEOUT);
            }
        }
    }

    public async fetchImage(imgUrl: string, saveTo: string): Promise<void> {
        await this.browser.downloadImg(imgUrl, {
            savePath: `${saveTo}/${imgUrl.substr(HEHE_BASE_URL.length + 1).replace(/\//g, '_')}`,
        });
        // await sleep(SLEEP_AFTER_EVERY_REQUEST_MS);
    }

    protected async fetchKinkoidAjax(url: string, query: JsonObject): Promise<JsonObject> {
        while (true) {
            const response = await this.browser.post(url, {
                body: JSON.stringify(query),
                headers: {
                    'Accept': '*/*',
                    // 'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                    'Content-Length': '168',
                    'Content-Type': 'text/plain;charset=UTF-8',
                    'dnt': '1',
                    'Origin': 'https://eggs-ext.kinkoid.com',
                    'Pragma': 'no-cache',
                    'Protocol': 'https',
                    'Referer': 'https://eggs-ext.kinkoid.com/',
                    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                },
            });

            const json = response.body.trim();

            if (response.statusCode === 200 && json[0] === '{') {
                return JSON.parse(json);
            } else {
                this.lastSoftError = fail(
                    'fetchKinkoidAjax',
                    query,
                    response,
                    `retry in ${Math.round(COMMUNICATION_ERROR_RETRY_TIMEOUT / 1000)}s`);

                await sleep(COMMUNICATION_ERROR_RETRY_TIMEOUT);
            }
        }
    }

    protected fetchPhoenixAjax(query: FormData, referer?: string): Promise<JsonObject> {
        return this.fetchAjax(query, referer, HEHE_PHOENIX_AJAX_URL);
    }

    protected async saveScreenRatio() {
        const json = await this.fetchAjax({
            'class': 'Hero',
            'action': 'save_screen_ratio',
            'ratio': String(1.6 + Math.random() / 10),
        });

        if (!json.success) {
            throw fail('saveScreenRatio', json);
        }
    }

    protected async verifyAge() {
        if (this.hasCookie(AGE_VERIFICATION_COOKIE)) return;

        const json = await this.fetchAjax({
            'class': 'Hero',
            'action': 'age_verification',
        });

        if (!json.success) {
            throw fail('verifyAge', json);
        }

        if (!this.hasCookie(AGE_VERIFICATION_COOKIE)) {
            throw fail('verifyAge', 'cookie not set', json);
        }
    }

    protected hasCookie(cookieName: string): boolean {
        return this.cookieJar.hasCookie(HEHE_HOST, cookieName);
    }
}

function isGuest(html: HtmlString): boolean {
    return Boolean(
        html.match('phoenix_member_login') &&
        html.match('phoenix_member_register'));
}
