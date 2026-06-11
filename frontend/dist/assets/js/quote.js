/* =======================================================
       Quote Guesser Mode
       - Show a random quote from QUOTES
       - Dropdown only shows characters that have at least one quote
       - Endless or Daily mode via ?mode= URL param
       - 6 attempts
======================================================= */

// Characters that have at least one quote in the QUOTES array
const CHARS_WITH_QUOTES = CHARS.filter(c =>
  QUOTES.some(q => q.said === c.name)
);

// Quotes where the speaker exists in CHARS (so we always have a character to show)
const QUOTES_FILTERED = QUOTES.filter(q =>
  CHARS.some(c => c.name === q.said)
);

const QUOTE_MAX_GUESSES = 6;

let quoteTarget = null;  // { quote, said } - the active quote entry
let quoteChar = null;  // CHARS entry for quoteTarget.said
let quoteGuesses = [];
let quoteGameOver = false;
let quoteMode = 'endless';
let quoteSelIdx = -1;

const qInput = document.getElementById('search-input');
const qDropdown = document.getElementById('dropdown');

// ─── Censor character name ────────────────────────────────

function censorName(name) {
  return name.replace(/\S/g, '*');
}

// ─── Daily seed ───────────────────────────────────────────

function getDailyQuoteIndex() {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate() + 3141;
  let h = seed ^ 0xdeadbeef;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h ^= h >>> 16;
  return Math.abs(h) % QUOTES_FILTERED.length;
}

function getDailyQuoteKey() {
  const now = new Date();
  return `fnaf_quote_daily_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
}

function getDailyQuoteResult() {
  try { return JSON.parse(localStorage.getItem(getDailyQuoteKey())); } catch { return null; }
}

function saveDailyQuoteResult(won, saidName, guessCount) {
  localStorage.setItem(getDailyQuoteKey(), JSON.stringify({ won, saidName, guessCount }));
}

// ─── Censor name inside quote text ───────────────────────

function censorQuoteText(quoteText, characterName) {
  if (!characterName) return quoteText;
  // Censor full name + each individual word (e.g. "Glamrock Freddy" → also censor "Glamrock" and "Freddy")
  const parts = [characterName, ...characterName.split(/\s+/).filter(p => p.length >= 3)];
  let result = quoteText;
  for (const part of parts) {
    const escaped = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    result = result.replace(regex, match => '*'.repeat(match.length));
  }
  return result;
}

function getDailyQuoteProgressKey() {
  const now = new Date();
  return `fnaf_quote_daily_progress_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
}
function saveDailyQuoteProgress() {
  try { localStorage.setItem(getDailyQuoteProgressKey(), JSON.stringify({ guessNames: quoteGuesses.map(g => g.name) })); } catch { }
}
function clearDailyQuoteProgress() {
  localStorage.removeItem(getDailyQuoteProgressKey());
}

// ─── Init ─────────────────────────────────────────────────

