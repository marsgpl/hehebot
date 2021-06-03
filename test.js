import fs from 'fs';

function htmlspecialcharsDecode(str) {
    return str
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, '\'')
        .replace(/&amp;/g, '&');
}

function m(source, regExp, noDecode) {
    const m = source.match(regExp);
    const value = m && m[1] || '';
    return noDecode ? value : htmlspecialcharsDecode(value);
}

function mj(source, regExp, noDecode) {
    try {
        return JSON.parse(m(source, regExp, noDecode));
    } catch (error) {
        // throw error;
        return null;
    }
}

const html = fs.readFileSync('dumps/champion.html', { charset: 'utf8' })
	.toString()
	.replace(/[\r\n\s\t]+/g, ' ')
	.trim();

const championData = mj(html, /championData = (\{.*?\});/i, true);

console.log('🔸 championData:', championData);
