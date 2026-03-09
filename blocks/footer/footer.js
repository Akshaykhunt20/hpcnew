import { getRootPath, isMultistore } from '@dropins/tools/lib/aem/configs.js';

// Dropin Components
import {
  Button,
  provider as UI,
} from '@dropins/tools/components.js';

// Block-level
import createModal from '../modal/modal.js';
import { getMetadata, loadCSS } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Toggles all storeSelector sections
 */
function toggleStoreDropdown(sections, expanded = false) {
  sections
    .querySelectorAll('.storeview-modal .default-content-wrapper > ul > li')
    .forEach((section) => {
      section.setAttribute('aria-expanded', expanded);
    });
}

/**
 * Convert da.live footer rows into UL/LI structure
 * and preserve links
 */
function convertToList(section) {
  const rows = [...section.children];

  if (!rows.length) return;

  const titleRow = rows.shift();
  const title = titleRow.textContent.trim();

  const ul = document.createElement('ul');

  rows.forEach((row) => {
    const li = document.createElement('li');

    const content = row.querySelector('p') || row;

    // Preserve HTML like <a>
    li.innerHTML = content.innerHTML;

    ul.appendChild(li);
  });

  section.innerHTML = '';

  const heading = document.createElement('h3');
  heading.textContent = title;

  section.appendChild(heading);
  section.appendChild(ul);
}

/**
 * loads and decorates the footer
 */
export default async function decorate(block) {
  const root = getRootPath();

  // Load Footer Fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';

  let fragment = null;

  try {
    fragment = await loadFragment(footerPath);
  } catch (e) {
    console.warn('Footer fragment failed to load:', footerPath, e);
  }

  block.textContent = '';
  const footer = document.createElement('div');

  /**
   * Store Switcher
   */
  if (isMultistore()) {
    footer.innerHTML = `
      <div class="storeview-switcher-button"></div>
    `;

    let modal;

    const showModal = async (content) => {
      modal = await createModal([content]);
      modal.showModal();
    };

    const $storeSwitcherBtn = footer.querySelector('.storeview-switcher-button');

    const storeSwitcherPath = '/store-switcher';
    let fragmentStoreView;

    try {
      fragmentStoreView = await loadFragment(storeSwitcherPath);

      if (!fragmentStoreView) {
        throw new Error(`Store Switcher fragment (${storeSwitcherPath}) not found`);
      }
    } catch (error) {
      console.error('Error loading store switcher fragment:', error);
      return;
    }

    const storeSwitcher = document.createElement('div');

    const selected = [...fragmentStoreView.querySelectorAll('a')].find((a) => {
      const url = new URL(a.href);
      return url.pathname.startsWith(root);
    });

    storeSwitcher.id = 'storeview-modal';

    while (fragmentStoreView.firstElementChild) {
      storeSwitcher.append(fragmentStoreView.firstElementChild);
    }

    const classes = ['storeview-title', 'storeview-list'];

    classes.forEach((c, i) => {
      const section = storeSwitcher.children[i];
      if (section) section.classList.add(`storeview-modal-${c}`);
    });

    const storeViewTitle = storeSwitcher.querySelector('.storeview-modal-storeview-title');
    const title = storeViewTitle?.querySelector('h3');

    if (title) {
      title.className = '';
      title.closest('h3').classList.add('storeview-modal-storeview-title');
      title.setAttribute('tabindex', '0');
    }

    const storeViewList = storeSwitcher.querySelector('.storeview-modal-storeview-list');

    if (storeViewList && storeViewList.children.length) {
      storeViewList
        .querySelectorAll(':scope .default-content-wrapper > ul')
        .forEach((storeView) => {
          if (storeView.querySelector('ul')) {
            storeView.classList.add('storeview-selection');
          }
        });

      storeViewList
        .querySelectorAll('.default-content-wrapper > ul > li > ul')
        .forEach((storeRegion) => {
          if (storeRegion.children.length > 1) {
            if (storeRegion.querySelector('ul')) {
              storeRegion.classList.add('storeviews');
            }

            storeViewList.querySelectorAll(':scope li').forEach((storeView) => {
              const link = storeView.closest('a');
              if (link) link.setAttribute('tabindex', '0');

              storeView.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  const expanded = storeView.getAttribute('aria-expanded') === 'true';
                  toggleStoreDropdown(storeViewList);
                  storeView.setAttribute('aria-expanded', expanded ? 'false' : 'true');
                }
              });

              storeView.addEventListener('click', () => {
                const expanded = storeView.getAttribute('aria-expanded') === 'true';
                toggleStoreDropdown(storeViewList);
                storeView.setAttribute('aria-expanded', expanded ? 'false' : 'true');
              });
            });
          }
        });

      UI.render(Button, {
        children: `${selected?.text || 'Select Store'}`,
        'data-testid': 'storeview-switcher-button',
        className: 'storeview-switcher-button',
        size: 'medium',
        variant: 'teritary',
        onClick: () => {
          showModal(storeSwitcher);
        },
      })($storeSwitcherBtn);
    }
  }

  /**
   * Append Footer Content
   */
  if (fragment) {
    while (fragment.firstElementChild) {
      footer.append(fragment.firstElementChild);
    }
  }

  /**
   * Convert footer sections to UL/LI
   */
  footer.querySelectorAll('.block').forEach((section) => {
    convertToList(section);
  });

  /**
   * Accordion for mobile (screen < 769px): wrap sections and add toggle behavior
   */
  const sections = footer.querySelectorAll('.block');
  sections.forEach((section, index) => {
    section.classList.add('footer-accordion-section');
    const heading = section.querySelector('h3');
    const panel = section.querySelector('ul');
    if (!heading || !panel) return;

    const panelId = `footer-accordion-panel-${index}`;
    panel.id = panelId;
    heading.setAttribute('role', 'button');
    heading.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    heading.setAttribute('aria-controls', panelId);
    heading.setAttribute('tabindex', '0');

    const toggle = () => {
      const expanded = heading.getAttribute('aria-expanded') === 'true';
      heading.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    };

    heading.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 768px)').matches) {
        toggle();
      }
    });
    heading.addEventListener('keydown', (e) => {
      if (window.matchMedia('(max-width: 768px)').matches && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        toggle();
      }
    });
  });

  /**
   * Newsletter section (after footer content)
   */
  const newsletterWrapper = document.createElement('div');
  newsletterWrapper.className = 'footer__newsletter';
  const newsletterBlock = document.createElement('div');
  newsletterBlock.className = 'newsletter block';
  newsletterBlock.dataset.blockName = 'newsletter';

  await loadCSS(`${window.hlx.codeBasePath}/blocks/newsletter/newsletter.css`);
  const { default: decorateNewsletter } = await import('../newsletter/newsletter.js');
  await decorateNewsletter(newsletterBlock);

  newsletterWrapper.appendChild(newsletterBlock);
  footer.appendChild(newsletterWrapper);

  block.append(footer);
}