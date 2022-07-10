const axios = require('axios');
const cheerio = require('cheerio');
const cacheKey = 'tr-social-eksi-sozluk';
const BASE_URL = 'https://eksisozluk.com';
const SELECTOR_CONTAINER = '#partial-index .topic-list a:not(.sponsored)';

module.exports.ENDPOINT = '/tr-social-eksi-sozluk';
module.exports.SOURCE_URL = BASE_URL + '/basliklar/gundem';
module.exports.get = async (cache) => {
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const { data: html } = await axios.get(module.exports.SOURCE_URL);
  const $ = cheerio.load(html, { decodeEntities: false });

  /**
   * Converts the ranks like '2,2b' into '2200'
   * @param {string} t
   * @returns {number}
   */
  const convertThousands = (t) => {
    if (t.substr(-1) === 'b') {
      t = t.substring(0, t.length - 1);
      t = t.includes(',')
        ? t.replace(',', '') + '00'
        : t + '000';
    }
    return parseInt(t);
  };

  const items = Array.from($(SELECTOR_CONTAINER))
    .map((title) => ({
      rank: convertThousands($('small', title).text()),
      title: $(title).html().split(' <')[0], // Get the title without <small> tag: 'example title <small>102</small>'
      url: BASE_URL + $(title).attr('href')
    }))
    .sort((a, b) => b.rank - a.rank);

  return cache.set(cacheKey, items);
};
