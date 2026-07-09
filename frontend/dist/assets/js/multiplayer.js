// ── Config ────────────────────────────────────────────────────────────────────
const cfg = window.FNAF_CONFIG || {};
if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
  document.body.innerHTML = '<p style="color:#dd6d6d;font-family:monospace;padding:2rem">Missing config.js</p>';
  throw new Error('FNAF_CONFIG not set');
}
const db = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

// ── Identity ──────────────────────────────────────────────────────────────────
function randomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
let playerId = sessionStorage.getItem('mp_pid') || randomUUID();
sessionStorage.setItem('mp_pid', playerId);

// ── State ─────────────────────────────────────────────────────────────────────
let roomId = null;
let playerSlot = null;
let roomData = null;
let myChar = null;
let gameInit = false;
let selectionShown = false;
let activeElimTarget = null; // which opponent's elimination board is shown
let elimFilterState = {};   // per-opponent filter values { slot: { search, type, animal, year } }

// ── Multi-player helpers ──────────────────────────────────────────────────────
function getPlayerCount() { return (roomData && roomData.player_count) || 2; }
function allSlots(n) { return ['player1', 'player2', 'player3', 'player4'].slice(0, n !== undefined ? n : getPlayerCount()); }
function otherSlots() { return allSlots().filter(s => s !== playerSlot); }
function parsePhase(phase) {
  if (!phase) return { action: null, asker: null, target: null };
  const parts = phase.split(':');
  return { action: parts[0] || null, asker: parts[1] || null, target: parts[2] || null };
}
function getGuessedChars() { try { return JSON.parse(roomData.guessed_chars) || {}; } catch { return {}; } }
function getTurnOrder() { try { return JSON.parse(roomData.turn_order) || allSlots(); } catch { return allSlots(); } }
function nextAskerSlot(cur) {
  const order = getTurnOrder();
  const idx = order.indexOf(cur);
  return order[(idx + 1) % order.length];
}
function checkWin(slot) {
  const g = getGuessedChars();
  return g[slot] && g[slot].length >= getPlayerCount() - 1;
}
function getRankings() { try { return JSON.parse(roomData.rankings) || []; } catch { return []; } }
function ordinal(n) { return n === 1 ? '<span class="e">🥇</span> 1st' : n === 2 ? '<span class="e">🥈</span> 2nd' : n === 3 ? '<span class="e">🥉</span> 3rd' : `${n}th`; }
function rankMedal(slot) {
  const r = getRankings();
  const i = r.indexOf(slot);
  return ['<span class="e">🥇</span>', '<span class="e">🥈</span>', '<span class="e">🥉</span>', '<span class="e">4️⃣</span>'][i] ?? '';
}
function updateWaitingPlayerList(room) {
  const pc = room.player_count || 2;
  const listEl = document.getElementById('waiting-players');
  if (!listEl) return;
  listEl.innerHTML = '';
  allSlots(pc).forEach((s, i) => {
    const name = room[`${s}_name`];
    const li = document.createElement('div');
    li.className = 'waiting-player-row';
    li.innerHTML = name ? `<span class="mp_emoji">✅</span> ${name}` : `<span class="mp_emoji">⏳</span> Player ${i + 1}...`;
    li.style.color = name ? 'var(--green-text)' : 'var(--text-muted)';
    listEl.appendChild(li);
  });
  const joined = allSlots(pc).filter(s => room[`${s}_name`]).length;
  const titleEl = document.getElementById('waiting-title');
  if (titleEl) titleEl.textContent = joined >= pc ? 'All players joined!' : `Waiting for players... (${joined}/${pc})`;
  const rnEl = document.getElementById('waiting-room-name');
  if (rnEl && room.room_name) rnEl.textContent = room.room_name;
  updateStartEarlyBtn(room);
}

// ── Game filter ───────────────────────────────────────────────────────────────
const GAMES = [
  { name: "Five Nights at Freddy's", start: 0, end: 9 },
  { name: "Five Nights at Freddy's 2", start: 10, end: 32 },
  { name: "Five Nights at Freddy's 3", start: 33, end: 45 },
  { name: "Five Nights at Freddy's 4", start: 46, end: 69 },
  { name: 'FNAF World', start: 70, end: 147 },
  { name: "Five Nights at Freddy's: Sister Location", start: 148, end: 167 },
  { name: "Freddy Fazbear's Pizzeria Simulator", start: 168, end: 218 },
  { name: 'Ultimate Custom Night', start: 219, end: 233 },
  { name: "Five Nights at Freddy's: Help Wanted", start: 234, end: 250 },
  { name: "Five Nights at Freddy's: Special Delivery", start: 251, end: 251 },
  { name: "Five Nights at Freddy's: Security Breach", start: 252, end: 292 },
  { name: "Five Nights at Freddy's: Security Breach - RUIN", start: 293, end: 311 },
  { name: "Five Nights at Freddy's: Help Wanted 2", start: 312, end: 319 },
  { name: "Five Nights at Freddy's: Secret of the Mimic", start: 320, end: 376 },
];

// Per-game filter checkbox colors (mirrors the TCG class colors where applicable)
const GAME_COLORS = [
  '#7ad',    // 0  FNAF 1                     - Classic
  '#c84',    // 1  FNAF 2                     - Withered
  '#4caf50', // 2  FNAF 3                     - Green
  '#d44',    // 3  FNAF 4                     - Nightmare (Jack-O subtype overridden below)
  '#fff',    // 4  FNAF World
  '#ff6699', // 5  Sister Location             - pink
  '#a62',    // 6  FNAF 6                     - Scrap
  '#C88600', // 7  Ultimate Custom Night      - gold
  '#5b3fa8', // 8  Help Wanted                - purple (darker)
  '#88ccff', // 9  FNAF AR / Special Delivery - light blue
  '#00d4ff', // 10 Security Breach            - neon blue
  '#1c0e22', // 11 Security Breach: Ruin      - darker purplish black
  '#6a0dad', // 12 Help Wanted 2              - vibrant purple (darker)
  '#ff8000', // 13 Secret of the Mimic        - pure orange
];
const JACKO_COLOR = '#e84';   // FNAF 4 Halloween Edition (Jack-O subtype)
const SHADOW_COLOR = '#2a1235'; // "Shadow" type characters (dark purple), any game

// Dee Dee (121) and Old Man Consequences (122) are FNAF World chars that also appear in UCN
const WORLD_UCN_CHARS = [131, 132];
const GAME_IDX_WORLD = 4;
const GAME_IDX_UCN = 7;

// Map each character object to its game's name (by original CHARS index range)
const CHAR_GAME = new Map();
const CHAR_GAME_COLOR = new Map();
CHARS.forEach((c, i) => {
  const g = GAMES.find(g => i >= g.start && i <= g.end);
  CHAR_GAME.set(c, g ? g.name : '');
  const gi = g ? GAMES.indexOf(g) : -1;
  const color = gi === 3 && c.type === 'Jack-O' ? JACKO_COLOR
    : c.type === 'Shadow' ? SHADOW_COLOR
    : GAME_COLORS[gi];
  if (color) CHAR_GAME_COLOR.set(c, color);
});

function getFilteredChars() {
  const filter = roomData && roomData.game_filter;
  if (!filter) return CHARS;

  // Rich format: { games:[...], gameTypes:{gi:[types]} }
  if (filter.startsWith('{')) {
    const { games, gameTypes } = JSON.parse(filter);
    const hasUCN = games.includes(GAME_IDX_UCN);
    const hasWorld = games.includes(GAME_IDX_WORLD);
    return CHARS.filter((c, i) => {
      const matched = games.find(gi => i >= GAMES[gi].start && i <= GAMES[gi].end);
      if (matched === undefined) {
        if (hasUCN && !hasWorld && WORLD_UCN_CHARS.includes(i)) return true;
        return false;
      }
      if (gameTypes && gameTypes[matched] && gameTypes[matched].length > 0)
        return gameTypes[matched].includes(c.type);
      return true;
    });
  }

  // Simple array format: [0,1,2,...]
  if (filter.startsWith('[')) {
    const included = JSON.parse(filter);
    const hasUCN = included.includes(GAME_IDX_UCN);
    const hasWorld = included.includes(GAME_IDX_WORLD);
    return CHARS.filter((_, i) => {
      if (included.some(gi => i >= GAMES[gi].start && i <= GAMES[gi].end)) return true;
      if (hasUCN && !hasWorld && WORLD_UCN_CHARS.includes(i)) return true;
      return false;
    });
  }

  // Legacy "from-to" range
  const [from, to] = filter.split('-').map(Number);
  const s = GAMES[from].start, e = GAMES[to].end;
  return CHARS.filter((_, i) => i >= s && i <= e);
}

