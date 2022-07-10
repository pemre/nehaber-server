const { getSwiper, defaultSwiperSelectors } = require('../lib/helpers');

module.exports.ENDPOINT = '/tr-swiper-veryansintv';
module.exports.get = (cache) => getSwiper({
  cache,
  cacheKey: 'tr-swiper-veryansintv',
  selectorContainer: '#kanews_widget_manset_2-2 .kanews-slide:not(.slick-cloned)',
  sourceUrl: 'https://www.veryansintv.com',
  selectors: {
    ...defaultSwiperSelectors,
    img: {
      name: 'img',
      attr: 'data-src',
    },
    title: {
      name: 'a',
      attr: 'aria-label',
    },
    url: {
      name: 'a',
      attr: 'href',
    },
  },
});
