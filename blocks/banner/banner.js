import { performMonolithGraphQLQuery } from '../../scripts/commerce.js';

const getBannerQuery = `query{
  getHomeMainBanner(
    websiteId: 1
    banner_type: "primary_banner"
    is_mobile: 0
    storeId: 1
  ) {
    banner_items {
      banner_image
      banner_name
      end_date
      id
      image_alt
      sort_order
      start_date
      url
      website
    }
    bytestechnolabbanner_general_enabled
    error
    right_down_image
    right_down_image_click_url
    right_up_image
    right_up_image_click_url
  }
}
`;

export default function decorate(banner) {
  // Add loading state immediately
  const loadingPlaceholder = document.createElement('div');
  loadingPlaceholder.classList.add('banner-loading');
  banner.appendChild(loadingPlaceholder);

  // Fetch data in background
  fetchBannerData(banner);
}

async function fetchBannerData(banner) {
  const homePageCollection = await performMonolithGraphQLQuery(
    getBannerQuery,
    {},
    true,
    false,
  );
  const homepageBannerCollectionData = homePageCollection.data.getHomeMainBanner;
  const bannerCollection = homepageBannerCollectionData.banner_items;

  // Create banners only after data is ready
  const primaryBannerContainer = createPrimaryBanner(bannerCollection);

  banner.innerHTML = '';
  banner.append(primaryBannerContainer);
}

function createPrimaryBanner(bannerCollection) {
  // Create a container for banners
  const bannerContainer = document.createElement('div');
  bannerContainer.classList.add('primary-banner-container');

  // Loop through banner collection and create banner items
  bannerCollection.forEach((bannerItem) => {
    const bannerElement = document.createElement('div');
    bannerElement.classList.add('banner-item');

    // Create and set up the image element
    const bannerImageHtml = createImageStructure(bannerItem.banner_image, bannerItem.image_alt);
    bannerElement.appendChild(bannerImageHtml);

    bannerContainer.appendChild(bannerElement);
  });
  return bannerContainer;
}

function createSecondaryBanner(secondaryBannerContainer) {
  // Create a container for banners
  const secondBannerContainer = document.createElement('div');
  secondBannerContainer.classList.add('secondary-banner-container');

  const leftSideTop = document.createElement('div');
  leftSideTop.classList.add('secondary-banner-left-side-images-top');

  const leftSideBootom = document.createElement('div');
  leftSideBootom.classList.add('secondary-banner-left-side-images-bottom');

  if (secondaryBannerContainer.length > 0) {
    secondaryBannerContainer.forEach((bannerItem) => {
      const secondBannerElement = document.createElement('div');
      secondBannerElement.classList.add('banner-item');

      const bannerImageHtml = createImageStructure(bannerItem.banner_image, bannerItem.banner_name);
      secondBannerElement.appendChild(bannerImageHtml);

      secondBannerContainer.appendChild(secondBannerElement);
    });
  }
  secondBannerContainer.appendChild(leftSideTop);
  secondBannerContainer.appendChild(leftSideBootom);
  return secondBannerContainer;
}

function createImageStructure(bannerItem, bannerAlt) {
  const bannerImage = document.createElement('img');
  bannerImage.src = bannerItem;
  bannerImage.alt = bannerAlt;
  bannerImage.loading = 'lazy';
  return bannerImage;
}
