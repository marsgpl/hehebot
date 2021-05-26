import http from 'http';
import https from 'https';
import { URL } from 'url';

import { CookieJar } from './CookieJar.js';

export type FormData = {[key: string]: string};

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
    onRequestSuccess?: (response: BrowserResponse) => Promise<void>;
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

    protected request(url: string | URL, options: BrowserRequestOptions = {}): Promise<BrowserResponse> {
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
                        console.log('🟨', response.statusCode, response.statusMessage);

                        if (response.body[0] === '{') {
                            console.log('🟨', response.body);
                        } else {
                            console.log('🟨', `body#${response.body.length}`);
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

            request.once('error', reject);
            request.once('timeout', () => reject('timeout'));

            if (options.method === 'POST' && options.body) {
                request.write(options.body);
            }

            request.end();

            if (this.props.debug) {
                console.log('🟦', options.method, url.toString());

                if (options.method === 'POST') {
                    console.log('🟦', JSON.stringify(options.body || ''));
                }
            }
        });
    }
}

export function stringifyFormData(data: FormData): string {
    const result: string[] = [];

    Object.keys(data).forEach(key => {
        result.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    });

    return result.join('&');
}
