/* =======================================================
       IMAGE MODE
======================================================= */
const CHARS_WITH_IMG = CHARS.filter(c => c.img);

let imgTarget, imgGuesses, imgGameOver;
const IMG_MAX_GUESSES = 6;
let imgSelectedIndex = -1;
let imgHintUsed = false;
let imgCurrentMode = new URLSearchParams(window.location.search).get('mode') || 'endless';

const IMG_STEPS = [
  { blur: 18, scale: 2.4, grayscale: 1 },
  { blur: 14, scale: 2.1, grayscale: 1 },
  { blur: 10, scale: 1.8, grayscale: 1 },
  { blur: 6,  scale: 1.5, grayscale: 0.7 },
  { blur: 3,  scale: 1.25, grayscale: 0.4 },
  { blur: 1,  scale: 1.08, grayscale: 0.15 },
  { blur: 0,  scale: 1,   grayscale: 0 },
];

const imgInput    = document.getElementById('img-search-input');
const imgDropdown = document.getElementById('img-dropdown');
const mysteryImg  = document.getElementById('mystery-img');

// ── Daily helpers ─────────────────────────────────────
function getDailyImgKey() {
  const now = new Date();
  return `fnaf_img_daily_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
}

function getDailyImgIndex() {
  const now = new Date();
  const seed = (now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()) ^ 0xcafebabe;
  let h = seed ^ 0xdeadbeef;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h ^= h >>> 16;
  return Math.abs(h) % CHARS_WITH_IMG.length;
}

function getDailyImgResult() {
  try { return JSON.parse(localStorage.getItem(getDailyImgKey())); } catch { return null; }
}

function saveDailyImgResult(won, targetName, guessCount) {
  localStorage.setItem(getDailyImgKey(), JSON.stringify({ won, targetName, guessCount }));
}

// ── Filter helpers ────────────────────────────────────
function applyImageFilter(wrongCount) {
  const step = IMG_STEPS[Math.min(wrongCount, IMG_STEPS.length - 1)];
  mysteryImg.style.filter     = `blur(${step.blur}px) grayscale(${step.grayscale})`;
  mysteryImg.style.transform  = `scale(${step.scale})`;
  mysteryImg.style.transition = 'filter 0.6s ease, transform 0.6s ease';
}

function revealImage() {
  const step = IMG_STEPS[IMG_STEPS.length - 1];
  mysteryImg.style.filter    = `blur(${step.blur}px) grayscale(${step.grayscale})`;
  mysteryImg.style.transform = `scale(${step.scale})`;
}

function resetImageInstant(wrongCount) {
  const step = IMG_STEPS[Math.min(wrongCount, IMG_STEPS.length - 1)];
  mysteryImg.style.transition = 'none';
  mysteryImg.style.filter     = `blur(${step.blur}px) grayscale(${step.grayscale})`;
  mysteryImg.style.transform  = `scale(${step.scale})`;
  // Double rAF: first frame paints the instant state, second re-enables transitions
  requestAnimationFrame(() => requestAnimationFrame(() => {
    mysteryImg.style.transition = 'filter 0.6s ease, transform 0.6s ease';
  }));
}

function getDailyImgProgressKey() {
  const now = new Date();
  return `fnaf_img_daily_progress_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
}
function saveDailyImgProgress() {
  try { localStorage.setItem(getDailyImgProgressKey(), JSON.stringify({ guessNames: imgGuesses.map(g => g.name), hintUsed: imgHintUsed })); } catch {}
}
function clearDailyImgProgress() {
  localStorage.removeItem(getDailyImgProgressKey());
}

