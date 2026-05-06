/* =======================================================
       Mode Management
======================================================= */
let currentMode = null; // 'daily' | 'endless' | 'image' | 'book_daily' | 'book_endless' | 'encyclopedia'

function goHome() {
  document.getElementById('mode-select-screen').style.display = '';
  document.getElementById('classic-screen').style.display = 'none';
  document.getElementById('image-screen').style.display = 'none';
  document.getElementById('book-screen').style.display = 'none';
  document.getElementById('encyclopedia-screen').style.display = 'none';
  currentMode = null;
}

function startMode(mode) {
  currentMode = mode;
  document.getElementById('mode-select-screen').style.display = 'none';

  if (mode === 'image') {
    document.getElementById('image-screen').style.display = '';
    initImageMode();
  } else if (mode === 'book_daily' || mode === 'book_endless') {
    document.getElementById('book-screen').style.display = '';
    document.getElementById('book-mode-badge').textContent =
      mode === 'book_daily' ? '📅 Books Daily' : '♾️ Books Endless';
    initBookGame(mode);
  } else if (mode === 'encyclopedia') {
    document.getElementById('encyclopedia-screen').style.display = '';
    initEncyclopedia();
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
  else if (currentMode === 'image') initImageMode();
  else if (currentMode === 'book_daily') initBookGame('book_daily');
  else if (currentMode === 'book_endless') initBookGame('book_endless');
}

/* =======================================================
       Daily seed helper
======================================================= */
function getDailyIndex() {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  let h = seed ^ 0xdeadbeef;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h ^= h >>> 16;
  return Math.abs(h) % CHARS.length;
}

function getDailyBookIndex() {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate() + 7777;
  let h = seed ^ 0xdeadbeef;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h ^= h >>> 16;
  return Math.abs(h) % BOOKS.length;
}

/* =======================================================
       Daily lock (localStorage)
======================================================= */
function getDailyKey() {
  const now = new Date();
  return `fnaf_daily_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
}

function getDailyBookKey() {
  const now = new Date();
  return `fnaf_book_daily_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
}

function getDailyResult() {
  try { return JSON.parse(localStorage.getItem(getDailyKey())); } catch { return null; }
}

function getDailyBookResult() {
  try { return JSON.parse(localStorage.getItem(getDailyBookKey())); } catch { return null; }
}

function saveDailyResult(won, targetName, guessCount) {
  localStorage.setItem(getDailyKey(), JSON.stringify({ won, targetName, guessCount }));
  updateStats('animatronic', won, guessCount);
}

function saveDailyBookResult(won, targetTitle, guessCount) {
  localStorage.setItem(getDailyBookKey(), JSON.stringify({ won, targetTitle, guessCount }));
  updateStats('book', won, guessCount);
}

/* =======================================================
       Stats & Streak
======================================================= */
function getStats(key) {
  try {
    return JSON.parse(localStorage.getItem('fnaf_stats_' + key)) || {
      played: 0, won: 0, streak: 0, maxStreak: 0, lastWonDate: null,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 }
    };
  } catch {
    return { played: 0, won: 0, streak: 0, maxStreak: 0, lastWonDate: null,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 } };
  }
}

function saveStats(key, stats) {
  localStorage.setItem('fnaf_stats_' + key, JSON.stringify(stats));
}

function getTodayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function updateStats(key, won, guessCount) {
  const stats = getStats(key);
  stats.played++;
  const today = getTodayStr();
  if (won) {
    stats.won++;
    if (stats.lastWonDate === getYesterdayStr()) {
      stats.streak++;
    } else if (stats.lastWonDate !== today) {
      stats.streak = 1;
    }
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
    stats.lastWonDate = today;
    const bin = Math.min(guessCount, 7);
    stats.distribution[bin] = (stats.distribution[bin] || 0) + 1;
  } else {
    if (stats.lastWonDate !== today) stats.streak = 0;
  }
  saveStats(key, stats);
}

