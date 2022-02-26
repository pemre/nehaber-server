const { getSwiper } = require('../lib/helpers');

module.exports.ENDPOINT = '/tr-swiper-odatv';
module.exports.get = (cache) => getSwiper({
  cache,
  cacheKey: 'tr-swiper-odatv',
  selectorContainer: '.mob-order-wrapper-4 a',
  sourceUrl: 'https://odatv4.com',
});
