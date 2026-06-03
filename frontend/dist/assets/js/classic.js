/* =======================================================
       Classic Game Logic
======================================================= */

let target, guesses, gameOver;
let MAX_GUESSES = 6;
let selectedIndex = -1;
let hintUsed = false;

const input = document.getElementById('search-input');
const dropdown = document.getElementById('dropdown');

function getDailyProgressKey() {
  const now = new Date();
  return `fnaf_classic_daily_progress_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
}
function saveDailyProgress() {
  try { localStorage.setItem(getDailyProgressKey(), JSON.stringify({ guessNames: guesses.map(g => g.name), hintUsed })); } catch {}
}
function clearDailyProgress() {
  localStorage.removeItem(getDailyProgressKey());
}

function initGame(mode) {
  currentMode = mode;
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    const val = T(el.dataset.i18n);
    if (val.includes('<') && val.includes('>')) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });
  if (mode === 'daily') {
    MAX_GUESSES = 7;
    target = CHARS[getDailyIndex()];
    document.getElementById('classic-mode-badge').textContent = T('classic.badgeDaily');

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
      document.getElementById('result-title').textContent = previous.won ? T('game.alreadyPlayedWon') : T('game.alreadyPlayedLost');
      document.getElementById('result-msg').textContent = previous.won
        ? T('game.alreadyWonMsg', { name: previous.targetName, count: previous.guessCount })
        : T('game.alreadyLostMsg', { name: previous.targetName });

      // Inject character image
      const char = CHARS.find(c => c.name === previous.targetName) || target;
      const imgCont = document.getElementById('result-char-container');
      imgCont.innerHTML = '';
      const resImg = document.createElement('img');
      resImg.className = 'result-char-img';
      resImg.src = '../assets/' + (char.img || 'images/default.png');
      imgCont.appendChild(resImg);
      return;
    }

    const progress = JSON.parse(localStorage.getItem(getDailyProgressKey()) || 'null');
    if (progress && progress.guessNames && progress.guessNames.length > 0) {
      guesses = [];
      gameOver = false;
      selectedIndex = -1;
      hintUsed = progress.hintUsed || false;
      document.getElementById('guesses-container').innerHTML = '';
      document.getElementById('result-banner').classList.remove('show', 'lose');
      input.disabled = false;
      input.value = '';
      input.placeholder = T('classic.placeholder');
      document.getElementById('search-area').style.display = '';
      dropdown.style.display = 'none';
      progress.guessNames.forEach(function (name) {
        const char = CHARS.find(function (c) { return c.name === name; });
        if (char) { guesses.push(char); renderGuess(char); }
      });
      document.getElementById('hint-text').textContent = '';
      document.getElementById('hint-btn').disabled = hintUsed;
      document.getElementById('hint-btn').textContent = hintUsed ? T('game.hintUsed') : T('game.useHint');
      if (hintUsed) {
        document.getElementById('hint-text').textContent = T('game.hintFirstLetter', { letter: target.name[0].toUpperCase() });
        document.getElementById('hint-area').style.display = '';
      } else {
        const wc = guesses.filter(function (g) { return g.name !== target.name; }).length;
        document.getElementById('hint-area').style.display = (wc > 0 && wc % 3 === 0) ? '' : 'none';
      }
      updateAttemptsLeft();
      return;
    }
  } else {
    MAX_GUESSES = 6;
    target = CHARS[Math.floor(Math.random() * CHARS.length)];
    document.getElementById('classic-mode-badge').textContent = T('classic.badgeEndless');
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
  input.placeholder = T('classic.placeholder');
  document.getElementById('search-area').style.display = '';
  dropdown.style.display = 'none';

  document.getElementById('hint-area').style.display = 'none';
  document.getElementById('hint-text').textContent = '';
  document.getElementById('hint-btn').disabled = false;
  document.getElementById('hint-btn').textContent = T('game.useHint');

  updateAttemptsLeft();
  if (currentMode === 'endless') showStreakWidget('classic');
}

function updateAttemptsLeft() {
  const el = document.getElementById('attempts-left');
  const remaining = MAX_GUESSES - guesses.length;
  el.textContent = gameOver ? '' : T('game.triesLeft', { remaining });
}

function useHint() {
  if (hintUsed || !target) return;
  hintUsed = true;
  document.getElementById('hint-btn').disabled = true;
  document.getElementById('hint-btn').textContent = T('game.hintUsed');
  document.getElementById('hint-text').textContent = T('game.hintFirstLetter', { letter: target.name[0].toUpperCase() });
  if (currentMode === 'daily') saveDailyProgress();
}

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
    txt.textContent = T('db.color.' + c);
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

function renderGuess(char) {
  // April Fools: keep name+img, swap all other data from a random char, shuffle field order
  let displayChar = char;
  if (_isAprilFools()) {
    const others = CHARS.filter(c => c.name !== char.name);
    const rnd = others[Math.floor(Math.random() * others.length)];
    displayChar = { name: char.name, img: char.img, emoji: char.emoji,
      animal: rnd.animal, type: rnd.type, color: rnd.color,
      eyeColor: rnd.eyeColor, year: rnd.year };
  }
  const fields = [
    { key: 'name', isColor: false },
    { key: 'animal', isColor: false },
    { key: 'type', isColor: false },
    { key: 'color', isColor: true },
    { key: 'eyeColor', isColor: true },
    { key: 'year', isColor: false },
  ];
  if (_isAprilFools()) {
    const shufflable = fields.slice(1);
    for (let i = shufflable.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shufflable[i], shufflable[j]] = [shufflable[j], shufflable[i]];
    }
    fields.splice(1, shufflable.length, ...shufflable);
  }

  const row = document.createElement('div');
  row.className = 'guess-row';

  const imgCell = document.createElement('div');
  imgCell.className = 'cell cell-img';

  if (char.img) {
    const img = document.createElement('img');
    img.src = '../assets/' + char.img; // Adjusting path for pages/ subdir
    img.alt = char.name;
    if (char.imgFocusFace) { img.style.objectFit = 'cover'; img.style.objectPosition = 'top center'; }
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
      matchClass = colorMatch(displayChar[f.key], target[f.key]);
    } else {
      matchClass = String(displayChar[f.key]) === String(target[f.key]) ? 'correct' : 'wrong';
    }
    cell.classList.add(matchClass);

    if (f.isColor) {
      cell.appendChild(makeColorLabel(displayChar[f.key]));
    } else {
      const label = document.createElement('div');
      label.className = 'cell-label';
      if (f.key === 'year' && matchClass !== 'correct') {
        const gYear = parseInt(displayChar[f.key]);
        const tYear = parseInt(target[f.key]);
        if (!isNaN(gYear) && !isNaN(tYear)) {
          const arrow = gYear < tYear ? '↑' : '↓';
          label.innerHTML = `${displayChar[f.key]} <span class="year-arrow">${arrow}</span>`;
        } else {
          label.textContent = isNaN(parseInt(displayChar[f.key]))
            ? T('db.year.' + displayChar[f.key])
            : displayChar[f.key];
        }
      } else {
        let val = displayChar[f.key];
        if (f.key === 'animal' || f.key === 'type') {
          val = T('db.' + f.key + '.' + val);
        } else if (f.key === 'year' && isNaN(parseInt(val))) {
          val = T('db.year.' + val);
        }
        label.textContent = val;
      }
      cell.appendChild(label);
    }
    row.appendChild(cell);
  });

  document.getElementById('guesses-container').prepend(row);
}

function submitGuess(char) {
  if (gameOver) return;

  if (guesses.some(g => g.name === char.name)) {
    input.placeholder = T('game.triedAlready');
    input.value = '';
    dropdown.style.display = 'none';
    return;
  }

  guesses.push(char);
  if (currentMode === 'daily') saveDailyProgress();
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
    gameOver = true;
    input.disabled = true;
    dropdown.style.display = 'none';
    if (currentMode === 'daily') {
      triggerFreddyJumpscare(() => endGame(false));
    } else {
      endGame(false);
    }
  }

  updateAttemptsLeft();
}

function endGame(won) {
  gameOver = true;
  input.disabled = true;
  document.getElementById('search-area').style.display = 'none';
  document.getElementById('hint-area').style.display = 'none';

  if (currentMode === 'daily') {
    saveDailyResult(won, target.name, guesses.length);
    clearDailyProgress();
  } else {
    updateStreak('classic', won);
    _renderStreakNums('classic');
    updateStats('endless', won, guesses.length);
  }

  const banner = document.getElementById('result-banner');
  banner.classList.add('show');
  if (!won) banner.classList.add('lose');

  const isDaily = currentMode === 'daily';
  const switchBtn = document.getElementById('play-switch-btn');
  if (switchBtn) {
    switchBtn.style.display = '';
    switchBtn.textContent = isDaily ? T('game.playEndless') : T('game.playDaily');
    switchBtn.onclick = () => { window.location.href = isDaily ? 'classic.html?mode=endless' : 'classic.html?mode=daily'; };
  }
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.style.display = '';
    nextBtn.dataset.href = isDaily ? 'image.html?mode=daily' : 'image.html?mode=endless';
  }
  document.getElementById('result-title').textContent = won ? T('game.got') : T('game.gameOver');
  document.getElementById('result-msg').textContent = won
    ? T('game.guessedIn', { name: target.name, count: guesses.length })
    : T('game.betterLuck', { name: target.name });

  const imgCont = document.getElementById('result-char-container');
  imgCont.innerHTML = '';
  const resImg = document.createElement('img');
  resImg.className = 'result-char-img';
  resImg.src = '../assets/' + (target.img || 'images/default.png');
  imgCont.appendChild(resImg);
}

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
      img.src = '../assets/' + char.img;
      img.alt = char.name;
      if (char.imgFocusFace) { img.style.objectFit = 'cover'; img.style.objectPosition = 'top center'; }
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

function restartCurrent() {
  initGame(currentMode);
}

// Event Listeners
input.addEventListener('focus', renderDropdown);
input.addEventListener('input', renderDropdown);
input.addEventListener('keydown', e => {
  const items = Array.from(dropdown.querySelectorAll('.dropdown-item'));
  if (!items.length) return;
  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, items.length - 1); break;
    case 'ArrowUp': e.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, 0); break;
    case 'Enter':
      if (selectedIndex >= 0) { items[selectedIndex].click(); e.preventDefault(); } break;
    case 'Tab':
      if (dropdown.style.display !== 'none') {
        e.preventDefault();
        if (selectedIndex >= 0) {
          items[selectedIndex].click();
        } else {
          selectedIndex = 0;
          items.forEach((el, i) => el.classList.toggle('selected', i === 0));
          items[0].scrollIntoView({ block: 'nearest' });
        }
      }
      break;
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

window.onLangChange = function () {
  if (!target) return;
  document.getElementById('classic-mode-badge').textContent =
    currentMode === 'daily' ? T('classic.badgeDaily') : T('classic.badgeEndless');
  if (!gameOver) input.placeholder = T('classic.placeholder');
  updateAttemptsLeft();
  const hintBtn = document.getElementById('hint-btn');
  if (hintBtn) hintBtn.textContent = hintUsed ? T('game.hintUsed') : T('game.useHint');
  const hintTxt = document.getElementById('hint-text');
  if (hintTxt && hintUsed) hintTxt.textContent = T('game.hintFirstLetter', { letter: target.name[0].toUpperCase() });
  // Re-render guesses
  document.getElementById('guesses-container').innerHTML = '';
  guesses.forEach(function (g) { renderGuess(g); });
  // Result banner
  if (gameOver) {
    const isDaily = currentMode === 'daily';
    if (isDaily && guesses.length === 0) {
      const prev = getDailyResult();
      if (prev) {
        document.getElementById('result-title').textContent = prev.won ? T('game.alreadyPlayedWon') : T('game.alreadyPlayedLost');
        document.getElementById('result-msg').textContent = prev.won
          ? T('game.alreadyWonMsg', { name: prev.targetName, count: prev.guessCount })
          : T('game.alreadyLostMsg', { name: prev.targetName });
      }
    } else {
      const won = guesses.some(function (g) { return g.name === target.name; });
      document.getElementById('result-title').textContent = won ? T('game.got') : T('game.gameOver');
      document.getElementById('result-msg').textContent = won
        ? T('game.guessedIn', { name: target.name, count: guesses.length })
        : T('game.betterLuck', { name: target.name });
      const sw = document.getElementById('play-switch-btn');
      if (sw && sw.style.display !== 'none') sw.textContent = isDaily ? T('game.playEndless') : T('game.playDaily');
    }
  }
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') || 'daily';
  document.getElementById('classic-screen').style.display = 'block';
  initGame(mode);
});
