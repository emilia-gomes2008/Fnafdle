/* =======================================================
       Core / Common Functions
======================================================= */

let currentMode = null;

function goHome() {
  window.location.href = '../../../index.html';
}

/* =======================================================
       Daily seed helpers
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
  updateStats('daily', won, guessCount);
}

function saveDailyBookResult(won, targetTitle, guessCount) {
  localStorage.setItem(getDailyBookKey(), JSON.stringify({ won, targetTitle, guessCount }));
  updateStats('daily', won, guessCount);
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
  const label = key === 'daily' ? 'Daily' : key === 'endless' ? 'Endless' : key;

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
      <div style="font-family:'Creepster',cursive;font-size:1.5rem;color:var(--gold);letter-spacing:3px;text-align:center;margin-bottom:18px;"><span class="ee">📊</span> ${label} Stats</div>
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

const COLOR_HEX = {
  red: '#e05555', blue: '#5580e0', yellow: '#e0c935', green: '#3db55a',
  purple: '#8b55e0', pink: '#e055a8', white: '#e8e8e8', black: '#333',
  grey: '#888', gray: '#888', brown: '#8b5e3c', orange: '#e07830',
  magenta: '#cc44aa', silver: '#aaa', beige: '#d4b896',
  rainbow: 'linear-gradient(90deg,#e05555,#e0c935,#3db55a,#5580e0,#8b55e0)',
  colorful: 'linear-gradient(90deg,#e05555,#e0c935,#3db55a,#5580e0)',
};

/* =======================================================
       Streak
======================================================= */
function getStreak(key) {
  return JSON.parse(localStorage.getItem('streak_' + key) || '{"current":0,"best":0}');
}

function updateStreak(key, won) {
  const s = getStreak(key);
  if (won) { s.current++; if (s.current > s.best) s.best = s.current; }
  else { s.current = 0; }
  localStorage.setItem('streak_' + key, JSON.stringify(s));
  return s;
}

function _renderStreakNums(key) {
  const s = getStreak(key);
  const cur = document.getElementById('streak-current');
  const best = document.getElementById('streak-best');
  if (cur) cur.textContent = s.current;
  if (best) best.textContent = s.best;
}

function showStreakWidget(key) {
  const el = document.getElementById('streak-widget');
  if (!el) return;
  el.style.display = 'flex';
  _renderStreakNums(key);
}

/* =======================================================
       Freddy Jumpscare
======================================================= */
const _JUMPSCARE_POOL = [
  'freddy','bonnie','chica','foxy','golden_freddy',
  'withered_bonnie','withered_chica','withered_foxy','withered_golden_freddy'
];

// ── Animation duration parsers ────────────────────────────────────────────
const _gifDurCache = {};

function _parseGif(b) {
  var ms = 0, p = 13;
  if (b[10] >> 7) p += 3 * (2 << (b[10] & 7)); // skip global color table
  while (p < b.length) {
    if (b[p] === 0x3B) break;
    if (b[p] === 0x21) {
      var isGCE = b[p + 1] === 0xF9;
      p += 2;
      while (b[p]) {
        if (isGCE) {
          var cs = b[p + 2] | (b[p + 3] << 8); // centiseconds
          ms += (cs <= 2 ? 10 : cs) * 10;       // browsers enforce ≥20ms min; use 100ms for ≤20ms
        }
        p += b[p] + 1;
      }
      p++;
    } else if (b[p] === 0x2C) {
      p += 9; // skip 0x2C + left(2) + top(2) + width(2) + height(2)
      var pk = b[p - 1];
      if (pk >> 7) p += 3 * (2 << (pk & 7)); // local color table
      p += 2; // LZW min code size + first sub-block check
      while (b[p - 1]) p += b[p - 1] + 1;    // image data sub-blocks
    } else { p++; }
  }
  return ms;
}

function _parseWebP(b) {
  // Animated WebP: sum ANMF frame durations (stored as 24-bit LE, in ms)
  var ms = 0, p = 12;
  while (p + 8 <= b.length) {
    var id = String.fromCharCode(b[p], b[p+1], b[p+2], b[p+3]);
    var sz = b[p+4] | (b[p+5] << 8) | (b[p+6] << 16) | (b[p+7] << 24);
    p += 8;
    if (id === 'ANMF') ms += b[p+12] | (b[p+13] << 8) | (b[p+14] << 16);
    p += sz + (sz & 1);
  }
  return ms;
}

async function _getGifDurationMs(src) {
  if (_gifDurCache[src]) return _gifDurCache[src];
  try {
    var b = new Uint8Array(await fetch(src).then(function(r) { return r.arrayBuffer(); }));
    var ms = 0;
    if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) ms = _parseGif(b);   // GIF
    else if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46) ms = _parseWebP(b); // RIFF/WebP
    _gifDurCache[src] = ms > 50 ? ms : 1000;
  } catch(e) { _gifDurCache[src] = 1000; }
  return _gifDurCache[src];
}

