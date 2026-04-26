import type { Product, StockResult } from '@packalert/types';

// Target's internal Redsky API — checked by store and online availability
// Each product needs a TCIN (Target's product ID, found in the product URL)
const REDSKY_KEY = '9f36aeafbe60771e321a7cc95a78140772ab3e96';

export async function checkTarget(product: Product): Promise<StockResult> {
  if (!product.tcin) {
    throw new Error(`Target product "${product.name}" is missing a TCIN`);
  }

  const url =
    `https://redsky.target.com/redsky_aggregations/v1/web/pdp_client_v1` +
    `?key=${REDSKY_KEY}&tcin=${product.tcin}&store_id=&pricing_store_id=` +
    `&visitor_id=&channel=WEB&page=%2Fp%2FA-${product.tcin}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Accept: 'application/json',
    },
  });

  const data = await res.json();
  const availability =
    data?.data?.product?.fulfillment?.shipping_options?.availability_status;
  const inStock = availability === 'IN_STOCK' || availability === 'AVAILABLE';
  const price = data?.data?.product?.price?.formatted_current_price;

  return { product, inStock, timestamp: new Date(), price };
}