function showStatsModal(key) {
  const stats = getStats(key);
  const winPct = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const maxDist = Math.max(...Object.values(stats.distribution), 1);
  const label = key === 'animatronic' ? 'Animatronic' : 'Books';

  let distHTML = '';
  for (let i = 1; i <= 7; i++) {
    const val = stats.distribution[i] || 0;
    const pct = Math.round((val / maxDist) * 100);
    distHTML += `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">
        <span style="min-width:14px;font-size:0.8rem;color:var(--text-muted)">${i}</span>
        <div style="flex:1;background:var(--bg-page);border-radius:4px;height:22px;position:relative;">
          <div style="width:${pct}%;background:var(--gold);height:100%;border-radius:4px;min-width:${val > 0 ? '24px' : '0'};transition:width 0.4s;"></div>
          <span style="position:absolute;right:6px;top:50%;transform:translateY(-50%);font-size:0.75rem;color:var(--text)">${val}</span>
        </div>
      </div>`;
  }

  const modal = document.createElement('div');
  modal.id = 'stats-modal-overlay';
  modal.style.cssText = `position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;padding:1rem;`;
  modal.innerHTML = `
    <div style="background:var(--bg-card);border:1.5px solid var(--gold);border-radius:14px;padding:28px 24px;max-width:380px;width:100%;position:relative;">
      <button onclick="document.getElementById('stats-modal-overlay').remove()" style="position:absolute;top:10px;right:14px;background:transparent;border:none;color:var(--text-muted);font-size:1.3rem;padding:0;margin:0;cursor:pointer;">✕</button>
      <div style="font-family:'Creepster',cursive;font-size:1.5rem;color:var(--gold);letter-spacing:3px;text-align:center;margin-bottom:18px;">📊 ${label} Stats</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;margin-bottom:22px;">
        <div><div style="font-size:1.8rem;font-family:'Oswald',sans-serif;color:var(--text)">${stats.played}</div><div style="font-size:0.65rem;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;">Played</div></div>
        <div><div style="font-size:1.8rem;font-family:'Oswald',sans-serif;color:var(--text)">${winPct}%</div><div style="font-size:0.65rem;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;">Win %</div></div>
        <div><div style="font-size:1.8rem;font-family:'Oswald',sans-serif;color:var(--gold)">${stats.streak}🔥</div><div style="font-size:0.65rem;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;">Streak</div></div>
        <div><div style="font-size:1.8rem;font-family:'Oswald',sans-serif;color:var(--text)">${stats.maxStreak}</div><div style="font-size:0.65rem;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;">Best</div></div>
      </div>
      <div style="font-size:0.72rem;letter-spacing:2px;color:var(--text-muted);text-transform:uppercase;margin-bottom:10px;">Guess Distribution</div>
      ${distHTML}
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
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

    const previous = getDailyResult();
    if (previous) {
      guesses = [];
      gameOver = true;
      document.getElementById('guesses-container').innerHTML = '';
      input.disabled = true;
      document.getElementById('search-area').style.display = 'none';
      document.getElementById('hint-area').style.display = 'none';
      document.getElementById('attempts-left').textContent = '';

      const banner = document.getElementById('result-banner');
      banner.classList.remove('lose');
      banner.classList.add('show');
      if (!previous.won) banner.classList.add('lose');
      document.getElementById('play-again-btn').style.display = 'none';
      document.getElementById('result-title').textContent = previous.won ? '🎉 Already played today!' : '💀 Already played today!';
      document.getElementById('result-msg').textContent = previous.won
        ? `It was ${previous.targetName}! Got it in ${previous.guessCount} tries.`
        : `It was ${previous.targetName}. Try again tomorrow!`;
      return;
    }
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
  red: '#e05555', blue: '#5580e0', yellow: '#e0c935', green: '#3db55a',
  purple: '#8b55e0', pink: '#e055a8', white: '#e8e8e8', black: '#333',
  grey: '#888', gray: '#888', brown: '#8b5e3c', orange: '#e07830',
  magenta: '#cc44aa', silver: '#aaa', beige: '#d4b896',
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
      if (f.key === 'year' && matchClass !== 'correct') {
        const gYear = Number(char[f.key]);
        const tYear = Number(target[f.key]);
        if (!isNaN(gYear) && !isNaN(tYear) && char[f.key] != null && target[f.key] != null) {
          label.textContent = char[f.key] + (gYear < tYear ? ' ↑' : ' ↓');
        } else {
          label.textContent = char[f.key];
        }
      } else {
        label.textContent = char[f.key];
      }
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

  const wrongCount = guesses.filter(g => g.name !== target.name).length;
  if (wrongCount > 0 && wrongCount % 3 === 0 && !hintUsed) {
    document.getElementById('hint-area').style.display = '';
  }

  if (char.name === target.name) endGame(true);
  else if (guesses.length >= MAX_GUESSES) {
    if (currentMode === 'daily') {
      triggerFreddyJumpscare(() => endGame(false));
    } else {
      endGame(false);
    }
  }

  updateAttemptsLeft();
}

function triggerFreddyJumpscare(callback) {
  const overlay = document.createElement('div');
  overlay.id = 'freddy-jumpscare';
  overlay.style.cssText = `position:fixed;inset:0;z-index:99999;background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;`;

  const gif = document.createElement('img');
  gif.src = 'images/jumpscare/freddy.gif';
  gif.alt = 'FREDDY';
  gif.style.cssText = `max-width:100vw;max-height:100vh;width:100%;height:100%;object-fit:cover;animation:freddyPop 0.08s ease-out;`;

  if (!document.getElementById('freddy-keyframes')) {
    const style = document.createElement('style');
    style.id = 'freddy-keyframes';
    style.textContent = `@keyframes freddyPop{0%{transform:scale(0.4);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1);opacity:1}}`;
    document.head.appendChild(style);
  }

  overlay.appendChild(gif);
  document.body.appendChild(overlay);

  try { const a = new Audio('images/jumpscare/jumpscare.mp3'); a.volume = 1.0; a.play(); } catch(e) {}

  const dismiss = () => {
    if (document.body.contains(overlay)) document.body.removeChild(overlay);
    callback();
  };
  overlay.addEventListener('click', dismiss);
  setTimeout(dismiss, 2000);
}

function endGame(won) {
  gameOver = true;
  input.disabled = true;
  document.getElementById('search-area').style.display = 'none';
  document.getElementById('hint-area').style.display = 'none';

  if (currentMode === 'daily') {
    saveDailyResult(won, target.name, guesses.length);
  }

  const banner = document.getElementById('result-banner');
  banner.classList.add('show');
  if (!won) banner.classList.add('lose');

  document.getElementById('play-again-btn').style.display = currentMode === 'daily' ? 'none' : '';
  document.getElementById('result-title').textContent = won ? '🎉 Got it!' : '💀 Game Over';
  document.getElementById('result-msg').textContent = won
    ? `It was ${target.name}! You guessed it in ${guesses.length} tries.`
    : `It was ${target.name}. Better luck next time!`;

  if (currentMode === 'daily') {
    const statsBtn = document.createElement('button');
    statsBtn.textContent = '📊 Stats';
    statsBtn.style.cssText = 'margin-left:10px;background:var(--bg-cell);border:1px solid var(--border);';
    statsBtn.onclick = () => showStatsModal('animatronic');
    banner.appendChild(statsBtn);
  }
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
    case 'ArrowDown': e.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, items.length - 1); break;
    case 'ArrowUp': e.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, 0); break;
    case 'Enter': case 'Tab':
      if (selectedIndex >= 0) { items[selectedIndex].click(); e.preventDefault(); } break;
    case 'Escape': dropdown.style.display = 'none'; selectedIndex = -1; break;
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
const CHARS_WITH_IMG = CHARS.filter(c => c.img);

let imgTarget, imgGuesses, imgGameOver;
const IMG_MAX_GUESSES = 6;
let imgSelectedIndex = -1;
let imgHintUsed = false;

const IMG_STEPS = [
  { blur: 18, scale: 2.4, grayscale: 1 },
  { blur: 14, scale: 2.1, grayscale: 1 },
  { blur: 10, scale: 1.8, grayscale: 1 },
  { blur: 6,  scale: 1.5, grayscale: 0.7 },
  { blur: 3,  scale: 1.25, grayscale: 0.4 },
  { blur: 1,  scale: 1.08, grayscale: 0.15 },
  { blur: 0,  scale: 1,   grayscale: 0 },
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
  const step = IMG_STEPS[Math.min(wrongCount, IMG_STEPS.length - 1)];
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
  document.getElementById('img-hint-text').textContent = `First letter: ${imgTarget.name[0].toUpperCase()}`;
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
    case 'ArrowDown': e.preventDefault(); imgSelectedIndex = Math.min(imgSelectedIndex + 1, items.length - 1); break;
    case 'ArrowUp': e.preventDefault(); imgSelectedIndex = Math.max(imgSelectedIndex - 1, 0); break;
    case 'Enter': case 'Tab':
      if (imgSelectedIndex >= 0) { items[imgSelectedIndex].click(); e.preventDefault(); } break;
    case 'Escape': imgDropdown.style.display = 'none'; imgSelectedIndex = -1; break;
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

/* =======================================================
       BOOK MODE
======================================================= */
let bookTarget, bookGuesses, bookGameOver;
let BOOK_MAX_GUESSES = 6;
let bookSelectedIndex = -1;

const bookInput = document.getElementById('book-search-input');
const bookDropdown = document.getElementById('book-dropdown');

function initBookGame(mode) {
  if (mode === 'book_daily') {
    BOOK_MAX_GUESSES = 7;
    bookTarget = BOOKS[getDailyBookIndex()];

    const previous = getDailyBookResult();
    if (previous) {
      bookGuesses = [];
      bookGameOver = true;
      document.getElementById('book-guesses-container').innerHTML = '';
      bookInput.disabled = true;
      document.getElementById('book-search-area').style.display = 'none';
      document.getElementById('book-attempts-left').textContent = '';

      const banner = document.getElementById('book-result-banner');
      banner.classList.remove('lose');
      banner.classList.add('show');
      if (!previous.won) banner.classList.add('lose');
      document.getElementById('book-play-again-btn').style.display = 'none';
      document.getElementById('book-result-title').textContent = previous.won ? '🎉 Already played today!' : '💀 Already played today!';
      document.getElementById('book-result-msg').textContent = previous.won
        ? `It was "${previous.targetTitle}"! Got it in ${previous.guessCount} tries.`
        : `It was "${previous.targetTitle}". Try again tomorrow!`;
      return;
    }
  } else {
    BOOK_MAX_GUESSES = 6;
    bookTarget = BOOKS[Math.floor(Math.random() * BOOKS.length)];
  }

  bookGuesses = [];
  bookGameOver = false;
  bookSelectedIndex = -1;

  document.getElementById('book-guesses-container').innerHTML = '';
  const banner = document.getElementById('book-result-banner');
  banner.classList.remove('show', 'lose');
  bookInput.disabled = false;
  bookInput.value = '';
  bookInput.placeholder = 'Write a book title...';
  document.getElementById('book-search-area').style.display = '';
  bookDropdown.style.display = 'none';

  updateBookAttemptsLeft();
}

function updateBookAttemptsLeft() {
  const el = document.getElementById('book-attempts-left');
  const remaining = BOOK_MAX_GUESSES - bookGuesses.length;
  el.textContent = bookGameOver ? '' : `Tries left: ${remaining}`;
}

function renderBookGuess(book) {
  const row = document.createElement('div');
  row.className = 'book-guess-row';

  // Cover image cell
  const imgCell = document.createElement('div');
  imgCell.className = 'cell book-cover-cell';
  if (book.img) {
    const img = document.createElement('img');
    img.src = book.img;
    img.alt = book.title;
    img.style.cssText = 'width:48px;height:64px;object-fit:cover;border-radius:4px;display:block;';
    img.onerror = () => { img.style.display = 'none'; };
    imgCell.appendChild(img);
  } else {
    imgCell.textContent = '📖';
    imgCell.style.fontSize = '1.5rem';
  }
  row.appendChild(imgCell);

  const fields = [
    { key: 'title' },
    { key: 'series' },
    { key: 'year' },
    { key: 'number' },
  ];

  fields.forEach(f => {
    const cell = document.createElement('div');
    cell.className = 'cell';

    const isNum = f.key === 'number' || f.key === 'year';
    const matchClass = book[f.key] === bookTarget[f.key] ? 'correct' : 'wrong';
    cell.classList.add(matchClass);

    const label = document.createElement('div');
    label.className = 'cell-label';

    if (isNum && matchClass !== 'correct') {
      const gVal = Number(book[f.key]);
      const tVal = Number(bookTarget[f.key]);
      label.textContent = book[f.key] + (gVal < tVal ? ' ↑' : ' ↓');
    } else {
      label.textContent = f.key === 'number' ? `#${book[f.key]}` : book[f.key];
    }

    cell.appendChild(label);
    row.appendChild(cell);
  });

  document.getElementById('book-guesses-container').prepend(row);
}

