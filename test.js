import fs from 'fs';

function m(source, regExp) {
    const m = source.match(regExp);
    return m && m[1] || '';
}

const html = fs.readFileSync('dumps/home.html', { charset: 'utf8' }).toString();

for (const [,, girlId, girlData] of html.matchAll(/(girlsDataList\[.*?([0-9]+).*?\] = (\{.*?\}));/g)) {
    console.log(girlId, girlData);
}
