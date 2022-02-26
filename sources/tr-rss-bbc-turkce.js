const { getRss } = require('../lib/helpers');

module.exports.ENDPOINT = '/tr-rss-bbc-turkce';
module.exports.get = (cache) => getRss({
  cache,
  cacheKey: 'tr-rss-bbc-turkce',
  sourceUrl: 'http://feeds.bbci.co.uk/turkce/rss.xml',
});
