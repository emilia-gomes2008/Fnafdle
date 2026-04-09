/* =======================================================
       Character Database
       =======================================================
       Fields:
         name   → character name
         animal → animal type (Bear, Rabbit, etc.)
         type   → variant (Classic, Withered, Toy, Shadow, etc.)
         color  → main color
         year   → origin year
         img    → ./images/chars/<type>/<name>.<format>
    ======================================================= */
    const CHARS = [
      {
        name:  "Freddy Fazbear",
        animal:"Bear",
        type:  "Classic",
        color: "Brown",
        eyeColor: "Blue",
        year:  1993,
        img:   "images/chars/classic/freddy.png"
      },
      {
        name:  "Bonnie",
        animal:"Rabbit",
        type:  "Classic",
        color: "Blue",
        eyeColor: "Red",
        year:  1993,
        img:   "images/chars/classic/bonnie.png"
      },
      {
        name:  "Chica",
        animal:"Chicken",
        type:  "Classic",
        color: "Yellow",
        eyeColor: "Magenta",
        year:  1993,
        img:   "images/chars/classic/chica.png"
      },
      {
        name:  "Cupcake",
        animal:"Cupcake",
        type:  "Classic",
        color: "Pink",
        eyeColor: "Yellow",
        year:  1993,          
        img:   "images/chars/classic/cupcake.png"
      },
      {
        name:  "Foxy",
        animal:"Fox",
        type:  "Classic",
        color: "Red",
        eyeColor: "Yellow",
        year:  1993,
        img:   "images/chars/classic/foxy.png"
      },
      {
        name:  "Golden Freddy",
        animal:"Bear",
        type:  "Classic",
        color: "Yellow",
        eyeColor: "Black",
        year:  1993,          
        img:   "images/chars/classic/golden_freddy.png"
      },
      {
        name:  "Endo-01",
        animal:"Skeleton",
        type:  "Endo",
        color: "Grey",
        eyeColor: "Blue",
        year:  1993,          
        img:   "images/chars/endo/endo01.png"
      },
      {
        name:  "Toy Freddy",
        animal:"Bear",
        type:  "Toy",
        color: "Brown",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/toy/toy_freddy.png"
      },
      {
        name:  "Toy Bonnie",
        animal:"Rabbit",
        type:  "Toy",
        color: "Blue",
        eyeColor: "Green",
        year:  1987,          
        img:   "images/chars/toy/toy_bonnie.png"
      },
      {
        name:  "Toy Chica",
        animal:"Chicken",
        type:  "Toy",
        color: "Yellow",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/toy/toy_chica.png"
      },
      {
        name:  "Toy Cupcake",
        animal:"Cupcake",
        type:  "Toy",
        color: "Pink",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/toy/toy_cupcake.png"
      },
      {
        name:  "Toy Foxy",
        animal:"Fox",
        type:  "Toy",
        color: "White",
        eyeColor: "Yellow",
        year:  1987,          
        img:   "images/chars/toy/toy_foxy.png"
      },
      {
        name:  "Mangle",
        animal:"Fox",
        type:  "Toy",
        color: "White",
        eyeColor: "Yellow",
        year:  1987,          
        img:   "images/chars/toy/mangle.png"
      },
      {
        name:  "Balloon Boy",
        animal:"Hunanoid",
        type:  "Toy",
        color: "Red",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/toy/bb.png"
      },
      {
        name:  "JJ",
        animal:"Humanoid",
        type:  "Toy",
        color: "Purple",
        eyeColor: "Magenta",
        year:  1987,          
        img:   "images/chars/toy/jj.png"
      },
      {
        name:  "Endo-02",
        animal:"Skeleton",
        type:  "Endo",
        color: "Grey",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/endo/endo02.png"
      },
      {
        name:  "Puppet",
        animal:"Hunanoid",
        type:  "Toy",
        color: "Black",
        eyeColor: "Black",
        year:  1987,          
        img:   "images/chars/toy/puppet.png"
      },
      {
        name:  "Withered Freddy",
        animal:"Bear",
        type:  "Withered",
        color: "Brown",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/withered/withered_freddy.png"
      },
      {
        name:  "Withered Bonnie",
        animal:"Rabbit",
        type:  "Withered",
        color: "Blue",
        eyeColor: "Red",
        year:  1987,          
        img:   "images/chars/withered/withered_bonnie.png"
      },
      {
        name:  "Withered Chica",
        animal:"Chicken",
        type:  "Withered",
        color: "Yellow",
        eyeColor: "Magenta",
        year:  1987,          
        img:   "images/chars/withered/withered_chica.png"
      },
      {
        name:  "Withered Foxy",
        animal:"Fox",
        type:  "Withered",
        color: "Red",
        eyeColor: "Yellow",
        year:  1987,          
        img:   "images/chars/withered/withered_foxy.png"
      },
      {
        name:  "Withered Golden Freddy",
        animal:"Bear",
        type:  "Withered",
        color: "Yellow",
        eyeColor: "Black",
        year:  1987,          
        img:   "images/chars/withered/withered_golden.png"
      },
      {
        name:  "Shadow Freddy",
        animal:"Bear",
        type:  "Shadow",
        color: "Purple",
        eyeColor: "Black",
        year:  1987,          
        img:   "images/chars/shadow/shadow_freddy.png"
      },
      {
        name:  "RWQFSFASXC",
        animal:"Rabbit",
        type:  "Shadow",
        color: "Black",
        eyeColor: "White",
        year:  1987,          
        img:   "images/chars/shadow/rxq.png"
      },
      {
        name:  "Paper Pals",
        animal:"Other",
        type:  "Other",
        color: "White",
        eyeColor: "White",
        year:  1987,          
        img:   "images/chars/other/Paperpals.png"
      },
      {
        name:  "Crying Child",
        animal:"Other",
        type:  "Other",
        color: "White",
        eyeColor: "Grey",
        year:  "Unconfirmed",          
        img:   "images/chars/other/crying_child.png"
      },
      {
        name:  "William Afton",
        animal:"Human",
        type:  "Other",
        color: "Purple",
        eyeColor: "White",
        year:  "Unconfirmed",          
        img:   "images/chars/other/afton.png"
      },
      {
        name:  "Springtrap",
        animal:"Rabbit",
        type:  "Springlock",
        color: "Green",
        eyeColor: "Silver",
        year:  2023,          
        img:   "images/chars/springlock/springtrap.png"
      },
      {
        name:  "Phantom Freddy",
        animal:"Bear",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/phantom/p_freddy.png"
      },
      {
        name:  "Phantom Chica",
        animal:"Chicken",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/phantom/p_chica.png"
      },
      {
        name:  "Shadow Cupcake",
        animal:"Cupcake",
        type:  "Shadow",
        color: "Black",
        eyeColor: "Black",
        year:  1987,          
        img:   "images/chars/shadow/cupcake.png"
      },
      {
        name:  "Phantom Foxy",
        animal:"Fox",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/phantom/p_foxy.png"
      },
      {
        name:  "Phantom Mangle",
        animal:"Fox",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/phantom/p_mangle.png"
      },
      {
        name:  "Phantom Puppet",
        animal:"Humanoid",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/phantom/p_puppet.png"
      },
      {
        name:  "Phantom BB",
        animal:"Humanoid",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/phantom/p_bb.png"
      },
      {
        name:  "Dark Springtrap",
        animal:"Rabbit",
        type:  "Springlock",
        color: "Green",
        eyeColor: "Silver",
        year:  2023,          
        img:   "images/chars/springlock/dark_springtrap.png"
      },
      {
        name:  "Springbonnie",
        animal:"Rabbit",
        type:  "Springlock",
        color: "Yellow",
        eyeColor: "Green",
        year:  1983,          
        img:   "images/chars/springlock/springbonnie.png"
      },
      {
        name:  "Fredbear",
        animal:"Bear",
        type:  "Springlock",
        color: "Yellow",
        eyeColor: "Blue",
        year:  1983,          
        img:   "images/chars/springlock/fredbear.png"
      },
      {
        name:  "Golden Cupcake",
        animal:"Cupcake",
        type:  "Springlock",
        color: "Yellow",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "images/chars/springlock/cupcake.png"
      },
      {
        name:  "Nightmare Freddy",
        animal:"Bear",
        type:  "Nightmare",
        color: "Brown",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare_freddy.png"
      },
      {
        name:  "Freddles",
        animal:"Bear",
        type:  "Nightmare",
        color: "Brown",
        eyeColor: "White",
        year:  1983,          
        img:   "images/chars/nightmare/freddles.png"
      },
      {
        name:  "Nightmare Bonnie",
        animal:"Rabbit",
        type:  "Nightmare",
        color: "Blue",
        eyeColor: "Magenta",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare_bonnie.png"
      },
      {
        name:  "Nightmare Chica",
        animal:"Chicken",
        type:  "Nightmare",
        color: "Yellow",
        eyeColor: "Red",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare_chica.png"
      },
      {
        name:  "Nightmare Cupcake",
        animal:"Cupcake",
        type:  "Nightmare",
        color: "Pink",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "images/chars/nightmare/cupcake.png"
      },
      {
        name:  "Nightmare Foxy",
        animal:"Fox",
        type:  "Nightmare",
        color: "Red",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare_foxy.png"
      },
      {
        name:  "Nightmare Fredbear",
        animal:"Bear",
        type:  "Nightmare",
        color: "Yellow",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare_fredbear.png"
      },
      {
        name:  "Plushtrap",
        animal:"Rabbit",
        type:  "Nightmare",
        color: "Green",
        eyeColor: "Black",
        year:  1983,          
        img:   "images/chars/nightmare/creonzadoruin.png"
      },
      {
        name:  "Nightmare",
        animal:"Bear",
        type:  "Nightmare",
        color: "Black",
        eyeColor: "Red",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare.png"
      },
      {
        name:  "Jack-O-Bonnie",
        animal:"Rabbit",
        type:  "Jack-O",
        color: "Orange",
        eyeColor: "Orange",
        year:  1983,          
        img:   "images/chars/nightmare/jack-o/bonnie.png"
      },
      {
        name:  "Jack-O-Chica",
        animal:"Chicken",
        type:  "Jack-O",
        color: "Orange",
        eyeColor: "Orange",
        year:  1983,          
        img:   "images/chars/nightmare/jack-o/chica.png"
      },
      {
        name:  "Jack-O-Lantern",
        animal:"Cupcake",
        type:  "Jack-O",
        color: "Orange",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "images/chars/nightmare/jack-o/lantern.png"
      },
      {
        name:  "Nightmare Mangle",
        animal:"Fox",
        type:  "Nightmare",
        color: "White",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare_mangle.png"
      },
      {
        name:  "Nightmare Balloon Boy",
        animal:"Humanoid",
        type:  "Nightmare",
        color: "Purple",
        eyeColor: "Red",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare_bb.png"
      },
      {
        name:  "Nightmarionne",
        animal:"Humanoid",
        type:  "Nightmare",
        color: "Black",
        eyeColor: "White",
        year:  1983,          
        img:   "images/chars/nightmare/nightmarionne.png"
      },
      {
        name:  "Michael Afton",
        animal:"Human",
        type:  "Other",
        color: "Purple",
        eyeColor: "Blue",
        year:  "Unconfirmed",          
        img:   "images/chars/other/michael_afton.png"
      },
      {
        name:  "Endo Plush",
        animal:"Skeleton",
        type:  "Endo",
        color: "Grey",
        eyeColor: "Green",
        year:  "Unconfirmed",          
        img:   "images/chars/endo/plush.png"
      },
      {
        name:  "Old Man Consequences",
        animal:"Aligator",
        type:  "Other",
        color: "Red",
        eyeColor: "Red",
        year:  "Unconfirmed",          
        img:   "images/chars/other/omc.png"
      },
      {
        name:  "Animdude",
        animal:"Human",
        type:  "Other",
        color: "Blue",
        eyeColor: "White",
        year:  1978,          
        img:   "images/chars/other/Animdude.png"
      },
      {
        name:  "Mr. Chipper",
        animal:"Beaver",
        type:  "Other",
        color: "Brown",
        eyeColor: "Blue",
        year:  2013,          
        img:   "images/chars/other/chipper.png"
      },
      {
        name:  "Coffee",
        animal:"Coffee Machine",
        type:  "Other",
        color: "Brown",
        eyeColor: "Yellow",
        year:  2012,          
        img:   "images/chars/other/coffee.png"
      },
      {
        name:  "Funtime Freddy",
        animal:"Bear",
        type:  "Funtime",
        color: "White",
        eyeColor: "Blue",
        year:  "Unconfirmed",          
        img:   "images/chars/funtime/funtime_freddy.png"
      },
      {
        name:  "Funtime Foxy",
        animal:"Fox",
        type:  "Funtime",
        color: "White",
        eyeColor: "Yellow",
        year:  "Unconfirmed",          
        img:   "images/chars/funtime/funtime_foxy.png"
      },
      {
        name:  "Bon-Bon",
        animal:"Rabbit",
        type:  "Funtime",
        color: "Blue",
        eyeColor: "Magenta",
        year:  "Unconfirmed",          
        img:   "images/chars/funtime/bon-bon.png"
      },
      {
        name:  "Bonnet",
        animal:"Rabbit",
        type:  "Funtime",
        color: "Pink",
        eyeColor: "Blue",
        year:  "Unconfirmed",          
        img:   "images/chars/funtime/bonnet.png"
      },
      {
        name:  "Circus Baby",
        animal:"Humanoid",
        type:  "Funtime",
        color: "White",
        eyeColor: "Green",
        year:  "Unconfirmed",          
        img:   "images/chars/funtime/baby.png"
      },
      {
        name:  "Bidybab",
        animal:"Humanoid",
        type:  "Funtime",
        color: "White",
        eyeColor: "Magenta",
        year:  "Unconfirmed",          
        img:   "images/chars/funtime/bidybab.png"
      },
      {
        name:  "Electrobab",
        animal:"Humanoid",
        type:  "Funtime",
        color: "White",
        eyeColor: "Yellow",
        year:  "Unconfirmed",          
        img:   "images/chars/funtime/electrobab.png"
      },
      {
        name:  "Ballora",
        animal:"Humanoid",
        type:  "Funtime",
        color: "White",
        eyeColor: "Magenta",
        year:  "Unconfirmed",          
        img:   "images/chars/funtime/ballora.png"
      },
      {
        name:  "Minireena",
        animal:"Humanoid",
        type:  "Funtime",
        color: "White",
        eyeColor: "black",
        year:  "Unconfirmed",          
        img:   "images/chars/funtime/minireena.png"
      },
      {
        name:  "Lolbit",
        animal:"Fox",
        type:  "Funtime",
        color: "White",
        eyeColor: "White",
        year:  "Unconfirmed",          
        img:   "images/chars/funtime/lolbit.png"
      },
      {
        name:  "Yenndo",
        animal:"Skeleton",
        type:  "Endo",
        color: "Grey",
        eyeColor: "Yellow",
        year:  "Unconfirmed",          
        img:   "images/chars/endo/yenndo.png"
      },
      {
        name:  "Ennard",
        animal:"Skeleton",
        type:  "Endo",
        color: "White",
        eyeColor: "Blue",
        year:  "Unconfirmed",          
        img:   "images/chars/endo/ennard.png"
      },
      {
        name:  "HandUnit",
        animal:"Keypad",
        type:  "Other",
        color: "Yellow",
        eyeColor: "Black",
        year:  "Unconfirmed",          
        img:   "images/chars/other/handunit.png"
      },
      {
        name:  "Clara",
        animal:"Human",
        type:  "Other",
        color: "White",
        eyeColor: "Black",
        year:  "Unconfirmed",          
        img:   "images/chars/other/clara.png"
      },
      {
        name:  "Vlad",
        animal:"Humanoid",
        type:  "Other",
        color: "Blue",
        eyeColor: "Black",
        year:  "Unconfirmed",          
        img:   "images/chars/other/vlad.png"
      },
      {
        name:  "Vlad's Son",
        animal:"Humanoid",
        type:  "Other",
        color: "Blue",
        eyeColor: "Black",
        year:  "Unconfirmed",          
        img:   "images/chars/other/VladsSon.png"
      },
      {
        name:  "Elizabeth Afton",
        animal:"Human",
        type:  "Other",
        color: "White",
        eyeColor: "Green",
        year:  "Unconfirmed",          
        img:   "images/chars/other/elizabeth_afton.png"
      },
    ];
