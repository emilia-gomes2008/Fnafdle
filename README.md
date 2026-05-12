# FNAFdle Reborn

A browser-based guessing game collection set in the Five Nights at Freddy's universe. Inspired by Wordle, FNAFdle Reborn offers multiple game modes - from daily challenges to a fully simulated security office, a 2-player deduction battle, and a Mario Party-style online board game.

No build tools. No install. Open `index.html` and play.

---

## Game Modes

### Classic
Guess the secret animatronic using attribute clues. Each guess reveals how close you were:

| Color | Meaning |
|-------|---------|
| 🟩 Green | Exact match |
| 🟨 Yellow | Partial match (shared value in a list field) |
| 🟥 Red | No match |

Attributes checked: Animal, Type, Main Color, Eye Color, Year of origin. Year guesses also show a ↑ / ↓ arrow when wrong.

- **Endless** - 6 tries, new random animatronic every round. Win streak tracked.
- **Daily** - 7 tries, same animatronic for all players on a given day. Shareable result.

---

### Image Mode
A blurred, zoomed-in image of an animatronic is progressively revealed with each wrong guess. Identify it before it comes into focus. 6 tries. Win streak tracked.

---

### Extreme Mode
A full FNAF security office simulation split across 6 progressive nights.

- **4 minutes 30 seconds** per night - survive until 6 AM
- Animatronics move across 9 cameras autonomously - AI rolls a D20 every 10 seconds; if the roll is at or below the AI level, the entity advances
- Close the door to block them, but it drains power faster while held
- **3 guesses per night** to identify which animatronic is targeting you
- One (or more) attributes are **corrupted** and shown as `???`
- Night 6 features **6 animatronics simultaneously** with double power drain
- Progress is saved - you can continue from your last completed night

| Night | Animatronics | AI Level | Power/sec | Corrupted Fields |
|-------|-------------|----------|-----------|-----------------|
| 1 | 1 | 4 | 0.8% | 1 |
| 2 | 2 | 8 / 6 | 1.0% | 1 |
| 3 | 3 | 11 / 9 / 7 | 1.2% | 2 |
| 4 | 4 | 14 / 12 / 10 / 8 | 1.5% | 2 |
| 5 | 5 | 17 / 15 / 13 / 11 / 9 | 1.8% | 3 |
| 6 ⚠️ | **6** | **20 / 20 / 20 / 20 / 20 / 20** | **3.6%** | **3** |

---

### Quote Guesser
A quote from the FNAF universe is displayed with the speaker's name censored. Guess which character said it from the dropdown. 6 tries.

- **Endless** - new quote every round. Win streak tracked.
- **Daily** - one quote per day. Shareable result.

---

### Books
Guess the FNAF novel using attribute clues about its series, year, and edition number. Same color-coded feedback system as Classic. 6 tries.

- **Endless** - win streak tracked
- **Daily** - one book per day

---

### Encyclopedia
Browse and search all animatronics in the database with their full stats, colors, and images. Tap any card to see complete details. Not a game mode but a reference tool.

---

### Guess Who
Online 2-player mode powered by Supabase real-time.

1. One player creates a room and shares the 6-character code
2. Both players secretly pick an animatronic
3. Players take turns asking predefined questions (animal type, color, year, etc.)
4. The answerer can respond **honestly or lie** to mislead their opponent
5. After seeing the answer, the asker can **guess** the opponent's character (from the dropdown, instantly submitted) or **pass**
6. Use the elimination board on the right to mark characters as ruled out
7. First to guess correctly wins
8. Rematch requires **both players** to agree

---

### Fnafdle Party
A Mario Party-inspired online board game for 2–4 players, powered by Supabase real-time.

- **20-space board**, played over **5 laps**: first to finish triggers the end; most pizzas wins, coins break ties
- Each lap, every **10 coins** you've saved automatically convert into **1 pizza**
- **Space types:** Normal (pass through), 🪙 Coin (+2 coins), 🍕 Pizza (+1 pizza), 🎮 Minigame (triggers a minigame for all players), ❓ Event (random FNAF-themed event), landing on the same space as another player also triggers a 1v1 minigame
- **4 playable characters**, each with a unique ability on cooldown:
  - 🐻 **Freddy** - no ability
  - 🐔 **Chica** - throw her Cupcake up to 5 spaces ahead to steal 5 coins from a player (cooldown: 3 turns)
  - 🎸 **Bonnie** - jump exactly 4 spaces instead of rolling (cooldown: 3 turns)
  - 🦊 **Foxy** - re-roll the dice after seeing the first result (cooldown: 2 turns)
