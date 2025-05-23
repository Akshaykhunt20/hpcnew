import { performMonolithGraphQLQuery } from '../../scripts/commerce.js';

const getBannerQuery = `query{
  getHomeMainBanner(websiteId: 1){
    primary_banner_items{
      banner_name
      image_alt
      banner_image
      url
    }
    secondary_banner_items{
      banner_name
      image_alt
      banner_image
      url
    }
  }
}
`;

export default async function decorate(banner) {

  const homePageCollection = await performMonolithGraphQLQuery(
      getBannerQuery,
      {},
      true,
      false,
    );

  const homepageBannerCollectionData = homePageCollection.data.getHomeMainBanner;

  const primaryBannerCollection = homepageBannerCollectionData.primary_banner_items;
  const secondaryBannerCollection = homepageBannerCollectionData.secondary_banner_items;

  const primaryBannerContainer = createPrimaryBanner(primaryBannerCollection);
  const secondaryBannerContainer = createSecondaryBanner(secondaryBannerCollection);

  // Replace the existing banner content
  banner.innerHTML = '';
  banner.append(primaryBannerContainer);
  banner.append(secondaryBannerContainer);
}

function createPrimaryBanner(primaryBannerCollection){
  // Create a container for banners
  const bannerContainer = document.createElement('div');
  bannerContainer.classList.add('primary-banner-container');

  // Loop through banner collection and create banner items
  for (const bannerItem of primaryBannerCollection) {
    const bannerElement = document.createElement('div');
    bannerElement.classList.add('banner-item');
    
    // Create and set up the image element
    const bannerImageHtml = createImageStructure(bannerItem.banner_image,bannerItem.image_alt);
    bannerElement.appendChild(bannerImageHtml);
    bannerContainer.appendChild(bannerElement);
  }
  return bannerContainer;
}

function createSecondaryBanner(secondaryBannerContainer){
  // Create a container for banners
  const secondBannerContainer = document.createElement('div');
  secondBannerContainer.classList.add('secondary-banner-container');

  const leftSideTop = document.createElement('div');
  leftSideTop.classList.add('secondary-banner-left-side-images-top');

  const leftSideBootom = document.createElement('div');
  leftSideBootom.classList.add('secondary-banner-left-side-images-bottom');

  console.log("createSecondaryBanner",createSecondaryBanner);
  if(secondaryBannerContainer.length > 0){
    for (const bannerItem of secondaryBannerContainer) {
      const secondBannerElement = document.createElement('div');
      secondBannerElement.classList.add('banner-item');
      const bannerImageHtml = createImageStructure(bannerItem.banner_image,bannerItem.banner_name);
      secondBannerElement.appendChild(bannerImageHtml);
      secondBannerContainer.appendChild(secondBannerElement);
    }
  }
  secondBannerContainer.appendChild(leftSideTop);
  secondBannerContainer.appendChild(leftSideBootom);
  return secondBannerContainer;
}

function createImageStructure(bannerItem,bannerAlt){
  const bannerImage = document.createElement('img');
  bannerImage.src = bannerItem;
  bannerImage.alt = bannerAlt;
  bannerImage.loading = 'lazy';
  return bannerImage;
}