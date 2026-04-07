# FNaFdle Reborn

FNaFdle Reborn is a browser-based guessing game inspired by Wordle and the Five Nights at Freddy's universe. The goal is to guess the secret animatronic by name using hints for the character, animal type, variant, color, and year.

## How to Play

1. Open `fnafdle.html` in your web browser.
2. Type the name of an animatronic in the search box.
3. Select a suggestion from the dropdown.
4. The game will reveal which fields match the target character.
5. You have 6 tries to guess the correct animatronic.

## Files

- `fnafdle.html` — main game page.
- `style.css` — styles and layout for the game.
- `script.js` — game logic, search dropdown, guessing, and result handling.
- `fonts/` — custom font assets used in the game.
- `images/` — character and title artwork used by the UI.

## Features

- Searchable animatronic list with live dropdown suggestions.
- Color-coded guess feedback for each attribute.
- Image thumbnails for characters when available.
- Retry button to start a new game.

## Notes

- The game is static and works locally without a server.
- Add or update characters in `script.js` under the `CHARS` array.
- Use `images/chars/` for animatronic images referenced by the data.

## License

This is a personal project but any help is welcome just don't steal it.