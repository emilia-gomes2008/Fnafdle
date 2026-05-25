/* =======================================================
       BOOK MODE
======================================================= */
let bookTarget, bookGuesses, bookGameOver;
let BOOK_MAX_GUESSES = 6;
let bookSelectedIndex = -1;

const bookInput = document.getElementById('book-search-input');
const bookDropdown = document.getElementById('book-dropdown');

function getDailyBookProgressKey() {
  const now = new Date();
  return `fnaf_book_daily_progress_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
}
function saveDailyBookProgress() {
  try { localStorage.setItem(getDailyBookProgressKey(), JSON.stringify({ bookTitles: bookGuesses.map(g => g.title) })); } catch {}
}
function clearDailyBookProgress() {
  localStorage.removeItem(getDailyBookProgressKey());
}

function initBookGame(mode) {
  currentMode = mode;
  if (mode === 'book_daily') {
    BOOK_MAX_GUESSES = 7;
    bookTarget = BOOKS[getDailyBookIndex()];
    document.getElementById('book-mode-badge').textContent = T('book.badgeDaily');

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
      document.getElementById('book-result-title').textContent = previous.won ? T('game.alreadyPlayedWon') : T('game.alreadyPlayedLost');
      document.getElementById('book-result-msg').textContent = previous.won
        ? T('book.alreadyWonMsg', { title: previous.targetTitle, count: previous.guessCount })
        : T('book.alreadyLostMsg', { title: previous.targetTitle });

      // Inject book image
      const book = BOOKS.find(b => b.title === previous.targetTitle) || bookTarget;
      const imgCont = document.getElementById('book-result-img-container');
      imgCont.innerHTML = '';
      if (book.img) {
        const resImg = document.createElement('img');
        resImg.className = 'result-char-img';
        resImg.style.height = '120px';
        resImg.style.width = '85px';
        resImg.src = '../assets/' + book.img;
        imgCont.appendChild(resImg);
      }
      return;
    }

    const bookProgress = JSON.parse(localStorage.getItem(getDailyBookProgressKey()) || 'null');
    if (bookProgress && bookProgress.bookTitles && bookProgress.bookTitles.length > 0) {
      bookGuesses = [];
      bookGameOver = false;
      bookSelectedIndex = -1;
      document.getElementById('book-guesses-container').innerHTML = '';
      document.getElementById('book-result-banner').classList.remove('show', 'lose');
      bookInput.disabled = false;
      bookInput.value = '';
      bookInput.placeholder = T('book.placeholder');
      document.getElementById('book-search-area').style.display = '';
      bookDropdown.style.display = 'none';
      bookProgress.bookTitles.forEach(function (title) {
        const book = BOOKS.find(function (b) { return b.title === title; });
        if (book) { bookGuesses.push(book); renderBookGuess(book); }
      });
      updateBookAttemptsLeft();
      return;
    }
  } else {
    BOOK_MAX_GUESSES = 6;
    bookTarget = BOOKS[Math.floor(Math.random() * BOOKS.length)];
    document.getElementById('book-mode-badge').textContent = T('book.badgeEndless');
  }

  bookGuesses = [];
  bookGameOver = false;
  bookSelectedIndex = -1;

  document.getElementById('book-guesses-container').innerHTML = '';
  const banner = document.getElementById('book-result-banner');
  banner.classList.remove('show', 'lose');
  bookInput.disabled = false;
  bookInput.value = '';
  bookInput.placeholder = T('book.placeholder');
  document.getElementById('book-search-area').style.display = '';
  bookDropdown.style.display = 'none';

  updateBookAttemptsLeft();
  if (currentMode === 'book_endless') showStreakWidget('book');
}

function updateBookAttemptsLeft() {
  const el = document.getElementById('book-attempts-left');
  const remaining = BOOK_MAX_GUESSES - bookGuesses.length;
  el.textContent = bookGameOver ? '' : T('game.triesLeft', { remaining });
}

function renderBookGuess(book) {
  // April Fools: keep img, scramble all other fields from random book + shuffle order
  let displayBook = book;
  if (_isAprilFools()) {
    const others = BOOKS.filter(b => b.title !== book.title);
    const rnd = others[Math.floor(Math.random() * others.length)] || book;
    displayBook = { img: book.img, title: rnd.title, series: rnd.series,
      year: rnd.year, number: rnd.number };
  }

  const row = document.createElement('div');
  row.className = 'book-guess-row';

  const imgCell = document.createElement('div');
  imgCell.className = 'cell book-cover-cell';
  if (book.img) {
    const img = document.createElement('img');
    img.src = '../assets/' + book.img;
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
  if (_isAprilFools()) {
    for (let i = fields.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fields[i], fields[j]] = [fields[j], fields[i]];
    }
  }

  fields.forEach(f => {
    const cell = document.createElement('div');
    cell.className = 'cell';

    const isNum = f.key === 'number' || f.key === 'year';
    const matchClass = displayBook[f.key] === bookTarget[f.key] ? 'correct' : 'wrong';
    cell.classList.add(matchClass);

    const label = document.createElement('div');
    label.className = 'cell-label';

    if (isNum && matchClass !== 'correct') {
      const gVal = parseInt(displayBook[f.key]);
      const tVal = parseInt(bookTarget[f.key]);
      if (!isNaN(gVal) && !isNaN(tVal)) {
        const arrow = gVal < tVal ? '↑' : '↓';
        const valTxt = f.key === 'number' ? `#${displayBook[f.key]}` : displayBook[f.key];
        label.innerHTML = `${valTxt} <span class="year-arrow">${arrow}</span>`;
      } else {
        label.textContent = f.key === 'number' ? `#${displayBook[f.key]}` : displayBook[f.key];
      }
    } else {
      label.textContent = f.key === 'number' ? `#${displayBook[f.key]}` : displayBook[f.key];
    }

    cell.appendChild(label);
    row.appendChild(cell);
  });

  document.getElementById('book-guesses-container').prepend(row);
}

