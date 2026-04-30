/* =======================================================
       Extreme Mode — FNAF Night Watch
       Progressive nights · AI-based movement opportunities
       3 guesses · no year arrows · no partial colors
       1 corrupted feed · door · battery
======================================================= */

// ─── Night configuration ─────────────────────────────────
// AI levels: roll 1-20 every 10s; if roll <= AI → entity moves

const NIGHT_CONFIGS = [
  null, // index 0 unused
  { // Night 1 — tutorial
    targetAI: 4,
    threats: [],
  },
  { // Night 2
    targetAI: 8,
    threats: [
      { ai: 6, startCam: 3 }, // CAM 2A
    ],
  },
  { // Night 3
    targetAI: 11,
    threats: [
      { ai: 9, startCam: 2 }, // CAM 1C
      { ai: 7, startCam: 5 }, // CAM 4A
    ],
  },
  { // Night 4
    targetAI: 14,
    threats: [
      { ai: 12, startCam: 1 }, // CAM 1B
      { ai: 10, startCam: 3 }, // CAM 2A
      { ai: 8,  startCam: 5 }, // CAM 4A
    ],
  },
  { // Night 5 — max difficulty
    targetAI: 17,
    threats: [
      { ai: 15, startCam: 1 }, // CAM 1B
      { ai: 13, startCam: 2 }, // CAM 1C
      { ai: 11, startCam: 4 }, // CAM 2B
      { ai: 9,  startCam: 6 }, // CAM 4B
    ],
  },
];

const MAX_NIGHTS  = 5;
const MAX_GUESSES = 3;

// ─── Camera data ─────────────────────────────────────────

const CAM_ROOMS = [
  { id: 'CAM 1A', room: 'Show Stage'     },
  { id: 'CAM 1B', room: 'Dining Area'    },
  { id: 'CAM 1C', room: 'Pirate Cove'    },
  { id: 'CAM 2A', room: 'West Hall'      },
  { id: 'CAM 2B', room: 'W. Hall Corner' },
  { id: 'CAM 4A', room: 'East Hall'      },
  { id: 'CAM 4B', room: 'E. Hall Corner' },
  { id: 'CAM 5',  room: 'Backstage'      },
  { id: 'CAM 7',  room: 'Restrooms'      },
];
const LAST_CAM = CAM_ROOMS.length - 1; // 8 = CAM 7

// ─── Game constants ───────────────────────────────────────

const MOVE_OPP_MS    = 10000; // movement opportunity fires every 10 s
const PASSIVE_DRAIN  = 0.10;  // %/s baseline battery drain
const MOVE_COST      = 2.0;   // % per camera move
const DOOR_DRAIN_0   = 0.5;   // %/s when door first closes
const DOOR_RAMP      = 0.018; // extra %/s per second door stays closed
const DOOR_DRAIN_MAX = 2.8;   // %/s cap
const ENTRY_MS       = 4000;  // ms before entity enters office (door open at CAM 7)
const RETREAT_MIN_MS = 2500;
const RETREAT_MAX_MS = 7000;

const HOURS = ['12 AM', '1 AM', '2 AM', '3 AM'];

const HIDEABLE_FIELDS = ['animal', 'type', 'color', 'eyeColor', 'year'];
const HEADER_IDS = {
  animal: 'header-animal', type: 'header-type',
  color: 'header-color',   eyeColor: 'header-eyecolor', year: 'header-year',
};
const HEADER_LABELS = {
  animal: 'Animal', type: 'Type',
  color: 'Color',   eyeColor: 'Eye Color', year: 'Year',
};

// ─── Character pool helpers ───────────────────────────────

// Pick n distinct characters that share the same animal type.
// Best-effort: also tries to match year (60% chance if a same-year pool exists).
// Falls back to fully random if no animal has enough characters.
function pickSameAnimalChars(n) {
  if (n <= 1) return [...CHARS].sort(() => Math.random() - 0.5).slice(0, n);

  // Group by animal
  const byAnimal = {};
  CHARS.forEach(c => {
    const key = (c.animal || 'unknown').toLowerCase();
    if (!byAnimal[key]) byAnimal[key] = [];
    byAnimal[key].push(c);
  });

  // Only consider pools with enough distinct characters
  const eligible = Object.values(byAnimal).filter(pool => pool.length >= n);
  if (!eligible.length) return [...CHARS].sort(() => Math.random() - 0.5).slice(0, n);

  // Weighted random: larger pools are more likely (more variety)
  const total = eligible.reduce((s, p) => s + p.length, 0);
  let r = Math.random() * total;
  let chosenPool = eligible[eligible.length - 1];
  for (const pool of eligible) {
    r -= pool.length;
    if (r <= 0) { chosenPool = pool; break; }
  }

  // Best-effort same year (60% chance when possible)
  const byYear = {};
  chosenPool.forEach(c => {
    const y = String(c.year);
    if (!byYear[y]) byYear[y] = [];
    byYear[y].push(c);
  });
  const sameYearPools = Object.values(byYear).filter(yp => yp.length >= n);

  const finalPool = (sameYearPools.length > 0 && Math.random() < 0.6)
    ? sameYearPools[Math.floor(Math.random() * sameYearPools.length)]
    : chosenPool;

  return [...finalPool].sort(() => Math.random() - 0.5).slice(0, n);
}