function getFilterVal() {
  if (document.getElementById('filter-all').checked) return null;
  const includedGames = [];
  const gameTypes = {};

  document.querySelectorAll('.filter-game-checkbox').forEach(cb => {
    if (!cb.checked) return;
    const gi = parseInt(cb.value);
    includedGames.push(gi);
    const allSubs = document.querySelectorAll(`.filter-subtype-checkbox[data-game="${gi}"]`);
    if (allSubs.length === 0) return;
    const checked = [...document.querySelectorAll(`.filter-subtype-checkbox[data-game="${gi}"]:checked`)].map(c => c.value);
    if (checked.length < allSubs.length) gameTypes[gi] = checked;
  });

  if (includedGames.length === GAMES.length && Object.keys(gameTypes).length === 0) return null;
  if (Object.keys(gameTypes).length === 0) return JSON.stringify(includedGames);
  return JSON.stringify({ games: includedGames, gameTypes });
}

function filterLabel(filter) {
  if (!filter) return 'All games';

  let games;
  let hasCustomTypes = false;
  if (filter.startsWith('{')) {
    const parsed = JSON.parse(filter);
    games = parsed.games || [];
    hasCustomTypes = parsed.gameTypes && Object.keys(parsed.gameTypes).length > 0;
  } else if (filter.startsWith('[')) {
    games = JSON.parse(filter);
  } else {
    const [from, to] = filter.split('-').map(Number);
    return from === to ? GAMES[from].name : `${GAMES[from].name} → ${GAMES[to].name}`;
  }

  if (games.length === 0) return 'No games';
  const sorted = [...games].sort((a, b) => a - b);
  if (sorted.length === 1) return GAMES[sorted[0]].name + (hasCustomTypes ? ' ✦' : '');
  const isConsec = sorted.every((v, i) => i === 0 || v === sorted[i - 1] + 1);
  let label = `${GAMES[sorted[0]].name} → ${GAMES[sorted[sorted.length - 1]].name}`;
  if (!isConsec) label += ` (${sorted.length} games)`;
  if (hasCustomTypes) label += ' ✦';
  return label;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const SCREENS = ['lobby', 'waiting', 'selection', 'game', 'result'];
function showScreen(name) {
  SCREENS.forEach(id => {
    const el = document.getElementById('screen-' + id);
    if (el) el.style.display = id === name ? '' : 'none';
  });
  document.getElementById('multiplayer-screen')?.classList.toggle('wide-screen', name === 'game');
}

function lobbyError(msg) { document.getElementById('lobby-error').textContent = msg; }
function genCode() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }
function escHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ── Create / Join ─────────────────────────────────────────────────────────────
function showCreatePanel() {
  const name = document.getElementById('lobby-name').value.trim();
  if (!name) return lobbyError('Enter your name first.');
  lobbyError('');

  document.getElementById('create-room-code').textContent = genCode();
  document.getElementById('create-room-name').value = '';
  const pubRadio = document.querySelector('input[name="mp-privacy"][value="public"]');
  if (pubRadio) pubRadio.checked = true;

  document.getElementById('lobby-buttons').style.display = 'none';
  document.getElementById('create-room-panel').style.display = '';
  document.getElementById('public-lobby-section').style.display = 'none';
}

function cancelCreateRoom() {
  document.getElementById('lobby-buttons').style.display = '';
  document.getElementById('create-room-panel').style.display = 'none';
  document.getElementById('public-lobby-section').style.display = '';
}

async function confirmCreateRoom() {
  const name = document.getElementById('lobby-name').value.trim();
  if (!name) return lobbyError('Enter your name first.');
  if (window.mpChatContainsHate?.(name)) return lobbyError('Name not allowed.');

  const code = document.getElementById('create-room-code').textContent;
  const roomName = document.getElementById('create-room-name').value.trim() || `${name}'s Room`;
  if (window.mpChatContainsHate?.(roomName)) return lobbyError('Room name not allowed.');
  const isPrivate = document.querySelector('input[name="mp-privacy"]:checked')?.value === 'private';
  const pc = parseInt(document.querySelector('input[name="player-count"]:checked')?.value || '2');

  const { data, error } = await db.from('mp_rooms').insert({
    room_code: code, state: 'waiting',
    player1_id: playerId, player1_name: name,
    game_filter: getFilterVal(), player_count: pc,
    room_name: roomName, is_private: isPrivate,
  }).select().single();

  if (error) {
    console.error('[confirmCreateRoom]', error);
    cancelCreateRoom();
    return lobbyError(`Could not create room: ${error.message || error.code || 'unknown error'}`);
  }

  roomId = data.id; playerSlot = 'player1'; roomData = data;
  document.getElementById('waiting-code').textContent = data.room_code;
  document.getElementById('waiting-filter-label').innerHTML = '<span class="mp_emoji">🎮</span> ' + filterLabel(data.game_filter);
  const rnEl = document.getElementById('waiting-room-name');
  if (rnEl) rnEl.textContent = data.room_name || '';
  updateWaitingPlayerList(data);
  cancelCreateRoom();
  showScreen('waiting');
  subscribeRoom();
}

async function joinRoom() {
  const name = document.getElementById('lobby-name').value.trim();
  const code = document.getElementById('lobby-code').value.trim().toUpperCase();
  if (!name) return lobbyError('Enter your name first.');
  if (window.mpChatContainsHate?.(name)) return lobbyError('Name not allowed.');
  if (code.length < 6) return lobbyError('Enter the full 6-character code.');

  const { data: room, error } = await db.from('mp_rooms').select('*').eq('room_code', code).eq('state', 'waiting').single();
  if (error || !room) return lobbyError('Room not found or already started.');

  const pc = room.player_count || 2;
  let slot;
  if (!room.player2_id) slot = 'player2';
  else if (pc >= 3 && !room.player3_id) slot = 'player3';
  else if (pc >= 4 && !room.player4_id) slot = 'player4';
  else return lobbyError('Room is full.');

  const isLast = slot === `player${pc}`;
  const update = {
    [`${slot}_id`]: playerId, [`${slot}_name`]: name,
    ...(isLast ? { state: 'selecting' } : {}),
  };

  const { data, error: err2 } = await db.from('mp_rooms').update(update).eq('id', room.id).select().single();
  if (err2) return lobbyError('Could not join. Try again.');

  roomId = room.id; playerSlot = slot; roomData = data;
  subscribeRoom(); subscribeEvents();

  if (isLast) {
    selectionShown = true;
    showSelectionScreen();
  } else {
    document.getElementById('waiting-code').textContent = room.room_code;
    document.getElementById('waiting-filter-label').textContent = '🎮 ' + filterLabel(room.game_filter);
    const rnEl = document.getElementById('waiting-room-name');
    if (rnEl) rnEl.textContent = room.room_name || '';
    updateWaitingPlayerList(data);
    showScreen('waiting');
    selectionShown = false;
  }
}

