// Target Pokémon TCG products.
// Find the TCIN in any Target product URL: target.com/p/-/A-XXXXXXXX
// Add new entries here as new sets release.

export interface TargetProduct {
  id: string;
  name: string;
  tcin: string;
  url: string;
}

export const TARGET_PRODUCTS: TargetProduct[] = [
  {
    id: 'target-surging-sparks-etb',
    name: 'Pokémon TCG: Surging Sparks Elite Trainer Box',
    tcin: '92831234',
    url: 'https://www.target.com/p/-/A-92831234',
  },
];