- **5 minigames**, all played simultaneously on each player's own device:
  - 👃 **Helpy Boop** - click Helpy's nose as many times as possible in 30 seconds
  - 💰 **Money Laundering** - drag coins to Rockstar Freddy; most deposited in 30 seconds wins
  - 🍕 **Feeding Frenzy** - follow Chica's recipe in order; wrong ingredient or timeout = 0 points and -1 pizza
  - 🎸 **Guitar Finder** - find Bonnie's guitar hidden in a 4×4 grid as fast as possible
  - 🔦 **Power Out** - close the door before Freddy attacks; random timing keeps everyone on edge
- **Minigame reward:** winner gains coins, loser loses coins (1–3, rolled randomly per minigame)
- **Random events** on ❓ spaces: coin bonuses/penalties, forced movement, losing a pizza, board reshuffles, and more - all FNAF-themed
- Rematch requires all players to agree; players who opt out are dropped and slots compacted

---

## How to Play

1. Open `index.html` in any modern browser - no server needed for most modes
2. Choose a game mode from the menu
3. Type in the search field and pick from the dropdown, or use keyboard navigation:

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate dropdown items |
| `Enter` | Submit highlighted item (or submit the typed guess if nothing is highlighted) |
| `Escape` | Close dropdown |

Daily mode results are locked per day and stored locally. Stats (win rate, current streak, best streak, guess distribution) are tracked separately per mode.

---

## Project Structure

```
FnafdleReborn/
├── index.html                    ← Main menu
├── backend/src/db/
│   ├── database.js               ← CHARS array (100+ animatronics)
│   ├── books_database.js         ← BOOKS array (FNaF novels)
│   └── quotes.js                 ← QUOTES array (character quotes)
└── frontend/dist/
    ├── pages/
    │   ├── classic.html
    │   ├── image.html
    │   ├── extreme.html
    │   ├── quote.html
    │   ├── book.html
    │   ├── encyclopedia.html
    │   ├── multiplayer.html
    │   └── party.html
    └── assets/
        ├── css/                  ← Per-mode stylesheets + global.css
        ├── js/
        │   ├── core.js           ← Shared utilities (daily seed, stats, streaks, jumpscare)
        │   ├── config.js         ← Supabase credentials (git-ignored)
        │   ├── party.js          ← Fnafdle Party board, minigames, real-time sync
        │   └── *.js              ← One file per mode
        └── images/               ← Character images, book covers, jumpscare assets
```

---

## Adding Content

### New Animatronic - `backend/src/db/database.js`
```js
{
  name:     "Character Name",
  animal:   "Bear",              // Bear, Rabbit, Fox, Chicken, Humanoid, ...
  type:     "Classic",           // Classic, Toy, Withered, Nightmare, Glamrock, ...
  color:    ["Brown"],           // array of color strings
  eyeColor: ["Blue"],
  year:     1987,                // number or "Unconfirmed"
  img:      "images/chars/type/character_name.png"
}
```

### New Quote - `backend/src/db/quotes.js`
```js
{ quote: "The quote text here.", said: "Character Name" }
```
The `said` field must exactly match a `name` in the CHARS array.

---

## Tech Stack

- **Vanilla JS / HTML / CSS** - no framework, no build step
- **Supabase** - real-time database for multiplayer rooms and events (loaded via CDN, multiplayer only)
- **localStorage** - all single-player progress, stats, and streaks
- **Google Fonts** - Creepster, Oswald
- **Custom font** - Five Fonts at Freddy's

Daily challenges use a deterministic hash of the current date, ensuring every player gets the same target.

---

## Setup Notes

**Single-player modes** work by opening `index.html` directly - no configuration needed.

**Multiplayer** requires a Supabase project. Create `frontend/dist/assets/js/config.js` (it is git-ignored):

```js
window.FNAF_CONFIG = {
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your-anon-key"
};
```

Multiplayer also requires the page to be served over HTTPS or `localhost` for the clipboard API to work.

---

*Personal project - all rights reserved. Contributions welcome; please don't redistribute without permission.*
