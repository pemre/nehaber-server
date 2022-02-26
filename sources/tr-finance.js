const axios = require('axios');
const cheerio = require('cheerio');
const cacheKey = 'tr-finance';

module.exports.ENDPOINT = '/tr-finance';
module.exports.SOURCE_URL = 'https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&hideTitle=true&cols=last,changePerc&pairs=66,18,1,49800,1001803,48358,8833,8862';
module.exports.get = async (cache) => {
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const { data: html } = await axios.get(module.exports.SOURCE_URL);
  const $ = cheerio.load(html, { decodeEntities: false });

  const items = Array.from($('article:not(:first-child)'))
    .map((title) => ({
      name: $('.js-col-pair_name', title).text().trim(),
      value: $('.js-col-last', title).text(),
      change: $('.js-col-changePerc', title).text(),
      positive: $('.js-col-changePerc', title).attr('class').includes('greenFont'),
    }));

  return cache.set(cacheKey, items);
};
