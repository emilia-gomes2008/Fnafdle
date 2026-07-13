/* =======================================================
       LOCATION IMAGE MODE (blurred image reveal +
       "which game is it from" higher/lower hint)
======================================================= */
const LOCATIONS_WITH_IMG = LOCATIONS.filter(l => l.img);

let locImgTarget, locImgGuesses, locImgGameOver;
const LOC_IMG_MAX_GUESSES = 6;
let locImgSelectedIndex = -1;
let locImgCurrentMode = new URLSearchParams(window.location.search).get('mode') || 'endless';

const LOC_IMG_STEPS = [
  { blur: 18, scale: 2.4, grayscale: 1 },
  { blur: 14, scale: 2.1, grayscale: 1 },
  { blur: 10, scale: 1.8, grayscale: 1 },
  { blur: 6,  scale: 1.5, grayscale: 0.7 },
  { blur: 3,  scale: 1.25, grayscale: 0.4 },
  { blur: 1,  scale: 1.08, grayscale: 0.15 },
  { blur: 0,  scale: 1,   grayscale: 0 },
];

const locImgInput    = document.getElementById('locimg-search-input');
const locImgDropdown = document.getElementById('locimg-dropdown');
const mysteryLocImg   = document.getElementById('mystery-locimg');

// ── Daily helpers ─────────────────────────────────────
function getDailyLocImgKey() {
  const now = new Date();
  return `fnaf_location_img_daily_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
}

function getDailyLocImgIndex() {
  const now = new Date();
  const seed = (now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()) ^ 0xfeedface;
  let h = seed ^ 0xdeadbeef;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h ^= h >>> 16;
  return Math.abs(h) % LOCATIONS_WITH_IMG.length;
}

function getDailyLocImgResult() {
  try { return JSON.parse(localStorage.getItem(getDailyLocImgKey())); } catch { return null; }
}

function saveDailyLocImgResult(won, targetId, targetName, guessCount) {
  localStorage.setItem(getDailyLocImgKey(), JSON.stringify({ won, targetId, targetName, guessCount }));
}

function getDailyLocImgProgressKey() {
  const now = new Date();
  return `fnaf_location_img_daily_progress_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
}
function saveDailyLocImgProgress() {
  try { localStorage.setItem(getDailyLocImgProgressKey(), JSON.stringify({ guessIds: locImgGuesses.map(g => g.id) })); } catch {}
}
function clearDailyLocImgProgress() {
  localStorage.removeItem(getDailyLocImgProgressKey());
}

// ── Filter helpers ────────────────────────────────────
function applyLocImgFilter(wrongCount) {
  const step = LOC_IMG_STEPS[Math.min(wrongCount, LOC_IMG_STEPS.length - 1)];
  mysteryLocImg.style.filter     = `blur(${step.blur}px) grayscale(${step.grayscale})`;
  mysteryLocImg.style.transform  = `scale(${step.scale})`;
  mysteryLocImg.style.transition = 'filter 0.6s ease, transform 0.6s ease';
}

function revealLocImg() {
  const step = LOC_IMG_STEPS[LOC_IMG_STEPS.length - 1];
  mysteryLocImg.style.filter    = `blur(${step.blur}px) grayscale(${step.grayscale})`;
  mysteryLocImg.style.transform = `scale(${step.scale})`;
}

function resetLocImgInstant(wrongCount) {
  const step = LOC_IMG_STEPS[Math.min(wrongCount, LOC_IMG_STEPS.length - 1)];
  mysteryLocImg.style.transition = 'none';
  mysteryLocImg.style.filter     = `blur(${step.blur}px) grayscale(${step.grayscale})`;
  mysteryLocImg.style.transform  = `scale(${step.scale})`;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    mysteryLocImg.style.transition = 'filter 0.6s ease, transform 0.6s ease';
  }));
}

