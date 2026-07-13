/* =======================================================
       LOCATION MODE (no image — text guessing with a
       "which game is it from" higher/lower hint)
======================================================= */
let locTarget, locGuesses, locGameOver;
let LOC_MAX_GUESSES = 6;
let locSelectedIndex = -1;

const locInput = document.getElementById('loc-search-input');
const locDropdown = document.getElementById('loc-dropdown');

function getDailyLocationProgressKey() {
  const now = new Date();
  return `fnaf_location_daily_progress_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
}
function saveDailyLocationProgress() {
  try { localStorage.setItem(getDailyLocationProgressKey(), JSON.stringify({ locIds: locGuesses.map(g => g.id) })); } catch {}
}
function clearDailyLocationProgress() {
  localStorage.removeItem(getDailyLocationProgressKey());
}

function initLocationGame(mode) {
  currentMode = mode;
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    el.textContent = T(el.dataset.i18n);
  });

  if (mode === 'daily') {
    LOC_MAX_GUESSES = 7;
    locTarget = LOCATIONS[getDailyLocationIndex()];
    document.getElementById('loc-mode-badge').textContent = T('location.badgeDaily');

    const previous = getDailyLocationResult();
    if (previous) {
      locGuesses = [];
      locGameOver = true;
      document.getElementById('loc-guesses-container').innerHTML = '';
      locInput.disabled = true;
      document.getElementById('loc-search-area').style.display = 'none';
      document.getElementById('loc-attempts-left').textContent = '';

      const banner = document.getElementById('loc-result-banner');
      banner.classList.remove('lose');
      banner.classList.add('show');
      if (!previous.won) banner.classList.add('lose');
      document.getElementById('loc-result-title').textContent = previous.won ? T('game.alreadyPlayedWon') : T('game.alreadyPlayedLost');
      document.getElementById('loc-result-msg').textContent = previous.won
        ? T('game.alreadyWonMsg', { name: previous.targetName, count: previous.guessCount })
        : T('game.alreadyLostMsg', { name: previous.targetName });
      return;
    }

    const progress = JSON.parse(localStorage.getItem(getDailyLocationProgressKey()) || 'null');
    if (progress && progress.locIds && progress.locIds.length > 0) {
      locGuesses = [];
      locGameOver = false;
      locSelectedIndex = -1;
      document.getElementById('loc-guesses-container').innerHTML = '';
      document.getElementById('loc-result-banner').classList.remove('show', 'lose');
      locInput.disabled = false;
      locInput.value = '';
      locInput.placeholder = T('location.placeholder');
      document.getElementById('loc-search-area').style.display = '';
      locDropdown.style.display = 'none';
      progress.locIds.forEach(function (id) {
        const loc = LOCATIONS.find(function (l) { return l.id === id; });
        if (loc) { locGuesses.push(loc); renderLocGuess(loc); }
      });
      updateLocAttemptsLeft();
      return;
    }
  } else {
    LOC_MAX_GUESSES = 6;
    locTarget = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    document.getElementById('loc-mode-badge').textContent = T('location.badgeEndless');
  }

  locGuesses = [];
  locGameOver = false;
  locSelectedIndex = -1;

  document.getElementById('loc-guesses-container').innerHTML = '';
  const banner = document.getElementById('loc-result-banner');
  banner.classList.remove('show', 'lose');
  locInput.disabled = false;
  locInput.value = '';
  locInput.placeholder = T('location.placeholder');
  document.getElementById('loc-search-area').style.display = '';
  locDropdown.style.display = 'none';

  updateLocAttemptsLeft();
  if (currentMode === 'endless') showStreakWidget('location');
}

function updateLocAttemptsLeft() {
  const el = document.getElementById('loc-attempts-left');
  const remaining = LOC_MAX_GUESSES - locGuesses.length;
  el.textContent = locGameOver ? '' : T('game.triesLeft', { remaining });
}

function renderLocGuess(loc) {
  const row = document.createElement('div');
  row.className = 'location-guess-row';

  const imgCell = document.createElement('div');
  imgCell.className = 'cell cell-img';
  if (loc.img) {
    const img = document.createElement('img');
    img.src = '../assets/' + loc.img;
    img.alt = loc.name;
    img.onerror = () => {
      imgCell.innerHTML = '';
      const ph = document.createElement('div');
      ph.className = 'placeholder-avatar';
      ph.textContent = '🗺️';
      imgCell.appendChild(ph);
    };
    imgCell.appendChild(img);
  } else {
    const ph = document.createElement('div');
    ph.className = 'placeholder-avatar';
    ph.textContent = '🗺️';
    imgCell.appendChild(ph);
  }
  row.appendChild(imgCell);

  const nameCell = document.createElement('div');
  nameCell.className = 'cell';
  nameCell.classList.add(loc.id === locTarget.id ? 'correct' : 'wrong');
  const nameLabel = document.createElement('div');
  nameLabel.className = 'cell-label';
  nameLabel.textContent = loc.name;
  nameCell.appendChild(nameLabel);
  row.appendChild(nameCell);

  const gameCell = document.createElement('div');
  gameCell.className = 'cell';
  const gameMatch = loc.gameNumber === locTarget.gameNumber;
  gameCell.classList.add(gameMatch ? 'correct' : 'wrong');
  const gameLabel = document.createElement('div');
  gameLabel.className = 'cell-label';
  if (!gameMatch) {
    const arrow = loc.gameNumber < locTarget.gameNumber ? '↑' : '↓';
    gameLabel.innerHTML = `${loc.game} <span class="year-arrow">${arrow}</span>`;
  } else {
    gameLabel.textContent = loc.game;
  }
  gameCell.appendChild(gameLabel);
  row.appendChild(gameCell);

  document.getElementById('loc-guesses-container').prepend(row);
}

function submitLocGuess(loc) {
  if (locGameOver) return;

  if (locGuesses.some(g => g.id === loc.id)) {
    locInput.placeholder = T('game.triedAlready');
    locInput.value = '';
    locDropdown.style.display = 'none';
    return;
  }

  locGuesses.push(loc);
  if (currentMode === 'daily') saveDailyLocationProgress();
  renderLocGuess(loc);
  locInput.value = '';
  locDropdown.style.display = 'none';
  locSelectedIndex = -1;

  if (loc.id === locTarget.id) endLocGame(true);
  else if (locGuesses.length >= LOC_MAX_GUESSES) {
    locGameOver = true;
    locInput.disabled = true;
    locDropdown.style.display = 'none';
    if (currentMode === 'daily') {
      triggerFreddyJumpscare(() => endLocGame(false));
    } else {
      endLocGame(false);
    }
  }

  updateLocAttemptsLeft();
}

function endLocGame(won) {
  locGameOver = true;
  locInput.disabled = true;
  document.getElementById('loc-search-area').style.display = 'none';

  if (currentMode === 'daily') {
    saveDailyLocationResult(won, locTarget.name, locGuesses.length);
    clearDailyLocationProgress();
  } else {
    updateStreak('location', won);
    _renderStreakNums('location');
    updateStats('endless', won, locGuesses.length);
  }

  const banner = document.getElementById('loc-result-banner');
  banner.classList.add('show');
  if (!won) banner.classList.add('lose');

  const isDaily = currentMode === 'daily';
  const switchBtn = document.getElementById('loc-play-switch-btn');
  if (switchBtn) {
    switchBtn.style.display = '';
    switchBtn.textContent = isDaily ? T('game.playEndless') : T('game.playDaily');
    switchBtn.onclick = () => { window.location.href = isDaily ? 'location.html?mode=endless' : 'location.html?mode=daily'; };
  }
  const nextBtn = document.getElementById('loc-next-btn');
  if (nextBtn) {
    nextBtn.style.display = '';
    nextBtn.dataset.href = isDaily ? 'location-image.html?mode=daily' : 'location-image.html?mode=endless';
  }

  document.getElementById('loc-result-title').textContent = won ? T('game.got') : T('game.gameOver');
  document.getElementById('loc-result-msg').textContent = won
    ? T('game.guessedIn', { name: locTarget.name, count: locGuesses.length })
    : T('game.betterLuck', { name: locTarget.name });

  const imgCont = document.getElementById('loc-result-img-container');
  if (imgCont) {
    imgCont.innerHTML = '';
    if (locTarget.img) {
      const resImg = document.createElement('img');
      resImg.className = 'result-char-img';
      resImg.src = '../assets/' + locTarget.img;
      imgCont.appendChild(resImg);
    }
  }
}

function renderLocDropdown() {
  const q = locInput.value.trim().toLowerCase();
  const filtered = LOCATIONS.filter(l =>
    (q === '' || l.name.toLowerCase().includes(q)) &&
    !locGuesses.some(g => g.id === l.id)
  );

  if (!filtered.length) { locDropdown.style.display = 'none'; return; }

  locDropdown.innerHTML = '';
  filtered.forEach(loc => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.tabIndex = -1;

    if (loc.img) {
      const img = document.createElement('img');
      img.src = '../assets/' + loc.img;
      img.alt = loc.name;
      item.appendChild(img);
    }

    const span = document.createElement('span');
    span.textContent = `${loc.name} (${loc.game})`;
    item.appendChild(span);

    item.addEventListener('click', () => submitLocGuess(loc));
    locDropdown.appendChild(item);
  });

  locDropdown.style.display = 'block';
  locSelectedIndex = -1;
}

// Event Listeners
locInput.addEventListener('focus', renderLocDropdown);
locInput.addEventListener('input', renderLocDropdown);
locInput.addEventListener('keydown', e => {
  const items = Array.from(locDropdown.querySelectorAll('.dropdown-item'));
  if (!items.length) return;
  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); locSelectedIndex = Math.min(locSelectedIndex + 1, items.length - 1); break;
    case 'ArrowUp': e.preventDefault(); locSelectedIndex = Math.max(locSelectedIndex - 1, 0); break;
    case 'Enter':
      if (locSelectedIndex >= 0) { items[locSelectedIndex].click(); e.preventDefault(); } break;
    case 'Tab':
      if (locDropdown.style.display !== 'none') {
        e.preventDefault();
        if (locSelectedIndex >= 0) {
          items[locSelectedIndex].click();
        } else {
          locSelectedIndex = 0;
          items.forEach((el, i) => el.classList.toggle('selected', i === 0));
          items[0].scrollIntoView({ block: 'nearest' });
        }
      }
      break;
    case 'Escape': locDropdown.style.display = 'none'; locSelectedIndex = -1; break;
  }
  items.forEach((el, i) => el.classList.toggle('selected', i === locSelectedIndex));
  if (locSelectedIndex >= 0) items[locSelectedIndex].scrollIntoView({ block: 'nearest' });
});

document.addEventListener('click', e => {
  if (!document.getElementById('loc-search-area').contains(e.target)) {
    locDropdown.style.display = 'none';
    locSelectedIndex = -1;
  }
});

function restartCurrent() {
  initLocationGame(currentMode);
}

window.onLangChange = function () {
  if (!locTarget) return;
  document.getElementById('loc-mode-badge').textContent =
    currentMode === 'daily' ? T('location.badgeDaily') : T('location.badgeEndless');
  if (!locGameOver) locInput.placeholder = T('location.placeholder');
  updateLocAttemptsLeft();
  document.getElementById('loc-guesses-container').innerHTML = '';
  locGuesses.forEach(function (g) { renderLocGuess(g); });
  if (locGameOver) {
    const isDaily = currentMode === 'daily';
    if (isDaily && locGuesses.length === 0) {
      const prev = getDailyLocationResult();
      if (prev) {
        document.getElementById('loc-result-title').textContent = prev.won ? T('game.alreadyPlayedWon') : T('game.alreadyPlayedLost');
        document.getElementById('loc-result-msg').textContent = prev.won
          ? T('game.alreadyWonMsg', { name: prev.targetName, count: prev.guessCount })
          : T('game.alreadyLostMsg', { name: prev.targetName });
      }
    } else {
      const won = locGuesses.some(function (g) { return g.id === locTarget.id; });
      document.getElementById('loc-result-title').textContent = won ? T('game.got') : T('game.gameOver');
      document.getElementById('loc-result-msg').textContent = won
        ? T('game.guessedIn', { name: locTarget.name, count: locGuesses.length })
        : T('game.betterLuck', { name: locTarget.name });
      const sw = document.getElementById('loc-play-switch-btn');
      if (sw && sw.style.display !== 'none') sw.textContent = isDaily ? T('game.playEndless') : T('game.playDaily');
    }
  }
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') || 'daily';
  document.getElementById('location-screen').style.display = 'block';
  initLocationGame(mode);
});
