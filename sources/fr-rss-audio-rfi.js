const { defaultRssSelectors, getRss } = require('../lib/helpers');

module.exports.ENDPOINT = '/fr-rss-audio-rfi';
module.exports.get = (cache) => getRss({
  cache,
  cacheKey: 'fr-rss-audio-rfi',
  sourceUrl: 'https://www.rfi.fr/fr/podcasts/journal-fran%C3%A7ais-facile/podcast',
  selectors: {
    ...defaultRssSelectors,
    url: {
      name: 'enclosure',
      attr: 'url'
    }
  },
});
