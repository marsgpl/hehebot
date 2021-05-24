import fs from 'fs/promises';

import sleep from './sleep.js';
import { Browser, compileFormData, FormData } from './Browser.js';
import { CookieJar, CookieJarCookies } from './CookieJar.js';

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';

const AGE_VERIFICATION_COOKIE = 'age_verification';

const BASE_HOST = 'www.hentaiheroes.com';
const BASE_URL = `https://${BASE_HOST}`;
const AJAX_URL = `${BASE_URL}/ajax.php`;
const PHOENIX_AJAX_URL = `${BASE_URL}/phoenix-ajax.php`;
const HOME_URL = `${BASE_URL}/home.html`;

const MIN_CYCLE_DELAY_MS = 30000;

type json = {[key: string]: any};
type html = string;

function isGuest(html: html): boolean {
    return Boolean(
        html.match('phoenix_member_login') &&
        html.match('phoenix_member_register'));
}

function m(source: string, regExp: RegExp): string {
    const m = source.match(regExp);
    return m && m[1] || '';
}

export interface HeheBotConfig {
    login: string;
    password: string;
    cache: string;
    debug?: boolean;
}

export interface HeheBotState {
    /**
     * if > 0 then local time is in future
     */
    serverDate?: Date;
    timeDeltaMs?: number;
    memberInfo?: json;
    heroInfo?: json;
    heroEnergies?: json;
    girls?: json;
    nextCycleTs?: number;
    lastQueryTs?: number;
    nextCycleDelayMs?: number;
}

export interface HeheBotCache {
    requestsN?: number;
    moneyCollected?: number;
    cookies?: CookieJarCookies;
}

export class HeheBot {
    protected cache: HeheBotCache = {}; // persistent storage
    protected state: HeheBotState = {}; // runtime storage
    protected browser: Browser;
    protected cookieJar: CookieJar;

    constructor(protected config: HeheBotConfig) {
        this.cookieJar = new CookieJar({
            load: async () => {
                return this.cache.cookies || {};
            },
            save: async (cookies: CookieJarCookies) => {
                this.cache.cookies = cookies;
                return this.saveCache();
            },
        });

        this.browser = new Browser({
            userAgent: USER_AGENT,
            cookieJar: this.cookieJar,
            debug: this.config.debug,
            onRequest: async () => {
                this.cache.requestsN = (this.cache.requestsN || 0) + 1;
                this.state.lastQueryTs = Date.now();
                await this.saveCache();
            },
        });
    }

    protected async loadCache(): Promise<void> {
        try {
            this.cache = JSON.parse(await fs.readFile(this.config.cache, { encoding: 'utf8' }));
        } catch (error) {
            console.log('🔸 loadCache fail:', error);
            this.cache = {};
        }
    }

    protected async saveCache(): Promise<boolean> {
        await fs.writeFile(this.config.cache, JSON.stringify(this.cache), { encoding: 'utf8' });
        return true;
    }

    protected hasCookie(cookieName: string): boolean {
        return this.cookieJar.hasCookie(BASE_HOST, cookieName);
    }

    protected async getPage(page: string): Promise<html> {
        let html: string;

        html = await this._getPageRaw(page);

        if (!isGuest(html)) {
            return html;
        }

        await this.auth();

        html = await this._getPageRaw(page);

        if (isGuest(html)) {
            throw `auth complete but page '${page}' still says we are guest`;
        }

        return html;
    }

