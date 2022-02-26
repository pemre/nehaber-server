const { getSwiper } = require('../lib/helpers');

module.exports.ENDPOINT = '/tr-swiper-sozcu';
module.exports.get = (cache) => getSwiper({
  cache,
  cacheKey: 'tr-swiper-sozcu',
  selectorContainer: '#sz_manset a',
  sourceUrl: 'https://www.sozcu.com.tr/',
});
