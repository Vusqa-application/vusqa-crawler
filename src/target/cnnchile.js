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
    tecnologias: "tecnologias",
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
    programas: [],
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
    programas: [],
  },

  thumnail_crawling: async (page, category, limit) => {
    if (cnnchile.pagenation_limit < limit) {
      return;
    }

    switch (category) {
      case "lodijeronencnn":
        break;
      case "programas-completos":
        break;
      default:
        console.log("pagination : ", limit);

        await page.waitFor(".main .inner-list .inner-item__content");

        // $eval 은 브라우저 컨텍스트 $$은 퍼펫티어 컨텍스트

        const news_thumnail_blocks = await page
          .$$(".main .inner-list__item")
          .catch((err) => {
            console.log("cannot reach to thumnail contents!");
            return null;
          });

        for (thumnail_block of news_thumnail_blocks) {
          const thumnail_content = await thumnail_block
            .$eval('div[class="inner-item__content"]', (element) => {
              const thumnail_title =
                element.querySelector(".inner-item__title").innerText;
              const thumnail_summary = element
                .querySelector(".inner-item__text p")
                .innerText.replace(/.*\/ /, "");
              const thumnail_when = element
                .querySelector(".inner-item__text p strong")
                .innerText.split(" ");
              const thumnail_date = thumnail_when[0];
              const thumnail_time = thumnail_when[1];

              return {
                thumnail_title,
                thumnail_summary,
                thumnail_date,
                thumnail_time,
              };
            })
            .catch((err) => {
              console.log(err);
              return {};
            });

          const thumnail_image_link = await thumnail_block.$eval(
            '.inner-item__permalink img[class="inner-item__image"]',
            (element) => element.src
          );

          const thumnail_obj = {
            ...thumnail_content,
            thumnail_image_link,
          };

          cnnchile.thumnail_lists[category].push(thumnail_obj);
        }

        console.log("thumnail has been processed");
        const pagination = await page
          .$$eval(
            '.main .new-pagination .new-pagination__right a[class="new-pagination__button new-pagination__button--secondary"]',
            (elements) => {
              elements[1].click();
              return elements[1].innerText;
            }
          )
          .catch((err) => {
            console.log("pagination is missing!");
          });

        await cnnchile
          .thumnail_crawling(page, category, limit + 1)
          .catch((err) => {
            console.log(`pagination : ${limit + 1} thumnail crawling failed`);
          });
    }
  },
  start_crawling: async (page, pagination_limit) => {
    cnnchile.pagenation_limit = pagination_limit;

    for (let category in cnnchile.general_categories) {
      await page
        .goto(cnnchile.url + cnnchile.general_categories[category])
        .catch((err) => {
          console.log("this page cannot be reached");
        });

      await cnnchile.thumnail_crawling(page, category, 1).catch((err) => {
        console.log(`${category} thumnail crawling failed`);
      });

      console.log(`${category} thumnail crawling is done`);
    }
  },
};

module.exports = cnnchile;