function submitBookGuess(book) {
  if (bookGameOver) return;

  if (bookGuesses.some(g => g.title === book.title)) {
    bookInput.placeholder = 'You tried that already!';
    bookInput.value = '';
    bookDropdown.style.display = 'none';
    return;
  }

  bookGuesses.push(book);
  renderBookGuess(book);
  bookInput.value = '';
  bookDropdown.style.display = 'none';
  bookSelectedIndex = -1;

  if (book.title === bookTarget.title) endBookGame(true);
  else if (bookGuesses.length >= BOOK_MAX_GUESSES) {
    if (currentMode === 'book_daily') {
      triggerFreddyJumpscare(() => endBookGame(false));
    } else {
      endBookGame(false);
    }
  }

  updateBookAttemptsLeft();
}

function endBookGame(won) {
  bookGameOver = true;
  bookInput.disabled = true;
  document.getElementById('book-search-area').style.display = 'none';

  if (currentMode === 'book_daily') {
    saveDailyBookResult(won, bookTarget.title, bookGuesses.length);
  }

  const banner = document.getElementById('book-result-banner');
  banner.classList.add('show');
  if (!won) banner.classList.add('lose');

  document.getElementById('book-play-again-btn').style.display = currentMode === 'book_daily' ? 'none' : '';
  document.getElementById('book-result-title').textContent = won ? '🎉 Got it!' : '💀 Game Over';
  document.getElementById('book-result-msg').textContent = won
    ? `It was "${bookTarget.title}"! Guessed in ${bookGuesses.length} tries.`
    : `It was "${bookTarget.title}". Better luck next time!`;

  if (currentMode === 'book_daily') {
    const statsBtn = document.createElement('button');
    statsBtn.textContent = '📊 Stats';
    statsBtn.style.cssText = 'margin-left:10px;background:var(--bg-cell);border:1px solid var(--border);';
    statsBtn.onclick = () => showStatsModal('book');
    banner.appendChild(statsBtn);
  }
}

