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

// exports.vusquaCrawling = async (req, res) => {

//   await vusqua.initialize();

//   res.send('크롤링 중입니다!')

//   await biobiochile.start_crawling(vusqua.page, 3);
  
//   await vusqua.end();

//   // await naver.startCrawling('politics', categories.politics, 1);

//   // index.js 파일 위치를 바꿔야 하나

// };

(async () => {

  await vusqua.initialize();

  await cnnchile.start_crawling(vusqua.page, 5);

  debugger;
  
  await vusqua.end();

  // await naver.startCrawling('politics', categories.politics, 1);

  // index.js 파일 위치를 바꿔야 하나

})();