function initQuote(mode) {
  quoteMode = mode || 'endless';
  quoteGuesses = [];
  quoteGameOver = false;
  quoteSelIdx = -1;

  if (quoteMode === 'daily') {
    document.getElementById('quote-mode-badge').textContent = T('quote.badgeDaily');
    quoteTarget = QUOTES_FILTERED[getDailyQuoteIndex()];

    const previous = getDailyQuoteResult();
    if (previous) {
      quoteGameOver = true;
      qInput.disabled = true;
      document.getElementById('search-area').style.display = 'none';
      document.getElementById('attempts-left').textContent = '';

      quoteChar = CHARS.find(c => c.name === previous.saidName) || null;
      const banner = document.getElementById('result-banner');
      banner.classList.remove('lose');
      banner.classList.add('show');
      if (!previous.won) banner.classList.add('lose');
      document.getElementById('result-title').textContent = previous.won ? T('quote.alreadyPlayedWon') : T('quote.alreadyPlayedLost');
      document.getElementById('result-msg').textContent = previous.won
        ? T('quote.alreadyWonMsg', { said: previous.saidName, count: previous.guessCount, pl: previous.guessCount !== 1 ? 'ies' : 'y' })
        : T('quote.alreadyLostMsg', { said: previous.saidName });

      renderResultChar(quoteChar);
      document.getElementById('quote-text').textContent = (function (t) {
        return _isAprilFools() ? t.split('').map(function (c) { return (c === ' ' || c === '\n') ? c : (Math.random() < 0.95 ? '█' : c); }).join('') : t;
      })(censorQuoteText(quoteTarget.quote, quoteTarget.said));
      return;
    }

    const qProgress = JSON.parse(localStorage.getItem(getDailyQuoteProgressKey()) || 'null');
    if (qProgress && qProgress.guessNames && qProgress.guessNames.length > 0) {
      quoteGuesses = [];
      quoteGameOver = false;
      quoteSelIdx = -1;
      quoteChar = CHARS.find(function (c) { return c.name === quoteTarget.said; }) || null;
      document.getElementById('guesses-list').innerHTML = '';
      document.getElementById('result-banner').classList.remove('show', 'lose');
      qInput.disabled = false;
      qInput.value = '';
      qInput.placeholder = T('quote.placeholder');
      document.getElementById('search-area').style.display = '';
      qDropdown.style.display = 'none';
      document.getElementById('quote-text').textContent = (function (t) {
        return _isAprilFools() ? t.split('').map(function (c) { return (c === ' ' || c === '\n') ? c : (Math.random() < 0.95 ? '█' : c); }).join('') : t;
      })(censorQuoteText(quoteTarget.quote, quoteTarget.said));
      qProgress.guessNames.forEach(function (name) {
        const char = CHARS_WITH_QUOTES.find(function (c) { return c.name === name; });
        if (char) { quoteGuesses.push(char); renderQuoteGuess(char, char.name === quoteTarget.said); }
      });
      updateQuoteAttemptsLeft();
      return;
    }
  } else {
    document.getElementById('quote-mode-badge').textContent = T('quote.badgeEndless');
    quoteTarget = QUOTES_FILTERED[Math.floor(Math.random() * QUOTES_FILTERED.length)];
  }

  quoteChar = CHARS.find(c => c.name === quoteTarget.said) || null;

  document.getElementById('quote-text').textContent = (function (t) {
    return _isAprilFools() ? t.split('').map(function (c) { return (c === ' ' || c === '\n') ? c : (Math.random() < 0.95 ? '█' : c); }).join('') : t;
  })(censorQuoteText(quoteTarget.quote, quoteTarget.said));
  document.getElementById('guesses-list').innerHTML = '';
  document.getElementById('result-banner').classList.remove('show', 'lose');
  document.getElementById('attempts-left').textContent = '';

  qInput.disabled = false;
  qInput.value = '';
  qInput.placeholder = T('quote.placeholder');
  document.getElementById('search-area').style.display = '';
  qDropdown.style.display = 'none';

  updateQuoteAttemptsLeft();
  if (quoteMode === 'endless') showStreakWidget('quote');
}

// ─── Attempts display ─────────────────────────────────────

function updateQuoteAttemptsLeft() {
  const el = document.getElementById('attempts-left');
  const rem = QUOTE_MAX_GUESSES - quoteGuesses.length;
  el.textContent = quoteGameOver ? '' : T('quote.triesLeft', { rem, max: QUOTE_MAX_GUESSES });
}

// ─── Dropdown ─────────────────────────────────────────────

function renderQuoteDropdown() {
  const q = qInput.value.trim().toLowerCase();
  const filtered = CHARS_WITH_QUOTES.filter(c =>
    (q === '' || c.name.toLowerCase().includes(q)) &&
    !quoteGuesses.some(g => g.name === c.name)
  );

  if (!filtered.length) { qDropdown.style.display = 'none'; return; }

  qDropdown.innerHTML = '';
  filtered.forEach(char => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.tabIndex = -1;

    if (char.img) {
      const img = document.createElement('img');
      img.src = '../assets/' + char.img;
      img.alt = char.name;
      item.appendChild(img);
    }
    const span = document.createElement('span');
    span.textContent = char.name;
    item.appendChild(span);

    item.addEventListener('click', () => submitQuoteGuess(char));
    qDropdown.appendChild(item);
  });

  qDropdown.style.display = 'block';
  quoteSelIdx = -1;
}

