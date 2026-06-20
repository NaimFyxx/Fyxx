# 9.1.0 migration (draft theme 178480546039)

The 9.1.0 update is a fresh Archetype base — it carries NONE of the custom code.
Tracking what's been re-applied and what's left.

## oos-hidden (hide tagged products from browse) — DONE for 3 surfaces
Re-applied the `unless ... contains 'oos-hidden'` guard to the product loops in:
- snippets/section.main-collection.liquid  (collection pages)
- snippets/section.main-search.liquid      (search results)
- snippets/section.featured-collection.liquid (homepage "Staff Picks" etc. — both carousel + grid loops)

NOTE: these all render via the shared `snippets/list.product-card.liquid`. Other
surfaces that use the same snippet — product **recommendations** and
**recently-viewed** — are NOT yet guarded. If OOS products appear there too, the
cleanest long-term fix is a single guard at the top of `list.product-card.liquid`.

## Still to migrate (custom code present on live 8.0.0, absent on 9.1.0 base)
- assets/overrides.css — merchant custom rules (Christmas-page header/footer
  hides, iPad-Air header media queries) + the Safari variant-picker fix.
  (9.1.0's overrides.css has a different base; the custom rules must be appended.)
- Safari variant fix — verify 9.1.0 still nests a <button> inside the variant
  <label>; if so, re-add `.variant-button-wrap label .element-button { pointer-events:none }`.
- assets/header.nav.js — the "SAMI close compressed desktop nav on scroll down"
  custom feature (9.1.0's scrollHandler is intact/unbroken; this is an add-on).
- layout/theme.liquid — the big one: Microsoft Clarity tag, Google/Facebook
  verification metas, SEO keywords meta, GA gtag, the "Download the App" PA Floater
  (mobile sticky banner), the friday.myfyxx.com redirect, lion-loyalty icon resize,
  samita-custom render. SKIP obsolete: shogun/pagefly includes (apps removed),
  xmasButton (dead seasonal code).
- assets/theme.js — already clean/identical on 9.1.0; nothing to do.

---
## Update — decisions applied
- **overrides.css** — NOT migrated (Christmas hides + iPad-Air media queries
  dropped per request). Safari variant fix: pending a check of 9.1.0 markup.
- **header.nav.js** — DONE. Migrated the "close compressed nav on scroll" feature,
  improved: passive listener, reuses cached refs, animates shut via
  prepareTransition (matches the open), null-safe. Wrapped in FYXX CUSTOM markers.
- **theme.liquid** — TO DO. Carry all custom blocks EXCEPT the friday redirect
  (and the already-excluded PageFly/Shogun includes + xmasButton).

## Custom-code marker convention (so customizations are easy to find later)
- Liquid: `{% comment %} FYXX CUSTOM: ... {% endcomment %}` ... `{% comment %} END FYXX CUSTOM {% endcomment %}`
- JS / CSS: `/* ===== FYXX CUSTOM: ... ===== */` ... `/* ===== END FYXX CUSTOM ===== */`
- TODO: retrofit the oos-hidden wraps (collection/search/featured-collection) with these markers.

---
## theme.liquid + SEO — DONE
Merged into 9.1.0 theme.liquid (all FYXX CUSTOM-marked):
- **FYXX CUSTOM SEO**: google-site-verification, facebook-domain-verification x2,
  keywords meta, robots meta (`index, follow, nocache`). These ARE the SEO agency's
  changes — confirmed by checking the old live theme 173678428407.
- Microsoft Clarity, Dunbar Text web font, PA Floater (app-download banner),
  Lion-loyalty icon tweak.
- Commented-out GA(UA) block kept for reference (still inactive).
- EXCLUDED: friday.myfyxx.com redirect, PageFly/Shogun includes, xmasButton,
  and the commented-out NAIM/SAMI seasonal sections.

### SEO investigation (source of truth: previous live theme 173678428407)
- `templates/robots.txt.liquid`: does NOT exist → Shopify default robots.txt (nothing custom to carry).
- `snippets/head.page-title.liquid` & `snippets/head.social-meta-tags.liquid`:
  byte-identical to stock Archetype (only the doc-comment format differs) → NO agency changes there.
- No `seo` / `schema` / `json-ld` / `structured-data` / `hreflang` / `organization` snippet exists.
- Conclusion: the SEO agency's work = the theme.liquid head metas above, now migrated + marked FYXX CUSTOM SEO.

### Samita
Samita is a Shopify app (applies automatically on publish). The old `samita-custom.liquid`
theme override was NOT migrated. NOTE: an orphaned `snippets/samita-custom.liquid` was briefly
created then de-referenced from theme.liquid (API can't delete files) — it is inert; delete it
manually in the theme editor if desired.

## Markers + Safari fix — DONE
- **oos-hidden markers** — retrofitted FYXX CUSTOM markers onto all three wraps
  (collection / search / featured-collection: both carousel + grid loops). Upserted
  to draft 178480546039.
- **Safari variant-picker fix** — DONE. Verified 9.1.0 still nests
  `<button type="button">` (from element.button) inside the radio `<label>` within
  `.variant-button-wrap`, so the bug persists. Instead of overrides.css (retired), the
  fix is co-located in `snippets/block.product-variant-picker.button.liquid` as a
  `{% stylesheet %}` block (FYXX CUSTOM-marked):
  `.variant-button-wrap label .element-button, .variant-button-wrap label button { pointer-events: none; }`
  This lets the tap fall through to the `<label>`, which toggles the radio. The button
  is presentational (`type="button"`), so no functional downside on any browser.

## Header quick-links + slim nav + search jank (added after preview feedback)
Root cause of the "missing 3 buttons": the live theme renders a custom snippet
`custom.secondary-menu-header` (authored by NAIM) via a hook in
`snippets/section.header.liquid`. Neither came across in the 9.1.0 update, so the
draft fell back to the full 15-item `main-navigation` menu. Header *settings*
(header-group.json) are byte-identical between live + draft — the difference was
purely this custom code. (The only thing that ever hid the quick-links was an
iPad-Air media query in the retired overrides.css.)

Applied to draft 178480546039 (all FYXX CUSTOM-marked):
- **snippets/custom.secondary-menu-header.liquid** — re-created (cleaned up): renders
  linklist `secondary-menu-test` (Home/Shop/Rewards) inline on desktop.
- **Slim desktop nav** (in that same snippet's <style>): surfaces the theme's
  hamburger at all times on desktop and hides the full 15-item nav row until the
  hamburger toggles it open (reuses the native compress-menu click handler in
  header.nav.js — no fragile JS). Quick-links become the primary desktop nav.
- **snippets/section.header.liquid** — added the `{% render 'custom.secondary-menu-header' %}`
  hook (same spot the live theme used).
- **snippets/form.predictive-search.liquid** — added `overscroll-behavior: contain`
  (+ -webkit-overflow-scrolling) to `.search__results` to stop the results panel's
  scroll from chaining into the page behind it (likely cause of the "janky" scroll;
  the desktop typing path never scroll-locks the body). Speculative on exact symptom
  — needs preview confirmation.

NOTE on possible redundancy: desktop now shows BOTH the quick-links AND (behind the
hamburger) the full menu. If that feels like too much, easiest options: (a) drop the
quick-links and keep just the hamburger, or (b) keep quick-links and restructure
`main-navigation` into nested dropdowns. Decide after previewing.

## 9.1.0 migration — COMPLETE
All custom code re-applied to draft 178480546039 and marked FYXX CUSTOM. Remaining
manual steps for the merchant: preview the draft thoroughly (esp. Safari variant
tapping + OOS hiding on collections/search/homepage), then publish; optionally delete
the orphaned `snippets/samita-custom.liquid` in the theme editor.
