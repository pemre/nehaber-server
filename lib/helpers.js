const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

// All selectors can be string or object: {name: 'selectorName', attr: 'selectorAttribute'}
const defaultRssSelectors  = {
  desc: 'description',
  title: 'title',
  url: 'link',
};
module.exports.defaultRssSelectors = defaultRssSelectors;

module.exports.getRss = async ({
  cache,
  cacheKey,
  encoding = '',
  selectors: {desc, title, url} = defaultRssSelectors,
  sourceUrl,
}) => {
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const client = getClient(encoding);
  const { data: xml } = await client.get(sourceUrl);
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

// All selectors can be string or object: {name: 'selectorName', attr: 'selectorAttribute'}
const defaultSwiperSelectors  = {
  img: {
    name: 'img',
    attr: 'src',
  },
  title: {
    name: 'img',
    attr: 'alt',
  },
  url: {
    attr: 'href',
  },
};
module.exports.defaultSwiperSelectors = defaultSwiperSelectors;

module.exports.getSwiper = async ({
  cache,
  cacheKey,
  encoding = '',
  selectorContainer,
  selectors: {img, title, url} = defaultSwiperSelectors,
  sourceUrl,
}) => {
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const client = getClient(encoding);
  const { data: html } = await client.get(sourceUrl);
  const $ = cheerio.load(html, { decodeEntities: false });

  const items = Array.from($(selectorContainer)).map((item) => ({
    img: $(img.name, item).attr(img.attr).startsWith('http')
      ? $(img.name, item).attr(img.attr)
      : sourceUrl + $(img.name, item).attr(img.attr),
    title: $(title.name, item).attr(title.attr),
    url: $(item).attr(url.attr).startsWith('http')
      ? $(item).attr(url.attr)
      : sourceUrl + $(item).attr(url.attr),
  }));

  return cache.set(cacheKey, items);
};

module.exports.getProxyImageUrl = (url, width, height) => {
  const encodedUrl = encodeURIComponent(url);
  return `https://nehaber-image-proxy.herokuapp.com/${encodedUrl}/${width}/${height}`;
};

/**
 * Sometimes we need encoding, e.g. for Ukrainian Pravda
 * @source https://georgimirchev.com/2020/05/28/parse-windows-1251-cyrillic-request-in-axios/
 */
const getClient = (encoding = '') => {
  const axiosResponseTransformer = (data, headers) => iconv.decode(data, encoding);

  const axiosConfig = {
    responseType: 'arraybuffer',
    transformResponse: axiosResponseTransformer,
  };

  return encoding
    ? axios.create(axiosConfig)
    : axios;
}