// ─── Runtime state ────────────────────────────────────────

let currentNight = loadNight();

let target, guesses, gameOver;
let hiddenField  = null;
let wrongCount   = 0;
let selIdx       = -1;   // dropdown
let selCamIdx    = 0;    // viewed camera

let battery      = 99;
let doorClosed   = false;
let doorHeldFor  = 0;    // seconds door continuously closed

let gameLoopId   = null;
let lastTickMs   = 0;
let movOppTimer  = MOVE_OPP_MS; // ms until next movement opportunity

// Entities: { char, camIdx, ai, state, nextMs }
// state: 'active' | 'entering' | 'blocked'
let targetEntity   = null;
let threatEntities = [];

const input    = document.getElementById('search-input');
const dropdown = document.getElementById('dropdown');

// ─── Persistence ─────────────────────────────────────────

function saveNight() {
  localStorage.setItem('fnaf_extreme_night', currentNight);
}

function loadNight() {
  const n = parseInt(localStorage.getItem('fnaf_extreme_night') || '1');
  return (n >= 1 && n <= MAX_NIGHTS) ? n : 1;
}

// ─── Init ─────────────────────────────────────────────────

function initGame() {
  const cfg = NIGHT_CONFIGS[currentNight];

  // All characters share the same animal type (and possibly same year)
  const chars = pickSameAnimalChars(1 + cfg.threats.length);
  target      = chars[0];

  // Animal is the corrupted field 75% of the time — knowing the animal narrows it down a lot
  const otherFields = HIDEABLE_FIELDS.filter(f => f !== 'animal');
  hiddenField = Math.random() < 0.75
    ? 'animal'
    : otherFields[Math.floor(Math.random() * otherFields.length)];
  wrongCount  = 0;
  battery     = 99;
  doorClosed  = false;
  doorHeldFor = 0;
  movOppTimer = MOVE_OPP_MS;

  // Target starts at a random early camera not occupied by any threat
  const threatStarts  = cfg.threats.map(t => t.startCam);
  const targetOptions = [0, 1, 2, 3].filter(c => !threatStarts.includes(c));
  const targetStart   = targetOptions[Math.floor(Math.random() * targetOptions.length)];

  // Create entities
  targetEntity   = makeEntity(chars[0], targetStart, cfg.targetAI);
  threatEntities = cfg.threats.map((t, i) => makeEntity(chars[i + 1], t.startCam, t.ai));

  // Always start watching CAM 1A
  selCamIdx = 0;

  // UI reset
  setupHeaders();
  guesses     = [];
  gameOver    = false;
  selIdx      = -1;

  document.getElementById('guesses-container').innerHTML = '';
  document.getElementById('result-banner').classList.remove('show', 'lose');
  input.disabled    = false;
  input.value       = '';
  input.placeholder = 'Identify the animatronic on camera...';
  document.getElementById('search-area').style.display = '';
  dropdown.style.display = 'none';
  document.getElementById('door-btn').disabled = false;

  updateNightLabel();
  updateNightWarning(cfg);
  updateDoorBtn();
  buildCamGrid();
  updateClock();
  updatePower();
  updateOppBar();
  updateAttemptsLeft();
  renderMainCam();

  if (gameLoopId) clearInterval(gameLoopId);
  lastTickMs = Date.now();
  gameLoopId = setInterval(tick, 100);
}

function makeEntity(char, camIdx, ai) {
  return { char, camIdx, ai, state: 'active', nextMs: 0 };
}

function setupHeaders() {
  Object.entries(HEADER_IDS).forEach(([field, id]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (field === hiddenField) {
      el.textContent = '???';
      el.classList.add('hidden-col');
    } else {
      el.textContent = HEADER_LABELS[field];
      el.classList.remove('hidden-col');
    }
  });
}

