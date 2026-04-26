import { watchlist } from './products.js';
import { runChecks } from './checker.js';

async function main() {
  console.log(`PackAlert scraper — watching ${watchlist.length} products`);
  await runChecks(watchlist);
  console.log('Check complete.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
