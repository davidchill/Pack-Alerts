import { randomUUID } from 'crypto';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';
import { TARGET_PRODUCTS, type TargetProduct } from './target-products';

const BESTBUY_KEY = process.env.BESTBUY_API_KEY;

// Publicly known key Target's own website uses for its internal Redsky API
const TARGET_KEY = '9f36aeafbe60771e321a7cc95a78140772ab3e96';

// Stable visitor ID for this server process — Target requires this param
const TARGET_VISITOR_ID = randomUUID().replace(/-/g, '').toUpperCase();

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface StockEntry {
  id: string;
  name: string;
  retailer: 'Best Buy' | 'Target';
  sku: string;
  url: string;
  image?: string;
  inStock: boolean;
  price?: string;
  checkedAt: string;
  error?: string;
}

export interface RetailerDiagnostic {
  retailer: 'Best Buy' | 'Target';
  status: 'ok' | 'degraded' | 'error';
  fetched: number;
  errored: number;
  tracked: number | null;     // known total being tracked (null = dynamic/unknown)
  responseTimeMs: number | null;
  httpCodes: number[];        // distinct HTTP error codes seen (e.g. [403, 429])
  blockedSignal: boolean;     // 403 detected
  rateLimitSignal: boolean;   // 429 detected
  errorSample: string | null; // first error message for display
}

export interface DiagnosticMeta {
  generatedAt: string;
  retailers: RetailerDiagnostic[];
  targetCache: {
    warm: boolean;
    wasHit: boolean;          // true = response came from cache (no live fetch)
    expiresAt: string | null;
    ageMs: number | null;
  };
  apiKeyPresent: { bestBuy: boolean };
}

export interface ApiResponse {
  entries: StockEntry[];
  meta: DiagnosticMeta;
}

// ─── Best Buy ─────────────────────────────────────────────────────────────────

interface BestBuyProduct {
  sku: number;
  name: string;
  salePrice: number;
  onlineAvailability: boolean;
  url: string;
  thumbnailImage?: string;
}

const BB_FIELDS = 'sku,name,salePrice,onlineAvailability,url,thumbnailImage';

async function queryBestBuy(filter: string): Promise<BestBuyProduct[]> {
  const url =
    `https://api.bestbuy.com/v1/products(${filter})?` +
    `apiKey=${BESTBUY_KEY}&format=json&show=${BB_FIELDS}&pageSize=100&sort=name.asc`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Best Buy API returned ${res.status}`);
  const data = await res.json();
  return data.products ?? [];
}

function isGameTCGProduct(name: string): boolean {
  const n = name.toLowerCase();

  const isSportsCard =
    n.includes('panini') || n.includes('topps') || n.includes('sage') ||
    n.includes('pulse') || n.includes('football') || n.includes('baseball') ||
    n.includes('basketball') || n.includes('soccer') || n.includes('hockey') ||
    n.includes('nba') || n.includes('nfl') || n.includes('mlb') || n.includes('ufc') ||
    n.includes('wnba');

  const isAccessory =
    n.includes('sleeve') || n.includes('binder') || n.includes('portfolio') ||
    n.includes('playmat') || n.includes('deck box') || n.includes('toploader') ||
    n.includes('card holder') || n.includes('deck case');

  const isUnrelated =
    n.includes('cable guys') || n.includes('phone') || n.includes('controller') ||
    n.includes('keyboard') || n.includes('mouse') || n.includes('headset');

  return !isSportsCard && !isAccessory && !isUnrelated;
}

async function fetchBestBuyProducts(): Promise<StockEntry[]> {
  if (!BESTBUY_KEY) throw new Error('BESTBUY_API_KEY is not set');

  const products = await queryBestBuy('search=trading');
  const gameOnly = products.filter((p) => isGameTCGProduct(p.name));

  return gameOnly.map((p) => ({
    id: `bb-${p.sku}`,
    name: p.name,
    retailer: 'Best Buy',
    sku: String(p.sku),
    url: p.url ?? `https://www.bestbuy.com/site/-/${p.sku}.p`,
    image: p.thumbnailImage ?? undefined,
    inStock: p.onlineAvailability,
    price: p.salePrice != null ? `$${p.salePrice.toFixed(2)}` : undefined,
    checkedAt: new Date().toISOString(),
  }));
}

// ─── Target ───────────────────────────────────────────────────────────────────

interface TargetDetailsResponse {
  data?: {
    product?: {
      price?: { formatted_current_price?: string };
      item?: {
        enrichment?: {
          image_info?: {
            primary_image?: { url?: string };
          };
        };
      };
    };
  };
}