function renderBookDropdown() {
  const q = bookInput.value.trim().toLowerCase();
  const filtered = BOOKS.filter(b =>
    (q === '' || b.title.toLowerCase().includes(q)) &&
    !bookGuesses.some(g => g.title === b.title)
  );

  if (!filtered.length) { bookDropdown.style.display = 'none'; return; }

  bookDropdown.innerHTML = '';
  filtered.forEach(book => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.tabIndex = -1;

    if (book.img) {
      const img = document.createElement('img');
      img.src = book.img;
      img.alt = book.title;
      img.style.cssText = 'width:32px;height:44px;object-fit:cover;border-radius:3px;flex-shrink:0;';
      item.appendChild(img);
    } else {
      const icon = document.createElement('span');
      icon.textContent = '📖';
      icon.style.cssText = 'font-size:1.3rem;flex-shrink:0;';
      item.appendChild(icon);
    }

    const span = document.createElement('span');
    span.textContent = `${book.title} (${book.series}, ${book.year})`;
    item.appendChild(span);

    item.addEventListener('click', () => submitBookGuess(book));
    bookDropdown.appendChild(item);
  });

  bookDropdown.style.display = 'block';
  bookSelectedIndex = -1;
}

bookInput.addEventListener('focus', renderBookDropdown);
bookInput.addEventListener('input', renderBookDropdown);