// ── Init ─────────────────────────────────────────────
function initImageMode() {
  imgGuesses    = [];
  imgGameOver   = false;
  imgSelectedIndex = -1;
  imgHintUsed   = false;

  if (imgCurrentMode === 'daily') {
    imgTarget = CHARS_WITH_IMG[getDailyImgIndex()];
    document.getElementById('img-mode-badge').textContent = T('image.badgeDaily');
    document.getElementById('streak-widget').style.display = 'none';

    const previous = getDailyImgResult();
    if (previous) {
      const banner = document.getElementById('img-result-banner');
      banner.classList.remove('lose');
      banner.classList.add('show');
      if (!previous.won) banner.classList.add('lose');

      document.getElementById('img-result-title').textContent =
        previous.won ? T('game.alreadyPlayedWon') : T('game.alreadyPlayedLost');
      document.getElementById('img-result-msg').textContent = previous.won
        ? T('game.alreadyWonMsg', { name: previous.targetName, count: previous.guessCount })
        : T('game.alreadyLostMsg', { name: previous.targetName });

      const imgCont = document.getElementById('img-result-char-container');
      imgCont.innerHTML = '';
      const char = CHARS_WITH_IMG.find(c => c.name === previous.targetName) || imgTarget;
      const resImg = document.createElement('img');
      resImg.className = 'result-char-img';
      resImg.src = '../assets/' + char.img;
      imgCont.appendChild(resImg);

      imgInput.disabled = true;
      document.getElementById('img-search-area').style.display = 'none';
      document.getElementById('img-hint-area').style.display = 'none';
      document.getElementById('img-attempts-left').textContent = '';
      document.getElementById('img-guesses-list').innerHTML = '';

      mysteryImg.src = '../assets/' + imgTarget.img;
      resetImageInstant(IMG_STEPS.length - 1);
      return;
    }

    const imgProgress = JSON.parse(localStorage.getItem(getDailyImgProgressKey()) || 'null');
    if (imgProgress && imgProgress.guessNames && imgProgress.guessNames.length > 0) {
      imgGuesses = [];
      imgGameOver = false;
      imgSelectedIndex = -1;
      imgHintUsed = imgProgress.hintUsed || false;
      document.getElementById('img-guesses-list').innerHTML = '';
      document.getElementById('img-result-banner').classList.remove('show', 'lose');
      imgInput.disabled = false;
      imgInput.value = '';
      imgInput.placeholder = T('classic.placeholder');
      document.getElementById('img-search-area').style.display = '';
      imgDropdown.style.display = 'none';
      mysteryImg.onerror = () => { mysteryImg.src = ''; };
      if (_isAprilFools()) {
        const cv = document.createElement('canvas'); cv.width = 1; cv.height = 1;
        cv.getContext('2d').fillRect(0, 0, 1, 1);
        mysteryImg.src = cv.toDataURL();
      } else {
        mysteryImg.src = '../assets/' + imgTarget.img;
      }
      imgProgress.guessNames.forEach(function (name) {
        const char = CHARS_WITH_IMG.find(function (c) { return c.name === name; });
        if (char) { imgGuesses.push(char); renderImgGuess(char, char.name === imgTarget.name); }
      });
      const imgWrongCount = imgGuesses.filter(function (g) { return g.name !== imgTarget.name; }).length;
      resetImageInstant(imgWrongCount);
      document.getElementById('img-hint-text').textContent = '';
      document.getElementById('img-hint-btn').disabled = imgHintUsed;
      document.getElementById('img-hint-btn').textContent = imgHintUsed ? T('game.hintUsed') : T('game.useHint');
      if (imgHintUsed) {
        document.getElementById('img-hint-text').textContent = T('game.hintFirstLetter', { letter: imgTarget.name[0].toUpperCase() });
        document.getElementById('img-hint-area').style.display = '';
      } else {
        document.getElementById('img-hint-area').style.display = (imgWrongCount > 0 && imgWrongCount % 3 === 0) ? '' : 'none';
      }
      updateImgAttemptsLeft();
      return;
    }
  } else {
    imgTarget = CHARS_WITH_IMG[Math.floor(Math.random() * CHARS_WITH_IMG.length)];
    document.getElementById('img-mode-badge').textContent = T('image.badgeEndless');
  }

  mysteryImg.onerror = () => { mysteryImg.src = ''; };
  if (_isAprilFools()) {
    const c = document.createElement('canvas'); c.width = 1; c.height = 1;
    c.getContext('2d').fillRect(0, 0, 1, 1);
    mysteryImg.src = c.toDataURL();
  } else {
    mysteryImg.src = '../assets/' + imgTarget.img;
  }

  resetImageInstant(0);

  document.getElementById('img-guesses-list').innerHTML = '';
  const banner = document.getElementById('img-result-banner');
  banner.classList.remove('show', 'lose');
  imgInput.disabled = false;
  imgInput.value = '';
  imgInput.placeholder = T('classic.placeholder');
  document.getElementById('img-search-area').style.display = '';
  imgDropdown.style.display = 'none';

  document.getElementById('img-hint-area').style.display = 'none';
  document.getElementById('img-hint-text').textContent = '';
  document.getElementById('img-hint-btn').disabled = false;
  document.getElementById('img-hint-btn').textContent = T('game.useHint');

  // no play-again-btn in new layout

  updateImgAttemptsLeft();
  if (imgCurrentMode === 'endless') showStreakWidget('image');
}

function updateImgAttemptsLeft() {
  const el = document.getElementById('img-attempts-left');
  const remaining = IMG_MAX_GUESSES - imgGuesses.length;
  el.textContent = imgGameOver ? '' : T('game.triesLeft', { remaining });
}

function useImageHint() {
  if (imgHintUsed || !imgTarget) return;
  imgHintUsed = true;
  document.getElementById('img-hint-btn').disabled = true;
  document.getElementById('img-hint-btn').textContent = T('game.hintUsed');
  document.getElementById('img-hint-text').textContent = T('game.hintFirstLetter', { letter: imgTarget.name[0].toUpperCase() });
  if (imgCurrentMode === 'daily') saveDailyImgProgress();
}