interface TargetFulfillmentResponse {
  data?: {
    product?: {
      fulfillment?: {
        shipping_options?: { availability_status?: string };
      };
    };
  };
}

const TARGET_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.target.com/',
  'Origin': 'https://www.target.com',
};

// Cache for 30 minutes — long enough to survive multiple admin refreshes
const TARGET_CACHE_TTL_MS = 30 * 60 * 1000;
let targetCache: { entries: StockEntry[]; expiresAt: number; fetchedAt: number } | null = null;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchTargetProduct(product: TargetProduct): Promise<StockEntry> {
  const common = `key=${TARGET_KEY}&tcin=${product.tcin}&visitor_id=${TARGET_VISITOR_ID}&channel=WEB&page=%2Fp%2FA-${product.tcin}&is_bot=false`;

  const detailsRes = await fetch(
    `https://redsky.target.com/redsky_aggregations/v1/web/pdp_client_v1?${common}` +
    `&store_id=3991&pricing_store_id=3991&has_pricing_store_id=true` +
    `&has_financing_options=true&include_obsolete=false&skip_personalized=true&skip_variation_hierarchy=true`,
    { headers: TARGET_HEADERS, cache: 'no-store' },
  );

  if (!detailsRes.ok) throw new Error(`Target API returned ${detailsRes.status}`);

  const details: TargetDetailsResponse = await detailsRes.json();
  const p = details?.data?.product;
  const price = p?.price?.formatted_current_price;
  const image = p?.item?.enrichment?.image_info?.primary_image?.url;

  // Fulfillment endpoint — degrade gracefully on failure
  await delay(200);
  let inStock = false;
  try {
    const fulfillmentRes = await fetch(
      `https://redsky.target.com/redsky_aggregations/v1/web/product_fulfillment_and_variation_hierarchy_v1?${common}` +
      `&required_store_id=3991&store_id=3991&scheduled_delivery_store_id=3991` +
      `&paid_membership=false&base_membership=false&card_membership=false`,
      { headers: TARGET_HEADERS, cache: 'no-store' },
    );
    if (fulfillmentRes.ok) {
      const fulfillment: TargetFulfillmentResponse = await fulfillmentRes.json();
      const status = fulfillment?.data?.product?.fulfillment?.shipping_options?.availability_status;
      inStock = status === 'IN_STOCK' || status === 'AVAILABLE';
    }
  } catch {
    // fulfillment unavailable — inStock stays false
  }

  return {
    id: product.id,
    name: product.name,
    retailer: 'Target',
    sku: product.tcin,
    url: product.url,
    image: image ?? undefined,
    inStock,
    price: price ?? undefined,
    checkedAt: new Date().toISOString(),
  };
}

async function fetchTargetProducts(): Promise<StockEntry[]> {
  if (targetCache && Date.now() < targetCache.expiresAt) {
    return targetCache.entries;
  }

  // Sequential with a 400ms pause between each product to avoid triggering
  // Target's bot detection — 58 products takes ~25s on a cold cache
  const entries: StockEntry[] = [];
  for (let i = 0; i < TARGET_PRODUCTS.length; i++) {
    if (i > 0) await delay(400);
    const product = TARGET_PRODUCTS[i];
    try {
      entries.push(await fetchTargetProduct(product));
    } catch (e) {
      entries.push({
        id: product.id,
        name: product.name,
        retailer: 'Target' as const,
        sku: product.tcin,
        url: product.url,
        inStock: false,
        checkedAt: new Date().toISOString(),
        error: e instanceof Error ? e.message : 'Unknown error',
      });
    }
  }

  const now = Date.now();
  targetCache = { entries, expiresAt: now + TARGET_CACHE_TTL_MS, fetchedAt: now };
  return entries;
}

// ─── Diagnostics ──────────────────────────────────────────────────────────────

interface TimedResult {
  entries: StockEntry[];
  ms: number;
}

async function withTiming(fn: () => Promise<StockEntry[]>): Promise<TimedResult> {
  const start = Date.now();
  const entries = await fn();
  return { entries, ms: Date.now() - start };
}

