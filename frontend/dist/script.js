/* =======================================================
       Mode Management
======================================================= */
let currentMode = null; // 'daily' | 'endless' | 'image'

function goHome() {
  document.getElementById('mode-select-screen').style.display = '';
  document.getElementById('classic-screen').style.display = 'none';
  document.getElementById('image-screen').style.display = 'none';
  currentMode = null;
}

function startMode(mode) {
  currentMode = mode;
  document.getElementById('mode-select-screen').style.display = 'none';

  if (mode === 'image') {
    document.getElementById('image-screen').style.display = '';
    initImageMode();
  } else {
    document.getElementById('classic-screen').style.display = '';
    document.getElementById('classic-mode-badge').textContent =
      mode === 'daily' ? '📅 Daily' : '♾️ Endless';
    initGame(mode);
  }
}

function restartCurrent() {
  if (currentMode === 'daily') initGame('daily');
  else if (currentMode === 'endless') initGame('endless');
  else initImageMode();
}

/* =======================================================
       Daily seed helper
======================================================= */
function getDailyIndex() {
  // Deterministic index from today's date
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  // simple LCG-style hash
  let h = seed ^ 0xdeadbeef;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h ^= h >>> 16;
  return Math.abs(h) % CHARS.length;
}

/* =======================================================
       Classic Game State
======================================================= */
let target, guesses, gameOver;
let MAX_GUESSES = 6;
let selectedIndex = -1;
let hintUsed = false;

const input = document.getElementById('search-input');
const dropdown = document.getElementById('dropdown');