// ── Public Lobby ──────────────────────────────────────────────────────────────
async function loadPublicLobby() {
  const listEl = document.getElementById('public-lobby-list');
  if (!listEl) return;
  listEl.innerHTML = '<div class="lobby-empty">Loading...</div>';

  let data, error;
  ({ data, error } = await db.from('mp_rooms')
    .select('id, room_code, room_name, player_count, player1_name, player2_name, player3_name, player4_name')
    .eq('state', 'waiting')
    .or('is_private.eq.false,is_private.is.null')
    .order('created_at', { ascending: false })
    .limit(10));

  if (error) {
    ({ data, error } = await db.from('mp_rooms')
      .select('id, room_code, player_count, player1_name, player2_name, player3_name, player4_name')
      .eq('state', 'waiting')
      .order('created_at', { ascending: false })
      .limit(10));
  }

  if (error || !data) { listEl.innerHTML = '<div class="lobby-empty">Could not load rooms</div>'; return; }
  renderPublicLobby(data);
}

function renderPublicLobby(rooms) {
  const listEl = document.getElementById('public-lobby-list');
  if (!listEl) return;
  if (!rooms.length) { listEl.innerHTML = '<div class="lobby-empty">No public rooms available</div>'; return; }

  listEl.innerHTML = '';
  let anyShown = false;
  rooms.forEach(r => {
    const pc = r.player_count || 2;
    const joined = ['player1', 'player2', 'player3', 'player4'].slice(0, pc)
      .filter(s => r[`${s}_name`]).length;
    if (joined === 0) return;
    anyShown = true;
    const name = r.room_name || (r.player1_name ? `${r.player1_name}'s Room` : 'Room');

    const entry = document.createElement('div');
    entry.className = 'lobby-room-entry';
    entry.innerHTML = `
      <div class="lobby-room-info">
        <div class="lobby-room-name">${escHtml(name)}</div>
        <div class="lobby-room-meta">${joined}/${pc} players · Guess Who?</div>
      </div>
      <div class="lobby-room-code">${r.room_code}</div>
      <button class="mp-btn small" onclick="joinFromLobby('${r.room_code}')">Join</button>
    `;
    listEl.appendChild(entry);
  });
  if (!anyShown) listEl.innerHTML = '<div class="lobby-empty">No public rooms available</div>';
}

function joinFromLobby(code) {
  const codeInput = document.getElementById('lobby-code');
  if (codeInput) codeInput.value = code;
  joinRoom();
}

// ── Start Early ───────────────────────────────────────────────────────────────
function updateStartEarlyBtn(room) {
  const btn = document.getElementById('start-early-btn');
  if (!btn) return;
  const pc = room.player_count || 2;
  const joined = allSlots(pc).filter(s => room[`${s}_name`]).length;
  if (playerSlot === 'player1' && joined >= 2 && joined < pc) {
    btn.style.display = '';
    btn.textContent = `Start with ${joined} players`;
    btn.disabled = false;
  } else {
    btn.style.display = 'none';
  }
}

async function startEarlyMultiplayer() {
  if (playerSlot !== 'player1') return;
  const pc = roomData.player_count || 2;
  const joined = allSlots(pc).filter(s => roomData[`${s}_name`]).length;
  if (joined < 2) return;
  const btn = document.getElementById('start-early-btn');
  if (btn) btn.disabled = true;
  await db.from('mp_rooms').update({ state: 'selecting', player_count: joined }).eq('id', roomId);
}

// ── Subscriptions ─────────────────────────────────────────────────────────────
function subscribeRoom() {
  db.channel('room:' + roomId)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'mp_rooms', filter: `id=eq.${roomId}` },
      ({ new: room }) => handleRoomUpdate(room))
    .subscribe();
}

function subscribeEvents() {
  db.channel('events:' + roomId)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mp_events', filter: `room_id=eq.${roomId}` },
      ({ new: ev }) => renderEvent(ev))
    .subscribe();
}

function announceNewRankings(oldRoom, newRoom) {
  if (!gameInit) return;
  let oldR = []; try { oldR = JSON.parse(oldRoom?.rankings) || []; } catch { }
  let newR = []; try { newR = JSON.parse(newRoom?.rankings) || []; } catch { }
  newR.forEach((slot, idx) => {
    if (oldR.includes(slot)) return;
    const pName = newRoom[`${slot}_name`] || slot;
    window.mpChatSystemMsg?.(`<strong><span class="e">🏆</span> ${escHtml(pName)} finished in ${ordinal(idx + 1)}!</strong>`);
  });
}

function handleRoomUpdate(room) {
  const prevState = roomData ? roomData.state : null;
  const prevRoom = roomData;
  announceNewRankings(prevRoom, room);
  roomData = room;

  if (room.state === 'waiting') {
    updateWaitingPlayerList(room);
  } else if (room.state === 'selecting') {
    if (prevState === 'finished' || prevState === 'playing' || prevState === 'waiting') {
      gameInit = false; myChar = null; selectionShown = false;
      if (prevState === 'finished') refreshMpPlayerSlot(room); // slot may have changed on rematch
    }
    if (!selectionShown) {
      if (playerSlot === 'player1') subscribeEvents();
      selectionShown = true;
      showSelectionScreen();
    }
  } else if (room.state === 'playing') {
    // If other player left and only 1 active, end the game
    const activeCount = allSlots(getPlayerCount()).filter(s => room[`${s}_name`]).length;
    if (activeCount <= 1 && gameInit) { renderResultScreen(room); return; }
    if (!gameInit) renderGameScreen(room);
    else updateTurnUI(room.phase, room.current_question);
  } else if (room.state === 'finished') {
    renderResultScreen(room); // also re-renders when vote count changes
  }
}

// ── Copy code ─────────────────────────────────────────────────────────────────
document.getElementById('copy-code-btn').addEventListener('click', () => {
  const code = document.getElementById('waiting-code').textContent;
  const btn = document.getElementById('copy-code-btn');
  const confirm = () => { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Copy Code'; }, 2000); };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(confirm);
  } else {
    const el = document.createElement('textarea');
    el.value = code; el.style.position = 'fixed'; el.style.opacity = '0';
    document.body.appendChild(el); el.select(); document.execCommand('copy');
    document.body.removeChild(el); confirm();
  }
});

// ── Selection screen ──────────────────────────────────────────────────────────
function buildCharGrid(containerEl, onSelect, allowMultiple = false) {
  const pool = getFilteredChars().filter(c => c.img);
  containerEl.innerHTML = '';
  let lastGame = null;
  pool.forEach(char => {
    const game = CHAR_GAME.get(char) || '';
    if (lastGame !== null && game !== lastGame) {
      const brk = document.createElement('div');
      brk.className = 'char-grid-gamebreak';
      containerEl.appendChild(brk);
    }
    lastGame = game;

    const card = document.createElement('div');
    card.className = 'char-grid-card';
    card.dataset.name = char.name;
    card.dataset.animal = char.animal || '';
    card.dataset.type = char.type || '';
    card.dataset.game = CHAR_GAME.get(char) || '';
    const gameColor = CHAR_GAME_COLOR.get(char);
    if (gameColor) card.style.setProperty('--game-color', gameColor);
    const img = document.createElement('img');
    img.src = '../assets/' + char.img;
    img.alt = char.name;
    img.onerror = () => { img.src = '../assets/images/default.png'; };
    if (char.imgFocusFace) { img.style.objectFit = 'cover'; img.style.objectPosition = 'top center'; }
    const lbl = document.createElement('div');
    lbl.className = 'char-grid-name';
    lbl.textContent = char.name;
    card.append(img, lbl);
    card.addEventListener('click', () => onSelect(char, card));
    containerEl.appendChild(card);
  });
}

