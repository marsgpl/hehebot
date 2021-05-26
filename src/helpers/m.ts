import { JsonObject } from '../class/HeheBot.js';
import htmlspecialcharsDecode from './htmlspecialcharsDecode.js';

export function m(source: string, regExp: RegExp): string {
    const m = source.match(regExp);
    return htmlspecialcharsDecode(m && m[1] || '');
}

export function mj(source: string, regExp: RegExp): JsonObject | null {
    try {
        return JSON.parse(m(source, regExp));
    } catch {
        return null;
    }
}