// ── Init ─────────────────────────────────────────────
function initLocImgMode() {
  locImgGuesses  = [];
  locImgGameOver = false;
  locImgSelectedIndex = -1;

  if (locImgCurrentMode === 'daily') {
    locImgTarget = LOCATIONS_WITH_IMG[getDailyLocImgIndex()];
    document.getElementById('locimg-mode-badge').textContent = T('locationImage.badgeDaily');
    document.getElementById('streak-widget').style.display = 'none';

    const previous = getDailyLocImgResult();
    if (previous) {
      const banner = document.getElementById('locimg-result-banner');
      banner.classList.remove('lose');
      banner.classList.add('show');
      if (!previous.won) banner.classList.add('lose');

      document.getElementById('locimg-result-title').textContent =
        previous.won ? T('game.alreadyPlayedWon') : T('game.alreadyPlayedLost');
      document.getElementById('locimg-result-msg').textContent = previous.won
        ? T('game.alreadyWonMsg', { name: previous.targetName, count: previous.guessCount })
        : T('game.alreadyLostMsg', { name: previous.targetName });

      const imgCont = document.getElementById('locimg-result-img-container');
      imgCont.innerHTML = '';
      const loc = LOCATIONS_WITH_IMG.find(l => l.id === previous.targetId) || locImgTarget;
      const resImg = document.createElement('img');
      resImg.className = 'result-char-img';
      resImg.src = '../assets/' + loc.img;
      imgCont.appendChild(resImg);

      locImgInput.disabled = true;
      document.getElementById('locimg-search-area').style.display = 'none';
      document.getElementById('locimg-attempts-left').textContent = '';
      document.getElementById('locimg-guesses-list').innerHTML = '';

      mysteryLocImg.src = '../assets/' + locImgTarget.img;
      resetLocImgInstant(LOC_IMG_STEPS.length - 1);
      return;
    }

    const progress = JSON.parse(localStorage.getItem(getDailyLocImgProgressKey()) || 'null');
    if (progress && progress.guessIds && progress.guessIds.length > 0) {
      locImgGuesses = [];
      locImgGameOver = false;
      locImgSelectedIndex = -1;
      document.getElementById('locimg-guesses-list').innerHTML = '';
      document.getElementById('locimg-result-banner').classList.remove('show', 'lose');
      locImgInput.disabled = false;
      locImgInput.value = '';
      locImgInput.placeholder = T('location.placeholder');
      document.getElementById('locimg-search-area').style.display = '';
      locImgDropdown.style.display = 'none';
      mysteryLocImg.onerror = () => { mysteryLocImg.src = ''; };
      mysteryLocImg.src = '../assets/' + locImgTarget.img;
      progress.guessIds.forEach(function (id) {
        const loc = LOCATIONS_WITH_IMG.find(function (l) { return l.id === id; });
        if (loc) { locImgGuesses.push(loc); renderLocImgGuess(loc, loc.id === locImgTarget.id); }
      });
      const wrongCount = locImgGuesses.filter(function (g) { return g.id !== locImgTarget.id; }).length;
      resetLocImgInstant(wrongCount);
      updateLocImgAttemptsLeft();
      return;
    }
  } else {
    locImgTarget = LOCATIONS_WITH_IMG[Math.floor(Math.random() * LOCATIONS_WITH_IMG.length)];
    document.getElementById('locimg-mode-badge').textContent = T('locationImage.badgeEndless');
  }

  mysteryLocImg.onerror = () => { mysteryLocImg.src = ''; };
  mysteryLocImg.src = '../assets/' + locImgTarget.img;

  resetLocImgInstant(0);

  document.getElementById('locimg-guesses-list').innerHTML = '';
  const banner = document.getElementById('locimg-result-banner');
  banner.classList.remove('show', 'lose');
  locImgInput.disabled = false;
  locImgInput.value = '';
  locImgInput.placeholder = T('location.placeholder');
  document.getElementById('locimg-search-area').style.display = '';
  locImgDropdown.style.display = 'none';

  updateLocImgAttemptsLeft();
  if (locImgCurrentMode === 'endless') showStreakWidget('location-image');
}

function updateLocImgAttemptsLeft() {
  const el = document.getElementById('locimg-attempts-left');
  const remaining = LOC_IMG_MAX_GUESSES - locImgGuesses.length;
  el.textContent = locImgGameOver ? '' : T('game.triesLeft', { remaining });
}

