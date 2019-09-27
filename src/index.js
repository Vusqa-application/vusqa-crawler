const vusqua = require("./vusqua.js");

const bancochile = require("./target/bancochile.js");
const biobiochile = require("./target/biobiochile.js");
const cnnchile = require("./target/cnnchile.js");
const cooperativa = require("./target/cooperativa.js");
const elpais = require("./target/elpais.js");
const horas = require("./target/horas.js");
const latercera = require("./target/latercera.js");
const mercadolibre = require("./target/mercadolibre.js");
const soychile = require("./target/soychile.js");

(async () => {

  await vusqua.initialize(biobiochile.url);

  await vusqua.startCrawling(biobiochile.crawling)
  

  // await naver.startCrawling('politics', categories.politics, 1);

})();