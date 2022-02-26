const axios = require('axios');
const cacheKey = 'tr-images-gazeteler';
const cheerio = require('cheerio');
const { getProxyImageUrl } = require('../lib/helpers');

const THUMB_WIDTH = '160';
const THUMB_HEIGHT = '260';

module.exports.ENDPOINT = '/tr-images-gazeteler';
module.exports.SOURCE_URL = 'https://gazete.bik.gov.tr/Uygulamalar/GazeteIlkSayfalar';
module.exports.get = async (cache) => {
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const { data: html } = await axios.get(module.exports.SOURCE_URL);
  const $ = cheerio.load(html, { decodeEntities: false });

  const items = Array.from($('figure'))
    .map((title) => ({
      img: getProxyImageUrl($('img', title).attr('src'), THUMB_WIDTH, THUMB_HEIGHT),
      title: $('.figcaption', title).text()
        .trim()
        // Convert to "Title Case"
        .split(' ')
        .map(s => s.slice(0, 1).toUpperCase() + s.slice(1).toLocaleLowerCase('tr-TR'))
        .join(' '),
      url: $('a', title).attr('href')
    }));

  return cache.set(cacheKey, items);
};
