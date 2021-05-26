import os from 'os';
import Koa from 'koa';
import render from 'koa-ejs';
import path from 'path';
import { URL } from 'url';

import { HeheBot } from './class/HeheBot.js';
import fail from './helpers/fail.js';

import config from './config.json';

const NODE_ENV = process.env.NODE_ENV;
const CWD = path.dirname(new URL(import.meta.url).pathname);

const app = new Koa;
const bot = new HeheBot(config.bot);

function reportError(...errors: any) {
    console.error('🔸 Fatal error:', fail(...errors));
}

async function cleanup() {}

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
    const now = new Date;

    await ctx.render('metrics', {
        nextTask: bot.getNextTaskInfo(now),
        metrics: bot.exportMetrics(),
        debug: bot.exportDebugInfo(),
    });
});

/**
 * 🟥🟧🟨🟩🟦🟪⬛️⬜️🟫
 */
app.listen(config.listen.port, config.listen.addr, 0, () => {
    console.log(`Mode: ${NODE_ENV}`);
    console.log('OS user:', os.userInfo().username);
    console.log(`Listening on ${config.listen.addr}:${config.listen.port}`);
    bot.start();
});
