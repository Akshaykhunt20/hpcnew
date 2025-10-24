import { swiperInit } from '../../scripts/swiper-slider.js';
import waitForElm from '../../scripts/waitForElm.js';
import { getConfigValue } from '../../scripts/configs.js';

export default async function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      // Process HTML content to remove comments but keep their content
      const processComments = (element) => {
        const walker = document.createTreeWalker(
          element,
          NodeFilter.SHOW_COMMENT,
          null,
          false,
        );

        const commentsToReplace = [];
        let comment;

        // Collect all comments
        /* eslint-disable no-cond-assign */
        while (comment = walker.nextNode()) {
          commentsToReplace.push(comment);
        }
        /* eslint-enable no-cond-assign */

        // Replace comments with their content
        commentsToReplace.forEach((commentNode) => {
          const content = commentNode.nodeValue.trim();
          if (content.startsWith('<div')) {
            // Create a temporary container
            const temp = document.createElement('div');
            temp.innerHTML = content;
            // Replace comment with the parsed content
            commentNode.parentNode.replaceChild(temp.firstChild, commentNode);
          }
        });
      };
      processComments(col);
    });
  });

  waitForElm('.category-slider-items').then(async (elm) => {
    try {
      await swiperInit(elm, {
        slidesPerView: 8,
        loop: false,
        centeredSlides: false,
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    } catch (error) {
      console.error('Error initializing category slider:', error);
    }
  });

  waitForElm('.product-slider-items').then(async (elm) => {
    try {
      await swiperInit(elm, {
        slidesPerView: 6,
        loop: false,
        centeredSlides: false,
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    } catch (error) {
      console.error('Error initializing product slider:', error);
    }
  });

  waitForElm('.blog-html').then(async () => {
    await loadFile('blog-html', 'blog.html');
  });

  waitForElm('.healthy-goals').then(async () => {
    await loadFile('healthy-goals', 'shopy_by_dietary.html');
  });

  waitForElm('.shopyby-wellness').then(async () => {
    await loadFile('shopyby-wellness', 'shopy_by_wellness.html');
  });
}

async function loadFile(selectorClass, filePath) {
  const storeViewCode = getConfigValue('headers.cs.Magento-Store-View-Code');
  const storeUrl = getConfigValue('analytics.store-url');

  const fileUrl = `${storeUrl}/media/bytestechnolab/homepage/${storeViewCode}/${filePath}`;
  const loadFileInMagento = await fetch(fileUrl);
  const loadFileHtml = await loadFileInMagento.text();
  const selectClass = document.querySelector(`.${selectorClass}`);
  selectClass.innerHTML = loadFileHtml;
}
