const { getRss } = require('../lib/helpers');

module.exports.ENDPOINT = '/nl-rss-audio-npo';
module.exports.get = (cache) => getRss({
  cache,
  cacheKey: 'nl-rss-audio-npo',
  sourceUrl: 'https://podcast.npo.nl/feed/de-dag.xml',
});
