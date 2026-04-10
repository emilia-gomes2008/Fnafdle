/* =======================================================
       Character Database
       =======================================================
       Fields:
         name   → character name
         animal → animal type (Bear, Rabbit, etc.)
         type   → variant (Classic, Withered, Toy, Shadow, etc.)
         color  → main color
         year   → origin year
         img    → .../../images/chars/<type>/<name>.<format>
    ======================================================= */
    const CHARS = [
      {
        name:  "Freddy Fazbear",
        animal:"Bear",
        type:  "Classic",
        color: "Brown",
        eyeColor: "Blue",
        year:  1993,
        img:   "../../images/chars/classic/freddy.png"
      },
      {
        name:  "Bonnie",
        animal:"Rabbit",
        type:  "Classic",
        color: "Blue",
        eyeColor: "Red",
        year:  1993,
        img:   "../../images/chars/classic/bonnie.png"
      },
      {
        name:  "Chica",
        animal:"Chicken",
        type:  "Classic",
        color: "Yellow",
        eyeColor: "Magenta",
        year:  1993,
        img:   "../../images/chars/classic/chica.png"
      },
      {
        name:  "Cupcake",
        animal:"Cupcake",
        type:  "Classic",
        color: "Pink",
        eyeColor: "Yellow",
        year:  1993,          
        img:   "../../images/chars/classic/cupcake.png"
      },
      {
        name:  "Foxy",
        animal:"Fox",
        type:  "Classic",
        color: "Red",
        eyeColor: "Yellow",
        year:  1993,
        img:   "../../images/chars/classic/foxy.png"
      },
      {
        name:  "Ralph",
        animal:"Human",
        type:  "Other",
        color: "Blue",
        eyeColor: "Black",
        year:  "Unknown",
        img:   "../../images/chars/other/phone_guy.png"
      },
      {
        name:  "Fan",
        animal:"Fan",
        type:  "Other",
        color: "Grey",
        eyeColor: "Grey",
        year:  1993,          
        img:   "../../images/chars/other/fan.png"
      },
      {
        name:  "Golden Freddy",
        animal:"Bear",
        type:  "Classic",
        color: "Yellow",
        eyeColor: "Black",
        year:  1993,          
        img:   "../../images/chars/classic/golden_freddy.png"
      },
      {
        name:  "Endo-01",
        animal:"Skeleton",
        type:  "Endo",
        color: "Grey",
        eyeColor: "Blue",
        year:  1993,          
        img:   "../../images/chars/endo/endo01.png"
      },
      {
        name:  "Toy Freddy",
        animal:"Bear",
        type:  "Toy",
        color: "Brown",
        eyeColor: "Blue",
        year:  1987,          
        img:   "../../images/chars/toy/toy_freddy.png"
      },
      {
        name:  "Toy Bonnie",
        animal:"Rabbit",
        type:  "Toy",
        color: "Blue",
        eyeColor: "Green",
        year:  1987,          
        img:   "../../images/chars/toy/toy_bonnie.png"
      },
      {
        name:  "Toy Chica",
        animal:"Chicken",
        type:  "Toy",
        color: "Yellow",
        eyeColor: "Blue",
        year:  1987,          
        img:   "../../images/chars/toy/toy_chica.png"
      },
      {
        name:  "Toy Cupcake",
        animal:"Cupcake",
        type:  "Toy",
        color: "Pink",
        eyeColor: "Blue",
        year:  1987,          
        img:   "../../images/chars/toy/toy_cupcake.png"
      },
      {
        name:  "Toy Foxy",
        animal:"Fox",
        type:  "Toy",
        color: "White",
        eyeColor: "Yellow",
        year:  1987,          
        img:   "../../images/chars/toy/toy_foxy.png"
      },
      {
        name:  "Mangle",
        animal:"Fox",
        type:  "Toy",
        color: "White",
        eyeColor: "Yellow",
        year:  1987,          
        img:   "../../images/chars/toy/mangle.png"
      },
      {
        name:  "Balloon Boy",
        animal:"Hunanoid",
        type:  "Toy",
        color: "Red",
        eyeColor: "Blue",
        year:  1987,          
        img:   "../../images/chars/toy/bb.png"
      },
      {
        name:  "JJ",
        animal:"Humanoid",
        type:  "Toy",
        color: "Purple",
        eyeColor: "Magenta",
        year:  1987,          
        img:   "../../images/chars/toy/jj.png"
      },
      {
        name:  "Endo-02",
        animal:"Skeleton",
        type:  "Endo",
        color: "Grey",
        eyeColor: "Blue",
        year:  1987,          
        img:   "../../images/chars/endo/endo02.png"
      },
      {
        name:  "Puppet",
        animal:"Hunanoid",
        type:  "Toy",
        color: "Black",
        eyeColor: "Black",
        year:  1987,          
        img:   "../../images/chars/toy/puppet.png"
      },
      {
        name:  "Withered Freddy",
        animal:"Bear",
        type:  "Withered",
        color: "Brown",
        eyeColor: "Blue",
        year:  1987,          
        img:   "../../images/chars/withered/withered_freddy.png"
      },
      {
        name:  "Withered Bonnie",
        animal:"Rabbit",
        type:  "Withered",
        color: "Blue",
        eyeColor: "Red",
        year:  1987,          
        img:   "../../images/chars/withered/withered_bonnie.png"
      },
      {
        name:  "Withered Chica",
        animal:"Chicken",
        type:  "Withered",
        color: "Yellow",
        eyeColor: "Magenta",
        year:  1987,          
        img:   "../../images/chars/withered/withered_chica.png"
      },
      {
        name:  "Withered Foxy",
        animal:"Fox",
        type:  "Withered",
        color: "Red",
        eyeColor: "Yellow",
        year:  1987,          
        img:   "../../images/chars/withered/withered_foxy.png"
      },
      {
        name:  "Withered Golden Freddy",
        animal:"Bear",
        type:  "Withered",
        color: "Yellow",
        eyeColor: "Black",
        year:  1987,          
        img:   "../../images/chars/withered/withered_golden.png"
      },
      {
        name:  "Shadow Freddy",
        animal:"Bear",
        type:  "Shadow",
        color: "Purple",
        eyeColor: "Black",
        year:  1987,          
        img:   "../../images/chars/shadow/shadow_freddy.png"
      },
      {
        name:  "RWQFSFASXC",
        animal:"Rabbit",
        type:  "Shadow",
        color: "Black",
        eyeColor: "White",
        year:  1987,          
        img:   "../../images/chars/shadow/rxq.png"
      },
      {
        name:  "Paper Pals",
        animal:"Other",
        type:  "Other",
        color: "White",
        eyeColor: "White",
        year:  1987,          
        img:   "../../images/chars/other/Paperpals.png"
      },
      {
        name:  "Crying Children",
        animal:"Other",
        type:  "Other",
        color: "White",
        eyeColor: "Grey",
        year:  "Unconfirmed",          
        img:   "../../images/chars/other/crying_child.png"
      },
      {
        name:  "William Afton",
        animal:"Human",
        type:  "Other",
        color: "Purple",
        eyeColor: "White",
        year:  "Unconfirmed",          
        img:   "../../images/chars/other/afton.png"
      },
      {
        name:  "Springtrap",
        animal:"Rabbit",
        type:  "Springlock",
        color: "Green",
        eyeColor: "Silver",
        year:  2023,          
        img:   "../../images/chars/springlock/springtrap.png"
      },
      {
        name:  "Phone Dude",
        animal:"Human",
        type:  "Other",
        color: "Green",
        eyeColor: "Black",
        year:  "Unknown",
        img:   "../../images/chars/other/phone_dude.png"
      },
      {
        name:  "Phantom Freddy",
        animal:"Bear",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "../../images/chars/phantom/p_freddy.png"
      },
      {
        name:  "Phantom Chica",
        animal:"Chicken",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "../../images/chars/phantom/p_chica.png"
      },
      {
        name:  "Shadow Cupcake",
        animal:"Cupcake",
        type:  "Shadow",
        color: "Black",
        eyeColor: "Black",
        year:  1987,          
        img:   "../../images/chars/shadow/cupcake.png"
      },
      {
        name:  "Phantom Foxy",
        animal:"Fox",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "../../images/chars/phantom/p_foxy.png"
      },
      {
        name:  "Phantom Mangle",
        animal:"Fox",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "../../images/chars/phantom/p_mangle.png"
      },
      {
        name:  "Phantom Puppet",
        animal:"Humanoid",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "../../images/chars/phantom/p_puppet.png"
      },
      {
        name:  "Phantom BB",
        animal:"Humanoid",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "../../images/chars/phantom/p_bb.png"
      },
      {
        name:  "Dark Springtrap",
        animal:"Rabbit",
        type:  "Springlock",
        color: "Green",
        eyeColor: "Silver",
        year:  2023,          
        img:   "../../images/chars/springlock/dark_springtrap.png"
      },
      {
        name:  "Springbonnie",
        animal:"Rabbit",
        type:  "Springlock",
        color: "Yellow",
        eyeColor: "Green",
        year:  1983,          
        img:   "../../images/chars/springlock/springbonnie.png"
      },
      {
        name:  "Fredbear",
        animal:"Bear",
        type:  "Springlock",
        color: "Yellow",
        eyeColor: "Blue",
        year:  1983,          
        img:   "../../images/chars/springlock/fredbear.png"
      },
      {
        name:  "Golden Cupcake",
        animal:"Cupcake",
        type:  "Springlock",
        color: "Yellow",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "../../images/chars/springlock/cupcake.png"
      },
      {
        name:  "Nightmare Freddy",
        animal:"Bear",
        type:  "Nightmare",
        color: "Brown",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "../../images/chars/nightmare/nightmare_freddy.png"
      },
      {
        name:  "Freddles",
        animal:"Bear",
        type:  "Nightmare",
        color: "Brown",
        eyeColor: "White",
        year:  1983,          
        img:   "../../images/chars/nightmare/freddles.png"
      },
      {
        name:  "Nightmare Bonnie",
        animal:"Rabbit",
        type:  "Nightmare",
        color: "Blue",
        eyeColor: "Magenta",
        year:  1983,          
        img:   "../../images/chars/nightmare/nightmare_bonnie.png"
      },
      {
        name:  "Nightmare Chica",
        animal:"Chicken",
        type:  "Nightmare",
        color: "Yellow",
        eyeColor: "Red",
        year:  1983,          
        img:   "../../images/chars/nightmare/nightmare_chica.png"
      },
      {
        name:  "Nightmare Cupcake",
        animal:"Cupcake",
        type:  "Nightmare",
        color: "Pink",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "../../images/chars/nightmare/cupcake.png"
      },
      {
        name:  "Nightmare Foxy",
        animal:"Fox",
        type:  "Nightmare",
        color: "Red",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "../../images/chars/nightmare/nightmare_foxy.png"
      },
      {
        name:  "Nightmare Fredbear",
        animal:"Bear",
        type:  "Nightmare",
        color: "Yellow",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "../../images/chars/nightmare/nightmare_fredbear.png"
      },
      {
        name:  "Plushtrap",
        animal:"Rabbit",
        type:  "Nightmare",
        color: "Green",
        eyeColor: "Black",
        year:  1983,          
        img:   "../../images/chars/nightmare/creonzadoruin.png"
      },
      {
        name:  "Nightmare",
        animal:"Bear",
        type:  "Nightmare",
        color: "Black",
        eyeColor: "Red",
        year:  1983,          
        img:   "../../images/chars/nightmare/nightmare.png"
      },
      {
        name:  "Jack-O-Bonnie",
        animal:"Rabbit",
        type:  "Jack-O",
        color: "Orange",
        eyeColor: "Orange",
        year:  1983,          
        img:   "../../images/chars/nightmare/jack-o/bonnie.png"
      },
      {
        name:  "Jack-O-Chica",
        animal:"Chicken",
        type:  "Jack-O",
        color: "Orange",
        eyeColor: "Orange",
        year:  1983,          
        img:   "../../images/chars/nightmare/jack-o/chica.png"
      },
      {
        name:  "Jack-O-Lantern",
        animal:"Cupcake",
        type:  "Jack-O",
        color: "Orange",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "../../images/chars/nightmare/jack-o/lantern.png"
      },
      {
        name:  "Nightmare Mangle",
        animal:"Fox",
        type:  "Nightmare",
        color: "White",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "../../images/chars/nightmare/nightmare_mangle.png"
      },
      {
        name:  "Nightmare Balloon Boy",
        animal:"Humanoid",
        type:  "Nightmare",
        color: "Purple",
        eyeColor: "Red",
        year:  1983,          
        img:   "../../images/chars/nightmare/nightmare_bb.png"
      },
      {
        name:  "Nightmarionne",
        animal:"Humanoid",
        type:  "Nightmare",
        color: "Black",
        eyeColor: "White",
        year:  1983,          
        img:   "../../images/chars/nightmare/nightmarionne.png"
      },
      {
        name:  "Crying Child",
        animal:"Human",
        type:  "Other",
        color: "White",
        eyeColor: "Black",
        year:  "Unconfirmed",          
        img:   "../../images/chars/other/david_afton.png"
      },
      {
        name:  "Michael Afton",
        animal:"Human",
        type:  "Other",
        color: "Purple",
        eyeColor: "Blue",
        year:  "Unconfirmed",          
        img:   "../../images/chars/other/michael_afton.png"
      },
      {
        name:  "Endo Plush",
        animal:"Skeleton",
        type:  "Endo",
        color: "Grey",
        eyeColor: "Green",
        year:  "Unconfirmed",          
        img:   "../../images/chars/endo/plush.png"
      },
      {
        name:  "Bouncepot",
        animal:"Bouncepot",
        type:  "Other",
        color: "Green",
        eyeColor: "White",
        year:  "Unconfirmed",          
        img:   "../../images/chars/other/bouncepot.png"
      },
      {
        name:  "Dee Dee",
        animal:"Humanoid",
        type:  "Other",
        color: "Purple and Yellow",
        eyeColor: "Green",
        year:  2023,
        img:   "../../images/chars/other/egg_baby.png"
      },
      {
        name:  "Tangle",
        animal:"Fox",
        type:  "Toy",
        color: "White",
        eyeColor: "BlaWhiteck",
        year:  "Unconfirmed",          
        img:   "../../images/chars/toy/tangle.png"
      },
      {
        name:  "White Rabbit",
        animal:"Rabbit",
        type:  "Shadow",
        color: "White",
        eyeColor: "Black",
        year:  "Unconfirmed",          
        img:   "../../images/chars/shadow/white_rabbit.png"
      },
      {
        name:  "Old Man Consequences",
        animal:"Aligator",
        type:  "Other",
        color: "Red",
        eyeColor: "Red",
        year:  "Unconfirmed",          
        img:   "../../images/chars/other/omc.png"
      },
      {
        name:  "Animdude",
        animal:"Human",
        type:  "Other",
        color: "Blue",
        eyeColor: "White",
        year:  1978,          
        img:   "../../images/chars/other/Animdude.png"
      },
      {
        name:  "Chica's Magic Rainbow",
        animal:"Rainbow",
        type:  "Other",
        color: "Rainbow",
        eyeColor: "Black",
        year:  "Unknown",
        img:   "../../images/chars/other/rainbow.png"
      },
      {
        name:  "Mr. Chipper",
        animal:"Beaver",
        type:  "Other",
        color: "Brown",
        eyeColor: "Blue",
        year:  2013,          
        img:   "../../images/chars/other/chipper.png"
      },
      {
        name:  "Coffee",
        animal:"Coffee Machine",
        type:  "Other",
        color: "Brown",
        eyeColor: "Yellow",
        year:  2012,          
        img:   "../../images/chars/other/coffee.png"
      },
      {
        name:  "Security Trophy",
        animal:"Owl",
        type:  "Trophy",
        color: "Grey",
        eyeColor: "Grey",
        year:  2016,          
        img:   "../../images/chars/trophy/security_trophy.png"
      },
      {
        name:  "Scott Trophy",
        animal:"Human",
        type:  "Trophy",
        color: "Grey",
        eyeColor: "Grey",
        year:  2016,          
        img:   "../../images/chars/trophy/scott_trophy.png"
      },
      {
        name:  "Chipper's Revenge Trophy",
        animal:"Human",
        type:  "Trophy",
        color: "Grey",
        eyeColor: "Grey",
        year:  2016,          
        img:   "../../images/chars/trophy/chipper_trophy.png"
      },
      {
        name:  "Chica's Magic Rainbow Trophy",
        animal:"Rainbow",
        type:  "Trophy",
        color: "Grey",
        eyeColor: "Grey",
        year:  2016,          
        img:   "../../images/chars/trophy/rainbow_trophy.png"
      },
      {
        name:  "Fredbear Legs Trophy",
        animal:"Bear",
        type:  "Trophy",
        color: "Grey",
        eyeColor: "Grey",
        year:  2016,          
        img:   "../../images/chars/trophy/fredbear_trophy.png"
      },
      {
        name:  "Crying Child Trophy",
        animal:"Human",
        type:  "Trophy",
        color: "Grey",
        eyeColor: "Grey",
        year:  2016,          
        img:   "../../images/chars/trophy/crying_child_trophy.png"
      },
      {
        name:  "Shiny Pearl Trophy",
        animal:"Pearl",
        type:  "Trophy",
        color: "Grey",
        eyeColor: "Grey",
        year:  2016,          
        img:   "../../images/chars/trophy/pearl_tropy.png"
      },
      {
        name:  "The Fan Trophy",
        animal:"Fan",
        type:  "Trophy",
        color: "Grey",
        eyeColor: "Grey",
        year:  2016,          
        img:   "../../images/chars/trophy/fan_trophy.png"
      },
      {
        name:  "Funtime Freddy",
        animal:"Bear",
        type:  "Funtime",
        color: "White",
        eyeColor: "Blue",
        year:  "Unconfirmed",          
        img:   "../../images/chars/funtime/funtime_freddy.png"
      },
      {
        name:  "Funtime Foxy",
        animal:"Fox",
        type:  "Funtime",
        color: "White",
        eyeColor: "Yellow",
        year:  "Unconfirmed",          
        img:   "../../images/chars/funtime/funtime_foxy.png"
      },
      {
        name:  "Bon-Bon",
        animal:"Rabbit",
        type:  "Funtime",
        color: "Blue",
        eyeColor: "Magenta",
        year:  "Unconfirmed",          
        img:   "../../images/chars/funtime/bon-bon.png"
      },
      {
        name:  "Bonnet",
        animal:"Rabbit",
        type:  "Funtime",
        color: "Pink",
        eyeColor: "Blue",
        year:  "Unconfirmed",          
        img:   "../../images/chars/funtime/bonnet.png"
      },
      {
        name:  "Circus Baby",
        animal:"Humanoid",
        type:  "Funtime",
        color: "White",
        eyeColor: "Green",
        year:  "Unconfirmed",          
        img:   "../../images/chars/funtime/baby.png"
      },
      {
        name:  "Bidybab",
        animal:"Humanoid",
        type:  "Funtime",
        color: "White",
        eyeColor: "Magenta",
        year:  "Unconfirmed",          
        img:   "../../images/chars/funtime/bidybab.png"
      },
      {
        name:  "Electrobab",
        animal:"Humanoid",
        type:  "Funtime",
        color: "White",
        eyeColor: "Yellow",
        year:  "Unconfirmed",          
        img:   "../../images/chars/funtime/electrobab.png"
      },
      {
        name:  "Ballora",
        animal:"Humanoid",
        type:  "Funtime",
        color: "White",
        eyeColor: "Magenta",
        year:  "Unconfirmed",          
        img:   "../../images/chars/funtime/ballora.png"
      },
      {
        name:  "Minireena",
        animal:"Humanoid",
        type:  "Funtime",
        color: "White",
        eyeColor: "black",
        year:  "Unconfirmed",          
        img:   "../../images/chars/funtime/minireena.png"
      },
      {
        name:  "Lolbit",
        animal:"Fox",
        type:  "Funtime",
        color: "White",
        eyeColor: "White",
        year:  "Unconfirmed",          
        img:   "../../images/chars/funtime/lolbit.png"
      },
      {
        name:  "Yenndo",
        animal:"Skeleton",
        type:  "Endo",
        color: "Grey",
        eyeColor: "Yellow",
        year:  "Unconfirmed",          
        img:   "../../images/chars/endo/yenndo.png"
      },
      {
        name:  "Ennard",
        animal:"Skeleton",
        type:  "Endo",
        color: "White",
        eyeColor: "Blue",
        year:  "Unconfirmed",          
        img:   "../../images/chars/endo/ennard.png"
      },
      {
        name:  "HandUnit",
        animal:"Keypad",
        type:  "Other",
        color: "Yellow",
        eyeColor: "Black",
        year:  "Unconfirmed",          
        img:   "../../images/chars/other/handunit.png"
      },
      {
        name:  "Clara",
        animal:"Human",
        type:  "Other",
        color: "White",
        eyeColor: "Black",
        year:  "Unconfirmed",          
        img:   "../../images/chars/other/clara.png"
      },
      {
        name:  "Vlad",
        animal:"Humanoid",
        type:  "Other",
        color: "Blue",
        eyeColor: "Black",
        year:  "Unconfirmed",          
        img:   "../../images/chars/other/vlad.png"
      },
      {
        name:  "Vlad's Son",
        animal:"Humanoid",
        type:  "Other",
        color: "Blue",
        eyeColor: "Black",
        year:  "Unconfirmed",          
        img:   "../../images/chars/other/VladsSon.png"
      },
      {
        name:  "Module Heads",
        animal:"Humanoid",
        type:  "Other",
        color: "White",
        eyeColor: "Yellow",
        year:  "Unconfirmed",          
        img:   "../../images/chars/other/module_heads.png"
      },
      {
        name:  "Elizabeth Afton",
        animal:"Human",
        type:  "Other",
        color: "White",
        eyeColor: "Green",
        year:  "Unconfirmed",          
        img:   "../../images/chars/other/elizabeth_afton.png"
      },
      {
        name:  "Minigame Freddy",
        animal:"Bear",
        type:  "Other",
        color: "Brown",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/other/minigame_freddy.png"
      },
      {
        name:  "Minigame Grey Freddy",
        animal:"Bear",
        type:  "Other",
        color: "Grey",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/other/minigame_grey_freddy.png"
      },
      {
        name:  "Scraptrap",
        animal:"Rabbit",
        type:  "Springlock",
        color: "Green",
        eyeColor: "Silver",
        year:  2023,
        img:   "../../images/chars/springlock/scraptrap.png"
      },
      {
        name:  "Scrap Baby",
        animal:"Humanoid",
        type:  "Funtime",
        color: "Grey",
        eyeColor: "Green",
        year:  2023,
        img:   "../../images/chars/funtime/scrap_baby.png"
      },
      {
        name:  "Lefty",
        animal:"Bear",
        type:  "Rockstar",
        color: "Black",
        eyeColor: "Yellow",
        year:  2023,
        img:   "../../images/chars/rockstar/lefty.png"
      },
      {
        name:  "Molten Freddy",
        animal:"Bear",
        type:  "Endo",
        color: "Grey",
        eyeColor: "Yellow",
        year:  2023,
        img:   "../../images/chars/endo/molten_freddy.png"
      },
      {
        name:  "Helpy",
        animal:"Bear",
        type:  "Other",
        color: "White",
        eyeColor: "Blue",
        year:  2023,
        img:   "../../images/chars/other/helpy.gif"
      },
      {
        name:  "Henry Emily",
        animal:"Human",
        type:  "Other",
        color: "White",
        eyeColor: "Green",
        year:  "1980s",
        img:   "../../images/chars/other/henry.png"
      },
      {
        name:  "Ad Crew",
        animal:"Humanoid",
        type:  "Other",
        color: "Colorful",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/other/ads.png"
      },
      {
        name:  "Mr. Hippo",
        animal:"Hippo",
        type:  "Mediocre Melodies",
        color: "Purple",
        eyeColor: "Blue",
        year:  2023,
        img:   "../../images/chars/mediocre_melodies/mr_hippo.png"
      },
      {
        name:  "Orville Elephant",
        animal:"Elephant",
        type:  "Mediocre Melodies",
        color: "Orange",
        eyeColor: "Blue",
        year:  2023,
        img:   "../../images/chars/mediocre_melodies/orville_elephant.png"
      },
      {
        name:  "Happy Frog",
        animal:"Frog",
        type:  "Mediocre Melodies",
        color: "Green",
        eyeColor: "Magenta",
        year:  2023,
        img:   "../../images/chars/mediocre_melodies/happy_frog.png"
      },
      {
        name:  "Pigpatch",
        animal:"Pig",
        type:  "Mediocre Melodies",
        color: "Pink",
        eyeColor: "Blue and Green",
        year:  2023,
        img:   "../../images/chars/mediocre_melodies/pigpatch.png"
      },
      {
        name:  "Nedd Bear",
        animal:"Bear",
        type:  "Mediocre Melodies",
        color: "Brown",
        eyeColor: "Green",
        year:  2023,
        img:   "../../images/chars/mediocre_melodies/nedd_bear.png"
      },
      {
        name:  "Rockstar Freddy",
        animal:"Bear",
        type:  "Rockstar",
        color: "Brown",
        eyeColor: "Blue",
        year:  2023,
        img:   "../../images/chars/rockstar/rockstar_freddy.png"
      },
      {
        name:  "Rockstar Bonnie",
        animal:"Rabbit",
        type:  "Rockstar",
        color: "Blue",
        eyeColor: "Green",
        year:  2023,
        img:   "../../images/chars/rockstar/rockstar_bonnie.png"
      },
      {
        name:  "Rockstar Chica",
        animal:"Chicken",
        type:  "Rockstar",
        color: "Yellow",
        eyeColor: "Magenta",
        year:  2023,
        img:   "../../images/chars/rockstar/rockstar_chica.png"
      },
      {
        name:  "Rockstar Foxy",
        animal:"Fox",
        type:  "Rockstar",
        color: "Red",
        eyeColor: "Yellow",
        year:  2023,
        img:   "../../images/chars/rockstar/rockstar_foxy.png"
      },
      {
        name:  "Candy Cadet",
        animal:"Robot",
        type:  "Other",
        color: "Grey",
        eyeColor: "Colorful",
        year:  2023,
        img:   "../../images/chars/other/candy_cadet.png"
      },
      {
        name:  "Egg Baby",
        animal:"Humanoid",
        type:  "Other",
        color: "White",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/other/egg_baby.png"
      },
      {
        name:  "El Chip",
        animal:"Beaver",
        type:  "Other",
        color: "Brown",
        eyeColor: "Green",
        year:  2023,
        img:   "../../images/chars/other/el_chip.png"
      },
      {
        name:  "Funtime Chica",
        animal:"Chicken",
        type:  "Funtime",
        color: "White",
        eyeColor: "Magenta",
        year:  "Unnknown",
        img:   "../../images/chars/funtime/funtime_chica.png"
      },
      {
        name:  "Funtime Cupcake",
        animal:"Cupcake",
        type:  "Funtime",
        color: "Pink",
        eyeColor: "Blue",
        year:  "Unnknown",
        img:   "../../images/chars/funtime/cupcake.png"
      },
      {
        name:  "Lemonade Clown",
        animal:"Humanoid",
        type:  "Other",
        color: "White",
        eyeColor: "Blue",
        year:  2023,
        img:   "../../images/chars/other/lemonade_clown.png"
      },
      {
        name:  "Fruit Punch Clown",
        animal:"Humanoid",
        type:  "Other",
        color: "Brown",
        eyeColor: "Green",
        year:  2023,
        img:   "../../images/chars/other/fruit_punch_clown.png"
      },
      {
        name:  "Music Man",
        animal:"Spider",
        type:  "Other",
        color: "White",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/other/music_man.png"
      },
      {
        name:  "Neon Jukebox",
        animal:"Jukebox",
        type:  "Other",
        color: "Rainbow",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/other/neon_jukebox.png"
      },
      {
        name:  "Disco Pizza Light",
        animal:"Pizza",
        type:  "Other",
        color: "Black",
        eyeColor: "Colorful",
        year:  2023,
        img:   "../../images/chars/other/disco_pizza_light.png"
      },
      {
        name:  "Prize King",
        animal:"Humanoid",
        type:  "Other",
        color: "Yellow",
        eyeColor: "Green",
        year:  2023,
        img:   "../../images/chars/other/prize_king.png"
      },
      {
        name:  "Security Puppet",
        animal:"Humanoid",
        type:  "Other",
        color: "White",
        eyeColor: "Yellow",
        year:  2023,
        img:   "../../images/chars/other/security_puppet.png"
      },
      {
        name:  "Pickles",
        animal:"Pickles",
        type:  "Other",
        color: "Green",
        eyeColor: "Green",
        year:  2023,
        img:   "../../images/chars/other/pickles.png"
      },
      {
        name:  "Tutorial Unit",
        animal:"Humanoid",
        type:  "Other",
        color: "White",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/other/tutorial_unit.png"
      },
      {
      name:  "Winking Sign",
      animal:"Sign",
      type:  "Other",
      color: "Brown",
      eyeColor: "Black",
      year:  2023,
      img:   "../../images/chars/other/winking_sign.png"
    },
    {
        name:  "Gumball Swivelhands",
        animal:"Humanoid",
        type:  "Other",
        color: "Red",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/other/gumball_swivelhands.png"
      },
      {
        name:  "Ballpit Tower",
        animal:"Tower",
        type:  "Other",
        color: "Yellow",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/other/ballpit_tower.png"
      },
      {
        name:  "Pan Stan",
        animal:"Pan",
        type:  "Trash",
        color: "Grey",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/trash/pan_stan.png"
      },
            {
        name:  "Pan Stan",
        animal:"Trash",
        type:  "Trash",
        color: "Grey",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/trash/pan_stan.png"
      },
            {
        name:  "Bucket Bob",
        animal:"Trash",
        type:  "Trash",
        color: "Grey",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/trash/bucket_bob.png"
      },
      {
        name:  "No. 1 Crate",
        animal:"Trash",
        type:  "Trash",
        color: "Blue",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/trash/no_1_crate.png"
      },
      {
        name:  "Mr. Can-Do",
        animal:"Trash",
        type:  "Trash",
        color: "Red",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/trash/mr_can-do.png"
      },
      {
        name:  "Mr. Hugs",
        animal:"Trash",
        type:  "Trash",
        color: "Grey",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/trash/mr_hugs.png"
      },
      {
        name:  "Plush Freddy",
        animal:"Bear",
        type:  "Plush",
        color: "Brown",
        eyeColor: "Blue",
        year:  2023,
        img:   "../../images/chars/plush/freddy.png"
      },
      {
        name:  "Plush Bonnie",
        animal:"Rabbit",
        type:  "Plush",
        color: "Blue",
        eyeColor: "Red",
        year:  2023,
        img:   "../../images/chars/plush/bonnie.png"
      },
      {
        name:  "Plush Chica",
        animal:"Chicken",
        type:  "Plush",
        color: "Yellow",
        eyeColor: "Magenta",
        year:  2023,
        img:   "../../images/chars/plush/chica.png"
      },
      {
        name:  "Plush Foxy",
        animal:"Fox",
        type:  "Plush",
        color: "Red",
        eyeColor: "Yellow",
        year:  2023,
        img:   "../../images/chars/plush/foxy.png"
      },
      {
        name:  "Plush Balloon Boy",
        animal:"Humanoid",
        type:  "Plush",
        color: "Red",
        eyeColor: "Blue",
        year:  2023,
        img:   "../../images/chars/plush/bb.png"
      },
      {
        name:  "Plush Golden Freddy",
        animal:"Bear",
        type:  "Plush",
        color: "Yellow",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/plush/golden_freddy.png"
      },
      {
        name:  "Plush Mangle",
        animal:"Fox",
        type:  "Plush",
        color: "White",
        eyeColor: "Yellow",
        year:  2023,
        img:   "../../images/chars/plush/mangle.png"
      },
      {
        name:  "Plush Fredbear",
        animal:"Bear",
        type:  "Plush",
        color: "Yellow",
        eyeColor: "White",
        year:  2023,
        img:   "../../images/chars/plush/fredbear.png"
      },
      {
        name:  "Plush Circus Baby",
        animal:"Humanoid",
        type:  "Plush",
        color: "White",
        eyeColor: "Green",
        year:  2023,
        img:   "../../images/chars/plush/baby.png"
      },
      {
        name:  "Loading Freddy",
        animal:"Bear",
        type:  "Withered",
        color: "Grey",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/withered/loading_freddy.png"
      },
      {
        name:  "XOR",
        animal:"Humanoid",
        type:  "Other",
        color: "Grey",
        eyeColor: "Black",
        year:  2023,
        img:   "../../images/chars/other/xor.png"
      },
      {
        name:  "The Bronze One",
        animal:"Bear",
        type:  "Trophy",
        color: "Brown",
        eyeColor: "Brown",
        year:  2023,
        img:   "../../images/chars/trophy/bronze.png"
      },
      {
        name:  "Books Freddy",
        animal:"Bear",
        type:  "Trophy",
        color: "Grey",
        eyeColor: "Grey",
        year:  2023,
        img:   "../../images/chars/trophy/books_freddy.png"
      },
      {
        name:  "Games Freddy",
        animal:"Bear",
        type:  "Trophy",
        color: "Yellow",
        eyeColor: "Yellow",
        year:  2023,
        img:   "../../images/chars/trophy/games_freddy.png"
      },
    ];
    