bookInput.addEventListener('keydown', e => {
  const items = Array.from(bookDropdown.querySelectorAll('.dropdown-item'));
  if (!items.length) return;
  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); bookSelectedIndex = Math.min(bookSelectedIndex + 1, items.length - 1); break;
    case 'ArrowUp': e.preventDefault(); bookSelectedIndex = Math.max(bookSelectedIndex - 1, 0); break;
    case 'Enter': case 'Tab':
      if (bookSelectedIndex >= 0) { items[bookSelectedIndex].click(); e.preventDefault(); } break;
    case 'Escape': bookDropdown.style.display = 'none'; bookSelectedIndex = -1; break;
  }
  items.forEach((el, i) => el.classList.toggle('selected', i === bookSelectedIndex));
  if (bookSelectedIndex >= 0) items[bookSelectedIndex].scrollIntoView({ block: 'nearest' });
});

/* =======================================================
       ENCYCLOPEDIA MODE
======================================================= */
function initEncyclopedia() {
  document.getElementById('enc-search').value = '';
  document.getElementById('enc-type-filter').value = '';
  renderEncyclopedia();
}

function renderEncyclopedia() {
  const q = document.getElementById('enc-search').value.trim().toLowerCase();
  const typeF = document.getElementById('enc-type-filter').value.toLowerCase();

  const filtered = CHARS.filter(c =>
    (!q || c.name.toLowerCase().includes(q)) &&
    (!typeF || String(c.type).toLowerCase() === typeF)
  );

  const grid = document.getElementById('enc-grid');
  grid.innerHTML = '';

  filtered.forEach(char => {
    const card = document.createElement('div');
    card.className = 'enc-card';
    card.onclick = () => showEncCard(char);

    if (char.img) {
      const img = document.createElement('img');
      img.src = char.img;
      img.alt = char.name;
      img.onerror = () => { img.style.display = 'none'; };
      card.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'enc-card-placeholder';
      ph.textContent = '?';
      card.appendChild(ph);
    }

    const name = document.createElement('div');
    name.className = 'enc-card-name';
    name.textContent = char.name;
    card.appendChild(name);

    const type = document.createElement('div');
    type.className = 'enc-card-type';
    type.textContent = char.type;
    card.appendChild(type);

    grid.appendChild(card);
  });

  // Books section — only when type filter is not active
  if (!typeF) {
    const filteredBooks = BOOKS.filter(b =>
      !q || b.title.toLowerCase().includes(q) || b.series.toLowerCase().includes(q)
    );

    if (filteredBooks.length > 0) {
      const divider = document.createElement('div');
      divider.style.cssText = 'grid-column:1/-1;text-align:center;padding:1.2rem 0 0.6rem;color:var(--gold);font-family:\'Creepster\',cursive;font-size:1.1rem;letter-spacing:3px;border-top:1px solid var(--border);margin-top:0.8rem;';
      divider.textContent = '📚 Books';
      grid.appendChild(divider);

      filteredBooks.forEach(book => {
        const card = document.createElement('div');
        card.className = 'enc-card';
        card.onclick = () => showEncBookCard(book);

        if (book.img) {
          const img = document.createElement('img');
          img.src = book.img;
          img.alt = book.title;
          img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
          img.onerror = () => { img.style.display = 'none'; };
          card.appendChild(img);
        } else {
          const ph = document.createElement('div');
          ph.className = 'enc-card-placeholder';
          ph.textContent = '📖';
          card.appendChild(ph);
        }

        const name = document.createElement('div');
        name.className = 'enc-card-name';
        name.textContent = book.title;
        card.appendChild(name);

        const type = document.createElement('div');
        type.className = 'enc-card-type';
        type.textContent = book.series;
        card.appendChild(type);

        grid.appendChild(card);
      });
    }

    if (filtered.length === 0 && filteredBooks.length === 0) {
      grid.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:2rem;letter-spacing:2px;font-size:0.8rem;grid-column:1/-1;">No results found.</div>';
    }
  } else if (filtered.length === 0) {
    grid.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:2rem;letter-spacing:2px;font-size:0.8rem;grid-column:1/-1;">No characters found.</div>';
  }
}

