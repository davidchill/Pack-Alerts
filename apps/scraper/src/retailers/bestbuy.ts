import type { Product, StockResult } from '@packalert/types';

const API_KEY = process.env.BESTBUY_API_KEY;

export async function checkBestBuy(product: Product): Promise<StockResult> {
  if (!product.sku) {
    throw new Error(`Best Buy product "${product.name}" is missing a SKU`);
  }
  if (!API_KEY) {
    throw new Error('BESTBUY_API_KEY is not set');
  }

  const res = await fetch(
    `https://api.bestbuy.com/v1/products(sku=${product.sku})?apiKey=${API_KEY}&format=json&show=sku,name,salePrice,onlineAvailability`,
  );

  if (!res.ok) throw new Error(`Best Buy API error: ${res.status}`);

  const data = await res.json();
  const item = data.products?.[0];

  const inStock = item?.onlineAvailability ?? false;
  const price = item?.salePrice != null ? `$${item.salePrice.toFixed(2)}` : undefined;

  return { product, inStock, timestamp: new Date(), price };
}
