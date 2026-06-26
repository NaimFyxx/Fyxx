# Fyxx Store — Git → Shopify deploy workflow

Setup + workflow for version-controlling the live Shopify theme through
`NaimFyxx/Fyxx-Store-Website` using the Shopify ↔ GitHub integration.

- **Store:** `drynksapp.myshopify.com` (myfyxx.com)  ← confirm this myshopify handle in admin URL
- **Live theme to capture:** `178546409719` — "2026 V.5.3 [Published Jun 22] - Fyxx Cup" (role MAIN)
- **Theme:** Expanse (Archetype Themes) 9.x
- **Repo:** `NaimFyxx/Fyxx-Store-Website` (currently only a README)
- **Branch that maps to live:** `main`

---

## One-time setup (run by Naím — needs Shopify CLI + GitHub admin)

### 1. Seed the repo with the live theme
Run locally in the cloned repo (Shopify CLI required: https://shopify.dev/themes/tools/cli):
```bash
cd Fyxx-Store-Website
# pulls the CURRENTLY PUBLISHED theme into the repo root
shopify theme pull --store drynksapp.myshopify.com --live --path .
# (or pin the id:  --theme 178546409719  instead of --live)

git add -A
git commit -m "Seed: current live theme (Expanse 9.x)"
git push origin main
```

### 2. Connect main → the store (Shopify admin, one-time)
1. Shopify admin → **Online Store → Themes**
2. **Add theme → Connect from GitHub**
3. Authorize the **Shopify GitHub app** for the **NaimFyxx** account and grant it access to
   the `Fyxx-Store-Website` repo (you need write access — owner/admin is fine).
4. Select: **NaimFyxx / Fyxx-Store-Website / branch `main`**.
   A new theme card "Fyxx-Store-Website · main" appears, mirroring `main`.

> Note: you can only connect a branch that already contains a valid theme (default folder
> structure). That's why Step 1 (seed) must happen first.

### 3. Make the connected theme live
- On that new connected theme's card → **Publish**.
- It's byte-identical to the current live theme, so nothing changes visually — but now the
  **live** theme is the one wired to `main`. (The old `178546409719` stays as a backup.)

### 4. Test the pipeline (the "one tiny test change")
```bash
git pull origin main
# tiny edit, e.g. add a harmless comment to layout/theme.liquid
git commit -am "test: verify Git→Shopify deploy"
git push origin main
```
- On the theme card, the **last commit** updates to your push (author may be you / shopify bot).
- Hard-refresh myfyxx.com to confirm. Pipeline works. ✅

---

## Daily workflow (every change)
```bash
git pull origin main          # 1. always start fresh
# 2. edit sections/ snippets/ templates/ config/ assets/ locales/ layout/ blocks/
git add -A && git commit -m "what changed"
git push origin main          # 3. auto-deploys to live in ~a minute
```

## Rules to avoid Git conflicts
- **Make code changes in Git, not in the Shopify admin code/theme editor.** The integration
  is **two-way**: admin edits commit back to `main` as the `shopify` bot. Mixing both sides
  is what causes conflicts.
- If a merchant edit *does* happen in admin (theme-editor settings, app blocks, etc.),
  it lands on `main` — run `git pull` before your next push.
- If a theme ever drifts: theme card → **Actions → Reset to last commit**.

## Safer pattern for risky changes (optional)
1. `git checkout -b feature/xyz && git push -u origin feature/xyz`
2. Admin → Add theme → Connect from GitHub → branch `feature/xyz` → **preview** (stays unpublished)
3. Happy? `git checkout main && git merge feature/xyz && git push` → live.

---

## For Claude to work in this repo going forward
This agent session is scoped to `naimfyxx/fyxx` and **cannot access `Fyxx-Store-Website`**
(clone → 403; GitHub tools → "Access denied"). To have Claude make future changes here,
add `NaimFyxx/Fyxx-Store-Website` to the session's allowed repositories (Claude Code web app:
environment / repo settings). Once granted, the loop is: Claude edits → commit → push `main` →
Shopify deploys.
