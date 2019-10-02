
const vusqua = require("./src/vusqua.js");

const bancochile = require("./src/target/bancochile.js");
const biobiochile = require("./src/target/biobiochile.js");
const cnnchile = require("./src/target/cnnchile.js");
const cooperativa = require("./src/target/cooperativa.js");
const elpais = require("./src/target/elpais.js");
const horas = require("./src/target/horas.js");
const latercera = require("./src/target/latercera.js");
const mercadolibre = require("./src/target/mercadolibre.js");
const soychile = require("./src/target/soychile.js");

exports.vusqaCrawling = async (req, res) => {

  console.log('모드 : ', req.params[0]);
  console.log('페이지네이션 제한 : ', req.query.limit);

  if (req.params[0] === 'downloadJSON') {

    await vusqua.initialize();

    await biobiochile.start_crawling(vusqua.page, req.query.limit);
    
    await vusqua.end();

    res.setHeader('Content-disposition', 'attachment; filename= result.json');

    res.setHeader('Content-type', 'application/json');

    res.write(biobiochile.post_json, function (err) {
      res.end();
    });

  } else {

    res.send('다운로드 외에는 아직 구현되지 않았습니다.');

  }

};