# Hide `oos-hidden` tagged products from browse (Expanse theme)

Applied to draft theme 178335023351 (UNPUBLISHED at time of writing).

Goal: products tagged `oos-hidden` are invisible in collection grids and search
results, but their direct product URLs stay fully accessible.

## Important: Expanse ≠ Dawn

The original brief referenced Dawn filenames (`main-collection-product-grid.liquid`,
`card-product`). This store runs **Expanse** (Archetype), where:
- Sections are thin wrappers that `render` a `section.*` snippet.
- The product card render call is `render 'list.product-card', product: <item>`.
- Both collection and search build the card loop into a string and pass it as a
  `slot` to `snippets/list.filter-grid.liquid`.

So the real edits are in two snippets:

### 1. `snippets/section.main-collection.liquid` (collection grid)
```liquid
for item in collection.products
  unless item.tags contains 'oos-hidden'
    render 'list.product-card', product: item, product_grid_content_align: product_grid_content_align
  endunless
endfor
```

### 2. `snippets/section.main-search.liquid` (search results)
```liquid
for item in search.results
  if item.object_type == 'product'
    unless item.tags contains 'oos-hidden'
      render 'list.product-card', product: item
    endunless
  else
    render 'list.search-card', item: item
  endif
endfor
```

## Not touched (direct URLs stay live)
`templates/product.*`, `sections/main-product.*`, and the shared
`snippets/list.product-card.liquid`. Featured-collection rows, related products,
and recently-viewed were intentionally left alone (brief scoped to collection +
search only).

## Known caveat — pagination/counts (from brief Step 5)
The `unless` filter runs AFTER Shopify paginates. So a page of 40 that contains
some `oos-hidden` products will display fewer than 40 cards, and the visible
count / number of pages can be slightly off for collections with many hidden
products. If that becomes a problem, the robust fix is to exclude these products
at the data layer (e.g. a Search & Discovery rule or a smart-collection
condition) rather than in Liquid.

The `oos-hidden/` `.liquid` files here are the exact content written to the draft
(verified by byte size: collection 6550→6621, search 5958→6033).
