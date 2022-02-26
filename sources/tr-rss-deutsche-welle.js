const { getRss } = require('../lib/helpers');

module.exports.ENDPOINT = '/tr-rss-deutsche-welle';
module.exports.get = (cache) => getRss({
  cache,
  cacheKey: 'tr-rss-deutsche-welle',
  sourceUrl: 'http://rss.dw.com/rdf/rss-tur-all',
});
