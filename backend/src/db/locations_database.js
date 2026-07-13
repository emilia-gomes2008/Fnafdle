/* =======================================================
       Locations Database
       =======================================================
       Fields:
         name       → location name
         game       → game/media the location is from
         gameNumber → chronological release order of that game (used for higher/lower hints)
         img        → location image path
         id         → unique key (derived below from img, since
                       `name` alone can repeat across games, e.g.
                       "Freddy Fazbear's Pizza" in FNAF1/2/UCN)
    ======================================================= */
const LOCATIONS = [
  // === Five Nights at Freddy's ===
  {
    name: "Freddy Fazbear's Pizza",
    game: "Five Nights at Freddy's",
    gameNumber: 1,
    img: "images/locations/freddy_fazbears_pizza_fnaf1.png"
  },

  // === Five Nights at Freddy's 2 ===
  {
    name: "Freddy Fazbear's Pizza",
    game: "Five Nights at Freddy's 2",
    gameNumber: 2,
    img: "images/locations/freddy_fazbears_pizza_fnaf2.png"
  },

  // === Five Nights at Freddy's 3 ===
  {
    name: "Fazbear's Fright: The Horror Attraction",
    game: "Five Nights at Freddy's 3",
    gameNumber: 3,
    img: "images/locations/fazbears_fright.png"
  },

  // === Five Nights at Freddy's 4 ===
  {
    name: "Bedroom",
    game: "Five Nights at Freddy's 4",
    gameNumber: 4,
    img: "images/locations/bedroom.png"
  },
  {
    name: "Afton Household",
    game: "Five Nights at Freddy's 4",
    gameNumber: 4,
    img: "images/locations/aftons_household.png"
  },
  {
    name: "Fredbear's Family Diner",
    game: "Five Nights at Freddy's 4",
    gameNumber: 4,
    img: "images/locations/fredbears_family_diner.png"
  },

  // === FNaF World ===
  {
    name: "Fazbear Hills",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/fazbear_hills.png"
  },
  {
    name: "DeeDee's Fishing Hole",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/deedees_fishing_hole.png"
  },
  {
    name: "Choppy's Woods",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/choppys_woods.png"
  },
  {
    name: "Dusting Fields",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/dusting_fields.png"
  },
  {
    name: "Lilygear Lake",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/lilygear_lake.png"
  },
  {
    name: "Blacktomb Yard",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/blacktomb_yard.png"
  },
  {
    name: "Deep-Metal Mine",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/deep-metal_mine.png"
  },
  {
    name: "Mysterious Mine",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/mysterious_mine.png"
  },
  {
    name: "Pinwheel Circus",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/pinwheel_circus.png"
  },
  {
    name: "Pinwheel Funhouse",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/pinwheel_funhouse.png"
  },
  {
    name: "Breadcrumbs",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/breadcrumbs.png"
  },
  {
    name: "&*____TWRE",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/glitch_world.png"
  },
  {
    name: "Halloween Backstage",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/halloween_backstage.png"
  },
  {
    name: "FNaF 57: Freddy in Space",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/freddy_in_space.png"
  },
  {
    name: "Foxy Fighters",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/foxy_fighters.png"
  },
  {
    name: "Foxy.exe",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/foxy_exe.png"
  },
  {
    name: "Chica's Magic Rainbow",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/chicas_magic_rainbow.png"
  },
  {
    name: "Geist Lair",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/geist_lair.png"
  },
  {
    name: "Flipside Layer 1",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/layer_1_flipside.png"
  },
  {
    name: "Flipside Layer 2",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/layer_2_flipside.png"
  },
  {
    name: "Flipside Layer 3",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/layer_3_flipside.png"
  },
  {
    name: "Flipside Layer 4",
    game: "FNaF World",
    gameNumber: 5,
    img: "images/locations/layer_4_flipside.png"
  },

  // === Five Nights at Freddy's: Sister Location ===
  {
    name: "Circus Baby's Entertainment and Rental",
    game: "Five Nights at Freddy's: Sister Location",
    gameNumber: 6,
    img: "images/locations/circus_babys_entertainment_and_rentals.png"
  },
  {
    name: "Afton Robotics, LLC",
    game: "Five Nights at Freddy's: Sister Location",
    gameNumber: 6,
    img: "images/locations/afton_robotcs.png"
  },
  {
    name: "Circus Baby's Pizza World",
    game: "Five Nights at Freddy's: Sister Location",
    gameNumber: 6,
    img: "images/locations/circus_babys_pizza_world.png"
  },

  // === Freddy Fazbear's Pizzeria Simulator ===
  {
    name: "Freddy Fazbear's Pizza Place",
    game: "Freddy Fazbear's Pizzeria Simulator",
    gameNumber: 7,
    img: "images/locations/freddy_fazbears_pizza_place.png"
  },
  {
    name: "JR's",
    game: "Freddy Fazbear's Pizzeria Simulator",
    gameNumber: 7,
    img: "images/locations/jrs.png"
  },

  // === Ultimate Custom Night ===
  {
    name: "Freddy Fazbear's Pizza",
    game: "Ultimate Custom Night",
    gameNumber: 8,
    img: "images/locations/freddy_fazbears_pizza_ucn.png"
  },

  // === Five Nights at Freddy's: Help Wanted ===
  {
    name: "The Freddy Fazbear Virtual Experience",
    game: "Five Nights at Freddy's: Help Wanted",
    gameNumber: 9,
    img: "images/locations/the_freddy_fazbear_virtual_experience.png"
  },
  {
    name: "Princess Quest",
    game: "Five Nights at Freddy's: Help Wanted",
    gameNumber: 9,
    img: "images/locations/princess_quest.png"
  },

  // === Five Nights at Freddy's AR: Special Delivery ===
  {
    name: "Fazbear Funtime Service",
    game: "Five Nights at Freddy's AR: Special Delivery",
    gameNumber: 10,
    img: "images/locations/fazbear_funtime_service.png"
  },
  {
    name: "Fazbear Circus",
    game: "Five Nights at Freddy's AR: Special Delivery",
    gameNumber: 10,
    img: "images/locations/fazbear_circus.png"
  },
  {
    name: "Plushtrap Hallway",
    game: "Five Nights at Freddy's Special Delivery",
    gameNumber: 10,
    img: "images/locations/plushtrap_map.png"
  },

  // === Five Nights at Freddy's: Security Breach ===
  {
    name: "Freddy Fazbear's Mega Pizzaplex",
    game: "Five Nights at Freddy's: Security Breach",
    gameNumber: 11,
    img: "images/locations/freddy_fazbears_mega_pizzaplex.png"
  },
  {
    name: "Sinkhole",
    game: "Five Nights at Freddy's: Security Breach",
    gameNumber: 11,
    img: "images/locations/sinkhole.png"
  },
  {
    name: "Fredbear's Singin' Show",
    game: "Five Nights at Freddy's: Security Breach",
    gameNumber: 11,
    img: "images/locations/fredbears_singing_show.png"
  },

  // === Five Nights at Freddy's: Help Wanted 2 ===
  {
    name: "Fazbear Orientation Program",
    game: "Five Nights at Freddy's: Help Wanted 2",
    gameNumber: 12,
    img: "images/locations/fazbear_orientation_program.png"
  },

  // === Five Nights at Freddy's: Secret of the Mimic ===
  {
    name: "Murray's Costume Manor",
    game: "Five Nights at Freddy's: Secret of the Mimic",
    gameNumber: 13,
    img: "images/locations/murrays_costume_manor.png"
  },
  {
    name: "Chica's Party World",
    game: "Five Nights at Freddy's: Secret of the Mimic",
    gameNumber: 13,
    img: "images/locations/chicas_party_world.png"
  },
  {
    name: "Murray's Household",
    game: "Five Nights at Freddy's: Secret of the Mimic",
    gameNumber: 13,
    img: "images/locations/murrays_household.png"
  },
];

LOCATIONS.forEach(l => { l.id = l.img.split('/').pop().replace(/\.[a-z0-9]+$/i, ''); });
