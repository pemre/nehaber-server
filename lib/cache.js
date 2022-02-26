const NodeCache = require('node-cache');

class Cache {
  constructor (ttlSeconds) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false
    });
  }

  get (key) {
    return this.cache.get(key);
  }

  getStats () {
    return this.cache.getStats();
  }

  del (keys) {
    this.cache.del(keys);
  }

  delStartWith (startStr = '') {
    if (!startStr) {
      return;
    }

    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) {
        this.del(key);
      }
    }
  }

  flush () {
    this.cache.flushAll();
  }

  set (key, value) {
    this.cache.set(key, value);
    return value;
  }
}

module.exports = Cache;
