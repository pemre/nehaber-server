const axios = require('axios');
const cheerio = require('cheerio');

const defaultRssSelectors  = {
  desc: 'description', // All selectors can be string or object: {name: 'selectorName', attribute: 'selectorAttribute'}
  title: 'title',
  url: 'link',
};
module.exports.defaultRssSelectors = defaultRssSelectors;

module.exports.getRss = async ({
  cache,
  cacheKey,
  selectors: {desc, title, url} = defaultRssSelectors,
  sourceUrl,
}) => {
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const { data: xml } = await axios.get(sourceUrl);
  const $ = cheerio.load(xml, { xmlMode: true });

  const items = Array.from($('item')).map((item) => ({
    desc: desc.name && desc.attr
      ? $(desc.name, item).attr(desc.attr)
      : $(desc, item).text(),
    title: title.name && title.attr
      ? $(title.name, item).attr(title.attr)
      : $(title, item).text(),
    url: url.name && url.attr
      ? $(url.name, item).attr(url.attr)
      : $(url, item).text(),
  }));

  return cache.set(cacheKey, items);
};

module.exports.getSwiper = async ({
  cache,
  cacheKey,
  selectorContainer,
  sourceUrl,
}) => {
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const { data: html } = await axios.get(sourceUrl);
  const $ = cheerio.load(html, { decodeEntities: false });

  const items = Array.from($(selectorContainer)).map((headline) => ({
    img: $('img', headline).attr('src').startsWith('http')
      ? $('img', headline).attr('src')
      : sourceUrl + $('img', headline).attr('src'),
    title: $('img', headline).attr('alt'),
    url: $(headline).attr('href').startsWith('http')
      ? $(headline).attr('href')
      : sourceUrl + $(headline).attr('href'),
  }));

  return cache.set(cacheKey, items);
};

module.exports.getProxyImageUrl = (url, width, height) => {
  const encodedUrl = encodeURIComponent(url);
  return `https://nehaber-image-proxy.herokuapp.com/${encodedUrl}/${width}/${height}`;
};