function showSelectionScreen() {
  showScreen('selection');
  myChar = null;
  document.getElementById('confirm-selection-btn').disabled = true;
  document.getElementById('selection-status').textContent = '';
  document.getElementById('selection-chosen').style.display = 'none';

  const grid = document.getElementById('selection-grid');
  buildCharGrid(grid, (char, card) => {
    grid.querySelectorAll('.char-grid-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    myChar = char;
    document.getElementById('confirm-selection-btn').disabled = false;
    const img = document.getElementById('selection-chosen-img');
    img.src = '../assets/' + char.img;
    document.getElementById('selection-chosen-name').textContent = char.name;
    document.getElementById('selection-chosen').style.display = 'flex';
  });

  // Search filter
  const search = document.getElementById('selection-search');
  search.value = '';
  search.oninput = () => filterCharGrid(grid, search.value);
}

function filterCharGrid(grid, q, opts = {}) {
  const lq = q ? q.toLowerCase() : '';
  const fAni = opts.animal ? opts.animal.toLowerCase() : '';
  const fTyp = opts.type ? opts.type.toLowerCase() : '';
  const fGame = opts.game ? opts.game.toLowerCase() : '';
  grid.querySelectorAll('.char-grid-card').forEach(card => {
    const ok = (!lq || card.dataset.name.toLowerCase().includes(lq))
      && (!fAni || card.dataset.animal.toLowerCase() === fAni)
      && (!fTyp || card.dataset.type.toLowerCase() === fTyp)
      && (!fGame || card.dataset.game.toLowerCase() === fGame);
    card.style.display = ok ? '' : 'none';
  });
}

function getActiveElimGrid() {
  const id = activeElimTarget ? `elim-grid-${activeElimTarget}` : 'elim-grid';
  return document.getElementById(id) || document.getElementById('elim-grid');
}

function saveElimFilterState() {
  if (!activeElimTarget) return;
  elimFilterState[activeElimTarget] = {
    search: document.getElementById('elim-search').value,
    type: document.getElementById('elim-type').value,
    animal: document.getElementById('elim-animal').value,
    game: document.getElementById('elim-game').value,
  };
}

function restoreElimFilterState(slot) {
  const s = elimFilterState[slot] || {};
  document.getElementById('elim-search').value = s.search || '';
  document.getElementById('elim-type').value = s.type || '';
  document.getElementById('elim-animal').value = s.animal || '';
  document.getElementById('elim-game').value = s.game || '';
}

function selectElimTarget(slot) {
  if (!slot || slot === activeElimTarget) return;
  const opponents = otherSlots();
  if (!opponents.includes(slot)) return;
  saveElimFilterState();
  opponents.forEach(s => {
    const g = document.getElementById(`elim-grid-${s}`);
    if (g) g.style.display = s === slot ? '' : 'none';
  });
  const tabsEl = document.getElementById('elim-player-tabs');
  if (tabsEl) {
    const idx = opponents.indexOf(slot);
    tabsEl.querySelectorAll('.elim-player-tab').forEach((t, j) => t.classList.toggle('active', j === idx));
  }
  activeElimTarget = slot;
  restoreElimFilterState(slot);
  applyElimFilters();
}

function applyElimFilters() {
  filterCharGrid(
    getActiveElimGrid(),
    document.getElementById('elim-search').value,
    {
      animal: document.getElementById('elim-animal').value,
      type: document.getElementById('elim-type').value,
      game: document.getElementById('elim-game').value,
    }
  );
}

document.getElementById('confirm-selection-btn').addEventListener('click', async () => {
  if (!myChar) return;
  document.getElementById('confirm-selection-btn').disabled = true;
  document.getElementById('selection-status').textContent = 'Waiting for others to choose...';

  const update = { [`${playerSlot}_char`]: myChar.name, [`${playerSlot}_ready`]: true };
  const { data } = await db.from('mp_rooms').update(update).eq('id', roomId).select().single();
  roomData = data;

  const pc = data.player_count || 2;
  const slots = allSlots(pc);
  const allReady = slots.every(s => data[`${s}_ready`]);

  if (allReady) {
    // Dice roll: each player gets a random score, highest goes first
    const rolls = {};
    slots.forEach(s => { rolls[s] = Math.random(); });
    const turnOrder = [...slots].sort((a, b) => rolls[b] - rolls[a]);

    const guessedChars = {};
    slots.forEach(s => { guessedChars[s] = []; });

    const rollMsg = turnOrder.map((s, i) =>
      `${data[`${s}_name`] || s}: ${(rolls[s] * 100 | 0)}`).join(', ');

    const { data: gameData } = await db.from('mp_rooms').update({
      state: 'playing',
      phase: `ask:${turnOrder[0]}`,
      current_question: null,
      first_asker: turnOrder[0],
      turn_order: JSON.stringify(turnOrder),
      guessed_chars: JSON.stringify(guessedChars),
    }).eq('id', roomId).select().single();

    roomData = gameData;
    renderGameScreen(gameData, rollMsg);
  }
});

// ── Inactivity timer (3 min AFK → leave room) ────────────────────────────────
let _gwInactivityInterval = null;
let _gwLastActivity = 0;
const GW_INACTIVITY_LIMIT = 180;

function _gwStartInactivityTimer() {
  if (_gwInactivityInterval) return; // already running
  _gwLastActivity = Date.now();
  _gwInactivityInterval = setInterval(() => {
    if (!roomId || !playerSlot) { _gwStopInactivityTimer(); return; }
    const elapsed = (Date.now() - _gwLastActivity) / 1000;
    const remaining = Math.ceil(GW_INACTIVITY_LIMIT - elapsed);
    const el = document.getElementById('turn-timer');
    if (remaining <= 0) {
      _gwStopInactivityTimer();
      window.goHome();
      return;
    }
    if (el) {
      if (remaining <= 60) {
        el.style.display = '';
        el.style.color = remaining <= 20 ? '#e74c3c' : remaining <= 40 ? '#e87416' : '#fa0';
        el.textContent = `⏱ AFK: ${remaining}s`;
      } else {
        el.style.display = 'none';
      }
    }
  }, 500);
}

function _gwStopInactivityTimer() {
  if (_gwInactivityInterval) { clearInterval(_gwInactivityInterval); _gwInactivityInterval = null; }
  const el = document.getElementById('turn-timer');
  if (el) el.style.display = 'none';
}

document.addEventListener('click', () => { if (_gwInactivityInterval) _gwLastActivity = Date.now(); });
document.addEventListener('touchstart', () => { if (_gwInactivityInterval) _gwLastActivity = Date.now(); }, { passive: true });

// ── Periodic sync ─────────────────────────────────────────────────────────────
let _syncTimer = null;

function startPeriodicSync() {
  stopPeriodicSync();
  _syncTimer = setInterval(async () => {
    if (!roomId || !roomData) return;
    const { data } = await db.from('mp_rooms').select('*').eq('id', roomId).single();
    if (!data) return;
    if (data.phase !== roomData.phase ||
      data.state !== roomData.state ||
      data.current_question !== roomData.current_question) {
      handleRoomUpdate(data);
    }
  }, 7000);
}

function stopPeriodicSync() {
  if (_syncTimer) { clearInterval(_syncTimer); _syncTimer = null; }
}

async function resyncGameState() {
  if (!roomId) return;
  const btn = document.getElementById('resync-btn');
  if (btn) { btn.textContent = '⟳ ...'; btn.disabled = true; }
  const { data } = await db.from('mp_rooms').select('*').eq('id', roomId).single();
  if (data) handleRoomUpdate(data);
  if (btn) { btn.textContent = '⟳ Sync'; btn.disabled = false; }
}

// ── Game screen ───────────────────────────────────────────────────────────────
function renderGameScreen(room, rollMsg) {
  if (gameInit) return;
  gameInit = true;
  startPeriodicSync();
  showScreen('game');

  if (typeof initMpChat === 'function') {
    initMpChat(roomId, 'mp', room[`${playerSlot}_name`] || playerSlot, 'mp-chat-container');
  }

  // Clear leftovers from previous game
  guessInput.value = '';
  guessDropdown.style.display = 'none';
  guessSelectedIndex = -1;

  // My char badge
  const badge = document.getElementById('my-char-badge');
  badge.style.display = 'flex';
  const bImg = document.getElementById('my-char-badge-img');
  bImg.src = '../assets/' + myChar.img;
  document.getElementById('my-char-badge-name').textContent = myChar.name;

  // Dice roll result
  const firstAsker = room.first_asker || 'player1';
  const firstName = room[`${firstAsker}_name`] || 'Player 1';
  const diceMsg = rollMsg
    ? `<span class="e">🎲</span> Dice roll! (${rollMsg}) - <strong>${escHtml(firstName)}</strong> goes first.`
    : `<span class="e">🪙</span> Coin flip! <strong>${escHtml(firstName)}</strong> goes first.`;
  window.mpChatSystemMsg?.(diceMsg);

  // Build one elimination grid per opponent
  const opponents = otherSlots();
  const gridContainer = document.getElementById('elim-grid-container');
  const tabsEl = document.getElementById('elim-player-tabs');
  gridContainer.innerHTML = '';
  tabsEl.innerHTML = '';
  activeElimTarget = opponents[0] || null;
  elimFilterState = {};
  opponents.forEach(s => { elimFilterState[s] = { search: '', type: '', animal: '', year: '' }; });

  opponents.forEach((slot, i) => {
    const grid = document.createElement('div');
    grid.id = `elim-grid-${slot}`;
    grid.className = 'elim-grid';
    grid.style.display = i === 0 ? '' : 'none';
    buildCharGrid(grid, (char, card) => { card.classList.toggle('eliminated'); });
    gridContainer.appendChild(grid);
  });

  // Keep legacy #elim-grid pointing to first grid for compatibility
  if (!document.getElementById('elim-grid')) {
    const alias = document.createElement('div');
    alias.id = 'elim-grid';
    alias.style.display = 'none';
    gridContainer.appendChild(alias);
  }

  // Player tabs (only for 3+ players)
  if (opponents.length > 1) {
    tabsEl.style.display = '';
    opponents.forEach((slot, i) => {
      const tab = document.createElement('button');
      tab.className = 'elim-player-tab' + (i === 0 ? ' active' : '');
      tab.textContent = roomData[`${slot}_name`] || slot;
      tab.addEventListener('click', () => selectElimTarget(slot));
      tabsEl.appendChild(tab);
    });
  } else {
    tabsEl.style.display = 'none';
  }

  // Populate advanced filter selects from the active character pool
  const pool = getFilteredChars().filter(c => c.img);
  const types = [...new Set(pool.map(c => c.type).filter(Boolean))].sort();
  const animals = [...new Set(pool.map(c => c.animal).filter(Boolean))].sort();
  const games = GAMES.map(g => g.name).filter(n => pool.some(c => CHAR_GAME.get(c) === n));
  const typeEl = document.getElementById('elim-type');
  const animalEl = document.getElementById('elim-animal');
  const gameEl = document.getElementById('elim-game');
  typeEl.innerHTML = '<option value="">All types</option>';
  animalEl.innerHTML = '<option value="">All animals</option>';
  gameEl.innerHTML = '<option value="">All games</option>';
  types.forEach(t => typeEl.add(new Option(t, t)));
  animals.forEach(a => animalEl.add(new Option(a, a)));
  games.forEach(g => gameEl.add(new Option(g, g)));

  // Elim search + advanced filters
  document.getElementById('elim-search').oninput = applyElimFilters;
  document.getElementById('elim-type').onchange = applyElimFilters;
  document.getElementById('elim-animal').onchange = applyElimFilters;
  document.getElementById('elim-game').onchange = applyElimFilters;
  document.getElementById('elim-adv-btn').onclick = () => {
    const adv = document.getElementById('elim-advanced');
    adv.style.display = adv.style.display === 'none' ? '' : 'none';
  };
  document.getElementById('elim-clear-filters').onclick = () => {
    if (activeElimTarget) elimFilterState[activeElimTarget] = {};
    document.getElementById('elim-search').value = '';
    document.getElementById('elim-type').value = '';
    document.getElementById('elim-animal').value = '';
    document.getElementById('elim-game').value = '';
    applyElimFilters();
  };

  updateTurnUI(room.phase, room.current_question);
}

// ── Act-phase auto-pass timer ─────────────────────────────────────────────────
const GW_ACT_TIMEOUT = 120000; // 2 minutes
let _actTimer = null;
function _clearActTimer() { if (_actTimer) { clearTimeout(_actTimer); _actTimer = null; } }
function _startActTimer() {
  _clearActTimer();
  _actTimer = setTimeout(() => { passRound(); }, GW_ACT_TIMEOUT);
}

// ── Guess Who hooks into the shared floating chat widget (mp-chat.js) ────────
// Asking and answering both happen through the normal chat: the asker uses the
// ❓ button (mpChatShowAsk), and the answer is just a normal reply to the
// question message (mpChatOnMessage tells us when that reply was sent).
window.mpChatOnMessage = function (info) {
  if (!roomData || !roomId) return;
  const { action, asker, target } = parsePhase(roomData.phase);

  // I just asked a question (only I act on my own outgoing message)
  if (info.askMeta && info.isMine && action === 'ask' && asker === playerSlot) {
    const askTarget = info.askMeta.toSlot || otherSlots()[0];
    (async () => {
      const nextPhase = `answer:${playerSlot}:${askTarget}`;
      const { data } = await db.from('mp_rooms').update({
        phase: nextPhase, current_question: '_free:' + info.text,
      }).eq('id', roomId).eq('phase', `ask:${playerSlot}`).select().single();
      if (data) { roomData = data; updateTurnUI(nextPhase, roomData.current_question); }
    })();
    return;
  }

  // The current target replied to the asker's question - that reply IS the answer
  if (info.replyMeta && action === 'answer' && target === playerSlot) {
    const askerName = roomData[`${asker}_name`] || asker;
    if (info.replyMeta.u !== askerName) return; // reply to someone/something else - just banter
    (async () => {
      const nextPhase = `act:${asker}:${target}`;
      const { data } = await db.from('mp_rooms').update({ phase: nextPhase })
        .eq('id', roomId).eq('phase', `answer:${asker}:${target}`).select().single();
      if (data) { roomData = data; updateTurnUI(nextPhase, roomData.current_question); }
    })();
  }
};

// ── Turn UI ───────────────────────────────────────────────────────────────────
async function updateTurnUI(phase, questionField) {
  const indicator = document.getElementById('turn-indicator');
  const guessInputEl = document.getElementById('guess-input');
  const guessBtnEl = document.getElementById('send-guess-btn');

  _clearActTimer();

  const { action, asker, target } = parsePhase(phase);
  const name = s => `${rankMedal(s) ? rankMedal(s) + ' ' : ''}${(roomData && roomData[`${s}_name`]) || s}`;

  const isMyAsk = action === 'ask' && asker === playerSlot;
  const isMyAct = action === 'act' && asker === playerSlot;
  const isMyAnswer = action === 'answer' && target === playerSlot;
  const iAsked = action === 'answer' && asker === playerSlot;
  const isMyTurn = asker === playerSlot; // true through ask/answer-waiting/act - guessing is allowed all turn

  // The elimination board should follow whoever I can currently guess against
  if (isMyTurn && target) selectElimTarget(target);

  guessInputEl.disabled = !isMyTurn;
  guessBtnEl.disabled = !isMyTurn;

  if (isMyAsk) {
    window.mpChatShowAsk?.(otherSlots().map(s => ({ slot: s, name: roomData[`${s}_name`] || s })));
  } else {
    window.mpChatHideAsk?.();
  }
  if (isMyAct) window.mpChatShowPass?.(passRound);
  else window.mpChatHidePass?.();

  if (isMyAsk || isMyAct) _gwStartInactivityTimer();
  else _gwStopInactivityTimer();

  if (isMyAsk) {
    const myRank = getRankings().indexOf(playerSlot);
    if (myRank !== -1) {
      // Already ranked - skip ask
      indicator.className = 'turn-indicator opponent-turn';
      indicator.innerHTML = `${ordinal(myRank + 1)} - Waiting for others to finish...`;
      window.mpChatHideAsk?.();
      // Automatically pass the turn to the next non-ranked player
      await startNewRound();
      return;
    }
    indicator.className = 'turn-indicator my-turn';
    indicator.textContent = 'Your turn - tap ❓ to ask, or guess a character!';
  } else if (isMyAct) {
    indicator.className = 'turn-indicator my-turn';
    indicator.textContent = `Your turn - guess ${name(target)}'s character or pass!`;
    _startActTimer();
  } else if (isMyAnswer) {
    indicator.className = 'turn-indicator answer-turn';
    indicator.textContent = `${name(asker)} is asking you - reply to their question in chat!`;
  } else if (iAsked) {
    indicator.className = 'turn-indicator opponent-turn';
    indicator.textContent = `Waiting for ${name(target)} to answer...`;
  } else {
    indicator.className = 'turn-indicator opponent-turn';
    let waitText = 'Waiting...';
    if (action === 'ask') waitText = `${name(asker)} is choosing who to ask...`;
    if (action === 'answer') waitText = `${name(target)} is answering ${name(asker)}'s question...`;
    if (action === 'act') waitText = `${name(asker)} is deciding...`;
    indicator.textContent = waitText;
  }
}

// ── Guess dropdown ────────────────────────────────────────────────────────────
const guessInput = document.getElementById('guess-input');
const guessDropdown = document.getElementById('guess-dropdown');
let guessSelectedIndex = -1;

function renderGuessDropdown() {
  guessSelectedIndex = -1;
  const q = guessInput.value.trim().toLowerCase();
  guessDropdown.innerHTML = '';
  const hits = getFilteredChars().filter(c => c.img && (!q || c.name.toLowerCase().includes(q))).slice(0, 10);
  hits.forEach(char => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    const img = document.createElement('img');
    img.src = '../assets/' + char.img;
    img.onerror = () => { img.src = '../assets/images/default.png'; };
    const span = document.createElement('span');
    span.textContent = char.name;
    item.append(img, span);
    item.addEventListener('click', () => {
      guessInput.value = char.name;
      guessDropdown.style.display = 'none';
      guessSelectedIndex = -1;
      sendGuess();
    });
    guessDropdown.appendChild(item);
  });
  guessDropdown.style.display = hits.length ? 'block' : 'none';
}

