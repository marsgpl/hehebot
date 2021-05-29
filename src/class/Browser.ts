import http from 'http';
import https from 'https';
import { URL } from 'url';

import fail from '../helpers/fail.js';
import sleep from '../helpers/sleep.js';
import { CookieJar } from './CookieJar.js';

export const COMMUNICATION_ERROR_RETRY_TIMEOUT = 1000 * 60 * 30; // 30m
const COMMUNICATION_ERROR_MARKER = 'Browser.request communication error';

export type FormData = {[key: string]: string | string[]};

export interface BrowserRequestOptions {
    method?: 'GET' | 'POST';
    headers?: http.OutgoingHttpHeaders;
    body?: string;
}

export interface BrowserResponse {
    statusCode?: number;
    statusMessage?: string;
    headers: http.IncomingHttpHeaders;
    body: string;
}

export interface BrowserProps {
    userAgent?: string;
    cookieJar?: CookieJar;
    debug?: boolean;
    debugPrefix?: string;
    onRequestSuccess?: (response: BrowserResponse) => Promise<void>;
    onNetworkError?: (error: any, retryIn: number) => Promise<void>;
}

export class Browser {
    constructor(protected props: BrowserProps) {}

    public get(url: string | URL, options: BrowserRequestOptions = {}): Promise<BrowserResponse> {
        options.method = 'GET';
        return this.request(url, options);
    }

    public post(url: string | URL, options: BrowserRequestOptions = {}): Promise<BrowserResponse> {
        options.method = 'POST';
        return this.request(url, options);
    }

    protected async request(url: string | URL, options: BrowserRequestOptions = {}): Promise<BrowserResponse> {
        let errors = 0;

        while (true) {
            try {
                return await this._request(url, options);
            } catch (error) {
                if (typeof error === 'string' && error.includes(COMMUNICATION_ERROR_MARKER)) {
                    if (this.props.onNetworkError) {
                        this.props.onNetworkError(error, COMMUNICATION_ERROR_RETRY_TIMEOUT);
                    }

                    errors++;

                    if (errors >= 4) {
                        throw fail('Browser.request', 'too many network errors', url, options);
                    }

                    await sleep(COMMUNICATION_ERROR_RETRY_TIMEOUT);
                } else {
                    throw error;
                }
            }
        }
    }

    protected _request(url: string | URL, options: BrowserRequestOptions = {}): Promise<BrowserResponse> {
        return new Promise((resolve, reject) => {
            url = typeof url === 'string' ? new URL(url) : url;

            if (url.protocol !== 'https:' && url.protocol !== 'http:') {
                return reject(`url protocol '${url.protocol}' is not supported`);
            }

            const onResponse = (httpResponse: http.IncomingMessage) => {
                httpResponse.setEncoding('utf8');

                const body: string[] = [];

                httpResponse.on('data', (chunk) => {
                    body.push(chunk);
                });

                httpResponse.on('end', () => {
                    const response: BrowserResponse = {
                        statusCode: httpResponse.statusCode,
                        statusMessage: httpResponse.statusMessage,
                        headers: httpResponse.headers,
                        body: body.join(''),
                    };

                    const promises: Promise<any>[] = [];

                    const cookies = httpResponse.headers['set-cookie'];

                    if (cookies && this.props.cookieJar) {
                        promises.push(this.props.cookieJar
                            .putRawCookiesAndSave(url as URL, new Date, cookies));
                    }

                    if (this.props.onRequestSuccess) {
                        promises.push(this.props.onRequestSuccess(response));
                    }

                    if (this.props.debug) {
                        console.log('🟨', this.props.debugPrefix, response.statusCode, response.statusMessage);

                        if (response.body[0] === '{') {
                            console.log('🟨', this.props.debugPrefix, response.body);
                        } else {
                            console.log('🟨', this.props.debugPrefix, `body#${response.body.length}`);
                        }
                    }

                    Promise.all(promises)
                        .then(() => resolve(response))
                        .catch(reject);
                });
            };

            const agentOptions: https.AgentOptions = {
                keepAlive: true,
                maxSockets: 1,
            };

            const agent = url.protocol === 'https:' ?
                new https.Agent(agentOptions) :
                new http.Agent(agentOptions);

            const requestOptions: https.RequestOptions = {
                method: options.method || 'GET',
                agent,
            };

            requestOptions.headers = {
                'Host': url.hostname,
            };

            if (this.props.userAgent) {
                requestOptions.headers['User-Agent'] = this.props.userAgent;
            }

            if (options.headers) {
                requestOptions.headers = {
                    ...requestOptions.headers,
                    ...options.headers,
                }
            }

            if (this.props.cookieJar) {
                const cookiesFromJar = this.props.cookieJar.getCookiesForHeader(url, new Date);

                if (cookiesFromJar) {
                    const cokiesFromHeaders = requestOptions.headers['Cookie'];

                    requestOptions.headers['Cookie'] = cokiesFromHeaders ?
                        cookiesFromJar + '; ' + cokiesFromHeaders :
                        cookiesFromJar;
                }
            }

            if (options.method === 'POST') {
                requestOptions.headers['Content-Length'] =
                    String(Buffer.byteLength(options.body || '', 'utf8'));
            }

            const request = url.protocol === 'https:' ?
                https.request(url, requestOptions, onResponse) :
                http.request(url, requestOptions, onResponse);

            request.once('timeout', () =>
                reject(fail(COMMUNICATION_ERROR_MARKER, 'timeout')));

            request.once('error', (error) =>
                reject(fail(COMMUNICATION_ERROR_MARKER, error)));

            if (options.method === 'POST' && options.body) {
                request.write(options.body);
            }

            request.end();

            if (this.props.debug) {
                console.log('🟦', this.props.debugPrefix, options.method, url.toString());

                if (options.method === 'POST') {
                    console.log('🟦', this.props.debugPrefix, JSON.stringify(options.body || ''));
                }
            }
        });
    }
}

export function stringifyFormData(data: FormData): string {
    const result: string[] = [];

    Object.keys(data).forEach(key => {
        key = encodeURIComponent(key);
        const value = data[key];
        if (Array.isArray(value)) {
            value.forEach(entry => {
                result.push(`${key}=${encodeURIComponent(entry)}`);
            });
        } else {
            result.push(`${key}=${encodeURIComponent(value)}`);
        }
    });

    return result.join('&');
}
