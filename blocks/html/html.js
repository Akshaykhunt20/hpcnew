import { swiperInit } from '../../scripts/swiper-slider.js';
import waitForElm from '../../scripts/waitForElm.js';

export default async function decorate(block) {
  const cols = [...block.firstElementChild.children];

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      // Process HTML content to remove comments but keep their content
      const processComments = (element) => {
        console.log(element);

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

  waitForElm('.category-slider-items').then((elm) => {
    swiperInit(elm, {
      slidesPerView: 8,
      loop: false,
      centeredSlides: false,
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
    });
  });

  waitForElm('.product-slider-items').then((elm) => {
    swiperInit(elm, {
      slidesPerView: 6,
      loop: false,
      centeredSlides: false,
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
    });
  });
}
