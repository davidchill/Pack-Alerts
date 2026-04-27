// All TCG products tracked at Walmart.
// Find the item ID in any Walmart product URL: walmart.com/ip/<slug>/<ITEMID>
// Add new entries here as new sets release.

export interface WalmartProduct {
  id: string;
  name: string;
  walmartId: string;
  url: string;
}

export const WALMART_PRODUCTS: WalmartProduct[] = [

  // ── Pokémon TCG ─────────────────────────────────────────────────────────────

  // Destined Rivals (SV10, 2025)
  {
    id: 'walmart-destined-rivals-etb',
    name: 'Pokémon TCG: Scarlet & Violet — Destined Rivals Elite Trainer Box',
    walmartId: '16728861909',
    url: 'https://www.walmart.com/ip/Pokemon-TCG-Scarlet-Violet-Destined-Rivals-Elite-Trainer-Box-ETB/16728861909',
  },
  {
    id: 'walmart-destined-rivals-booster-bundle',
    name: 'Pokémon TCG: Scarlet & Violet — Destined Rivals Booster Bundle',
    walmartId: '16749906607',
    url: 'https://www.walmart.com/ip/Pokemon-TCG-Scarlet-Violet-Destined-Rivals-Booster-Bundle/16749906607',
  },
  {
    id: 'walmart-destined-rivals-sleeved-booster',
    name: 'Pokémon TCG: Scarlet & Violet — Destined Rivals Sleeved Booster Pack',
    walmartId: '16034470614',
    url: 'https://www.walmart.com/ip/Pokemon-TCG-Scarlet-Violet-Destined-Rivals-Blister-Booster-Pack-10-Cards/16034470614',
  },
  {
    id: 'walmart-destined-rivals-booster-display',
    name: 'Pokémon TCG: Scarlet & Violet — Destined Rivals Booster Display Box (36 Packs)',
    walmartId: '16665461552',
    url: 'https://www.walmart.com/ip/Pokemon-TCG-Scarlet-Violet-Destined-Rivals-Booster-Display-Box-36-Packs/16665461552',
  },

  // Journey Together (SV9, 2025)
  {
    id: 'walmart-journey-together-etb',
    name: 'Pokémon TCG: Scarlet & Violet — Journey Together Elite Trainer Box',
    walmartId: '15749501336',
    url: 'https://www.walmart.com/ip/Pokemon-TCG-SV09-Journey-Together-Elite-Trainer-Box-ETB/15749501336',
  },
  {
    id: 'walmart-journey-together-booster-bundle',
    name: 'Pokémon TCG: Scarlet & Violet — Journey Together Booster Bundle',
    walmartId: '15780068131',
    url: 'https://www.walmart.com/ip/Pokemon-TCG-SV09-Journey-Together-Booster-Bundle-6-Packs/15780068131',
  },
  {
    id: 'walmart-journey-together-booster-box',
    name: 'Pokémon TCG: Scarlet & Violet — Journey Together Booster Box (36 Packs)',
    walmartId: '15443865868',
    url: 'https://www.walmart.com/ip/Pokemon-Trading-Card-Games-Scarlet-Violet-9-Booster-Box/15443865868',
  },

  // Prismatic Evolutions (SV8a, 2025)
  {
    id: 'walmart-prismatic-evolutions-etb',
    name: 'Pokémon TCG: Scarlet & Violet — Prismatic Evolutions Elite Trainer Box',
    walmartId: '13816151308',
    url: 'https://www.walmart.com/ip/Pokemon-Scarlet-Violet-Prismatic-Evolutions-Elite-Trainer-Box/13816151308',
  },
  {
    id: 'walmart-prismatic-evolutions-booster-bundle',
    name: 'Pokémon TCG: Scarlet & Violet — Prismatic Evolutions Booster Bundle',
    walmartId: '14803962651',
    url: 'https://www.walmart.com/ip/POKEMON-SV8-5-PRISMATIC-EVO-BST-BUNDLE/14803962651',
  },

  // ── Disney Lorcana ───────────────────────────────────────────────────────────

  // Archazia's Island (Set 7, 2025 — most current)
  {
    id: 'walmart-lorcana-archazias-island-booster-box',
    name: "Disney Lorcana: Archazia's Island Booster Box (24 Packs)",
    walmartId: '15415668483',
    url: "https://www.walmart.com/ip/Disney-Lorcana-TCG-Archazia-s-Island-Booster-Box/15415668483",
  },
  {
    id: 'walmart-lorcana-archazias-island-gift-set',
    name: "Disney Lorcana: Archazia's Island Gift Set",
    walmartId: '15387400930',
    url: "https://www.walmart.com/ip/Disney-Lorcana-TCG-Archazia-s-Island-Gift-Set/15387400930",
  },

  // Fabled (Set 6, 2025)
  {
    id: 'walmart-lorcana-fabled-booster-box',
    name: 'Disney Lorcana TCG: Fabled Booster Box (24 Packs)',
    walmartId: '17454560888',
    url: 'https://www.walmart.com/ip/Ravensburger-Disney-Lorcana-TCG-Fabled-Booster-Pack-Display-24-Packs-12-Trading-Cards-Ideal-Collectors-Disney-Fans-Suitable-Ages-8/17454560888',
  },

  // ── Magic: The Gathering ─────────────────────────────────────────────────────

  // Final Fantasy (Universes Beyond, 2025)
  {
    id: 'walmart-mtg-final-fantasy-play-booster-box',
    name: 'Magic: The Gathering — Final Fantasy Play Booster Display (30 Packs)',
    walmartId: '15309204599',
    url: 'https://www.walmart.com/ip/Magic-The-Gathering-FINAL-FANTASY-Play-Booster-Display/15309204599',
  },
  {
    id: 'walmart-mtg-final-fantasy-collector-booster-box',
    name: 'Magic: The Gathering — Final Fantasy Collector Booster Box (12 Packs)',
    walmartId: '15350506947',
    url: 'https://www.walmart.com/ip/Magic-The-Gathering-Final-Fantasy-Collector-Booster-Box/15350506947',
  },

  // Edge of Eternities (2026)
  {
    id: 'walmart-mtg-edge-of-eternities-play-booster-box',
    name: 'Magic: The Gathering — Edge of Eternities Play Booster Display (30 Packs)',
    walmartId: '16858202316',
    url: 'https://www.walmart.com/ip/Edge-of-Eternities-Play-Booster-Display/16858202316',
  },
  {
    id: 'walmart-mtg-edge-of-eternities-collector-booster-box',
    name: 'Magic: The Gathering — Edge of Eternities Collector Booster Box (12 Packs)',
    walmartId: '16834574707',
    url: 'https://www.walmart.com/ip/Magic-The-Gathering-Edge-of-Eternities-Collector-Booster-Box-12-Packs/16834574707',
  },

  // ── One Piece Card Game ──────────────────────────────────────────────────────

  // Two Legends (OP-08, English)
  {
    id: 'walmart-onepiece-two-legends-booster-box',
    name: 'One Piece Card Game: Two Legends Booster Box (OP-08, 24 Packs)',
    walmartId: '11069709382',
    url: 'https://www.walmart.com/ip/Bandai-One-Piece-Card-Game-English-Expansion-Two-Legends-OP-08/11069709382',
  },

  // Anime 25th Collection Extra Booster (EB-02)
  {
    id: 'walmart-onepiece-anime-25th-booster-box',
    name: 'One Piece Card Game: Anime 25th Collection Extra Booster Box (EB-02, 24 Packs)',
    walmartId: '15136624690',
    url: 'https://www.walmart.com/ip/One-Piece-EXTRA-BOOSTER-Anime-25th-Collection-EB02/15136624690',
  },

  // ── Star Wars: Unlimited ─────────────────────────────────────────────────────

  // Legends of the Force (most current)
  {
    id: 'walmart-swu-legends-of-the-force-booster-box',
    name: 'Star Wars: Unlimited — Legends of the Force Booster Box (24 Packs)',
    walmartId: '16837022376',
    url: 'https://www.walmart.com/ip/Star-Wars-Unlimited-TCG-Legends-of-The-Force-Booster-Box-24-Packs-Featuring-Jedi-Sith-Iconic-Characters/16837022376',
  },

  // Jump to Lightspeed (SWU4)
  {
    id: 'walmart-swu-jump-to-lightspeed-booster-box',
    name: 'Star Wars: Unlimited — Jump to Lightspeed Booster Box (24 Packs)',
    walmartId: '15052601406',
    url: 'https://www.walmart.com/ip/Star-Wars-Unlimited-Jump-to-Lightspeed-Booster-Box/15052601406',
  },

  // Twilight of the Republic (SWU3)
  {
    id: 'walmart-swu-twilight-of-the-republic-booster-box',
    name: 'Star Wars: Unlimited — Twilight of the Republic Booster Box (24 Packs)',
    walmartId: '12949750207',
    url: 'https://www.walmart.com/ip/Star-Wars-Unlimited-Trading-Card-Game-Twilight-of-the-Republic-Booster-Box-24-Packs/12949750207',
  },

];
