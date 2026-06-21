# Fyxx Header — Claude Code Handoff

Port the approved header prototype into the Shopify (Liquid) theme.

**Source of truth:** `fyxx-header-prototype.html` (single self-contained file: one `<style>`, one vanilla `<script>`, no frameworks).
**Goal:** a `header` section + drawer snippet that matches the prototype 1:1, driven by theme settings and the `customer` / `cart` / `linklists` objects.

---

## 1. What to DELETE (prototype-only scaffolding)

Everything below exists only so the design could be previewed and toggled in a browser. None of it goes into the theme.

- The **control panel** — the whole `<div class="proto-controls">…</div>` block and every `.proto-controls` CSS rule.
- The **device frame / stage** — `.proto-stage` and `.proto-frame` wrappers and CSS. In the theme the header sits directly in the document; it is not inside a fixed-width frame.
- The **faux page content** — `.header-hero` section and `.proto-filler` (the green "Tapas & Cocktails" placeholder) and their CSS.
- The **font `<link>` to Google Fonts** in `<head>` — replace per section 5.
- The **JS control-panel handler** — the `document.querySelectorAll('.proto-controls input')…` block in the script. Keep the rest of the script (hamburger, drawer, dropdowns, accordions, search).
- All **`body.is-mobile …` CSS rules** — these drive the *preview* Mobile toggle only. The real responsive behavior is the `@media (max-width: 768px)` blocks, which already mirror them. Keep the `@media` rules, drop the `.is-mobile` ones.

After deletion, the `data-*` attributes on `<body>` (e.g. `data-theme="white"`) become **theme settings output** — see section 4.

---

## 2. What to KEEP and port

- Announcement bar
- Header top row: hamburger, wordmark, search, quick links, account, cart
- Main menu row (`.main-nav`) — only used in "always-visible row" mode; keep it but it's optional
- Slide-in nav drawer (`.nav-drawer`) — used on BOTH desktop and mobile
- Search results dropdown + dim overlay
- All theme CSS (tokens, floating style, drawer, etc.)
- The script's interaction logic

---

## 3. Liquid / dynamic data wiring

Replace the static placeholders with real objects:

| Prototype placeholder | Replace with | Notes |
|---|---|---|
| `<a class="site-logo">fyxx</a>` | logo image or text, linked to `{{ routes.root_url }}` | Swap the text wordmark for the real logo if desired (white logo on dark, black on light — follows surface). |
| `placeholder="Search wines, spirits, cigars…"` + results dropdown | Shopify **predictive search** (`routes.predictive_search_url` / `/search/suggest.json`) | The 4 hardcoded result rows are dummy data. Wire to predictive search and render real products. |
| Account button (two SVGs: `.icon-account`, `.icon-logout`) | `{% if customer %}` logout icon linking to `{{ routes.account_logout_url }}`, `{% else %}` account icon linking to `{{ routes.account_login_url }}` | The icon swap is already built; just gate which `<a>`/icon renders on `customer`. |
| `<span class="welcome-msg">Welcome back, <b>Christina</b></span>` | `{% if customer %}Welcome back, <b>{{ customer.first_name }}</b>{% endif %}` | Desktop only (already hidden on mobile in CSS). |
| Cart button + `<span class="cart-count">2</span>` | link to `{{ routes.cart_url }}`, count = `{{ cart.item_count }}` | Hide the badge when `cart.item_count == 0` (optional). |
| Menu items (15 links + the 6 dropdowns) | a **navigation linklist** (e.g. `{{ linklists.main-menu.links }}`) | So the menu is editable in admin. Two levels: a top link with `link.links` becomes a dropdown (desktop) / accordion (drawer). The 6 caret items map to parent links that have children. |
| Quick links (Shop, Rewards) | a small linklist (e.g. `quick-links`) or hardcode | Desktop: in the header row. Mobile: at the top of the drawer (already structured that way). |
| Announcement text | a theme setting (richtext/text) | See section 4. |

**Account icon logic in one place:** logged-out shows the person icon → login; logged-in shows the log-out (door/arrow) icon → `account_logout_url`, plus the "Welcome back, {first name}" greeting in the top-right.

---

## 4. Theme settings map (so it's seasonally editable, no code)

Expose each prototype toggle as a setting in `settings_schema.json` (or section settings), then output it on the header wrapper as a `data-*` attribute (or inline CSS variables). The CSS already keys off these exact attribute values.

