const puppeteer = require("puppeteer");
const fs = require("fs");

const vusqua = {
  browser: null,
  context: null,
  page: null,

  initialize: async () => {
    vusqua.browser = await puppeteer.launch({
      headless: false
      // args: [
      //   '--no-sandbox'
      // ]
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