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

interface TargetApiResponse {
  data?: {
    product?: {
      fulfillment?: {
        shipping_options?: {
          availability_status?: string;
        };
      };
      price?: {
        formatted_current_price?: string;
      };
      item?: {
        product_description?: {
          title?: string;
        };
        enrichment?: {
          images?: {
            primary_image_url?: string;
          };
        };
      };
    };
  };
}

async function fetchTargetProduct(product: TargetProduct): Promise<StockEntry> {
  const url =
    `https://redsky.target.com/redsky_aggregations/v1/web/pdp_client_v1` +
    `?key=${TARGET_KEY}&tcin=${product.tcin}&store_id=&pricing_store_id=` +
    `&visitor_id=&channel=WEB&page=%2Fp%2FA-${product.tcin}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Target API returned ${res.status}`);

  const data: TargetApiResponse = await res.json();
  const p = data?.data?.product;
  const status = p?.fulfillment?.shipping_options?.availability_status;
  const inStock = status === 'IN_STOCK' || status === 'AVAILABLE';
  const price = p?.price?.formatted_current_price;
  const image = p?.item?.enrichment?.images?.primary_image_url;

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
  const results = await Promise.allSettled(TARGET_PRODUCTS.map(fetchTargetProduct));
  return results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value;
    return {
      id: TARGET_PRODUCTS[i].id,
      name: TARGET_PRODUCTS[i].name,
      retailer: 'Target' as const,
      sku: TARGET_PRODUCTS[i].tcin,
      url: TARGET_PRODUCTS[i].url,
      inStock: false,
      checkedAt: new Date().toISOString(),
      error: r.reason instanceof Error ? r.reason.message : 'Unknown error',
    };
  });
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
