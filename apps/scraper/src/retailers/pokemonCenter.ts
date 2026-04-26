import * as cheerio from 'cheerio';
import type { Product, StockResult } from '@packalert/types';

export async function checkPokemonCenter(product: Product): Promise<StockResult> {
  const res = await fetch(product.url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  const html = await res.text();
  const $ = cheerio.load(html);

  const addToCartBtn = $('button.add-to-cart').filter((_, el) => !$(el).is(':disabled'));
  const outOfStock = $('.product-out-of-stock, [data-outofstock="true"]');
  const inStock = addToCartBtn.length > 0 && outOfStock.length === 0;

  const price = $('.product-price, .price').first().text().trim() || undefined;

  return { product, inStock, timestamp: new Date(), price };
}
