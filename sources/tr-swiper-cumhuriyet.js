const { getSwiper } = require('../lib/helpers');

module.exports.ENDPOINT = '/tr-swiper-cumhuriyet';
module.exports.get = (cache) => getSwiper({
  cache,
  cacheKey: 'tr-swiper-cumhuriyet',
  selectorContainer: '.slider-manset a',
  sourceUrl: 'https://www.cumhuriyet.com.tr',
});
