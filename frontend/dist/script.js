/* =======================================================
       Game State
======================================================= */
let target, guesses, gameOver;
const MAX_GUESSES = 6;
let selectedIndex = -1;

const input = document.getElementById('search-input');
const dropdown = document.getElementById('dropdown');

function initGame() {
  target   = CHARS[Math.floor(Math.random() * CHARS.length)];
  guesses  = [];
  gameOver = false;
  selectedIndex = -1;

  document.getElementById('guesses-container').innerHTML = '';
  const banner = document.getElementById('result-banner');
  banner.classList.remove('show', 'lose');
  input.disabled = false;
  input.value = '';
  input.placeholder = 'Write an animatronic...';
  document.getElementById('search-area').style.display = '';
  dropdown.style.display = 'none';

  updateAttemptsLeft();
}

function updateAttemptsLeft() {
  const el = document.getElementById('attempts-left');
  const remaining = MAX_GUESSES - guesses.length;
  el.textContent = gameOver ? '' : `Tries left: ${remaining}`;
}

/* =======================================================
       Color Comparison Helpers
======================================================= */

// Normalise to array (handles legacy string values gracefully)
function toArr(val) {
  if (Array.isArray(val)) return val;
  return val !== undefined && val !== null ? [String(val)] : [];
}

// Returns 'correct' | 'partial' | 'wrong'
function colorMatch(guessVal, targetVal) {
  const g = toArr(guessVal).map(v => v.toLowerCase());
  const t = toArr(targetVal).map(v => v.toLowerCase());

  const gSorted = [...g].sort().join(',');
  const tSorted = [...t].sort().join(',');

  if (gSorted === tSorted) return 'correct';           // exact same set
  if (g.some(v => t.includes(v))) return 'partial';   // at least one overlap
  return 'wrong';
}

/* =======================================================
       Color Swatches
======================================================= */

const COLOR_HEX = {
  red:      '#e05555',
  blue:     '#5580e0',
  yellow:   '#e0c935',
  green:    '#3db55a',
  purple:   '#8b55e0',
  pink:     '#e055a8',
  white:    '#e8e8e8',
  black:    '#333',
  grey:     '#888',
  gray:     '#888',
  brown:    '#8b5e3c',
  orange:   '#e07830',
  magenta:  '#cc44aa',
  silver:   '#aaa',
  rainbow:  'linear-gradient(90deg,#e05555,#e0c935,#3db55a,#5580e0,#8b55e0)',
  colorful: 'linear-gradient(90deg,#e05555,#e0c935,#3db55a,#5580e0)',
};

function makeSwatch(colorName) {
  const swatch = document.createElement('span');
  swatch.className = 'color-swatch';
  const key = colorName.toLowerCase();
  const fill = COLOR_HEX[key] || '#666';
  if (fill.startsWith('linear')) {
    swatch.style.backgroundImage = fill;
  } else {
    swatch.style.backgroundColor = fill;
  }
  swatch.title = colorName;
  return swatch;
}

function makeColorLabel(colors) {
  const arr = toArr(colors);
  const wrap = document.createElement('div');
  wrap.className = 'color-label';

  arr.forEach((c, i) => {
    wrap.appendChild(makeSwatch(c));
    const txt = document.createElement('span');
    txt.className = 'color-name';
    txt.textContent = c;
    wrap.appendChild(txt);
    if (i < arr.length - 1) {
      const sep = document.createElement('span');
      sep.className = 'color-sep';
      sep.textContent = '/';
      wrap.appendChild(sep);
    }
  });

  return wrap;
}