function updateNightLabel() {
  const el = document.getElementById('night-label');
  if (el) el.textContent = `☆ NIGHT ${currentNight} ☆`;
}

function updateNightWarning(cfg) {
  const aiList = [cfg.targetAI, ...cfg.threats.map(t => t.ai)].join(' / ');
  const count  = 1 + cfg.threats.length;
  const el = document.getElementById('extreme-warning');
  if (!el) return;
  el.innerHTML = `<strong>NIGHT ${currentNight}</strong> · <strong>${count}</strong> animatronic${count > 1 ? 's' : ''} active · AI: <strong>${aiList}</strong> · No year arrows · 1 field <strong>corrupted</strong>`;
}

// ─── Game Loop ────────────────────────────────────────────

function tick() {
  if (gameOver) return;
  const now = Date.now();
  const dt  = (now - lastTickMs) / 1000;
  lastTickMs = now;

  // Battery drain
  battery -= PASSIVE_DRAIN * dt;
  if (doorClosed) {
    doorHeldFor += dt;
    const rate = Math.min(DOOR_DRAIN_0 + DOOR_RAMP * doorHeldFor, DOOR_DRAIN_MAX);
    battery -= rate * dt;
  }
  battery = Math.max(0, battery);

  // Movement opportunity countdown
  movOppTimer -= dt * 1000;
  if (movOppTimer <= 0) {
    movOppTimer = MOVE_OPP_MS;
    fireMovementOpportunity(now);
    flashOppTick();
    if (gameOver) return;
  }

  // Process entering/blocked state timers
  for (const e of [targetEntity, ...threatEntities]) {
    processEntityTimer(e, now);
    if (gameOver) return;
  }

  if (battery <= 0) {
    battery = 0;
    stopLoop();
    updatePower();
    triggerFreddyJumpscare(() => endGame(false));
    return;
  }

  updatePower();
  updateOppBar();
  refreshCamGrid();
  renderMainCam();
}

// ─── Movement Opportunity ─────────────────────────────────

function fireMovementOpportunity(now) {
  for (const e of [targetEntity, ...threatEntities]) {
    if (e.state !== 'active') continue;

    const roll = Math.ceil(Math.random() * 20); // 1–20
    if (roll > e.ai) continue; // didn't move this opportunity

    if (e.camIdx < LAST_CAM) {
      const prev = e.camIdx;
      e.camIdx++;
      battery -= MOVE_COST;
      flashTile(prev);
      flashTile(e.camIdx);
    } else {
      // At CAM 7 — try to enter office
      if (doorClosed) {
        e.state  = 'blocked';
        e.nextMs = now + rand(RETREAT_MIN_MS, RETREAT_MAX_MS);
      } else {
        e.state  = 'entering';
        e.nextMs = now + ENTRY_MS;
      }
    }

    if (gameOver) return;
  }
}

// ─── Entity state timers ──────────────────────────────────

function processEntityTimer(e, now) {
  if (e.state === 'entering') {
    if (doorClosed) {
      // Door closed in time
      e.state  = 'blocked';
      e.nextMs = now + rand(RETREAT_MIN_MS, RETREAT_MAX_MS);
    } else if (now >= e.nextMs) {
      stopLoop();
      triggerFreddyJumpscare(() => endGame(false));
    }
  } else if (e.state === 'blocked') {
    if (!doorClosed) {
      // Door opened — start entering again
      e.state  = 'entering';
      e.nextMs = now + ENTRY_MS;
    } else if (now >= e.nextMs) {
      // Retreated back to CAM 1A
      e.camIdx = 0;
      e.state  = 'active';
    }
  }
}

function stopLoop() {
  if (gameLoopId) { clearInterval(gameLoopId); gameLoopId = null; }
}

// ─── Camera Display ───────────────────────────────────────

function buildCamGrid() {
  const grid = document.getElementById('cam-grid');
  grid.innerHTML = '';
  CAM_ROOMS.forEach((cam, i) => {
    const tile = document.createElement('div');
    tile.id        = 'cam-tile-' + i;
    tile.className = 'cam-tile';
    tile.onclick   = () => { selCamIdx = i; refreshCamGrid(); renderMainCam(); };

    const imgWrap = document.createElement('div');
    imgWrap.className = 'cam-tile-img-wrap';
    tile.appendChild(imgWrap);

    const sl = document.createElement('div');
    sl.className = 'cam-tile-scanlines';
    tile.appendChild(sl);

    const hud = document.createElement('div');
    hud.className = 'cam-tile-hud';
    hud.innerHTML = `<span class="cam-tile-id">${cam.id}</span><span class="cam-tile-room">${cam.room.toUpperCase()}</span>`;
    tile.appendChild(hud);

    const dots = document.createElement('div');
    dots.className = 'cam-tile-dots';
    tile.appendChild(dots);

    grid.appendChild(tile);
  });
  refreshCamGrid();
}