| Setting (suggested) | Type | Options / value | Drives `data-*` | Default (Naím's approved config) |
|---|---|---|---|---|
| Header style | select | `bar` / `floating` | `data-headerstyle` | **floating** |
| Header theme | select | `black` / `white` | `data-theme` | **white** |
| Quick-link button style | select | `solid` / `outline` / `soft` | `data-quickstyle` | **solid** |
| Full menu | select | `slim` (behind hamburger) / `always` | `data-fullmenu` | **slim** |
| Show quick links | checkbox | on / off | `data-quick` | **on** |
| Mobile search position | select | `inline` / `line` | `data-msearch` | **line (own line)** |
| Search style | select | `pill` / `filled` / `square` | `data-search` | **pill** |
| Search dim overlay | checkbox | on / off | `data-overlay` | **on** |
| Fyxx pink | color | hex | `--accent` | `#f0b09e` |
| Warm black | color | hex | `--header-fg` (dark) | `#231F20` |
| Rewards gold | color | hex | (future) | `#9C7C3E` |
| Announcement text | text | string | — | "Get Your Fyxx Daily from 10 AM till Midnight" |

`data-account` (logged in/out) is **not** a setting — it's driven by the `customer` object at render time.

Output example on the header wrapper:
`<header class="site-header" data-headerstyle="{{ settings.header_style }}" data-theme="{{ settings.header_theme }}" …>`
(Or set these on a wrapper that contains the announcement bar + header + drawer, since the CSS selectors are written as `body[data-…]`. Either move them to `<body>` via the theme's body tag, or change the selectors to target the wrapper. Targeting a wrapper is cleaner than editing `<body>`.)

---

## 5. Fonts

The prototype loads **Syne** (buttons + announcement), **Baskervville** (wordmark + serif display), and **Inter** (UI text) from Google Fonts for preview only.

In the theme, do **one** of:
- **Theme font settings (`font_picker`)** — Shopify serves these from its own CDN (no third-party link). Syne, Baskervville, and Inter are all in Shopify's font library. Output with `{{ settings.x_font | font_face }}` and point the CSS variables (`--button-font`, `--serif`, `--ui-font`) at them.
- **Self-host** the woff2 files in `assets/` and declare `@font-face`.

Do not keep the `fonts.googleapis.com` `<link>` (matches the no-third-party-CDN rule).

---

## 6. Drawer = fixed in production

In the prototype the drawer + scrim + search overlay are `position: absolute` inside `.proto-frame`. In the theme:
- `.nav-drawer`, `.drawer-scrim`, `.search-overlay` → `position: fixed` to the viewport (full height), high `z-index`.
- The drawer is used on **both desktop and mobile** (hamburger opens it on desktop in slim mode; mobile always uses it).
- Keep `pointer-events` gating (already in place) so hidden overlays never eat clicks.

---

## 7. Quick-links placement (intentional, keep it)

- **Desktop:** quick links sit in the header row, centered between the search pill and the account icon (done with balanced auto-margins).
- **Mobile:** quick links are hidden from the header and appear at the **top of the drawer**, before the menu links (already structured: `.drawer-quick`, shown only ≤768px).
- The "sip back and relax" tagline is pinned at the **bottom of the drawer**, larger (24px italic serif). It will also go in the **site footer, centered** later (separate task).

---

## 8. Class names (semantic, ready to map)

`announcement-bar`, `site-header`, `header-inner`, `nav-toggle`, `site-logo`, `header-search` / `search-field` / `search-input` / `search-submit` / `search-results`, `quick-nav`, `header-actions` / `account-link` / `cart-link` / `cart-count` / `welcome-msg`, `main-nav` / `main-nav__item` / `has-submenu` / `submenu`, `nav-drawer` / `drawer-head` / `drawer-quick` / `drawer-nav` / `drawer-item` / `drawer-toggle` / `drawer-submenu` / `drawer-foot`, `search-overlay`, `drawer-scrim`.

No utility-class soup; these map directly to Liquid markup.

---

## 9. Acceptance checks

- Logged out → person icon (to login); logged in → logout icon (to `account_logout_url`) + "Welcome back, {first name}" on desktop.
- Cart badge reflects `cart.item_count`.
- Hamburger opens the left drawer on desktop and mobile; Esc and scrim close it.
- Desktop dropdowns (Wines/Spirits/Beer/Cigars/Dukkan/Gifts) open on hover and click; drawer versions are accordions.
- Predictive search renders real products.
- Header style / theme / button style / search style switch correctly from theme settings.
- Responsive: desktop ≥769px, mobile ≤768px (quick links relocate to drawer top on mobile).
