// Use a script tag to load Swiper instead of ES module import
const swiperPromise = loadScript('/node_modules/swiper/swiper-bundle.min.js');
loadCss('/node_modules/swiper/swiper-bundle.min.css');
loadCss('/styles/swiper-slider.css');

/* eslint-disable import/prefer-default-export */
export async function swiperInit(selector, {
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
    return null;
  }

  try {
    // Wait for Swiper script to load
    await swiperPromise;

    // Make sure Swiper is available
    if (!window.Swiper) {
      console.error('Swiper is not loaded');
      return null;
    }

    // Get the DOM element if a string selector is provided
    const element = typeof selector === 'string'
      ? document.querySelector(selector) : selector;

    if (!element) {
      console.error(`Element not found: ${selector}`);
      return null;
    }

    // Initialize Swiper with the DOM element
    const swiper = new window.Swiper(element, {
      slidesPerView,
      loop,
      centeredSlides,
      spaceBetween,
      pagination,
      navigation,
    });

    return swiper;
  } catch (error) {
    console.error('Error in swiperInit:', error);
    return null;
  }
}

function loadCss(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

function loadScript(url) {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.Swiper) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
  });
}

export default swiperInit;
