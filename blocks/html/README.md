# HTML Block

## Overview

The HTML block allows arbitrary HTML content (including comment-wrapped markup) and initializes Swiper sliders for category and product carousels. It processes each cell in the block to replace specific HTML comments with real DOM nodes, then waits for slider containers and initializes Swiper with navigation and pagination.

## Integration

### Block Configuration

No block configuration is read via `readBlockConfig()`. The block only processes existing DOM children.

### URL Parameters

No URL parameters are directly read by the HTML block.

### Local Storage

No localStorage keys are used directly by this block.

### Events

#### Event Listeners

None. Swiper handles its own touch/keyboard and navigation events.

#### Event Emitters

None.

### Content Structure

- Block structure is table-like: rows and columns (e.g. `div` rows, each with `div` columns).
- **Comment processing**: For each column, the block walks comment nodes. If a comment’s text content starts with `<div`, it is treated as HTML: parsed in a temporary container and the comment node is replaced by the parsed element’s first child. This allows authoring HTML inside comments in the document.

### Slider Selectors and Options

- **Category slider**: Waits for `.category-slider-items` via `waitForElm()`, then initializes Swiper with:
  - `slidesPerView: 8`, `loop: false`, `spaceBetween: 30`
  - Pagination: `.swiper-pagination` (clickable)
  - Navigation: `.swiper-button-next`, `.swiper-button-prev`
- **Product slider**: Waits for `.product-slider-items`, then initializes with:
  - `slidesPerView: 6`, same loop/space/pagination/navigation pattern as above.

## Behavior Patterns

- **Decorate**: Runs once; processes comments in all row/column cells, then sets up two `waitForElm` promises (one for category slider, one for product slider). Each promise, when the element appears, calls `swiperInit()` with the options above.
- **Dependencies**: Relies on `scripts/swiper-slider.js` (`swiperInit`) and `scripts/waitForElm.js` for deferred initialization.

## User Interaction Flows

1. Users see the block’s HTML content; any comment-unwrapped markup is visible as normal elements.
2. When category or product slider containers exist, Swiper initializes: users can swipe, use next/prev buttons, and click pagination to navigate slides.

## Error Handling

- **Swiper init failure**: Each `waitForElm().then()` uses try/catch; on error, `console.error('Error initializing category slider', error)` or `console.error('Error initializing product slider', error)` is logged. The block does not throw; the rest of the page is unaffected.
- **Missing elements**: If `.category-slider-items` or `.product-slider-items` never appear, `waitForElm` never resolves; no slider is initialized for that selector. No error is thrown.

## Files

- `html.js` – Comment processing and Swiper initialization for category and product sliders
- `html.css` – Styles for the HTML block content and sliders