guessInput.addEventListener('input', renderGuessDropdown);
guessInput.addEventListener('focus', renderGuessDropdown);

document.addEventListener('click', e => {
  if (!guessInput.contains(e.target) && !guessDropdown.contains(e.target)) {
    guessDropdown.style.display = 'none';
    guessSelectedIndex = -1;
  }
});

document.getElementById('send-guess-btn').addEventListener('click', sendGuess);
guessInput.addEventListener('keydown', e => {
  const items = Array.from(guessDropdown.querySelectorAll('.dropdown-item'));
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    guessSelectedIndex = Math.min(guessSelectedIndex + 1, items.length - 1);
    items.forEach((item, i) => item.classList.toggle('selected', i === guessSelectedIndex));
    if (items[guessSelectedIndex]) items[guessSelectedIndex].scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    guessSelectedIndex = Math.max(guessSelectedIndex - 1, -1);
    items.forEach((item, i) => item.classList.toggle('selected', i === guessSelectedIndex));
  } else if (e.key === 'Enter') {
    if (guessSelectedIndex >= 0 && items[guessSelectedIndex]) {
      guessInput.value = items[guessSelectedIndex].querySelector('span').textContent;
      guessDropdown.style.display = 'none';
      guessSelectedIndex = -1;
    } else {
      sendGuess();
    }
  } else if (e.key === 'Escape') {
    guessDropdown.style.display = 'none';
    guessSelectedIndex = -1;
  }
});

