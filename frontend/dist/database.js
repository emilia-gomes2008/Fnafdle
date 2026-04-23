/* =======================================================
       Character Database
       =======================================================
       Fields:
         name   → character name
         animal → animal type (Bear, Rabbit, etc.)
         type   → variant (Classic, Withered, Toy, Shadow, etc.)
         color  → color(s)
         eyeColor → eye color(s)
         year   → origin year
         img    → ../../images/chars/<type>/<name>.<format>
    ======================================================= */
const CHARS = [

  // === Fnaf 1 ===
  {
    name: "Freddy Fazbear",
    animal: "Bear",
    type: "Classic",
    color: ["Brown"],
    eyeColor: ["Blue"],
    year: 1993,
    img: "../../images/chars/classic/freddy.png"
  },
  {
    name: "Bonnie",
    animal: "Rabbit",
    type: "Classic",
    color: ["Blue"],
    eyeColor: ["Red"],
    year: 1993,
    img: "../../images/chars/classic/bonnie.png"
  },
  {
    name: "Chica",
    animal: "Chicken",
    type: "Classic",
    color: ["Yellow"],
    eyeColor: ["Magenta"],
    year: 1993,
    img: "../../images/chars/classic/chica.png"
  },
  {
    name: "Cupcake",
    animal: "Cupcake",
    type: "Classic",
    color: ["Pink"],
    eyeColor: ["Yellow"],
    year: 1993,
    img: "../../images/chars/classic/cupcake.png"
  },
  {
    name: "Foxy",
    animal: "Fox",
    type: "Classic",
    color: ["Red"],
    eyeColor: ["Yellow"],
    year: 1993,
    img: "../../images/chars/classic/foxy.png"
  },
  {
    name: "Ralph",
    animal: "Human",
    type: "Other",
    color: ["Blue"],
    eyeColor: ["Black"],
    year: "Unknown",
    img: "../../images/chars/other/phone_guy.png"
  },
  {
    name: "Fan",
    animal: "Fan",
    type: "Other",
    color: ["Grey"],
    eyeColor: ["Grey"],
    year: 1993,
    img: "../../images/chars/other/fan.png"
  },
  {
    name: "Golden Freddy",
    animal: "Bear",
    type: "Classic",
    color: ["Yellow"],
    eyeColor: ["Black"],
    year: 1993,
    img: "../../images/chars/classic/golden_freddy.png"
  },
  {
    name: "Endo-01",
    animal: "Skeleton",
    type: "Endo",
    color: ["Grey"],
    eyeColor: ["Blue"],
    year: 1993,
    img: "../../images/chars/endo/endo01.png"
  },

  // === Fnaf 2 ===
  {
    name: "Toy Freddy",
    animal: "Bear",
    type: "Toy",
    color: ["Brown"],
    eyeColor: ["Blue"],
    year: 1987,
    img: "../../images/chars/toy/toy_freddy.png"
  },
  {
    name: "Toy Bonnie",
    animal: "Rabbit",
    type: "Toy",
    color: ["Blue"],
    eyeColor: ["Green"],
    year: 1987,
    img: "../../images/chars/toy/toy_bonnie.png"
  },
  {
    name: "Toy Chica",
    animal: "Chicken",
    type: "Toy",
    color: ["Yellow"],
    eyeColor: ["Blue"],
    year: 1987,
    img: "../../images/chars/toy/toy_chica.png"
  },
  {
    name: "Toy Cupcake",
    animal: "Cupcake",
    type: "Toy",
    color: ["Pink"],
    eyeColor: ["Blue"],
    year: 1987,
    img: "../../images/chars/toy/toy_cupcake.png"
  },
  {
    name: "Toy Foxy",
    animal: "Fox",
    type: "Toy",
    color: ["White", "Pink"],
    eyeColor: ["Yellow"],
    year: 1987,
    img: "../../images/chars/toy/toy_foxy.png"
  },
  {
    name: "Mangle",
    animal: "Fox",
    type: "Toy",
    color: ["White", "Pink"],
    eyeColor: ["Yellow"],
    year: 1987,
    img: "../../images/chars/toy/mangle.png"
  },
  {
    name: "Balloon Boy",
    animal: "Hunanoid",
    type: "Toy",
    color: ["Red", "Blue"],
    eyeColor: ["Blue"],
    year: 1987,
    img: "../../images/chars/toy/bb.png"
  },
  {
    name: "JJ",
    animal: "Humanoid",
    type: "Toy",
    color: ["Purple", "Blue"],
    eyeColor: ["Magenta"],
    year: 1987,
    img: "../../images/chars/toy/jj.png"
  },
  {
    name: "Endo-02",
    animal: "Skeleton",
    type: "Endo",
    color: ["Grey"],
    eyeColor: ["Blue"],
    year: 1987,
    img: "../../images/chars/endo/endo02.png"
  },
  {
    name: "Puppet",
    animal: "Hunanoid",
    type: "Toy",
    color: ["Black"],
    eyeColor: ["Black"],
    year: 1987,
    img: "../../images/chars/toy/puppet.png"
  },
  {
    name: "Withered Freddy",
    animal: "Bear",
    type: "Withered",
    color: ["Brown"],
    eyeColor: ["Blue"],
    year: 1987,
    img: "../../images/chars/withered/withered_freddy.png"
  },
  {
    name: "Withered Bonnie",
    animal: "Rabbit",
    type: "Withered",
    color: ["Blue"],
    eyeColor: ["Red"],
    year: 1987,
    img: "../../images/chars/withered/withered_bonnie.png"
  },
  {
    name: "Withered Chica",
    animal: "Chicken",
    type: "Withered",
    color: ["Yellow"],
    eyeColor: ["Magenta"],
    year: 1987,
    img: "../../images/chars/withered/withered_chica.png"
  },
  {
    name: "Withered Foxy",
    animal: "Fox",
    type: "Withered",
    color: ["Red"],
    eyeColor: ["Yellow"],
    year: 1987,
    img: "../../images/chars/withered/withered_foxy.png"
  },
  {
    name: "Withered Golden Freddy",
    animal: "Bear",
    type: "Withered",
    color: ["Yellow"],
    eyeColor: ["Black"],
    year: 1987,
    img: "../../images/chars/withered/withered_golden.png"
  },
  {
    name: "Shadow Freddy",
    animal: "Bear",
    type: "Shadow",
    color: ["Purple"],
    eyeColor: ["Black"],
    year: 1987,
    img: "../../images/chars/shadow/shadow_freddy.png"
  },
  {
    name: "RWQFSFASXC",
    animal: "Rabbit",
    type: "Shadow",
    color: ["Black"],
    eyeColor: ["White"],
    year: 1987,
    img: "../../images/chars/shadow/rxq.png"
  },
  {
    name: "Paper Pals",
    animal: "Other",
    type: "Other",
    color: ["White"],
    eyeColor: ["White"],
    year: 1987,
    img: "../../images/chars/other/Paperpals.png"
  },

  // === Fnaf 2 Minigmaes ===
  {
    name: "Crying Children",
    animal: "Other",
    type: "Other",
    color: ["White"],
    eyeColor: ["Grey"],
    year: "Unconfirmed",
    img: "../../images/chars/other/crying_child.png"
  },
  {
    name: "William Afton",
    animal: "Human",
    type: "Other",
    color: ["Purple"],
    eyeColor: ["White"],
    year: "Unconfirmed",
    img: "../../images/chars/other/afton.png"
  },

  // === Fnaf 3 ===
  {
    name: "Springtrap",
    animal: "Rabbit",
    type: "Springlock",
    color: ["Green"],
    eyeColor: ["Silver"],
    year: 2023,
    img: "../../images/chars/springlock/springtrap.png"
  },
  {
    name: "Phone Dude",
    animal: "Human",
    type: "Other",
    color: ["Green"],
    eyeColor: ["Black"],
    year: "Unknown",
    img: "../../images/chars/other/phone_dude.png"
  },
  {
    name: "Phantom Freddy",
    animal: "Bear",
    type: "Phantom",
    color: ["Green"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/phantom/p_freddy.png"
  },
  {
    name: "Phantom Chica",
    animal: "Chicken",
    type: "Phantom",
    color: ["Green"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/phantom/p_chica.png"
  },
  {
    name: "Shadow Cupcake",
    animal: "Cupcake",
    type: "Shadow",
    color: ["Black"],
    eyeColor: ["Black"],
    year: 1987,
    img: "../../images/chars/shadow/cupcake.png"
  },
  {
    name: "Phantom Foxy",
    animal: "Fox",
    type: "Phantom",
    color: ["Green"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/phantom/p_foxy.png"
  },
  {
    name: "Phantom Mangle",
    animal: "Fox",
    type: "Phantom",
    color: ["Green"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/phantom/p_mangle.png"
  },
  {
    name: "Phantom Puppet",
    animal: "Humanoid",
    type: "Phantom",
    color: ["Green"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/phantom/p_puppet.png"
  },
  {
    name: "Phantom BB",
    animal: "Humanoid",
    type: "Phantom",
    color: ["Green"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/phantom/p_bb.png"
  },
  {
    name: "Dark Springtrap",
    animal: "Rabbit",
    type: "Springlock",
    color: ["Green"],
    eyeColor: ["Silver"],
    year: 2023,
    img: "../../images/chars/springlock/dark_springtrap.png"
  },

  // === Fredbear's Family Diner ===
  {
    name: "Springbonnie",
    animal: "Rabbit",
    type: "Springlock",
    color: ["Yellow"],
    eyeColor: ["Green"],
    year: 1983,
    img: "../../images/chars/springlock/springbonnie.png"
  },
  {
    name: "Fredbear",
    animal: "Bear",
    type: "Springlock",
    color: ["Yellow"],
    eyeColor: ["Blue"],
    year: 1983,
    img: "../../images/chars/springlock/fredbear.png"
  },
  {
    name: "Golden Cupcake",
    animal: "Cupcake",
    type: "Springlock",
    color: ["Yellow"],
    eyeColor: ["Yellow"],
    year: 1983,
    img: "../../images/chars/springlock/cupcake.png"
  },

  // === Fnaf 4 ===
  {
    name: "Nightmare Freddy",
    animal: "Bear",
    type: "Nightmare",
    color: ["Brown"],
    eyeColor: ["Yellow"],
    year: 1983,
    img: "../../images/chars/nightmare/nightmare_freddy.png"
  },
  {
    name: "Freddles",
    animal: "Bear",
    type: "Nightmare",
    color: ["Brown"],
    eyeColor: ["White"],
    year: 1983,
    img: "../../images/chars/nightmare/freddles.png"
  },
  {
    name: "Nightmare Bonnie",
    animal: "Rabbit",
    type: "Nightmare",
    color: ["Blue"],
    eyeColor: ["Magenta"],
    year: 1983,
    img: "../../images/chars/nightmare/nightmare_bonnie.png"
  },
  {
    name: "Nightmare Chica",
    animal: "Chicken",
    type: "Nightmare",
    color: ["Yellow"],
    eyeColor: ["Red"],
    year: 1983,
    img: "../../images/chars/nightmare/nightmare_chica.png"
  },
  {
    name: "Nightmare Cupcake",
    animal: "Cupcake",
    type: "Nightmare",
    color: ["Pink"],
    eyeColor: ["Yellow"],
    year: 1983,
    img: "../../images/chars/nightmare/cupcake.png"
  },
  {
    name: "Nightmare Foxy",
    animal: "Fox",
    type: "Nightmare",
    color: ["Red"],
    eyeColor: ["Yellow"],
    year: 1983,
    img: "../../images/chars/nightmare/nightmare_foxy.png"
  },
  {
    name: "Nightmare Fredbear",
    animal: "Bear",
    type: "Nightmare",
    color: ["Yellow"],
    eyeColor: ["Yellow"],
    year: 1983,
    img: "../../images/chars/nightmare/nightmare_fredbear.png"
  },
  {
    name: "Plushtrap",
    animal: "Rabbit",
    type: "Nightmare",
    color: ["Green"],
    eyeColor: ["Black"],
    year: 1983,
    img: "../../images/chars/nightmare/creonzadoruin.png"
  },
  {
    name: "Nightmare",
    animal: "Bear",
    type: "Nightmare",
    color: ["Black"],
    eyeColor: ["Red"],
    year: 1983,
    img: "../../images/chars/nightmare/nightmare.png"
  },

  // === Fnaf 4 Halloween Edition ===
  {
    name: "Jack-O-Bonnie",
    animal: "Rabbit",
    type: "Jack-O",
    color: ["Orange"],
    eyeColor: ["Orange"],
    year: 1983,
    img: "../../images/chars/nightmare/jack-o/bonnie.png"
  },
  {
    name: "Jack-O-Chica",
    animal: "Chicken",
    type: "Jack-O",
    color: ["Orange"],
    eyeColor: ["Orange"],
    year: 1983,
    img: "../../images/chars/nightmare/jack-o/chica.png"
  },
  {
    name: "Jack-O-Lantern",
    animal: "Cupcake",
    type: "Jack-O",
    color: ["Orange"],
    eyeColor: ["Yellow"],
    year: 1983,
    img: "../../images/chars/nightmare/jack-o/lantern.png"
  },
  {
    name: "Nightmare Mangle",
    animal: "Fox",
    type: "Nightmare",
    color: ["White", "Pink"],
    eyeColor: ["Yellow"],
    year: 1983,
    img: "../../images/chars/nightmare/nightmare_mangle.png"
  },
  {
    name: "Nightmare Balloon Boy",
    animal: "Humanoid",
    type: "Nightmare",
    color: ["Red", "Purple"],
    eyeColor: ["Red"],
    year: 1983,
    img: "../../images/chars/nightmare/nightmare_bb.png"
  },
  {
    name: "Nightmarionne",
    animal: "Humanoid",
    type: "Nightmare",
    color: ["Black"],
    eyeColor: ["White"],
    year: 1983,
    img: "../../images/chars/nightmare/nightmarionne.png"
  },
  {
    name: "Crying Child",
    animal: "Human",
    type: "Other",
    color: ["White"],
    eyeColor: ["Black"],
    year: "Unconfirmed",
    img: "../../images/chars/other/david_afton.png"
  },
  {
    name: "Michael Afton",
    animal: "Human",
    type: "Other",
    color: ["Purple"],
    eyeColor: ["Blue"],
    year: "Unconfirmed",
    img: "../../images/chars/other/michael_afton.png"
  },

  // === Fnaf World ===
  // === Fazbear Hills ===
  {
    name: "Mechrab",
    animal: "Crab",
    type: "Enemy",
    color: ["Pink"],
    eyeColor: ["Magenta"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/mechrab.png"
  },
  {
    name: "Bouncepot",
    animal: "Plant",
    type: "Enemy",
    color: ["Green"],
    eyeColor: ["White"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/bouncepot.png"
  },
  {
    name: "Gearrat",
    animal: "Mouse",
    type: "Enemy",
    color: ["Brown"],
    eyeColor: ["Blue"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/gearrat.png"
  },
  {
    name: "Auto Chipper",
    animal: "Beaver",
    type: "Enemy",
    color: ["Brown"],
    eyeColor: ["Orange"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/auto_chipper.png"
  },

  // === Choppy's Woods ===
  {
    name: "Chop 'N Roll",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Brown"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/chop_n_roll.png"
  },
  {
    name: "Totemole",
    animal: "Mouse",
    type: "Enemy",
    color: ["Brown"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/totemole.png"
  },
  {
    name: "Mad Endo",
    animal: "Skeleton",
    type: "Endo",
    color: ["Grey"],
    eyeColor: ["Red"],
    year: "Unconfirmed",
    img: "../../images/chars/endo/mad_endo.png"
  },

  // === Dusting Fields ===
  {
    name: "Boxbyte",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Grey"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/boxbyte.png"
  },
  {
    name: "Chillax",
    animal: "Crab",
    type: "Enemy",
    color: ["Blue", "Orange"],
    eyeColor: ["Green"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/chillax.webp"
  },
  {
    name: "Flan",
    animal: "Slime",
    type: "Enemy",
    color: ["Teal"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/flan.png"
  },
  {
    name: "Bouncer",
    animal: "Snowman",
    type: "Enemy",
    color: ["White"],
    eyeColor: ["Black", "White"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/bouncer.png"
  },
  {
    name: "Snowcone",
    animal: "Snowman",
    type: "Enemy",
    color: ["White"],
    eyeColor: ["Black", "White"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/bouncer.png"
  },

  // === Lilygear Lake ===
  {
    name: "Colossal",
    animal: "Squid",
    type: "Enemy",
    color: ["White"],
    eyeColor: ["Red"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/colossal.png"
  },
  {
    name: "Crabapple",
    animal: "Crab",
    type: "Enemy",
    color: ["Orange", "Red"],
    eyeColor: ["White"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/crabapple.png"
  },
  {
    name: "Seaweed",
    animal: "Slime",
    type: "Enemy",
    color: ["Green"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/seaweed.png"
  },
  {
    name: "Seagoon",
    animal: "Squid",
    type: "Enemy",
    color: ["Blue"],
    eyeColor: ["White"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/seagoon.png"
  },
  {
    name: "Supergoon",
    animal: "Squid",
    type: "Enemy",
    color: ["Blue"],
    eyeColor: ["White"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/seagoon.png"
  },
  {
    name: "Porkpatch",
    animal: "Pig",
    type: "Enemy",
    color: ["Brown", "Pink", "Green"],
    eyeColor: ["Blue"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/porkpatch.png"
  },

  // === Mysterious Mine ===
  {
    name: "Goldmine",
    animal: "Golem",
    type: "Enemy",
    color: ["Yellow"],
    eyeColor: ["Red"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/goldmine.png"
  },
  {
    name: "Metalman",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Grey"],
    eyeColor: ["Green"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/metalman.webp"
  },
  {
    name: "Quarry",
    animal: "Golem",
    type: "Enemy",
    color: ["Grey"],
    eyeColor: ["Grey"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/quarry.png"
  },
  {
    name: "Eyesore",
    animal: "Humanoid",
    type: "Enemy",
    color: ["White"],
    eyeColor: ["Orange"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/eyesore.png"
  },
  {
    name: "Chipper's Revenge",
    animal: "Beaver",
    type: "Enemy",
    color: ["Grey"],
    eyeColor: ["Red"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/chippers_revenge.png"
  },
  {
    name: "Mr. Chipper",
    animal: "Beaver",
    type: "Other",
    color: ["Brown"],
    eyeColor: ["Blue"],
    year: 2013,
    img: "../../images/chars/other/chipper.png"
  },

  // === Blacktomb Yard ===
  {
    name: "Beartrap",
    animal: "Bear",
    type: "Enemy",
    color: ["Grey", "Brown"],
    eyeColor: ["Blue"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/beartrap.png"
  },
  {
    name: "Graveweed",
    animal: "Plant",
    type: "Enemy",
    color: ["Black"],
    eyeColor: ["White"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/graveweed.png"
  },
  {
    name: "Prototype",
    animal: "Bear",
    type: "Endo",
    color: ["Grey", "Brown", "Magenta"],
    eyeColor: ["Red"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/prototype.png"
  },

  // === Deep-Metal Mine ===
  {
    name: "Blacktrap",
    animal: "Bear",
    type: "Enemy",
    color: ["Grey", "Black"],
    eyeColor: ["White"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/blacktrap.png"
  },
  {
    name: "Tombstack",
    animal: "Mouse",
    type: "Enemy",
    color: ["Black", "Brown"],
    eyeColor: ["Red"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/tombstack.png"
  },
  {
    name: "Overclock",
    animal: "Skeleton",
    type: "Endo",
    color: ["Grey"],
    eyeColor: ["Red"],
    year: "Unconfirmed",
    img: "../../images/chars/endo/overclock.png"
  },

  // === Pinwheel Circus ===
  {
    name: "Ballboy",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Red", "Blue"],
    eyeColor: ["Blue"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/ballboy.png"
  },
  {
    name: "Dogfight",
    animal: "Pilot",
    type: "Enemy",
    color: ["Purple"],
    eyeColor: ["Blue"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/dogfight.png"
  },
  {
    name: "Meringue",
    animal: "Cake",
    type: "Enemy",
    color: ["Brown", "Yellow"],
    eyeColor: ["Orange"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/meringue.png"
  },
  {
    name: "Browboy",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Purple", "Black"],
    eyeColor: ["Red"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/browboy.png"
  },
  {
    name: "Security Owl",
    animal: "Owl",
    type: "Enemy",
    color: ["Grey", "Purple"],
    eyeColor: ["Red", "Green"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/security.png"
  },

  // === Pinwheel Funhouse ===
  {
    name: "Redbear",
    animal: "Bear",
    type: "Enemy",
    color: ["Red"],
    eyeColor: ["White"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/redbear.png"
  },
  {
    name: "Tangle",
    animal: "Fox",
    type: "Enemy",
    color: ["White", "Green"],
    eyeColor: ["White"],
    year: "Unconfirmed",
    img: "../../images/chars/toy/tangle.png"
  },
  {
    name: "White Rabbit",
    animal: "Rabbit",
    type: "Enemy",
    color: ["White"],
    eyeColor: ["Black"],
    year: "Unconfirmed",
    img: "../../images/chars/shadow/white_rabbit.png"
  },
  {
    name: "Bubba",
    animal: "Bear",
    type: "Enemy",
    color: ["Brown"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/bubba.png"
  },
  {
    name: "Gold Endo",
    animal: "Skeleton",
    type: "Endo",
    color: ["Yellow"],
    eyeColor: ["White"],
    year: "Unconfirmed",
    img: "../../images/chars/endo/gold_endo.png"
  },

  // === &* TWRE (Glitch Area) ===
  {
    name: ">>>>>>",
    animal: "Glitched Enemy",
    type: "Enemy",
    color: ["Photo-Negative"],
    eyeColor: ["Photo-Negative"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/glitch3.webp"
  },
  {
    name: "%_^^&(",
    animal: "Glitched Enemy",
    type: "Enemy",
    color: ["Photo-Negative"],
    eyeColor: ["Photo-Negative"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/%_^^&(.webp"
  },
  {
    name: "_!2222",
    animal: "Glitched Enemy",
    type: "Enemy",
    color: ["Photo-Negative"],
    eyeColor: ["Photo-Negative"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/_!2222.webp"
  },

  // === Geist Lair ===
  {
    name: "Jangle",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Red"],
    eyeColor: ["Red"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/jangle.png"
  },
  {
    name: "Neon",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Yellow"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/neon.png"
  },
  {
    name: "P. Goon",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Purple"],
    eyeColor: ["Purple"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/p_goon.png"
  },
  {
    name: "PurpleGeist",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Purple"],
    eyeColor: ["White"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/purpleGeist.png"
  },
  {
    name: "Chica's Magic Rainbow",
    animal: "Rainbow",
    type: "Other",
    color: ["Rainbow"],
    eyeColor: ["Black"],
    year: "Unknown",
    img: "../../images/chars/other/rainbow.png"
  },

  // === Halloween Edition Exclusives ===
  {
    name: "Mad Jack",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Orange", "Purple"],
    eyeColor: ["Black"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/mad_jack.png"
  },
  {
    name: "Big Jack",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Red", "Blue"],
    eyeColor: ["Red"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/big_jack.png"
  },
  {
    name: "Cheesehead",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Yellow", "Red"],
    eyeColor: ["White"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/cheesehead.png"
  },
  {
    name: "Half-Bake",
    animal: "Cake",
    type: "Enemy",
    color: ["Yellow", "Pink"],
    eyeColor: ["Black"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/half-bake.png"
  },
  {
    name: "Mudpie",
    animal: "Cake",
    type: "Enemy",
    color: ["Brown"],
    eyeColor: ["Black"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/mudpie.png"
  },
  {
    name: "Xangle",
    animal: "Fox",
    type: "Enemy",
    color: ["Red"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/xangle.png"
  },
  {
    name: "Quad Endo",
    animal: "Skeleton",
    type: "Endo",
    color: ["Grey"],
    eyeColor: ["Blue"],
    year: "Unconfirmed",
    img: "../../images/chars/endo/quad_endo.png"
  },
  {
    name: "Party Hat A",
    animal: "Humanoid",
    type: "Enemy",
    color: ["White", "Pink"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/party_hat_a.png"
  },
  {
    name: "Party Hat B",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Red", "Orange"],
    eyeColor: ["Green"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/party_hat_b.webp"
  },
  {
    name: "Mini P",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Purple"],
    eyeColor: ["Orange"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/mini_p.png"
  },
  {
    name: "Security",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Grey", "Red"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/security_halloween.png"
  },

  // === NPCs / Other ===
  {
    name: "Virtua Freddy",
    animal: "Bear",
    type: "Other",
    color: ["Green"],
    eyeColor: ["Green"],
    year: "Unconfirmed",
    img: "../../images/chars/fnaf_world_enemies/virtua_freddy.png"
  },
  {
    name: "Mendo",
    animal: "Skeleton",
    type: "Endo",
    color: ["Blue"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/endo/mendo.png"
  },
  {
    name: "Dee Dee",
    animal: "Humanoid",
    type: "Other",
    color: ["Purple", "Yellow"],
    eyeColor: ["Green"],
    year: "Unconfirmed",
    img: "../../images/chars/other/dee_dee.png"
  },
  {
    name: "Old Man Consequences",
    animal: "Aligator",
    type: "Other",
    color: ["Red"],
    eyeColor: ["Red"],
    year: "Unconfirmed",
    img: "../../images/chars/other/omc.png"
  },
  {
    name: "8-Bit Fredbear",
    animal: "Bear",
    type: "Springlock",
    color: ["Yellow"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/springlock/8-bit_fredbear.png"
  },
  {
    name: "Souldozer",
    animal: "Humanoid",
    type: "Enemy",
    color: ["Grey", "Yellow"],
    eyeColor: ["Yellow"],
    year: 2011,
    img: "../../images/chars/fnaf_world_enemies/souldozer.png"
  },
  {
    name: "Desk Man",
    animal: "Human",
    type: "Other",
    color: ["Grey"],
    eyeColor: ["Grey"],
    year: "Unconfirmed",
    img: "../../images/chars/other/desk_man.png"
  },
  {
    name: "Endo Plush",
    animal: "Skeleton",
    type: "Endo",
    color: ["Grey"],
    eyeColor: ["Green"],
    year: "Unconfirmed",
    img: "../../images/chars/endo/plush.png"
  },
  {
    name: "Animdude",
    animal: "Human",
    type: "Other",
    color: ["Blue"],
    eyeColor: ["White"],
    year: 1978,
    img: "../../images/chars/other/Animdude.png"
  },
  {
    name: "Coffee",
    animal: "Coffee Machine",
    type: "Other",
    color: ["Brown"],
    eyeColor: ["Yellow"],
    year: 2012,
    img: "../../images/chars/other/coffee.png"
  },

  // === Trophies ===
  {
    name: "Security Trophy",
    animal: "Owl",
    type: "Trophy",
    color: ["Grey"],
    eyeColor: ["Grey"],
    year: 2016,
    img: "../../images/chars/trophy/security_trophy.png"
  },
  {
    name: "Scott Trophy",
    animal: "Human",
    type: "Trophy",
    color: ["Grey"],
    eyeColor: ["Grey"],
    year: 2016,
    img: "../../images/chars/trophy/scott_trophy.png"
  },
  {
    name: "Chipper's Revenge Trophy",
    animal: "Human",
    type: "Trophy",
    color: ["Grey"],
    eyeColor: ["Grey"],
    year: 2016,
    img: "../../images/chars/trophy/chipper_trophy.png"
  },
  {
    name: "Chica's Magic Rainbow Trophy",
    animal: "Rainbow",
    type: "Trophy",
    color: ["Grey"],
    eyeColor: ["Grey"],
    year: 2016,
    img: "../../images/chars/trophy/rainbow_trophy.png"
  },
  {
    name: "Fredbear Legs Trophy",
    animal: "Bear",
    type: "Trophy",
    color: ["Grey"],
    eyeColor: ["Grey"],
    year: 2016,
    img: "../../images/chars/trophy/fredbear_trophy.png"
  },
  {
    name: "Crying Child Trophy",
    animal: "Human",
    type: "Trophy",
    color: ["Grey"],
    eyeColor: ["Grey"],
    year: 2016,
    img: "../../images/chars/trophy/crying_child_trophy.png"
  },
  {
    name: "Shiny Pearl Trophy",
    animal: "Pearl",
    type: "Trophy",
    color: ["Grey"],
    eyeColor: ["Grey"],
    year: 2016,
    img: "../../images/chars/trophy/pearl_tropy.png"
  },
  {
    name: "The Fan Trophy",
    animal: "Fan",
    type: "Trophy",
    color: ["Grey"],
    eyeColor: ["Grey"],
    year: 2016,
    img: "../../images/chars/trophy/fan_trophy.png"
  },

  // === Sister Location ===
  {
    name: "Funtime Freddy",
    animal: "Bear",
    type: "Funtime",
    color: ["White", "Magenta"],
    eyeColor: ["Blue"],
    year: "Unconfirmed",
    img: "../../images/chars/funtime/funtime_freddy.png"
  },
  {
    name: "Funtime Foxy",
    animal: "Fox",
    type: "Funtime",
    color: ["White", "Pink"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/funtime/funtime_foxy.png"
  },
  {
    name: "Bon-Bon",
    animal: "Rabbit",
    type: "Funtime",
    color: ["Blue"],
    eyeColor: ["Magenta"],
    year: "Unconfirmed",
    img: "../../images/chars/funtime/bon-bon.png"
  },
  {
    name: "Bonnet",
    animal: "Rabbit",
    type: "Funtime",
    color: ["Pink"],
    eyeColor: ["Blue"],
    year: "Unconfirmed",
    img: "../../images/chars/funtime/bonnet.png"
  },
  {
    name: "Circus Baby",
    animal: "Humanoid",
    type: "Funtime",
    color: ["White", "Red"],
    eyeColor: ["Green"],
    year: "Unconfirmed",
    img: "../../images/chars/funtime/baby.png"
  },
  {
    name: "Bidybab",
    animal: "Humanoid",
    type: "Funtime",
    color: ["White", "Beige"],
    eyeColor: ["Magenta"],
    year: "Unconfirmed",
    img: "../../images/chars/funtime/bidybab.png"
  },
  {
    name: "Electrobab",
    animal: "Humanoid",
    type: "Funtime",
    color: ["White", "Beige"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/funtime/electrobab.png"
  },
  {
    name: "Ballora",
    animal: "Humanoid",
    type: "Funtime",
    color: ["White", "Purple"],
    eyeColor: ["Magenta"],
    year: "Unconfirmed",
    img: "../../images/chars/funtime/ballora.png"
  },
  {
    name: "Minireena",
    animal: "Humanoid",
    type: "Funtime",
    color: ["White", "Beige"],
    eyeColor: ["Black"],
    year: "Unconfirmed",
    img: "../../images/chars/funtime/minireena.png"
  },
  {
    name: "Lolbit",
    animal: "Fox",
    type: "Funtime",
    color: ["White", "Orange"],
    eyeColor: ["White"],
    year: "Unconfirmed",
    img: "../../images/chars/funtime/lolbit.png"
  },
  {
    name: "Yenndo",
    animal: "Skeleton",
    type: "Endo",
    color: ["Grey"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/endo/yenndo.png"
  },
  {
    name: "Ennard",
    animal: "Skeleton",
    type: "Endo",
    color: ["White", "Grey"],
    eyeColor: ["Blue"],
    year: "Unconfirmed",
    img: "../../images/chars/endo/ennard.png"
  },
  {
    name: "HandUnit",
    animal: "Keypad",
    type: "Other",
    color: ["Yellow"],
    eyeColor: ["Black"],
    year: "Unconfirmed",
    img: "../../images/chars/other/handunit.png"
  },
  {
    name: "Module Heads",
    animal: "Humanoid",
    type: "Other",
    color: ["White"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/other/module_heads.png"
  },

  // === Immortal and the Restless ===
  {
    name: "Clara",
    animal: "Human",
    type: "Other",
    color: ["White", "Green"],
    eyeColor: ["Black"],
    year: "Unconfirmed",
    img: "../../images/chars/other/clara.png"
  },
  {
    name: "Vlad",
    animal: "Humanoid",
    type: "Other",
    color: ["Blue"],
    eyeColor: ["Black"],
    year: "Unconfirmed",
    img: "../../images/chars/other/vlad.png"
  },
  {
    name: "Vlad's Son",
    animal: "Humanoid",
    type: "Other",
    color: ["Blue"],
    eyeColor: ["Black"],
    year: "Unconfirmed",
    img: "../../images/chars/other/VladsSon.png"
  },

  // === Sister Location Minigames ===
  {
    name: "Elizabeth Afton",
    animal: "Human",
    type: "Other",
    color: ["White", "Pink"],
    eyeColor: ["Green"],
    year: "Unconfirmed",
    img: "../../images/chars/other/elizabeth_afton.png"
  },

  // === Pizza Sim Fakeout ===
  {
    name: "Minigame Freddy",
    animal: "Bear",
    type: "Other",
    color: ["Brown"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/other/minigame_freddy.png"
  },
  {
    name: "Minigame Grey Freddy",
    animal: "Bear",
    type: "Other",
    color: ["Grey"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/other/minigame_grey_freddy.png"
  },

  // === Freddy Fazbear's Pizzeria Simulator Night Sections ===
  {
    name: "Scraptrap",
    animal: "Rabbit",
    type: "Springlock",
    color: ["Green"],
    eyeColor: ["Silver"],
    year: 2023,
    img: "../../images/chars/springlock/scraptrap.png"
  },
  {
    name: "Scrap Baby",
    animal: "Humanoid",
    type: "Funtime",
    color: ["Grey", "Orange"],
    eyeColor: ["Green"],
    year: 2023,
    img: "../../images/chars/funtime/scrap_baby.png"
  },
  {
    name: "Lefty",
    animal: "Bear",
    type: "Rockstar",
    color: ["Black"],
    eyeColor: ["Yellow"],
    year: 2023,
    img: "../../images/chars/rockstar/lefty.png"
  },
  {
    name: "Molten Freddy",
    animal: "Bear",
    type: "Endo",
    color: ["Grey", "Brown"],
    eyeColor: ["Yellow"],
    year: 2023,
    img: "../../images/chars/endo/molten_freddy.png"
  },
  {
    name: "Helpy",
    animal: "Bear",
    type: "Other",
    color: ["White", "Magenta"],
    eyeColor: ["Blue"],
    year: 2023,
    img: "../../images/chars/other/helpy.gif"
  },
  {
    name: "Henry Emily",
    animal: "Human",
    type: "Other",
    color: ["White", "Orange"],
    eyeColor: ["Green"],
    year: "1980s",
    img: "../../images/chars/other/henry.png"
  },
  {
    name: "Ad Crew",
    animal: "Humanoid",
    type: "Other",
    color: ["Colorful"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/other/ads.png"
  },

  // === FFPS Buyables ===
  // === Mediocre Melodies ===
  {
    name: "Mr. Hippo",
    animal: "Hippo",
    type: "Mediocre Melodies",
    color: ["Purple"],
    eyeColor: ["Blue"],
    year: 2023,
    img: "../../images/chars/mediocre_melodies/mr_hippo.png"
  },
  {
    name: "Orville Elephant",
    animal: "Elephant",
    type: "Mediocre Melodies",
    color: ["Orange"],
    eyeColor: ["Blue"],
    year: 2023,
    img: "../../images/chars/mediocre_melodies/orville_elephant.png"
  },
  {
    name: "Happy Frog",
    animal: "Frog",
    type: "Mediocre Melodies",
    color: ["Green"],
    eyeColor: ["Magenta"],
    year: 2023,
    img: "../../images/chars/mediocre_melodies/happy_frog.png"
  },
  {
    name: "Pigpatch",
    animal: "Pig",
    type: "Mediocre Melodies",
    color: ["Pink"],
    eyeColor: ["Blue", "Green"],
    year: 2023,
    img: "../../images/chars/mediocre_melodies/pigpatch.png"
  },
  {
    name: "Nedd Bear",
    animal: "Bear",
    type: "Mediocre Melodies",
    color: ["Brown"],
    eyeColor: ["Green"],
    year: 2023,
    img: "../../images/chars/mediocre_melodies/nedd_bear.png"
  },

  // === Rockstars ===
  {
    name: "Rockstar Freddy",
    animal: "Bear",
    type: "Rockstar",
    color: ["Brown"],
    eyeColor: ["Blue"],
    year: 2023,
    img: "../../images/chars/rockstar/rockstar_freddy.png"
  },
  {
    name: "Rockstar Bonnie",
    animal: "Rabbit",
    type: "Rockstar",
    color: ["Blue"],
    eyeColor: ["Green"],
    year: 2023,
    img: "../../images/chars/rockstar/rockstar_bonnie.png"
  },
  {
    name: "Rockstar Chica",
    animal: "Chicken",
    type: "Rockstar",
    color: ["Yellow"],
    eyeColor: ["Magenta"],
    year: 2023,
    img: "../../images/chars/rockstar/rockstar_chica.png"
  },
  {
    name: "Rockstar Foxy",
    animal: "Fox",
    type: "Rockstar",
    color: ["Red"],
    eyeColor: ["Yellow"],
    year: 2023,
    img: "../../images/chars/rockstar/rockstar_foxy.png"
  },

  // === Other Buyables ===
  {
    name: "Candy Cadet",
    animal: "Robot",
    type: "Other",
    color: ["Grey"],
    eyeColor: ["Colorful"],
    year: 2023,
    img: "../../images/chars/other/candy_cadet.png"
  },
  {
    name: "Egg Baby",
    animal: "Humanoid",
    type: "Other",
    color: ["Beige"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/other/egg_baby.png"
  },
  {
    name: "El Chip",
    animal: "Beaver",
    type: "Other",
    color: ["Brown"],
    eyeColor: ["Green"],
    year: 2023,
    img: "../../images/chars/other/el_chip.png"
  },
  {
    name: "Funtime Chica",
    animal: "Chicken",
    type: "Funtime",
    color: ["White", "Pink"],
    eyeColor: ["Magenta"],
    year: "Unnknown",
    img: "../../images/chars/funtime/funtime_chica.png"
  },
  {
    name: "Funtime Cupcake",
    animal: "Cupcake",
    type: "Funtime",
    color: ["Pink"],
    eyeColor: ["Blue"],
    year: "Unnknown",
    img: "../../images/chars/funtime/cupcake.png"
  },
  {
    name: "Lemonade Clown",
    animal: "Humanoid",
    type: "Other",
    color: ["White", "Orange"],
    eyeColor: ["Blue"],
    year: 2023,
    img: "../../images/chars/other/lemonade_clown.png"
  },
  {
    name: "Fruit Punch Clown",
    animal: "Humanoid",
    type: "Other",
    color: ["White", "Red"],
    eyeColor: ["Green"],
    year: 2023,
    img: "../../images/chars/other/fruit_punch_clown.png"
  },
  {
    name: "Music Man",
    animal: "Spider",
    type: "Other",
    color: ["White", "Magenta"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/other/music_man.png"
  },
  {
    name: "Neon Jukebox",
    animal: "Jukebox",
    type: "Other",
    color: ["Rainbow"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/other/neon_jukebox.png"
  },
  {
    name: "Disco Pizza Light",
    animal: "Pizza",
    type: "Other",
    color: ["Black"],
    eyeColor: ["Colorful"],
    year: 2023,
    img: "../../images/chars/other/disco_pizza_light.png"
  },
  {
    name: "Prize King",
    animal: "Humanoid",
    type: "Other",
    color: ["Yellow"],
    eyeColor: ["Green"],
    year: 2023,
    img: "../../images/chars/other/prize_king.png"
  },
  {
    name: "Security Puppet",
    animal: "Humanoid",
    type: "Other",
    color: ["White"],
    eyeColor: ["Yellow"],
    year: 2023,
    img: "../../images/chars/other/security_puppet.png"
  },
  {
    name: "Pickles",
    animal: "Pickles",
    type: "Other",
    color: ["Green"],
    eyeColor: ["Green"],
    year: 2023,
    img: "../../images/chars/other/pickles.png"
  },
  {
    name: "Tutorial Unit",
    animal: "Human",
    type: "Other",
    color: ["White"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/other/tutorial_unit.png"
  },
  {
    name: "Winking Sign",
    animal: "Sign",
    type: "Other",
    color: ["Brown"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/other/winking_sign.png"
  },
  {
    name: "Gumball Swivelhands",
    animal: "Humanoid",
    type: "Other",
    color: ["Red", "Colorful"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/other/gumball_swivelhands.png"
  },
  {
    name: "Ballpit Tower",
    animal: "Tower",
    type: "Other",
    color: ["Yellow", "Colorful"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/other/ballpit_tower.png"
  },

  // === Trash & the Gang ===
  {
    name: "Pan Stan",
    animal: "Pan",
    type: "Trash",
    color: ["Grey"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/trash/pan_stan.png"
  },
  {
    name: "Bucket Bob",
    animal: "Trash",
    type: "Trash",
    color: ["Grey"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/trash/bucket_bob.png"
  },
  {
    name: "No. 1 Crate",
    animal: "Trash",
    type: "Trash",
    color: ["Blue"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/trash/no_1_crate.png"
  },
  {
    name: "Mr. Can-Do",
    animal: "Trash",
    type: "Trash",
    color: ["Red"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/trash/mr_can-do.png"
  },
  {
    name: "Mr. Hugs",
    animal: "Trash",
    type: "Trash",
    color: ["Grey"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/trash/mr_hugs.png"
  },

  // === Ultimate Custom Night Plushies ===
  {
    name: "Plush Freddy",
    animal: "Bear",
    type: "Plush",
    color: ["Brown"],
    eyeColor: ["Blue"],
    year: 2023,
    img: "../../images/chars/plush/freddy.png"
  },
  {
    name: "Plush Bonnie",
    animal: "Rabbit",
    type: "Plush",
    color: ["Blue"],
    eyeColor: ["Red"],
    year: 2023,
    img: "../../images/chars/plush/bonnie.png"
  },
  {
    name: "Plush Chica",
    animal: "Chicken",
    type: "Plush",
    color: ["Yellow"],
    eyeColor: ["Magenta"],
    year: 2023,
    img: "../../images/chars/plush/chica.png"
  },
  {
    name: "Plush Foxy",
    animal: "Fox",
    type: "Plush",
    color: ["Red"],
    eyeColor: ["Yellow"],
    year: 2023,
    img: "../../images/chars/plush/foxy.png"
  },
  {
    name: "Plush Balloon Boy",
    animal: "Humanoid",
    type: "Plush",
    color: ["Red", "Blue"],
    eyeColor: ["Blue"],
    year: 2023,
    img: "../../images/chars/plush/bb.png"
  },
  {
    name: "Plush Golden Freddy",
    animal: "Bear",
    type: "Plush",
    color: ["Yellow"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/plush/golden_freddy.png"
  },
  {
    name: "Plush Mangle",
    animal: "Fox",
    type: "Plush",
    color: ["White", "Pink"],
    eyeColor: ["Yellow"],
    year: 2023,
    img: "../../images/chars/plush/mangle.png"
  },
  {
    name: "Plush Fredbear",
    animal: "Bear",
    type: "Plush",
    color: ["Yellow"],
    eyeColor: ["White"],
    year: 2023,
    img: "../../images/chars/plush/fredbear.png"
  },
  {
    name: "Plush Circus Baby",
    animal: "Humanoid",
    type: "Plush",
    color: ["White", "Red"],
    eyeColor: ["Green"],
    year: 2023,
    img: "../../images/chars/plush/baby.png"
  },

  // === Ultimate Custom Night Extras ===
  {
    name: "Loading Freddy",
    animal: "Bear",
    type: "Withered",
    color: ["Grey"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/withered/loading_freddy.png"
  },
  {
    name: "XOR",
    animal: "Humanoid",
    type: "Other",
    color: ["Grey"],
    eyeColor: ["Black"],
    year: 2023,
    img: "../../images/chars/other/xor.png"
  },

  // === Ultimate Custom Night Trophies ===
  {
    name: "The Bronze One",
    animal: "Bear",
    type: "Trophy",
    color: ["Brown"],
    eyeColor: ["Brown"],
    year: 2023,
    img: "../../images/chars/trophy/bronze.png"
  },
  {
    name: "Books Freddy",
    animal: "Bear",
    type: "Trophy",
    color: ["Grey"],
    eyeColor: ["Grey"],
    year: 2023,
    img: "../../images/chars/trophy/books_freddy.png"
  },
  {
    name: "Games Freddy",
    animal: "Bear",
    type: "Trophy",
    color: ["Yellow"],
    eyeColor: ["Yellow"],
    year: 2023,
    img: "../../images/chars/trophy/games_freddy.png"
  },

  // === Help Wanted ===
  // === Blacklight Levels ===
  {
    name: "Dark Freddy",
    animal: "Bear",
    type: "Classic",
    color: ["Black"],
    eyeColor: ["White"],
    year: "Unconfirmed",
    img: "../../images/chars/classic/dark_freddy.png"
  },
  {
    name: "Party Freddy",
    animal: "Bear",
    type: "Classic",
    color: ["Black"],
    eyeColor: ["Red"],
    year: "Unconfirmed",
    img: "../../images/chars/classic/party_freddy.png"
  },
  {
    name: "Neon Bonnie",
    animal: "Rabbit",
    type: "Classic",
    color: ["Black"],
    eyeColor: ["Blue", "White"],
    year: "Unconfirmed",
    img: "../../images/chars/classic/neon_bonnie.png"
  },
  {
    name: "Neon Chica",
    animal: "Chicken",
    type: "Classic",
    color: ["Black"],
    eyeColor: ["Yellow", "White"],
    year: "Unconfirmed",
    img: "../../images/chars/classic/neon_chica.png"
  },
  {
    name: "Burnt Foxy",
    animal: "Fox",
    type: "Classic",
    color: ["Grey"],
    eyeColor: ["Orange"],
    year: "Unconfirmed",
    img: "../../images/chars/classic/burnt_foxy.png"
  },
  {
    name: "Dark Foxy",
    animal: "Fox",
    type: "Classic",
    color: ["Black"],
    eyeColor: ["White"],
    year: "Unconfirmed",
    img: "../../images/chars/classic/dark_foxy.png"
  },
  {
    name: "Shadow Mangle",
    animal: "Fox",
    type: "Classic",
    color: ["Black"],
    eyeColor: ["Purple"],
    year: "Unconfirmed",
    img: "../../images/chars/shadow/shadow_mangle.png"
  },

  // === Variants ===
  {
    name: "Captain Foxy",
    animal: "Fox",
    type: "Classic",
    color: ["Red", "Blue"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/classic/captain_foxy.png"
  },
  {
    name: "Plushbaby",
    animal: "Humanoid",
    type: "Plush",
    color: ["White", "Red"],
    eyeColor: ["Green"],
    year: "Unconfirmed",
    img: "../../images/chars/plush/plushbaby.png"
  },
  {
    name: "Scrap Plushbaby",
    animal: "Humanoid",
    type: "Plush",
    color: ["Grey", "Orange"],
    eyeColor: ["Green"],
    year: "Unconfirmed",
    img: "../../images/chars/plush/scrap_plushbaby.png"
  },

  // === Endos ===
  {
    name: "Ghetto Endo",
    animal: "Skeleton",
    type: "Endo",
    color: ["Grey"],
    eyeColor: ["Red"],
    year: "Unconfirmed",
    img: "../../images/chars/endo/ghetto_endo.png"
  },
  {
    name: "Nightmare Endo",
    animal: "Skeleton",
    type: "Endo",
    color: ["Grey"],
    eyeColor: ["Red"],
    year: "Unconfirmed",
    img: "../../images/chars/endo/nightmare_endo.png"
  },

  // === Others ===
  {
    name: "Tape Girl",
    animal: "Human",
    type: "Other",
    color: ["White"],
    eyeColor: ["Green"],
    year: "Unconfirmed",
    img: "../../images/chars/other/tape_girl.png"
  },
  {
    name: "Glitchtrap",
    animal: "Rabbit",
    type: "Other",
    color: ["Yellow", "Purple"],
    eyeColor: ["Purple"],
    year: "Unconfirmed",
    img: "../../images/chars/springlock/Glitchtrap.png"
  },

  // === Curse of Dreadbear ===
  {
    name: "Dreadbear",
    animal: "Bear",
    type: "Nightmare",
    color: ["Green"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/nightmare/dreadbear.png"
  },
  {
    name: "Grimm Foxy",
    animal: "Fox",
    type: "Nightmare",
    color: ["Orange"],
    eyeColor: ["Yellow"],
    year: "Unconfirmed",
    img: "../../images/chars/nightmare/grimm_foxy.png"
  },
  {
    name: "Ghost Helpy",
    animal: "Bear",
    type: "Other",
    color: ["White"],
    eyeColor: ["Purple"],
    year: "Unconfirmed",
    img: "../../images/chars/other/ghost_helpy.png"
  },

  // === Security Breach ===
  {
    name: "Glamrock Freddy",
    animal: "Bear",
    type: "Glamrock",
    color: ["Orange"],
    eyeColor: ["Blue"],
    year: 2035,
    img: "../../images/chars/glamrock/freddy.png"
  },
  {
    name: "Shattered Glamrock Freddy",
    animal: "Bear",
    type: "Glamrock",
    color: ["Orange"],
    eyeColor: ["Yellow"],
    year: 2035,
    img: "../../images/chars/glamrock/shatter/freddy.png"
  },
  {
    name: "Glamrock Chica",
    animal: "Chicken",
    type: "Glamrock",
    color: ["White"],
    eyeColor: ["Purple"],
    year: 2035,
    img: "../../images/chars/glamrock/chica.png"
  },
  {
    name: "Shattered Glamrock Chica",
    animal: "Chicken",
    type: "Glamrock",
    color: ["White"],
    eyeColor: ["Purple"],
    year: 2035,
    img: "../../images/chars/glamrock/shatter/chica.png"
  },
  {
    name: "Montegomery Gator",
    animal: "Alligator",
    type: "Glamrock",
    color: ["Green"],
    eyeColor: ["Orange"],
    year: 2035,
    img: "../../images/chars/glamrock/monty.png"
  },
  {
    name: "Shattered Montegomery Gator",
    animal: "Alligator",
    type: "Glamrock",
    color: ["Green"],
    eyeColor: ["Orange"],
    year: 2035,
    img: "../../images/chars/glamrock/shatter/monty.png"
  },
  {
    name: "Roxane Wolf",
    animal: "Wolf",
    type: "Glamrock",
    color: ["Grey", "Red"],
    eyeColor: ["Yellow"],
    year: 2035,
    img: "../../images/chars/glamrock/roxy.png"
  },
  {
    name: "Shattered Roxane Wolf",
    animal: "Wolf",
    type: "Glamrock",
    color: ["Grey", "Red"],
    eyeColor: ["Yellow"],
    year: 2035,
    img: "../../images/chars/glamrock/shatter/roxy.png"
  },
  {
    name: "Glamrock Mr. Hippo",
    animal: "Hippo",
    type: "Glamrock",
    color: ["Grey", "Newspaper"],
    eyeColor: ["Grey", "Newspaper"],
    year: 2035,
    img: "../../images/chars/glamrock/hippo.png"
  },
  {
    name: "Glamrock Endo",
    animal: "Skeleton",
    type: "Endo",
    color: ["Grey"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/endo/glamrock.png"
  },
  {
    name: "Wind Up Music Man",
    animal: "Spider",
    type: "Other",
    color: ["White", "Pink"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/other/lil_music.png"
  },
  {
    name: "DJ Music Man",
    animal: "Spider",
    type: "Other",
    color: ["White", "Pink"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/other/dj_music_man.png"
  },
  {
    name: "Sun",
    animal: "Humanoid",
    type: "Other",
    color: ["Yellow"],
    eyeColor: ["White"],
    year: 2035,
    img: "../../images/chars/other/sun.png"
  },

  // === STAFF Bots ===
  {
    name: "Instructor Bot",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["White", "Grey"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/staff_bot/instructor.png"
  },
  {
    name: "Comedy Bot",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["White", "Grey"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/staff_bot/comedy.png"
  },
  {
    name: "Magician Bot",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["White", "Black"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/staff_bot/magician.png"
  },
  {
    name: "Map Bot",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["White", "Yellow"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/staff_bot/map.png"
  },
  {
    name: "Mop Bot",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["White"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/staff_bot/mop.png"
  },
  {
    name: "Nightmare S.T.A.F.F. Bot",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["White", "Black"],
    eyeColor: ["White"],
    year: 2035,
    img: "../../images/chars/staff_bot/nightmare.png"
  },
  {
    name: "Party Bot",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["White", "Purple"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/staff_bot/party.png"
  },
  {
    name: "Sewer Bot",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["White", "Green"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/staff_bot/sewer.png"
  },
  {
    name: "Chef Bot",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["White", "Pink"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/staff_bot/pizza.png"
  },
  {
    name: "Security Bot",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["White", "Black"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/staff_bot/security.png"
  },
  {
    name: "Attendant Bot",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["White", "Red"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/staff_bot/attendant.png"
  },
  {
    name: "Alien Bot",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["White", "Green"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/staff_bot/alien.png"
  },
  {
    name: "S.T.A.F.F. Bot",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["White"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/staff_bot/staff.png"
  },
  {
    name: "Wet Floor Bot",
    animal: "Sign",
    type: "Other",
    color: ["Yellow", "Black"],
    eyeColor: ["Yellow"],
    year: 2035,
    img: "../../images/chars/other/wet.png"
  },

  // === Princess Quest ===
  {
    name: "Princess",
    animal: "Human",
    type: "Princess Quest",
    color: ["Yellow"],
    eyeColor: ["Yellow"],
    year: 2035,
    img: "../../images/chars/princess_quest/princess.png"
  },
  {
    name: "Rabbit Head",
    animal: "Rabbit",
    type: "Princess Quest",
    color: ["Black", "Green"],
    eyeColor: ["Green"],
    year: 2035,
    img: "../../images/chars/princess_quest/rabbit_head.png"
  },
  {
    name: "Glitchtrap Chaser",
    animal: "Rabbit",
    type: "Princess Quest",
    color: ["Black", "Green"],
    eyeColor: ["Green"],
    year: 2035,
    img: "../../images/chars/princess_quest/glitchtrap_chaser.png"
  },
  {
    name: "Bunny Sentry",
    animal: "Rabbit",
    type: "Princess Quest",
    color: ["Black", "White"],
    eyeColor: ["White"],
    year: 2035,
    img: "../../images/chars/princess_quest/bunny_sentry.png"
  },
  {
    name: "Amalgam Glitchtrap",
    animal: "Rabbit",
    type: "Princess Quest",
    color: ["Purple", "Black"],
    eyeColor: ["Purple"],
    year: 2035,
    img: "../../images/chars/princess_quest/amalgamtrap.png"
  },
  {
    name: "Princess Quest Grimm Foxy",
    animal: "Fox",
    type: "Princess Quest",
    color: ["Red", "Orange"],
    eyeColor: ["Orange"],
    year: 2035,
    img: "../../images/chars/princess_quest/grimm_foxy.png"
  },

  // === The Rest ===
  {
    name: "Burntrap", //the goat
    animal: "Rabbit",
    type: "Springlock",
    color: ["Green"],
    eyeColor: ["Purple"],
    year: 2035,
    img: "../../images/chars/springlock/burntrap.png"
  },
  {
    name: "Gregory",
    animal: "Human",
    type: "Other",
    color: ["White", "Blue"],
    eyeColor: ["Brown"],
    year: 2035,
    img: "../../images/chars/other/ggy.png"
  },
  {
    name: "Vanessa",
    animal: "Human",
    type: "Other",
    color: ["White", "Yellow"],
    eyeColor: ["Green"],
    year: 2012,
    img: "../../images/chars/other/vanessa.png"
  },
  {
    name: "Vanny",
    animal: "Rabbit",
    type: "Other",
    color: ["White"],
    eyeColor: ["Red"],
    year: 2035,
    img: "../../images/chars/other/vanny.png"
  },
  {
    name: "Tangle Blob",
    animal: "Blob",
    type: "Endo",
    color: ["Black", "White"],
    eyeColor: ["Red"],
    year: 2035,
    img: "../../images/chars/endo/blob.png"
  },

  // === RUIN ===
  {
    name: "Ruined Freddy",
    animal: "Bear",
    type: "Ruined",
    color: ["Orange"],
    eyeColor: ["Blue"],
    year: 2035,
    img: "../../images/chars/ruined/freddy.png"
  },
  {
    name: "Glamrock Bonnie",
    animal: "Rabbit",
    type: "Ruined",
    color: ["Blue"],
    eyeColor: ["White"],
    year: 2035,
    img: "../../images/chars/ruined/glamrock_bonnie.png"
  },
  {
    name: "Ruined Chica",
    animal: "Chicken",
    type: "Ruined",
    color: ["White", "Pink"],
    eyeColor: ["Purple"],
    year: 2035,
    img: "../../images/chars/ruined/chica.png"
  },
  {
    name: "Ruined Monty",
    animal: "Alligator",
    type: "Ruined",
    color: ["Grey"],
    eyeColor: ["Red"],
    year: 2035,
    img: "../../images/chars/ruined/monty.png"
  },
  {
    name: "Ruined Roxy",
    animal: "Wolf",
    type: "Ruined",
    color: ["Grey", "Red"],
    eyeColor: ["Grey"],
    year: 2035,
    img: "../../images/chars/ruined/roxy.png"
  },
  {
    name: "Ruined Sun",
    animal: "Humanoid",
    type: "Ruined",
    color: ["Yellow", "Orange"],
    eyeColor: ["White"],
    year: 2035,
    img: "../../images/chars/ruined/ruined_sun.png"
  },
  {
    name: "Ruined Moon",
    animal: "Humanoid",
    type: "Ruined",
    color: ["Blue", "White"],
    eyeColor: ["Red"],
    year: 2035,
    img: "../../images/chars/ruined/ruined_moon.png"
  },
  {
    name: "Eclipse",
    animal: "Humanoid",
    type: "Ruined",
    color: ["Yellow"],
    eyeColor: ["Orange", "Red"],
    year: 2035,
    img: "../../images/chars/ruined/eclipse.png"
  },
  {
    name: "Ruined Wind Up Music Man",
    animal: "Spider",
    type: "Ruined",
    color: ["White", "Pink"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/ruined/ruin_lil_music.png"
  },
  {
    name: "Damaged Plush Baby",
    animal: "Humanoid",
    type: "Plush",
    color: ["White", "Red"],
    eyeColor: ["Green"],
    year: 2035,
    img: "../../images/chars/plush/damaged_plushbabies.png"
  },
  {
    name: "Helpi",
    animal: "Bear",
    type: "Other",
    color: ["White"],
    eyeColor: ["Blue"],
    year: 2035,
    img: "../../images/chars/other/Helpi.png"
  },
  {
    name: "Elephant Mascot Suit",
    animal: "Elephant",
    type: "Other",
    color: ["Grey"],
    eyeColor: ["White"],
    year: 2035,
    img: "../../images/chars/other/elephant_mascot_suit.png"
  },
  {
    name: "Penguin Mascot Suit",
    animal: "Penguin",
    type: "Other",
    color: ["Blue"],
    eyeColor: ["White"],
    year: 2035,
    img: "../../images/chars/other/penguin_mascot_suit.png"
  },
  {
    name: "Ruin Mechanical X-Form Experimental Storage",
    animal: "Rabbit",
    type: "Ruined",
    color: ["Blue"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/ruined/mxes.png"
  },
  {
    name: "Ruined M2",
    animal: "Skeleton",
    type: "Endo",
    color: ["Grey"],
    eyeColor: ["Orange"],
    year: 2035,
    img: "../../images/chars/endo/m2_ruin.png"
  },
  {
    name: "Costumed M2",
    animal: "Lion",
    type: "Endo",
    color: ["Brown", "Blue"],
    eyeColor: ["Blue"],
    year: 2035,
    img: "../../images/chars/endo/costumed_mimic.png"
  },
  {
    name: "Cassie",
    animal: "Human",
    type: "Other",
    color: ["Brown", "Red"],
    eyeColor: ["Brown"],
    year: 2035,
    img: "../../images/chars/other/cassie.png"
  },
  {
    name: "Mask Bot",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["White"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/staff_bot/mask_bot.png"
  },
  {
    name: "Giant Glamrock Endo",
    animal: "Skeleton",
    type: "Endo",
    color: ["Grey", "Purple"],
    eyeColor: ["Purple"],
    year: 2035,
    img: "../../images/chars/endo/giant_glamrock_endo.png"
  },

  // === HELP WANTED 2 ===
  {
    name: "Ruined DJ Music Man",
    animal: "Spider",
    type: "Ruined",
    color: ["White", "Pink"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/ruined/ruined_dj_music_man.png"
  },
  {
    name: "Carnie",
    animal: "Bear",
    type: "Rockstar",
    color: ["Brown", "Green"],
    eyeColor: ["Yellow"],
    year: 2035,
    img: "../../images/chars/rockstar/carnie.png"
  },
  {
    name: "Burned Carnie",
    animal: "Bear",
    type: "Rockstar",
    color: ["Brown", "Green"],
    eyeColor: ["Yellow"],
    year: 2035,
    img: "../../images/chars/rockstar/carnie.png"
  },
  {
    name: "Mystic Hippo",
    animal: "Hippo",
    type: "Mediocre Melodies",
    color: ["Purple"],
    eyeColor: ["Blue"],
    year: 2035,
    img: "../../images/chars/sotm/mystic_hippo.png"
  },
  {
    name: "Jack-O-Moon",
    animal: "Humanoid",
    type: "Other",
    color: ["Orange", "Black"],
    eyeColor: ["Orange"],
    year: 2035,
    img: "../../images/chars/other/jack_o_moon.png"
  },
  {
    name: "Head Chef Bot",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["White", "Yellow", "Red"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/staff_bot/head_chef_bot.png"
  },
  {
    name: "VR Endo",
    animal: "Skeleton",
    type: "Endo",
    color: ["Grey"],
    eyeColor: ["Black"],
    year: 2035,
    img: "../../images/chars/endo/vr_endo.png"
  },

  // === Secret of the Mimic ===

  // Welcome Show
  {
    name: "Arnold",
    animal: "Human",
    type: "Other",
    color: ["Beige"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/other/arnold.png"
  },
  {
    name: "Dispatch",
    animal: "Human",
    type: "Other",
    color: ["Beige"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/other/dispatch.png"
  },
  {
    name: "Mr. Helpful",
    animal: "Bear",
    type: "Other",
    color: ["White", "Purple"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/sotm/mr_helpful.png"
  },
  {
    name: "Mrs. Helpful",
    animal: "Bear",
    type: "Other",
    color: ["White", "Purple"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/sotm/mrs_helpful.png"
  },

  // First encounter
  {
    name: "Elephant",
    animal: "Elephant",
    type: "Mascot Suit",
    color: ["Grey"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/sotm/mascot/elephant.png"
  },

  // Jackie in the Box
  {
    name: "Clean-O-Vac",
    animal: "Vacuum",
    type: "S.T.A.F.F. Bot",
    color: ["Grey"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/sotm/clean_o_vac.png"
  },
  {
    name: "Jackie",
    animal: "Humanoid",
    type: "Other",
    color: ["White", "Red"],
    eyeColor: ["Green"],
    year: 1979,
    img: "../../images/chars/sotm/jackie.png"
  },
  {
    name: "Digi-Typer",
    animal: "Humanoid",
    type: "S.T.A.F.F. Bot",
    color: ["Grey"],
    eyeColor: ["White"],
    year: 1979,
    img: "../../images/chars/sotm/digi-typer.png"
  },

  // Roaming Mascots
  {
    name: "Hedgehog Hudgie",
    animal: "Hedgehog",
    type: "Mascot Suit",
    color: ["Blue"],
    eyeColor: ["Brown"],
    year: 1979,
    img: "../../images/chars/sotm/mascot/hudgie.png"
  },
  {
    name: "Lyrical Lemur",
    animal: "Lemur",
    type: "Mascot Suit",
    color: ["Green"],
    eyeColor: ["Yellow"],
    year: 1979,
    img: "../../images/chars/sotm/mascot/lemur.png"
  },
  {
    name: "Swing Bee",
    animal: "Bee",
    type: "Mascot Suit",
    color: ["Yellow", "Brown"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/sotm/mascot/swing_bee.png"
  },
  {
    name: "Penguin",
    animal: "Penguin",
    type: "Mascot Suit",
    color: ["Blue"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/sotm/mascot/linux.png"
  },
  {
    name: "Lion",
    animal: "Lion",
    type: "Mascot Suit",
    color: ["Brown"],
    eyeColor: ["Grey"],
    year: 1979,
    img: "../../images/chars/sotm/mascot/lion.png"
  },
  {
    name: "Sharpay",
    animal: "Dog",
    type: "Mascot Suit",
    color: ["White", "Pink"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/sotm/mascot/sharpay.png"
  },

  // Big Top Showroom
  {
    name: "Big Top",
    animal: "Spider",
    type: "Other",
    color: ["Red", "White"],
    eyeColor: ["White"],
    year: 1979,
    img: "../../images/chars/sotm/big_top.png"
  },
  {
    name: "Mycellium Man",
    animal: "Mushroom",
    type: "Mascot Suit",
    color: ["Beige", "Blue"],
    eyeColor: ["Yellow"],
    year: 1979,
    img: "../../images/chars/sotm/mascot/mycellium_man.png"
  },

  // Pirate Show
  {
    name: "Captain Springlocks",
    animal: "Sea Dog",
    type: "Springlock",
    color: ["Brown", "Blue"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/springlock/captain_springlock.png"
  },
  {
    name: "Puppet Foxy",
    animal: "Fox",
    type: "Puppet Crew",
    color: ["Red"],
    eyeColor: ["Yellow"],
    year: 1979,
    img: "../../images/chars/sotm/puppet_crew/puppet_foxy.png"
  },
  {
    name: "Puppet Roxy",
    animal: "Wolf",
    type: "Puppet Crew",
    color: ["Grey"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/sotm/puppet_crew/puppet_roxy.png"
  },
  {
    name: "Kit",
    animal: "Fox",
    type: "Puppet Crew",
    color: ["Orange"],
    eyeColor: ["Green"],
    year: 1979,
    img: "../../images/chars/sotm/puppet_crew/kit.png"
  },
  {
    name: "Bawson",
    animal: "Badger",
    type: "Puppet Crew",
    color: ["Grey"],
    eyeColor: ["Blue"],
    year: 1979,
    img: "../../images/chars/sotm/puppet_crew/bawson.png"
  },
  {
    name: "Renard",
    animal: "Fox",
    type: "Puppet Crew",
    color: ["Orange"],
    eyeColor: ["White"],
    year: 1979,
    img: "../../images/chars/sotm/puppet_crew/renard.png"
  },
  {
    name: "Mr. Rocktapus",
    animal: "Octopus",
    type: "Puppet Crew",
    color: ["Yellow"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/sotm/puppet_crew/rocktapus.png"
  },

  // Doll Hospital / Recycling Center
  {
    name: "Dollie",
    animal: "Humanoid",
    type: "Other",
    color: ["Black", "White", "Green"],
    eyeColor: ["Green"],
    year: 1979,
    img: "../../images/chars/sotm/dollie.png"
  },
  {
    name: "Molten Dollie",
    animal: "Humanoid",
    type: "Other",
    color: ["Orange", "Green", "White", "Black"],
    eyeColor: ["Green"],
    year: 1979,
    img: "../../images/chars/sotm/molten_dollie.png"
  },


  // Warehouse / Admin Wing / Basement
  {
    name: "Party Time Chica",
    animal: "Chicken",
    type: "Mascot Suit",
    color: ["Yellow", "Pink"],
    eyeColor: ["Pink"],
    year: 1979,
    img: "../../images/chars/sotm/mascot/party_time_chica.png"
  },
  {
    name: "Party Time Cupcake",
    animal: "Cupcake",
    type: "Cupcake",
    color: ["Yellow", "Pink"],
    eyeColor: ["Pink"],
    year: 1979,
    img: "../../images/chars/sotm/mascot/party_time_cupcake.png"
  },
  {
    name: "Sleepy Moon",
    animal: "Humanoid",
    type: "Mascot Suit",
    color: ["White"],
    eyeColor: ["Purple"],
    year: 1979,
    img: "../../images/chars/sotm/mascot/sleepy_moon.png"
  },
  {
    name: "White Tiger",
    animal: "Tiger",
    type: "Mascot Suit",
    color: ["White", "Black"],
    eyeColor: ["Blue", "Green"],
    year: 1979,
    img: "../../images/chars/sotm/mascot/tiger_rock.png"
  },

  // R&D
  {
    name: "M2R&D",
    animal: "Humanoid",
    type: "Endo",
    color: ["White", "Grey", "Yellow"],
    eyeColor: ["Yellow"],
    year: 1979,
    img: "../../images/chars/endo/m2rnd.png"
  },
  {
    name: "Prototype Fredbear",
    animal: "Bear",
    type: "Springlock",
    color: ["Black"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/springlock/proto_fredbear.png"
  },
  {
    name: "Prototype Springbonnie",
    animal: "Rabbit",
    type: "Springlock",
    color: ["Black"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/springlock/proto_springbonnie.png"
  },
  {
    name: "Prototype Bub",
    animal: "Dog",
    type: "Springlock",
    color: ["Brown"],
    eyeColor: ["Red"],
    year: 1979,
    img: "../../images/chars/springlock/proto_bub.png"
  },
  {
    name: "Prototype Monty",
    animal: "Alligator",
    type: "Springlock",
    color: ["Green"],
    eyeColor: ["Brown"],
    year: 1979,
    img: "../../images/chars/springlock/proto_monty.png"
  },
  {
    name: "Prototype Bonnie",
    animal: "Rabbit",
    type: "Prototype",
    color: ["Beige"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/sotm/prototype/proto_bonnie.png"
  },
  {
    name: "Prototype Chica",
    animal: "Chicken",
    type: "Prototype",
    color: ["Yellow"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/sotm/prototype/proto_chica.png"
  },
  {
    name: "Prototype Cupcake",
    animal: "Cupcake",
    type: "Prototype",
    color: ["Grey"],
    eyeColor: ["Yellow"],
    year: 1979,
    img: "../../images/chars/sotm/prototype/proto_cupcake.png"
  },
  {
    name: "Prototype Foxy",
    animal: "Fox",
    type: "Prototype",
    color: ["Grey", "Red"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/sotm/prototype/proto_foxy.png"
  },
  {
    name: "Prototype Freddy",
    animal: "Bear",
    type: "Prototype",
    color: ["Beige"],
    eyeColor: ["Black"],
    year: 1979,
    img: "../../images/chars/sotm/prototype/proto_freddy.png"
  },
  {
    name: "F10-N4",
    animal: "Human",
    type: "Other",
    color: ["Grey"],
    eyeColor: ["Green"],
    year: 1979,
    img: "../../images/chars/other/f10-n4.png"
  },
  {
    name: "M1",
    animal: "Skeleton",
    type: "Endo",
    color: ["Grey"],
    eyeColor: ["Yellow"],
    year: 1979,
    img: "../../images/chars/endo/m1.png"
  },
  {
    name: "M2",
    animal: "Skeleton",
    type: "Endo",
    color: ["Grey"],
    eyeColor: ["Yellow"],
    year: 1979,
    img: "../../images/chars/endo/m2_sotm.png"
  },
  {
    name: "Protomimic",
    animal: "Humanoid",
    type: "Other",
    color: ["Orange", "Grey", "White"],
    eyeColor: ["Yellow"],
    year: 1979,
    img: "../../images/chars/sotm/protomimic.png"
  },

  // Murray family
  {
    name: "Edwin Murray",
    animal: "Human",
    type: "Other",
    color: ["Black"],
    eyeColor: ["Green"],
    year: 1979,
    img: "../../images/chars/other/edwin.png"
  },
  {
    name: "David Sean Murray",
    animal: "Human",
    type: "Other",
    color: ["Blue"],
    eyeColor: ["Blue"],
    year: 1979,
    img: "../../images/chars/other/david_murray.png"
  },
  {
    name: "Fiona Murray",
    animal: "Human",
    type: "Other",
    color: ["Purple"],
    eyeColor: ["Blue"],
    year: 1979,
    img: "../../images/chars/other/fiona.png"
  },
];