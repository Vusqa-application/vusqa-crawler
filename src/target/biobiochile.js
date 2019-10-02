
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

  thumnail_crawling: async (page, category, limit) => {
    
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

          const [thumnail_date, thumnail_time] = await thumnail_block.$$eval('div[class="col-xs-2 fecha"] p', elements => elements.map(e => e.innerText));

          const thumnail_author = await thumnail_block.$eval('p[class="autor"] > a', element => element.innerText);

          const [ thumnail_link, thumnail_title ] = await thumnail_block.$eval('div[class="col-xs-6 titular-fecha"] a', element => {
            return [ element.href, element.innerText ];
          })

          const thumnail_image_link = await thumnail_block.$eval('div[class="col-xs-4 contenedor-imagen"] div', element => {
            return element.style['background-image'].replace('url("//', "").replace('")', "");    
          })

          const thumnail_obj = {
            thumnail_date,
            thumnail_time,
            thumnail_author,
            thumnail_link,
            thumnail_title,
            thumnail_image_link
          }

          biobiochile.thumnail_lists[category].push(thumnail_obj);
        }

        // 페이지네이션

        const pagination = await page.$eval('#container1 > .content .small-content nav[aria-label="Page navigation example"] li[class="page-item active"]', element => {
          element.nextElementSibling.children[0].click();
          return element.innerText;
        });

        console.log('pagination : ', limit);

        await biobiochile.thumnail_crawling(page, category, limit + 1);

        break;
      
      console.log('post has been processed');

    }
  },
  post_crawling: async (page, category) => {

    // 완전히 다른 포스트 구조도 있구만 <- 이거 이미지 예외처리도 해야하는 모양인데
    
    // 후 미칠듯
    
    for (let thumnail of biobiochile.thumnail_lists[category]) {
      await page.goto(thumnail.thumnail_link);

      const post_data = await page.$('#content-general-nota div[class^="caja-blanca"]');

      const post_region = await post_data.$eval('div[class="categoria-titulo-nota"]', element => element.innerText);
      const post_date = await post_data.$eval('div[class="nota-fecha am-hide"]', element => element.innerText);
      const post_title = await post_data.$eval('div[class="nota-titular robotos"]', element => element.innerText);
      const post_image_link = await post_data.$eval('div[class="nota-container"] > div[class="nota-body"] > div[class="nota-img nota-img-chica"] img', element => element.src);

      const [post_author, post_provider ] = await post_data.$eval('div[class="nota-autor"]', element => element.innerText.split('\n'));
      const post_content = await post_data.$eval('div[class="nota-container"] > div[class="nota-body"] > div[class="nota-contenido-fondo"] > div[class^="nota-contenido"]', element => element.innerText);

      const post_obj = {
        post_region,
        post_date,
        post_title,
        post_author,
        post_provider,
        post_image_link,
        post_content
      }

      biobiochile.post_lists[category].push(post_obj);

      console.log('post has been processed');

    }

  },
  start_crawling: async (page, pagination_limit) => {

    biobiochile.pagenation_limit = pagination_limit;

    for (let category in biobiochile.general_categories) {
      
      await page.goto(biobiochile.url + biobiochile.general_categories[category]);

      await biobiochile.thumnail_crawling(page, category, 1);

      console.log('all thumnail crawling is done');

      await biobiochile.post_crawling(page, category);

      console.log('all post crawling is done');
      
    }

    biobiochile.thumnail_json = JSON.stringify(biobiochile.thumnail_lists);
    biobiochile.post_json = JSON.stringify(biobiochile.post_lists);

  }
}

module.exports = biobiochile;