async function sendGuess() {
  const name = guessInput.value.trim();
  const char = CHARS.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (!char) return;

  const { asker, target: parsedTarget } = parsePhase(roomData.phase);
  if (asker !== playerSlot) return;
  const target = parsedTarget || otherSlots()[0];
  const opponentChar = roomData[`${target}_char`];
  const correct = char.name === opponentChar;

  await db.from('mp_events').insert({
    room_id: roomId, player: playerSlot, type: 'guess',
    content: JSON.stringify({ char: char.name, target }),
    correct,
  });

  if (correct) {
    // 1. Update guessed_chars locally and write to DB
    const guessedChars = getGuessedChars();
    if (!guessedChars[playerSlot]) guessedChars[playerSlot] = [];
    if (!guessedChars[playerSlot].includes(target)) guessedChars[playerSlot].push(target);

    const pc = getPlayerCount();
    const finished = guessedChars[playerSlot].length >= pc - 1;

    await db.from('mp_rooms').update({ guessed_chars: JSON.stringify(guessedChars) }).eq('id', roomId);

    if (finished) {
      // 2. Re-fetch FRESH rankings from DB (avoids race condition with multiple players finishing)
      const { data: fresh } = await db.from('mp_rooms').select('rankings,guessed_chars').eq('id', roomId).single();
      let rankings = [];
      try { rankings = JSON.parse(fresh?.rankings) || []; } catch { }

      if (!rankings.includes(playerSlot)) rankings.push(playerSlot);

      const gameOver = rankings.length >= pc - 1;
      const updatePayload = {
        rankings: JSON.stringify(rankings),
        ...(gameOver ? { state: 'finished', winner: rankings[0], phase: null } : {}),
      };
      await db.from('mp_rooms').update(updatePayload).eq('id', roomId);

      // Announce locally (Supabase won't echo this update back to the triggering client)
      window.mpChatSystemMsg?.(`<strong><span class="e">🏆</span> You finished in ${ordinal(rankings.length)}!</strong>`);

      // Update local roomData and render result directly (Supabase won't echo back to us)
      roomData = { ...roomData, ...updatePayload };

      if (gameOver) {
        renderResultScreen(roomData);
      } else {
        guessInput.value = '';
        guessDropdown.style.display = 'none';
        await startNewRound();
      }
    } else {
      guessInput.value = '';
      guessDropdown.style.display = 'none';
      await startNewRound();
    }
  } else {
    guessInput.value = '';
    guessDropdown.style.display = 'none';
    await startNewRound();
  }
}

async function passRound() {
  await startNewRound();
}

async function startNewRound() {
  _clearActTimer();
  const { asker, target } = parsePhase(roomData.phase);
  if (asker !== playerSlot) return;

  // Next to ask = whoever was just interrogated, but skip already-ranked or left players
  const rankings = getRankings();
  const slots = allSlots();
  let next = target || otherSlots()[0];
  for (let i = 0; i < slots.length; i++) {
    if (!rankings.includes(next) && roomData[`${next}_name`]) break;
    // This player is ranked or has left → move to the next slot in the cycle
    const idx = slots.indexOf(next);
    next = slots[(idx + 1) % slots.length];
  }

  // Safety: if all-but-one are ranked, game should already be over - bail out
  if (rankings.length >= getPlayerCount() - 1) return;

  const nextPhase = `ask:${next}`;
  const { data } = await db.from('mp_rooms').update({ phase: nextPhase, current_question: null }).eq('id', roomId).select().single();
  roomData = data;
  updateTurnUI(nextPhase, null);
}

// ── Render event ──────────────────────────────────────────────────────────────
function renderEvent(ev) {
  const isMe = ev.player === playerSlot;
  const sender = escHtml(roomData[`${ev.player}_name`] || ev.player);

  if (ev.type === 'guess') {
    let guessedChar = ev.content, targetSlot = null;
    try { const p = JSON.parse(ev.content); guessedChar = p.char || ev.content; targetSlot = p.target; } catch { }
    const involvedInGuess = isMe || playerSlot === targetSlot;
    let html;
    if (ev.correct) {
      if (involvedInGuess) {
        const tLabel = targetSlot && roomData ? ` (${escHtml(roomData[`${targetSlot}_name`] || targetSlot)}'s char)` : '';
        html = `<div>${sender} guessed "${escHtml(guessedChar)}"${tLabel}</div><div class="mpc-event-emoji">✅</div>`;
      } else {
        html = `<div>${sender} got one right!</div><div class="mpc-event-emoji">🎉</div>`;
      }
    } else {
      const tLabel = targetSlot && roomData ? ` (${escHtml(roomData[`${targetSlot}_name`] || targetSlot)}'s char)` : '';
      html = `<div>${sender} guessed "${escHtml(guessedChar)}"${tLabel}</div><div class="mpc-event-emoji">❌</div>`;
    }
    window.mpChatSystemMsg?.(html);
  } else if (ev.type === 'jumpscare') {
    if (!isMe) triggerJumpscare(ev.content || 'freddy', () => { });
  }
}

