import { Swiper } from 'swiper/swiper-bundle.min.js';

loadCss('swiper/swiper-bundle.min.css');
loadCss('/styles/swiper-slider.css');

/* eslint-disable import/prefer-default-export */
export function swiperInit(selector, {
  slidesPerView = 2,
  loop = true,
  centeredSlides = true,
  spaceBetween = 10,
  pagination = {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation = {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
}) {
  if (!selector) {
    console.error('Selector is required');
    return;
  }

  try {
    // Get the DOM element if a string selector is provided
    const element = typeof selector === 'string'
      ? document.querySelector(selector) : selector;

    if (!element) {
      console.error(`Element not found: ${selector}`);
      return;
    }

    // Initialize Swiper with the DOM element
    const swiper = new Swiper(element, {
      slidesPerView,
      loop,
      centeredSlides,
      spaceBetween,
      pagination,
      navigation,
    });

    console.error('Swiper initialized:', swiper);
  } catch (error) {
    console.error('Error in swiperInit:', error);
  }
}

function loadCss(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}