function submitLocImgGuess(loc) {
  if (locImgGameOver) return;

  if (locImgGuesses.some(g => g.id === loc.id)) {
    locImgInput.placeholder = T('game.triedAlready');
    locImgInput.value = '';
    locImgDropdown.style.display = 'none';
    return;
  }

  locImgGuesses.push(loc);
  if (locImgCurrentMode === 'daily') saveDailyLocImgProgress();
  locImgInput.value = '';
  locImgDropdown.style.display = 'none';
  locImgSelectedIndex = -1;

  const isCorrect = loc.id === locImgTarget.id;
  renderLocImgGuess(loc, isCorrect);

  const wrongCount = locImgGuesses.filter(g => g.id !== locImgTarget.id).length;

  if (isCorrect) {
    revealLocImg();
    endLocImgGame(true);
  } else {
    applyLocImgFilter(wrongCount);
    if (locImgGuesses.length >= LOC_IMG_MAX_GUESSES) {
      revealLocImg();
      endLocImgGame(false);
    }
  }

  updateLocImgAttemptsLeft();
}

function renderLocImgGuess(loc, correct) {
  const list = document.getElementById('locimg-guesses-list');
  const item = document.createElement('div');
  item.className = 'img-guess-item ' + (correct ? 'correct' : 'wrong');

  if (loc.img) {
    const img = document.createElement('img');
    img.src = '../assets/' + loc.img;
    img.alt = loc.name;
    item.appendChild(img);
  }

  const nameEl = document.createElement('span');
  nameEl.textContent = loc.name;
  item.appendChild(nameEl);

  // Game hint: exact match or higher/lower arrow, same rule as Location Guessing mode
  const gameEl = document.createElement('span');
  gameEl.className = 'loc-img-game-hint';
  gameEl.style.cssText = 'font-size:0.72rem; color:var(--text-muted); margin-left:6px;';
  const gameMatch = loc.gameNumber === locImgTarget.gameNumber;
  if (gameMatch) {
    gameEl.textContent = loc.game;
  } else {
    const arrow = loc.gameNumber < locImgTarget.gameNumber ? '↑' : '↓';
    gameEl.innerHTML = `${loc.game} <span class="year-arrow">${arrow}</span>`;
  }
  item.appendChild(gameEl);

  const icon = document.createElement('span');
  icon.className = 'img-guess-icon';
  icon.textContent = correct ? '✅' : '❌';
  item.appendChild(icon);

  list.prepend(item);
}

function endLocImgGame(won) {
  locImgGameOver = true;
  locImgInput.disabled = true;
  document.getElementById('locimg-search-area').style.display = 'none';

  const isDaily = locImgCurrentMode === 'daily';
  const switchBtn = document.getElementById('locimg-play-switch-btn');
  if (switchBtn) {
    switchBtn.style.display = '';
    switchBtn.textContent = isDaily ? T('game.playEndless') : T('game.playDaily');
    switchBtn.onclick = () => { window.location.href = isDaily ? 'location-image.html?mode=endless' : 'location-image.html?mode=daily'; };
  }
  if (isDaily) {
    saveDailyLocImgResult(won, locImgTarget.id, locImgTarget.name, locImgGuesses.length);
    clearDailyLocImgProgress();
    updateStats('daily', won, locImgGuesses.length);
  } else {
    updateStreak('location-image', won);
    _renderStreakNums('location-image');
    updateStats('endless', won, locImgGuesses.length);
  }

  const banner = document.getElementById('locimg-result-banner');
  banner.classList.add('show');
  if (!won) banner.classList.add('lose');

  document.getElementById('locimg-result-title').textContent = won ? T('game.got') : T('game.gameOver');
  document.getElementById('locimg-result-msg').textContent = won
    ? T('game.guessedIn', { name: locImgTarget.name, count: locImgGuesses.length })
    : T('game.betterLuck', { name: locImgTarget.name });

  const imgCont = document.getElementById('locimg-result-img-container');
  imgCont.innerHTML = '';
  const resImg = document.createElement('img');
  resImg.className = 'result-char-img';
  resImg.src = '../assets/' + locImgTarget.img;
  imgCont.appendChild(resImg);
}

