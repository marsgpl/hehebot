import fs from 'fs/promises';

import fail from '../helpers/fail.js';
import sleep from '../helpers/sleep.js';
import formatMoney from '../helpers/formatMoney.js';
import { Browser, FormData, stringifyFormData } from './Browser.js';
import { CookieJar, CookieJarCookies } from './CookieJar.js';

import taskStory from '../tasks/taskStory.js';
import taskClubFight from '../tasks/taskClubFight.js';
import taskMarketBuy from '../tasks/taskMarketBuy.js';
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

export type JsonObject = {[key: string]: any};
export type HtmlString = string;

export const TASK_STORY = 'Story';
export const TASK_CLUB_FIGHT = 'ClubFight';
export const TASK_FETCH_HOME = 'FetchHome';
export const TASK_ACTIVITIES = 'Activities';
export const TASK_MARKET_BUY = 'MarketBuy';
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
export const TASK_NOTHING = 'nothing';

type Task = [TaskName, string, number];

type TaskName =
    typeof TASK_FETCH_HOME |
    typeof TASK_ACTIVITIES |
    typeof TASK_CLUB_FIGHT |
    typeof TASK_MARKET_BUY |
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
    typeof TASK_STORY;

const AGE_VERIFICATION_COOKIE = 'age_verification';

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';
export const SLEEP_AFTER_EVERY_REQUEST_MS = 2000;
const COMMUNICATION_ERROR_RETRY_TIMEOUT = 3000;

const HEHE_HOST = 'www.hentaiheroes.com';
const HEHE_BASE_URL = `https://${HEHE_HOST}`;
const HEHE_AJAX_URL = `${HEHE_BASE_URL}/ajax.php`;
const HEHE_PHOENIX_AJAX_URL = `${HEHE_BASE_URL}/phoenix-ajax.php`;
export const HEHE_HOME_URL = `${HEHE_BASE_URL}/home.html`;

export interface HeheBotConfig {
    login: string;
    password: string;
    cacheFile?: string;
    debug?: boolean;
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
}

export interface HeheBotNextTaskInfo {
    name: TaskName | typeof TASK_NOTHING;
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
    seasonError?: any;
    serverDate?: Date;
    timeDeltaMs?: number;
    storyBlocked?: JsonObject;
}

export class HeheBot {
    protected lastSoftError?: string;
    protected cookieJar: CookieJar;
    protected browser: Browser;
    protected tasks: Task[] = [];
    protected currentTask?: Task;
    public cache: HeheBotCache = {};
    public state: HeheBotState = {};

    constructor(protected config: HeheBotConfig) {
        this.cookieJar = new CookieJar({
            loadCookies: async () => {
                if (this.config.debug) {
                    return this.cache.cookies || {};
                } else {
                    // production: reset cookies on every bot restart
                    // because game itself messes up it's state if it
                    // accessed from several devices
                    // so we ensure bot stability by reloginning
                    return {};
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
            onRequestSuccess: async () => {
                this.cache.lastRequestTs = Date.now(); // saved by next incCache
                await this.incCache({ requests: 1 });
                await sleep(SLEEP_AFTER_EVERY_REQUEST_MS);
            },
            onNetworkError: async (error, retryIn) => {
                this.lastSoftError = fail(
                    'onNetworkError',
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
            const [name,, whenTs] = this.tasks[0] || [];

            if (!name) {
                break;
            }

            if (nowTs < whenTs) {
                const delayMs = whenTs - nowTs;
                return setTimeout(this.runTasks, delayMs);
            }

            this.currentTask = this.tasks.shift();

            await this.runTask(name);
        }
    }

    protected async runTask(name: TaskName) {
        switch (name) {
            case TASK_STORY: return taskStory(this);
            case TASK_FETCH_HOME: return taskFetchHome(this);
            case TASK_ACTIVITIES: return taskActivities(this);
            case TASK_CLUB_FIGHT: return taskClubFight(this);
            case TASK_MARKET_BUY: return taskMarketBuy(this);
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
            default: throw `Unknown task: ${name}`;
        }
    }

    public pushTask(name: TaskName, reason: string, when?: Date) {
        const whenTs = when ? when.getTime() : Date.now();
        const task: Task = [name, reason, whenTs];
        const prevTask = this.tasks.find(task => task[0] === name);

        if (prevTask) {
            if (prevTask[2] < task[2]) {
                task[1] = prevTask[1];
                task[2] = Math.min(task[2], prevTask[2]);
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

    public pushTaskIn(name: TaskName, reason: string, startIn: number) {
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

        this.pushTask(name, reason, when);
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
            this.lastSoftError = fail('loadCache', error);
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
                name: TASK_NOTHING,
                reason: 'no',
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

    public exportMetrics(): HeheBotMetrics {
        const { cache, state } = this;

        const pack = (data: JsonObject) => {
            const result: string[] = [];
            Object.keys(data).forEach(key => result.push(`${key}: ${data[key] || 0}`));
            return result.join(', ');
        }

        const metrics: HeheBotMetrics = {
            'Player': !state.heroInfo?.Name ? '' :
                `${state.heroInfo?.Name} (${state.heroEnergies?.hero_level})`,
            'Salary': this.getSalaryEstimate(),
            'Salary collected': formatMoney(cache.salaryCollected || 0),
            'Missions': pack({
                done: cache.missionsCompleted,
                gifts: cache.missionsFinalGifts,
            }),
            'Story steps': cache.storyStepsDone || 0,
            'Troll fights': cache.trollFights || 0,
            'Season fights': pack({
                win: cache.seasonFightWins,
                lose: cache.seasonFightLoses,
            }),
            'Tower fights': pack({
                win: cache.towerWins,
                lose: cache.towerLosses,
            }),
            'Contest rewards': cache.contestRewardsClaimed || 0,
            'Daily rewards': pack({
                daily: cache.dailyRewardLootClaims,
                pachinko: cache.freeDailyPachinkoOpened,
            }),
            'Season rewards': pack({
                free: cache.seasonFreeRewardsClaimed,
                pass: cache.seasonPassRewardsClaimed,
            }),
            'Path rewards': pack({
                free: cache.pathEventFreeRewardsClaimed,
                premium: cache.pathEventPremiumRewardsClaimed,
            }),
            'Tower rewards': cache.towerLeagueRewardsClaimed || 0,
        };

        if (state.storyBlocked) {
            metrics['Story blocked'] = state.storyBlocked;
        }

        if (state.seasonError) {
            metrics['Season error'] = state.seasonError;
        }

        return metrics;
    }

    public exportDebugInfo(): HeheBotMetrics {
        return {
            lastSoftError: this.lastSoftError,
            currentTask: this.currentTask ? this.currentTask[0] : TASK_NOTHING,
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
                return JSON.parse(json);
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
