# Changelog

## v0.1.6 — 2026-04-27

### Barnes & Noble retailer integration (scaffolded; blocked by Akamai)

#### New file: `apps/web/app/api/stock/barnes-and-noble-products.ts`
- Starter catalog of 6 confirmed products with real B&N work IDs (the numeric suffix in any `barnesandnoble.com/w/<slug>/<ID>` URL)
- **Pokémon TCG (4 products):** Prismatic Evolutions ETB; Journey Together Booster Bundle; Mega Evolution Series 1 Booster Bundle; Mega Evolution Phantasmal Flames ETB
- **Disney Lorcana (2 products):** Archazia's Island Illumineer's Trove Box; Archazia's Island Gift Set
- `BNProduct` interface (`id`, `name`, `bnId`, `url`) mirrors the pattern of `WalmartProduct` and `TargetProduct`

#### Web app — API route (`apps/web/app/api/stock/route.ts`)
- Added `'Barnes & Noble'` to the `StockEntry` and `RetailerDiagnostic` retailer union types
- Added `bnCache` field to `DiagnosticMeta` (same shape as `targetCache` / `walmartCache`)
- New `bnCurlFetch()` helper using curl with browser-like headers (same TLS bypass strategy as Walmart)
- New `extractBNStockData()` — primary strategy is JSON-LD `@type: Product` schema extraction (`offers.availability`); falls back to HTML text pattern matching (`"out of stock"`, `"notify me when available"`, `"add to cart"`)
- **Akamai Bot Manager detection:** B&N uses Akamai's JavaScript challenge (not Imperva), which returns a ~1 KB challenge page requiring XHR execution before serving real content; `fetchBNProduct` detects this via `sec-if-cpt-container` / `scf-akamai-logo` markers (and a 5 KB size floor) and throws `'Barnes & Noble bot-detection triggered (Akamai JS challenge)'`
- `fetchBNProducts()` with 30-minute cache and 800ms inter-request delay, matching Walmart's conservative approach
- `GET /api/stock?bn_id=XXXXXXXXXX` probe endpoint — tests a single B&N product without warming the full cache, mirroring `?target_tcin=` and `?walmart_id=`
- B&N wired into the main `Promise.allSettled` fan-out and `buildRetailerDiagnostic`

#### Web app — admin dashboard (`apps/web/app/admin/page.tsx`)
- Added `'Barnes & Noble'` to `StockEntry.retailer` and `RetailerFilter` types
- Retailer badge: forest green (`bg-green-900/30 text-green-400`) — visually distinct from Best Buy (blue), Target (red), Walmart (brand blue), and the In Stock accent (`#00ff88`)
- "Barnes & Noble" added to the Retailer filter button group and the loading skeleton placeholder list
- `RetailerRow` now accepts and displays `bnCache` warm/cold state with expiry countdown
- Bot-detection warning is now retailer-aware: B&N shows "Akamai JS challenge detected — requires a browser-capable fetch strategy"; Walmart continues to show the retry/delay suggestion
- `buildRetailerDiagnostic` parameter type extended to include `'Barnes & Noble'`

#### Current status
B&N is fully wired into the UI and API but all 6 products will show as errors (Akamai challenge) until the fetch strategy is upgraded. Options: Playwright headless browser in the API route, a scraping proxy service (ScrapingBee / ZenRows), or `curl-impersonate` binaries if available server-side. The product catalog, types, cache logic, probe endpoint, and UI are all ready — only `bnCurlFetch()` needs to change.

---

## v0.1.5 — 2026-04-27

### Walmart retailer integration

#### Shared types (`packages/types`)
- Added `'walmart'` to the `Retailer` union type
- Added `walmartId?: string` to the `Product` interface — the numeric item ID found at the end of any Walmart product URL (`walmart.com/ip/<slug>/<ITEMID>`)