// ── Result screen ─────────────────────────────────────────────────────────────
function renderResultScreen(room) {
  stopPeriodicSync();
  const votes = room.phase || '';
  const pc = getPlayerCount();
  // Only treat phase as vote list if it's exclusively player slots (not a game phase like 'ask:player1:...')
  const voteList = votes.split(':');
  const isVotePhase = voteList.every(v => v === '' || /^player\d$/.test(v));
  const allVoted = isVotePhase && allSlots(pc).every(s => voteList.includes(s));
  if (allVoted) { triggerRematch(); return; }

  const rematchBtn = document.getElementById('rematch-btn');
  const activeCount = allSlots(pc).filter(s => room[`${s}_name`]).length;
  const wonByLeave = activeCount <= 1;
  if (wonByLeave) {
    rematchBtn.style.display = 'none';
  } else {
    rematchBtn.style.display = '';
    const myVoted = voteList.includes(playerSlot);
    rematchBtn.disabled = myVoted;
    rematchBtn.innerHTML = myVoted
      ? `<span class="mp_emoji">⏳</span> Waiting... (${allSlots(pc).filter(s => voteList.includes(s)).length}/${pc})`
      : '<span class="mp_emoji">🔄</span> Rematch';
  }
  showScreen('result');
  let rankings = [];
  try { rankings = JSON.parse(room.rankings) || []; } catch { }
  // Last place = whoever isn't in rankings
  const lastPlace = allSlots(pc).find(s => !rankings.includes(s));
  if (lastPlace && !rankings.includes(lastPlace)) rankings = [...rankings, lastPlace];

  const myRank = rankings.indexOf(playerSlot) + 1; // 1-based
  const isWinner = myRank === 1;

  const banner = document.getElementById('mp-result-banner');
  banner.className = 'result-banner show';
  if (!isWinner) banner.classList.add('lose');

  // Jumpscare button: only for 1st place
  const jumpscareBtn = document.getElementById('jumpscare-btn');
  const jumpscarePicker = document.getElementById('jumpscare-picker');
  jumpscareBtn.style.display = isWinner ? '' : 'none';
  jumpscareBtn.disabled = false;
  jumpscareBtn.textContent = '🎃 Jumpscare!';
  jumpscarePicker.style.display = 'none';
  if (isWinner) buildJumpscarePicker();

  const placeLabel = myRank > 0 ? ordinal(myRank) : '?';
  document.getElementById('result-title').innerHTML =
    isWinner ? `<span class="e">🎉</span> You Won! (${placeLabel})` : `${placeLabel} Place`;
  document.getElementById('result-msg').textContent =
    isWinner ? `You guessed all opponents' animatronics!` : '';

  const container = document.getElementById('result-chars');
  container.innerHTML = '';
  allSlots(pc).forEach(slot => {
    const pName = room[`${slot}_name`];
    const charName = room[`${slot}_char`];
    if (!pName) return;
    const char = CHARS.find(c => c.name === charName);
    const slotRank = rankings.indexOf(slot) + 1;
    const div = document.createElement('div');
    div.className = 'result-char';
    if (slot === room.winner) div.style.outline = '2px solid var(--gold)';
    if (char && char.img) {
      const img = document.createElement('img');
      img.src = '../assets/' + char.img;
      img.alt = charName;
      div.appendChild(img);
    }
    const lbl = document.createElement('div');
    lbl.className = 'result-char-label';
    const rankStr = slotRank > 0 ? `${ordinal(slotRank)} · ` : '';
    lbl.innerHTML = `${rankStr}${slot === playerSlot ? `You (${pName})` : pName}`;
    const nm = document.createElement('div');
    nm.className = 'result-char-name';
    nm.textContent = charName || '???';
    div.append(lbl, nm);
    container.appendChild(div);
  });
}

// ── Jumpscare picker ──────────────────────────────────────────────────────────
const JUMPSCARE_NAMES = {
  freddy: 'Freddy', bonnie: 'Bonnie', chica: 'Chica', foxy: 'Foxy',
  golden_freddy: 'Golden Freddy',
};

function buildJumpscarePicker() {
  const picker = document.getElementById('jumpscare-picker');
  picker.innerHTML = '';
  const isAprilFools = _isAprilFools();

  // On April 1st: only Foxy available (plays the meme instead)
  const entries = isAprilFools
    ? [['foxy', 'Foxy']]
    : Object.entries(JUMPSCARE_NAMES);

  entries.forEach(([key, label]) => {
    const btn = document.createElement('button');
    btn.className = 'mp-btn small jumpscare-opt-btn';
    btn.textContent = label;
    btn.addEventListener('click', async () => {
      // foxy → meme on April 1st
      const gif = (key === 'foxy' && isAprilFools) ? 'withered_foxy_meme' : key;
      document.getElementById('jumpscare-btn').style.display = 'none';
      picker.style.display = 'none';
      await db.from('mp_events').insert({
        room_id: roomId, player: playerSlot, type: 'jumpscare', content: gif,
      });
    });
    picker.appendChild(btn);
  });
}

document.getElementById('jumpscare-btn').addEventListener('click', () => {
  const picker = document.getElementById('jumpscare-picker');
  picker.style.display = picker.style.display === 'none' ? '' : 'none';
});

// ── Rematch ───────────────────────────────────────────────────────────────────
async function triggerRematch() {
  stopPeriodicSync();
  gameInit = false; myChar = null; selectionShown = false;

  const room = roomData;
  const voters = (room.phase || '').split(':').filter(s => /^player\d+$/.test(s));
  const ordered = voters.sort((a, b) => +a.slice(6) - +b.slice(6));
  const newCount = Math.max(2, ordered.length);

  const update = {
    state: 'selecting', player_count: newCount,
    current_question: null, phase: null, winner: null,
    turn_order: null, guessed_chars: null, rankings: null, first_asker: null,
  };

  // Compact voter slots → player1, player2, …
  ordered.forEach((origSlot, idx) => {
    const ns = `player${idx + 1}`;
    update[`${ns}_id`] = room[`${origSlot}_id`];
    update[`${ns}_name`] = room[`${origSlot}_name`];
    update[`${ns}_char`] = null;
    update[`${ns}_ready`] = false;
  });
  // Clear unused slots
  for (let i = ordered.length + 1; i <= 4; i++) {
    const ns = `player${i}`;
    update[`${ns}_id`] = null; update[`${ns}_name`] = null;
    update[`${ns}_char`] = null; update[`${ns}_ready`] = false;
  }

  await db.from('mp_rooms').update(update).eq('id', roomId);
  // Re-detect my slot after compaction
  refreshMpPlayerSlot({ ...room, ...update });
  selectionShown = true;
  showSelectionScreen();
}

function refreshMpPlayerSlot(room) {
  const found = ['player1', 'player2', 'player3', 'player4'].find(s => room[`${s}_id`] === playerId);
  if (!found) {
    // Not in the rematch - redirect to lobby
    setTimeout(() => location.reload(), 2500);
    return;
  }
  playerSlot = found;
}

document.getElementById('rematch-btn').addEventListener('click', async () => {
  const btn = document.getElementById('rematch-btn');
  btn.disabled = true;

  const room = roomData;
  const pc = getPlayerCount();
  const current = room.phase || '';
  if (current.includes(playerSlot)) return; // already voted

  const newVotes = current ? current + ':' + playerSlot : playerSlot;
  btn.textContent = `⏳ Waiting... (${allSlots(pc).filter(s => newVotes.includes(s)).length}/${pc})`;

  await db.from('mp_rooms').update({ phase: newVotes }).eq('id', roomId).eq('state', 'finished');
  // triggerRematch is handled by renderResultScreen when the realtime update fires
});

