import fs from 'fs/promises';

// import sleep from './sleep.js';
import { Browser, compileFormData, FormData } from './Browser.js';
import { CookieJar, CookieJarCookies } from './CookieJar.js';

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';

const AGE_VERIFICATION_COOKIE = 'age_verification';

const BASE_HOST = 'www.hentaiheroes.com';
const BASE_URL = `https://${BASE_HOST}`;
const AJAX_URL = `${BASE_URL}/ajax.php`;
const PHOENIX_AJAX_URL = `${BASE_URL}/phoenix-ajax.php`;
const HOME_URL = `${BASE_URL}/home.html`;

type json = {[key: string]: any};
type html = string;

export interface HeheBotConfig {
    login: string;
    password: string;
    cache: string;
    debug?: boolean;
}

export interface HeheBotState {
    level?: number;
}

export interface HeheBotCache {
    cookies?: CookieJarCookies;
}

export class HeheBot {
    protected error?: any;
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
        });
    }

    protected async loadCache(): Promise<void> {
        try {
            this.cache = JSON.parse(await fs.readFile(this.config.cache, { encoding: 'utf8' }));
        } catch {
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

    public getMetrics() {
        return {
            login: this.config.login,
            error: this.error,
            ...this.state,
            cache: this.cache,
        };
    }

    protected async getPage(page: string): Promise<html> {
        let html: string;

        html = await this.getPageRaw(page);

        if (!this.isGuest(html)) {
            return html;
        }

        await this.auth();

        html = await this.getPageRaw(page);

        if (this.isGuest(html)) {
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

    protected isGuest(html: html): boolean {
        return Boolean(
            html.match('phoenix_member_login') &&
            html.match('phoenix_member_register'));
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

    protected async getPageRaw(page: string): Promise<html> {
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
            throw `getPageRaw '${page}' returned non-200: ${JSON.stringify(response)}`;
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

    public async start() {
        await this.loadCache();
        await this.cookieJar.load();

        try {
            await this.verifyAge();
            await this.fetchHome();
        } catch (error) {
            this.error = error;
        }

        if (this.error) {
            console.error('🔸 Error:', this.error);
        }
    }

    protected async fetchHome() {
        const html = await this.getPage(HOME_URL);

        process.stdout.write(html);
    }
}
