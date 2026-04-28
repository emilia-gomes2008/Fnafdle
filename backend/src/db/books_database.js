/* =======================================================
       Books Database
       =======================================================
       Fields:
         title   → book title
         series  → "Trilogy" | "Fazbear's Frights" | "Tales from the Pizzaplex" | "Other"
         year    → release year
         number  → order within the full FNaF book lineup (used for higher/lower)
         img     → cover image path
    ======================================================= */
const BOOKS = [
  // === The Silver Eyes Trilogy ===
  {
    title: "The Silver Eyes",
    series: "Trilogy",
    year: 2015,
    number: 1,
    img: "images/books/trilogy/1.png"
  },
  {
    title: "The Twisted Ones",
    series: "Trilogy",
    year: 2017,
    number: 2,
    img: "images/books/trilogy/2.png"
  },
  {
    title: "The Fourth Closet",
    series: "Trilogy",
    year: 2018,
    number: 3,
    img: "images/books/trilogy/3.png"
  },

  // === Fazbear Frights ===
  {
    title: "Into the Pit",
    series: "Fazbear's Frights",
    year: 2019,
    number: 1,
    img: "images/books/frights/1.png"
  },
  {
    title: "Fetch",
    series: "Fazbear's Frights",
    year: 2020,
    number: 2,
    img: "images/books/frights/2.png"
  },
  {
    title: "1:35AM",
    series: "Fazbear's Frights",
    year: 2020,
    number: 3,
    img: "images/books/frights/3.png"
  },
  {
    title: "Step Closer",
    series: "Fazbear's Frights",
    year: 2020,
    number: 4,
    img: "images/books/frights/4.png"
  },
  {
    title: "Bunny Call",
    series: "Fazbear's Frights",
    year: 2020,
    number: 5,
    img: "images/books/frights/5.png"
  },
  {
    title: "Blackbird",
    series: "Fazbear's Frights",
    year: 2020,
    number: 6,
    img: "images/books/frights/6.png"
  },
  {
    title: "The Cliffs",
    series: "Fazbear's Frights",
    year: 2021,
    number: 7,
    img: "images/books/frights/7.png"
  },
  {
    title: "Gumdrop Angel",
    series: "Fazbear's Frights",
    year: 2021,
    number: 8,
    img: "images/books/frights/8.png"
  },
  {
    title: "Puppet Carver",
    series: "Fazbear's Frights",
    year: 2021,
    number: 9,
    img: "images/books/frights/9.png"
  },
  {
    title: "Friendly Face",
    series: "Fazbear's Frights",
    year: 2021,
    number: 10,
    img: "images/books/frights/10.png"
  },
  {
    title: "Prankster",
    series: "Fazbear's Frights",
    year: 2021,
    number: 11,
    img: "images/books/frights/11.png"
  },
  {
    title: "Felix the Shark",
    series: "Fazbear's Frights",
    year: 2022,
    number: 12,
    img: "images/books/frights/12.png"
  },

  // === Tales from the Pizzaplex ===
  {
    title: "Lally's Game",
    series: "Tales from the Pizzaplex",
    year: 2022,
    number: 1,
    img: "images/books/tales/1.png"
  },
  {
    title: "Happs",
    series: "Tales from the Pizzaplex",
    year: 2022,
    number: 2,
    img: "images/books/tales/2.png"
  },
  {
    title: "Somniphobia",
    series: "Tales from the Pizzaplex",
    year: 2022,
    number: 3,
    img: "images/books/tales/3.png"
  },
  {
    title: "Submechanophobia",
    series: "Tales from the Pizzaplex",
    year: 2022,
    number: 4,
    img: "images/books/tales/4.png"
  },
  {
    title: "The Bobbiedots Conclusion",
    series: "Tales from the Pizzaplex",
    year: 2023,
    number: 5,
    img: "images/books/tales/5.png"
  },
  {
    title: "Nexie",
    series: "Tales from the Pizzaplex",
    year: 2023,
    number: 6,
    img: "images/books/tales/6.png"
  },
  {
    title: "Tiger Rock",
    series: "Tales from the Pizzaplex",
    year: 2023,
    number: 7,
    img: "images/books/tales/7.png"
  },
  {
    title: "B7-2",
    series: "Tales from the Pizzaplex",
    year: 2023,
    number: 8,
    img: "images/books/tales/8.png"
  },
  
  // === Graphic Novels (Frights) ===
  {
    title: "Fazbear Frights Graphic Novel Collection #1",
    series: "Fazbear Frights Graphic Novel Collection",
    year: 2022,
    number: 1,
    img: "images/books/frights/graphic_1.png"
  },
  {
    title: "Fazbear Frights Graphic Novel Collection #2",
    series: "Fazbear Frights Graphic Novel Collection",
    year: 2023,
    number: 2,
    img: "images/books/frights/graphic_2.png"
  },
  {
    title: "Fazbear Frights Graphic Novel Collection #3",
    series: "Fazbear Frights Graphic Novel Collection",
    year: 2023,
    number: 3,
    img: "images/books/frights/graphic_3.png"
  },
  {
    title: "Fazbear Frights Graphic Novel Collection #4",
    series: "Fazbear Frights Graphic Novel Collection",
    year: 2023,
    number: 4,
    img: "images/books/frights/graphic_4.png"
  },
  {
    title: "Fazbear Frights Graphic Novel Collection #5",
    series: "Fazbear Frights Graphic Novel Collection",
    year: 2024,
    number: 5,
    img: "images/books/frights/graphic_5.png"
  },
  
  // === Graphic Novels (Tales) ===
  {
    title: "Tales from the Pizzaplex Graphic Novel Collection #1",
    series: "Tales from the Pizzaplex Graphic Novel Collection",
    year: 2025,
    number: 1,
    img: "images/books/tales/graphic_1.png"
  },
  {
    title: "Tales from the Pizzaplex Graphic Novel Collection #2",
    series: "Tales from the Pizzaplex Graphic Novel Collection",
    year: 2026,
    number: 2,
    img: "images/books/tales/graphic_2.png"
  },
  {
    title: "Tales from the Pizzaplex Graphic Novel Collection #3",
    series: "Tales from the Pizzaplex Graphic Novel Collection",
    year: 2026,
    number: 3,
    img: "images/books/tales/graphic_3.png"
  },
  
  // === Interactive Novels ===
  {
    title: "VIP",
    series: "Interactive Novels",
    year: 2024,
    number: 0,
    img: "images/books/interactive/0.png"
  },
  {
    title: "The Week Before",
    series: "Interactive Novels",
    year: 2024,
    number: 1,
    img: "images/books/interactive/1.png"
  },
  {
    title: "Return to the Pit",
    series: "Interactive Novels",
    year: 2024,
    number: 2,
    img: "images/books/interactive/2.png"
  },
  {
    title: "Escape the Pizzaplex",
    series: "Interactive Novels",
    year: 2025,
    number: 3,
    img: "images/books/interactive/3.png"
  },
  
  // === Movie ===
  {
    title: "The Official Movie Novel",
    series: "Movie",
    year: 2023,
    number: 1,
    img: "images/books/movie/1.png"
  },
  {
    title: "The Official Movie Novel #2",
    series: "Movie",
    year: 2026,
    number: 2,
    img: "images/books/movie/2.png"
  },
  {
    title: "The Art and Making of the Movies",
    series: "Movie",
    year: 2026,
    number: 3,
    img: "images/books/movie/3.png"
  },
  
  // === Freddy Files ===
  {
    title: "The Freddy Files",
    series: "Freddy Files",
    year: 2017,
    number: 1,
    img: "images/books/freddy_files/1.png"
  },
  {
    title: "The Freddy Files Updated Edition",
    series: "Freddy Files",
    year: 2019,
    number: 2,
    img: "images/books/freddy_files/2.png"
  },
  {
    title: "The Ultimate Guide",
    series: "Freddy Files",
    year: 2021,
    number: 3,
    img: "images/books/freddy_files/3.png"
  },
  {
    title: "Security Breach Files",
    series: "Freddy Files",
    year: 2022,
    number: 4,
    img: "images/books/freddy_files/4.png"
  },
  {
    title: "Security Breach Files Updated Edition",
    series: "Freddy Files",
    year: 2024,
    number: 5,
    img: "images/books/freddy_files/5.png"
  },
  {
    title: "The Ultimate Guide 2.0",
    series: "Freddy Files",
    year: 2025,
    number: 6,
    img: "images/books/freddy_files/6.png"
  },
  
  // === Encyclopedia ===
  {
    title: "Character Encyclopedia",
    series: "Encyclopedia",
    year: 2023,
    number: 1,
    img: "images/books/encyclopedia/1.png"
  },
  {
    title: "Character Encyclopedia Updated and Expanded Edition",
    series: "Encyclopedia",
    year: 2026,
    number: 2,
    img: "images/books/encyclopedia/2.png"
  },
  
  // === Lore Relevant ===
  {
    title: "Survival Logbook",
    series: "Lore Relevant",
    year: 2017,
    number: 1,
    img: "images/books/survival_logbook.png"
  },
  {
    title: "The Official Five Nights at Freddy's Cookbook",
    series: "Lore Relevant",
    year: 2023,
    number: 2,
    img: "images/books/cookbook.png"
  },
];
