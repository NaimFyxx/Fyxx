# Fyxx (myfyxx.com) — Project Handoff Brief

Paste this into a new Claude Code chat to give it history. It summarizes everything
implemented on the Fyxx Shopify storefront in prior sessions.

## Store & stack
- **Store:** Fyxx — alcohol delivery, Amman Jordan. www.myfyxx.com (`drynksapp.myshopify.com`)
- **Theme:** Expanse (Archetype Themes), v9.1.0 (migrated up from 8.0.0)
- **Live/MAIN theme id:** `178546409719` ("2026 V.5.3 [Published Jun 22] - Fyxx Cup")
- **Brand:** Fyxx pink accent `#f0b09e`, warm black `#231F20`, rewards gold `#9C7C3E`/`#E6C964`.
  Fonts = theme's own: **Libre Baskerville** (headings), **Figtree** (body). Slogan: "sip back and relax".
- All custom edits are marked with `FYXX CUSTOM` comments in the code.

## Deploy / Git workflow (IMPORTANT)
- The live theme is version-controlled via the **Shopify↔GitHub integration** on repo
  **`NaimFyxx/Fyxx-Store-Website`**, branch **`main`**. **Push to `main` → auto-deploys to live.**
- Make ALL code changes in the repo (commit → push). **Do NOT use Shopify's admin code editor**
  (two-way sync = conflict risk). `git pull` before pushing after any admin/theme-editor edits.
- Direct theme writes via the Shopify Admin API are **blocked on the live/MAIN theme** — go through Git.

## What was built (with file paths in the repo)

### Custom header — `sections/fyxx-header.liquid`
- Self-contained section (CSS + markup + JS + schema). Floating white style.
- Brand logo SVGs (black/white auto-swap), reuses the theme's predictive search, account/greeting.
- Quick links: **Shop · Rewards · TGR** (TGR → `/pages/the-green-room`), fixed ~110px width.
- 2-level nav: desktop dropdowns + drawer accordions (from `linklists['main-navigation']`).
- Left slide-in nav drawer with the "sip back and relax" slogan SVG (sized 20px).
- Wired into `sections/header-group.json` (header section `type` = `fyxx-header`).

### Custom cart drawer — `sections/fyxx-cart-drawer.liquid`
- Right-side slide-in drawer matching the brand design (replaces the theme's stock slide-down cart,
  which is no longer rendered by the header). Registered as a section in `header-group.json`.
- Renders the real cart via Liquid; qty steppers + remove via Shopify AJAX cart + Section Rendering API.
- **Opens only when the cart icon is clicked** (event `fyxx-cart:open`); adding to cart is **silent**
  (no auto pop-out) — badge updates via a fetch hook.
- Checkout button navigates straight to `/checkout` (theme JS was swallowing the form submit);
  dynamic Apple/Shop Pay buttons via `{% form 'cart' %}`.
- Product-image thumbnails sit on **white** (transparent-PNG bottles were showing a grey box).
- Requires theme setting **Cart type = Dropdown** (config/settings_data.json) for silent AJAX add.

### Loyalty Price block (member/tier pricing per bottle) — `sections/main-product.liquid`
- Custom in-house block (shows member pricing by `customer.metafields.loyaltylion.loyalty_tier`).
- Snippets `snippets/block.product-loyalty-points.liquid` + `snippets/product-loyalty-points.liquid` exist.
- Migration had dropped the wiring; restored the `when 'loyalty_price'` case branch + the
  `{"type":"loyalty_price"}` schema block. Block is placed in `templates/product.json`.

### Hide vendor everywhere
- Product cards: off via setting `vendor_enable=false`. Product page: off (title block).
- Predictive search dropdown was hardcoded-on → set `predictive_search_show_vendor = false`
  in `snippets/section.search-results.liquid`.

### Hide out-of-stock products (`oos-hidden` tag)
- 828 products tagged. Hidden from collections, search, homepage featured collections via
  `snippets/section.main-collection.liquid`, `section.main-search.liquid`, `section.featured-collection.liquid`.
  Direct product URLs still reachable.

### Fixes in `layout/theme.liquid`
- FYXX CUSTOM SEO metas (google-site-verification, 2× facebook-domain-verification, keywords, robots).
- Microsoft Clarity, Dunbar Text font, Lion loyalty icon resize.
- **Apple Smart App Banner** meta (`app-id=1489325138`) for iOS; the custom "Download the App"
  PA Floater is now **Android-only** (centered bottom, mobile).
- Renders the Fyxx Cup button before `</body>`.

### Other fixes
- **Safari variant picker:** `snippets/block.product-variant-picker.button.liquid` — `pointer-events:none`
  on the nested button so radio labels activate on Safari.
- **Predictive search scroll jank:** `overscroll-behavior:contain` in `snippets/form.predictive-search.liquid`.

### Fyxx Cup 2026 floating button — `snippets/fyxx-cup-fab.liquid`
- Dismissible promo FAB (localStorage), rendered site-wide before `</body>` in `theme.liquid`.
- Bottom-LEFT (clear of the centered app banner + bottom-right chat). Bigger on desktop,
  raised to `bottom:84px` on mobile. Opens in a new tab.

## OPEN / pending item
- **Update the Fyxx Cup button href** in `snippets/fyxx-cup-fab.liquid` to:
  `https://passport.myfyxx.com?utm_source=website&utm_medium=promo&utm_campaign=fyxx_cup_2026&utm_content=floating_cta_floating_button`
  (replaces the older `...?utm_source=myfyxx_store&utm_medium=floating_button&utm_campaign=fyxx_cup_2026`).
  Apply in the repo → commit → push `main`.

## Notes
- Cart-related apps (gift wrap/options, upsells, auto-add) historically injected into the theme's
  native cart; with the custom drawer, verify they still surface where needed.
- Older theme backups exist in the library (e.g. `178496667895` V.5.2, `178335023351` V.5.0).
