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

  const items = Array.from($(selectorContainer)).map((item) => {
    // Image
    let _img = $(img.name, item).attr(img.attr);
    if (!_img.startsWith('http')) {
      _img = sourceUrl + _img;
    }

    // Title
    const _title = $(title.name, item).attr(title.attr);

    // URL
    let _url = '';

    /**
     * Some websites have slightly different patterns for listed image and link elements.
     * Therefore we need different queries for each.
     *
     * Pattern 1 (most common with Swiper): Link element is the container itself
     * -------------------------------------------------------------------------
     *
     *   <a href="{url}">
     *     <img src="{img}" />
     *   </a>
     *   <a href="{url}">
     *     <img src="{img}" />
     *   </a>
     *
     * Pattern2 (with Kanews? slider): There is a wrapper container for each item
     * --------------------------------------------------------------------------
     *
     *   <div>
     *     <a href="{url}" />
     *     <img src="{img}" />
     *   </div>
     *   <div>
     *     <a href="{url}" />
     *     <img src="{img}" />
     *   </div>
     */

    if (url.name) {
      _url = $(url.name, item).attr(url.attr);
    } else {
      _url = $(item).attr(url.attr);
    }

    if (!_url.startsWith('http')) {
      _url = sourceUrl + _url;
    }

    return {
      img: _img,
      title: _title,
      url: _url,
    }
  });

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
