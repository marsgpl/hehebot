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
    onRequest?: () => Promise<void>;
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

            const onResponse = (response: http.IncomingMessage) => {
                response.setEncoding('utf8');

                const body: string[] = [];

                response.on('data', (chunk) => {
                    body.push(chunk);
                });

                response.on('end', () => {
                    const result: BrowserResponse = {
                        statusCode: response.statusCode,
                        statusMessage: response.statusMessage,
                        headers: response.headers,
                        body: body.join(''),
                    };

                    if (this.props.debug) {
                        console.log('🔵', result.statusCode, result.statusMessage);
                        console.log('🔵', result.headers);
                        console.log('🔵', result.body.replace(/\n/g, ' ').substr(0, 128)
                            + (result.body.length > 128 ? '...' : ''));
                    }

                    const cookies = response.headers['set-cookie'];

                    if (cookies && this.props.cookieJar) {
                        this.props.cookieJar
                            .putRawCookiesAndSave(url as URL, new Date, cookies)
                            .then(() => resolve(result))
                            .catch(reject);
                    } else {
                        resolve(result);
                    }
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
                method: options.method,
                agent,
            };

            requestOptions.headers = {
                'Host': url.hostname,
            };

            if (this.props.userAgent) {
                requestOptions.headers['User-Agent'] = this.props.userAgent;
            }

            if (options.headers) {
                for (const headerName in options.headers) {
                    requestOptions.headers[headerName] = options.headers[headerName];
                }
            }

            if (this.props.cookieJar) {
                const cookiesFromJar = this.props.cookieJar.getCookiesAsHeader(url, new Date);
                if (cookiesFromJar) {
                    requestOptions.headers['Cookie'] = cookiesFromJar;
                }
            }

            if (options.method === 'POST') {
                requestOptions.headers['Content-Length'] =
                    String(Buffer.byteLength(options.body || '', 'utf8'));
            }

            if (this.props.debug) {
                console.log('🟠', options.method, url.toString());
                console.log('🟠', requestOptions.headers);
                if (options.method === 'POST' && options.body) {
                    console.log('🟠', options.body.replace(/\n/g, ' '));
                }
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

            if (this.props.onRequest) {
                this.props.onRequest();
            }
        });
    }
}

export function compileFormData(data: FormData): string {
    const result: string[] = [];

    Object.keys(data).forEach(key => {
        result.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    });

    return result.join('&');
}