function renderLocImgDropdown() {
  const q = locImgInput.value.trim().toLowerCase();
  const filtered = LOCATIONS_WITH_IMG.filter(l =>
    (q === '' || l.name.toLowerCase().includes(q)) &&
    !locImgGuesses.some(g => g.id === l.id)
  );

  if (!filtered.length) { locImgDropdown.style.display = 'none'; return; }

  locImgDropdown.innerHTML = '';
  filtered.forEach(loc => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.tabIndex = -1;

    const img = document.createElement('img');
    img.src = '../assets/' + loc.img;
    img.alt = loc.name;
    item.appendChild(img);

    const span = document.createElement('span');
    span.textContent = loc.name;
    item.appendChild(span);

    item.addEventListener('click', () => submitLocImgGuess(loc));
    locImgDropdown.appendChild(item);
  });

  locImgDropdown.style.display = 'block';
  locImgSelectedIndex = -1;
}

// Event Listeners
locImgInput.addEventListener('focus', renderLocImgDropdown);
locImgInput.addEventListener('input', renderLocImgDropdown);
locImgInput.addEventListener('keydown', e => {
  const items = Array.from(locImgDropdown.querySelectorAll('.dropdown-item'));
  if (!items.length) return;
  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); locImgSelectedIndex = Math.min(locImgSelectedIndex + 1, items.length - 1); break;
    case 'ArrowUp':   e.preventDefault(); locImgSelectedIndex = Math.max(locImgSelectedIndex - 1, 0); break;
    case 'Enter':
      if (locImgSelectedIndex >= 0) { items[locImgSelectedIndex].click(); e.preventDefault(); } break;
    case 'Tab':
      if (locImgDropdown.style.display !== 'none') {
        e.preventDefault();
        if (locImgSelectedIndex >= 0) {
          items[locImgSelectedIndex].click();
        } else {
          locImgSelectedIndex = 0;
          items.forEach((el, i) => el.classList.toggle('selected', i === 0));
          items[0].scrollIntoView({ block: 'nearest' });
        }
      }
      break;
    case 'Escape': locImgDropdown.style.display = 'none'; locImgSelectedIndex = -1; break;
  }
  items.forEach((el, i) => el.classList.toggle('selected', i === locImgSelectedIndex));
  if (locImgSelectedIndex >= 0) items[locImgSelectedIndex].scrollIntoView({ block: 'nearest' });
});

document.addEventListener('click', e => {
  if (!document.getElementById('locimg-search-area').contains(e.target)) {
    locImgDropdown.style.display = 'none';
    locImgSelectedIndex = -1;
  }
});

window.onLangChange = function () {
  if (!locImgTarget) return;
  document.getElementById('locimg-mode-badge').textContent =
    locImgCurrentMode === 'daily' ? T('locationImage.badgeDaily') : T('locationImage.badgeEndless');
  updateLocImgAttemptsLeft();
  document.getElementById('locimg-guesses-list').innerHTML = '';
  locImgGuesses.forEach(function (g) { renderLocImgGuess(g, g.id === locImgTarget.id); });
  if (locImgGameOver) {
    const isDaily = locImgCurrentMode === 'daily';
    if (isDaily && locImgGuesses.length === 0) {
      const prev = getDailyLocImgResult();
      if (prev) {
        document.getElementById('locimg-result-title').textContent = prev.won ? T('game.alreadyPlayedWon') : T('game.alreadyPlayedLost');
        document.getElementById('locimg-result-msg').textContent = prev.won
          ? T('game.alreadyWonMsg', { name: prev.targetName, count: prev.guessCount })
          : T('game.alreadyLostMsg', { name: prev.targetName });
      }
    } else {
      const won = locImgGuesses.some(function (g) { return g.id === locImgTarget.id; });
      document.getElementById('locimg-result-title').textContent = won ? T('game.got') : T('game.gameOver');
      document.getElementById('locimg-result-msg').textContent = won
        ? T('game.guessedIn', { name: locImgTarget.name, count: locImgGuesses.length })
        : T('game.betterLuck', { name: locImgTarget.name });
      const sw = document.getElementById('locimg-play-switch-btn');
      if (sw && sw.style.display !== 'none') sw.textContent = isDaily ? T('game.playEndless') : T('game.playDaily');
    }
  }
};

function restartCurrent() {
  initLocImgMode();
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('locimg-screen').style.display = 'block';
  initLocImgMode();
});