function submitBookGuess(book) {
  if (bookGameOver) return;

  if (bookGuesses.some(g => g.title === book.title)) {
    bookInput.placeholder = T('game.triedAlready');
    bookInput.value = '';
    bookDropdown.style.display = 'none';
    return;
  }

  bookGuesses.push(book);
  if (currentMode === 'book_daily') saveDailyBookProgress();
  renderBookGuess(book);
  bookInput.value = '';
  bookDropdown.style.display = 'none';
  bookSelectedIndex = -1;

  if (book.title === bookTarget.title) endBookGame(true);
  else if (bookGuesses.length >= BOOK_MAX_GUESSES) {
    bookGameOver = true;
    bookInput.disabled = true;
    bookDropdown.style.display = 'none';
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
    clearDailyBookProgress();
  } else {
    updateStreak('book', won);
    _renderStreakNums('book');
    updateStats('endless', won, bookGuesses.length);
  }

  const banner = document.getElementById('book-result-banner');
  banner.classList.add('show');
  if (!won) banner.classList.add('lose');

  const isBookDaily = currentMode === 'book_daily';
  const switchBtn = document.getElementById('book-play-switch-btn');
  if (switchBtn) {
    switchBtn.style.display = '';
    switchBtn.textContent = isBookDaily ? T('game.playEndless') : T('game.playDaily');
    switchBtn.onclick = () => { window.location.href = isBookDaily ? 'book.html?mode=book_endless' : 'book.html?mode=book_daily'; };
  }
  const nextBtn = document.getElementById('book-next-btn');
  if (nextBtn) {
    nextBtn.style.display = '';
    nextBtn.dataset.href = isBookDaily ? 'quote.html?mode=daily' : 'quote.html?mode=endless';
  }

  document.getElementById('book-result-title').textContent = won ? T('game.got') : T('game.gameOver');
  document.getElementById('book-result-msg').textContent = won
    ? T('book.guessedIn', { title: bookTarget.title, count: bookGuesses.length })
    : T('book.betterLuck', { title: bookTarget.title });

  const imgCont = document.getElementById('book-result-img-container');
  imgCont.innerHTML = '';
  if (bookTarget.img) {
    const resImg = document.createElement('img');
    resImg.className = 'result-char-img';
    resImg.style.height = '120px';
    resImg.style.width = '85px';
    resImg.src = '../assets/' + bookTarget.img;
    imgCont.appendChild(resImg);
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
      img.src = '../assets/' + book.img;
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

// Event Listeners
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

function restartCurrent() {
  initBookGame(currentMode);
}

window.onLangChange = function () {
  if (!bookTarget) return;
  document.getElementById('book-mode-badge').textContent =
    currentMode === 'book_daily' ? T('book.badgeDaily') : T('book.badgeEndless');
  updateBookAttemptsLeft();
  document.getElementById('book-guesses-container').innerHTML = '';
  bookGuesses.forEach(function (b) { renderBookGuess(b); });
  if (bookGameOver) {
    const isDaily = currentMode === 'book_daily';
    if (isDaily && bookGuesses.length === 0) {
      const prev = getDailyBookResult();
      if (prev) {
        document.getElementById('book-result-title').textContent = prev.won ? T('game.alreadyPlayedWon') : T('game.alreadyPlayedLost');
        document.getElementById('book-result-msg').textContent = prev.won
          ? T('book.alreadyWonMsg', { title: prev.targetTitle, count: prev.guessCount })
          : T('book.alreadyLostMsg', { title: prev.targetTitle });
      }
    } else {
      const won = bookGuesses.some(function (b) { return b.title === bookTarget.title; });
      document.getElementById('book-result-title').textContent = won ? T('game.got') : T('game.gameOver');
      document.getElementById('book-result-msg').textContent = won
        ? T('book.guessedIn', { title: bookTarget.title, count: bookGuesses.length })
        : T('book.betterLuck', { title: bookTarget.title });
      const sw = document.getElementById('book-play-switch-btn');
      if (sw && sw.style.display !== 'none') sw.textContent = isDaily ? T('game.playEndless') : T('game.playDaily');
    }
  }
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') || 'book_daily';
  document.getElementById('book-screen').style.display = 'block';
  initBookGame(mode);
});
