const puppeteer = require("puppeteer");
const fs = require("fs");

const converter = require("./json-to-csv-converter.js");

const vusqua = {
  browser: null,
  context: null,
  page: null,

  initialize: async () => {
    vusqua.browser = await puppeteer.launch({
      args: [
        '--no-sandbox'
      ]
    });

    vusqua.context = await vusqua.browser.createIncognitoBrowserContext();

    vusqua.page = await vusqua.context.newPage();
    
  },
  end: async () => {
    vusqua.context.close();
  },
  saveData: async () => {

  }
}

module.exports = vusqua;