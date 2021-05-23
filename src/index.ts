import Koa from 'koa';
import render from 'koa-ejs';
import path from 'path';
import { URL } from 'url';

import HeheBot from './HeheBot.js';

import config from './config.json';

const NODE_ENV = process.env.NODE_ENV;
const CWD = path.dirname(new URL(import.meta.url).pathname);

function reportError(...errors: any) {
    console.error('🔸 Error:', ...errors);
}

function cleanup() {
}

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    reportError('unhandledRejection', reason);
    cleanup();
    process.exit(1);
});

process.on('uncaughtException', (err: any, origin: any) => {
    reportError('uncaughtException', err, origin);
    cleanup();
    process.exit(1);
});

process.on('SIGUSR1', () => {
    console.log('SIGUSR1: production docker container was stopped');
    cleanup();
    process.exit(0);
});

const app = new Koa;

const bot = new HeheBot(config.bot);

render(app, {
    root: path.join(CWD, '..', 'views'),
    viewExt: 'ejs',
    cache: NODE_ENV === 'production',
    debug: false,
});

app.use(async (ctx, next) => {
    try {
        await next();

        if (ctx.status === 404) {
            throw 404;
        }
    } catch (error) {
        ctx.status = 200;
        ctx.body = error.message || String(error) || 'error';
    }
});

app.use(async (ctx) => {
    await ctx.render('stat', bot.stat());
});

app.listen(config.listen.port, config.listen.addr, 0, () => {
    console.log(`env: ${NODE_ENV}`);
    console.log(`listening on ${config.listen.addr}:${config.listen.port}`);
});
