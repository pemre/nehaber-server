// const fs = require('fs');
// const https = require('https');
const CacheService = require('./lib/cache');
const compression = require('compression');
const express = require('express');
const { ALLOW_ORIGIN, CACHE_TTL, PORT } = require('./config');

const SERVER_BBC = require('./sources/tr-rss-bbc-turkce');
const SERVER_CUM = require('./sources/tr-swiper-cumhuriyet');
const SERVER_DEU = require('./sources/tr-rss-deutsche-welle');
const SERVER_EKS = require('./sources/tr-social-eksi-sozluk');
const SERVER_FIN = require('./sources/tr-finance');
const SERVER_GZT = require('./sources/tr-images-gazeteler');
const SERVER_NPO = require('./sources/nl-rss-audio-npo');
const SERVER_ODA = require('./sources/tr-swiper-odatv');
const SERVER_PRV = require('./sources/en-rss-ua-pravda');
const SERVER_RFI = require('./sources/fr-rss-audio-rfi');
const SERVER_SOZ = require('./sources/tr-swiper-sozcu');
const SERVER_WTK = require('./sources/tr-rss-webtekno');

// const options = {
//   key: fs.readFileSync('../client/assets/keys/key.pem'),
//   cert: fs.readFileSync('../client/assets/keys/cert.pem')
// };

const cache = new CacheService(CACHE_TTL);

const app = express();

app
  .use(compression())
  .all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', ALLOW_ORIGIN);
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
  })
  .get(SERVER_BBC.ENDPOINT, async (req, res) => res.send(await SERVER_BBC.get(cache)))
  .get(SERVER_CUM.ENDPOINT, async (req, res) => res.send(await SERVER_CUM.get(cache)))
  .get(SERVER_DEU.ENDPOINT, async (req, res) => res.send(await SERVER_DEU.get(cache)))
  .get(SERVER_EKS.ENDPOINT, async (req, res) => res.send(await SERVER_EKS.get(cache)))
  .get(SERVER_FIN.ENDPOINT, async (req, res) => res.send(await SERVER_FIN.get(cache)))
  .get(SERVER_GZT.ENDPOINT, async (req, res) => res.send(await SERVER_GZT.get(cache)))
  .get(SERVER_NPO.ENDPOINT, async (req, res) => res.send(await SERVER_NPO.get(cache)))
  .get(SERVER_ODA.ENDPOINT, async (req, res) => res.send(await SERVER_ODA.get(cache)))
  .get(SERVER_PRV.ENDPOINT, async (req, res) => res.send(await SERVER_PRV.get(cache)))
  .get(SERVER_RFI.ENDPOINT, async (req, res) => res.send(await SERVER_RFI.get(cache)))
  .get(SERVER_SOZ.ENDPOINT, async (req, res) => res.send(await SERVER_SOZ.get(cache)))
  .get(SERVER_WTK.ENDPOINT, async (req, res) => res.send(await SERVER_WTK.get(cache)))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// https.createServer(options, app).listen(5001);