// Returns all entities at a camera index, target first
function entitiesAt(camIdx) {
  const list = [];
  if (targetEntity.camIdx === camIdx) list.push({ e: targetEntity, isTarget: true });
  threatEntities.forEach(t => { if (t.camIdx === camIdx) list.push({ e: t, isTarget: false }); });
  return list;
}

function refreshCamGrid() {
  CAM_ROOMS.forEach((_, i) => {
    const tile = document.getElementById('cam-tile-' + i);
    if (!tile) return;

    const at          = entitiesAt(i);
    const tgtHere     = at.some(x => x.isTarget);
    const thrHere     = at.filter(x => !x.isTarget);
    const anyHere     = at.length > 0;
    const atLast      = i === LAST_CAM;
    const anyEntering = at.some(x => x.e.state === 'entering');

    // Only glow red when something is about to enter — no other location hints
    tile.className = 'cam-tile'
      + (selCamIdx === i ? ' cam-selected' : '')
      + (anyEntering     ? ' cam-entering' : '');

    // No images in tiles and no dots — player must flip cameras to find animatronics
    const imgWrap = tile.querySelector('.cam-tile-img-wrap');
    imgWrap.innerHTML = '';
    tile.querySelector('.cam-tile-dots').innerHTML = '';
  });
}

function flashTile(camIdx) {
  // Only glitch the main camera if movement happens on the currently watched camera
  if (selCamIdx === camIdx) glitchMainCam();
}

function glitchMainCam() {
  const screen = document.getElementById('main-cam-screen');
  screen.classList.add('glitch');
  setTimeout(() => screen.classList.remove('glitch'), 600);
}

function renderMainCam() {
  const screen  = document.getElementById('main-cam-screen');
  const img     = document.getElementById('main-cam-img');
  const labelId = document.getElementById('main-cam-id');
  const labelRm = document.getElementById('main-cam-room');
  const tint    = document.getElementById('cam-tint');

  const cam         = CAM_ROOMS[selCamIdx];
  const at          = entitiesAt(selCamIdx);
  const primary     = at[0] ?? null; // first entity (target has priority)
  const anyEntering = at.some(x => x.e.state === 'entering');

  labelId.textContent = cam.id;
  labelRm.textContent = cam.room.toUpperCase();

  // Show whichever animatronic is in the selected camera
  if (primary && primary.e.char.img) {
    img.src   = '../assets/' + primary.e.char.img;
    img.style.display = '';
    screen.classList.remove('cam-empty');
  } else {
    img.src   = '';
    img.style.display = 'none';
    screen.classList.add('cam-empty');
  }

  tint.className = 'cam-green-tint' + (anyEntering ? ' tint-alert' : '');
}

// ─── Movement opportunity bar ─────────────────────────────

function updateOppBar() {
  const pct  = (movOppTimer / MOVE_OPP_MS) * 100;
  const fill = document.getElementById('opp-fill');
  if (fill) fill.style.width = Math.max(0, pct) + '%';
  const cd = document.getElementById('opp-countdown');
  if (cd) cd.textContent = Math.max(0, Math.ceil(movOppTimer / 1000)) + 's';
}

function flashOppTick() {
  const fill = document.getElementById('opp-fill');
  const grid = document.getElementById('cam-grid');
  if (fill) { fill.style.background = 'rgba(200,60,60,0.9)'; setTimeout(() => { fill.style.background = ''; }, 400); }
  if (grid) { grid.style.boxShadow  = '0 0 14px rgba(60,200,80,0.35)';  setTimeout(() => { grid.style.boxShadow = ''; }, 400); }
}

// ─── Door ─────────────────────────────────────────────────

function toggleDoor() {
  if (gameOver) return;
  doorClosed = !doorClosed;
  if (!doorClosed) doorHeldFor = 0;
  updateDoorBtn();
  glitchMainCam();
}

