const { getRss } = require('../lib/helpers');

module.exports.ENDPOINT = '/en-rss-ua-pravda';
module.exports.get = (cache) => getRss({
  cache,
  cacheKey: 'en-rss-ua-pravda',
  encoding: 'win1251',
  sourceUrl: 'https://www.pravda.com.ua/eng/rss',
});