const _JUMPSCARE_EXT = { freddy: 'webp', bonnie: 'webp', chica: 'webp', foxy: 'webp', golden_freddy: 'webp' };

function triggerJumpscare(gifName, callback) {
  const ext = _JUMPSCARE_EXT[gifName] || 'gif';
  const src = `../assets/images/jumpscare/${gifName}.${ext}`;

  const overlay = document.createElement('div');
  overlay.id = 'freddy-jumpscare';
  overlay.style.cssText = `position:fixed;inset:0;z-index:99999;background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;`;

  const img = document.createElement('img');
  img.src = src;
  img.alt = gifName.toUpperCase();
  img.style.cssText = `max-width:100vw;max-height:100vh;width:100%;height:100%;object-fit:cover;animation:freddyPop 0.08s ease-out;`;

  if (!document.getElementById('freddy-keyframes')) {
    const style = document.createElement('style');
    style.id = 'freddy-keyframes';
    style.textContent = `@keyframes freddyPop{0%{transform:scale(0.4);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1);opacity:1}}`;
    document.head.appendChild(style);
  }

  overlay.appendChild(img);
  document.body.appendChild(overlay);
  try { var a = new Audio('../assets/images/jumpscare/jumpscare.mp3'); a.volume = 1.0; a.play(); } catch(e) {}

  var gone = false;
  var fallbackTimer = null;
  var dismiss = function() {
    if (gone) return;
    gone = true;
    clearTimeout(fallbackTimer);
    if (document.body.contains(overlay)) document.body.removeChild(overlay);
    callback();
  };

  // Safe fallback — always dismisses after 3 s even if GIF parse fails
  fallbackTimer = setTimeout(dismiss, 3000);

  overlay.addEventListener('click', dismiss);

  // Override fallback once we know the real GIF duration
  _getGifDurationMs(src).then(function(ms) {
    if (!gone) {
      clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(dismiss, ms);
    }
  });
}

function _isAprilFools() {
  if (localStorage.getItem('_af') === '1') return true;
  var d = new _REAL_DATE();
  return d.getMonth() === 3 && d.getDate() === 1;
}

function triggerFreddyJumpscare(callback) {
  if (_isAprilFools()) { triggerJumpscare('withered_foxy_meme', callback); return; }
  var pool = [..._JUMPSCARE_POOL];
  triggerJumpscare(pool[Math.floor(Math.random() * pool.length)], callback);
}

// ── April Fools test helpers (console) ───────────────────────────────────────
const _REAL_DATE = Date;

function _applyAprilFools() {
  window.Date = class extends _REAL_DATE {
    constructor(...a) { super(...(a.length ? a : [2026, 3, 1])); }
    static now() { return new _REAL_DATE(2026, 3, 1).getTime(); }
  };
}

// Auto-apply on load if flag is set (survives refresh)
if (localStorage.getItem('_af') === '1') _applyAprilFools();

window._testAprilFools = function () {
  localStorage.setItem('_af', '1');
  _applyAprilFools();
  console.log('%c🎪 April Fools mode ON (persists on refresh)', 'color:orange;font-size:15px;font-weight:bold');
  console.log('Restore with: _resetDate()');
};
window._resetDate = function () {
  localStorage.removeItem('_af');
  window.Date = _REAL_DATE;
  console.log('%c✅ Date restored', 'color:green;font-size:15px');
};

// ── Emoji vertical-align fix ──────────────────────────────────────────────────
// Wraps emoji chars in <span class="e"> so CSS can nudge them up.
// Skips classic.html (colours already fixed manually there).
(function () {
  if (location.pathname.includes('classic.html')) return;

  const SKIP = new Set(['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA', 'CODE', 'PRE']);
  const EMOJI_TEST = /\p{Emoji_Presentation}/u;
  function makeRe() { return /\p{Emoji_Presentation}/gu; }

  function fix(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const batch = [];
    let n;
    while ((n = walker.nextNode())) {
      if (SKIP.has(n.parentElement?.tagName)) continue;
      if (n.parentElement?.classList.contains('e')) continue;
      if (n.parentElement?.closest('.mode-category-icon, .mode-icon, #stats-modal-overlay')) continue;
      if (!EMOJI_TEST.test(n.textContent)) continue;
      batch.push(n);
    }
    batch.forEach(n => {
      const t = n.textContent;
      const re = makeRe();
      const frag = document.createDocumentFragment();
      let last = 0, m;
      while ((m = re.exec(t)) !== null) {
        if (m.index > last) frag.append(document.createTextNode(t.slice(last, m.index)));
        const s = document.createElement('span');
        s.className = 'e';
        s.textContent = m[0];
        frag.append(s);
        last = m.index + m[0].length;
      }
      if (last < t.length) frag.append(document.createTextNode(t.slice(last)));
      n.parentNode.replaceChild(frag, n);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    fix(document.body);
    new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(n => {
        if (n.nodeType === 1 && !n.classList.contains('e')) fix(n);
      }));
    }).observe(document.body, { childList: true, subtree: true });
  });
})();
