# FNAFdle Reborn

A browser-based guessing game collection set in the Five Nights at Freddy's universe. Inspired by Wordle, FNAFdle Reborn offers multiple game modes - from daily challenges to a fully simulated security office, a 2-player deduction battle, and a Mario Party-style online board game.

No build tools. No install. Open `index.html` and play!

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
A Mario Party-inspired online board game for 2-6 players, powered by Supabase real-time.

**Setup:** Create a room, choose a map and number of laps, then each player picks and confirms a character. The first player is chosen randomly.

**Goal:** Complete the set number of laps. Every 10 coins = 1 pizza automatically on each lap pass. Most pizzas at the end wins; ties broken by coins, then a sudden-death minigame.

**Maps:** Easy (20 spaces), Normal (46 spaces, split paths), Jackpot (39 spaces, minigame every lap), Hard (58 spaces, 3 tollbooths, Freddy-zone danger).

**Space types:**
| Space | Effect |
|-------|--------|
| 🪙 Yellow | +2 coins |
| 🍕 Green | Buy 1 pizza for 10 coins |
| 💀 Red | −3 coins |
| 🎮 Orange | Minigame for all players |
| ❓ Purple | Random FNAF event |
| ⚔️ Blue | Challenge: 1v all |
| 🐻 Tollbooth | Pay coins → shortcut, or take the free (longer) path. Price rises per visit! |
| 💰 Jackpot | Growing coin pool - claim it first! |

**Characters** (7 total, each with a unique ability):
| Character | Ability | Cooldown |
|-----------|---------|----------|
| 🐻 Freddy | Take tollbooth Path A for free | 3 turns |
| 🎸 Bonnie | Jump exactly 4 spaces | 3 turns |
| 🐔 Chica | Throw Cupcake - steal 5 coins from a nearby player | 3 turns |
| 🦊 Foxy | Re-roll after seeing the first result | 2 turns |
| 🎀 Mangle | Shuffle all non-locked board spaces | 5 turns |
| 🎭 Puppet | Convert 10 coins → 1 pizza for any nearby player | 5 turns |
| 🪤 Springtrap | Send a nearby player back to start | 5 turns |

**Dice shop** (buy with coins mid-game): each character has a character-specific die plus generic options (2d6, All-Ones, Lucky 7, Pick-Your-Steps).

**Minigames** (7 total, played simultaneously on each device):
| Minigame | Description |
|----------|-------------|
| 👃 Helpy Boop | Tap Helpy's nose as many times as possible - 30s |
| 💰 Money Laundering | Drag coins to Rockstar Freddy - most deposited in 30s wins |
| 🍕 Feeding Frenzy | Follow Chica's recipe in order; wrong ingredient = penalty - race to finish |
| 🎸 Guitar Finder | Find Bonnie's guitar in a 4×4 grid as fast as possible |
| 🔦 Power Out | Close the door before Freddy lunges - random timing |
| 🔦 Flashlight | Tap as fast as you can for 15s. Watch for Withered Foxy... |
| 🍕 Pizza Dough | Draw the most perfect circle in 5 seconds |

**Minigame rewards:** winner gains coins (1-3 random, doubled in the second half). No coins lost for losing. Ties split the reward equally.

**Random events** on ❓ spaces: coin bonuses/penalties, forced movement, losing a pizza, board reshuffles, and more.

Rematch requires all players to agree; players who opt out are dropped and slots compacted.

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