function buildRetailerDiagnostic(
  retailer: 'Best Buy' | 'Target',
  result: PromiseSettledResult<TimedResult>,
  trackedCount?: number,
): RetailerDiagnostic {
  if (result.status === 'rejected') {
    const msg = String(result.reason);
    const match = msg.match(/\b(\d{3})\b/);
    const code = match ? parseInt(match[1]) : null;
    return {
      retailer,
      status: 'error',
      fetched: 0,
      errored: 0,
      tracked: trackedCount ?? null,
      responseTimeMs: null,
      httpCodes: code ? [code] : [],
      blockedSignal: code === 403,
      rateLimitSignal: code === 429,
      errorSample: msg,
    };
  }

  const { entries, ms } = result.value;
  const erroredEntries = entries.filter((e) => e.error);
  const fetched = entries.length - erroredEntries.length;

  const httpCodes: number[] = [];
  for (const e of erroredEntries) {
    const match = e.error?.match(/\b(\d{3})\b/);
    if (match) {
      const code = parseInt(match[1]);
      if (!httpCodes.includes(code)) httpCodes.push(code);
    }
  }

  let status: 'ok' | 'degraded' | 'error';
  if (erroredEntries.length === 0) {
    status = 'ok';
  } else if (erroredEntries.length >= entries.length / 2) {
    status = 'error';
  } else {
    status = 'degraded';
  }

  return {
    retailer,
    status,
    fetched,
    errored: erroredEntries.length,
    tracked: trackedCount ?? null,
    responseTimeMs: ms,
    httpCodes,
    blockedSignal: httpCodes.includes(403),
    rateLimitSignal: httpCodes.includes(429),
    errorSample: erroredEntries[0]?.error ?? null,
  };
}

// ─── Combined handler ─────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get('debug') === '1') {
    try {
      const products = await queryBestBuy('search=trading');
      return NextResponse.json(products.map((p) => ({ sku: p.sku, name: p.name })));
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  // Test a single Target product without warming the full cache
  // Usage: /api/stock?target_tcin=XXXXXXXX
  const testTcin = searchParams.get('target_tcin');
  if (testTcin) {
    const product = TARGET_PRODUCTS.find((p) => p.tcin === testTcin)
      ?? { id: `target-${testTcin}`, name: testTcin, tcin: testTcin, url: `https://www.target.com/p/-/A-${testTcin}` };
    try {
      const entry = await fetchTargetProduct(product);
      return NextResponse.json(entry);
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  // Probe a single Pokémon Center URL to test reachability and selector validity
  // Usage: /api/stock?pc_url=https%3A%2F%2Fwww.pokemoncenter.com%2Fproduct%2F...
  const pcUrl = searchParams.get('pc_url');
  if (pcUrl) {
    try {
      const res = await fetch(pcUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        cache: 'no-store',
      });

      const contentType = res.headers.get('content-type') ?? 'unknown';
      const html = await res.text();
      const $ = cheerio.load(html);

      const addToCartBtns = $('button.add-to-cart');
      const enabledAddToCart = addToCartBtns.filter((_, el) => !$(el).is(':disabled'));
      const outOfStock = $('.product-out-of-stock, [data-outofstock="true"]');
      const price = $('.product-price, .price').first().text().trim() || null;

      return NextResponse.json({
        httpStatus: res.status,
        contentType,
        htmlLength: html.length,
        likelyBlocked: html.includes('cf-browser-verification') || html.includes('Just a moment') || html.includes('Enable JavaScript') || html.includes('Pardon Our Interruption') || html.includes('_Incapsula_Resource'),
        selectors: {
          addToCartTotal: addToCartBtns.length,
          addToCartEnabled: enabledAddToCart.length,
          outOfStock: outOfStock.length,
          price,
        },
        htmlSnippet: html.slice(0, 600),
      });
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  // Snapshot cache state BEFORE fetching — determines wasHit after the await
  const cacheWasWarm = targetCache !== null && Date.now() < targetCache.expiresAt;

  const [bbResult, targetResult] = await Promise.allSettled([
    withTiming(fetchBestBuyProducts),
    withTiming(fetchTargetProducts),
  ]);

  const entries: StockEntry[] = [
    ...(bbResult.status === 'fulfilled' ? bbResult.value.entries : []),
    ...(targetResult.status === 'fulfilled' ? targetResult.value.entries : []),
  ];

  const now = Date.now();

  const meta: DiagnosticMeta = {
    generatedAt: new Date(now).toISOString(),
    retailers: [
      buildRetailerDiagnostic('Best Buy', bbResult),
      buildRetailerDiagnostic('Target', targetResult, TARGET_PRODUCTS.length),
    ],
    targetCache: {
      warm: targetCache !== null && now < targetCache.expiresAt,
      wasHit: cacheWasWarm,
      expiresAt: targetCache ? new Date(targetCache.expiresAt).toISOString() : null,
      ageMs: targetCache ? now - targetCache.fetchedAt : null,
    },
    apiKeyPresent: { bestBuy: !!BESTBUY_KEY },
  };

  return NextResponse.json({ entries, meta });
}
