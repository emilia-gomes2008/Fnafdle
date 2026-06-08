/* =======================================================
       Extreme Mode — FNAF Night Watch
       Progressive nights · AI-based movement opportunities
       3 guesses · no year arrows · no partial colors
       Real-time clock: 4m30s per night, 45s per hour (12AM→6AM)
       Night 6: 6 animatronics, 2 corrupted fields, 2× power drain
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
    threats: [{ ai: 6 }],
  },
  { // Night 3
    targetAI: 11,
    threats: [{ ai: 9 }, { ai: 7 }],
  },
  { // Night 4
    targetAI: 14,
    threats: [{ ai: 12 }, { ai: 10 }, { ai: 8 }],
  },
  { // Night 5 — max difficulty
    targetAI: 17,
    threats: [{ ai: 15 }, { ai: 13 }, { ai: 11 }, { ai: 9 }],
  },
  { // Night 6 — EXTRA nightmare (all AI 20, 2 corrupted fields, 2× power drain)
    targetAI: 20,
    threats: [{ ai: 20 }, { ai: 20 }, { ai: 20 }, { ai: 20 }, { ai: 20 }],
    hiddenCount: 2,
    powerMult:   2,
  },
];

const MAX_NIGHTS  = 6;
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
const LAST_CAM = CAM_ROOMS.length - 1;

// ─── Game constants ───────────────────────────────────────

const MOVE_OPP_MS    = 10000;
const PASSIVE_DRAIN  = 0.10;
const MOVE_COST      = 2.0;
const DOOR_DRAIN_0   = 0.5;
const DOOR_RAMP      = 0.018;
const DOOR_DRAIN_MAX = 2.8;
const ENTRY_MS       = 4000;
const RETREAT_MIN_MS = 2500;
const RETREAT_MAX_MS = 7000;

// Night timing: 4m30s total, 45s per hour, 6 hours (12AM-5AM), death at 6AM
const NIGHT_TOTAL_MS = 270000;
const HOUR_MS        = 45000;
const HOUR_LABELS    = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM'];

const HIDEABLE_FIELDS = ['animal', 'type', 'color', 'eyeColor', 'year'];
const HEADER_IDS = {
  animal: 'header-animal', type: 'header-type',
  color: 'header-color',   eyeColor: 'header-eyecolor', year: 'header-year',
};
const HEADER_I18N = {
  animal: 'classic.colAnimal', type: 'classic.colType',
  color: 'classic.colColor',   eyeColor: 'classic.colEyeColor', year: 'classic.colYear',
};

// ─── Character pool helpers ───────────────────────────────

function pickSameAnimalChars(n) {
  if (_isAprilFools()) {
    const bots = CHARS.filter(c => c.type === 'S.T.A.F.F. Bot');
    return [...bots].sort(() => Math.random() - 0.5).slice(0, Math.min(n, bots.length));
  }
  if (n <= 1) return [...CHARS].sort(() => Math.random() - 0.5).slice(0, n);

  const byAnimal = {};
  CHARS.forEach(c => {
    const key = (c.animal || 'unknown').toLowerCase();
    if (!byAnimal[key]) byAnimal[key] = [];
    byAnimal[key].push(c);
  });

  const eligible = Object.values(byAnimal).filter(pool => pool.length >= n);
  if (!eligible.length) return [...CHARS].sort(() => Math.random() - 0.5).slice(0, n);

  const total = eligible.reduce((s, p) => s + p.length, 0);
  let r = Math.random() * total;
  let chosenPool = eligible[eligible.length - 1];
  for (const pool of eligible) {
    r -= pool.length;
    if (r <= 0) { chosenPool = pool; break; }
  }

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
let currentCfg   = null;

let target, guesses, gameOver;
let hiddenFields = [];   // array — 1 field normally, 2 on Night 6
let wrongCount   = 0;
let selIdx       = -1;
let selCamIdx    = 0;

let battery      = 99;
let doorClosed   = false;
let doorHeldFor  = 0;
let lastLoseReason  = null;
let lastNightResult = null;

let nightElapsedMs = 0;  // real-time night clock (0 → NIGHT_TOTAL_MS)

let gameLoopId   = null;
let lastTickMs   = 0;
let movOppTimer  = MOVE_OPP_MS;

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
  const cfg    = NIGHT_CONFIGS[currentNight];
  currentCfg   = cfg;

  const chars  = pickSameAnimalChars(1 + cfg.threats.length);
  target       = chars[0];

  // Determine hidden fields
  const hiddenCount    = cfg.hiddenCount || 1;
  const otherFields    = HIDEABLE_FIELDS.filter(f => f !== 'animal');
  hiddenFields         = [];

  if (hiddenCount >= 1) {
    hiddenFields.push(
      Math.random() < 0.75
        ? 'animal'
        : otherFields[Math.floor(Math.random() * otherFields.length)]
    );
  }
  if (hiddenCount >= 2) {
    const remaining = HIDEABLE_FIELDS.filter(f => !hiddenFields.includes(f));
    hiddenFields.push(remaining[Math.floor(Math.random() * remaining.length)]);
  }

  wrongCount      = 0;
  battery         = 99;
  doorClosed      = false;
  doorHeldFor     = 0;
  movOppTimer     = MOVE_OPP_MS;
  nightElapsedMs  = 0;

  // Randomise distinct start cameras for all entities, never spawning at the last camera
  const totalEntities = 1 + cfg.threats.length;
  const validCams     = Array.from({ length: LAST_CAM }, (_, i) => i); // [0 … LAST_CAM-1]
  for (let i = validCams.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [validCams[i], validCams[j]] = [validCams[j], validCams[i]];
  }
  const startCams = validCams.slice(0, totalEntities);

  targetEntity   = makeEntity(chars[0], startCams[0], cfg.targetAI);
  threatEntities = cfg.threats.map((t, i) => makeEntity(chars[i + 1], startCams[i + 1], t.ai));

  selCamIdx = 0;

  setupHeaders();
  guesses  = [];
  gameOver = false;
  selIdx   = -1;

  document.getElementById('guesses-container').innerHTML = '';
  document.getElementById('result-banner').classList.remove('show', 'lose');
  input.disabled    = false;
  input.value       = '';
  input.placeholder = T('extreme.placeholder');
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
    if (hiddenFields.includes(field)) {
      el.textContent = '???';
      el.classList.add('hidden-col');
    } else {
      el.textContent = T(HEADER_I18N[field]);
      el.classList.remove('hidden-col');
    }
  });
}

function updateNightLabel() {
  const el = document.getElementById('night-label');
  if (!el) return;
  if (currentNight === 6) {
    el.textContent = T('extreme.night6Label');
    el.style.color = '#cc1a1a';
  } else {
    el.textContent = T('extreme.nightLabel', { n: currentNight });
    el.style.color = '';
  }
}

function updateNightWarning(cfg) {
  const aiList      = [cfg.targetAI, ...cfg.threats.map(t => t.ai)].join(' / ');
  const count       = 1 + cfg.threats.length;
  const hiddenCount = cfg.hiddenCount || 1;
  const powerMult   = cfg.powerMult   || 1;
  const el          = document.getElementById('extreme-warning');
  if (!el) return;
  const animWord  = T(count      > 1 ? 'extreme.warnAnims'  : 'extreme.warnAnim');
  const fieldWord = T(hiddenCount > 1 ? 'extreme.warnFields' : 'extreme.warnField');
  let extra = '';
  if (powerMult > 1) extra = ` · ⚡ <strong>${powerMult}× ${T('extreme.warnPowerDrain')}</strong>`;
  el.innerHTML = `<strong>${T('extreme.warnNight')} ${currentNight}</strong> · <strong>${count}</strong> ${animWord} ${T('extreme.warnActive')} · AI: <strong>${aiList}</strong> · ${T('extreme.warnNoArrows')} · <strong>${hiddenCount}</strong> ${fieldWord} <strong>${T('extreme.warnCorrupted')}</strong>${extra}`;
}

// ─── Game Loop ────────────────────────────────────────────

function tick() {
  if (gameOver) return;
  const now = Date.now();
  const dt  = (now - lastTickMs) / 1000;
  lastTickMs = now;

  // Battery drain (Night 6 applies 2× multiplier)
  const mult = currentCfg?.powerMult ?? 1;
  battery -= PASSIVE_DRAIN * mult * dt;
  if (doorClosed) {
    doorHeldFor += dt;
    const rate = Math.min(
      (DOOR_DRAIN_0 + DOOR_RAMP * doorHeldFor) * mult,
      DOOR_DRAIN_MAX * mult
    );
    battery -= rate * dt;
  }
  battery = Math.max(0, battery);

  // Real-time night clock: 270 seconds total → 6 AM = death
  nightElapsedMs += dt * 1000;
  if (nightElapsedMs >= NIGHT_TOTAL_MS) {
    nightElapsedMs = NIGHT_TOTAL_MS;
    stopLoop();
    gameOver = true; input.disabled = true; dropdown.style.display = 'none';
    triggerFreddyJumpscare(() => endGame(false, 'time'));
    return;
  }

  // Movement opportunity countdown
  movOppTimer -= dt * 1000;
  if (movOppTimer <= 0) {
    movOppTimer = MOVE_OPP_MS;
    fireMovementOpportunity(now);
    flashOppTick();
    if (gameOver) return;
  }

  // Entity state timers
  for (const e of [targetEntity, ...threatEntities]) {
    processEntityTimer(e, now);
    if (gameOver) return;
  }

  if (battery <= 0) {
    battery = 0;
    stopLoop();
    updatePower();
    gameOver = true; input.disabled = true; dropdown.style.display = 'none';
    triggerFreddyJumpscare(() => endGame(false, 'battery'));
    return;
  }

  updateClock();
  updatePower();
  updateOppBar();
  refreshCamGrid();
  renderMainCam();
}

// ─── Movement Opportunity ─────────────────────────────────

function fireMovementOpportunity(now) {
  for (const e of [targetEntity, ...threatEntities]) {
    if (e.state !== 'active') continue;

    const roll = Math.ceil(Math.random() * 20);
    if (roll > e.ai) continue;

    if (e.camIdx < LAST_CAM) {
      const prev = e.camIdx;
      e.camIdx++;
      battery -= MOVE_COST;
      flashTile(prev);
      flashTile(e.camIdx);
    } else {
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
      e.state  = 'blocked';
      e.nextMs = now + rand(RETREAT_MIN_MS, RETREAT_MAX_MS);
    } else if (now >= e.nextMs) {
      stopLoop();
      gameOver = true; input.disabled = true; dropdown.style.display = 'none';
      triggerFreddyJumpscare(() => endGame(false, 'entry'));
    }
  } else if (e.state === 'blocked') {
    if (!doorClosed) {
      e.state  = 'entering';
      e.nextMs = now + ENTRY_MS;
    } else if (now >= e.nextMs) {
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
    const anyEntering = at.some(x => x.e.state === 'entering');

    tile.className = 'cam-tile'
      + (selCamIdx === i ? ' cam-selected' : '')
      + (anyEntering     ? ' cam-entering' : '');

    tile.querySelector('.cam-tile-img-wrap').innerHTML = '';
    tile.querySelector('.cam-tile-dots').innerHTML = '';
  });
}

function flashTile(camIdx) {
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
  const primary     = at[0] ?? null;
  const anyEntering = at.some(x => x.e.state === 'entering');

  labelId.textContent = cam.id;
  labelRm.textContent = cam.room.toUpperCase();

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
    btn.textContent = T('extreme.doorOpen');
    btn.className   = 'door-btn door-closed';
  } else {
    btn.textContent = T('extreme.doorClose');
    btn.className   = 'door-btn door-open';
  }
}

// ─── HUD ──────────────────────────────────────────────────

function updateClock() {
  const hourIdx = Math.min(Math.floor(nightElapsedMs / HOUR_MS), HOUR_LABELS.length - 1);
  const el      = document.getElementById('night-clock');
  if (!el) return;
  el.textContent = HOUR_LABELS[hourIdx];
  el.className   = 'night-clock'
    + (hourIdx >= 4 ? ' danger' : hourIdx >= 2 ? ' warning' : '');
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
  const el  = document.getElementById('attempts-left');
  const rem = MAX_GUESSES - guesses.length;
  if (gameOver) { el.textContent = ''; return; }
  el.textContent = T('extreme.attempts', { rem, max: MAX_GUESSES });
  el.className   = 'attempts-left' + (rem === 1 ? ' danger' : '');
}

// ─── Guess rendering ──────────────────────────────────────

function colorMatchExtreme(gVal, tVal) {
  const g = toArr(gVal).map(v => v.toLowerCase());
  const t = toArr(tVal).map(v => v.toLowerCase());
  return [...g].sort().join(',') === [...t].sort().join(',') ? 'correct' : 'wrong';
}

function makeSwatch(colorName) {
  const s    = document.createElement('span');
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
    txt.textContent = T('db.color.' + c);
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
    if (char.imgFocusFace) { img.style.objectFit = 'cover'; img.style.objectPosition = 'top center'; }
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

    if (f.key !== 'name' && hiddenFields.includes(f.key)) {
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
      lbl.className = 'cell-label';
      let val = char[f.key];
      if (f.key === 'animal' || f.key === 'type') {
        val = T('db.' + f.key + '.' + val);
      } else if (f.key === 'year' && isNaN(parseInt(val))) {
        val = T('db.year.' + val);
      }
      lbl.textContent = val;
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
    input.placeholder = T('extreme.triedAlready');
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
    glitchMainCam();
    if (guesses.length >= MAX_GUESSES) {
      stopLoop();
      gameOver = true; input.disabled = true; dropdown.style.display = 'none';
      triggerFreddyJumpscare(() => endGame(false, 'guesses'));
    }
  }
  updateAttemptsLeft();
}

// ─── End game ─────────────────────────────────────────────

function endGame(won, loseReason) {
  gameOver = true;
  input.disabled = true;
  document.getElementById('search-area').style.display = 'none';
  document.getElementById('door-btn').disabled = true;

  // If time ran out, show 6 AM on clock
  if (!won && loseReason === 'time') {
    const cl = document.getElementById('night-clock');
    if (cl) { cl.textContent = '6 AM'; cl.className = 'night-clock danger'; }
  }

  selCamIdx = targetEntity.camIdx;
  document.getElementById('main-cam-screen').classList.add('revealed');
  renderMainCam();
  refreshCamGrid();

  const banner        = document.getElementById('result-banner');
  const titleEl       = document.getElementById('result-title');
  const msgEl         = document.getElementById('result-msg');
  const playAgainBtn  = document.getElementById('play-again-btn');
  const nightJustDone = currentNight;
  lastLoseReason      = loseReason || null;

  banner.classList.add('show');

  if (won) {
    banner.classList.remove('lose');
    if (nightJustDone >= MAX_NIGHTS) {
      titleEl.textContent      = T('extreme.allComplete');
      msgEl.textContent        = T('extreme.allCompleteMsg', { name: target.name });
      playAgainBtn.textContent = T('extreme.restartNight1');
      lastNightResult          = { won: true, nightJustDone };
      currentNight = 1;
      saveNight();
    } else {
      const next = nightJustDone + 1;
      const teaser = next === 6
        ? T('extreme.teaser6')
        : T('extreme.teaser', { n: next });
      titleEl.textContent      = T('extreme.nightSurvived', { n: nightJustDone });
      msgEl.textContent        = T('extreme.nightSurvivedMsg', { name: target.name, teaser });
      playAgainBtn.textContent = T('extreme.continueNight', { n: next });
      lastNightResult          = { won: true, nightJustDone };
      currentNight = next;
      saveNight();
    }
  } else {
    banner.classList.add('lose');
    const reason = loseReason === 'time'
      ? T('extreme.loseTime')
      : loseReason === 'battery'
        ? T('extreme.loseBattery')
        : T('extreme.loseGuesses');
    titleEl.textContent      = reason;
    msgEl.textContent        = T('extreme.loseMsg', { name: target.name, n: nightJustDone });
    playAgainBtn.textContent = T('extreme.retryNight', { n: nightJustDone });
    lastNightResult          = { won: false, nightJustDone };
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
    case 'ArrowDown':
      e.preventDefault();
      selIdx = Math.min(selIdx + 1, items.length - 1);
      break;
    case 'ArrowUp':
      e.preventDefault();
      selIdx = Math.max(selIdx - 1, 0);
      break;
    case 'Enter':
      if (selIdx >= 0) { items[selIdx].click(); e.preventDefault(); }
      break;
    case 'Tab':
      if (dropdown.style.display !== 'none') {
        e.preventDefault();
        if (selIdx >= 0) {
          items[selIdx].click();
        } else {
          selIdx = 0;
          items.forEach((el, i) => el.classList.toggle('selected', i === 0));
          items[0].scrollIntoView({ block: 'nearest' });
        }
      }
      break;
    case 'Escape':
      dropdown.style.display = 'none';
      selIdx = -1;
      break;
  }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    items.forEach((el, i) => el.classList.toggle('selected', i === selIdx));
    if (selIdx >= 0) items[selIdx].scrollIntoView({ block: 'nearest' });
  }
});

document.addEventListener('click', e => {
  if (!document.getElementById('search-area').contains(e.target)) {
    dropdown.style.display = 'none';
    selIdx = -1;
  }
});

window.onLangChange = function () {
  if (!target) return;
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    const val = T(el.dataset.i18n);
    if (val.includes('<') && val.includes('>')) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });
  updateNightLabel();
  updateNightWarning(currentCfg);
  updateAttemptsLeft();
  updateDoorBtn();
  setupHeaders();
  document.getElementById('guesses-container').innerHTML = '';
  guesses.forEach(function (g) { renderGuess(g); });
  if (gameOver && lastNightResult) {
    const { won, nightJustDone } = lastNightResult;
    const titleEl      = document.getElementById('result-title');
    const msgEl        = document.getElementById('result-msg');
    const playAgainBtn = document.getElementById('play-again-btn');
    if (won) {
      if (nightJustDone >= MAX_NIGHTS) {
        titleEl.textContent      = T('extreme.allComplete');
        msgEl.textContent        = T('extreme.allCompleteMsg', { name: target.name });
        playAgainBtn.textContent = T('extreme.restartNight1');
      } else {
        const next   = nightJustDone + 1;
        const teaser = next === 6 ? T('extreme.teaser6') : T('extreme.teaser', { n: next });
        titleEl.textContent      = T('extreme.nightSurvived', { n: nightJustDone });
        msgEl.textContent        = T('extreme.nightSurvivedMsg', { name: target.name, teaser });
        playAgainBtn.textContent = T('extreme.continueNight', { n: next });
      }
    } else {
      const reason = lastLoseReason === 'time'
        ? T('extreme.loseTime')
        : lastLoseReason === 'battery'
          ? T('extreme.loseBattery')
          : T('extreme.loseGuesses');
      titleEl.textContent      = reason;
      msgEl.textContent        = T('extreme.loseMsg', { name: target.name, n: nightJustDone });
      playAgainBtn.textContent = T('extreme.retryNight', { n: nightJustDone });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  currentNight = loadNight();
  document.getElementById('extreme-screen').style.display = 'block';
  initGame();
});

// ─── Util ─────────────────────────────────────────────────

const rand = (min, max) => min + Math.random() * (max - min);
