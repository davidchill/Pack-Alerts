import type { Product, StockResult } from '@packalert/types';

// Target's internal Redsky API — checked by store and online availability
// Each product needs a TCIN (Target's product ID, found in the product URL)
const REDSKY_KEY = '9f36aeafbe60771e321a7cc95a78140772ab3e96';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Accept: 'application/json',
};

export async function checkTarget(product: Product): Promise<StockResult> {
  if (!product.tcin) {
    throw new Error(`Target product "${product.name}" is missing a TCIN`);
  }

  const base = `?key=${REDSKY_KEY}&tcin=${product.tcin}&channel=WEB&page=%2Fp%2FA-${product.tcin}`;

  const [detailsRes, fulfillmentRes] = await Promise.all([
    fetch(
      `https://redsky.target.com/redsky_aggregations/v1/web/pdp_client_v1${base}&store_id=3991&pricing_store_id=3991`,
      { headers: HEADERS },
    ),
    fetch(
      `https://redsky.target.com/redsky_aggregations/v1/web/product_fulfillment_v1${base}&store_id=1922&pricing_store_id=1922`,
      { headers: HEADERS },
    ),
  ]);

  const details = await detailsRes.json();
  const fulfillment = await fulfillmentRes.json();

  const status = fulfillment?.data?.product?.fulfillment?.shipping_options?.availability_status;
  const inStock = status === 'IN_STOCK' || status === 'AVAILABLE';
  const price = details?.data?.product?.price?.formatted_current_price;

  return { product, inStock, timestamp: new Date(), price };
}