// ─── Guess ────────────────────────────────────────────────

function submitQuoteGuess(char) {
  if (quoteGameOver) return;
  if (quoteGuesses.some(g => g.name === char.name)) {
    qInput.placeholder = T('quote.alreadyTried');
    qInput.value = '';
    qDropdown.style.display = 'none';
    return;
  }

  quoteGuesses.push(char);
  if (quoteMode === 'daily') saveDailyQuoteProgress();
  qInput.value = '';
  qDropdown.style.display = 'none';
  quoteSelIdx = -1;

  const correct = char.name === quoteTarget.said;
  renderQuoteGuess(char, correct);

  if (correct) {
    endQuoteGame(true);
  } else if (quoteGuesses.length >= QUOTE_MAX_GUESSES) {
    endQuoteGame(false);
  }

  updateQuoteAttemptsLeft();
}

function renderQuoteGuess(char, correct) {
  const list = document.getElementById('guesses-list');
  const item = document.createElement('div');
  item.className = 'quote-guess-item ' + (correct ? 'correct' : 'wrong');

  if (char.img) {
    const img = document.createElement('img');
    img.src = '../assets/' + char.img;
    img.alt = char.name;
    item.appendChild(img);
  } else {
    const ph = document.createElement('div');
    ph.className = 'placeholder-avatar';
    ph.textContent = '?';
    ph.style.cssText = 'width:40px;height:40px;font-size:1.2rem;flex-shrink:0;';
    item.appendChild(ph);
  }

  const nameEl = document.createElement('span');
  nameEl.className = 'guess-name';
  nameEl.textContent = char.name;
  item.appendChild(nameEl);

  const icon = document.createElement('span');
  icon.className = 'quote-guess-icon';
  icon.textContent = correct ? '✅' : '❌';
  item.appendChild(icon);

  list.prepend(item);
}

// ─── End game ─────────────────────────────────────────────

function renderResultChar(char) {
  const imgCont = document.getElementById('result-char-container');
  imgCont.innerHTML = '';
  if (!char) return;
  const resImg = document.createElement('img');
  resImg.className = 'result-char-img';
  resImg.src = '../assets/' + (char.img || 'images/default.png');
  imgCont.appendChild(resImg);
}

function endQuoteGame(won) {
  quoteGameOver = true;
  qInput.disabled = true;
  document.getElementById('search-area').style.display = 'none';

  if (quoteMode === 'daily') {
    saveDailyQuoteResult(won, quoteTarget.said, quoteGuesses.length);
    clearDailyQuoteProgress();
    updateStats('daily', won, quoteGuesses.length);
  } else {
    updateStreak('quote', won);
    _renderStreakNums('quote');
    updateStats('endless', won, quoteGuesses.length);
  }

  const banner = document.getElementById('result-banner');
  const titleEl = document.getElementById('result-title');
  const msgEl = document.getElementById('result-msg');

  if (!won) triggerFreddyJumpscare(() => { });

  banner.classList.add('show');
  if (!won) banner.classList.add('lose');

  titleEl.textContent = won ? T('quote.won') : T('game.gameOver');
  msgEl.textContent = won
    ? T('quote.guessedIn', { said: quoteTarget.said, count: quoteGuesses.length, pl: quoteGuesses.length !== 1 ? 'ies' : 'y' })
    : T('quote.betterLuck', { said: quoteTarget.said });

  const isDaily = quoteMode === 'daily';
  const switchBtn = document.getElementById('quote-play-switch-btn');
  if (switchBtn) {
    switchBtn.style.display = '';
    switchBtn.textContent = isDaily ? T('game.playEndless') : T('game.playDaily');
    switchBtn.onclick = () => { window.location.href = isDaily ? 'quote.html?mode=endless' : 'quote.html?mode=daily'; };
  }

  renderResultChar(quoteChar);
}

