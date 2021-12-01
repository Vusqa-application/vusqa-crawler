
const bancochile = {
  url: "https://ww3.bancochile.cl/wps/wcm/connect/Personas/Portal/Inicio",
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
        
        const news_thumnail_blocks = await page.$$('#container1 > .content .small-content > .noticia').catch(err => {
          console.log('cannot reach to thumnail contents!')
          return null;
        });

        for (thumnail_block of news_thumnail_blocks) {

          const [thumnail_date, thumnail_time] = await thumnail_block.$$eval('div[class="col-xs-2 fecha"] p', elements => elements.map(e => e.innerText)).catch(err => {
            console.log('thumnail_date and thumnail_time are missing!')
            return null;
          });

          const thumnail_author = await thumnail_block.$eval('p[class="autor"] > a', element => element.innerText).catch(err => {
            console.log('thumnail_author is missing!')
            return null;
          });

          const [ thumnail_link, thumnail_title ] = await thumnail_block.$eval('div[class="col-xs-6 titular-fecha"] a', element => {
            return [ element.href, element.innerText ];
          }).catch(err => {
            console.log('thumnail_link and thumnail_title are missing!')
            return null;
          });

          const thumnail_image_link = await thumnail_block.$eval('div[class="col-xs-4 contenedor-imagen"] div', element => {
            return element.style['background-image'].replace('url("//', "").replace('")', "");    
          }).catch(err => {
            console.log('thumnail_image_link is missing!')
            return null;
          });

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

        const pagination = await page.$eval('#container1 > .content .small-content nav[aria-label="Page navigation example"] li[class="page-item active"]', element => {
          element.nextElementSibling.children[0].click();
          return element.innerText;
        }).catch(err => {
          console.log('pagination is missing!');
          return null;
        });

        console.log('pagination : ', limit);

        await biobiochile.thumnail_crawling(page, category, limit + 1).catch(err => {
          console.log(`pagination : ${limit + 1} thumnail crawling failed`)
        });

        break;
      
      console.log('post has been processed');
    }
  },
  post_crawling: async (page, category) => {    
    for (let thumnail of biobiochile.thumnail_lists[category]) {
      const connection_success = await page.goto(thumnail.thumnail_link).then(res => {
        return true;
      }).catch(err => {
        console.log('this page cannot be reached');
        return false;
      });

      if (connection_success === false) {
        console.log(thumnail.thumnail_link);
        continue;
      }

      const post_data = await page.$('#content-general-nota div[class^="caja-blanca"]').catch(err => {
        console.log('cannot reach to the post contents');
        return null;
      });

      const post_region = await post_data.$eval('div[class="categoria-titulo-nota"]', element => element.innerText).catch(err => {
        console.log('post region is missing!');
        return null;
      });
      const post_date = await post_data.$eval('div[class="nota-fecha am-hide"]', element => element.innerText).catch(err => {
        console.log('post date is missing!');
        return null;
      });
      const post_title = await post_data.$eval('div[class="nota-titular robotos"]', element => element.innerText).catch(err => {
        console.log('post title is missing!')
        return null;
      });

      const post_image_link = await post_data.$eval('div[class="nota-container"] > div[class="nota-body"] > div[class="nota-img nota-img-chica"] img', element => element.src).catch(err => {
        console.log('image link is missing!')
        return null;
      });
      
      const post_video_link = await post_data.$eval('div[class="nota-container"] > div[class="nota-body"] iframe[id="vrudo-destacado"]', element => {
        return element.contentWindow.document.body.querySelector('video > source').src;
      }).catch(err => {
        console.log('video is missing!')
        return null;
      });
      

      const [post_author, post_provider ] = await post_data.$eval('div[class="nota-autor"]', element => element.innerText.split('\n')).catch(err => {
        console.log('post_author and post_provider are missing!')
        return null;
      });

      const post_content = await post_data.$eval('div[class="nota-container"] > div[class="nota-body"] > div[class="nota-contenido-fondo"] > div[class^="nota-contenido"]', element => element.innerText).catch(err => {
        console.log('content is missing!')
        return null;
      });

      const post_obj = {
        post_region,
        post_date,
        post_title,
        post_author,
        post_provider,
        post_image_link,
        post_video_link,
        post_content
      }

      biobiochile.post_lists[category].push(post_obj);

      console.log('post has been processed');

    }

  },
  start_crawling: async (page, pagination_limit) => {

    biobiochile.pagenation_limit = pagination_limit;

    for (let category in biobiochile.general_categories) {
      
      await page.goto(biobiochile.url + biobiochile.general_categories[category]).catch(err => {
        console.log('this page cannot be reached');
      });

      await biobiochile.thumnail_crawling(page, category, 1).catch(err => {
        console.log(`${category} thumnail crawling failed`);
      });

      console.log(`${category} thumnail crawling is done`);

      await biobiochile.post_crawling(page, category).catch(err => {
        console.log(`${category} post crawling failed`);
      });

      console.log(`${category} post crawling is done`);
      
    }

    biobiochile.thumnail_json = JSON.stringify(biobiochile.thumnail_lists);
    biobiochile.post_json = JSON.stringify(biobiochile.post_lists);

  }
}

module.exports = bancochile;