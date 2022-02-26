const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  ALLOW_ORIGIN: process.env.ALLOW_ORIGIN || '*',
  CACHE_TTL: process.env.CACHE_TTL || 600,
  PORT: process.env.PORT || 5000,
};