function restartQuote() {
  initQuote(quoteMode === 'daily' ? 'daily' : 'endless');
}

// ─── Event listeners ──────────────────────────────────────

qInput.addEventListener('focus', renderQuoteDropdown);
qInput.addEventListener('input', renderQuoteDropdown);
qInput.addEventListener('keydown', e => {
  const items = Array.from(qDropdown.querySelectorAll('.dropdown-item'));
  if (!items.length) return;
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      quoteSelIdx = Math.min(quoteSelIdx + 1, items.length - 1);
      break;
    case 'ArrowUp':
      e.preventDefault();
      quoteSelIdx = Math.max(quoteSelIdx - 1, 0);
      break;
    case 'Enter':
      if (quoteSelIdx >= 0) { items[quoteSelIdx].click(); e.preventDefault(); }
      break;
    case 'Tab':
      if (qDropdown.style.display !== 'none') {
        e.preventDefault();
        if (quoteSelIdx >= 0) {
          items[quoteSelIdx].click();
        } else {
          quoteSelIdx = 0;
          items.forEach((el, i) => el.classList.toggle('selected', i === 0));
          items[0].scrollIntoView({ block: 'nearest' });
        }
      }
      break;
    case 'Escape':
      qDropdown.style.display = 'none';
      quoteSelIdx = -1;
      break;
  }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    items.forEach((el, i) => el.classList.toggle('selected', i === quoteSelIdx));
    if (quoteSelIdx >= 0) items[quoteSelIdx].scrollIntoView({ block: 'nearest' });
  }
});

document.addEventListener('click', e => {
  if (!document.getElementById('search-area').contains(e.target)) {
    qDropdown.style.display = 'none';
    quoteSelIdx = -1;
  }
});

window.onLangChange = function () {
  if (!quoteTarget) return;
  document.getElementById('quote-mode-badge').textContent =
    quoteMode === 'daily' ? T('quote.badgeDaily') : T('quote.badgeEndless');
  updateQuoteAttemptsLeft();
  document.getElementById('guesses-list').innerHTML = '';
  quoteGuesses.forEach(function (g) { renderQuoteGuess(g, g.name === quoteTarget.said); });
  if (quoteGameOver) {
    const isDaily = quoteMode === 'daily';
    if (isDaily && quoteGuesses.length === 0) {
      const prev = getDailyQuoteResult();
      if (prev) {
        document.getElementById('result-title').textContent = prev.won ? T('quote.alreadyPlayedWon') : T('quote.alreadyPlayedLost');
        document.getElementById('result-msg').textContent = prev.won
          ? T('quote.alreadyWonMsg', { said: prev.saidName, count: prev.guessCount, pl: prev.guessCount !== 1 ? 'ies' : 'y' })
          : T('quote.alreadyLostMsg', { said: prev.saidName });
      }
    } else {
      const won = quoteGuesses.some(function (g) { return g.name === quoteTarget.said; });
      document.getElementById('result-title').textContent = won ? T('quote.won') : T('game.gameOver');
      document.getElementById('result-msg').textContent = won
        ? T('quote.guessedIn', { said: quoteTarget.said, count: quoteGuesses.length, pl: quoteGuesses.length !== 1 ? 'ies' : 'y' })
        : T('quote.betterLuck', { said: quoteTarget.said });
      const sw = document.getElementById('quote-play-switch-btn');
      if (sw && sw.style.display !== 'none') sw.textContent = isDaily ? T('game.playEndless') : T('game.playDaily');
    }
  }
};

// ─── Boot ─────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') || 'endless';
  document.getElementById('quote-screen').style.display = 'block';
  initQuote(mode);
});