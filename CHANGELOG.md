# Changelog

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
