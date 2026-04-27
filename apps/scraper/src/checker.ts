import type { Product, StockResult } from '@packalert/types';
import { checkPokemonCenter } from './retailers/pokemonCenter.js';
import { checkTarget } from './retailers/target.js';
import { checkBestBuy } from './retailers/bestbuy.js';
import { checkWalmart } from './retailers/walmart.js';
import { notifyDiscord } from './notifications/discord.js';

// Tracks the last known state so we only fire on the out-of-stock → in-stock transition
const previousState = new Map<string, boolean>();

async function checkProduct(product: Product): Promise<StockResult> {
  switch (product.retailer) {
    case 'pokemon-center': return checkPokemonCenter(product);
    case 'target':         return checkTarget(product);
    case 'best-buy':       return checkBestBuy(product);
    case 'walmart':        return checkWalmart(product);
    default:
      throw new Error(`No checker implemented for retailer: ${product.retailer}`);
  }
}

export async function runChecks(watchlist: Product[]): Promise<void> {
  const results = await Promise.allSettled(watchlist.map(checkProduct));

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[error]', result.reason);
      continue;
    }

    const { value } = result;
    const wasInStock = previousState.get(value.product.id) ?? false;
    const label = value.inStock ? 'IN STOCK' : 'out of stock';
    console.log(`[${value.timestamp.toISOString()}] ${value.product.name} — ${label}`);

    if (value.inStock && !wasInStock) {
      await notifyDiscord(value);
    }

    previousState.set(value.product.id, value.inStock);
  }
}
