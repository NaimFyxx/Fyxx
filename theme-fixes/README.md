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

## Still open (not yet fixed)

- **Module-specifier errors** (~0.4% of errors): `list.product-card.swatches`,
  `element.accordion`, `section.header` "does not start with '/', './', or
  '../'". These are ES-module bare specifiers resolved via the theme's importmap
  / `es-module-shims`; they fail on a small slice of browsers. Worth a follow-up.
- **Performance / INP = 992 ms (poor)**: interaction latency, not covered by the
  scrollHandler fix. Likely third-party app scripts on the main thread. Needs a
  separate investigation.
