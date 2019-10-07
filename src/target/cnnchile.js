const cnnchile = {
  url: "https://www.cnnchile.com/",
  general_categories: {
    pais: "pais",
    deportes: "deportes",
    mundo: "mundo",    
    economia: "economia",
    cultura: "cultura",
    tendencias: "tendencias",
    miradas_perspectivas: "category/perspectivas",
    miradas_conversaciones: "category/conversaciones",
    miradas_especiales: "category/especiales",
    tecnologias: "tecnologias"
  },
  special_categories: {
    lodijeronencnn: "lodijeronencnn",
    programas: "programas-completos",
  },
  pagenation_limit: 3,
  thumnail_json: null,
  post_json: null,

  thumnail_lists: {
    pais: [],
    deportes: [],
    mundo: [],    
    economia: [],
    cultura: [],
    tendencias: [],
    miradas_perspectivas: [],
    miradas_conversaciones: [],
    miradas_especiales: [],
    tecnologias: [],
    lodijeronencnn: [],
    programas: []
  },

  post_lists: {
    pais: [],
    deportes: [],
    mundo: [],    
    economia: [],
    cultura: [],
    tendencias: [],
    miradas_perspectivas: [],
    miradas_conversaciones: [],
    miradas_especiales: [],
    tecnologias: [],
    lodijeronencnn: [],
    programas: []
  },

  thumnail_crawling: async (page, category, limit) => {
    
    if (cnnchile.pagenation_limit < limit) {
      return
    }

    switch (category) {
      case "lodijeronencnn":
        break;
      case "programas-completos":
        break;
      default:
        
        console.log('pagination : ', limit);

        await page.waitFor(".main .inner-list .inner-item__content");

        // $eval 은 브라우저 컨텍스트 $$은 퍼펫티어 컨텍스트
        
        const news_thumnail_blocks = await page.$$(".main .inner-list__item").catch(err => {
          console.log('cannot reach to thumnail contents!')
          return null;
        });

        for (thumnail_block of news_thumnail_blocks) {

          // 아 맵으로 해야되는구나 $$나 $$eval은

          const thumnail_content = await thumnail_block.$eval('div[class="inner-item__content"]', element => {
            const thumnail_title = element.querySelector('.inner-item__title').innerText;
            const thumnail_summary = element.querySelector('.inner-item__text p').innerText.replace(/.*\/ /, "");
            const thumnail_when = element.querySelector('.inner-item__text p strong').innerText.split(" ");
            const thumnail_date = thumnail_when[0];
            const thumnail_time = thumnail_when[1];
            
            return {
              thumnail_title,
              thumnail_summary,
              thumnail_date,
              thumnail_time
            };

          }).catch(err => {
            console.log(err);
            return {};
          });

          const thumnail_image_link = await thumnail_block.$eval('.inner-item__permalink img[class="inner-item__image"]', element => element.src);

          const thumnail_obj = {
            ...thumnail_content,
            thumnail_image_link
          }

          cnnchile.thumnail_lists[category].push(thumnail_obj);

        }

        console.log('thumnail has been processed');

        // 페이지네이션

        const pagination = await page.$$eval('.main .new-pagination .new-pagination__right a[class="new-pagination__button new-pagination__button--secondary"]', elements => {
          elements[1].click();
          return elements[1].innerText;
        }).catch(err => {
          console.log('pagination is missing!');
        });

        await cnnchile.thumnail_crawling(page, category, limit + 1).catch(err => {
          console.log(`pagination : ${limit + 1} thumnail crawling failed`)
        });
            
        

      //     const [thumnail_date, thumnail_time] = await thumnail_block.$$eval('div[class="col-xs-2 fecha"] p', elements => elements.map(e => e.innerText)).catch(err => {
      //       console.log('thumnail_date and thumnail_time are missing!')
      //       return null;
      //     });

      //     const thumnail_author = await thumnail_block.$eval('p[class="autor"] > a', element => element.innerText).catch(err => {
      //       console.log('thumnail_author is missing!')
      //       return null;
      //     });

      //     const [ thumnail_link, thumnail_title ] = await thumnail_block.$eval('div[class="col-xs-6 titular-fecha"] a', element => {
      //       return [ element.href, element.innerText ];
      //     }).catch(err => {
      //       console.log('thumnail_link and thumnail_title are missing!')
      //       return null;
      //     });

      //     const thumnail_image_link = await thumnail_block.$eval('div[class="col-xs-4 contenedor-imagen"] div', element => {
      //       return element.style['background-image'].replace('url("//', "").replace('")', "");    
      //     }).catch(err => {
      //       console.log('thumnail_image_link is missing!')
      //       return null;
      //     });

      //     const thumnail_obj = {
      //       thumnail_date,
      //       thumnail_time,
      //       thumnail_author,
      //       thumnail_link,
      //       thumnail_title,
      //       thumnail_image_link
      //     }
      //     biobiochile.thumnail_lists[category].push(thumnail_obj);
      //   }

      //   // 페이지네이션

      //   const pagination = await page.$eval('#container1 > .content .small-content nav[aria-label="Page navigation example"] li[class="page-item active"]', element => {
      //     element.nextElementSibling.children[0].click();
      //     return element.innerText;
      //   }).catch(err => {
      //     console.log('pagination is missing!');
      //     return null;
      //   });

      //   console.log('pagination : ', limit);

      //   await biobiochile.thumnail_crawling(page, category, limit + 1).catch(err => {
      //     console.log(`pagination : ${limit + 1} thumnail crawling failed`)
      //   });

      //   break;
      
      // console.log('post has been processed');

    }
  },
  post_crawling: async (page, category) => {

    // 완전히 다른 포스트 구조도 있구만 <- 이거 이미지 예외처리도 해야하는 모양인데
    
    // 후 미칠듯
    
    // for (let thumnail of biobiochile.thumnail_lists[category]) {
    //   const connection_success = await page.goto(thumnail.thumnail_link).then(res => {
    //     return true;
    //   }).catch(err => {
    //     console.log('this page cannot be reached');
    //     return false;
    //   });

    //   if (connection_success === false) {
    //     console.log(thumnail.thumnail_link);
    //     continue;
    //   }

    //   const post_data = await page.$('#content-general-nota div[class^="caja-blanca"]').catch(err => {
    //     console.log('cannot reach to the post contents');
    //     return null;
    //   });

    //   const post_region = await post_data.$eval('div[class="categoria-titulo-nota"]', element => element.innerText).catch(err => {
    //     console.log('post region is missing!');
    //     return null;
    //   });
    //   const post_date = await post_data.$eval('div[class="nota-fecha am-hide"]', element => element.innerText).catch(err => {
    //     console.log('post date is missing!');
    //     return null;
    //   });
    //   const post_title = await post_data.$eval('div[class="nota-titular robotos"]', element => element.innerText).catch(err => {
    //     console.log('post title is missing!')
    //     return null;
    //   });

    //   const post_image_link = await post_data.$eval('div[class="nota-container"] > div[class="nota-body"] > div[class="nota-img nota-img-chica"] img', element => element.src).catch(err => {
    //     console.log('image link is missing!')
    //     return null;
    //   });
      
    //   const post_video_link = await post_data.$eval('div[class="nota-container"] > div[class="nota-body"] iframe[id="vrudo-destacado"]', element => {
    //     return element.contentWindow.document.body.querySelector('video > source').src;
    //   }).catch(err => {
    //     console.log('video is missing!')
    //     return null;
    //   });
      

    //   const [post_author, post_provider ] = await post_data.$eval('div[class="nota-autor"]', element => element.innerText.split('\n')).catch(err => {
    //     console.log('post_author and post_provider are missing!')
    //     return null;
    //   });

    //   const post_content = await post_data.$eval('div[class="nota-container"] > div[class="nota-body"] > div[class="nota-contenido-fondo"] > div[class^="nota-contenido"]', element => element.innerText).catch(err => {
    //     console.log('content is missing!')
    //     return null;
    //   });

    //   const post_obj = {
    //     post_region,
    //     post_date,
    //     post_title,
    //     post_author,
    //     post_provider,
    //     post_image_link,
    //     post_video_link,
    //     post_content
    //   }

    //   biobiochile.post_lists[category].push(post_obj);

    //   console.log('post has been processed');

    // }

  },
  start_crawling: async (page, pagination_limit) => {

    cnnchile.pagenation_limit = pagination_limit;

    for (let category in cnnchile.general_categories) {
      
      await page.goto(cnnchile.url + cnnchile.general_categories[category]).catch(err => {
        console.log('this page cannot be reached');
      });

      await cnnchile.thumnail_crawling(page, category, 1).catch(err => {
        console.log(`${category} thumnail crawling failed`);
      });

      console.log(`${category} thumnail crawling is done`);

      // await cnnchile.post_crawling(page, category).catch(err => {
      //   console.log(`${category} post crawling failed`);
      // });

      // console.log(`${category} post crawling is done`);
      
    }

    // cnnchile.thumnail_json = JSON.stringify(cnnchile.thumnail_lists);
    // cnnchile.post_json = JSON.stringify(cnnchile.post_lists);

  }
}

module.exports = cnnchile;