function showEncBookCard(book) {
  const existing = document.getElementById('enc-modal-overlay');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'enc-modal-overlay';
  modal.style.cssText = `position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.82);display:flex;align-items:center;justify-content:center;padding:1rem;`;
  modal.innerHTML = `
    <div style="background:var(--bg-card);border:1.5px solid var(--gold);border-radius:14px;padding:28px 24px;max-width:360px;width:100%;position:relative;text-align:center;">
      <button onclick="document.getElementById('enc-modal-overlay').remove()" style="position:absolute;top:10px;right:14px;background:transparent;border:none;color:var(--text-muted);font-size:1.3rem;padding:0;margin:0;cursor:pointer;">✕</button>
      ${book.img
        ? `<img src="${book.img}" alt="${book.title}" style="width:90px;height:130px;object-fit:cover;border-radius:8px;border:2px solid var(--gold);margin-bottom:14px;" onerror="this.style.display='none'">`
        : `<div style="width:90px;height:130px;border-radius:8px;border:2px solid var(--border);background:var(--bg-page);display:inline-flex;align-items:center;justify-content:center;font-size:3rem;margin-bottom:14px;">📖</div>`
      }
      <div style="font-family:'Creepster',cursive;font-size:1.4rem;color:var(--gold);letter-spacing:2px;margin-bottom:4px;">${book.title}</div>
      <div style="font-size:0.7rem;color:var(--text-muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:18px;">${book.series}</div>
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.82rem;">
        <tr style="border-bottom:1px solid var(--border);">z
          <td style="padding:7px 8px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;font-size:0.68rem;width:40%;">Year</td>
          <td style="padding:7px 8px;color:var(--text);">${book.year}</td>
        </tr>
        <tr>
          <td style="padding:7px 8px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;font-size:0.68rem;">Edition #</td>
          <td style="padding:7px 8px;color:var(--text);">#${book.number}</td>
        </tr>
      </table>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

function showEncCard(char) {
  const existing = document.getElementById('enc-modal-overlay');
  if (existing) existing.remove();

  const colors = toArr(char.color);
  const eyeColors = toArr(char.eyeColor);

  function swatchesHTML(arr) {
    return arr.map(c => {
      const hex = COLOR_HEX[c.toLowerCase()] || '#666';
      const bg = hex.startsWith('linear') ? `background-image:${hex}` : `background:${hex}`;
      return `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);${bg};margin-right:4px;vertical-align:middle;" title="${c}"></span>${c}`;
    }).join(' / ');
  }

  const modal = document.createElement('div');
  modal.id = 'enc-modal-overlay';
  modal.style.cssText = `position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.82);display:flex;align-items:center;justify-content:center;padding:1rem;`;
  modal.innerHTML = `
    <div style="background:var(--bg-card);border:1.5px solid var(--gold);border-radius:14px;padding:28px 24px;max-width:360px;width:100%;position:relative;text-align:center;">
      <button onclick="document.getElementById('enc-modal-overlay').remove()" style="position:absolute;top:10px;right:14px;background:transparent;border:none;color:var(--text-muted);font-size:1.3rem;padding:0;margin:0;cursor:pointer;">✕</button>
      ${char.img
        ? `<img src="${char.img}" alt="${char.name}" style="width:120px;height:120px;object-fit:cover;border-radius:12px;border:2px solid var(--gold);margin-bottom:14px;" onerror="this.style.display='none'">`
        : `<div style="width:120px;height:120px;border-radius:12px;border:2px solid var(--border);background:var(--bg-page);display:inline-flex;align-items:center;justify-content:center;font-size:3rem;margin-bottom:14px;">?</div>`
      }
      <div style="font-family:'Creepster',cursive;font-size:1.6rem;color:var(--gold);letter-spacing:2px;margin-bottom:4px;">${char.name}</div>
      <div style="font-size:0.7rem;color:var(--text-muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:18px;">${char.type}</div>
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.82rem;">
        <tr style="border-bottom:1px solid var(--border);">
          <td style="padding:7px 8px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;font-size:0.68rem;width:40%;">Animal</td>
          <td style="padding:7px 8px;color:var(--text);">${char.animal}</td>
        </tr>
        <tr style="border-bottom:1px solid var(--border);">
          <td style="padding:7px 8px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;font-size:0.68rem;">Color</td>
          <td style="padding:7px 8px;color:var(--text);">${swatchesHTML(colors)}</td>
        </tr>
        <tr style="border-bottom:1px solid var(--border);">
          <td style="padding:7px 8px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;font-size:0.68rem;">Eye Color</td>
          <td style="padding:7px 8px;color:var(--text);">${swatchesHTML(eyeColors)}</td>
        </tr>
        <tr>
          <td style="padding:7px 8px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;font-size:0.68rem;">Year</td>
          <td style="padding:7px 8px;color:var(--text);">${char.year}</td>
        </tr>
      </table>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

function populateEncTypeFilter() {
  const types = [...new Set(CHARS.map(c => c.type).filter(Boolean))].sort();
  const sel = document.getElementById('enc-type-filter');
  sel.innerHTML = '<option value="">All Types</option>';
  types.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    sel.appendChild(opt);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  populateEncTypeFilter();
});
