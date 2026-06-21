# Fyxx theme work — summary for records

**Store:** www.myfyxx.com (Shopify, Expanse theme by Archetype Themes)
**Branch:** `claude/intelligent-bohr-63ypp4`
**Status (2026-06-21):** all work staged on the 9.1.0 **draft** theme, ready for the
merchant to preview + publish. Nothing was published from the tooling side
(theme publishing is done manually in Shopify admin).

---

## Theme IDs

| Theme | ID | Role |
|---|---|---|
| 2025 V.4.0 (old original, 8.0.0) | `173678428407` | UNPUBLISHED — SEO source of truth |
| 2026 V.5.0 [Published Jun 20] | `178335023351` | The previously-live 8.0.0 theme |
| Updated copy of 2026 V.5.0 (9.1.0) | `178480546039` | **The draft we built on → publish this** |

> Shopify menus (linklists) and products are **store-level**, shared by all themes.
> None of the live store's menus/products were modified by this work except the
> deliberate OOS-hidden product tagging (the backfill).

---

## What was done

### 1. Clarity errors + performance
- Fixed the `scrollHandler`/`header.nav.js` bug responsible for the bulk of the
  JS errors Clarity reported; removed dead `xmasButton` code from `theme.js`.
- INP diagnosis: the poor P75 is driven by third-party apps (cdn.506.io, Klaviyo,
  GTM, Samita labels), not the theme. Re-measure ~7 days after publish.

### 2. Hide out-of-stock products (`oos-hidden` tag)
- Tagged/untagged products by `custom.in_stock_online` (tracking-enabled, active/draft
  only) — **828 products tagged** in the backfill (see `oos-hidden/BACKFILL.md`).
- Hide `oos-hidden`-tagged products from **collections, search, and the homepage
  featured collections**, while keeping direct product URLs reachable.
- Files: `snippets/section.main-collection.liquid`, `section.main-search.liquid`,
  `section.featured-collection.liquid` (FYXX CUSTOM-marked).
- NOTE: product recommendations / recently-viewed use the same `list.product-card`
  and are NOT guarded — flagged for a future single guard if needed.

### 3. Safari variant-picker fix
- Root cause: a `<button>` nested in the radio `<label>` suppressed label activation
  on Safari (desktop + mobile). Fix: `pointer-events:none` on the nested button,
  co-located in `snippets/block.product-variant-picker.button.liquid`.

### 4. Search "janky results"
- Added `overscroll-behavior: contain` to the predictive-search results panel
  (`snippets/form.predictive-search.liquid`) to stop scroll-chaining into the page.

### 5. `theme.liquid` migration (all FYXX CUSTOM-marked)
- Carried over: Microsoft Clarity, SEO metas (google-site-verification, 2×
  facebook-domain-verification, keywords, robots) marked **FYXX CUSTOM SEO**,
  Dunbar Text font, Lion-loyalty icon resize, and the "Download the App" floater.
- Excluded per request: friday.myfyxx.com redirect, PageFly/Shogun includes,
  xmasButton, Samita override (Samita re-applies automatically on publish).

### 6. App-download banner (option A)
- Added **Apple Smart App Banner** `<meta name="apple-itunes-app" content="app-id=1489325138">`
  — iOS Safari now auto-detects install state ("Open" vs "Get").
- The custom "PA Floater" is now **Android-only** (iOS uses the native banner).

### 7. New header (`sections/fyxx-header.liquid`)
- Ported the approved prototype into a self-contained section (CSS + markup + JS +
  schema), swapped into the header group in place of the stock `header` section.
- Reuses the theme's proven pieces: predictive search, slide-out cart drawer,
  `{% if customer %}` account/greeting. Menus from `linklists` (main-navigation is
  already a real 2-level menu → dropdowns + drawer accordions).
- Uses the **theme's configured fonts** (no override) and the real **brand logo +
  "Sip Back & Relax" slogan SVGs** (black/white auto-swap by header theme).
- Quick links: **Shop · Rewards · TGR** (TGR → /pages/the-green-room), fixed 110px
  uniform width, desktop centered between search + account, mobile at drawer top.
- Design toggles exposed as section settings (header style/theme, quick-link style,
  full-menu slim/always, search style, mobile-search position, overlay, accent).

---

## Manual / follow-up items (merchant)

- [ ] Preview the 9.1.0 draft thoroughly, then **Publish** (Online Store → Themes → ⋯ → Publish).
- [ ] Load the brand woff2 font files into the theme's font settings (header inherits them automatically).
- [ ] Test the Apple Smart App Banner on a real iPhone in Safari.
- [ ] (Optional) Delete the orphaned `snippets/samita-custom.liquid` in the theme editor.
- [ ] (Optional, later) Guard recommendations/recently-viewed for OOS-hidden if needed.
- [ ] Re-check INP P75 ~1 week after publish; revisit third-party app weight.

## Rollback
- **Header**: in `sections/header-group.json`, set the `header` section `type` back
  to `"header"` (the stock `section.header.liquid` is untouched and intact).
- Other changes are isolated, FYXX CUSTOM-marked edits — revert per file as needed.

---

## Repo file map (`theme-fixes/`)

| Path | What it is |
|---|---|
| `v9/fyxx-header.liquid` | The new header section (final) |
| `v9/header-group.json` | Header group pointing at `fyxx-header` |
| `v9/section.header.liquid` | Earlier slim-nav header work (superseded by fyxx-header) |
| `v9/custom.secondary-menu-header.liquid` | Earlier quick-links snippet (superseded) |
| `v9/block.product-variant-picker.button.liquid` | Safari variant fix |
| `v9/form.predictive-search.liquid` | Search scroll fix |
| `v9/theme.liquid` | Migrated layout (SEO, Clarity, floater, smart app banner) |
| `v9/header.nav.js` | Migrated header scroll feature |
| `v9/MIGRATION-9.1.0.md` (under oos-hidden) | Migration tracker/notes |
| `oos-hidden/v9/*.liquid` | OOS-hidden guards (collection/search/featured) |
| `oos-hidden/BACKFILL.md`, `backfill_tagged_ids.txt` | Backfill record (828 products) |
| `preview/HANDOFF.md`, `fyxx-header-prototype-final.html` | Approved header handoff + prototype |
| `preview/header-prototype.html` | Earlier interactive prototype |
| `header.nav.js` / `theme.js` (+ `.original`) | Early Clarity fixes + originals |
| `overrides.append.css` | Notes on retired overrides.css rules |

See `git log` on `claude/intelligent-bohr-63ypp4` for the full commit-by-commit history.
