# FNAFdle Reborn

A browser-based FNAF guessing game collection inspired by Wordle and the Five Nights at Freddy's universe. Multiple game modes, all running locally without a server.

---

## Modes

### Endless / Daily (Classic)
Guess the secret animatronic using attribute clues — animal type, variant, color, eye color, and year. Each guess reveals which fields match (green), partially match (yellow), or are wrong (red). Year hints show ↑/↓ arrows when wrong. 6 tries in Endless, 7 in Daily (same animatronic for everyone each day).

### Image
A blurred and zoomed image of a random animatronic is revealed progressively with each wrong guess. 6 tries.

### Extreme
A full FNAF security office simulation across 6 progressive nights:
- **Animatronics patrol** 9 cameras with AI-based movement (roll 1–20 every 10 s; if roll ≤ AI level, the entity advances toward the office).
- **3 guesses** to identify the target on camera. No year arrows. Colors are correct/wrong only (no partial).
- **1 field is corrupted** (hidden, shown as `???`) — usually the animal type.
- **Real-time clock**: each night lasts **4 minutes 30 seconds** (270 s total). Each in-game hour = 45 s. If you don't identify the animatronic by **6 AM**, you die.
- **Door mechanic**: close the door to block animatronics entering the office, but it drains battery faster the longer it stays closed.
- **Battery**: drains passively and when entities move. Reaching 0% triggers a jumpscare.
- Completing a night unlocks the next. Progress is saved in localStorage.

| Night | Animatronics | AI levels | Notes |
|-------|-------------|-----------|-------|
| 1 | 1 | 4 | Tutorial |
| 2 | 2 | 8 / 6 | |
| 3 | 3 | 11 / 9 / 7 | |
| 4 | 4 | 14 / 12 / 10 / 8 | |
| 5 | 5 | 17 / 15 / 13 / 11 / 9 | Max difficulty |
| 6 ⚠️ | **6** | **20 / 20 / 20 / 20 / 20 / 20** | **2 corrupted fields · 2× power drain** · Extra night |

### Quote Guesser
A quote from the FNAF universe is displayed. Guess which character said it using the character dropdown. Only characters with quotes in the database appear as options. 6 tries.

### Books / Books Daily
Guess the FNaF novel by series, year, and edition number. Works like Classic mode.

### Who is this? (Encyclopedia)
Browse and search all animatronics in the database. Tap any card for full details.

---

## How to Play

1. Open `index.html` in a web browser (no server needed — all files are local).
2. Choose a mode from the menu.
3. Use the search dropdown to pick an animatronic (or character, for Quote mode).
4. Read the color-coded feedback and narrow down your guess.
5. Try to identify the target within the allowed number of attempts.

### Keyboard shortcuts (all dropdowns)
| Key | Action |
|-----|--------|
| ↑ / ↓ | Navigate dropdown items |
| Tab | Select first item (if none highlighted) or submit highlighted item |
| Enter | Submit highlighted item |
| Escape | Close dropdown |

---

## Project Structure

```
FnafdleReborn/
├── index.html                        ← Mode selection menu
├── README.md
├── backend/
│   └── src/db/
│       ├── database.js               ← CHARS array (all animatronics)
│       ├── books_database.js         ← BOOKS array (FNaF novels)
│       └── quotes.js                 ← QUOTES array (character quotes)
└── frontend/dist/
    ├── pages/
    │   ├── classic.html              ← Endless / Daily mode
    │   ├── image.html                ← Image mode
    │   ├── extreme.html              ← Extreme mode (Night 1–6)
    │   ├── book.html                 ← Books mode
    │   ├── encyclopedia.html         ← Who is this? browser
    │   └── quote.html                ← Quote Guesser mode
    └── assets/
        ├── css/
        │   ├── global.css            ← Shared variables, buttons, dropdown, cells
        │   ├── classic.css           ← Classic mode table styles
        │   ├── extreme.css           ← Extreme mode office UI + mobile layout
        │   ├── book.css
        │   ├── image.css
        │   ├── encyclopedia.css
        │   ├── menu.css
        │   └── quote.css             ← Quote Guesser styles
        ├── js/
        │   ├── core.js               ← Shared helpers (daily seed, stats, jumpscare, colors)
        │   ├── classic.js
        │   ├── extreme.js
        │   ├── image.js
        │   ├── book.js
        │   ├── encyclopedia.js
        │   └── quote.js              ← Quote Guesser logic
        ├── images/                   ← Animatronic artwork, title, jumpscare
        └── fonts/
```

---

## Adding Characters

Edit `backend/src/db/database.js` and add an entry to the `CHARS` array:

```js
{
  name:     "Character Name",
  animal:   "Bear",           // Bear, Rabbit, Fox, Chicken, Humanoid, ...
  type:     "Classic",        // Classic, Toy, Withered, Nightmare, Glamrock, ...
  color:    ["Brown"],        // array of color strings
  eyeColor: ["Blue"],
  year:     1993,             // number or "Unconfirmed"
  img:      "images/chars/classic/example.png"
}
```

## Adding Quotes

Edit `backend/src/db/quotes.js` and add an entry to the `QUOTES` array. The `said` field must **exactly match** a `name` in `CHARS` for it to appear in Quote Guesser mode:

```js
{ quote: "Your quote here.", said: "Character Name" }
```

---

## Technical Notes

- All game state is stored in `localStorage` (daily lock, night progress, stats).
- No build system, no dependencies — open `index.html` directly in any modern browser.
- Character images use relative paths from the `pages/` subdirectory (`../assets/...`).
- The daily seed is computed from the current date so all players get the same target.

## License

Personal project — all rights reserved. Help and contributions welcome; please don't redistribute without permission.