// ── Player leave detection ────────────────────────────────────────────────────
// If the leaving player was the current asker or the one being asked/guessed,
// the turn would otherwise get stuck forever - hand it to the next active player.
function _advancePhaseAfterLeave(room, savedSlot, active) {
  const { asker, target } = parsePhase(room.phase);
  if (asker !== savedSlot && target !== savedSlot) return null;
  let rankings = []; try { rankings = JSON.parse(room.rankings) || []; } catch (e) { }
  const next = active.find(s => !rankings.includes(s));
  if (!next) return null;
  return { phase: `ask:${next}`, current_question: null };
}

async function cleanupMpPlayerLeft() {
  if (!roomId || !playerSlot) return;
  _gwStopInactivityTimer();
  const room = roomData;
  const savedId = roomId;
  const savedSlot = playerSlot;
  roomId = null; playerSlot = null; roomData = null;
  if (!room) return;

  const pc = getPlayerCount();
  const active = allSlots(pc).filter(s => room[`${s}_name`] && s !== savedSlot);
  const update = {
    [`${savedSlot}_name`]: null,
    [`${savedSlot}_id`]: null,
    [`${savedSlot}_char`]: null,
  };
  if (room.state === 'selecting') {
    update.state = 'waiting';
    update.phase = null;
    update[`${savedSlot}_ready`] = false;
    allSlots(pc).forEach(s => { update[`${s}_ready`] = false; update[`${s}_char`] = null; });
  } else if (active.length === 1 && room.state === 'playing') {
    update.state = 'finished';
    update.phase = null;
    update.rankings = JSON.stringify([active[0]]);
    update.winner = active[0];
  } else if (active.length > 1 && room.state === 'playing') {
    const adv = _advancePhaseAfterLeave(room, savedSlot, active);
    if (adv) Object.assign(update, adv);
  }
  try { await db.from('mp_rooms').update(update).eq('id', savedId); } catch (_) { }
}

const _mpCoreGoHome = window.goHome;
window.goHome = async function () {
  if (typeof stopMpChat === 'function') stopMpChat();
  await cleanupMpPlayerLeft();
  _mpCoreGoHome?.();
};

window.addEventListener('beforeunload', () => {
  if (typeof stopMpChat === 'function') stopMpChat();
  if (!roomId || !playerSlot) return;
  const savedId = roomId;
  const savedSlot = playerSlot;
  const room = roomData || {};
  roomId = null; playerSlot = null; roomData = null;

  const pc = getPlayerCount();
  const active = allSlots(pc).filter(s => room[`${s}_name`] && s !== savedSlot);
  const body = { [`${savedSlot}_name`]: null, [`${savedSlot}_id`]: null, [`${savedSlot}_char`]: null };
  if (room.state === 'selecting') {
    body.state = 'waiting';
    body.phase = null;
    allSlots(pc).forEach(s => { body[`${s}_ready`] = false; body[`${s}_char`] = null; });
  } else if (active.length === 1 && room.state === 'playing') {
    body.state = 'finished';
    body.phase = null;
    body.rankings = JSON.stringify([active[0]]);
    body.winner = active[0];
  } else if (active.length > 1 && room.state === 'playing') {
    const adv = _advancePhaseAfterLeave(room, savedSlot, active);
    if (adv) Object.assign(body, adv);
  }
  fetch(`${cfg.SUPABASE_URL}/rest/v1/mp_rooms?id=eq.${savedId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': cfg.SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${cfg.SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(body),
    keepalive: true,
  });
});

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('multiplayer-screen').style.display = 'block';
  showScreen('lobby');

  // Build game checkboxes with expandable sub-type lists
  const filterAllEl = document.getElementById('filter-all');
  const gamesListEl = document.getElementById('filter-games-list');

  function syncFilterAll() {
    const gameCbs = [...document.querySelectorAll('.filter-game-checkbox')];
    const allOn = gameCbs.every(c => c.checked && !c.indeterminate);
    filterAllEl.checked = allOn;
    filterAllEl.indeterminate = !allOn && gameCbs.some(c => c.checked || c.indeterminate);
  }

  GAMES.forEach((g, i) => {
    // ── main game row ──
    const row = document.createElement('div');
    row.className = 'filter-game-row';

    const label = document.createElement('label');
    label.className = 'filter-game-item';

    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.className = 'filter-game-checkbox'; cb.value = i; cb.checked = true;
    if (GAME_COLORS[i]) cb.style.accentColor = GAME_COLORS[i];

    const nameSpan = document.createElement('span');
    nameSpan.textContent = g.name;
    label.append(cb, nameSpan);

    const expandBtn = document.createElement('button');
    expandBtn.type = 'button'; expandBtn.className = 'filter-game-expand-btn'; expandBtn.textContent = '▸';
    row.append(label, expandBtn);
    gamesListEl.appendChild(row);

    // ── sub-type list ──
    const subtypesEl = document.createElement('div');
    subtypesEl.className = 'filter-game-subtypes'; subtypesEl.style.display = 'none';

    const typeCounts = {};
    CHARS.slice(g.start, g.end + 1).forEach(c => { typeCounts[c.type] = (typeCounts[c.type] || 0) + 1; });

    Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
      const subLabel = document.createElement('label');
      subLabel.className = 'filter-subtype-item';
      const subCb = document.createElement('input');
      subCb.type = 'checkbox'; subCb.className = 'filter-subtype-checkbox';
      subCb.dataset.game = i; subCb.value = type; subCb.checked = true;
      const subColor = (i === 3 && type === 'Jack-O') ? JACKO_COLOR
        : type === 'Shadow' ? SHADOW_COLOR
        : GAME_COLORS[i];
      if (subColor) subCb.style.accentColor = subColor;
      const subSpan = document.createElement('span');
      subSpan.textContent = `${type} (${count})`;
      subLabel.append(subCb, subSpan);
      subtypesEl.appendChild(subLabel);

      subCb.addEventListener('change', () => {
        const subs = subtypesEl.querySelectorAll('.filter-subtype-checkbox');
        const n = subtypesEl.querySelectorAll('.filter-subtype-checkbox:checked').length;
        cb.checked = n > 0; cb.indeterminate = n > 0 && n < subs.length;
        syncFilterAll();
      });
    });

    gamesListEl.appendChild(subtypesEl);

    // expand/collapse
    expandBtn.addEventListener('click', e => {
      e.preventDefault();
      const open = subtypesEl.style.display !== 'none';
      subtypesEl.style.display = open ? 'none' : '';
      expandBtn.textContent = open ? '▸' : '▾';
    });

    // game checkbox toggles all its sub-types
    cb.addEventListener('change', function () {
      subtypesEl.querySelectorAll('.filter-subtype-checkbox').forEach(s => { s.checked = this.checked; });
      this.indeterminate = false;
      syncFilterAll();
    });
  });

  filterAllEl.addEventListener('change', function () {
    gamesListEl.style.display = this.checked ? 'none' : 'flex';
    if (this.checked) {
      document.querySelectorAll('.filter-game-checkbox').forEach(c => { c.checked = true; c.indeterminate = false; });
      document.querySelectorAll('.filter-subtype-checkbox').forEach(c => { c.checked = true; });
    }
  });

  document.getElementById('create-room-btn').addEventListener('click', showCreatePanel);
  document.getElementById('confirm-create-btn').addEventListener('click', confirmCreateRoom);
  document.getElementById('cancel-create-btn').addEventListener('click', cancelCreateRoom);
  document.getElementById('join-room-btn').addEventListener('click', joinRoom);
  document.getElementById('refresh-lobby-btn').addEventListener('click', loadPublicLobby);
  document.getElementById('start-early-btn').addEventListener('click', startEarlyMultiplayer);
  document.getElementById('lobby-code').addEventListener('keydown', e => { if (e.key === 'Enter') joinRoom(); });
  document.getElementById('lobby-name').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('lobby-code').focus(); });

  loadPublicLobby();
});
