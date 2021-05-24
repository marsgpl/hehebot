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
    load?: () => Promise<CookieJarCookies>;
    save?: (cookies: CookieJarCookies) => Promise<boolean>;
}

export class CookieJar {
    protected cookies: CookieJarCookies = {};

    constructor(protected props: CookieJarProps) {}

    public async load() {
        if (this.props.load) {
            this.cookies = await this.props.load();
            this.removeExpiredCookies();
        }
    }

    public hasCookie(hostName: string, cookieName: string): boolean {
        const key = this.getCookieKey(hostName, cookieName);
        return Boolean(this.cookies[key]);
    }

    protected removeExpiredCookies() {
        const now = new Date;
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

    public async putRawCookiesAndSave(url: URL, date: Date, rawCookies: string[]) {
        let added = 0;

        rawCookies.forEach(rawCookie => {
            const cookie = this.parseRawCookie(url, date, rawCookie);
            if (!cookie) return;

            this.cookies[cookie.key] = cookie;
            added++;
        });

        if (added > 0 && this.props.save) {
            await this.props.save(this.cookies);
        }
    }

    protected parseRawCookie(url: URL, date: Date, rawCookie: string): CookieJarCookie | null {
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
                    cookie.hostname = value;
                } else if (key === 'expires') {
                    cookie.expires = Date.parse(value);
                } else if (key === 'Max-Age' && !cookie.expires) {
                    cookie.expires = date.getTime() + (Number(value) || 0 * 1000);
                }
            }
        });

        if (!cookie.name) {
            return null;
        }

        cookie.key = this.getCookieKey(cookie.hostname, cookie.name);

        return cookie;
    }

    protected getCookieKey(hostName: string, cookieName: string): string {
        return `${hostName}:${cookieName}`;
    }

    public getCookiesAsHeader(url: URL, date: Date): string {
        const result: string[] = [];

        const regexp = new RegExp(`^(.+\\.)?${url.hostname.replace(/^\.+/, '')}$`, 'i');

        Object.keys(this.cookies).forEach(key => {
            const cookie = this.cookies[key];

            if (!regexp.exec(cookie.hostname)) {
                return;
            }

            if (url.pathname.indexOf(cookie.path) !== 0) {
                return;
            }

            if (cookie.expires) {
                const expires = new Date(cookie.expires);
                if (date > expires) {
                    return;
                }
            }

            result.push(cookie.name + '=' + cookie.value);
        });

        return result.join('; ');
    }
}