    protected async auth() {
        await this.saveScreenRatio();

        let json;

        json = await this.postKinkoid('https://eggs-external-authentication.kinkoid.com/authentication/validate_authentication_form', {
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
            throw `kinkoid validate_authentication_form failed: ${JSON.stringify(json)}`;
        }

        json = await this.postKinkoid('https://eggs-external-authentication.kinkoid.com/authentication/authenticate', {
            language: 'en',
            product_id: 1,
            ...json.action_params,
        });

        if (!json.session_token) {
            throw `kinkoid authenticate failed: ${JSON.stringify(json)}`;
        }

        const sessionToken = JSON.parse(json.session_token).value;

        json = await this.postPhoenixAjax({
            module: 'Member',
            action: 'session_token_authentication',
            session_token: sessionToken,
            call: 'Member',
        });

        if (!json.success) {
            throw `session_token_authentication failed: ${JSON.stringify(json)}`;
        }
    }

    protected async saveScreenRatio(): Promise<void> {
        const json = await this.postAjax({
            'class': 'Hero',
            'action': 'save_screen_ratio',
            'ratio': String(Math.random()),
        });

        if (!json.success) {
            throw `saveScreenRatio failed: ${JSON.stringify(json)}`;
        }
    }

    protected async verifyAge() {
        if (this.hasCookie(AGE_VERIFICATION_COOKIE)) {
            return;
        }

        const json = await this.postAjax({
            class: 'Hero',
            action: 'age_verification',
        });

        if (!this.hasCookie(AGE_VERIFICATION_COOKIE)) {
            throw `age verification failed (cookie not set): ${JSON.stringify(json)}`;
        }
    }

    protected async postPhoenixAjax(query: FormData, referer?: string): Promise<json> {
        return this.postAjax(query, referer, PHOENIX_AJAX_URL);
    }

    protected async postAjax(query: FormData, referer?: string, ajaxUrl?: string): Promise<json> {
        const response = await this.browser.post(ajaxUrl || AJAX_URL, {
            body: compileFormData(query),
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                // 'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'dnt': '1',
                'Origin': BASE_URL,
                'Pragma': 'no-cache',
                'Referer': referer || HOME_URL,
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
                'sec-ch-ua-mobile': '?0',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        if (response.statusCode !== 200) {
            throw `postAjax '${compileFormData(query)}' returned non-200: ${JSON.stringify(response)}`;
        }

        return JSON.parse(response.body);
    }

    protected async _getPageRaw(page: string): Promise<html> {
        const response = await this.browser.get(page, {
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
            throw `_getPageRaw '${page}' returned non-200: ${JSON.stringify(response)}`;
        }

        return response.body;
    }

    protected async postKinkoid(url: string, query: json): Promise<json> {
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
            throw `postKinkoid '${url}' returned non-200: ${JSON.stringify(response)}`;
        }

        return JSON.parse(response.body);
    }

    protected async fetchHome() {
        const html = await this.getPage(HOME_URL);

        const localDate = new Date;

        const serverTs = Number(m(html, /server_now_ts = ([0-9]+)/i));
        if (isNaN(serverTs) || !serverTs) throw 'serverTs not found';
        const serverDate = new Date(serverTs * 1000);
        const timeDeltaMs = localDate.getTime() - serverDate.getTime();

        const memberInfo = JSON.parse(m(html, /memberInfo = (\{.*?\});/i));
        if (!memberInfo.Name) throw 'memberInfo not found';

        const heroInfo = JSON.parse(m(html, /Hero\.infos = (\{.*?\});/i));
        if (!heroInfo.id) throw 'heroInfo not found';

        const heroEnergies = JSON.parse(m(html, /Hero\.energies = (\{.*?\});/i));
        if (!heroEnergies.quest) throw 'heroEnergies not found';

        const girlsM = html.matchAll(/(girlsDataList\[.*?([0-9]+).*?\] = (\{.*?\}));/g);
        if (!girlsM) throw 'girls not found';
        const girls: json = {};
        for (const [,, girlId, girlData] of girlsM) {
            girls[girlId] = JSON.parse(girlData);
        }

        this.state = {
            ...this.state,
            serverDate,
            timeDeltaMs,
            memberInfo,
            heroInfo,
            heroEnergies,
            girls,
        }
    }

    protected async collectGirlsSalaries() {
        const { girls } = this.state;

        let collected = 0;

        for (const girlId in girls) {
            const girlData = girls[girlId];
            const payIn = Number(girlData.pay_in) || 0;
            const canBeCollectedNow = payIn <= 0;

            if (canBeCollectedNow) {
                collected += await this._collectGirlSalary(girlId);
            } else {
                this.setNextCycleDelayMs(payIn * 1000);
            }
        }

        if (collected) {
            await this.updateMoneyState(collected);
        }
    }

    protected async updateMoneyState(delta: number) {
        this.cache.moneyCollected = (this.cache.moneyCollected || 0) + delta;

        if (this.state.heroInfo?.soft_currency) {
            this.state.heroInfo.soft_currency += delta;
        }

        await this.saveCache();
    }

    protected async _collectGirlSalary(girlId: string): Promise<number> {
        const json = await this.postAjax({
            'class': 'Girl',
            'id_girl': girlId,
            'action': 'get_salary',
        });

        const collected = Number(json.money) || 0;
        const delayMs = (Number(json.time) || 0) * 1000;

        if (!json.success || !delayMs || !collected) {
            throw `collectGirlSalary failed: ${JSON.stringify(json)}`;
        }

        this.setNextCycleDelayMs(delayMs);

        return collected;
    }

    public async start() {
        await this.loadCache();
        await this.cookieJar.load();
        await this.verifyAge();

        while (true) {
            this.resetNextCycleDelayMs();

            await this.fetchHome();
            await this.collectGirlsSalaries();

            await sleep(this.state.nextCycleDelayMs || MIN_CYCLE_DELAY_MS);
        }
    }

    protected setNextCycleDelayMs(milliseconds: number) {
        if (!milliseconds) return;

        this.state.nextCycleDelayMs = this.state.nextCycleDelayMs ?
            Math.min(milliseconds, this.state.nextCycleDelayMs) :
            milliseconds;

        this.state.nextCycleTs = Date.now() + this.state.nextCycleDelayMs;
    }

    protected resetNextCycleDelayMs() {
        this.state.nextCycleDelayMs = 0;
        this.state.nextCycleTs = Date.now();
    }

    public getMetrics() {
        const { heroInfo } = this.state;

        const nextCycleTs = this.state.nextCycleTs ?
            Math.round((this.state.nextCycleTs - Date.now()) / 1000) :
            NaN;

        const lastQueryTs = this.state.lastQueryTs ?
            Math.round((Date.now() - this.state.lastQueryTs) / 1000) :
            NaN;

        return {
            'Name': heroInfo?.Name,
            'Level': heroInfo?.level,
            'Gold': heroInfo?.hard_currency,
            'Money': heroInfo?.soft_currency,
            'Money collected': this.cache.moneyCollected,
            'Queries': this.cache.requestsN,
            'Next cycle': isNaN(nextCycleTs) ? '?' :
                (nextCycleTs < 1 ? 'now' : `in ${nextCycleTs}s`),
            'Last query': isNaN(lastQueryTs) ? '?' :
                (lastQueryTs < 1 ? 'now' : `${lastQueryTs}s ago`),
        };
    }

    public getDebug() {
        return {
            login: this.config.login,
            cache: this.config.cache,
            debug: this.config.debug,
            ...this.state,
            ...this.cache,
        };
    }
}
