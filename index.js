
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

  if (req.params[0] === 'crawling') {

    await vusqua.initialize();

    let pagination_limit = 0;

    if (req.query.limit) {
      pagination_limit = Number(req.query.limit);
    } else {
      pagination_limit = 3;
    }

    console.log('페이지네이션 제한 : ', pagination_limit);

    await biobiochile.start_crawling(vusqua.page, pagination_limit);
    
    await vusqua.end();

    res.write('<h2>Crawling is Done!</h2>');

  } else if (req.params[0] === 'downloadOutlinkJSON') {

    res.setHeader('Content-disposition', 'attachment; filename= OutlinkData.json');

    res.setHeader('Content-type', 'application/json');

    res.write(biobiochile.thumnail_json, (err) => {
      if (err) {
        console.log(err);
      }
      console.log('Outlink data is exported');
      res.end();
    })

  } else if (req.params[0] === 'downloadInlinkJSON') {

    res.setHeader('Content-disposition', 'attachment; filename= InlinkData.json');

    res.setHeader('Content-type', 'application/json');
    
    res.write(biobiochile.post_json, (err) => {
      if (err) {
        console.log(err);
      }
      console.log('Outlink data is exported');
      res.end();
    })

  } else if (req.params[0] === 'close') {
    process.exit();
  } else {
    res.send('명령을 입력해주십시오');
  }
  
};