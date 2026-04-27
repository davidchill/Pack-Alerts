# PackAlert.gg

Real-time TCG restock alerts delivered to Discord. Monitors multiple retailers and games — never miss a drop again.

## What it does

PackAlert checks product pages across major TCG retailers on a schedule. The instant a product flips from out-of-stock to available, a Discord notification fires with the product name, retailer, price, and a direct buy link.

A private `/admin` dashboard shows live stock status across all tracked products, with an API health panel that surfaces per-retailer status, response times, error counts, and IP block / rate-limit signals. Data is persisted in `localStorage` so the dashboard loads instantly on page reload with the last known state; the Refresh button triggers a live API check on demand.

## Retailers & games covered

| Retailer | Method | Games |
|---|---|---|
| Best Buy | Official developer API | Lorcana, Star Wars Unlimited, Cardsmiths, and other first-party TCG products |
| Target | Internal Redsky API (curated TCIN list) | Pokémon TCG, Magic: The Gathering, Yu-Gi-Oh!, One Piece, Disney Lorcana, Star Wars Unlimited, Digimon, Dragon Ball Super, Flesh and Blood, Union Arena |
| Walmart | `__NEXT_DATA__` HTML parsing via curl (curated item ID list) | Pokémon TCG, Disney Lorcana, Magic: The Gathering, One Piece, Star Wars Unlimited |
| Barnes & Noble | ⚠️ Scaffolded — blocked by Akamai JS challenge | Pokémon TCG, Disney Lorcana (6 products catalogued) |

> **Notes:**
> - Best Buy's API only covers their first-party inventory. Pokémon TCG products on Best Buy are sold through their marketplace and are not accessible via the API.
> - Pokémon Center is protected by Imperva bot detection and cannot be scraped server-side.
> - Walmart uses JA3 TLS fingerprinting to block server-side requests. The web app shells out to `curl` (available on Windows via Git/System32) to bypass this; the admin panel is a local-only tool.
> - Barnes & Noble uses **Akamai Bot Manager**, which requires JavaScript execution to pass its challenge. All B&N types, product catalog, cache, probe endpoint, and UI are implemented — only the fetch strategy needs upgrading (Playwright, `curl-impersonate`, or a scraping proxy).

## Project structure

```
packalert/
├── apps/
│   ├── scraper/          # Background stock checker (runs via GitHub Actions)
│   │   └── src/
│   │       ├── retailers/
│   │       │   ├── bestbuy.ts       # Best Buy API checker
│   │       │   ├── target.ts        # Target Redsky API checker
│   │       │   ├── walmart.ts       # Walmart __NEXT_DATA__ scraper
│   │       │   └── pokemonCenter.ts # Pokémon Center scraper (blocked by Imperva)
│   │       ├── notifications/
│   │       │   └── discord.ts       # Discord webhook notifications
│   │       ├── products.ts          # Scraper watchlist (products to monitor)
│   │       ├── checker.ts           # Orchestrates checks and fires notifications
│   │       └── index.ts             # Entry point
│   └── web/              # Next.js web app
│       └── app/
│           ├── page.tsx             # Public landing page
│           ├── admin/
│           │   └── page.tsx         # Private admin dashboard
│           └── api/stock/
│               ├── route.ts                      # API route: fetches from Best Buy, Target, Walmart, B&N
│               ├── target-products.ts            # Target TCIN list (edit to add products)
│               ├── walmart-products.ts           # Walmart item ID list (edit to add products)
│               └── barnes-and-noble-products.ts  # B&N work ID list (edit to add products)
└── packages/
    └── types/            # Shared TypeScript types (Product, StockResult, Retailer)
```

## Setup

### Prerequisites
- Node.js 20+
- npm

### Install dependencies
```bash
npm install
```

### Environment variables

Copy `.env.example` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Where to get it | Used by |
|---|---|---|
| `BESTBUY_API_KEY` | [developer.bestbuy.com](https://developer.bestbuy.com) — free registration | Scraper + web app |
| `DISCORD_WEBHOOK_URL` | Discord server settings → Integrations → Webhooks | Scraper |

### Run the web app locally
```bash
npm run dev:web
```

Then visit `http://localhost:3000` for the landing page and `http://localhost:3000/admin` for the stock dashboard.

### Run the scraper manually
```bash
npm run check-stock
```

## Adding products to track

### Best Buy (Lorcana, Star Wars Unlimited, etc.)
Best Buy products are discovered automatically via the API — no manual SKU entry needed. The route filters for game TCG products and excludes sports cards and accessories.

### Target (all TCGs)
Edit `apps/web/app/api/stock/target-products.ts`. Find the TCIN in the Target product URL:

```
https://www.target.com/p/product-name/-/A-91619922
                                             ^^^^^^^^
                                             TCIN = 91619922
```

Add a new entry:
```ts
{
  id: 'target-my-product',
  name: 'My TCG Product Name',
  tcin: '91619922',
  url: 'https://www.target.com/p/product-name/-/A-91619922',
},
```

The admin dashboard fetches product details and availability using two Redsky endpoints per product: a 200ms pause separates the two calls within each product, and a 400ms pause separates consecutive products. Results are cached for 30 minutes.

### Walmart
Edit `apps/web/app/api/stock/walmart-products.ts`. Find the item ID at the end of any Walmart product URL:

```
https://www.walmart.com/ip/product-name/13816151308
                                        ^^^^^^^^^^^
                                        walmartId = 13816151308
```

Add a new entry:
```ts
{
  id: 'walmart-my-product',
  name: 'My TCG Product Name',
  walmartId: '13816151308',
  url: 'https://www.walmart.com/ip/product-name/13816151308',
},
```

Products are fetched sequentially with an 800ms delay between each. Results are cached for 30 minutes. Walmart's bot detection is product-specific — newer or marketplace-only listings may require a retry.

### Barnes & Noble
Edit `apps/web/app/api/stock/barnes-and-noble-products.ts`. Find the work ID at the end of any B&N product URL:

```
https://www.barnesandnoble.com/w/product-name/1147031981
                                              ^^^^^^^^^^
                                              bnId = 1147031981
```

Add a new entry:
```ts
{
  id: 'bn-my-product',
  name: 'My TCG Product Name',
  bnId: '1147031981',
  url: 'https://www.barnesandnoble.com/w/product-name/1147031981',
},
```

> ⚠️ B&N is currently blocked by Akamai's JavaScript challenge. Products will show as errors in the health panel until the fetch strategy is upgraded to support JS execution.

### Scraper watchlist
For Discord alerts, edit `apps/scraper/src/products.ts`. Products require `tcin` for Target, `sku` for Best Buy, or `walmartId` for Walmart.

## GitHub Actions

The scraper runs every 5 minutes via `.github/workflows/stock-check.yml`.

Set the following repository secret in GitHub (Settings → Secrets → Actions):
- `DISCORD_WEBHOOK_URL`
- `BESTBUY_API_KEY`

## Versioning

- `0.Y.0` — new feature or significant addition
- `0.Y.Z` — bug fix, polish, or refactor
- `1.0.0` — reserved for public launch

## Disclaimer

Not affiliated with The Pokémon Company, Best Buy, Target, or any monitored retailer.
