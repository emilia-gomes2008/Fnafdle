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
  img.src = '../assets/' + imgTarget.img;
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

  const banner = document.getElementById('img-result-banner');
  banner.classList.add('show');
  if (!won) banner.classList.add('lose');

  document.getElementById('img-result-title').textContent = won ? '🎉 Got it!' : '💀 Game Over';
  document.getElementById('img-result-msg').textContent = won
    ? `It was ${imgTarget.name}! Guessed in ${imgGuesses.length} tries.`
    : `It was ${imgTarget.name}. Better luck next time!`;

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
    case 'ArrowUp': e.preventDefault(); imgSelectedIndex = Math.max(imgSelectedIndex - 1, 0); break;
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

function restartCurrent() {
  initImageMode();
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('image-screen').style.display = 'block';
  initImageMode();
});
