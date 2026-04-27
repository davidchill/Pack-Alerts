import type { Product, StockResult } from '@packalert/types';

// Walmart embeds full product JSON in __NEXT_DATA__ on every product page.
// The availabilityStatus field lives at:
//   props.pageProps.initialData.data.product.availabilityStatus
// Observed values: "IN_STOCK", "AVAILABLE", "NOT_AVAILABLE"
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Upgrade-Insecure-Requests': '1',
  'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not-A.Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
};

function extractNextData(html: string): unknown {
  const start = html.indexOf('<script id="__NEXT_DATA__"');
  if (start === -1) throw new Error('__NEXT_DATA__ script tag not found');
  const jsonStart = html.indexOf('>', start) + 1;
  const jsonEnd = html.indexOf('</script>', jsonStart);
  return JSON.parse(html.slice(jsonStart, jsonEnd));
}

export async function checkWalmart(product: Product): Promise<StockResult> {
  if (!product.walmartId) {
    throw new Error(`Walmart product "${product.name}" is missing a walmartId`);
  }

  const res = await fetch(product.url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Walmart fetch error: ${res.status}`);

  const html = await res.text();

  if (html.includes('<title>Robot or human?</title>')) {
    throw new Error(`Walmart bot-detection triggered for "${product.name}"`);
  }

  const data = extractNextData(html) as any;
  const item = data?.props?.pageProps?.initialData?.data?.product;

  if (!item) throw new Error(`Walmart product data not found in page for "${product.name}"`);

  const status: string = item.availabilityStatus ?? '';
  const inStock = status === 'IN_STOCK' || status === 'AVAILABLE';
  const rawPrice: number | undefined = item.priceInfo?.currentPrice?.price;
  const price = rawPrice != null ? `$${rawPrice.toFixed(2)}` : undefined;

  return { product, inStock, timestamp: new Date(), price };
}
