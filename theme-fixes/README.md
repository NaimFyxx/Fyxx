# Fyxx theme fixes — Clarity JavaScript errors

Store: **Fyxx** (`drynksapp.myshopify.com` → www.myfyxx.com)
Theme: **Expanse** by Archetype Themes, schema v8.0.0
Live theme ID: `173678428407` ("2025 V.4.0")
Fix staged in unpublished theme ID: `178335023351` ("Fyxx — scrollHandler fix (2026-06-14)")

## Issue 1 — `this.scrollHandler` is undefined (≈88% of all JS errors)

Microsoft Clarity reported 363,118 JS errors. The top three were the same bug
seen by three browsers:

- `undefined is not an object (evaluating 'this.scrollhandler.bind')`  (Safari, 56.14%)
- `cannot read properties of undefined (reading 'bind')`               (Chrome, 31.58%)
- `can't access property "bind", this.scrollhandler is undefined`      (Firefox, 0.26%)

### Root cause

In `assets/header.nav.js`, custom code labelled "SAMI Close compressed desktop
nav on scroll down" was added, and in the process the **entire `scrollHandler()`
method was commented out** — but the line that calls it was left in place:

```js
stickyHeaderScroll() {
  ...
  requestAnimationFrame(this.scrollHandler.bind(this))   // calls scrollHandler
}

/*
  scrollHandler() { ... }                                // method commented out
*/
```

The store's sticky header is enabled, so every scroll event runs
`stickyHeaderScroll()`, which calls `.bind()` on the now-missing method and
throws on every scroll frame. Side effect: the sticky header also stopped
compressing on scroll.

### Fix

Un-comment the `scrollHandler()` method (remove the `/*` and `*/` wrapping it).
Also removed a leftover `console.log('Scrolling down, closing desktop compressed
nav')` from the custom scroll handler to stop console noise on every scroll.

- `header.nav.original.js` — the live (buggy) file, kept for rollback reference.
- `header.nav.js` — the corrected file (matches the staged draft theme).

### How to ship

1. Online Store → Themes → "Fyxx — scrollHandler fix (2026-06-14)" → **Preview**.
2. Scroll the homepage and a product page; confirm the header compresses on
   scroll and the browser console shows no `scrollHandler` errors.
3. If good, **Publish** that theme (publishing must be done from Shopify admin;
   it is intentionally blocked over the API).

## Issue 2 — `theme.js` xmasButton cleanup (applied to draft 178335023351)

Leftover seasonal "See December Offers" code in `assets/theme.js` registered a
`MutationObserver` on the entire `document.body` subtree that ran a DOM update +
`console.log("Mutation Fired!")` on every mutation. It was gated on a
`#xmasButton` element that no longer exists, so it was dormant — but it was dead
code, console noise, and a latent INP landmine.

Removed the xmasButton block; kept the license header, console banner, Archetype
design-mode beacon, and the core `page:loaded` dispatch. The `lion-loyalty`
snippet (in `theme.liquid`, not this file) was intentionally left in place.

- `theme.original.js` — original file, kept for rollback reference.
- `theme.js` — cleaned file (matches the staged draft theme).

## Issue 3 — Safari variant pickers not selectable (APPLIED to draft 178335023351)

On Safari only (desktop + mobile), tapping a product variant button (e.g. the
"Size" options) did nothing — price/availability never updated.

### Root cause

Each variant button is a `<button type="button">` nested inside the `<label>`
that wraps the radio `<input>`:

```html
<label class="element-radio" for="…">
  <input type="radio" name="Size" value="70cl">
  <button type="button" class="element-button">70cl</button>
</label>
```

Per the HTML spec, clicking interactive content (a `<button>`) inside a `<label>`
suppresses the label's activation behavior, so the radio is never checked and its
`change` event never fires. Safari enforces this; Chromium/Firefox toggle the
radio anyway — so the bug was Safari-only. `block.product-variant-picker.js`
only runs its visible update on the `change` event (the mousedown/touchstart
handler merely prefetches), so on Safari nothing happened.

### Fix

Append to `assets/overrides.css` (see `overrides.append.css`):

```css
.variant-button-wrap label .element-button { pointer-events: none; }
```

This makes the inner button click-through, so the tap lands on the `<label>`,
selects the radio natively, and fires `change`. The button has `type="button"`
and no handler of its own, so nothing is lost. Scoped to `.variant-button-wrap`
so Add to cart and other `.element-button`s are unaffected.

Applied: appended to the end of `assets/overrides.css` in draft theme
178335023351 (verified, file 2445 → 2715 bytes, no userErrors). All existing
rules preserved.

## Still open (not yet fixed)

- **Module-specifier errors** (~0.4% of errors): `list.product-card.swatches`,
  `element.accordion`, `section.header` "does not start with '/', './', or
  '../'". These are ES-module bare specifiers resolved via the theme's importmap
  / `es-module-shims`; they fail on a small slice of browsers. Worth a follow-up.
- **Performance / INP = 992 ms (poor)**: interaction latency, not covered by the
  scrollHandler fix. Likely third-party app scripts on the main thread. Needs a
  separate investigation.
