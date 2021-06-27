import { JsonObject } from '../class/HeheBot.js';
import htmlspecialcharsDecode from './htmlspecialcharsDecode.js';

export function m(source: string, regExp: RegExp, noDecode?: boolean): string {
    const m = source.match(regExp);
    const value = m && m[1] || '';
    return noDecode ? value : htmlspecialcharsDecode(value);
}

export function mj(source: string, regExp: RegExp, noDecode?: boolean): JsonObject | null {
    try {
        return JSON.parse(m(source, regExp, noDecode));
    } catch (error) {
        try {
            return JSON.parse(m(source, regExp, true));
        } catch {
            // throw error;
            return null;
        }
    }
}
