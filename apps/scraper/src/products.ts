import type { Product } from '@packalert/types';

// Add products you want to monitor here.
// Target products require a `tcin` (found in the product page URL: /p/-/A-XXXXXXXX)
export const watchlist: Product[] = [
  {
    id: 'scarlet-violet-151-etb-pc',
    name: 'Pokémon TCG: Scarlet & Violet 151 Elite Trainer Box',
    retailer: 'pokemon-center',
    url: 'https://www.pokemoncenter.com/product/290-85145/pokemon-tcg-scarlet-violet-151-elite-trainer-box',
  },
  {
    id: 'surging-sparks-etb-target',
    name: 'Pokémon TCG: Surging Sparks Elite Trainer Box',
    retailer: 'target',
    url: 'https://www.target.com/p/-/A-92831234',
    tcin: '92831234',
  },
];
