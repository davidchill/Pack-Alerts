// All TCG products tracked at Target.
// Find the TCIN in any Target product URL: target.com/p/-/A-XXXXXXXX
// Add new entries here as new sets release. Dead TCINs (verified 2026-04-25): 1001200700, 1005947853, 1001311275, 1003322358, 1001417556, 1004986083, 89192790, 94175447, 1006294169, 93870487, 93310400, 1001559167

export interface TargetProduct {
  id: string;
  name: string;
  tcin: string;
  url: string;
}

export const TARGET_PRODUCTS: TargetProduct[] = [

  // ── Pokémon TCG ─────────────────────────────────────────────────────────────

  // Destined Rivals (SV10, 2025)
  {
    id: 'target-destined-rivals-booster-bundle',
    name: 'Pokémon TCG: Scarlet & Violet — Destined Rivals Booster Bundle',
    tcin: '94300067',
    url: 'https://www.target.com/p/pok-233-mon-trading-card-game-scarlet-38-violet-8212-destined-rivals-booster-bundle/-/A-94300067',
  },
  {
    id: 'target-destined-rivals-sleeved-booster',
    name: 'Pokémon TCG: Scarlet & Violet — Destined Rivals Sleeved Booster Pack',
    tcin: '1004021929',
    url: 'https://www.target.com/p/pokemon-sv10-destined-rivals-sleeved-booster-pack/-/A-1004021929',
  },
  {
    id: 'target-destined-rivals-booster-cynthia',
    name: 'Pokémon TCG: Scarlet & Violet — Destined Rivals Booster Pack (Cynthia & Garchomp)',
    tcin: '1004021919',
    url: 'https://www.target.com/p/pokemon-sv10-destined-rivals-booster-pack-cynthia-garchomp/-/A-1004021919',
  },
  {
    id: 'target-destined-rivals-booster',
    name: 'Pokémon TCG: Scarlet & Violet — Destined Rivals Booster Pack',
    tcin: '1004021920',
    url: 'https://www.target.com/p/pokemon-sv10-destined-rivals-booster-pack/-/A-1004021920',
  },
  {
    id: 'target-destined-rivals-booster-ethan',
    name: 'Pokémon TCG: Scarlet & Violet — Destined Rivals Booster Pack (Ethan & Ho-Oh)',
    tcin: '1004021921',
    url: 'https://www.target.com/p/pokemon-sv10-destined-rivals-booster-pack-ethan-ho-oh/-/A-1004021921',
  },

  // Journey Together (SV9, 2025)
  {
    id: 'target-journey-together-etb',
    name: 'Pokémon TCG: Scarlet & Violet — Journey Together Elite Trainer Box',
    tcin: '93803439',
    url: 'https://www.target.com/p/2025-pok-233-mon-scarlet-violet-s9-elite-trainer-box/-/A-93803439',
  },
  {
    id: 'target-journey-together-booster-bundle',
    name: 'Pokémon TCG: Scarlet & Violet — Journey Together Booster Bundle',
    tcin: '94300074',
    url: 'https://www.target.com/p/2025-pok-233-mon-scarlet-violet-s9-booster-bundle-box/-/A-94300074',
  },

  // White Flare (SV9.5, 2025)
  {
    id: 'target-white-flare-etb',
    name: 'Pokémon TCG: Scarlet & Violet — White Flare Elite Trainer Box',
    tcin: '94636860',
    url: 'https://www.target.com/p/pok-233-mon-trading-card-game-scarlet-38-violet-8212-white-flare-elite-trainer-box/-/A-94636860',
  },

  // Mega Evolutions Ascended Heroes (2025)
  {
    id: 'target-mega-evolutions-ascended-heroes',
    name: 'Pokémon TCG: Mega Evolutions Ascended Heroes (2 Packs + Promo)',
    tcin: '1010939486',
    url: 'https://www.target.com/p/pokemon-tcg-trading-card-game-mega-evolutions-ascended-heroes-2-packs-1-promo-card-and-one-coin-larry-s-komala/-/A-1010939486',
  },

  // Prismatic Evolutions (SV8.5, 2025)
  {
    id: 'target-prismatic-evolutions-etb',
    name: 'Pokémon TCG: Scarlet & Violet — Prismatic Evolutions Elite Trainer Box',
    tcin: '93954435',
    url: 'https://www.target.com/p/2024-pok-scarlet-violet-s8-5-elite-trainer-box/-/A-93954435',
  },
  {
    id: 'target-prismatic-evolutions-spc',
    name: 'Pokémon TCG: Scarlet & Violet — Prismatic Evolutions Super-Premium Collection',
    tcin: '94300072',
    url: 'https://www.target.com/p/pok-233-mon-trading-card-game-scarlet-38-violet-8212-prismatic-evolutions-super-premium-collection/-/A-94300072',
  },
  {
    id: 'target-prismatic-evolutions-booster-bundle',
    name: 'Pokémon TCG: Scarlet & Violet — Prismatic Evolutions Booster Bundle',
    tcin: '93954446',
    url: 'https://www.target.com/p/pok-233-mon-trading-card-game-scarlet-38-violet-prismatic-evolutions-booster-bundle/-/A-93954446',
  },
  {
    id: 'target-prismatic-evolutions-booster-bundle-2pack',
    name: 'Pokémon TCG: Scarlet & Violet — Prismatic Evolutions Booster Bundle (2-Pack)',
    tcin: '1003404387',
    url: 'https://www.target.com/p/pokemon-scarlet-violet-prismatic-evolutions-booster-bundle-2-pack/-/A-1003404387',
  },
  {
    id: 'target-prismatic-evolutions-booster-vaporeon',
    name: 'Pokémon TCG: Scarlet & Violet — Prismatic Evolutions Booster Pack (Vaporeon, Jolteon & Flareon)',
    tcin: '1001632610',
    url: 'https://www.target.com/p/pokemon-sv8-5-scarlet-and-violet-prismatic-evolutions-booster-pack-vaporeon-jolteon-and-flareon/-/A-1001632610',
  },
  {
    id: 'target-prismatic-evolutions-booster-leafeon',
    name: 'Pokémon TCG: Scarlet & Violet — Prismatic Evolutions Booster Pack (Leafeon & Glaceon)',
    tcin: '1001632618',
    url: 'https://www.target.com/p/pokemon-sv8-5-scarlet-and-violet-prismatic-evolutions-booster-pack-leafeon-and-glaceon/-/A-1001632618',
  },

  // Surging Sparks (SV8, 2024)
  {
    id: 'target-surging-sparks-etb',
    name: 'Pokémon TCG: Scarlet & Violet — Surging Sparks Elite Trainer Box',
    tcin: '91619922',
    url: 'https://www.target.com/p/pokemon-trading-card-game-scarlet-38-violet-surging-sparks-elite-trainer-box/-/A-91619922',
  },

  // ── Magic: The Gathering ─────────────────────────────────────────────────────

  // Final Fantasy (2025)
  {
    id: 'target-mtg-final-fantasy-collector-booster',
    name: 'Magic: The Gathering — Final Fantasy Collector Booster',
    tcin: '94641039',
    url: 'https://www.target.com/p/magic-the-gathering-final-fantasy-collector-omega-trading-cards/-/A-94641039',
  },
  {
    id: 'target-mtg-final-fantasy-booster-display',
    name: 'Magic: The Gathering — Final Fantasy Booster Display',
    tcin: '94641037',
    url: 'https://www.target.com/p/magic-the-gathering-final-fantasy-booster-display/-/A-94641037',
  },
  {
    id: 'target-mtg-final-fantasy-6pack',
    name: 'Magic: The Gathering — Final Fantasy Play Booster Pack Lot (6 Packs)',
    tcin: '1007005955',
    url: 'https://www.target.com/p/magic-the-gathering-6-packs-magic-the-gathering-play-booster-pack-lot-mtg-final-fantasy/-/A-1007005955',
  },
  {
    id: 'target-mtg-final-fantasy-3pack',
    name: 'Magic: The Gathering — Final Fantasy Play Booster Pack Lot (3 Packs)',
    tcin: '1007005959',
    url: 'https://www.target.com/p/magic-the-gathering-3-packs-magic-the-gathering-play-booster-pack-lot-mtg-final-fantasy/-/A-1007005959',
  },

  // Tarkir: Dragonstorm (2025)
  {
    id: 'target-mtg-tarkir-dragonstorm-collector-booster',
    name: 'Magic: The Gathering — Tarkir: Dragonstorm Collector Booster',
    tcin: '94614988',
    url: 'https://www.target.com/p/magic-the-gathering-tarkir-dragonstorm-collector-booster/-/A-94614988',
  },

  // Foundations (2024)
  {
    id: 'target-mtg-foundations-collector-booster',
    name: 'Magic: The Gathering — Foundations Collector Booster',
    tcin: '93319202',
    url: 'https://www.target.com/p/magic-the-gathering-foundations-collector-booster/-/A-93319202',
  },
  {
    id: 'target-mtg-foundations-bundle',
    name: 'Magic: The Gathering — Foundations Bundle',
    tcin: '93319190',
    url: 'https://www.target.com/p/magic-the-gathering-foundations-bundle/-/A-93319190',
  },
  {
    id: 'target-mtg-foundations-jumpstart-booster',
    name: 'Magic: The Gathering — Foundations Jumpstart Booster Pack',
    tcin: '1001539594',
    url: 'https://www.target.com/p/magic-the-gathering-magic-the-gathering-foundations-jumpstart-booster-pack/-/A-1001539594',
  },

  // ── Yu-Gi-Oh! ────────────────────────────────────────────────────────────────

  {
    id: 'target-yugioh-2025-mega-pack-tin',
    name: 'Yu-Gi-Oh! 2025 Mega Pack Tin',
    tcin: '94723520',
    url: 'https://www.target.com/p/yu-gi-oh-trading-card-game-shonen-jump-tin-mega-pack/-/A-94723520',
  },

  // ── One Piece Card Game ──────────────────────────────────────────────────────

  // OP-15: The Adventure of The Island of God (2025)
  {
    id: 'target-onepiece-op15-6pack',
    name: 'One Piece Card Game: The Adventure of The Island of God OP-15 Booster Pack (6 Cards)',
    tcin: '1010807832',
    url: 'https://www.target.com/p/bandai-one-piece-card-game-the-adventure-of-the-island-of-god-booster-pack-op-15-japanese-6-cards/-/A-1010807832',
  },

  // OP-14: The Seven Heroes of The Blue Sea (2025)
  {
    id: 'target-onepiece-op14-3pack',
    name: 'One Piece Card Game: The Seven Heroes of The Blue Sea OP-14 Booster Pack (3 Packs)',
    tcin: '1007687935',
    url: 'https://www.target.com/p/bandai-one-piece-card-game-the-seven-heroes-of-the-blue-sea-op-14-booster-pack-japanese-3-packs-18-cards/-/A-1007687935',
  },
  {
    id: 'target-onepiece-op14-6pack',
    name: 'One Piece Card Game: The Seven Heroes of The Blue Sea OP-14 Booster Pack (6 Cards)',
    tcin: '1007687970',
    url: 'https://www.target.com/p/bandai-one-piece-card-game-the-seven-heroes-of-the-blue-sea-booster-pack-op-14-japanese-6-cards/-/A-1007687970',
  },

  // OP-11: Fist of God Speed (2024)
  {
    id: 'target-onepiece-op11-box',
    name: 'One Piece Card Game: Fist of God Speed OP-11 Booster Box (24 Packs)',
    tcin: '1002557380',
    url: 'https://www.target.com/p/bandai-bandai-one-piece-card-game-fist-of-god-speed-op-11-booster-box-japanese-24-packs/-/A-1002557380',
  },

  // OP-09: The New Emperor (2024)
  {
    id: 'target-onepiece-op09-box',
    name: 'One Piece Card Game: The New Emperor OP-09 Booster Box (24 Packs)',
    tcin: '1001539917',
    url: 'https://www.target.com/p/bandai-op-09-one-piece-the-new-emperor-card-game-booster-box-6-cards-per-pack-24-packs-japanese/-/A-1001539917',
  },

  // EB-02: Anime 25th Collection (2024)
  {
    id: 'target-onepiece-eb02-3pack',
    name: 'One Piece Card Game: Extra Booster Anime 25th Collection EB-02 (3 Packs)',
    tcin: '1004436996',
    url: 'https://www.target.com/p/bandai-one-piece-card-game-extra-booster-anime-25th-collection-eb-02-booster-pack-japanese-3-packs-18-cards/-/A-1004436996',
  },

  // Treasure Booster Set
  {
    id: 'target-onepiece-treasure-booster-set',
    name: 'One Piece Card Game: Treasure Booster Set',
    tcin: '91669423',
    url: 'https://www.target.com/p/one-piece-card-game-treasure-booster-set/-/A-91669423',
  },

  // ── Disney Lorcana ───────────────────────────────────────────────────────────

  // Archazia's Island (Chapter 7, 2025)
  {
    id: 'target-lorcana-archazias-island-display',
    name: "Disney Lorcana: Archazia's Island Booster Display Box",
    tcin: '94458806',
    url: 'https://www.target.com/p/disney-lorcana-trading-card-game-archazia-39-s-island-booster-display-box/-/A-94458806',
  },
  {
    id: 'target-lorcana-archazias-island-single-booster',
    name: "Disney Lorcana: Archazia's Island Single Booster Pack",
    tcin: '1003298520',
    url: 'https://www.target.com/p/ravensburger-disney-lorcana-tcg-archazia-s-island-single-booster-pack-12-cards-collectible-trading-cards-ideal-for-disney-fans-tcg-players/-/A-1003298520',
  },
  {
    id: 'target-lorcana-archazias-island-starter-amethyst',
    name: "Disney Lorcana: Archazia's Island Starter Deck — Amethyst & Steel (Iago & Jafar)",
    tcin: '94091407',
    url: 'https://www.target.com/p/2025-disney-lorcana-chapter-7-starter-deck/-/A-94091407',
  },
  {
    id: 'target-lorcana-archazias-island-trove',
    name: "Disney Lorcana: Archazia's Island Illumineer's Trove",
    tcin: '94091389',
    url: 'https://www.target.com/p/disney-lorcana-trading-card-game-archazia-39-s-island-illumineer-39-s-trove/-/A-94091389',
  },

  // Azurite Sea (Chapter 6, 2025)
  {
    id: 'target-lorcana-azurite-sea-display',
    name: 'Disney Lorcana: Azurite Sea Display Box',
    tcin: '92568762',
    url: 'https://www.target.com/p/disney-lorcana-chapter-6-booster-pack-collectible-trading-cards/-/A-92568762',
  },
  {
    id: 'target-lorcana-azurite-sea-trove',
    name: "Disney Lorcana: Azurite Sea Illumineer's Trove",
    tcin: '92568775',
    url: 'https://www.target.com/p/disney-lorcana-chapter-6-trove-box-collectible-trading-cards/-/A-92568775',
  },

  // Shimmering Skies (Chapter 5, 2024)
  {
    id: 'target-lorcana-shimmering-skies-booster-box',
    name: 'Disney Lorcana: Shimmering Skies Booster Box',
    tcin: '92568767',
    url: 'https://www.target.com/p/disney-lorcana-chapter-5-booster-pack-collectible-trading-cards/-/A-92568767',
  },
  {
    id: 'target-lorcana-shimmering-skies-trove',
    name: "Disney Lorcana: Shimmering Skies Illumineer's Trove",
    tcin: '92568771',
    url: 'https://www.target.com/p/disney-lorcana-chapter-5-trove-box-collectible-trading-cards/-/A-92568771',
  },
  {
    id: 'target-lorcana-shimmering-skies-starter-emerald',
    name: 'Disney Lorcana: Shimmering Skies Starter Deck — Emerald & Steel',
    tcin: '92568761',
    url: 'https://www.target.com/p/disney-lorcana-chapter-5-starter-deck-a-collectible-trading-cards/-/A-92568761',
  },

  // Ursula's Return (Chapter 4, 2024)
  {
    id: 'target-lorcana-ursulas-return-display',
    name: "Disney Lorcana: Ursula's Return Booster Display Box",
    tcin: '91351718',
    url: 'https://www.target.com/p/disney-lorcana-trading-card-game-ursula-39-s-return-booster-display-box/-/A-91351718',
  },
  {
    id: 'target-lorcana-ursulas-return-starter-amber',
    name: "Disney Lorcana: Ursula's Return Starter Deck — Amber & Amethyst",
    tcin: '91351720',
    url: 'https://www.target.com/p/disney-lorcana-trading-card-game-ursula-39-s-return-amber-and-amethyst-starter-deck/-/A-91351720',
  },

  // Into The Inklands (Chapter 3, 2024)
  {
    id: 'target-lorcana-inklands-starter-amber',
    name: 'Disney Lorcana: Into The Inklands Starter Deck — Amber & Emerald',
    tcin: '91366485',
    url: 'https://www.target.com/p/disney-lorcana-trading-card-game-into-the-inklands-amber-and-emerald-starter-deck/-/A-91366485',
  },
  {
    id: 'target-lorcana-inklands-starter-ruby',
    name: 'Disney Lorcana: Into The Inklands Starter Deck — Ruby & Sapphire',
    tcin: '91366488',
    url: 'https://www.target.com/p/disney-lorcana-trading-card-game-into-the-inklands-ruby-and-sapphire-starter-deck/-/A-91366488',
  },

  // ── Star Wars: Unlimited ─────────────────────────────────────────────────────

  {
    id: 'target-swu-2025-gift-box',
    name: 'Star Wars: Unlimited 2025 Gift Box',
    tcin: '95012379',
    url: 'https://www.target.com/p/2025-star-wars-unlimited-gift-box/-/A-95012379',
  },

  // ── Digimon Card Game ────────────────────────────────────────────────────────

  {
    id: 'target-digimon-adventure-box-3',
    name: 'Digimon Card Game: Adventure Box 3',
    tcin: '90411210',
    url: 'https://www.target.com/p/digimon-card-game-adventure-box-3/-/A-90411210',
  },
  {
    id: 'target-digimon-adventure-box-2',
    name: 'Digimon Card Game: Adventure Box 2',
    tcin: '88810204',
    url: 'https://www.target.com/p/digimon-card-game-adventure-box-2/-/A-88810204',
  },

  // ── Dragon Ball Super Card Game ──────────────────────────────────────────────

  // Fusion World — Wish for Shenron (FB07, 2025)
  {
    id: 'target-dbs-fw-fb07-pack',
    name: 'Dragon Ball Super Card Game: Fusion World — Wish for Shenron FB07 Booster Pack (6 Cards)',
    tcin: '1008614840',
    url: 'https://www.target.com/p/bandai-dragon-ball-super-card-game-fusion-world-wish-for-shenron-booster-pack-fb07-6-cards/-/A-1008614840',
  },

  // Fusion World — Unknown Adventure (FB05, Japanese, 2024)
  {
    id: 'target-dbs-fw-fb05-box',
    name: 'Dragon Ball Super Card Game: Fusion World — Unknown Adventure FB05 Booster Box (24 Packs, Japanese)',
    tcin: '1005449314',
    url: 'https://www.target.com/p/bandai-dragon-ball-super-card-game-fusion-world-booster-box-unknown-adventure-fb05-japanese-24-packs/-/A-1005449314',
  },

  // Fusion World — Looming Threat (FB06, Japanese, 2024)
  {
    id: 'target-dbs-fw-fb06-box',
    name: 'Dragon Ball Super Card Game: Fusion World — Looming Threat FB06 Booster Box (24 Packs, Japanese)',
    tcin: '1005449312',
    url: 'https://www.target.com/p/bandai-dragon-ball-super-card-game-fusion-world-booster-box-looming-threat-fb06-japanese-24-packs/-/A-1005449312',
  },

  // Fusion World — Fight of Retreating Fire (FB02, 2024)
  {
    id: 'target-dbs-fw-fb02-box',
    name: 'Dragon Ball Super Card Game: Fusion World — Fight of Retreating Fire FB02 Booster Box (24 Packs)',
    tcin: '1010823604',
    url: 'https://www.target.com/p/bandai-dragon-ball-super-card-game-fusion-world-fight-of-retreating-fire-booster-box-fb02-24-packs/-/A-1010823604',
  },

  // Fusion World — Starter Deck Bardock FS05
  {
    id: 'target-dbs-fw-bardock-starter',
    name: 'Dragon Ball Super Card Game: Fusion World Starter Deck — Bardock FS05',
    tcin: '91619909',
    url: 'https://www.target.com/p/dragon-ball-super-card-game-fusion-world-starter-deck-bardock-fs05/-/A-91619909',
  },

  // ── Flesh and Blood ──────────────────────────────────────────────────────────

  {
    id: 'target-fab-dynasty-booster',
    name: 'Flesh and Blood: Dynasty Booster Pack (10 Cards)',
    tcin: '1001562499',
    url: 'https://www.target.com/p/flesh-blood-flesh-and-blood-ccg-dynasty-booster-pack-10-cards/-/A-1001562499',
  },
  {
    id: 'target-fab-welcome-to-rathe-booster-box',
    name: 'Flesh and Blood: Welcome to Rathe Unlimited Booster Box (24 Packs)',
    tcin: '90573257',
    url: 'https://www.target.com/p/legend-story-studios-flesh-and-blood-tcg-welcome-to-rathe-unlimited-booster-box-24-packs/-/A-90573257',
  },
  {
    id: 'target-fab-everfest-booster-box',
    name: 'Flesh and Blood: Everfest Booster Box — 1st Edition (24 Packs)',
    tcin: '90573282',
    url: 'https://www.target.com/p/legend-story-studios-flesh-and-blood-tcg-everfest-1st-edition-booster-box-24-packs/-/A-90573282',
  },

  // ── Union Arena ──────────────────────────────────────────────────────────────

  {
    id: 'target-union-arena-solo-leveling-box',
    name: 'Union Arena: Solo Leveling UE17BT Booster Box (16 Packs)',
    tcin: '1010583466',
    url: 'https://www.target.com/p/bandai-union-arena-card-game-solo-leveling-ue17bt-booster-box-16-packs/-/A-1010583466',
  },
  {
    id: 'target-union-arena-bleach-starter',
    name: 'Union Arena: Bleach Thousand-Year Blood War Starter Deck',
    tcin: '92235530',
    url: 'https://www.target.com/p/union-arena-trading-card-game-bleach-thousand-year-blood-war-starter-deck/-/A-92235530',
  },

];
