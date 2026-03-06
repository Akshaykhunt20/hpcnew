import { performMonolithGraphQLQuery } from '../../scripts/commerce.js';

const getBannerQuery = `query {
  getHomeMainBanner(websiteId: 1) {
    primaryBannerItems {
      bannerName
      imageAlt
      bannerImage
      url
    }
    secondaryBannerItems {
      bannerName
      imageAlt
      bannerImage
      url
    }
  }
}`;

export default function decorate(banner) {
  // Add loading state immediately
  const loadingPlaceholder = document.createElement('div');
  loadingPlaceholder.classList.add('banner-loading');
  banner.appendChild(loadingPlaceholder);

  // Fetch data in background
  fetchBannerData(banner);
}

async function fetchBannerData(banner) {
  try {
    const homePageCollection = await performMonolithGraphQLQuery(
      getBannerQuery,
      {},
      true,
      false,
    );

    const homepageBannerCollectionData = homePageCollection?.data?.getHomeMainBanner;

    if (!homepageBannerCollectionData) {
      // eslint-disable-next-line no-console
      console.warn('Banner: getHomeMainBanner data is missing', homePageCollection);
      banner.innerHTML = '';
      banner.classList.add('banner-empty');
      return;
    }

    const primaryBannerCollection = homepageBannerCollectionData.primaryBannerItems || [];
    const secondaryBannerCollection = homepageBannerCollectionData.secondaryBannerItems || [];

    // Create banners only after data is ready
    const primaryBannerContainer = createPrimaryBanner(primaryBannerCollection);
    const secondaryBannerContainer = createSecondaryBanner(secondaryBannerCollection);

    // Replace loading state with actual content
    banner.innerHTML = '';
    if (primaryBannerContainer) banner.append(primaryBannerContainer);
    if (secondaryBannerContainer) banner.append(secondaryBannerContainer);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Banner: error fetching data', e);
    banner.innerHTML = '';
    banner.classList.add('banner-error');
  }
}

function createPrimaryBanner(primaryBannerCollection) {
  if (!Array.isArray(primaryBannerCollection) || primaryBannerCollection.length === 0) {
    return null;
  }

  const bannerContainer = document.createElement('div');
  bannerContainer.classList.add('primary-banner-container');

  primaryBannerCollection.forEach((bannerItem) => {
    const bannerElement = document.createElement('div');
    bannerElement.classList.add('banner-item');

    const bannerImageHtml = createImageStructure(bannerItem.bannerImage, bannerItem.imageAlt || bannerItem.bannerName);
    bannerElement.appendChild(bannerImageHtml);

    bannerContainer.appendChild(bannerElement);
  });
  return bannerContainer;
}

function createSecondaryBanner(secondaryBannerContainer) {
  const hasItems = Array.isArray(secondaryBannerContainer) && secondaryBannerContainer.length > 0;
  if (!hasItems) {
    return null;
  }

  const secondBannerContainer = document.createElement('div');
  secondBannerContainer.classList.add('secondary-banner-container');

  const leftSideTop = document.createElement('div');
  leftSideTop.classList.add('secondary-banner-left-side-images-top');

  const leftSideBootom = document.createElement('div');
  leftSideBootom.classList.add('secondary-banner-left-side-images-bottom');

  secondaryBannerContainer.forEach((bannerItem) => {
    const secondBannerElement = document.createElement('div');
    secondBannerElement.classList.add('banner-item');

    const bannerImageHtml = createImageStructure(
      bannerItem.bannerImage,
      bannerItem.imageAlt || bannerItem.bannerName,
    );
    secondBannerElement.appendChild(bannerImageHtml);

    secondBannerContainer.appendChild(secondBannerElement);
  });

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