function updateDoorBtn() {
  const btn = document.getElementById('door-btn');
  if (doorClosed) {
    btn.textContent = '🚪 OPEN DOOR';
    btn.className   = 'door-btn door-closed';
  } else {
    btn.textContent = '🚪 CLOSE DOOR';
    btn.className   = 'door-btn door-open';
  }
}

// ─── HUD ──────────────────────────────────────────────────

function updateClock() {
  const el = document.getElementById('night-clock');
  el.textContent = HOURS[wrongCount] ?? '3 AM';
  el.className   = 'night-clock'
    + (wrongCount >= 2 ? ' danger' : wrongCount >= 1 ? ' warning' : '');
}

function updatePower() {
  const pct  = Math.max(0, Math.round(battery));
  const fill = document.getElementById('power-fill');
  fill.style.width = pct + '%';
  fill.className   = 'power-fill'
    + (pct <= 15 ? ' critical' : pct <= 35 ? ' low' : '');
  document.getElementById('power-pct').textContent = pct + '%';
}

function updateAttemptsLeft() {
  const el = document.getElementById('attempts-left');
  const rem = MAX_GUESSES - guesses.length;
  if (gameOver) { el.textContent = ''; return; }
  el.textContent = `Attempts: ${rem} / ${MAX_GUESSES}`;
  el.className   = 'attempts-left' + (rem === 1 ? ' danger' : '');
}

// ─── Guess rendering ──────────────────────────────────────

function colorMatchExtreme(gVal, tVal) {
  const g = toArr(gVal).map(v => v.toLowerCase());
  const t = toArr(tVal).map(v => v.toLowerCase());
  return [...g].sort().join(',') === [...t].sort().join(',') ? 'correct' : 'wrong';
}

function makeSwatch(colorName) {
  const s  = document.createElement('span');
  s.className = 'color-swatch';
  const fill = COLOR_HEX[colorName.toLowerCase()] || '#666';
  if (fill.startsWith('linear')) s.style.backgroundImage = fill;
  else                           s.style.backgroundColor = fill;
  s.title = colorName;
  return s;
}

function makeColorLabel(colors) {
  const arr  = toArr(colors);
  const wrap = document.createElement('div');
  wrap.className = 'color-label';
  arr.forEach((c, i) => {
    wrap.appendChild(makeSwatch(c));
    const txt = document.createElement('span');
    txt.className   = 'color-name';
    txt.textContent = c;
    wrap.appendChild(txt);
    if (i < arr.length - 1) {
      const sep = document.createElement('span');
      sep.className   = 'color-sep';
      sep.textContent = '/';
      wrap.appendChild(sep);
    }
  });
  return wrap;
}

function renderGuess(char) {
  const fields = [
    { key: 'name',     isColor: false },
    { key: 'animal',   isColor: false },
    { key: 'type',     isColor: false },
    { key: 'color',    isColor: true  },
    { key: 'eyeColor', isColor: true  },
    { key: 'year',     isColor: false },
  ];

  const row = document.createElement('div');
  row.className = 'guess-row';

  const imgCell = document.createElement('div');
  imgCell.className = 'cell cell-img';
  if (char.img) {
    const img = document.createElement('img');
    img.src     = '../assets/' + char.img;
    img.alt     = char.name;
    img.onerror = () => {
      imgCell.innerHTML = '';
      const ph = document.createElement('div');
      ph.className   = 'placeholder-avatar';
      ph.textContent = char.emoji || '?';
      imgCell.appendChild(ph);
    };
    imgCell.appendChild(img);
  } else {
    const ph = document.createElement('div');
    ph.className   = 'placeholder-avatar';
    ph.textContent = char.emoji || '?';
    imgCell.appendChild(ph);
  }
  row.appendChild(imgCell);

  fields.forEach(f => {
    const cell = document.createElement('div');
    cell.className = 'cell';

    if (f.key !== 'name' && f.key === hiddenField) {
      cell.classList.add('hidden-cell');
      const lbl = document.createElement('div');
      lbl.className   = 'cell-label hidden-label';
      lbl.textContent = '???';
      cell.appendChild(lbl);
      row.appendChild(cell);
      return;
    }

    const mc = f.isColor
      ? colorMatchExtreme(char[f.key], target[f.key])
      : String(char[f.key]) === String(target[f.key]) ? 'correct' : 'wrong';
    cell.classList.add(mc);

    if (f.isColor) {
      cell.appendChild(makeColorLabel(char[f.key]));
    } else {
      const lbl = document.createElement('div');
      lbl.className   = 'cell-label';
      lbl.textContent = char[f.key]; // no year arrows in extreme
      cell.appendChild(lbl);
    }
    row.appendChild(cell);
  });

  document.getElementById('guesses-container').prepend(row);
}

