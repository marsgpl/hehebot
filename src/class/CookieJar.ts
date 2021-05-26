import path from 'path';
import { URL } from 'url';

export interface CookieJarCookie {
    key: string;
    name: string;
    value: string;
    hostname: string;
    path: string;
    expires?: number; // ts with millis
    rawValue: string;
}

export type CookieJarCookies = {
    [key: string]: CookieJarCookie;
}

export interface CookieJarProps {
    loadCookies?: () => Promise<CookieJarCookies>;
    saveCookies?: (cookies: CookieJarCookies) => Promise<void>;
}

export class CookieJar {
    protected cookies: CookieJarCookies = {};

    constructor(protected props: CookieJarProps) {}

    public async load(now: Date) {
        if (this.props.loadCookies) {
            this.cookies = await this.props.loadCookies();
            this.removeExpiredCookies(now);
        } else {
            this.cookies = {};
        }
    }

    public hasCookie(hostName: string, cookieName: string): boolean {
        const key = this.getCookieKey(hostName, cookieName);
        return Boolean(this.cookies[key]);
    }

    public getCookiesForHeader(url: URL, now: Date): string {
        const result: string[] = [];
        const hostRegexp = new RegExp(`^(.+\\.)?${url.hostname.replace(/^\.+/, '')}$`, 'i');

        Object.keys(this.cookies).forEach(key => {
            const cookie = this.cookies[key];

            if (!hostRegexp.exec(cookie.hostname)) {
                return;
            }

            if (url.pathname.indexOf(cookie.path) !== 0) {
                return;
            }

            if (cookie.expires) {
                const expires = new Date(cookie.expires);
                if (now > expires) return;
            }

            result.push(cookie.name + '=' + cookie.value);
        });

        return result.join('; ');
    }

    public async putRawCookiesAndSave(url: URL, now: Date, rawCookies: string[]) {
        let added = 0;

        rawCookies.forEach(rawCookie => {
            const cookie = this.parseRawCookie(url, now, rawCookie);
            if (!cookie) return;
            this.cookies[cookie.key] = cookie;
            added++;
        });

        if (added > 0 && this.props.saveCookies) {
            await this.props.saveCookies(this.cookies);
        }
    }

    protected getCookieKey(hostName: string, cookieName: string): string {
        return `${hostName}:${cookieName}`;
    }

    protected removeExpiredCookies(now: Date) {
        const keysToRemove: string[] = [];

        Object.keys(this.cookies).forEach(key => {
            const cookie = this.cookies[key];
            const expires = new Date(cookie.expires || 0);

            if (expires < now) {
                keysToRemove.push(key);
            }
        });

        keysToRemove.forEach(key => {
            delete this.cookies[key];
        });
    }

    protected parseRawCookie(url: URL, now: Date, rawCookie: string): CookieJarCookie | null {
        const pairs = rawCookie.split('; ');

        const cookie: CookieJarCookie = {
            key: '',
            name: '',
            value: '',
            hostname: url.hostname,
            path: path.dirname(url.pathname),
            rawValue: rawCookie,
        };

        pairs.forEach((pair, index) => {
            const parts = pair.split('=');

            let key = (parts.shift() || '').trim();
            let value = parts.join('=').trim();

            if (index === 0) {
                cookie.name = key;
                cookie.value = value;
            } else {
                key = key.toLowerCase();

                if (key === 'path') {
                    cookie.path = value;
                } else if (key === 'domain') {
                    if (url.hostname.indexOf(value) >= 0) {
                        cookie.hostname = value;
                    }
                } else if (key === 'expires') {
                    cookie.expires = Date.parse(value);
                } else if (key === 'Max-Age' && !cookie.expires) {
                    cookie.expires = now.getTime() + ((Number(value) || 0) * 1000);
                }
            }
        });

        if (!cookie.name) {
            return null;
        }

        cookie.key = this.getCookieKey(cookie.hostname, cookie.name);

        return cookie;
    }
}
