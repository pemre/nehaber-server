const { getRss } = require('../lib/helpers');

module.exports.ENDPOINT = '/tr-rss-webtekno';
module.exports.get = (cache) => getRss({
  cache,
  cacheKey: 'tr-rss-webtekno',
  sourceUrl: 'https://www.webtekno.com/rss.xml',
});
