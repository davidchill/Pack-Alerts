// All TCG products tracked at Barnes & Noble.
// Find the work ID in any B&N product URL: barnesandnoble.com/w/<slug>/<WORKID>
// Add new entries here as new sets release.

export interface BNProduct {
  id: string;
  name: string;
  bnId: string;
  url: string;
}

export const BN_PRODUCTS: BNProduct[] = [

  // ── Pokémon TCG ─────────────────────────────────────────────────────────────

  // Mega Evolution (2025 — B&N-stocked Japanese TCG release)
  {
    id: 'bn-mega-evolution-s2-phantasmal-flames-etb',
    name: 'Pokémon TCG: Mega Evolution — Phantasmal Flames Elite Trainer Box',
    bnId: '1148578545',
    url: 'https://www.barnesandnoble.com/w/pokemon-mega-evolution-s2-phantasmal-flames-elite-trainer-box-pokemon/1148578545',
  },
  {
    id: 'bn-mega-evolution-s1-booster-bundle',
    name: 'Pokémon TCG: Mega Evolution — Series 1 Booster Bundle',
    bnId: '1148312555',
    url: 'https://www.barnesandnoble.com/w/pokemon-mega-evolution-s1-booster-bundle-box-pokemon/1148312555',
  },

  // Journey Together (SV9, 2025)
  {
    id: 'bn-journey-together-booster-bundle',
    name: 'Pokémon TCG: Scarlet & Violet — Journey Together Booster Bundle',
    bnId: '1147031981',
    url: 'https://www.barnesandnoble.com/w/pokemon-scarlet-violet-series-9-journey-together-booster-bundle-box-pokemon/1147031981',
  },

  // Prismatic Evolutions (SV8a, 2025)
  {
    id: 'bn-prismatic-evolutions-etb',
    name: 'Pokémon TCG: Scarlet & Violet — Prismatic Evolutions Elite Trainer Box',
    bnId: '1146574246',
    url: 'https://www.barnesandnoble.com/w/pokemon-scarlet-violet-s85-prismatic-evolutions-elite-trainer-box-pokemon/1146574246',
  },

  // ── Disney Lorcana ───────────────────────────────────────────────────────────

  // Archazia's Island (Set 7, 2025 — most current)
  {
    id: 'bn-lorcana-archazias-island-trove-box',
    name: "Disney Lorcana: Archazia's Island Illumineer's Trove Box",
    bnId: '1147031980',
    url: "https://www.barnesandnoble.com/w/disney-lorcana-chapter-7-archazias-island-trove-box-lorcana/1147031980",
  },
  {
    id: 'bn-lorcana-archazias-island-gift-set',
    name: "Disney Lorcana: Archazia's Island Gift Set",
    bnId: '1147031983',
    url: "https://www.barnesandnoble.com/w/disney-lorcana-chapter-7-archazias-island-gift-set-lorcana/1147031983",
  },

];