#### Scraper (`apps/scraper/src/retailers/walmart.ts`)
- New `checkWalmart()` function: fetches the product page HTML, extracts product data from Walmart's embedded `__NEXT_DATA__` JSON (parsed via `indexOf` for efficiency, no regex over full HTML), and maps `availabilityStatus` (`IN_STOCK` / `AVAILABLE`) to a boolean
- Fires a descriptive error if the "Robot or human?" bot-challenge page is returned instead of real HTML
- Wired into `apps/scraper/src/checker.ts` alongside existing retailers

#### Web app — API route (`apps/web/app/api/stock/route.ts`)
- Added `'Walmart'` to the `StockEntry` and `RetailerDiagnostic` retailer union types
- Added `botDetectSignal: boolean` to `RetailerDiagnostic` — fires when any product fetch returns Walmart's bot-challenge page (HTTP 200 with challenge body), distinct from HTTP 403 `blockedSignal`
- Added `walmartCache` to `DiagnosticMeta` (same shape as `targetCache`: `warm`, `wasHit`, `expiresAt`, `ageMs`) — 30-minute TTL with the same cache-before-fetch snapshot pattern used by Target
- `fetchWalmartProducts()` fetches products sequentially with an **800ms inter-product delay** (more conservative than Target's 400ms given stricter bot detection)
- **Bot detection bypass**: Node.js `fetch` (undici) uses HTTP/2 and OpenSSL, both of which Walmart's JA3 TLS fingerprinting flags. Resolved by shelling out to `curl` via `execFile` — curl's TLS stack passes Walmart's check. The `walmartCurlFetch()` helper builds `-H` args from the shared `WALMART_HEADERS` object and runs `curl -sL --compressed`
- Walmart request headers include `sec-ch-ua`, `sec-ch-ua-mobile`, and `sec-ch-ua-platform` Client Hints — required for higher-demand product pages (without them, newer listings return bot challenges even with correct `Sec-Fetch-*` headers)
- Added `GET /api/stock?walmart_id=XXXXXXXXXX` probe endpoint — fetches a single Walmart product without warming the full cache, mirroring the existing `?target_tcin=` endpoint
- Walmart fetcher wired into the main `Promise.allSettled` parallel fetch alongside Best Buy and Target

#### Web app — Walmart product list (`apps/web/app/api/stock/walmart-products.ts`)
- New file: 20 products across 5 brands, structured identically to `target-products.ts`
- **Pokémon TCG (8 products):** Destined Rivals ETB, Booster Bundle, Sleeved Booster, Display Box (36 packs); Journey Together ETB, Booster Bundle, Booster Box; Prismatic Evolutions ETB and Booster Bundle
- **Disney Lorcana (3 products):** Archazia's Island Booster Box and Gift Set; Fabled Booster Box
- **Magic: The Gathering (4 products):** Final Fantasy Play Booster Display and Collector Booster Box; Edge of Eternities Play Booster Display and Collector Booster Box
- **One Piece Card Game (2 products):** Two Legends OP-08 Booster Box; Anime 25th Collection EB-02 Booster Box
- **Star Wars: Unlimited (3 products):** Legends of the Force, Jump to Lightspeed, and Twilight of the Republic Booster Boxes

#### Web app — admin dashboard (`apps/web/app/admin/page.tsx`)
- Added `'Walmart'` to all relevant type unions (`StockEntry.retailer`, `RetailerFilter`)
- Walmart retailer badge: `#0071ce` (Walmart blue), consistent with the brand color scheme used for Best Buy (blue) and Target (red)
- Retailer filter toolbar now includes a **Walmart** button
- Loading skeleton in `DiagnosticPanel` now shows three rows (Best Buy, Target, Walmart) while a refresh is in flight
- Walmart row in the API Health panel shows cache warm/cold state with expiry countdown, mirroring the Target cache display
- Warning sub-row fires a descriptive bot-detection message when `botDetectSignal` is true, advising a retry or longer delay

---

## v0.1.4 — 2026-04-26

### Target bot-detection hardening

- Updated `User-Agent` header from `Chrome/124` to `Chrome/136` — the stale version was a bot signal to Target's detection layer
- Added a **200ms delay between the details and fulfillment requests** within each product fetch; previously those two calls fired back-to-back with no gap, while the 400ms pause only applied between products

### Retailer probe diagnostic endpoint

- Added `GET /api/stock?pc_url=<encoded-url>` — fetches any URL and returns `{ httpStatus, contentType, htmlLength, likelyBlocked, selectors, htmlSnippet }` for quickly testing whether a new retailer's product pages are scrapeable before investing in a full integration
- `likelyBlocked` flag detects both Cloudflare (`cf-browser-verification`, `Just a moment`) and Imperva (`Pardon Our Interruption`, `_Incapsula_Resource`) challenge pages
- Added `cheerio ^1.0.0` as a dependency to `apps/web` to power the probe's HTML parsing

### Pokémon Center — confirmed unscrapeable

- Tested Pokémon Center via the probe endpoint: site is protected by **Imperva** and returns a JS challenge page rather than product HTML; server-side `fetch()` cannot bypass it
- Removed Pokémon Center from the retailer coverage table; the stub at `apps/scraper/src/retailers/pokemonCenter.ts` was never functional against the live site

---

## v0.1.3 — 2026-04-26

### Admin dashboard — API Health diagnostic panel

- Added `DiagnosticPanel` component that appears at the top of `/admin`, above the stats row
- Displays a per-retailer health summary (Best Buy and Target) with: status badge (Healthy / Degraded / Error), products fetched vs. total tracked, error count, response time, and any HTTP error codes seen as inline badges
- Detects and flags **IP block signals** (HTTP 403) and **rate-limit signals** (HTTP 429) with amber warning text and the raw error message in monospace
- Flags Best Buy API key missing/present inline on the Best Buy row
- Shows Target cache state inline: "Cache warm · expires in Xm" or "Cache cold", and marks fast responses as "cache hit · Xms"
- Overall rollup badge in the panel header: "All Systems OK", "Degraded", or "Issues Detected"
- Panel shows a pulsing skeleton per-retailer while a refresh is in flight

### API route (`apps/web/app/api/stock/route.ts`)

- Response shape changed from `StockEntry[]` → `{ entries: StockEntry[], meta: DiagnosticMeta }` — frontend handles both shapes defensively
- Added `withTiming()` helper that wraps each retailer fetch and records wall-clock milliseconds
- Added `buildRetailerDiagnostic()` which extracts HTTP status codes from error strings via regex, computes `ok / degraded / error` status (degraded = <50% errored, error = ≥50%), and sets `blockedSignal` / `rateLimitSignal` flags
- `targetCache` object now tracks `fetchedAt` timestamp; `cacheWasWarm` is captured before the fetch so `wasHit` correctly distinguishes a cache hit from a freshly populated cache
- Exported `RetailerDiagnostic`, `DiagnosticMeta`, and `ApiResponse` interfaces for use in the frontend

### Admin dashboard — manual-only refresh

- Removed `useEffect` auto-fetch on page load; the dashboard now starts idle and only calls the API when the **Refresh** button is clicked
- Idle state shows "No data yet — click Refresh to check stock" instead of a blank table

### Admin dashboard — persistent cached data via `localStorage`

- After every successful refresh, the full snapshot (`entries`, `meta`, `lastRefresh`) is saved to `localStorage` under the key `packalerts-admin-snapshot`
- On page load a `useEffect` reads the snapshot and populates the dashboard immediately — no API call, no blank page
- Timestamp switches from `toLocaleTimeString()` to `toLocaleString()` (full date + time) so a cached snapshot from a previous day is obviously identifiable
- A `(cached)` label appears next to the timestamp when displaying stored data; it disappears after a live refresh

### Bug fix — React hydration warning

- Added `suppressHydrationWarning` to `<html>` in `apps/web/app/layout.tsx` to suppress false-positive hydration mismatch errors caused by browser extensions (e.g. Redeviation) injecting attributes onto the `<html>` element before React hydrates

---

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