/* =======================================================
       Renders Guess Line
======================================================= */
function renderGuess(char) {
  const fields = [
    { key: 'name',     isColor: false },
    { key: 'animal',   isColor: false },
    { key: 'type',     isColor: false },
    { key: 'color',    isColor: true  },
    { key: 'eyeColor', isColor: true  },
    { key: 'year',     isColor: false },
  ];

  const row = document.createElement('div');
  row.className = 'guess-row';

  // Image cell
  const imgCell = document.createElement('div');
  imgCell.className = 'cell cell-img';

  if (char.img) {
    const img = document.createElement('img');
    img.src = char.img;
    img.alt = char.name;
    img.onerror = () => {
      imgCell.innerHTML = '';
      const ph = document.createElement('div');
      ph.className = 'placeholder-avatar';
      ph.textContent = char.emoji || '?';
      imgCell.appendChild(ph);
    };
    imgCell.appendChild(img);
  } else {
    const ph = document.createElement('div');
    ph.className = 'placeholder-avatar';
    ph.textContent = char.emoji || '?';
    imgCell.appendChild(ph);
  }

  row.appendChild(imgCell);

  fields.forEach(f => {
    const cell = document.createElement('div');
    cell.className = 'cell';

    let matchClass;
    if (f.isColor) {
      matchClass = colorMatch(char[f.key], target[f.key]);
    } else {
      matchClass = String(char[f.key]) === String(target[f.key]) ? 'correct' : 'wrong';
    }
    cell.classList.add(matchClass);

    if (f.isColor) {
      cell.appendChild(makeColorLabel(char[f.key]));
    } else {
      const label = document.createElement('div');
      label.className = 'cell-label';
      label.textContent = char[f.key];
      cell.appendChild(label);
    }

    row.appendChild(cell);
  });

  document.getElementById('guesses-container').prepend(row);
}

/* =======================================================
       Submit Guess
======================================================= */
function submitGuess(char) {
  if (gameOver) return;

  if (guesses.some(g => g.name === char.name)) {
    input.placeholder = 'You tried that already!';
    input.value = '';
    dropdown.style.display = 'none';
    return;
  }

  guesses.push(char);
  renderGuess(char);
  input.value = '';
  dropdown.style.display = 'none';
  selectedIndex = -1;

  if (char.name === target.name) endGame(true);
  else if (guesses.length >= MAX_GUESSES) endGame(false);

  updateAttemptsLeft();
}

function endGame(won) {
  gameOver = true;
  input.disabled = true;
  document.getElementById('search-area').style.display = 'none';

  const banner = document.getElementById('result-banner');
  banner.classList.add('show');
  if (!won) banner.classList.add('lose');

  document.getElementById('result-title').textContent = won ? '🎉 Got it!' : '💀 Game Over';
  document.getElementById('result-msg').textContent = won
    ? `It was ${target.name}! You guessed it in ${guesses.length} tries.`
    : `It was ${target.name}. Better luck next time!`;
}

/* =======================================================
       Dropdown Menu
======================================================= */
function renderDropdown() {
  const q = input.value.trim().toLowerCase();

  const filtered = CHARS.filter(c =>
    (q === '' || c.name.toLowerCase().includes(q)) &&
    !guesses.some(g => g.name === c.name)
  );

  if (!filtered.length) {
    dropdown.style.display = 'none';
    return;
  }

  dropdown.innerHTML = '';

  filtered.forEach(char => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.tabIndex = -1;

    if (char.img) {
      const img = document.createElement('img');
      img.src = char.img;
      img.alt = char.name;

      const span = document.createElement('span');
      span.textContent = char.name;

      item.appendChild(img);
      item.appendChild(span);
    } else {
      const span = document.createElement('span');
      span.textContent = char.name;
      item.appendChild(span);
    }

    item.addEventListener('click', () => submitGuess(char));
    dropdown.appendChild(item);
  });

  dropdown.style.display = 'block';
  selectedIndex = -1;
}

input.addEventListener('focus', renderDropdown);
input.addEventListener('input', renderDropdown);

/* Keyboard Navigation */
input.addEventListener('keydown', e => {
  const items = Array.from(dropdown.querySelectorAll('.dropdown-item'));
  if (!items.length) return;

  switch(e.key) {
    case 'ArrowDown':
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      break;
    case 'ArrowUp':
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      break;
    case 'Enter':
    case 'Tab':
      if (selectedIndex >= 0 && selectedIndex < items.length) {
        items[selectedIndex].click();
        e.preventDefault();
      }
      break;
    case 'Escape':
      dropdown.style.display = 'none';
      selectedIndex = -1;
      break;
  }

  items.forEach((el, i) => el.classList.toggle('selected', i === selectedIndex));
  if (selectedIndex >= 0 && selectedIndex < items.length) {
    items[selectedIndex].scrollIntoView({ block: 'nearest' });
  }
});

/* Close Dropdown */
document.addEventListener('click', e => {
  if (!document.getElementById('search-area').contains(e.target)) {
    dropdown.style.display = 'none';
    selectedIndex = -1;
  }
});

initGame();