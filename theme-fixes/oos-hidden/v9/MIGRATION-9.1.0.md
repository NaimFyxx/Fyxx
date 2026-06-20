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

## Still open
- Retrofit FYXX CUSTOM markers onto the oos-hidden wraps (collection/search/featured-collection).
- Safari variant-picker fix: verify whether 9.1.0's variant markup still needs it.
