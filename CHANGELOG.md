# Changelog

## v0.1.2 — 2026-04-26

### Admin dashboard

- Added filter toolbar above the product table: filter by **Retailer** (All / Best Buy / Target) and **Status** (All / In Stock / Out of Stock)
- Added **Sort** dropdown: Name A→Z, Name Z→A, Price Low→High, Price High→Low, Checked Newest, Checked Oldest
- Filters and sort are applied client-side via `useMemo` — no extra API calls
- Stats row (Tracking / In Stock / Out of Stock) always reflects the full unfiltered dataset
- "Showing X of Y products" label appears when any filter is active
- Empty state message shown when filters produce zero results

### Target API hardening

- Updated `pdp_client_v1` request to include all parameters Target's own site now sends: `visitor_id`, `is_bot=false`, `has_pricing_store_id=true`, `has_financing_options=true`, `include_obsolete=false`, `skip_personalized=true`, `skip_variation_hierarchy=true`
- Updated fulfillment endpoint from deprecated `product_fulfillment_v1` to `product_fulfillment_and_variation_hierarchy_v1` with updated parameters
- Added `Referer`, `Origin`, and `Accept-Language` headers to better match browser requests
- Added `TARGET_VISITOR_ID` — a stable per-process random hex ID generated at startup, required by Target's API
- Fixed `crypto.randomUUID()` global usage — now correctly imports `randomUUID` from Node's built-in `crypto` module
- Replaced 4-concurrent-request pool with **sequential requests and a 400ms delay** between each product to avoid triggering Target's bot detection
- Extended cache TTL from **5 minutes → 30 minutes** so a cold fetch (which now takes ~25s) only happens once every half hour
- Added `?target_tcin=XXXXXXXX` debug endpoint to test a single Target product without triggering a full 58-product fetch

---

## v0.1.1 — 2026-04-25

### Bug fixes & improvements

#### Target API overhaul
- Fixed incorrect placeholder TCIN (`92831234`) for Surging Sparks ETB — replaced with real TCIN `91619922`
- Fixed empty `pricing_store_id` parameter causing hard GraphQL validation errors from Redsky (`Variable 'pricing_store_id' has coerced Null value for NonNull type 'String!'`)
- Split into two Redsky endpoints: `pdp_client_v1` (store `3991`) for price and image, `product_fulfillment_v1` (store `1922`) for availability status — the single endpoint never returned both
- Fixed incorrect JSON paths: images now read from `item.enrichment.image_info.primary_image.url` (was `item.enrichment.images.primary_image_url`), availability from `item` path corrected
- Fulfillment endpoint failures (e.g. 403 rate-limit) now degrade gracefully — products show as Out of Stock instead of "Error"
- Added concurrency limiter (max 4 simultaneous requests) to prevent rate-limiting from the Redsky API
- Added in-memory cache with 5-minute TTL so admin page refreshes don't re-fetch all products on every load
- Same fixes applied to `apps/scraper/src/retailers/target.ts`

#### Target product list expanded (`target-products.ts`)
- Expanded from 1 Pokémon-only entry to 58 products across 8 TCG brands
- Added: Pokémon TCG (Destined Rivals, Journey Together, White Flare, Prismatic Evolutions, Surging Sparks, Mega Evolutions Ascended Heroes — ETBs, booster bundles, individual booster packs, Super-Premium Collection)
- Added: Magic: The Gathering (Final Fantasy Collector + Display + Pack Lots, Tarkir Dragonstorm Collector Booster, Foundations Collector + Bundle + Jumpstart)
- Added: Yu-Gi-Oh! (2025 Mega Pack Tin)
- Added: One Piece Card Game (OP-09 through OP-15, EB-02, Treasure Booster Set)
- Added: Disney Lorcana (Archazia's Island, Azurite Sea, Shimmering Skies, Ursula's Return, Into The Inklands — display boxes, single packs, starter decks, Illumineer's Troves)
- Added: Star Wars: Unlimited (2025 Gift Box)
- Added: Digimon Card Game (Adventure Box 2 & 3)
- Added: Dragon Ball Super Card Game (Fusion World FB02/FB05/FB06/FB07, Bardock FS05 Starter Deck)
- Added: Flesh and Blood (Dynasty, Welcome to Rathe, Everfest)
- Added: Union Arena (Solo Leveling, Bleach Starter Deck)
- All TCINs verified live against Target's API before adding; 12 dead TCINs excluded

#### Admin dashboard
- Added `suppressHydrationWarning` to `<body>` in root layout to suppress false-positive React hydration errors caused by browser extensions (Grammarly, etc.) injecting attributes into the DOM

---

## v0.1.0 — 2026-04-25

### Initial release

#### Web app (`apps/web`)
- Landing page with hero, retailer bar, how-it-works section, Discord alert preview, and waitlist CTA
- Private `/admin` dashboard showing live stock data across multiple retailers and TCG games
- Stats row: total tracked, in stock, out of stock counts
- Product table with thumbnail image, name, retailer badge (color-coded), stock status, price, last-checked time, and buy link
- Error banner on API failure with descriptive message
- Refresh button to re-check stock on demand
- Next.js App Router, Tailwind CSS, dark theme (`#0a0a0f` background, `#00ff88` accent)

#### API route (`apps/web/app/api/stock`)
- Best Buy source: uses official Best Buy developer API (`search=trading`) to discover all game TCG products in their first-party catalog (Disney Lorcana, Star Wars Unlimited, Cardsmiths, etc.). Filters out sports cards and accessories in code.
- Target source: uses Target's internal Redsky API with a curated TCIN list (`target-products.ts`) for Pokémon TCG products. TCINs are found in Target product URLs.
- Both sources are fetched in parallel and combined into a single response.
- `?debug=1` query param returns raw Best Buy product names for diagnostics.

#### Scraper (`apps/scraper`)
- Best Buy retailer: replaced fragile Cheerio HTML scraping with official Best Buy API call using `BESTBUY_API_KEY`. Requires SKU on each product.
- Target retailer: Redsky API integration for online availability and price.
- Pokémon Center retailer: Cheerio HTML scraping.
- Discord notifications fire on out-of-stock → in-stock transitions only.
- GitHub Actions workflow runs the scraper every 5 minutes.

#### Shared types (`packages/types`)
- `Product` interface: `id`, `name`, `retailer`, `url`, `tcin?` (Target), `sku?` (Best Buy)
- `StockResult` interface: `product`, `inStock`, `timestamp`, `price?`
- `Retailer` union type: `pokemon-center | target | best-buy | gamestop`

#### Infrastructure
- npm workspaces monorepo: `apps/web`, `apps/scraper`, `packages/types`
- `.env.example` documents all required environment variables
- `.gitignore` excludes `node_modules`, `.next`, `.env.local`, build outputs
