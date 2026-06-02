/* ═══════════════════════════════════════════════════════
   FNAF TCG - Card Database
   img paths are relative to assets/images/chars/
   null img → uses default.png fallback
   ═══════════════════════════════════════════════════════ */
window.CARDS_DB = {

  /* ─── UNIVERSAL ENDOS ───────────────────────────── */
  endo_01: {
    id: 'endo_01', name: 'Endo-01', type: 'endo', class: 'classic',
    hp: 50, wakeThreshold: 1, maxCopies: 6, img: 'tcg/endo/endo01.png',
    attacks: [
      { name: 'Broken Wire', cost: 1, type: 'single', damage: 15 },
      { name: 'Inner Spring', cost: 2, type: 'defense', defenseTurns: 1, defenseReduction: 15 }
    ]
  },
  endo_02: {
    id: 'endo_02', name: 'Endo-02', type: 'endo', class: 'toy',
    hp: 50, wakeThreshold: 1, maxCopies: 6, img: 'tcg/endo/endo02.png',
    attacks: [
      { name: 'New Circuit', cost: 1, type: 'single', damage: 15 },
      {
        name: 'Facial Sensor', cost: 1, type: 'stall', stallTargets: 1, stallTurns: 1,
        desc: 'Stall 1 enemy for 1 turn.'
      }
    ]
  },
  spring_endo: {
    id: 'spring_endo', name: 'Springlock Endo', type: 'endo', class: 'phantom',
    hp: 60, wakeThreshold: 1, maxCopies: 6, img: 'tcg/endo/springlock.png',
    attacks: [
      { name: 'Tensioned Spring', cost: 1, type: 'single', damage: 10 },
      { name: 'Faulty Mechanism', cost: 2, type: 'stall', stallTargets: 1, stallTurns: 1 }
    ]
  },
  endo_nm: {
    id: 'endo_nm', name: 'Nightmare Endo', type: 'endo', class: 'nightmare',
    hp: 60, wakeThreshold: 1, maxCopies: 6, img: 'tcg/endo/nightmare_endo.png',
    attacks: [
      { name: 'Terror Claws', cost: 1, type: 'single', damage: 15 },
      { name: 'Dark Roar', cost: 2, type: 'stall', stallTargets: 1, stallTurns: 1 }
    ]
  },
  yenndo: {
    id: 'yenndo', name: 'Funtime Endo', type: 'endo', class: 'funtime',
    hp: 60, wakeThreshold: 1, maxCopies: 6, img: 'tcg/endo/funtime_endo.png',
    attacks: [
      {
        name: 'System Lock', cost: 1, type: 'single', damage: 5, effect: 'item_lock',
        desc: '5 damage + blocks opponent items for 1 turn.'
      },
      { name: 'Electronic Block', cost: 1, type: 'single', damage: 10 }
    ]
  },
  rockstar: {
    id: 'rockstar', name: 'Rockstar Endo', type: 'endo', class: 'rockstar',
    hp: 60, wakeThreshold: 1, maxCopies: 6, img: 'tcg/endo/rockstar_endo.png',
    attacks: [
    { 
      name: 'Tuning', 
      cost: 1, 
      desc: 'Search your deck for a "rockstar" class Shell card and reveal it. Shuffle your deck and place that card on top.', 
      type: 'search', 
      effect: 'rockstar_search_top' 
    },
    { 
      name: 'Metal Scraping', 
      cost: 1, 
      desc: 'Deals 20 damage. If this attack defeats the target, gain 1 Remnant.', 
      type: 'single', 
      damage: 20, 
      effect: 'remnant_on_kill' 
    }
  ]
  },

  /* ─── CLASSIC SHELLS ─────────────────────────────── */
  freddy: {
    id: 'freddy', name: 'Freddy Fazbear', type: 'shell', class: 'classic',
    hp: 120, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'endo_01',
    img: 'classic/freddy.png',
    attacks: [
      { name: 'Stage Microphone', cost: 1, type: 'single', damage: 25, desc: 'Deals 25 damage to 1 enemy.' }
    ],
    ability: { name: 'Showtime', desc: 'Once per turn: draw 1 card from the deck.', id: 'class_classic_draw' }
  },
  bonnie: {
    id: 'bonnie', name: 'Bonnie', type: 'shell', class: 'classic',
    hp: 110, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'endo_01',
    img: 'classic/bonnie.png',
    attacks: [
      { name: 'Guitar Solo', cost: 1, type: 'single', damage: 25, desc: 'Deals 25 damage to 1 enemy.' }
    ],
    ability: { name: 'Backstage Dash', desc: 'Once per turn: discard 1⚡ from Bonnie to give +15 defense for 1 turn to an ally.', id: 'bonnie_quick_defense' }
  },
  chica: {
    id: 'chica', name: 'Chica', type: 'shell', class: 'classic',
    hp: 110, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'endo_01',
    img: 'classic/chica.png',
    attacks: [
      { name: 'Party Feast', cost: 2, type: 'heal', healAmount: 30, healTargets: 2, desc: 'Heals 30 HP to 2 allies.' }
    ],
    ability: { name: 'Kitchen Raid', desc: 'Once per turn: recover 1 energy from the Blob to your Pool.', id: 'chica_blob_energy' }
  },
  foxy: {
    id: 'foxy', name: 'Foxy', type: 'shell', class: 'classic',
    hp: 120, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'endo_01',
    img: 'classic/foxy.png',
    attacks: [
      { name: 'Cove Run', cost: 1, type: 'single', damage: 30 },
      { name: 'Pirate Shield', cost: 2, type: 'defense', defenseTurns: 2, defenseReduction: 15 }
    ]
  },
  golden_freddy: {
    id: 'golden_freddy', name: 'Golden Freddy', type: 'shell', class: 'classic',
    hp: 140, wakeThreshold: 3, energyType: 'agony', requiredEndo: 'endo_01',
    img: 'classic/golden_freddy.png',
    attacks: [
      { name: 'Collapse', cost: 3, type: 'single', damage: 80, desc: 'Deals 80 damage to 1 enemy.' }
    ],
    ability: { name: "It's Me", desc: 'Once per turn: 50% chance to stall all enemies for 1 turn; 50%: nothing.', id: 'golden_freddy_stall_gamble' }
  },

  /* ─── TOY SHELLS ─────────────────────────────────── */
  toy_freddy: {
    id: 'toy_freddy', name: 'Toy Freddy', type: 'shell', class: 'toy',
    hp: 120, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'endo_02',
    img: 'toy/toy_freddy.png',
    attacks: [
      { name: 'Strumble', cost: 1, type: 'single', damage: 25, desc: 'Deals 25 damage to 1 enemy.' }
    ],
    ability: { name: 'Game Over', desc: 'Once per turn: discard 1⚡ from Toy Freddy to stall 1 enemy for 1 turn.', id: 'toy_freddy_stall' }
  },
  toy_bonnie: {
    id: 'toy_bonnie', name: 'Toy Bonnie', type: 'shell', class: 'toy',
    hp: 110, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'endo_02',
    img: 'toy/toy_bonnie.png',
    attacks: [
      { name: 'Perfect Riff', cost: 1, type: 'single', damage: 25, desc: 'Deals 25 damage to 1 enemy.' }
    ],
    ability: { name: 'Rock Star Encore', desc: 'Once per turn: heal 20 HP to an injured ally.', id: 'toy_bonnie_heal' }
  },
  toy_chica: {
    id: 'toy_chica', name: 'Toy Chica', type: 'shell', class: 'toy',
    hp: 110, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'endo_02',
    img: 'toy/toy_chica.png',
    attacks: [
      { name: 'Fashion Cupcake', cost: 1, type: 'heal', healAmount: 25, healTargets: 1, desc: 'Heals 25 HP to 1 ally.' }
    ],
    ability: { name: 'Glamour Boost', desc: 'Once per turn: the next attack from an ally deals +15 extra damage.', id: 'toy_chica_dmgbuff' }
  },
  mangle: {
    id: 'mangle', name: 'Mangle', type: 'shell', class: 'toy',
    hp: 130, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'endo_02',
    img: 'toy/mangle.png',
    attacks: [
      { name: 'Chaos Bite', cost: 1, type: 'single', damage: 30 },
      { name: 'Radio Signal', cost: 3, type: 'stall', stallTargets: 2, stallTurns: 2 }
    ]
  },
  bb: {
    id: 'bb', name: 'Balloon Boy', type: 'shell', class: 'toy',
    hp: 80, wakeThreshold: 1, energyType: 'remnant', requiredEndo: 'endo_02',
    img: 'toy/bb.png',
    attacks: [
      { name: 'Dumb Balloon', cost: 1, type: 'single', damage: 10, effect: 'opponent_discard_energy1' },
      { name: 'Ha Ha Ha!', cost: 2, type: 'stall', stallTargets: 2, stallTurns: 1 }
    ]
  },
    jj: {
    id: 'jj', name: 'JJ', type: 'shell', class: 'toy',
    hp: 80, wakeThreshold: 1,
    energyType: 'remnant', requiredEndo: 'endo_02',
    img: 'toy/jj.png',
    attacks: [
      {
        name: 'Balloon Toss',
        cost: 1, type: 'single', damage: 10,
        effect: 'opponent_discard_energy1',
        desc: '10 damage + removes 1 energy from the target.'
      }
    ],
    ability: {
      name: 'Switcheroo',
      desc: 'Once per turn: swap JJ\'s bench position with an ally (both keep their HP, energy and status). Costs 0 energy.',
      id: 'jj_switcheroo'
    }
  },
  puppet: {
    id: 'puppet', name: 'Puppet', type: 'shell', class: 'toy',
    hp: 100, wakeThreshold: 0, energyType: 'remnant', requiredEndo: 'endo_02',
    img: 'toy/puppet.png',
    attacks: [
      { name: 'Strings of Fate', cost: 1, type: 'single', damage: 20 },
      { name: 'Musical Gift', cost: 3, type: 'heal', healAmount: 30, healTargets: 2 }
    ]
  },

  /* ─── WITHERED SHELLS ────────────────────────────── */
  withered_freddy: {
    id: 'withered_freddy', name: 'Withered Freddy', type: 'shell', class: 'withered',
    hp: 130, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'endo_02',
    img: 'withered/withered_freddy.png',
    attacks: [
      {
        name: 'Classic Collapse', cost: 2, type: 'gamble', successChance: 0.5,
        successTargets: -1, successDamage: 25, failEffect: null,
        desc: '50%: 25 damage to all enemies. 50%: nothing.'
      }
    ],
    ability: { name: 'Recover Energy', desc: 'Retrieves 1 energy from the Blob and places it on a Withered ally.', id: 'wfreddy_blob_energy' }
  },
  withered_bonnie: {
    id: 'withered_bonnie', name: 'Withered Bonnie', type: 'shell', class: 'withered',
    hp: 120, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'endo_02',
    img: 'withered/withered_bonnie.png',
    attacks: [
      { name: 'Faceless Claw', cost: 1, type: 'single', damage: 30, desc: 'Deals 30 damage to 1 enemy.' }
    ],
    ability: { name: 'Reinforced Defense', desc: 'Discards 2⚡ from the Generator to the Blob and applies -20 damage for 2 turns to this card.', id: 'wbonnie_discard_defend' }
  },
  withered_chica: {
    id: 'withered_chica', name: 'Withered Chica', type: 'shell', class: 'withered',
    hp: 120, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'endo_02',
    img: 'withered/withered_chica.png',
    attacks: [
      { name: 'Broken Beak', cost: 1, type: 'single', damage: 25, desc: 'Deals 25 damage to 1 enemy.' }
    ],
    ability: { name: 'Oxidized Boost', desc: 'Discards 1⚡ from this card so a Withered ally (not this one) can attack 2× this turn.', id: 'wchica_double_attack' }
  },
  withered_foxy: {
    id: 'withered_foxy', name: 'Withered Foxy', type: 'shell', class: 'withered',
    hp: 140, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'endo_02',
    img: 'withered/withered_foxy.png',
    attacks: [
      { name: 'Damaged Sprint', cost: 1, type: 'single', damage: 30 },
      { name: 'Iron Shield', cost: 2, type: 'defense', defenseTurns: 2, defenseReduction: 20 }
    ]
  },
  withered_golden: {
    id: 'withered_golden', name: 'Withered Golden Freddy', type: 'shell', class: 'withered',
    hp: 150, wakeThreshold: 3, energyType: 'agony', requiredEndo: 'endo_02',
    img: 'withered/withered_golden.png',
    attacks: [
      { name: 'Total Collapse', cost: 3, type: 'single', damage: 90, desc: 'Deals 90 damage to 1 enemy.' }
    ],
    ability: { name: 'Mass Hallucination', desc: 'Once per turn: 50% chance to stall all enemies for 1 turn; 50%: nothing.', id: 'wgolden_mass_stall' }
  },

  /* ─── SPRINGLOCK / PHANTOM SHELLS ───────────────── */
  springtrap: {
    id: 'springtrap', name: 'Springtrap', type: 'shell', class: 'phantom',
    hp: 170, wakeThreshold: 2, energyType: 'agony', requiredEndo: 'springbonnie',
    img: 'springlock/springtrap.png',
    attacks: [
      { name: 'Suit Claws', cost: 1, type: 'single', damage: 40, desc: 'Deals 40 damage to 1 enemy.' }
    ],
    ability: { name: 'Summon Phantoms', desc: 'Searches a Phantom in the deck and summons it for free (no Phantom Agony cost).', id: 'springtrap_phantom_search' }
  },
  fredbear: {
    id: 'fredbear', name: 'Fredbear', type: 'shell', class: 'phantom',
    hp: 150, wakeThreshold: 3, energyType: 'agony', requiredEndo: 'spring_endo',
    img: 'springlock/fredbear.png',
    attacks: [
      { name: 'Fredbear Bite', cost: 2, type: 'stall', stallTargets: 2, stallTurns: 2 },
      { name: 'Golden Collapse', cost: 3, type: 'single', damage: 90 }
    ]
  },
  springbonnie: {
    id: 'springbonnie', name: 'Spring Bonnie', type: 'shell', class: 'phantom',
    hp: 80, wakeThreshold: 2, energyType: 'agony', requiredEndo: 'spring_endo',
    img: 'springlock/springbonnie.png',
    attacks: [
      { name: 'Spring Mechanism', cost: 1, type: 'single', damage: 20 },
      {
        name: 'Unstable Spring', cost: 2, type: 'gamble',
        successChance: 0.6, successDamage: 70, successEffect: null,
        failEffect: 'springlock_failure',
        desc: '60%: 70 damage. 40%: Springlock fails - Spring Bonnie is destroyed.'
      }
    ]
  },
  p_freddy: {
    id: 'p_freddy', name: 'Phantom Freddy', type: 'shell', class: 'phantom',
    hp: 90, wakeThreshold: 0, energyType: 'phantom_agony', phantomSummon: true,
    img: 'phantom/p_freddy.png',
    attacks: [
      { name: 'Burned Apparition', cost: 1, type: 'stall', stallTargets: 1, stallTurns: 1 },
      { name: 'Smoke Suffocation', cost: 3, type: 'stall', stallTargets: 2, stallTurns: 2 }
    ]
  },
  p_chica: {
    id: 'p_chica', name: 'Phantom Chica', type: 'shell', class: 'phantom',
    hp: 80, wakeThreshold: 0, energyType: 'phantom_agony', phantomSummon: true,
    img: 'phantom/p_chica.png',
    attacks: [
      { name: 'Rotten Cupcake', cost: 1, type: 'stall', stallTargets: 1, stallTurns: 1 },
      { name: 'Shadow Banquet', cost: 2, type: 'stall', stallTargets: 2, stallTurns: 1 }
    ]
  },
  p_bb: {
    id: 'p_bb', name: 'Phantom BB', type: 'shell', class: 'phantom',
    hp: 70, wakeThreshold: 0, energyType: 'phantom_agony', phantomSummon: true,
    img: 'phantom/p_bb.png',
    attacks: [
      { name: 'Phantom Ha Ha', cost: 1, type: 'stall', stallTargets: 1, stallTurns: 1 },
      { name: 'Total Interference', cost: 2, type: 'stall', stallTargets: 2, stallTurns: 2 }
    ]
  },
  p_foxy: {
    id: 'p_foxy', name: 'Phantom Foxy', type: 'shell', class: 'phantom',
    hp: 90, wakeThreshold: 0, energyType: 'phantom_agony', phantomSummon: true,
    img: 'phantom/p_foxy.png',
    attacks: [
      { name: "Foxy's Apparition", cost: 1, type: 'stall', stallTargets: 1, stallTurns: 2 },
      { name: 'Spectral Run', cost: 3, type: 'stall', stallTargets: 3, stallTurns: 1 }
    ]
  },
  p_mangle: {
    id: 'p_mangle', name: 'Phantom Mangle', type: 'shell', class: 'phantom',
    hp: 80, wakeThreshold: 0, energyType: 'phantom_agony', phantomSummon: true,
    img: 'phantom/p_mangle.png',
    attacks: [
      { name: 'Phantom Static', cost: 1, type: 'stall', stallTargets: 1, stallTurns: 1 },
      { name: 'Corrupted Signal', cost: 2, type: 'stall', stallTargets: 2, stallTurns: 2 }
    ]
  },
  p_puppet: {
    id: 'p_puppet', name: 'Phantom Puppet', type: 'shell', class: 'phantom',
    hp: 90, wakeThreshold: 0, energyType: 'phantom_agony', phantomSummon: true,
    img: 'phantom/p_puppet.png',
    attacks: [
      { name: 'Strings from Beyond', cost: 1, type: 'stall', stallTargets: 1, stallTurns: 2 },
      { name: 'Total Control', cost: 3, type: 'stall', stallTargets: -1, stallTurns: 1 }
    ]
  },

  /* ─── NIGHTMARE SHELLS ───────────────────────────── */
  nightmare_freddy: {
    id: 'nightmare_freddy', name: 'Nightmare Freddy', type: 'shell', class: 'nightmare',
    hp: 150, wakeThreshold: 2, energyType: 'agony', requiredEndo: 'endo_nm',
    img: 'nightmare/nightmare_freddy.png',
    attacks: [
      { name: 'Freddles Swarm', cost: 2, type: 'multi', targets: 3, damage: 20, desc: 'Deals 20 damage to up to 3 enemies.' }
    ],
    ability: { name: 'Freddles', desc: 'Once per turn: deal 10 damage to all enemy animatronics in standby.', id: 'nightmare_freddy_freddles' }
  },
  nightmare_bonnie: {
    id: 'nightmare_bonnie', name: 'Nightmare Bonnie', type: 'shell', class: 'nightmare',
    hp: 140, wakeThreshold: 2, energyType: 'agony', requiredEndo: 'endo_nm',
    img: 'nightmare/nightmare_bonnie.png',
    attacks: [
      { name: 'Darkness Claws', cost: 1, type: 'single', damage: 30 },
      { name: 'Hallway Jumpscare', cost: 2, type: 'stall', stallTargets: 2, stallTurns: 2 }
    ]
  },
  nightmare_chica: {
    id: 'nightmare_chica', name: 'Nightmare Chica', type: 'shell', class: 'nightmare',
    hp: 140, wakeThreshold: 2, energyType: 'agony', requiredEndo: 'endo_nm',
    img: 'nightmare/nightmare_chica.png',
    attacks: [
      { name: 'Devour', cost: 1, type: 'single', damage: 25 },
      { name: 'Nightmare Banquet', cost: 3, type: 'heal', healAmount: 60, healTargets: 1 }
    ]
  },
  nightmare_foxy: {
    id: 'nightmare_foxy', name: 'Nightmare Foxy', type: 'shell', class: 'nightmare',
    hp: 150, wakeThreshold: 2, energyType: 'agony', requiredEndo: 'endo_nm',
    img: 'nightmare/nightmare_foxy.png',
    attacks: [
      { name: 'Terror Run', cost: 1, type: 'single', damage: 35 },
      { name: 'Night Armor', cost: 2, type: 'defense', defenseTurns: 2, defenseReduction: 20 }
    ]
  },
  nightmare_fredbear: {
    id: 'nightmare_fredbear', name: 'Nightmare Fredbear', type: 'shell', class: 'nightmare',
    hp: 180, wakeThreshold: 3, energyType: 'agony', requiredEndo: 'endo_nm',
    img: 'nightmare/nightmare_fredbear.png',
    attacks: [
      { name: 'Supreme Terror', cost: 2, type: 'stall', stallTargets: 3, stallTurns: 3 },
      { name: 'Final Nightmare', cost: 4, type: 'single', damage: 100 }
    ]
  },
  plushtrap: {
    id: 'plushtrap', name: 'Plushtrap', type: 'shell', class: 'nightmare',
    hp: 90, wakeThreshold: 1,
    energyType: 'agony', requiredEndo: 'endo_nm',
    img: 'nightmare/creonzadoruin.png',
    attacks: [
      {
        name: 'Spring Snap',
        cost: 1, type: 'single', damage: 20,
        desc: 'Deals 20 damage to 1 enemy.'
      }
    ],
    ability: {
      name: 'Plush Trap',
      desc: 'Once per turn: place a Plush Trap on 1 enemy. The next time that enemy attacks, it takes 30 damage before resolving (one-time trigger).',
      id: 'plushtrap_plush_trap'
    }
  },

  nightmare_bb: {
    id: 'nightmare_bb', name: 'Nightmare BB', type: 'shell', class: 'nightmare',
    hp: 100, wakeThreshold: 1, energyType: 'agony', requiredEndo: 'endo_nm',
    img: 'nightmare/nightmare_bb.png',
    attacks: [
      {
        name: 'Nightmare Balloon', cost: 1, type: 'single', damage: 20, effect: 'opponent_discard_energy1',
        desc: '20 damage + removes 1 energy from the target.'
      },
      { name: 'Childish Terror', cost: 2, type: 'stall', stallTargets: 2, stallTurns: 2 }
    ]
  },
  nightmarionne: {
    id: 'nightmarionne', name: 'Nightmarionne', type: 'shell', class: 'nightmare',
    hp: 130, wakeThreshold: 0, energyType: 'agony', requiredEndo: 'endo_nm',
    img: 'nightmare/nightmarionne.png',
    attacks: [
      { name: 'Dark Strings', cost: 1, type: 'multi', targets: 3, damage: 20 },
      { name: 'String Rain', cost: 3, type: 'stall', stallTargets: -1, stallTurns: 1 }
    ]
  },

  /* ─── JACK-O SHELLS ──────────────────────────────── */
  jacko_bonnie: {
    id: 'jacko_bonnie', name: 'Jack-O-Bonnie', type: 'shell', class: 'jacko',
    hp: 120, wakeThreshold: 2, energyType: 'agony', requiredEndo: 'endo_nm',
    img: 'nightmare/jack-o/bonnie.png',
    attacks: [
      { name: 'Pumpkin Flame', cost: 1, type: 'single', damage: 20, effect: 'burn2' },
      { name: 'Jack-O Explosion', cost: 3, type: 'multi', targets: 2, damage: 20, effect: 'burn2' }
    ]
  },
  jacko_chica: {
    id: 'jacko_chica', name: 'Jack-O-Chica', type: 'shell', class: 'jacko',
    hp: 120, wakeThreshold: 2, energyType: 'agony', requiredEndo: 'endo_nm',
    img: 'nightmare/jack-o/chica.png',
    attacks: [
      { name: 'Purifying Flame', cost: 1, type: 'heal', healAmount: 20, healTargets: 1 },
      { name: 'Fire Frenzy', cost: 3, type: 'multi', targets: 2, damage: 20, effect: 'burn2' }
    ]
  },
  jacko_lantern: {
    id: 'jacko_lantern', name: 'Jack-O-Lantern', type: 'shell', class: 'jacko',
    hp: 80, wakeThreshold: 0, energyType: 'agony', requiredEndo: 'endo_nm',
    img: 'nightmare/jack-o/lantern.png',
    attacks: [
      { name: 'Total Explosion', cost: 1, type: 'multi', targets: -1, damage: 10, effect: 'burn2' },
      { name: 'Fire Armor', cost: 2, type: 'defense', defenseTurns: 2, defenseReduction: 15 }
    ]
  },

  /* ─── SHADOW ─────────────────────────────────────── */
  shadow_freddy: {
    id: 'shadow_freddy', name: 'Shadow Freddy', type: 'shell', class: 'shadow',
    hp: 100, wakeThreshold: 1, shadowSummon: true,
    img: 'shadow/shadow_freddy.png',
    desc: 'Summon cost: 1 Agony or Phantom Agony from hand (consumed automatically).',
    attacks: [
      {
        name: 'Dark Corridor', cost: 1, type: 'gamble',
        successChance: 0.5, successDamage: 50, failEffect: null,
        desc: '50%: 50 damage to 1 enemy. 50%: Nothing.'
      }
    ],
    ability: { name: 'Repeat Gambling', desc: 'Once per turn: repeats the last Gambling that failed (does not stack).', id: 'repeat_gamble' }
  },
  rwqfsfasxc: {
    id: 'rwqfsfasxc', name: 'RWQFSFASXC', type: 'shell', class: 'shadow',
    hp: 90, wakeThreshold: 1, shadowSummon: true,
    img: 'shadow/rxq.png',
    desc: 'Summon cost: 1 Agony or Phantom Agony from hand (consumed automatically).',
    attacks: [
      { name: 'Shadow Pulse', cost: 1, type: 'single', damage: 15, effect: 'draw1' },
      { name: 'Shadow Field', cost: 2, type: 'heal', healAmount: 20, healTargets: 3 }
    ]
  },

  /* ─── SISTER LOCATION ───────────────────────────── */
  baby: {
    id: 'baby', name: 'Circus Baby', type: 'shell', class: 'funtime',
    hp: 150, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'yenndo',
    img: 'funtime/baby.png',
    attacks: [
      { name: 'Electric Shock', cost: 2, type: 'single', damage: 35 }
    ],
    ability: { name: 'Ice Cream Trap', desc: 'Choose 1 enemy: the next attack they receive deals +20 extra damage.', id: 'baby_trap_target' }
  },
  ballora: {
    id: 'ballora', name: 'Ballora', type: 'shell', class: 'funtime',
    hp: 120, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'yenndo',
    img: 'funtime/ballora.png',
    attacks: [
      { name: 'Destructive Spin', cost: 1, type: 'multi', targets: 2, damage: 15 }
    ],
    ability: { name: 'Minireenas', desc: 'Steals 1 energy from an enemy animatronic to your Pool.', id: 'ballora_steal' }
  },
  funtime_freddy: {
    id: 'funtime_freddy', name: 'Funtime Freddy', type: 'shell', class: 'funtime',
    hp: 140, wakeThreshold: 2, energyType: 'agony', requiredEndo: 'yenndo',
    img: 'funtime/funtime_freddy.png',
    attacks: [
      { name: "Bon-Bon's Hand", cost: 2, type: 'single', damage: 40 }
    ],
    ability: { name: 'Bon-Bon!', desc: "The opponent discards 1 random card from their hand.", id: 'ftfreddy_discard' }
  },
  funtime_foxy: {
    id: 'funtime_foxy', name: 'Funtime Foxy', type: 'shell', class: 'funtime',
    hp: 130, wakeThreshold: 2, energyType: 'agony', requiredEndo: 'yenndo',
    img: 'funtime/funtime_foxy.png',
    attacks: [
      { name: 'Stage Hook', cost: 1, type: 'single', damage: 30, desc: 'Deals 30 damage to 1 enemy.' }
    ],
    ability: { name: 'Showstopper', desc: 'Once per turn: discard 1⚡ from Funtime Foxy to stall 1 enemy for 1 turn.', id: 'funtime_foxy_showstopper' }
  },
  yenndo_shell: {
    id: 'yenndo_shell', name: 'Yenndo', type: 'shell', class: 'funtime',
    hp: 110, wakeThreshold: 2,
    energyType: 'agony', requiredEndo: 'yenndo',
    img: 'endo/yenndo.png',
    attacks: [
      {
        name: 'Electronic Surge',
        cost: 2, type: 'multi', targets: 2, damage: 20,
        desc: 'Deals 20 damage to up to 2 enemies.'
      }
    ],
    ability: {
      name: 'System Surge',
      desc: 'Once per turn: draw 1 card.',
      id: 'yenndo_system_surge'
    }
  },

  ennard: {
    id: 'ennard', name: 'Ennard', type: 'shell', class: 'funtime', itemSummonOnly: true, maxCopies: 1,
    hp: 200, wakeThreshold: 3, energyType: 'agony',
    img: 'endo/ennard.png',
    attacks: [], // assigned dynamically at summon time from the Funtimes absorbed
    abilities: [
      { name: 'Central Wire', desc: 'Transfer 1 energy from the Generator to a Funtime ally.', id: 'ennard_generator_boost' }
    ]
  },
  lolbit: {
    id: 'lolbit', name: 'Lolbit', type: 'shell', class: 'funtime',
    hp: 100, wakeThreshold: 1, energyType: 'remnant', requiredEndo: 'yenndo',
    img: 'funtime/lolbit.png',
    attacks: [
      { name: 'System Glitch', cost: 1, type: 'single', damage: 20 }
    ],
    ability: { name: '% BUFFER', desc: "Discard 1 energy from Lolbit: the opponent cannot draw cards at the start of their next turn.", id: 'lolbit_buffer' }
  },

  /* ─── FNAF 6 SCRAPS ─────────────────────────────── */
  scraptrap: {
    id: 'scraptrap', name: 'Scraptrap', type: 'shell', class: 'scrap',
    hp: 170, wakeThreshold: 3, energyType: 'agony', scrapFrom: 'springtrap',
    img: 'springlock/scraptrap.png',
    attacks: [
      { name: 'Destroyed Suit Claws', cost: 2, type: 'single', damage: 50 },
      { name: 'Unstoppable Chase', cost: 3, type: 'multi', targets: 2, damage: 30 }
    ]
  },
  scrap_baby: {
    id: 'scrap_baby', name: 'Scrap Baby', type: 'shell', class: 'scrap',
    hp: 160, wakeThreshold: 2, energyType: 'agony', scrapFrom: 'baby',
    img: 'funtime/scrap_baby.png',
    attacks: [
      { name: 'Corruption Claws', cost: 2, type: 'single', damage: 45 }
    ],
    ability: { name: 'Giant Scissors', desc: 'Attacks 1 enemy for 30 damage without spending energy (counts as an attack).', id: 'scrap_baby_scissors' }
  },
  molten_freddy: {
    id: 'molten_freddy', name: 'Molten Freddy', type: 'shell', class: 'scrap',
    hp: 150, wakeThreshold: 2, energyType: 'agony', scrapFrom: 'funtime_freddy',
    img: 'endo/molten_freddy.png',
    attacks: [
      { name: 'Melted Wires', cost: 2, type: 'multi', targets: -1, damage: 20 }
    ],
    ability: { name: 'Electrical Absorption', desc: 'Steals all energies from 1 enemy animatronic to your Pool.', id: 'molten_steal' }
  },
  lefty: {
    id: 'lefty', name: 'Lefty', type: 'shell', class: 'scrap',
    hp: 140, wakeThreshold: 2, energyType: 'remnant', scrapFrom: 'puppet',
    img: 'rockstar/lefty.png',
    attacks: [
      { name: 'Capture', cost: 1, type: 'stall', stallTargets: 1, stallTurns: 2 }
    ],
    ability: { name: 'Gift of Life', desc: 'Heals all allied animatronics by 30 HP.', id: 'lefty_heal' }
  },
  rockstar_freddy: {
    id: 'rockstar_freddy', name: 'Rockstar Freddy', type: 'shell', class: 'rockstar',
    hp: 130, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'rockstar',
    img: 'rockstar/rockstar_freddy.png',
    attacks: [
      { name: 'Please Deposit 5 Coins', cost: 3, desc:'Discards the top 3 cards of your opponent\'s deck.', type: 'single', damage: 10, effect: 'dicard5' }
    ],
    ability: { name: 'Greedy Draw', desc: 'If one of your party members died the previous turn by damage from an attack, draws 3 cards.', id: 'rockstar_freddy_draw' }
  },
  rockstar_bonnie: {
    id: 'rockstar_bonnie', name: 'Rockstar Bonnie', type: 'shell', class: 'rockstar',
    hp: 140, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'rockstar',
    img: 'rockstar/rockstar_bonnie.png',
    attacks: [
      { name: 'Guitar Solo', cost: 2, desc:'Deals 40 damage to 2 of your opponent\'s animatronics.', type: 'multi', damage: 40, targets: 2 },
    ],
    ability: { name: 'Lead Guitarist', desc: 'If one of your party members died the previous turn by damage from an attack, search for an item card and put it in your hand.', id: 'rockstar_bonnie_item' }
  },
  rockstar_chica: {
    id: 'rockstar_chica', name: 'Rockstar Chica', type: 'shell', class: 'rockstar',
    hp: 130, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'rockstar',
    img: 'rockstar/rockstar_chica.png',
    attacks: [
      { name: 'Cupcake Fest', cost: 1, desc:'Heals 30HP from all party members.', type: 'heal', heal: 50, healTargets: 4 },
      { name: 'Stall Wall', cost: 2, desc:'Stalls 2 of your opponent\'s animatronics.', type: 'stall', stallTargets: 2, stallTurns: 2 },
    ],
  },
  rockstar_foxy: {
    id: 'rockstar_foxy', name: 'Rockstar Foxy', type: 'shell', class: 'rockstar',
    hp: 120, wakeThreshold: 2, energyType: 'remnant', requiredEndo: 'rockstar',
    img: 'rockstar/rockstar_foxy.png',
    attacks: [
      { name: 'Captain Hook', cost: 3, type: 'single', damage: 50, targets: 1 },
    ],
    ability: { name : "Pirate Treasure", desc: "It was friendship all along! Roll a dice, if heads choose between getting a supporter of your choice from your deck or 2 energy from your generator. If tails, a random member of your party takes 40 damage.", id: 'rockstar_foxy_treasure'}
  },
  carnie: {
    id: 'carnie', name: 'Carnie', type: 'shell', class: 'rockstar',
    hp: 90, wakeThreshold: 1, energyType: 'remnant', requiredEndo: 'rockstar',
    img: 'rockstar/carnie.png',
    attacks: [
      { name: 'Prize Booth Music', cost: 3, desc: 'Deals 20 damage to 2 targets and stalls them for 1 turn.', type: 'multi', damage: 20, targets: 2, effect: 'lefty_rockstar' },
    ],
    ability: { name : "Fairground Defense", desc: "Discard 1⚡ to give +15 defense to Carnie for this turn.", id: 'rockstar_lefty_ability'}
  }, //if the player has the Puppet in hand, one agony and a remnant fragment on Canrie, he can evolve to scrap lefty by hand or by dying
  

  /* ─── ITEMS ──────────────────────────────────────── */
  cupcake: {
    id: 'cupcake', name: 'Cupcake', type: 'item', class: 'neutral',
    img: 'tcg/items/cupcake.png',
    desc: 'Restores 30 HP to 1 allied animatronic.',
    effect: 'heal30'
  },
  mini_cupcake: {
    id: 'mini_cupcake', name: 'Mini Cupcake', type: 'item', class: 'neutral',
    img: 'tcg/items/mini_cupcake.png',
    desc: 'Restores 15 HP to up to 2 allied animatronics.',
    effect: 'heal15x2'
  },
  lantern: {
    id: 'lantern', name: 'Flashlight', type: 'item', class: 'neutral',
    img: 'tcg/items/flashlight.png',
    desc: 'Stalls all enemy Foxys and Mangles for 1 turn.',
    effect: 'lantern_stall'
  },
  power_out: {
    id: 'power_out', name: 'Power Out', type: 'item', class: 'neutral',
    img: 'tcg/items/out.png',
    desc: 'Discard 2 energies from your Pool to search any card in the deck and add it to your hand.',
    effect: 'power_out'
  },
  dee_dee_pearl: {
    id: 'dee_dee_pearl', name: "DeeDee's Pearl", type: 'item', class: 'neutral',
    img: 'trophy/pearl_tropy.png',
    desc: 'Choose up to 5 cards (animatronics or energies) from your Blob Pile and return them to your hand.',
    effect: 'dee_dee_pearl'
  },
  power_battery: {
    id: 'power_battery', name: 'Extra Battery', type: 'item', class: 'neutral',
    img: 'tcg/items/extra_battery.png',
    desc: 'Draw 2 energies from the Generator to your Pool.',
    effect: 'draw2energy'
  },
  birthday_cake: {
    id: 'birthday_cake', name: 'Birthday Cake', type: 'item', class: 'neutral',
    img: 'tcg/items/cake.png',
    desc: 'Draw 2 cards from the main deck.',
    effect: 'draw2'
  },
  security_tape: {
    id: 'security_tape', name: 'Security Tape', type: 'item', class: 'neutral',
    img: 'tcg/items/tape.png',
    desc: 'Removes stall from 1 allied animatronic.',
    effect: 'remove_stall'
  },
  antidote: {
    id: 'antidote', name: 'Fazbear Antidote', type: 'item', class: 'neutral',
    img: 'tcg/items/antidote.png',
    desc: 'Removes all Burn stacks from 1 allied animatronic.',
    effect: 'remove_burn'
  },
  energy_recharge: {
    id: 'energy_recharge', name: 'Energy Recharge', type: 'item', class: 'neutral',
    img: 'tcg/items/recharge.png',
    desc: 'Search the Blob Pile and recover up to 2 energies to your Pool.',
    effect: 'blob_recover2', maxCopies: 4
  },
  data_escape: {
    id: 'data_escape', name: 'Data Escape', type: 'item', class: 'neutral',
    img: 'tcg/items/data.png',
    desc: 'Discard 2 cards from your hand to search any 1 card from the deck and add it to your hand.',
    effect: 'hand_discard2_search'
  },
  system_corrupt: {
    id: 'system_corrupt', name: 'System Corruption', type: 'item', class: 'neutral',
    img: 'tcg/items/system.png',
    desc: 'Discard up to 2 cards from your deck (your choice).',
    effect: 'deck_discard3_choose'
  },
  ennard_summon: {
    id: 'ennard_summon', name: 'The Cable Net', type: 'item', maxCopies: 1,
    img: 'tcg/items/ennard_cable.png',
    desc: 'Requires Ennard in hand and ≥2 evolved Funtime shells in Party (endos OK in other slots). Sends party Funtimes to Blob, then Ennard inherits unique attacks & abilities from ALL Funtimes in the Blob Pile.',
    effect: 'summon_ennard'
  },
  bucket_bob: {
    id: 'bucket_bob', name: 'Bucket Bob', type: 'item', class: 'neutral',
    img: 'trash/bucket_bob.png',
    desc: 'Choose 1 enemy animatronic. It cannot use Abilities during its next turn.',
    effect: 'disable_ability'
  },
  pan_stan: {
    id: 'pan_stan', name: 'Pan Stan', type: 'item', class: 'neutral',
    img: 'trash/pan_stan.png',
    desc: 'Deals 10 damage to one random animatronic from your opponent.',
    effect: 'pan_stan'
  },
  no_1_crate: {
    id: 'no_1_crate', name: '#1 Crate', type: 'item', class: 'neutral',
    img: 'trash/no_1_crate.png',
    desc: 'Stalls 1 enemy animatronic for 2 turns.',
    effect: 'trash_stall'
  },
  mr_hugs: {
    id: 'mr_hugs', name: 'Mr. Hugs', type: 'item', class: 'neutral',
    img: 'trash/mr_hugs.png',
    desc: 'Discard 1 Energy from the opponent\'s active animatronic and attach it to your Pool.',
    effect: 'energy_steal'
  },
  
  /* ─── TOOLS ──────────────────────────────────────── */
  freddy_mask: {
    id: 'freddy_mask', name: 'Freddy Mask', type: 'tool', class: 'neutral',
    img: 'tcg/tools/mask.png',
    desc: 'Immune to attacks and effects from the Toy and Withered factions - except Withered Foxy.',
    passive: 'faction_immunity'
  },
  mendos_endos: {
    id: 'mendos_endos', name: "Mendo's Endos", type: 'tool', class: 'neutral',
    img: 'tcg/tools/mendo.png',
    desc: 'On equip: increases the bearer\'s maximum and current HP by 40.',
    passive: 'hp+40', onEquip: true
  },
  hat_mic: {
    id: 'hat_mic', name: 'Hat + Microphone', type: 'tool', class: 'neutral',
    img: 'tcg/tools/hat.png',
    desc: '+10 damage on all of the bearer\'s attacks.',
    passive: 'attack+10'
  },
  guitar_axe: {
    id: 'guitar_axe', name: 'Guitar Axe', type: 'tool', class: 'neutral',
    img: 'tcg/tools/guitar.png',
    desc: 'Attacks costing ≥3 energy deal +20 damage.',
    passive: 'heavyattack+20'
  },
  hook: {
    id: 'hook', name: 'Pirate Hook', type: 'tool', class: 'neutral',
    img: 'tcg/tools/hook.png',
    desc: '+1 extra turn on any activated defense.',
    passive: 'defense+1turn'
  },
  springlock_device: {
    id: 'springlock_device', name: 'Springlock Device', type: 'tool', class: 'neutral',
    img: 'tcg/tools/springlock.png',
    desc: 'When the bearer is KO, deals 30 damage to the animatronic that defeated it.',
    passive: 'revenge30'
  },
  fireproof_suit: {
    id: 'fireproof_suit', name: 'Fireproof Suit', type: 'tool', class: 'neutral',
    img: 'tcg/tools/fire_proof.png',
    desc: 'The bearer is immune to Burn. If it already has Burn stacks when equipped, they are removed.',
    passive: 'burn_immune'
  },
  static_dampener: {
    id: 'static_dampener', name: 'Static Dampener', type: 'tool', class: 'neutral',
    img: 'tcg/tools/static.png',
    desc: 'The bearer is immune to Stall effects.',
    passive: 'stall_immune'
  },
  puppet_box: {
    id: 'puppet_box', name: 'Music Box', type: 'tool', class: 'neutral',
    img: 'tcg/tools/box.png',
    desc: 'Once per turn: draw 1 card from the deck.',
    once_per_turn: 'draw1'
  },
  fragmento_remnant: {
    id: 'fragmento_remnant', name: 'Remnant Fragment', type: 'tool', class: 'neutral',
    img: 'tcg/tools/remnant.png',
    desc: 'Equip on Springtrap, Circus Baby, Funtime Freddy or Puppet only. When that animatronic is KO, it transforms into the corresponding Scrap (if available in hand or deck).',
    passive: 'scrap',
    toolTarget: ['springtrap', 'baby', 'funtime_freddy', 'puppet']
  },
    mr_can_do: {
    id: 'mr_can_do', name: 'Mr. Can-Do', type: 'tool', class: 'neutral',
    img: 'trash/mr_can-do.png',
    desc: 'Attach to 1 allied animatronic. It blocks the next negative status effect (Stall or Burn) applied by the opponent, then discard Mr. Can-Do.',
    effect: 'status_shield'
  },

  /* ─── SUPPORTERS ─────────────────────────────────── */
  phone_guy: {
    id: 'phone_guy', name: 'Phone Guy', type: 'supporter', class: 'neutral',
    img: 'human/phone_guy.png',
    desc: 'Draw 3 cards from the deck.',
    effect: 'draw3'
  },
  henry_emily: {
    id: 'henry_emily', name: 'Henry Emily', type: 'supporter', class: 'neutral',
    img: 'human/henry.png',
    desc: 'Search the deck for any Endo or Shell and add it to your hand.',
    effect: 'search_animatronic'
  },
  purple_guy: {
    id: 'purple_guy', name: 'Purple Guy', type: 'tool', class: 'neutral',
    img: 'human/afton.png',
    desc: 'Equip on Springbonnie only: enables transformation into Springtrap and free summoning of Phantoms. While active, discards 1 random card from the opponent\'s hand.',
    passive: 'william',
    toolTarget: ['springbonnie']
  },
  william_afton: {
    id: 'william_afton', name: 'William Afton', type: 'supporter', class: 'neutral',
    img: 'tcg/supporters/afton.png',
    desc: 'Gambling - 50%: 20 damage to all enemies; 50%: 20 damage to all allies.',
    effect: 'william_gamble'
  },
  helpy: {
    id: 'helpy', name: 'Helpy', type: 'supporter', class: 'neutral',
    img: 'other/helpy.gif',
    desc: 'Gambling - 99%: does nothing; 1%: 1B damage to one random enemy.',
    effect: 'helpy_gamble'
  },
  william_search: {
    id: 'william_search', name: "Afton's Search", type: 'supporter', class: 'neutral',
    img: 'tcg/supporters/research.png',
    desc: 'Search your deck for up to 2 Energy cards (Remnant or Agony) and add them to your hand.',
    effect: 'william_search'
  },
  mrs_afton: {
    id: 'mrs_afton', name: 'Mrs. Afton', type: 'supporter', class: 'neutral',
    img: 'tcg/supporters/mrs_afton.png',
    desc: 'Restores 20 HP to all your animatronics in play.',
    effect: 'heal_all20'
  },
  fazbear_tech: {
    id: 'fazbear_tech', name: 'Fazbear Entertainment', type: 'supporter', class: 'neutral',
    img: null,
    desc: 'Draw 2 energies from the Generator to your Pool. Then draw 1 card.',
    effect: 'draw2energy_draw1'
  },
  night_guard: {
    id: 'night_guard', name: 'Night Guard', type: 'supporter', class: 'neutral',
    img: 'tcg/supporters/guard.png',
    desc: 'Your active animatronic reduces 15 damage for the next 2 attacks received.',
    effect: 'defense_guard'
  },
  happy_frog: {
    id: 'happy_frog', name: 'Happy Frog', type: 'supporter', class: 'neutral',
    img: 'mediocre_melodies/happy_frog.png',
    desc: 'Look at the top 5 cards of your opponent\'s deck, rearrange them in any order you want, and put them back.',
    effect: 'rearrange_opponent_deck'
  },
  mr_hippo: {
    id: 'mr_hippo', name: 'Mr. Hippo', type: 'supporter', class: 'neutral',
    img: 'mediocre_melodies/mr_hippo.png',
    desc: 'Both players must shuffle their hands back into their respective decks and draw 4 cards.',
    effect: 'hand_reset_4'
  },
  pigpatch: {
    id: 'pigpatch', name: 'Pigpatch', type: 'supporter', class: 'neutral',
    img: 'mediocre_melodies/pigpatch.png',
    desc: 'Discard all tool cards attached to 1 enemy animatronic.',
    effect: 'remove_enemy_tools'
  },
  nedd_bear: {
    id: 'nedd_bear', name: 'Nedd Bear', type: 'supporter', class: 'neutral',
    img: 'mediocre_melodies/nedd_bear.png',
    desc: 'Shuffle your hand into your deck and Gamble. 50%: Draw 8 cards. 50%: Draw 1 card.',
    effect: 'nedd_gamble'
  },
  orville_elephant: {
    id: 'orville_elephant', name: 'Orville Elephant', type: 'supporter', class: 'neutral',
    img: 'mediocre_melodies/orville_elephant.png',
    desc: 'Choose 1 Item card from your Blob Pile and put it back into your hand.',
    effect: 'recover_item_from_blob'
  },

  /* ─── CLASS CARDS ───────────────────────────────── */
  class_classic: {
    id: 'class_classic', name: 'The Original Band', type: 'class', class: 'classic',
    img: null,
    effectId: 'class_classic_draw', oncePer: 'turn',
    effectDesc: 'Draw 1 card from the deck.',
    desc: 'Freddy, Bonnie, Chica and Foxy - the four originals of Fazbear Entertainment.'
  },
  class_toy: {
    id: 'class_toy', name: 'New Generation', type: 'class', class: 'toy',
    img: null,
    effectId: 'class_toy_heal', oncePer: 'turn',
    effectDesc: 'Heal 10 HP on an ally. Discard 1⚡ from the Pool to heal 30 instead of 10.',
    desc: 'Modern, smiling models - but equally dangerous at night.'
  },
  class_withered: {
    id: 'class_withered', name: 'Damaged but Dangerous', type: 'class', class: 'withered',
    img: null,
    effectId: 'class_withered_def', oncePer: 'turn',
    effectDesc: 'Give +15 defense for 1 turn to a Withered ally.',
    desc: 'Deteriorated bodies hide relentless power from the old versions.'
  },
  class_phantom: {
    id: 'class_phantom', name: 'Residual Agony', type: 'class', class: 'phantom',
    img: null,
    effectId: 'class_phantom_stall', oncePer: 'turn',
    effectDesc: 'Discard 1⚡ from the Pool and give Stall 1T to 1 enemy.',
    desc: 'Memories of agony that never disappear. Always present, never silenced.'
  },
  class_nightmare: {
    id: 'class_nightmare', name: 'Total Terror', type: 'class', class: 'nightmare',
    img: null,
    effectId: 'class_nightmare_aoe', oncePer: 'turn',
    effectDesc: '15 damage to all enemies in standby.',
    desc: 'Nightmares have no mercy. All tremble before the Nightmares\' power.'
  },
  class_jacko: {
    id: 'class_jacko', name: 'Flame of Agony', type: 'class', class: 'jacko',
    img: null,
    effectId: 'class_jacko_burn', oncePer: 'turn',
    effectDesc: 'Passive: +5 damage per Burn stack. Discard 1⚡ to give Burn 1 to 1 enemy.',
    desc: 'The fire of agony burns forever - and burns deeper than any other.'
  },
  class_shadow: {
    id: 'class_shadow', name: 'Devastating Shadow', type: 'class', class: 'shadow',
    img: null,
    effectId: 'class_shadow_drain', oncePer: 'turn',
    effectDesc: 'The enemy discards 1⚡ from one of their animatronics.',
    desc: 'Shadows consume vital energy - nobody is safe from their influence.'
  },
  class_funtime: {
    id: 'class_funtime', name: 'Scooping Protocol', type: 'class', class: 'funtime',
    img: null,
    effectId: 'class_funtime_draw', oncePer: 'turn',
    effectDesc: 'Discard 1 card from hand and draw 2 from the deck.',
    desc: 'The Scooping Room processes everything efficiently. Energy is never wasted.'
  },
  class_scrap: {
    id: 'class_scrap', name: 'Remnants', type: 'class', class: 'scrap',
    img: null,
    effectId: 'class_scrap_revive', oncePer: 'game',
    effectDesc: 'Revive 1 random Scrap from the Blob Pile with full HP in an empty slot.',
    desc: 'What was destroyed can be rebuilt. The Scraps always come back.'
  },
  class_rockstar: {
    id: 'class_rockstar', name: 'Rockstar Discount', type: 'class', class: 'rockstar',
    img: null,
    effectId: 'class_rockstar_discount', oncePer: 'turn',
    effectDesc: 'Discard 1 card from your hand. Choose one of your animatronics to reduce their Attack\'s Energy cost by 1⚡ this turn.',
    desc: 'The Rockstars know exactly how to turn a good investment into a devastating show.'
  },

  /* ─── ENERGY CARDS ───────────────────────────────── */
  energy_remnant: {
    id: 'energy_remnant', name: 'Remnant Energy', type: 'energy', class: 'neutral',
    energyType: 'remnant', maxCopies: 12, img: null,
    desc: 'Play to add 1 Remnant to your Pool.'
  },
  energy_agony: {
    id: 'energy_agony', name: 'Agony Energy', type: 'energy', class: 'neutral',
    energyType: 'agony', maxCopies: 12, img: null,
    desc: 'Play to add 1 Agony to your Pool.'
  },
  energy_phantom_agony: {
    id: 'energy_phantom_agony', name: 'Phantom Agony', type: 'energy', class: 'neutral',
    energyType: 'phantom_agony', maxCopies: 12, img: null,
    desc: 'Play to add 1 Phantom Agony to your Pool.'
  }
};