function initGame(mode) {
  if (mode === 'daily') {
    MAX_GUESSES = 7;
    target = CHARS[getDailyIndex()];
  } else {
    MAX_GUESSES = 6;
    target = CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  guesses = [];
  gameOver = false;
  selectedIndex = -1;
  hintUsed = false;

  document.getElementById('guesses-container').innerHTML = '';
  const banner = document.getElementById('result-banner');
  banner.classList.remove('show', 'lose');
  input.disabled = false;
  input.value = '';
  input.placeholder = 'Write an animatronic...';
  document.getElementById('search-area').style.display = '';
  dropdown.style.display = 'none';

  document.getElementById('hint-area').style.display = 'none';
  document.getElementById('hint-text').textContent = '';
  document.getElementById('hint-btn').disabled = false;
  document.getElementById('hint-btn').textContent = '💡 Use Hint (first letter)';

  updateAttemptsLeft();
}

function updateAttemptsLeft() {
  const el = document.getElementById('attempts-left');
  const remaining = MAX_GUESSES - guesses.length;
  el.textContent = gameOver ? '' : `Tries left: ${remaining}`;
}

function useHint() {
  if (hintUsed || !target) return;
  hintUsed = true;
  document.getElementById('hint-btn').disabled = true;
  document.getElementById('hint-btn').textContent = '💡 Hint used';
  document.getElementById('hint-text').textContent =
    `First letter: ${target.name[0].toUpperCase()}`;
}

/* =======================================================
       Color Comparison Helpers
======================================================= */
function toArr(val) {
  if (Array.isArray(val)) return val;
  return val !== undefined && val !== null ? [String(val)] : [];
}

function colorMatch(guessVal, targetVal) {
  const g = toArr(guessVal).map(v => v.toLowerCase());
  const t = toArr(targetVal).map(v => v.toLowerCase());
  const gSorted = [...g].sort().join(',');
  const tSorted = [...t].sort().join(',');
  if (gSorted === tSorted) return 'correct';
  if (g.some(v => t.includes(v))) return 'partial';
  return 'wrong';
}

/* =======================================================
       Color Swatches
======================================================= */
const COLOR_HEX = {
  red: '#e05555',
  blue: '#5580e0',
  yellow: '#e0c935',
  green: '#3db55a',
  purple: '#8b55e0',
  pink: '#e055a8',
  white: '#e8e8e8',
  black: '#333',
  grey: '#888',
  gray: '#888',
  brown: '#8b5e3c',
  orange: '#e07830',
  magenta: '#cc44aa',
  silver: '#aaa',
  beige: '#d4b896',
  rainbow: 'linear-gradient(90deg,#e05555,#e0c935,#3db55a,#5580e0,#8b55e0)',
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
       Renders Guess Row (Classic)
======================================================= */
function renderGuess(char) {
  const fields = [
    { key: 'name', isColor: false },
    { key: 'animal', isColor: false },
    { key: 'type', isColor: false },
    { key: 'color', isColor: true },
    { key: 'eyeColor', isColor: true },
    { key: 'year', isColor: false },
  ];

  const row = document.createElement('div');
  row.className = 'guess-row';

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
       Submit Guess (Classic)
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

  // Show hint after every 3 wrong guesses
  const wrongCount = guesses.filter(g => g.name !== target.name).length;
  if (wrongCount > 0 && wrongCount % 3 === 0 && !hintUsed) {
    document.getElementById('hint-area').style.display = '';
  }

  if (char.name === target.name) endGame(true);
  else if (guesses.length >= MAX_GUESSES) endGame(false);

  updateAttemptsLeft();
}

function endGame(won) {
  gameOver = true;
  input.disabled = true;
  document.getElementById('search-area').style.display = 'none';
  document.getElementById('hint-area').style.display = 'none';

  const banner = document.getElementById('result-banner');
  banner.classList.add('show');
  if (!won) banner.classList.add('lose');

  document.getElementById('play-again-btn').style.display =
    currentMode === 'daily' ? 'none' : '';
  document.getElementById('result-title').textContent = won ? '🎉 Got it!' : '💀 Game Over';
  document.getElementById('result-msg').textContent = won
    ? `It was ${target.name}! You guessed it in ${guesses.length} tries.`
    : `It was ${target.name}. Better luck next time!`;
}

/* =======================================================
       Dropdown (Classic)
======================================================= */
function renderDropdown() {
  const q = input.value.trim().toLowerCase();
  const filtered = CHARS.filter(c =>
    (q === '' || c.name.toLowerCase().includes(q)) &&
    !guesses.some(g => g.name === c.name)
  );

  if (!filtered.length) { dropdown.style.display = 'none'; return; }

  dropdown.innerHTML = '';
  filtered.forEach(char => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.tabIndex = -1;

    if (char.img) {
      const img = document.createElement('img');
      img.src = char.img;
      img.alt = char.name;
      item.appendChild(img);
    }
    const span = document.createElement('span');
    span.textContent = char.name;
    item.appendChild(span);

    item.addEventListener('click', () => submitGuess(char));
    dropdown.appendChild(item);
  });

  dropdown.style.display = 'block';
  selectedIndex = -1;
}

input.addEventListener('focus', renderDropdown);
input.addEventListener('input', renderDropdown);

input.addEventListener('keydown', e => {
  const items = Array.from(dropdown.querySelectorAll('.dropdown-item'));
  if (!items.length) return;
  switch (e.key) {
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
  if (selectedIndex >= 0) items[selectedIndex].scrollIntoView({ block: 'nearest' });
});

document.addEventListener('click', e => {
  if (!document.getElementById('search-area').contains(e.target)) {
    dropdown.style.display = 'none';
    selectedIndex = -1;
  }
});

/* =======================================================
       IMAGE MODE
======================================================= */

// Filter: only chars with images
const CHARS_WITH_IMG = CHARS.filter(c => c.img);

let imgTarget, imgGuesses, imgGameOver;
const IMG_MAX_GUESSES = 6;
let imgSelectedIndex = -1;
let imgHintUsed = false;

// Blur/zoom steps per wrong guess (index 0 = start, last = revealed)
// Start: heavy blur + zoom. Each wrong guess: less blur, less zoom.
const IMG_STEPS = [
  { blur: 18, scale: 2.4, grayscale: 1 },  // 0 guesses wrong
  { blur: 14, scale: 2.1, grayscale: 1 },  // 1 wrong
  { blur: 10, scale: 1.8, grayscale: 1 },  // 2 wrong
  { blur: 6, scale: 1.5, grayscale: 0.7 }, // 3 wrong
  { blur: 3, scale: 1.25, grayscale: 0.4 },// 4 wrong
  { blur: 1, scale: 1.08, grayscale: 0.15 },// 5 wrong
  { blur: 0, scale: 1, grayscale: 0 },  // revealed / won
];

const imgInput = document.getElementById('img-search-input');
const imgDropdown = document.getElementById('img-dropdown');

function initImageMode() {
  imgTarget = CHARS_WITH_IMG[Math.floor(Math.random() * CHARS_WITH_IMG.length)];
  imgGuesses = [];
  imgGameOver = false;
  imgSelectedIndex = -1;
  imgHintUsed = false;

  const img = document.getElementById('mystery-img');
  img.src = imgTarget.img;
  img.onerror = () => { img.src = ''; };

  applyImageFilter(0);

  document.getElementById('img-guesses-list').innerHTML = '';
  const banner = document.getElementById('img-result-banner');
  banner.classList.remove('show', 'lose');
  imgInput.disabled = false;
  imgInput.value = '';
  imgInput.placeholder = 'Write an animatronic...';
  document.getElementById('img-search-area').style.display = '';
  imgDropdown.style.display = 'none';

  document.getElementById('img-hint-area').style.display = 'none';
  document.getElementById('img-hint-text').textContent = '';
  document.getElementById('img-hint-btn').disabled = false;
  document.getElementById('img-hint-btn').textContent = '💡 Use Hint (first letter)';

  updateImgAttemptsLeft();
}

function applyImageFilter(wrongCount) {
  const stepIdx = Math.min(wrongCount, IMG_STEPS.length - 1);
  const step = IMG_STEPS[stepIdx];
  const img = document.getElementById('mystery-img');
  img.style.filter = `blur(${step.blur}px) grayscale(${step.grayscale})`;
  img.style.transform = `scale(${step.scale})`;
  img.style.transition = 'filter 0.6s ease, transform 0.6s ease';
}

function revealImage() {
  const step = IMG_STEPS[IMG_STEPS.length - 1];
  const img = document.getElementById('mystery-img');
  img.style.filter = `blur(${step.blur}px) grayscale(${step.grayscale})`;
  img.style.transform = `scale(${step.scale})`;
}

function updateImgAttemptsLeft() {
  const el = document.getElementById('img-attempts-left');
  const remaining = IMG_MAX_GUESSES - imgGuesses.length;
  el.textContent = imgGameOver ? '' : `Tries left: ${remaining}`;
}

function useImageHint() {
  if (imgHintUsed || !imgTarget) return;
  imgHintUsed = true;
  document.getElementById('img-hint-btn').disabled = true;
  document.getElementById('img-hint-btn').textContent = '💡 Hint used';
  document.getElementById('img-hint-text').textContent =
    `First letter: ${imgTarget.name[0].toUpperCase()}`;
}

function submitImgGuess(char) {
  if (imgGameOver) return;

  if (imgGuesses.some(g => g.name === char.name)) {
    imgInput.placeholder = 'You tried that already!';
    imgInput.value = '';
    imgDropdown.style.display = 'none';
    return;
  }

  imgGuesses.push(char);
  imgInput.value = '';
  imgDropdown.style.display = 'none';
  imgSelectedIndex = -1;

  const isCorrect = char.name === imgTarget.name;
  renderImgGuess(char, isCorrect);

  const wrongCount = imgGuesses.filter(g => g.name !== imgTarget.name).length;

  if (isCorrect) {
    revealImage();
    endImgGame(true);
  } else {
    applyImageFilter(wrongCount);

    // Show hint after every 3 wrong guesses
    if (wrongCount > 0 && wrongCount % 3 === 0 && !imgHintUsed) {
      document.getElementById('img-hint-area').style.display = '';
    }

    if (imgGuesses.length >= IMG_MAX_GUESSES) {
      revealImage();
      endImgGame(false);
    }
  }

  updateImgAttemptsLeft();
}

function renderImgGuess(char, correct) {
  const list = document.getElementById('img-guesses-list');
  const item = document.createElement('div');
  item.className = 'img-guess-item ' + (correct ? 'correct' : 'wrong');

  if (char.img) {
    const img = document.createElement('img');
    img.src = char.img;
    img.alt = char.name;
    item.appendChild(img);
  }

  const nameEl = document.createElement('span');
  nameEl.textContent = char.name;
  item.appendChild(nameEl);

  const icon = document.createElement('span');
  icon.className = 'img-guess-icon';
  icon.textContent = correct ? '✅' : '❌';
  item.appendChild(icon);

  list.prepend(item);
}

function endImgGame(won) {
  imgGameOver = true;
  imgInput.disabled = true;
  document.getElementById('img-search-area').style.display = 'none';
  document.getElementById('img-hint-area').style.display = 'none';

  const banner = document.getElementById('img-result-banner');
  banner.classList.add('show');
  if (!won) banner.classList.add('lose');

  document.getElementById('img-result-title').textContent = won ? '🎉 Got it!' : '💀 Game Over';
  document.getElementById('img-result-msg').textContent = won
    ? `It was ${imgTarget.name}! Guessed in ${imgGuesses.length} tries.`
    : `It was ${imgTarget.name}. Better luck next time!`;
}

/* Image Mode Dropdown */
function renderImgDropdown() {
  const q = imgInput.value.trim().toLowerCase();
  const filtered = CHARS_WITH_IMG.filter(c =>
    (q === '' || c.name.toLowerCase().includes(q)) &&
    !imgGuesses.some(g => g.name === c.name)
  );

  if (!filtered.length) { imgDropdown.style.display = 'none'; return; }

  imgDropdown.innerHTML = '';
  filtered.forEach(char => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.tabIndex = -1;

    const img = document.createElement('img');
    img.src = char.img;
    img.alt = char.name;
    item.appendChild(img);

    const span = document.createElement('span');
    span.textContent = char.name;
    item.appendChild(span);

    item.addEventListener('click', () => submitImgGuess(char));
    imgDropdown.appendChild(item);
  });

  imgDropdown.style.display = 'block';
  imgSelectedIndex = -1;
}

imgInput.addEventListener('focus', renderImgDropdown);
imgInput.addEventListener('input', renderImgDropdown);

imgInput.addEventListener('keydown', e => {
  const items = Array.from(imgDropdown.querySelectorAll('.dropdown-item'));
  if (!items.length) return;
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      imgSelectedIndex = Math.min(imgSelectedIndex + 1, items.length - 1);
      break;
    case 'ArrowUp':
      e.preventDefault();
      imgSelectedIndex = Math.max(imgSelectedIndex - 1, 0);
      break;
    case 'Enter':
    case 'Tab':
      if (imgSelectedIndex >= 0 && imgSelectedIndex < items.length) {
        items[imgSelectedIndex].click();
        e.preventDefault();
      }
      break;
    case 'Escape':
      imgDropdown.style.display = 'none';
      imgSelectedIndex = -1;
      break;
  }
  items.forEach((el, i) => el.classList.toggle('selected', i === imgSelectedIndex));
  if (imgSelectedIndex >= 0) items[imgSelectedIndex].scrollIntoView({ block: 'nearest' });
});

document.addEventListener('click', e => {
  if (
    !document.getElementById('img-search-area').contains(e.target) &&
    !document.getElementById('search-area').contains(e.target)
  ) {
    imgDropdown.style.display = 'none';
    dropdown.style.display = 'none';
    imgSelectedIndex = -1;
    selectedIndex = -1;
  }
});
