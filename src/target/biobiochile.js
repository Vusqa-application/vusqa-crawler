
const puppeteer = require("puppeteer");

const biobiochile = {
  url: "https://www.biobiochile.cl/",
  general_categories: {
    nacional: "lista/categorias/nacional",
    internacional: "lista/categorias/internacional",
    economia: "lista/categorias/economia",    
    sociedad: "lista/categorias/sociedad",
    opinion: "lista/categorias/opinion",
  },
  special_categories: {
    deportes: "portada/deportes",
    reportajes: "especial/reportajes",
  },
  pagenation_limit: 3,
  thumnail_json: null,
  post_json: null,

  thumnail_lists: {
    nacional: [],
    internacional: [],
    economia: [],
    sociedad: [],
    opinion: [],
  },

  post_lists: {
    nacional: [],
    internacional: [],
    economia: [],
    sociedad: [],
    opinion: [],
  },

  crawling: async (page, category, limit) => {
    
    if (biobiochile.pagenation_limit < limit) {
      return
    }

    switch (category) {
      case "deportes":
        break;
      case "reportajes":
        break;
      default:
        
        await page.waitFor("#container1 > .content .small-content");

        // $eval 은 브라우저 컨텍스트 $$은 퍼펫티어 컨텍스트
        
        const news_thumnail_blocks = await page.$$('#container1 > .content .small-content > .noticia');

        for (thumnail_block of news_thumnail_blocks) {

          // 아 맵으로 해야되는구나 $$나 $$eval은

          const [thumnail_date, thumnail_time, thumnail_author] = await thumnail_block.$$eval('div[class="col-xs-2 fecha"] p', elements => elements.map(e => e.innerText));

          const [ thumnail_link, thumnail_title ] = await thumnail_block.$eval('div[class="col-xs-6 titular-fecha"] a', element => {
            const link = element.href;
            const title = element.innerText;
            return [ link, title ];
          })

          const image_link = await thumnail_block.$eval('div[class="col-xs-4 contenedor-imagen"] div', element => {
            return element.style['background-image'].replace('url("//', "").replace('")', "");    
          })

          const thumnail_obj = {
            thumnail_date,
            thumnail_time,
            thumnail_author,
            thumnail_link,
            thumnail_title,
            image_link
          }

          biobiochile.thumnail_lists[category].push(thumnail_obj);
        }

        // 페이지네이션

        const pagination = await page.$eval('#container1 > .content .small-content nav[aria-label="Page navigation example"] li[class="page-item active"]', element => {
          element.nextElementSibling.children[0].click();
          return element.innerText;
        });

        console.log(limit, pagination);

        await biobiochile.crawling(page, category, limit + 1);

        break;
        
    }
  },
  start_crawling: async (page, pagination_limit) => {

    biobiochile.pagenation_limit = pagination_limit;

    for (let category in biobiochile.general_categories) {
      
      await page.goto(biobiochile.url + biobiochile.general_categories[category]);

      await biobiochile.crawling(page, category, 1);
      
    }

    debugger;
  }
}

module.exports = biobiochile;


