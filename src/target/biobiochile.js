const puppeteer = require("puppeteer");

const biobiochile = {
  url: "https://www.biobiochile.cl",
  crawling: async (page) => {
    await page.goto(biobiochile.url);
  }
}

module.exports = biobiochile;