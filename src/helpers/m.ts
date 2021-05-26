import { JsonObject } from '../class/HeheBot.js';

export function m(source: string, regExp: RegExp): string {
    const m = source.match(regExp);
    return m && m[1] || '';
}

export function mj(source: string, regExp: RegExp): JsonObject | null {
    try {
        return JSON.parse(m(source, regExp));
    } catch {
        return null;
    }
}
