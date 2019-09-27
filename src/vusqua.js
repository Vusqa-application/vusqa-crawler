const puppeteer = require("puppeteer");
const fs = require("fs");

const converter = require("./json-to-csv-converter.js");

const vusqua = {
  browser: null,
  page: null,

  initialize: async () => {
    vusqua.browser = await puppeteer.launch({
      headless: false
    });

    vusqua.page = await vusqua.browser.newPage();
    
  },
  end: async () => {
    vusqua.page.close();
  },
  saveData: async () => {

  }
}

module.exports = vusqua;