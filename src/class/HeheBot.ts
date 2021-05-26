import fs from 'fs/promises';

import fail from '../helpers/fail.js';
import sleep from '../helpers/sleep.js';
import formatMoney from '../helpers/formatMoney.js';
import { Browser, FormData, stringifyFormData } from './Browser.js';
import { CookieJar, CookieJarCookies } from './CookieJar.js';
import taskFetchHome from '../tasks/taskFetchHome.js';
import taskCollectSalaries from '../tasks/taskCollectSalaries.js';
import taskActivities from '../tasks/taskActivities.js';

export type JsonObject = {[key: string]: any};
export type HtmlString = string;

export const TASK_NOTHING = 'nothing';
export const TASK_FETCH_HOME = 'FetchHome';
export const TASK_COLLECT_SALARIES = 'CollectSalary';
export const TASK_ACTIVITIES = 'Activities';

type TaskName = typeof TASK_FETCH_HOME |
    typeof TASK_COLLECT_SALARIES |
    typeof TASK_ACTIVITIES;
type Task = [TaskName, string, number];

const AGE_VERIFICATION_COOKIE = 'age_verification';

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';
export const SLEEP_AFTER_EVERY_REQUEST_MS = 2000;

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
    serverDate?: Date;
    timeDeltaMs?: number;
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
                this.cache.requests = (this.cache.requests || 0) + 1;
                this.cache.lastRequestTs = Date.now();
                await sleep(SLEEP_AFTER_EVERY_REQUEST_MS);
                await this.saveCache();
            },
        });
    }

    public setState(fields: Partial<HeheBotState>) {
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
            case TASK_FETCH_HOME: return taskFetchHome(this);
            case TASK_COLLECT_SALARIES: return taskCollectSalaries(this);
            case TASK_ACTIVITIES: return taskActivities(this);
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
                // we drop whole cache if login changes
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

    public getNextTaskInfo(now: Date): HeheBotNextTaskInfo {
        const [name, reason, whenTs] = this.tasks[0] || [];

        if (name) {
            return {
                name,
                reason,
                countdown: ((whenTs - now.getTime()) / 1000),
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
        return {
            'Name': this.state.heroInfo?.Name,
            'Salary': this.getSalaryEstimate(),
            'Salary collected': formatMoney(this.cache.salaryCollected || 0),
            'Missions done': this.cache.missionsCompleted || 0,
            'Missions gifts': this.cache.missionsFinalGifts || 0,
        };
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

    public async requestHtml(path: string): Promise<HtmlString> {
        let html;

        html = await this.fetchHtml(path);

        if (!isGuest(html)) {
            return html;
        }

        await this.verifyAge();
        await this.saveScreenRatio();
        await this.auth();

        html = await this.fetchHtml(path);

        if (isGuest(html)) {
            throw fail('requestHtml', 'auth complete but isGuest=true');
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

    protected async fetchKinkoidAjax(url: string, query: JsonObject): Promise<JsonObject> {
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

        if (response.statusCode !== 200) {
            throw fail('fetchKinkoidAjax', url, query, response);
        }

        return JSON.parse(response.body);
    }

    protected async fetchHtml(path: string): Promise<HtmlString> {
        const url = HEHE_BASE_URL + path;

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

        if (response.statusCode !== 200) {
            throw fail('fetchHtml', url, response);
        }

        return response.body;
    }

    protected fetchPhoenixAjax(query: FormData, referer?: string): Promise<JsonObject> {
        return this.fetchAjax(query, referer, HEHE_PHOENIX_AJAX_URL);
    }

    public async fetchAjax(query: FormData, referer?: string, ajaxUrl?: string): Promise<JsonObject> {
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

        if (response.statusCode !== 200) {
            throw fail('fetchAjax', ajaxUrl || HEHE_AJAX_URL, query, response);
        }

        return JSON.parse(response.body);
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
            class: 'Hero',
            action: 'age_verification',
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















// const WORLD_URL = `${BASE_URL}/world/`; // + worldId
// const TROLL_URL = `${BASE_URL}/battle.html?id_troll=`; // + trollId
// const ACTIVITIES_URL = `${BASE_URL}/activities.html`;






//     protected async fetchWorld(worldId: number) {
//         const html = await this.getPage(WORLD_URL + worldId);

//         const trollInfo = mj(html, /trollInfo = (\{.*?\});/i);

//         if (!trollInfo?.id_troll) {
//             // troll not found
//             return;
//         }

//         this.state.trollInfo = trollInfo;
//     }

//     protected async fetchTroll(trollId: number) {
//         const html = await this.getPage(TROLL_URL + trollId);

//         const hh_battle_players = mj(
//             html.replace(/[\n\t]/g, ' '),
//             /hh_battle_players = (\[.*?\]);/im);

//         if (!hh_battle_players?.[0] || !hh_battle_players?.[1]) {
//             throw 'hh_battle_players not found';
//         }

//         this.state.hh_battle_players = {
//             member: hh_battle_players[0],
//             troll: hh_battle_players[1],
//         };
//     }


//     protected async fightWithTroll() {
//         const worldId = Number(this.state.heroInfo?.questing?.id_world);
//         if (!worldId) throw 'worldId not found';

//         const fightEnergyCurrent = Number(this.state.heroEnergies?.fight?.amount);
//         const fightEnergyMax = Number(this.state.heroEnergies?.fight?.max_amount);
//         if (!fightEnergyMax || isNaN(fightEnergyCurrent)) throw 'fightEnergy not found';

//         // we fight with troll only if energy > 50%
//         if (fightEnergyCurrent < fightEnergyMax / 2) return;

//         await this.fetchWorld(worldId);

//         const trollId = Number(this.state.trollInfo?.id_troll);

//         if (!trollId) {
//             return;
//         }

//         await this.fetchTroll(trollId);

//         const trollInfo = this.state.hh_battle_players?.troll;
//         if (!trollInfo) throw 'trollInfo not found';

//         while (true) {
//             const success = await this._attackTroll(trollInfo);
//             if (!success) break;
//         }
//     }

//     protected async _attackTroll(trollInfo: json): Promise<boolean> {
//         const trollParams: json = {};

//         Object.keys(trollInfo).forEach(key => {
//             trollParams[`who[${key}]`] = String(trollInfo[key]);
//         });

//         const json = await this.postAjax({
//             class: 'Battle',
//             action: 'fight',
//             battles_amount: '0',
//             ...trollParams,
//         });

//         if (json.error && json.error === 'Not enough fight energy.') {
//             return false;
//         }

//         if (!json.success) {
//             throw `_attackTroll failed: ${JSON.stringify(json)}`;
//         }

//         if (json.end?.battle_won) {
//             const energyDelta = Number(json.end?.updated_infos?.energy_fight);
//             if (!energyDelta) throw '_attackTroll: energy was not spent';

//             this.cache.trollFights = (this.cache.trollFights || 0) + 1;

//             if (this.state.heroEnergies?.fight?.amount) {
//                 this.state.heroEnergies.fight.amount--;
//             }

//             await this.saveCache();

//             return true;
//         } else {
//             throw '_attackTroll: we lost the battle';
//         }
//     }

//     protected async completeDailyTasks() {
//         const { activities } = this.state.notificationData || {};
//         if (!activities) throw 'activities not found';

//         if (!activities.includes('reward') && !activities.includes('action')) {
//             // no rewards, no actions available
//             return;
//         }

//         const html = await this.getPage(ACTIVITIES_URL);

//         // missions

//         // look for collect button
//         // look for accept button
//         const accept =
//     }
