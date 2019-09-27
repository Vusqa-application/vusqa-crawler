const puppeteer = require("puppeteer");
const fs = require("fs");

const converter = require("./json-to-csv-converter.js");


const vusqua = {
  browser: null,
  page: null,

  initialize: async (url) => {
    vusqua.browser = await puppeteer.launch({
      headless: false
    });

    vusqua.page = await vusqua.browser.newPage();
    await vusqua.page.goto(url)

  },
  end: async () => {
    vusqua.page.close();
  },
  startCrawling: async (crawling) => {

  },
  saveData: async () => {

  }
}

module.exports = vusqua;