import { NextResponse } from 'next/server';
import { TARGET_PRODUCTS, type TargetProduct } from './target-products';

const BESTBUY_KEY = process.env.BESTBUY_API_KEY;

// Publicly known key Target's own website uses for its internal Redsky API
const TARGET_KEY = '9f36aeafbe60771e321a7cc95a78140772ab3e96';

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

// ─── Best Buy ────────────────────────────────────────────────────────────────

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

// ─── Target ──────────────────────────────────────────────────────────────────

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
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Accept: 'application/json',
};

// In-memory cache — avoids re-fetching all 58 products on every admin refresh
const TARGET_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let targetCache: { entries: StockEntry[]; expiresAt: number } | null = null;

// Runs tasks with at most `limit` in-flight at once to avoid rate-limiting
async function withConcurrency<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}

async function fetchTargetProduct(product: TargetProduct): Promise<StockEntry> {
  const base = `?key=${TARGET_KEY}&tcin=${product.tcin}&channel=WEB&page=%2Fp%2FA-${product.tcin}`;

  const detailsRes = await fetch(
    `https://redsky.target.com/redsky_aggregations/v1/web/pdp_client_v1${base}&store_id=3991&pricing_store_id=3991`,
    { headers: TARGET_HEADERS, cache: 'no-store' },
  );

  if (!detailsRes.ok) throw new Error(`Target API returned ${detailsRes.status}`);

  const details: TargetDetailsResponse = await detailsRes.json();
  const p = details?.data?.product;
  const price = p?.price?.formatted_current_price;
  const image = p?.item?.enrichment?.image_info?.primary_image?.url;

  // Fulfillment endpoint is rate-limited more aggressively — degrade gracefully on failure
  let inStock = false;
  try {
    const fulfillmentRes = await fetch(
      `https://redsky.target.com/redsky_aggregations/v1/web/product_fulfillment_v1${base}&store_id=1922&pricing_store_id=1922`,
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

  const tasks = TARGET_PRODUCTS.map((product) => async (): Promise<StockEntry> => {
    try {
      return await fetchTargetProduct(product);
    } catch (e) {
      return {
        id: product.id,
        name: product.name,
        retailer: 'Target' as const,
        sku: product.tcin,
        url: product.url,
        inStock: false,
        checkedAt: new Date().toISOString(),
        error: e instanceof Error ? e.message : 'Unknown error',
      };
    }
  });

  // Max 4 concurrent requests to avoid triggering Target's rate limiter
  const entries = await withConcurrency(tasks, 4);

  targetCache = { entries, expiresAt: Date.now() + TARGET_CACHE_TTL_MS };
  return entries;
}

// ─── Combined handler ────────────────────────────────────────────────────────

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

  const [bbResults, targetResults] = await Promise.allSettled([
    fetchBestBuyProducts(),
    fetchTargetProducts(),
  ]);

  const entries: StockEntry[] = [
    ...(bbResults.status === 'fulfilled' ? bbResults.value : []),
    ...(targetResults.status === 'fulfilled' ? targetResults.value : []),
  ];

  const errors: string[] = [];
  if (bbResults.status === 'rejected') errors.push(`Best Buy: ${bbResults.reason}`);
  if (targetResults.status === 'rejected') errors.push(`Target: ${targetResults.reason}`);

  if (entries.length === 0 && errors.length > 0) {
    return NextResponse.json({ error: errors.join(' | ') }, { status: 500 });
  }

  return NextResponse.json(entries);
}
