# Footer Block

## Overview

The Footer block provides the site-wide footer: link sections loaded from a fragment, optional store switcher for multistore setups, and an embedded newsletter subscription form. Footer content is structured as headings with link lists; on mobile, sections become accordions. The newsletter block is rendered after all footer content.

## Integration

### Block Configuration

No block configuration is read via `readBlockConfig()`. The footer uses metadata and fragments.

### URL Parameters

No URL parameters are directly read by the footer block.

### Local Storage

No localStorage keys are used directly by this block.

### Events

#### Event Listeners

None. The embedded newsletter block handles its own form and modal events.

#### Event Emitters

None.

### Metadata

- **`footer`** – Path or URL to the footer fragment. If missing, defaults to `/footer`. The fragment is loaded via `loadFragment()` and its child elements are appended as footer content.

### Fragment Structure

- **Footer fragment** (`/footer` or metadata value): Each block (`.block`) is treated as a section. First row becomes the section heading (e.g. `h3`), remaining rows become list items; links and HTML inside cells are preserved.
- **Store switcher fragment** (`/store-switcher`): Used only when `isMultistore()` is true. Loaded to build the store view modal content.

## Behavior Patterns

### Multistore

- When `isMultistore()` is true, a store switcher button is rendered at the top of the footer. Clicking it opens a modal with store/view links from the store-switcher fragment. The current store is derived from `getRootPath()` (link whose pathname starts with root is shown as selected).

### Content Sections

- Fragment blocks are converted to semantic structure: first cell → `h3`, remaining cells → `ul`/`li` with content (including links) preserved.
- Sections receive the class `footer-accordion-section` for styling and accordion behavior.

### Mobile Accordion

- Below 769px, each section heading acts as a button that toggles the visibility of its list (`aria-expanded`, `aria-controls`, `role="button"`, `tabindex="0"`). Click or Enter/Space toggles the panel. First section is expanded by default.

### Newsletter

- After all footer content and accordion setup, the block dynamically loads the newsletter block (CSS + `newsletter.js` decorator) and appends it inside a wrapper (`.footer__newsletter`). The newsletter provides an email input and submit button and shows success/error in a modal.

## User Interaction Flows

1. **Desktop**: Footer shows link sections in a grid; store switcher (if any) opens a modal to change store/view.
2. **Mobile**: Section headings are clickable; tapping toggles the list below. Store switcher and newsletter behave the same as desktop.
3. **Newsletter**: User enters email and submits; validation and GraphQL subscription run; result is shown in a modal (success or error).

## Error Handling

- **Footer fragment load failure**: Caught in try/catch; `console.warn` is used; block still renders with empty content and (if multistore) store switcher and newsletter.
- **Store switcher fragment failure**: On load error, `console.error` is used and the function returns early so the rest of the footer (including fragment content) is not rendered when multistore is true.
- **Newsletter**: Errors are handled inside the newsletter block (validation and API errors shown in the modal).

## Files

- `footer.js` – Main block logic: fragment load, store switcher, list conversion, accordion setup, newsletter injection
- `footer.css` – Footer layout, store switcher, accordion, and newsletter-in-footer styles
