# Backfill: tag out-of-stock products with `oos-hidden`

Store: Fyxx (drynksapp.myshopify.com). Run date: 2026-06-14.

## Rule
For each product, using the `custom.in_stock_online` metafield:
- **TAG** `oos-hidden` when: inventory tracking enabled AND metafield == "false" AND tag not already present.
- **UNTAG** when: tracking enabled AND metafield == "true" AND tag present.
- **SKIP** otherwise.

Two constraints added during the run:
1. Only products with **inventory tracking enabled** (`Product.tracksInventory == true`).
2. Only products whose status is **active or draft** ("unlisted"); **archived excluded**.

## Dry run (3,186 products scanned)
- Inventory-tracked: 2,938 | not tracked (excluded): 248
- Would-tag (tracked, OOS, untagged): 923 total
  - by status: active 818, archived 94, draft 10, unknown 1
- Would-untag: 0 (fresh tag — nothing had it yet)

## Applied
- Scope chosen: **active + draft**, archived excluded → **828 products tagged**.
- Method: Admin GraphQL `tagsAdd` (purely additive), batched 50–100 per request.
- Result verified: `productsCount(tag:oos-hidden)` = 830 (820 active).
  (830 vs 828 = ~2 products already carried the tag before this run.)

## Files
- `backfill_tagged_ids.txt` — the exact 828 product GIDs tagged in this run.

## Re-running / maintenance
This was a one-time backfill. Going forward, keep the metafield→tag in sync with
a Shopify Flow (when `custom.in_stock_online` becomes false → add `oos-hidden`;
becomes true → remove it), so it stays current without a manual re-run.