// ─── Submit guess ─────────────────────────────────────────

function submitGuess(char) {
  if (gameOver) return;
  if (guesses.some(g => g.name === char.name)) {
    input.placeholder = 'Already tried that!';
    input.value = '';
    dropdown.style.display = 'none';
    return;
  }

  guesses.push(char);
  renderGuess(char);
  input.value = '';
  dropdown.style.display = 'none';
  selIdx = -1;

  if (char.name === target.name) {
    stopLoop();
    endGame(true);
  } else {
    wrongCount++;
    updateClock();
    glitchMainCam();
    if (guesses.length >= MAX_GUESSES) {
      stopLoop();
      triggerFreddyJumpscare(() => endGame(false));
    }
  }
  updateAttemptsLeft();
}

// ─── End game ─────────────────────────────────────────────

function endGame(won) {
  gameOver = true;
  input.disabled = true;
  document.getElementById('search-area').style.display = 'none';
  document.getElementById('door-btn').disabled = true;

  // Reveal target on camera
  selCamIdx = targetEntity.camIdx;
  document.getElementById('main-cam-screen').classList.add('revealed');
  renderMainCam();
  refreshCamGrid();

  const banner       = document.getElementById('result-banner');
  const titleEl      = document.getElementById('result-title');
  const msgEl        = document.getElementById('result-msg');
  const playAgainBtn = document.getElementById('play-again-btn');
  const nightJustDone = currentNight;

  banner.classList.add('show');

  if (won) {
    banner.classList.remove('lose');
    if (nightJustDone >= MAX_NIGHTS) {
      titleEl.textContent      = '🏆 All 5 Nights Complete!';
      msgEl.textContent        = `It was ${target.name}! You survived every night. Legend.`;
      playAgainBtn.textContent = '↩ Restart (Night 1)';
      currentNight = 1;
      saveNight();
    } else {
      const next = nightJustDone + 1;
      titleEl.textContent      = `🌙 Night ${nightJustDone} Survived!`;
      msgEl.textContent        = `It was ${target.name}! Night ${next} will be more intense...`;
      playAgainBtn.textContent = `▶ Continue — Night ${next}`;
      currentNight = next;
      saveNight();
    }
  } else {
    banner.classList.add('lose');
    titleEl.textContent      = '💀 6 AM — Game Over';
    msgEl.textContent        = `It was ${target.name}. Try Night ${nightJustDone} again.`;
    playAgainBtn.textContent = `↩ Retry Night ${nightJustDone}`;
    // currentNight unchanged on loss
  }

  const imgCont = document.getElementById('result-char-container');
  imgCont.innerHTML = '';
  const resImg = document.createElement('img');
  resImg.className = 'result-char-img';
  resImg.src = '../assets/' + (target.img || 'images/default.png');
  imgCont.appendChild(resImg);
}

// ─── Dropdown ─────────────────────────────────────────────

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
    item.tabIndex  = -1;
    if (char.img) {
      const img = document.createElement('img');
      img.src = '../assets/' + char.img;
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
  selIdx = -1;
}

function restartCurrent() { initGame(); }

// ─── Event listeners ──────────────────────────────────────

input.addEventListener('focus', renderDropdown);
input.addEventListener('input', renderDropdown);
input.addEventListener('keydown', e => {
  const items = Array.from(dropdown.querySelectorAll('.dropdown-item'));
  if (!items.length) return;
  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); selIdx = Math.min(selIdx + 1, items.length - 1); break;
    case 'ArrowUp':   e.preventDefault(); selIdx = Math.max(selIdx - 1, 0); break;
    case 'Enter': case 'Tab':
      if (selIdx >= 0) { items[selIdx].click(); e.preventDefault(); } break;
    case 'Escape': dropdown.style.display = 'none'; selIdx = -1; break;
  }
  items.forEach((el, i) => el.classList.toggle('selected', i === selIdx));
  if (selIdx >= 0) items[selIdx].scrollIntoView({ block: 'nearest' });
});

document.addEventListener('click', e => {
  if (!document.getElementById('search-area').contains(e.target)) {
    dropdown.style.display = 'none';
    selIdx = -1;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  currentNight = loadNight();
  document.getElementById('extreme-screen').style.display = 'block';
  initGame();
});

// ─── Util ─────────────────────────────────────────────────

const rand = (min, max) => min + Math.random() * (max - min);