function submitImgGuess(char) {
  if (imgGameOver) return;

  if (imgGuesses.some(g => g.name === char.name)) {
    imgInput.placeholder = T('game.triedAlready');
    imgInput.value = '';
    imgDropdown.style.display = 'none';
    return;
  }

  imgGuesses.push(char);
  if (imgCurrentMode === 'daily') saveDailyImgProgress();
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
    img.src = '../assets/' + char.img;
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

  const isDaily = imgCurrentMode === 'daily';
  const switchBtn = document.getElementById('img-play-switch-btn');
  if (switchBtn) {
    switchBtn.style.display = '';
    switchBtn.textContent = isDaily ? T('game.playEndless') : T('game.playDaily');
    switchBtn.onclick = () => { window.location.href = isDaily ? 'image.html?mode=endless' : 'image.html?mode=daily'; };
  }
  const nextBtn = document.getElementById('img-next-btn');
  if (nextBtn) {
    nextBtn.style.display = '';
    nextBtn.dataset.href = isDaily ? 'book.html?mode=book_daily' : 'book.html?mode=book_endless';
  }
  if (isDaily) {
    saveDailyImgResult(won, imgTarget.name, imgGuesses.length);
    clearDailyImgProgress();
    updateStats('daily', won, imgGuesses.length);
  } else {
    updateStreak('image', won);
    _renderStreakNums('image');
    updateStats('endless', won, imgGuesses.length);
  }

  const banner = document.getElementById('img-result-banner');
  banner.classList.add('show');
  if (!won) banner.classList.add('lose');

  document.getElementById('img-result-title').textContent = won ? T('game.got') : T('game.gameOver');
  document.getElementById('img-result-msg').textContent = won
    ? T('image.guessedIn', { name: imgTarget.name, count: imgGuesses.length })
    : T('game.betterLuck', { name: imgTarget.name });

  const imgCont = document.getElementById('img-result-char-container');
  imgCont.innerHTML = '';
  const resImg = document.createElement('img');
  resImg.className = 'result-char-img';
  resImg.src = '../assets/' + imgTarget.img;
  imgCont.appendChild(resImg);
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
    img.src = '../assets/' + char.img;
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

// Event Listeners
imgInput.addEventListener('focus', renderImgDropdown);
imgInput.addEventListener('input', renderImgDropdown);
imgInput.addEventListener('keydown', e => {
  const items = Array.from(imgDropdown.querySelectorAll('.dropdown-item'));
  if (!items.length) return;
  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); imgSelectedIndex = Math.min(imgSelectedIndex + 1, items.length - 1); break;
    case 'ArrowUp':   e.preventDefault(); imgSelectedIndex = Math.max(imgSelectedIndex - 1, 0); break;
    case 'Enter':
      if (imgSelectedIndex >= 0) { items[imgSelectedIndex].click(); e.preventDefault(); } break;
    case 'Tab':
      if (imgDropdown.style.display !== 'none') {
        e.preventDefault();
        if (imgSelectedIndex >= 0) {
          items[imgSelectedIndex].click();
        } else {
          imgSelectedIndex = 0;
          items.forEach((el, i) => el.classList.toggle('selected', i === 0));
          items[0].scrollIntoView({ block: 'nearest' });
        }
      }
      break;
    case 'Escape': imgDropdown.style.display = 'none'; imgSelectedIndex = -1; break;
  }
  items.forEach((el, i) => el.classList.toggle('selected', i === imgSelectedIndex));
  if (imgSelectedIndex >= 0) items[imgSelectedIndex].scrollIntoView({ block: 'nearest' });
});

document.addEventListener('click', e => {
  if (!document.getElementById('img-search-area').contains(e.target)) {
    imgDropdown.style.display = 'none';
    imgSelectedIndex = -1;
  }
});

window.onLangChange = function () {
  if (!imgTarget) return;
  document.getElementById('img-mode-badge').textContent =
    imgCurrentMode === 'daily' ? T('image.badgeDaily') : T('image.badgeEndless');
  updateImgAttemptsLeft();
  document.getElementById('img-guesses-list').innerHTML = '';
  imgGuesses.forEach(function (g) { renderImgGuess(g, g.name === imgTarget.name); });
  if (imgGameOver) {
    const isDaily = imgCurrentMode === 'daily';
    if (isDaily && imgGuesses.length === 0) {
      const prev = getDailyImgResult();
      if (prev) {
        document.getElementById('img-result-title').textContent = prev.won ? T('game.alreadyPlayedWon') : T('game.alreadyPlayedLost');
        document.getElementById('img-result-msg').textContent = prev.won
          ? T('game.alreadyWonMsg', { name: prev.targetName, count: prev.guessCount })
          : T('game.alreadyLostMsg', { name: prev.targetName });
      }
    } else {
      const won = imgGuesses.some(function (g) { return g.name === imgTarget.name; });
      document.getElementById('img-result-title').textContent = won ? T('game.got') : T('game.gameOver');
      document.getElementById('img-result-msg').textContent = won
        ? T('image.guessedIn', { name: imgTarget.name, count: imgGuesses.length })
        : T('game.betterLuck', { name: imgTarget.name });
      const sw = document.getElementById('img-play-switch-btn');
      if (sw && sw.style.display !== 'none') sw.textContent = isDaily ? T('game.playEndless') : T('game.playDaily');
    }
  }
};

function restartCurrent() {
  initImageMode();
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('image-screen').style.display = 'block';
  initImageMode();
});
