// ── Constants ─────────────────────────────────────────────────────────────────
const BOARD_SIZE    = 20;
const TOTAL_LAPS    = 5;
const COINS_PER_PIZZA = 10;

const BOARD_GRID = [
  [1,1],[1,2],[1,3],[1,4],[1,5],[1,6],
  [2,6],[3,6],[4,6],[5,6],
  [6,6],[6,5],[6,4],[6,3],[6,2],[6,1],
  [5,1],[4,1],[3,1],[2,1],
];

const SPACE_CFG = {
  normal:   { cls: 'space-normal',   emoji: '',   label: 'Normal' },
  minigame: { cls: 'space-minigame', emoji: '🎮', label: 'Minigame' },
  coin:     { cls: 'space-coin',     emoji: '🪙', label: '+2 Moedas' },
  pizza:    { cls: 'space-pizza',    emoji: '🍕', label: '+1 Pizza' },
  question: { cls: 'space-question', emoji: '❓', label: 'Event' },
};

const CHAR_CFG = {
  freddy: { name: 'Freddy', emoji: '🐻', color: '#c48b14', img: 'images/chars/classic/freddy.png',
            desc: 'Default character. No special abilities.', ability: null },
  chica:  { name: 'Chica',  emoji: '🐔', color: '#d4a017', img: 'images/chars/classic/chica.png',
            desc: 'Throws the Cupcake up to 5 spaces and steals 5 coins. Cooldown: 3 turns.', ability: 'cupcake', cooldown: 3 },
  bonnie: { name: 'Bonnie', emoji: '🎸', color: '#4169e1', img: 'images/chars/classic/bonnie.png',
            desc: 'Jumps exactly 4 spaces instead of rolling the dice. Cooldown: 3 turns.', ability: 'jump', cooldown: 3 },
  foxy:   { name: 'Foxy',   emoji: '🦊', color: '#cc4400', img: 'images/chars/classic/foxy.png',
            desc: 'Re-rolls the dice after the first result. Cooldown: 2 turns.', ability: 'reroll', cooldown: 2 },
};

const PLAYER_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];

const MINIGAME_LIST = [
  { id: 'helpyBoop',     name: 'Helpy Boop',       emoji: '👃', desc: 'Click Helpy\'s nose as many times as you can in 30 seconds!' },
  { id: 'moneyLaundry',  name: 'Money Laundering',  emoji: '💰', desc: 'Drag coins to Rockstar Freddy! Most coins deposited in 30s wins.' },
  { id: 'feedingFrenzy', name: 'Feeding Frenzy',    emoji: '🍕', desc: 'Make Chica\'s pizza as fast as possible! Wrong ingredient = -1 pizza.' },
  { id: 'guitarFinder',  name: 'Guitar Finder',     emoji: '🎸', desc: 'Find Bonnie\'s guitar hidden in the grid as fast as possible!' },
  { id: 'powerOut',      name: 'Power Out',         emoji: '🔦', desc: 'Close the door before Freddy attacks! Random timing.' },
];

const QUESTION_EVENTS = [
  { text: "Freddy's Birthday! 🎂",          desc: '+3 coins',            eff: p => { p.coins += 3; } },
  { text: 'Toy Chica stole your coins! 😱', desc: '-3 coins',            eff: p => { p.coins = Math.max(0, p.coins - 3); } },
  { text: 'Springtrap appeared! 💀',         desc: 'Go back 3 spaces',   eff: p => { p.pos = Math.max(0, p.pos - 3); } },
  { text: 'Ballora dances for you! 💃',      desc: 'Go forward 3 spaces', eff: p => { p.pos = p.pos + 3; } },
  { text: 'Phantom Freddy appeared! 👻',    desc: 'Lose 1 pizza',        eff: p => { if (p.pizzas > 0) p.pizzas--; } },
  { text: 'Baby gave you a gift! 🎁',       desc: '+1 pizza',            eff: p => { p.pizzas++; } },
  { text: 'Good night, everyone! 🌙',       desc: '+5 coins',            eff: p => { p.coins += 5; } },
  { text: 'Nightmare Freddy invaded! 😨',   desc: '-5 coins',            eff: p => { p.coins = Math.max(0, p.coins - 5); } },
  { text: 'Mangle fixed everything! 🔧',    desc: '+2 coins',            eff: p => { p.coins += 2; } },
  { text: 'Withered Bonnie scared you! 😰', desc: 'Lose half your coins', eff: p => { p.coins = Math.floor(p.coins / 2); } },
  { text: 'Mangle shuffled the board! 🔀',  desc: 'All spaces reshuffled!', eff: p => {}, boardShuffle: true },
];

// ── Supabase ──────────────────────────────────────────────────────────────────
const cfg = window.FNAF_CONFIG || {};
if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
  document.querySelector('.container').innerHTML =
    '<p style="color:#dd6d6d;font-family:monospace;padding:2rem">Missing config.js — Supabase not configured.</p>';
  throw new Error('FNAF_CONFIG not set');
}
const db = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

// ── Identity ──────────────────────────────────────────────────────────────────
function rndUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
let playerId = sessionStorage.getItem('party_pid') || rndUUID();
sessionStorage.setItem('party_pid', playerId);

// ── State ─────────────────────────────────────────────────────────────────────
let roomId, playerSlot, roomData;
let broadcastCh;                   // Supabase broadcast channel
let liveScores  = {};              // { slot: score } – real-time during minigame
let activeMgId  = null;            // set when 'minigame' phase starts → prevents re-triggering
let mgWaitKey   = null;            // set when 'mg_waiting' starts → separate from activeMgId
let mgCleanup   = null;            // function to clean up active minigame timers
let pendingRoll = null;            // Foxy re-roll: new value before DB subscription fires

// ── Helpers ───────────────────────────────────────────────────────────────────
const imgPath = rel => '../assets/' + rel;
const charImg = char => imgPath(CHAR_CFG[char]?.img || 'images/default.png');
const slotNum = slot  => +slot.replace('player', '');              // 'player2' → 2
const mgScoreKey = slot => `mg_score_p${slotNum(slot)}`;
const mgDoneKey  = slot => `mg_done_p${slotNum(slot)}`;
const allSlots = n => ['player1','player2','player3','player4'].slice(0, n);

function pState(room) {
  return {
    pos:       JSON.parse(room.player_pos      || '{}'),
    coins:     JSON.parse(room.player_coins    || '{}'),
    pizzas:    JSON.parse(room.player_pizzas   || '{}'),
    cooldowns: JSON.parse(room.player_cooldowns || '{}'),
  };
}
function playerPos(room, slot)  { return pState(room).pos[slot]       || 0; }
function playerCoins(room, slot){ return pState(room).coins[slot]     || 0; }
function playerPizzas(room, slot){ return pState(room).pizzas[slot]   || 0; }
function playerLaps(room, slot)  { return Math.floor(playerPos(room, slot) / BOARD_SIZE); }
function boardPos(room, slot)    { return playerPos(room, slot) % BOARD_SIZE; }

function myPlayer(room) {
  const s = pState(room);
  return {
    slot: playerSlot,
    name: room[`${playerSlot}_name`],
    char: room[`${playerSlot}_char`] || 'freddy',
    color: PLAYER_COLORS[slotNum(playerSlot) - 1],
    pos:       s.pos[playerSlot]       || 0,
    coins:     s.coins[playerSlot]     || 0,
    pizzas:    s.pizzas[playerSlot]    || 0,
    cooldowns: s.cooldowns[playerSlot] || 0,
  };
}
function isMyTurn(room) { return room.current_slot === playerSlot; }
function nextSlot(room) {
  const pc    = room.player_count || 2;
  const slots = allSlots(pc);
  const idx   = slots.indexOf(room.current_slot);
  // Skip slots whose player has left (no name)
  for (let i = 1; i <= slots.length; i++) {
    const s = slots[(idx + i) % slots.length];
    if (room[`${s}_name`]) return s;
  }
  return room.current_slot;
}

function moveFwd(state, slot, steps, doConvert = true) {
  const oldLaps = Math.floor(state.pos[slot] / BOARD_SIZE);
  state.pos[slot] = (state.pos[slot] || 0) + steps;
  const newLaps = Math.floor(state.pos[slot] / BOARD_SIZE);
  if (newLaps > oldLaps && doConvert) {
    const earned = Math.floor((state.coins[slot] || 0) / COINS_PER_PIZZA);
    state.pizzas[slot] = (state.pizzas[slot] || 0) + earned;
    state.coins[slot]  = (state.coins[slot]  || 0) % COINS_PER_PIZZA;
  }
}
function moveBack(state, slot, steps) {
  state.pos[slot] = Math.max(0, (state.pos[slot] || 0) - steps);
}

function generateBoard() {
  const pool = [
    ...Array(10).fill('normal'), ...Array(4).fill('minigame'),
    ...Array(3).fill('coin'), ...Array(2).fill('pizza'), 'question',
  ];
  for (let i = pool.length - 1; i > 1; i--) {
    const j = 1 + Math.floor(Math.random() * i);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  pool[0] = 'normal';
  return pool;
}
function genCode() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }

// ── Screens ───────────────────────────────────────────────────────────────────
function showScreen(name) {
  ['lobby','waiting','board','minigame','result'].forEach(s => {
    const el = document.getElementById(`screen-${s}`);
    if (el) el.style.display = (s === name) ? '' : 'none';
  });
}
function lobbyError(msg) {
  const el = document.getElementById('lobby-error');
  if (el) el.textContent = msg;
}

// ── Lobby setup ───────────────────────────────────────────────────────────────
function initLobby() {
  document.getElementById('create-room-btn').addEventListener('click', showPartyCreatePanel);
  document.getElementById('confirm-create-btn').addEventListener('click', confirmCreatePartyRoom);
  document.getElementById('cancel-create-btn').addEventListener('click', cancelPartyCreateRoom);
  document.getElementById('join-room-btn').addEventListener('click',   joinRoom);
  document.getElementById('copy-code-btn').addEventListener('click',   copyCode);
  document.getElementById('refresh-lobby-btn').addEventListener('click', loadPublicPartyLobby);
  document.getElementById('start-early-btn').addEventListener('click', startEarlyParty);
  loadPublicPartyLobby();
}

// ── Create Panel ──────────────────────────────────────────────────────────────
function showPartyCreatePanel() {
  const name = document.getElementById('lobby-name').value.trim();
  if (!name) { lobbyError('Enter your name!'); return; }
  lobbyError('');

  document.getElementById('create-room-code').textContent = genCode();
  document.getElementById('create-room-name').value = '';
  const pubRadio = document.querySelector('input[name="party-privacy"][value="public"]');
  if (pubRadio) pubRadio.checked = true;

  document.getElementById('lobby-buttons').style.display = 'none';
  document.getElementById('create-room-panel').style.display = '';
  document.getElementById('public-lobby-section').style.display = 'none';
}

function cancelPartyCreateRoom() {
  document.getElementById('lobby-buttons').style.display = '';
  document.getElementById('create-room-panel').style.display = 'none';
  document.getElementById('public-lobby-section').style.display = '';
}

async function confirmCreatePartyRoom() {
  const name = document.getElementById('lobby-name').value.trim();
  if (!name) { lobbyError('Enter your name!'); return; }

  const code      = document.getElementById('create-room-code').textContent;
  const roomName  = document.getElementById('create-room-name').value.trim() || `${name}'s Room`;
  const isPrivate = document.querySelector('input[name="party-privacy"]:checked')?.value === 'private';
  const pc = +document.querySelector('input[name="party-count"]:checked').value;

  const startPos = Math.floor(Math.random() * BOARD_SIZE);
  const { data, error } = await db.from('party_rooms').insert({
    code, player_count: pc, state: 'waiting',
    player1_id: playerId, player1_name: name, player1_char: null,
    room_name: roomName, is_private: isPrivate,
    board: JSON.stringify(generateBoard()),
    player_pos:       JSON.stringify({ player1: startPos }),
    player_coins:     JSON.stringify({ player1: 0 }),
    player_pizzas:    JSON.stringify({ player1: 0 }),
    player_cooldowns: JSON.stringify({ player1: 0 }),
    current_slot: 'player1', turn_phase: 'roll',
  }).select().single();

  if (error) { cancelPartyCreateRoom(); lobbyError(error.message); return; }
  roomId = data.id; playerSlot = 'player1'; roomData = data;
  cancelPartyCreateRoom();
  subscribeRoom();
  showWaiting(data);
}

// ── Public Party Lobby ────────────────────────────────────────────────────────
async function loadPublicPartyLobby() {
  const listEl = document.getElementById('public-lobby-list');
  if (!listEl) return;
  listEl.innerHTML = '<div class="lobby-empty">Loading...</div>';

  let data, error;
  ({ data, error } = await db.from('party_rooms')
    .select('id, code, room_name, player_count, player1_name, player2_name, player3_name, player4_name')
    .eq('state', 'waiting')
    .or('is_private.eq.false,is_private.is.null')
    .order('created_at', { ascending: false })
    .limit(10));

  if (error) {
    ({ data, error } = await db.from('party_rooms')
      .select('id, code, player_count, player1_name, player2_name, player3_name, player4_name')
      .eq('state', 'waiting')
      .order('created_at', { ascending: false })
      .limit(10));
  }

  if (error || !data) { listEl.innerHTML = '<div class="lobby-empty">Could not load rooms</div>'; return; }
  renderPublicPartyLobby(data);
}

function renderPublicPartyLobby(rooms) {
  const listEl = document.getElementById('public-lobby-list');
  if (!listEl) return;
  if (!rooms.length) { listEl.innerHTML = '<div class="lobby-empty">No public rooms available</div>'; return; }

  const escHtml = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  listEl.innerHTML = '';
  let anyShown = false;
  rooms.forEach(r => {
    const pc = r.player_count || 2;
    const joined = ['player1','player2','player3','player4'].slice(0, pc)
      .filter(s => r[`${s}_name`]).length;
    if (joined === 0) return;
    anyShown = true;
    const name = r.room_name || (r.player1_name ? `${r.player1_name}'s Room` : 'Room');

    const entry = document.createElement('div');
    entry.className = 'lobby-room-entry';
    entry.innerHTML = `
      <div class="lobby-room-info">
        <div class="lobby-room-name">${escHtml(name)}</div>
        <div class="lobby-room-meta">${joined}/${pc} players · Fnafdle Party</div>
      </div>
      <div class="lobby-room-code">${r.code}</div>
      <button class="mp-btn small" onclick="joinFromPartyLobby('${r.code}')">Join</button>
    `;
    listEl.appendChild(entry);
  });
  if (!anyShown) listEl.innerHTML = '<div class="lobby-empty">No public rooms available</div>';
}

function joinFromPartyLobby(code) {
  const codeInput = document.getElementById('join-code');
  if (codeInput) codeInput.value = code;
  joinRoom();
}

// ── Start Early ───────────────────────────────────────────────────────────────
function updatePartyStartEarlyBtn(room) {
  const btn = document.getElementById('start-early-btn');
  if (!btn) return;
  const pc     = room.player_count || 2;
  const joined = allSlots(pc).filter(s => room[`${s}_name`]).length;
  if (playerSlot === 'player1' && joined >= 2 && joined < pc) {
    btn.style.display = '';
    btn.textContent = `Start with ${joined} players`;
    btn.disabled = false;
  } else {
    btn.style.display = 'none';
  }
}

async function startEarlyParty() {
  if (playerSlot !== 'player1') return;
  const pc     = roomData.player_count || 2;
  const joined = allSlots(pc).filter(s => roomData[`${s}_name`]).length;
  if (joined < 2) return;
  const btn = document.getElementById('start-early-btn');
  if (btn) btn.disabled = true;
  await db.from('party_rooms').update({ player_count: joined }).eq('id', roomId);
}

// ── Create / Join ─────────────────────────────────────────────────────────────

async function joinRoom() {
  const name = document.getElementById('lobby-name').value.trim();
  if (!name) { lobbyError('Enter your name!'); return; }
  const code = document.getElementById('join-code').value.trim().toUpperCase();
  if (code.length < 6) { lobbyError('Invalid code!'); return; }

  const { data: room, error } = await db.from('party_rooms')
    .select('*').eq('code', code).eq('state', 'waiting').single();
  if (error || !room) { lobbyError('Room not found or already started!'); return; }

  const pc = room.player_count || 2;
  let slot;
  if      (!room.player2_id)           slot = 'player2';
  else if (pc >= 3 && !room.player3_id) slot = 'player3';
  else if (pc >= 4 && !room.player4_id) slot = 'player4';
  else { lobbyError('Room is full!'); return; }

  const st = pState(room);
  st.pos[slot]       = Math.floor(Math.random() * BOARD_SIZE);
  st.coins[slot]     = 0;
  st.pizzas[slot]    = 0;
  st.cooldowns[slot] = 0;

  const { data, error: err2 } = await db.from('party_rooms').update({
    [`${slot}_id`]:   playerId,
    [`${slot}_name`]: name,
    [`${slot}_char`]: null,
    player_pos:       JSON.stringify(st.pos),
    player_coins:     JSON.stringify(st.coins),
    player_pizzas:    JSON.stringify(st.pizzas),
    player_cooldowns: JSON.stringify(st.cooldowns),
  }).eq('id', room.id).select().single();

  if (err2) { lobbyError(err2.message); return; }
  roomId = room.id; playerSlot = slot; roomData = data;
  subscribeRoom();
  showWaiting(data);
}

// ── Waiting screen ────────────────────────────────────────────────────────────
function showWaiting(room) {
  showScreen('waiting');
  document.getElementById('waiting-code').textContent = room.code;
  const rnEl = document.getElementById('waiting-room-name');
  if (rnEl) rnEl.textContent = room.room_name || '';
  updateWaitingScreen(room);
}

function updateWaitingScreen(room) {
  const pc     = room.player_count || 2;
  const joined = allSlots(pc).filter(s => room[`${s}_name`]).length;

  // Player list
  const listEl = document.getElementById('waiting-players');
  if (listEl) {
    listEl.innerHTML = '';
    allSlots(pc).forEach((s, i) => {
      const name = room[`${s}_name`];
      const char = room[`${s}_char`];
      const row  = document.createElement('div');
      row.className = 'waiting-player-row';
      if (name) {
        const c = CHAR_CFG[char];
        row.innerHTML = char
          ? `<img src="${charImg(char)}" style="width:16px;height:16px;border-radius:50%;object-fit:contain;vertical-align:middle;margin-right:4px" onerror="this.style.display='none'"/>✅ ${name} <span style="color:var(--gold);font-size:.75rem">(${c ? c.name : char})</span>`
          : `⏳ ${name} — choosing...`;
        row.style.color = char ? 'var(--green-text)' : 'var(--text-muted)';
      } else {
        row.textContent = `⏳ Player ${i + 1}...`;
        row.style.color = 'var(--text-muted)';
      }
      listEl.appendChild(row);
    });
  }

  // Title
  const allChosen = allSlots(pc).filter(s => room[`${s}_name`]).every(s => room[`${s}_char`]);
  const title = document.getElementById('waiting-title');
  if (title) {
    if (joined < pc)           title.textContent = `Waiting for players... (${joined}/${pc})`;
    else if (!allChosen)       title.textContent = 'Choose your character!';
    else                       title.textContent = 'All ready! Starting...';
  }

  // Char picker (show once all players have joined)
  const wrap = document.getElementById('char-select-wrap');
  if (wrap) wrap.style.display = joined >= pc ? 'flex' : 'none';
  if (joined >= pc) renderWaitingCharPicker(room);

  // Room name
  const rnEl = document.getElementById('waiting-room-name');
  if (rnEl && room.room_name) rnEl.textContent = room.room_name;

  // Start-early button (only for creator when not full)
  updatePartyStartEarlyBtn(room);

  // Check if can start
  checkAllCharsReady(room);
}

function renderWaitingCharPicker(room) {
  const pc      = room.player_count || 2;
  const myChar  = room[`${playerSlot}_char`];
  const takenBy = {};
  allSlots(pc).forEach(s => {
    if (s !== playerSlot && room[`${s}_char`]) takenBy[room[`${s}_char`]] = room[`${s}_name`];
  });

  const picker = document.getElementById('waiting-char-picker');
  const desc   = document.getElementById('waiting-char-desc');
  if (!picker) return;

  picker.innerHTML = Object.entries(CHAR_CFG).map(([k, c]) => {
    const taken    = takenBy[k];
    const selected = myChar === k;
    return `<label class="char-pick-opt${selected ? ' selected' : ''}" data-k="${k}"
              style="opacity:${taken ? '0.3' : '1'};pointer-events:${taken ? 'none' : 'auto'}">
      <input type="radio" name="char-wait" value="${k}" ${selected ? 'checked' : ''} ${taken ? 'disabled' : ''}/>
      <img class="char-img" src="${charImg(k)}" alt="${c.name}"
           onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
      <span class="char-emoji-fb" style="display:none">${c.emoji}</span>
      <span class="char-name">${c.name}${taken ? `<br><small style="font-size:.6rem">${taken}</small>` : ''}</span>
    </label>`;
  }).join('');

  picker.querySelectorAll('.char-pick-opt').forEach(opt => {
    opt.addEventListener('click', () => selectChar(opt.dataset.k));
  });

  if (desc) desc.textContent = myChar ? CHAR_CFG[myChar].desc : 'Click a character to select it';
}

async function selectChar(charKey) {
  const room = roomData;
  const pc   = room.player_count || 2;
  const takenByOther = allSlots(pc).some(s => s !== playerSlot && room[`${s}_char`] === charKey);
  if (takenByOther) { showToast('Character already taken!'); return; }
  await db.from('party_rooms').update({ [`${playerSlot}_char`]: charKey }).eq('id', roomId);
}

async function checkAllCharsReady(room) {
  const pc     = room.player_count || 2;
  const active = allSlots(pc).filter(s => room[`${s}_name`]);
  if (active.length < pc) return; // not everyone joined yet
  const allChosen = active.every(s => room[`${s}_char`]);
  if (!allChosen) return;
  const chars  = active.map(s => room[`${s}_char`]);
  const unique = new Set(chars).size === chars.length;
  if (!unique) return; // duplicate chars — wait for resolution
  if (playerSlot !== active[0]) return; // only first player triggers start
  await db.from('party_rooms').update({ state: 'playing' }).eq('id', roomId).eq('state', 'waiting');
}

// Find my slot in the current room (needed after slot compaction on rematch)
function refreshPlayerSlot(room) {
  const found = ['player1','player2','player3','player4'].find(s => room[`${s}_id`] === playerId);
  if (!found) {
    showToast("You weren't included in the rematch");
    setTimeout(() => { roomId = null; playerSlot = null; showScreen('lobby'); }, 2500);
    return false;
  }
  playerSlot = found;
  return true;
}

function copyCode() {
  const code = document.getElementById('waiting-code').textContent;
  const btn  = document.getElementById('copy-code-btn');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).catch(() => {});
  } else {
    try {
      const el = document.createElement('textarea');
      el.value = code; el.style.position = 'fixed'; el.style.opacity = '0';
      document.body.appendChild(el); el.select(); document.execCommand('copy');
      document.body.removeChild(el);
    } catch (_) {}
  }
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = 'Copy Code'; }, 2000);
}

// ── Room subscription ─────────────────────────────────────────────────────────
function subscribeRoom() {
  db.channel(`party_room:${roomId}`)
    .on('postgres_changes', {
      event: 'UPDATE', schema: 'public', table: 'party_rooms', filter: `id=eq.${roomId}`,
    }, ({ new: room }) => handleRoomUpdate(room))
    .subscribe();

  broadcastCh = db.channel(`party_mg:${roomId}`);
  broadcastCh
    .on('broadcast', { event: 'mg_score' }, ({ payload }) => {
      liveScores[payload.slot] = payload.score;
      updateLiveBar();
    })
    .on('broadcast', { event: 'jumpscare' }, ({ payload }) => {
      if (payload.sender !== playerId) triggerJumpscare(payload.char, () => {});
    })
    .subscribe();
}

async function handleRoomUpdate(room) {
  const prev = roomData;
  roomData   = room;

  if (room.state === 'waiting') {
    if (prev?.state === 'finished') {
      if (!refreshPlayerSlot(room)) return;
    }
    if (document.getElementById('screen-waiting').style.display === 'none') showScreen('waiting');
    document.getElementById('waiting-code').textContent = room.code;
    updateWaitingScreen(room);
    return;
  }
  if (room.state === 'playing') {
    if (prev?.state === 'waiting') { startGame(room); return; }
    // If a player left and only 1 remains, end the game
    const activePc = allSlots(room.player_count || 2).filter(s => room[`${s}_name`]);
    if (activePc.length <= 1) { showResult(room); return; }
    renderStatusBar(room);
    updateTokens(room);

    if (room.turn_phase === 'mg_waiting') {
      const mgKey = room.mg_id + room.mg_config;
      if (mgWaitKey !== mgKey) {
        mgWaitKey  = mgKey;
        activeMgId = null; // must be null so startMinigameScreen fires when phase → 'minigame'
        liveScores = {};
      }
      const involved = JSON.parse(room.mg_players || '[]');
      const allReady  = involved.every(s => room[mgDoneKey(s)]);
      if (allReady && involved[0] === playerSlot) {
        // All players ready — lowest slot kicks off the actual game
        await db.from('party_rooms').update({
          turn_phase: 'minigame',
          mg_done_p1: false, mg_done_p2: false, mg_done_p3: false, mg_done_p4: false,
        }).eq('id', roomId).eq('turn_phase', 'mg_waiting');
      } else {
        showMgWaitScreen(room);
      }
    } else if (room.turn_phase === 'minigame') {
      const mgKey = room.mg_id + room.mg_config;
      if (activeMgId !== mgKey) {
        activeMgId = mgKey;
        liveScores = {};
        startMinigameScreen(room); // activeMgId was null (reset in mg_waiting) → always fires
      } else {
        // Check if all done
        const involved = JSON.parse(room.mg_players || '[]');
        const allDone  = involved.every(s => room[mgDoneKey(s)]);
        if (allDone && involved[0] === playerSlot) {
          finishMinigame(room);
        }
      }
    } else if (room.turn_phase === 'roll' || room.turn_phase === 'rolled' || room.turn_phase === 'moved') {
      showScreen('board');
      if (prev?.board !== room.board) renderBoard(room);
      renderActionUI(room);
    }
    return;
  }
  if (room.state === 'finished') {
    // Check if all players voted for rematch
    const pc = room.player_count || 2;
    const voters = room.mg_id || '';
    const allVoted = allSlots(pc).filter(s => room[`${s}_name`]).every(s => voters.includes(s));
    if (allVoted) triggerPartyRematch(room);
    else showResult(room);
  }
}

// ── Game start ────────────────────────────────────────────────────────────────
function startGame(room) {
  roomData = room;
  showScreen('board');
  renderBoard(room);
  renderStatusBar(room);
  renderActionUI(room);
}

// ── Board render ──────────────────────────────────────────────────────────────
function renderBoard(room) {
  const el    = document.getElementById('party-board');
  const board = JSON.parse(room.board || '[]');
  el.innerHTML = '';

  BOARD_GRID.forEach(([row, col], idx) => {
    const type = board[idx] || 'normal';
    const cfg  = SPACE_CFG[type];
    const sp   = document.createElement('div');
    sp.className = `board-space ${cfg.cls}${idx === 0 ? ' space-start' : ''}`;
    sp.style.gridRow    = row;
    sp.style.gridColumn = col;
    sp.innerHTML = `
      <span class="space-num">${idx === 0 ? '🏁' : idx}</span>
      ${cfg.emoji ? `<span class="space-emoji">${cfg.emoji}</span>` : ''}
      <div class="space-tokens" id="tok-${idx}"></div>`;
    el.appendChild(sp);
  });

  const center = document.createElement('div');
  center.className = 'board-center';
  center.style.gridColumn = '2 / 6';
  center.style.gridRow    = '2 / 6';
  center.innerHTML = `
    <div class="board-center-logo">🎂</div>
    <div class="board-center-text">FNAFDLE<br>PARTY</div>
    <div class="board-lap-info">${TOTAL_LAPS} voltas</div>`;
  el.appendChild(center);

  updateTokens(room);
}

function updateTokens(room) {
  for (let i = 0; i < BOARD_SIZE; i++) {
    const el = document.getElementById(`tok-${i}`);
    if (el) el.innerHTML = '';
  }
  const pc = room.player_count || 2;
  allSlots(pc).forEach((slot, i) => {
    if (!room[`${slot}_name`]) return;
    const pos = boardPos(room, slot);
    const el  = document.getElementById(`tok-${pos}`);
    if (!el) return;
    const char = room[`${slot}_char`] || 'freddy';
    const tok  = document.createElement('div');
    tok.className   = 'player-token';
    tok.style.borderColor = PLAYER_COLORS[i];
    tok.title = room[`${slot}_name`];
    const img = document.createElement('img');
    img.src = charImg(char);
    img.onerror = () => { tok.textContent = room[`${slot}_name`][0]; };
    tok.appendChild(img);
    el.appendChild(tok);
  });
}

function renderStatusBar(room) {
  const pc  = room.player_count || 2;
  const bar = document.getElementById('player-status-bar');
  bar.innerHTML = allSlots(pc).map((slot, i) => {
    if (!room[`${slot}_name`]) return '';
    const char    = room[`${slot}_char`] || 'freddy';
    const c       = CHAR_CFG[char];
    const active  = room.current_slot === slot && room.turn_phase !== 'minigame';
    const laps    = playerLaps(room, slot);
    const coins   = playerCoins(room, slot);
    const pizzas  = playerPizzas(room, slot);
    const cd      = pState(room).cooldowns[slot] || 0;
    const color   = PLAYER_COLORS[i];
    return `<div class="player-status-card${active ? ' active' : ''}" style="border-color:${color}">
      <div class="psc-header">
        <img class="psc-avatar" src="${charImg(char)}" alt="${char}"
             onerror="this.style.display='none'"/>
        <span class="psc-name" style="color:${color}">${room[`${slot}_name`]}</span>
      </div>
      <div class="psc-stats">
        <span>🪙${coins}</span>
        <span>🍕${pizzas}</span>
        <span>🔄${Math.min(laps + 1, TOTAL_LAPS)}/${TOTAL_LAPS}</span>
      </div>
      ${c.ability ? `<div class="psc-cooldown">${cd > 0 ? `⏳${cd}t` : '✨'}</div>` : ''}
    </div>`;
  }).join('');
}

// ── Action UI ─────────────────────────────────────────────────────────────────
function renderActionUI(room) {
  const el = document.getElementById('current-player-action');
  if (!el) return;

  if (!isMyTurn(room)) {
    const curName  = room[`${room.current_slot}_name`] || '?';
    const curColor = PLAYER_COLORS[slotNum(room.current_slot) - 1];
    const extra = room.turn_phase === 'rolled'
      ? ` — rolled <strong>🎲 ${room.dice_result}</strong>` : '';
    el.innerHTML = `<div class="action-card">
      <div class="action-waiting"><strong style="color:${curColor}">${curName}</strong>'s turn${extra}</div>
    </div>`;
    return;
  }

  const me  = myPlayer(room);
  const c   = CHAR_CFG[me.char];
  const pos = boardPos(room, me.slot);

  if (room.turn_phase === 'roll') {
    // Reroll is not shown here — it appears after rolling (in 'rolled' phase)
    const canAbility = c.ability && c.ability !== 'reroll' && (pState(room).cooldowns[playerSlot] || 0) === 0;
    const abilLabel  = c.name === 'Chica' ? '🧁 Cupcake' : '🎸 Jump';
    el.innerHTML = `<div class="action-card">
      <div class="action-player-name" style="color:${me.color}">
        <img src="${charImg(me.char)}" style="width:24px;height:24px;border-radius:50%;object-fit:contain;vertical-align:middle;margin-right:6px" onerror="this.style.display='none'"/>
        ${me.name}
      </div>
      <div class="action-pos">Space ${pos} · Lap ${Math.min(Math.floor(me.pos / BOARD_SIZE) + 1, TOTAL_LAPS)}/${TOTAL_LAPS} · 🪙${me.coins} 🍕${me.pizzas}</div>
      <div class="action-btns">
        <button class="mp-btn primary" id="roll-btn">🎲 Roll Dice</button>
        ${canAbility ? `<button class="mp-btn accent" id="ability-btn">${abilLabel}</button>` : ''}
      </div>
    </div>`;
    document.getElementById('roll-btn').addEventListener('click', doRoll);
    if (canAbility) document.getElementById('ability-btn').addEventListener('click', useAbility);

  } else if (room.turn_phase === 'rolled') {
    // Dice rolled — show result, let Foxy re-roll if ability available
    const canReroll = me.char === 'foxy' && (pState(room).cooldowns[playerSlot] || 0) === 0;
    el.innerHTML = `<div class="action-card">
      <div class="action-player-name" style="color:${me.color}">${me.name}</div>
      <div class="action-dice">🎲 ${room.dice_result}</div>
      <div class="action-btns">
        <button class="mp-btn primary" id="apply-btn">Continue →</button>
        ${canReroll ? `<button class="mp-btn accent" id="reroll-btn">🔄 Re-Roll</button>` : ''}
      </div>
    </div>`;
    document.getElementById('apply-btn').addEventListener('click', applyMove);
    if (canReroll) document.getElementById('reroll-btn').addEventListener('click', doFoxyReroll);

  } else if (room.turn_phase === 'moved') {
    const board = JSON.parse(room.board || '[]');
    const cfg   = SPACE_CFG[board[pos] || 'normal'];
    el.innerHTML = `<div class="action-card">
      <div class="action-player-name" style="color:${me.color}">${me.name}</div>
      <div class="action-dice">🎲 ${room.dice_result}</div>
      <div class="action-space">Landed on: ${cfg.emoji || '⬜'} ${cfg.label}</div>
      <button class="mp-btn primary" id="cont-btn">Continue →</button>
    </div>`;
    document.getElementById('cont-btn').addEventListener('click', handleSpace);
  }
}

// ── Roll dice ─────────────────────────────────────────────────────────────────
async function doRoll() {
  const roll = Math.floor(Math.random() * 6) + 1;
  await db.from('party_rooms').update({
    turn_phase: 'rolled',
    dice_result: roll,
  }).eq('id', roomId);
}

// Apply movement (called after confirming dice in 'rolled' phase)
async function applyMove() {
  const room = roomData;
  const roll = pendingRoll ?? room.dice_result;
  pendingRoll = null;
  const st   = pState(room);
  if ((st.cooldowns[playerSlot] || 0) > 0) st.cooldowns[playerSlot]--;
  moveFwd(st, playerSlot, roll);
  const finished = Math.floor(st.pos[playerSlot] / BOARD_SIZE) >= TOTAL_LAPS;
  await db.from('party_rooms').update({
    player_pos:       JSON.stringify(st.pos),
    player_coins:     JSON.stringify(st.coins),
    player_pizzas:    JSON.stringify(st.pizzas),
    player_cooldowns: JSON.stringify(st.cooldowns),
    turn_phase: 'moved',
    ...(finished ? { state: 'finished' } : {}),
  }).eq('id', roomId);
}

// Foxy re-roll (stays in 'rolled' phase, sets cooldown so button disappears)
async function doFoxyReroll() {
  const roll = Math.floor(Math.random() * 6) + 1;
  pendingRoll = roll;
  const st   = pState(roomData);
  st.cooldowns[playerSlot] = CHAR_CFG['foxy'].cooldown;
  // Update UI immediately so the new number shows before DB subscription fires
  const actionEl = document.getElementById('current-player-action');
  if (actionEl) {
    const diceEl = actionEl.querySelector('.action-dice');
    if (diceEl) diceEl.textContent = `🎲 ${roll}`;
    const rerollBtn = document.getElementById('reroll-btn');
    if (rerollBtn) rerollBtn.remove();
  }
  await db.from('party_rooms').update({
    dice_result: roll,
    player_cooldowns: JSON.stringify(st.cooldowns),
  }).eq('id', roomId);
  showToast('Re-rolled! 🎲');
}

// ── Space effect ──────────────────────────────────────────────────────────────
async function handleSpace() {
  const room  = roomData;
  const board = JSON.parse(room.board || '[]');
  const pos   = boardPos(room, playerSlot);
  const type  = board[pos] || 'normal';
  const pc    = room.player_count || 2;
  const others = allSlots(pc).filter(s =>
    s !== playerSlot && room[`${s}_name`] && boardPos(room, s) === pos);

  const st = pState(room);

  if (type === 'coin') {
    st.coins[playerSlot] = (st.coins[playerSlot] || 0) + 2;
    await db.from('party_rooms').update({ player_coins: JSON.stringify(st.coins), turn_phase: 'roll', current_slot: nextSlot(room) }).eq('id', roomId);
    showToast(`${room[`${playerSlot}_name`]} got 2 coins! 🪙`);
    return;
  }
  if (type === 'pizza') {
    st.pizzas[playerSlot] = (st.pizzas[playerSlot] || 0) + 1;
    await db.from('party_rooms').update({ player_pizzas: JSON.stringify(st.pizzas), turn_phase: 'roll', current_slot: nextSlot(room) }).eq('id', roomId);
    showToast(`${room[`${playerSlot}_name`]} got 1 pizza! 🍕`);
    return;
  }
  if (type === 'minigame' || others.length > 0) {
    const involved = type === 'minigame'
      ? allSlots(pc).filter(s => room[`${s}_name`]).map(s => s)
      : [playerSlot, ...others];
    await triggerMinigame(involved);
    return;
  }
  if (type === 'question') {
    await triggerQuestion();
    return;
  }
  // Normal space
  await db.from('party_rooms').update({ turn_phase: 'roll', current_slot: nextSlot(room) }).eq('id', roomId);
}

async function triggerQuestion() {
  const ev  = QUESTION_EVENTS[Math.floor(Math.random() * QUESTION_EVENTS.length)];
  const st  = pState(roomData);

  const tempPlayer = { coins: st.coins[playerSlot]||0, pizzas: st.pizzas[playerSlot]||0, pos: st.pos[playerSlot]||0 };
  ev.eff(tempPlayer);
  st.coins[playerSlot]  = Math.max(0, tempPlayer.coins);
  st.pizzas[playerSlot] = Math.max(0, tempPlayer.pizzas);
  st.pos[playerSlot]    = Math.max(0, tempPlayer.pos);

  const extra = ev.boardShuffle ? { board: JSON.stringify(generateBoard()) } : {};

  await db.from('party_rooms').update({
    player_pos:    JSON.stringify(st.pos),
    player_coins:  JSON.stringify(st.coins),
    player_pizzas: JSON.stringify(st.pizzas),
    turn_phase: 'roll', current_slot: nextSlot(roomData),
    ...extra,
  }).eq('id', roomId);
  showToast(`${ev.text} (${ev.desc})`);
}

// ── Character abilities ───────────────────────────────────────────────────────
function useAbility() {
  const me = myPlayer(roomData);
  switch (CHAR_CFG[me.char].ability) {
    case 'cupcake': showCupcakeTarget(); break;
    case 'jump':    doJump();            break;
    case 'reroll':  doReroll();          break;
  }
}

function showCupcakeTarget() {
  const room   = roomData;
  const pc     = room.player_count || 2;
  const myPos  = boardPos(room, playerSlot);
  const targets = allSlots(pc).filter(s => {
    if (s === playerSlot || !room[`${s}_name`]) return false;
    const dist = (boardPos(room, s) - myPos + BOARD_SIZE) % BOARD_SIZE;
    return dist > 0 && dist <= 5;
  });
  if (!targets.length) { showToast('No players in range!'); return; }

  const el = document.getElementById('current-player-action');
  el.innerHTML = `<div class="action-card">
    <div class="action-player-name" style="color:${PLAYER_COLORS[slotNum(playerSlot)-1]}">🧁 Throw Cupcake!</div>
    <div class="ability-targets">
      ${targets.map(s => {
        const char = room[`${s}_char`] || 'freddy';
        return `<button class="mp-btn" onclick="executeCupcake('${s}')">
          <img src="${charImg(char)}" style="width:20px;height:20px;border-radius:50%;object-fit:contain;vertical-align:middle" onerror="this.style.display='none'"/>
          ${room[`${s}_name`]}
        </button>`;
      }).join('')}
    </div>
    <button class="mp-btn small" onclick="renderActionUI(roomData)" style="margin-top:4px">Cancel</button>
  </div>`;
}

async function executeCupcake(targetSlot) {
  const st     = pState(roomData);
  const stolen = Math.min(5, st.coins[targetSlot] || 0);
  st.coins[targetSlot]  = Math.max(0, (st.coins[targetSlot] || 0) - stolen);
  st.coins[playerSlot]  = (st.coins[playerSlot] || 0) + stolen;
  st.cooldowns[playerSlot] = CHAR_CFG[roomData[`${playerSlot}_char`]].cooldown;
  await db.from('party_rooms').update({
    player_coins:     JSON.stringify(st.coins),
    player_cooldowns: JSON.stringify(st.cooldowns),
  }).eq('id', roomId);
  showToast(`${roomData[`${playerSlot}_name`]} stole ${stolen} coins! 🧁`);
  renderActionUI(roomData);
}

async function doJump() {
  const steps = 4;
  const st    = pState(roomData);
  st.cooldowns[playerSlot] = CHAR_CFG[roomData[`${playerSlot}_char`]].cooldown;
  moveFwd(st, playerSlot, steps);
  const finished = Math.floor(st.pos[playerSlot] / BOARD_SIZE) >= TOTAL_LAPS;
  await db.from('party_rooms').update({
    player_pos:       JSON.stringify(st.pos),
    player_coins:     JSON.stringify(st.coins),
    player_pizzas:    JSON.stringify(st.pizzas),
    player_cooldowns: JSON.stringify(st.cooldowns),
    turn_phase: 'moved', dice_result: steps,
    ...(finished ? { state: 'finished' } : {}),
  }).eq('id', roomId);
  showToast(`${roomData[`${playerSlot}_name`]} jumped ${steps} space${steps > 1 ? 's' : ''}!`);
}

async function doReroll() {
  const st = pState(roomData);
  st.cooldowns[playerSlot] = CHAR_CFG[roomData[`${playerSlot}_char`]].cooldown;
  await db.from('party_rooms').update({ player_cooldowns: JSON.stringify(st.cooldowns) }).eq('id', roomId);
  showToast('Roll again!');
}

// ── Minigame trigger ──────────────────────────────────────────────────────────
async function triggerMinigame(involvedSlots) {
  const cfg    = MINIGAME_LIST[Math.floor(Math.random() * MINIGAME_LIST.length)];
  const reward = Math.floor(Math.random() * 3) + 1;
  const config = { seed: Date.now(), recipe: null, guitarPos: null, attackDelay: null };

  // Deterministic seeds for fairness
  if (cfg.id === 'feedingFrenzy') {
    const FF_INGREDIENTS = ['🍅','🧀','🥓','🫑','🧅','🍄','🫒','🌶️','🥚','🍗'];
    const rng = seededRand(config.seed);
    const shuffled = [...FF_INGREDIENTS].sort(() => rng() - .5);
    config.recipe = shuffled.slice(0, 3);
  }
  if (cfg.id === 'guitarFinder') {
    config.guitarPos = Math.floor(seededRand(config.seed)() * 16);
  }
  if (cfg.id === 'powerOut') {
    config.attackDelay = Math.floor(seededRand(config.seed)() * 9000) + 1000;
  }

  const resetScores = {
    mg_score_p1: 0, mg_score_p2: 0, mg_score_p3: 0, mg_score_p4: 0,
    mg_done_p1: false, mg_done_p2: false, mg_done_p3: false, mg_done_p4: false,
  };

  await db.from('party_rooms').update({
    turn_phase: 'mg_waiting',   // wait for all players to be ready
    mg_id: cfg.id,
    mg_config: JSON.stringify(config),
    mg_players: JSON.stringify(involvedSlots),
    mg_reward: reward,
    ...resetScores,
  }).eq('id', roomId);
}

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

// ── Minigame wait screen (all-ready gate) ────────────────────────────────────
function showMgWaitScreen(room) {
  const involved = JSON.parse(room.mg_players || '[]');
  const cfg      = MINIGAME_LIST.find(m => m.id === room.mg_id);
  if (!cfg) return;

  const alreadyReady = room[mgDoneKey(playerSlot)];
  showScreen('minigame');
  const livebar = document.getElementById('mg-live-bar');
  if (livebar) livebar.style.display = 'none';

  document.getElementById('mg-content').innerHTML = `<div class="minigame-intro">
    <div class="mg-emoji">${cfg.emoji}</div>
    <h2 class="mg-title">${cfg.name}</h2>
    <p class="mg-desc">${cfg.desc}</p>
    <div class="mg-players" id="mg-ready-list">
      ${involved.map(s => {
        const char  = room[`${s}_char`] || 'freddy';
        const color = PLAYER_COLORS[slotNum(s) - 1];
        const ready = room[mgDoneKey(s)];
        return `<span class="mg-player-tag" id="ready-tag-${s}"
            style="border-color:${color};background:${ready ? color + '40' : color + '15'}">
          <img src="${charImg(char)}" style="width:16px;height:16px;border-radius:50%;object-fit:contain;vertical-align:middle;margin-right:4px" onerror="this.style.display='none'"/>
          ${room[`${s}_name`]} ${ready ? '✅' : '⏳'}
        </span>`;
      }).join('')}
    </div>
    <div class="mg-reward">🏆 Winner +${room.mg_reward}🪙 · Loser -${room.mg_reward}🪙</div>
    ${!alreadyReady && involved.includes(playerSlot)
      ? `<button class="mp-btn primary" id="mg-ready-btn">⚡ I'm Ready!</button>`
      : `<p class="mg-desc" style="font-size:.8rem">Waiting for all players...</p>`}
  </div>`;

  if (!alreadyReady && involved.includes(playerSlot)) {
    document.getElementById('mg-ready-btn').addEventListener('click', readyForMinigame);
  }
}

async function readyForMinigame() {
  const btn = document.getElementById('mg-ready-btn');
  if (btn) { btn.disabled = true; btn.textContent = '✅ Ready!'; }
  await db.from('party_rooms').update({
    [mgDoneKey(playerSlot)]: true,
  }).eq('id', roomId);
}

// ── Minigame screen (auto-starts when all ready) ──────────────────────────────
function startMinigameScreen(room) {
  if (mgCleanup) { mgCleanup(); mgCleanup = null; }
  const mg       = { id: room.mg_id, config: JSON.parse(room.mg_config || '{}'), reward: room.mg_reward };
  const involved = JSON.parse(room.mg_players || '[]');
  const cfg      = MINIGAME_LIST.find(m => m.id === mg.id);
  if (!cfg) return;

  showScreen('minigame');
  buildLiveBar(room, involved);

  // Spectator view
  if (!involved.includes(playerSlot)) {
    document.getElementById('mg-content').innerHTML = `<div class="minigame-intro">
      <div class="mg-emoji">${cfg.emoji}</div>
      <h2 class="mg-title">${cfg.name}</h2>
      <p class="mg-desc">Minigame in progress... waiting for results!</p>
    </div>`;
    return;
  }

  // All players were ready — start immediately
  const runners = {
    helpyBoop:     () => playHelpyBoop(room, mg),
    moneyLaundry:  () => playMoneyLaundry(room, mg),
    feedingFrenzy: () => playFeedingFrenzy(room, mg),
    guitarFinder:  () => playGuitarFinder(room, mg),
    powerOut:      () => playPowerOut(room, mg),
  };
  runners[mg.id]?.();
}

// ── Live scores bar ───────────────────────────────────────────────────────────
function buildLiveBar(room, involved) {
  const bar = document.getElementById('mg-live-bar');
  bar.style.display = 'flex';
  bar.innerHTML = involved.map(s => {
    const char  = room[`${s}_char`] || 'freddy';
    const color = PLAYER_COLORS[slotNum(s) - 1];
    return `<div class="mg-live-row${s === playerSlot ? ' me' : ''}" id="live-${s}" style="border-color:${color}">
      <img class="mg-live-avatar" src="${charImg(char)}" onerror="this.style.display='none'"/>
      <span class="mg-live-name" style="color:${color}">${room[`${s}_name`]}</span>
      <span class="mg-live-score" id="live-score-${s}">0</span>
    </div>`;
  }).join('');
}

function updateLiveBar() {
  Object.entries(liveScores).forEach(([slot, score]) => {
    const el = document.getElementById(`live-score-${slot}`);
    if (el) el.textContent = score;
  });
}

async function submitScore(score) {
  liveScores[playerSlot] = score;
  updateLiveBar();
  // Broadcast to others
  broadcastCh?.send({ type: 'broadcast', event: 'mg_score', payload: { slot: playerSlot, score } });
  // Write to DB as done
  await db.from('party_rooms').update({
    [mgScoreKey(playerSlot)]: score,
    [mgDoneKey(playerSlot)]: true,
  }).eq('id', roomId);
}

async function finishMinigame(room) {
  const involved = JSON.parse(room.mg_players || '[]');
  const ranked   = involved
    .map(s => ({ slot: s, score: room[mgScoreKey(s)] || 0 }))
    .sort((a, b) => b.score - a.score);

  const winner = ranked[0].slot;
  const loser  = ranked[ranked.length - 1].slot;
  const reward = room.mg_reward;
  const st     = pState(room);

  st.coins[winner] = (st.coins[winner] || 0) + reward;
  if (winner !== loser) {
    st.coins[loser] = Math.max(0, (st.coins[loser] || 0) - reward);
    if (room.mg_id === 'moneyLaundry')
      st.coins[loser] = Math.max(0, st.coins[loser] - 5);
  }

  // Feeding Frenzy: deduct 1 pizza from players who failed (score = 0)
  if (room.mg_id === 'feedingFrenzy') {
    involved.forEach(s => {
      if ((room[mgScoreKey(s)] || 0) === 0 && (st.pizzas[s] || 0) > 0) {
        st.pizzas[s]--;
      }
    });
  }

  // Distribute pizzas to any player whose coins >= 10
  involved.forEach(s => {
    const extra = Math.floor((st.coins[s] || 0) / COINS_PER_PIZZA);
    if (extra > 0) {
      st.pizzas[s] = (st.pizzas[s] || 0) + extra;
      st.coins[s]  = (st.coins[s]  || 0) % COINS_PER_PIZZA;
    }
  });

  const nextPlayer = nextSlot(room);
  await db.from('party_rooms').update({
    turn_phase: 'roll',
    current_slot: nextPlayer,
    player_coins:  JSON.stringify(st.coins),
    player_pizzas: JSON.stringify(st.pizzas),
    mg_id: null,
  }).eq('id', roomId).eq('turn_phase', 'minigame');
}

// ── Helpy Boop ────────────────────────────────────────────────────────────────
function playHelpyBoop(room, mg) {
  let score = 0, timeLeft = 30;
  let spawnTimer, countTimer;
  const helpyImgSrc = '../assets/images/chars/other/helpy.gif';

  document.getElementById('mg-content').innerHTML = `<div class="mg-play helpy-boop">
    <div class="mg-hud">
      <img src="${helpyImgSrc}" style="width:28px;height:28px;object-fit:contain;border-radius:50%" onerror="this.style.display='none'"/>
      <span>Helpy Boop</span>
      <span id="hb-score">👃 0</span>
      <span id="hb-timer">⏱ 30s</span>
    </div>
    <div class="hb-area" id="hb-area">
      <div style="padding:20px;text-align:center;color:var(--text-muted);font-size:.85rem">Click Helpy's nose!</div>
    </div>
  </div>`;

  const area    = document.getElementById('hb-area');
  const scoreEl = document.getElementById('hb-score');
  const timerEl = document.getElementById('hb-timer');

  function spawnHelpy() {
    const old = area.querySelector('.helpy-face');
    if (old) old.remove();
    const h = document.createElement('div');
    h.className = 'helpy-face';
    const maxX = Math.max(10, area.clientWidth  - 72);
    const maxY = Math.max(10, area.clientHeight - 72);
    h.style.left = Math.random() * maxX + 'px';
    h.style.top  = Math.random() * maxY + 'px';
    const img = document.createElement('img');
    img.src = helpyImgSrc;
    img.onerror = () => { h.textContent = '😊'; h.style.fontSize = '2.5rem'; h.style.background = '#ffcc44'; };
    h.appendChild(img);
    h.addEventListener('click', () => {
      score++;
      scoreEl.textContent = `👃 ${score}`;
      liveScores[playerSlot] = score;
      updateLiveBar();
      broadcastCh?.send({ type: 'broadcast', event: 'mg_score', payload: { slot: playerSlot, score } });
      h.classList.add('clicked');
      clearTimeout(spawnTimer);
      spawnTimer = setTimeout(spawnHelpy, 350);
    });
    area.appendChild(h);
    spawnTimer = setTimeout(spawnHelpy, 1600);
  }

  spawnHelpy();
  countTimer = setInterval(() => {
    timeLeft--;
    if (timerEl) timerEl.textContent = `⏱ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(countTimer); clearTimeout(spawnTimer);
      const a = document.getElementById('hb-area');
      if (a) a.innerHTML = `<div class="mg-done-msg">👃 ${score} clicks!</div>`;
      submitScore(score);
    }
  }, 1000);

  mgCleanup = () => { clearInterval(countTimer); clearTimeout(spawnTimer); };
}

// ── Money Laundering (drag to Rockstar Freddy) ────────────────────────────────
function playMoneyLaundry(room, mg) {
  let deposited = 0, timeLeft = 30;
  let dragCoin = null, dragOX = 0, dragOY = 0;
  const rfSrc = '../assets/images/chars/rockstar/rockstar_freddy.png';

  document.getElementById('mg-content').innerHTML = `<div class="mg-play money-laundry">
    <div class="mg-hud">
      <img src="${rfSrc}" style="width:26px;height:26px;object-fit:contain;border-radius:50%" onerror="this.style.display='none'"/>
      <span>Money Laundering</span>
      <span id="ml-dep">🏦 0</span>
      <span id="ml-timer">⏱ 30s</span>
    </div>
    <div class="ml-scene" id="ml-scene">
      <div class="ml-freddy-ring"></div>
      <div class="ml-freddy" id="ml-freddy">
        <img src="${rfSrc}" alt="Rockstar Freddy" onerror="this.innerHTML='🐻'"/>
      </div>
    </div>
    <p style="font-size:.75rem;color:var(--text-muted);text-align:center;margin:0">Drag coins to Rockstar Freddy!</p>
  </div>`;

  const scene  = document.getElementById('ml-scene');
  const freddy = document.getElementById('ml-freddy');
  const depEl  = document.getElementById('ml-dep');
  const timerEl = document.getElementById('ml-timer');

  function getFreddyRect() { return freddy.getBoundingClientRect(); }
  function isOverFreddy(x, y) {
    const r = getFreddyRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    return Math.hypot(x - cx, y - cy) < 55;
  }

  function spawnCoin() {
    if (timeLeft <= 0) return;
    const coin  = document.createElement('div');
    coin.className = 'ml-coin';
    const maxX = scene.clientWidth  - 40;
    const maxY = scene.clientHeight - 40;
    let cx, cy;
    do { cx = Math.random() * maxX; cy = Math.random() * maxY; }
    while (Math.abs(cx - scene.clientWidth/2) < 60 && Math.abs(cy - scene.clientHeight/2) < 60);
    coin.style.left = cx + 'px';
    coin.style.top  = cy + 'px';
    coin.textContent = '🪙';

    const startDrag = (e) => {
      e.preventDefault();
      dragCoin = coin;
      const client = e.touches ? e.touches[0] : e;
      const rect = coin.getBoundingClientRect();
      dragOX = client.clientX - rect.left;
      dragOY = client.clientY - rect.top;
      coin.classList.add('dragging');
    };
    coin.addEventListener('mousedown', startDrag);
    coin.addEventListener('touchstart', startDrag, { passive: false });
    scene.appendChild(coin);
  }

  const onMove = (e) => {
    if (!dragCoin) return;
    e.preventDefault();
    const client = e.touches ? e.touches[0] : e;
    const sRect  = scene.getBoundingClientRect();
    dragCoin.style.left = (client.clientX - sRect.left - dragOX) + 'px';
    dragCoin.style.top  = (client.clientY - sRect.top  - dragOY) + 'px';
  };
  const onUp = (e) => {
    if (!dragCoin) return;
    const client = e.changedTouches ? e.changedTouches[0] : e;
    if (isOverFreddy(client.clientX, client.clientY)) {
      dragCoin.classList.add('deposited');
      dragCoin.classList.remove('dragging');
      deposited++;
      depEl.textContent = `🏦 ${deposited}`;
      liveScores[playerSlot] = deposited;
      updateLiveBar();
      broadcastCh?.send({ type: 'broadcast', event: 'mg_score', payload: { slot: playerSlot, score: deposited } });
      setTimeout(() => { dragCoin?.remove(); dragCoin = null; spawnCoin(); }, 280);
    } else {
      dragCoin.classList.remove('dragging');
      dragCoin = null;
    }
  };

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup',   onUp);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend',  onUp);

  for (let i = 0; i < 6; i++) setTimeout(spawnCoin, i * 200);

  const ct = setInterval(() => {
    timeLeft--;
    if (timerEl) timerEl.textContent = `⏱ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(ct);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend',  onUp);
      const s = document.getElementById('ml-scene');
      if (s) s.innerHTML = `<div class="mg-done-msg" style="color:var(--gold)">💰 ${deposited} deposited!</div>`;
      submitScore(deposited);
    }
  }, 1000);

  mgCleanup = () => {
    clearInterval(ct);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup',   onUp);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend',  onUp);
  };
}

// ── Feeding Frenzy ────────────────────────────────────────────────────────────
const FF_INGREDIENTS = ['🍅','🧀','🥓','🫑','🧅','🍄','🫒','🌶️','🥚','🍗'];

function playFeedingFrenzy(room, mg) {
  const recipe   = mg.config.recipe || [...FF_INGREDIENTS].sort(() => Math.random() - .5).slice(0, 3);
  const chSrc    = '../assets/images/chars/classic/chica.png';
  let step       = 0, failed = false;
  const start    = Date.now();
  let ct         = null;

  function render() {
    const shuffled = [...FF_INGREDIENTS].sort(() => Math.random() - .5);
    document.getElementById('mg-content').innerHTML = `<div class="mg-play feeding-frenzy">
      <div class="mg-hud">
        <img class="ff-chica-img" src="${chSrc}" onerror="this.style.display='none'"/>
        <span>Feeding Frenzy</span>
        <span>Step ${step + 1}/${recipe.length}</span>
        <span id="ff-timer">⏱ 60s</span>
      </div>
      <div class="ff-recipe">
        <div class="ff-label">Chica's Recipe</div>
        <div class="ff-recipe-items">
          ${recipe.map((ing, i) => `<span class="ff-recipe-ing ${i < step ? 'done' : i === step ? 'current' : ''}">${i < step ? '✅' : ing}</span>`).join('')}
        </div>
      </div>
      <div class="ff-instruction">Click: <span class="ff-target">${recipe[step]}</span></div>
      <div class="ff-ingredients" id="ff-grid">
        ${shuffled.map(ing => `<button class="mp-btn ff-ing-btn" data-ing="${ing}">${ing}</button>`).join('')}
      </div>
    </div>`;

    // Attach click listeners (event delegation)
    document.getElementById('ff-grid').addEventListener('click', (e) => {
      const btn = e.target.closest('.ff-ing-btn');
      if (!btn || failed) return;
      handleFFClick(btn.dataset.ing);
    });

    // Timer
    let tLeft = 60 - Math.floor((Date.now() - start) / 1000);
    if (ct) clearInterval(ct);
    ct = setInterval(() => {
      tLeft--;
      const te = document.getElementById('ff-timer');
      if (te) te.textContent = `⏱ ${tLeft}s`;
      if (tLeft <= 0) { clearInterval(ct); if (!failed) ffEnd(false); }
    }, 1000);
  }

  function handleFFClick(ing) {
    if (failed) return;
    if (ing === recipe[step]) {
      step++;
      if (step >= recipe.length) {
        if (ct) clearInterval(ct);
        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        const score   = Math.round(1000 / parseFloat(elapsed));
        document.getElementById('mg-content').innerHTML =
          `<div class="mg-done-msg">🍕 Pizza done in ${elapsed}s!</div>`;
        submitScore(score);
      } else {
        render();
      }
    } else {
      if (ct) clearInterval(ct);
      ffEnd(true);
    }
  }

  function ffEnd(wrong) {
    if (failed) return;
    failed = true;
    const msg = wrong ? '❌ Wrong ingredient! -1 pizza 😢' : '⏱ Time\'s up! -1 pizza 😢';
    document.getElementById('mg-content').innerHTML = `<div class="mg-done-msg">${msg}</div>`;
    submitScore(0);
  }

  mgCleanup = () => { if (ct) clearInterval(ct); };
  setTimeout(() => { if (!failed && step < recipe.length) ffEnd(false); }, 60000);
  render();
}

// ── Guitar Finder ─────────────────────────────────────────────────────────────
const GF_ITEMS = ['🎹','🥁','🎺','🎻','🎤','🔊','💡','🎭','🎪','🎨','🪗','🎵','🎼','🎙️','🔔','📯'];

function playGuitarFinder(room, mg) {
  const gPos  = mg.config.guitarPos ?? Math.floor(Math.random() * 16);
  const items = Array.from({ length: 16 }, (_, i) =>
    i === gPos ? '🎸' : GF_ITEMS[Math.floor(Math.random() * GF_ITEMS.length)]);
  const start  = Date.now();
  let timeLeft = 30, done = false;
  const bnSrc  = '../assets/images/chars/classic/bonnie.png';

  document.getElementById('mg-content').innerHTML = `<div class="mg-play guitar-finder">
    <div class="mg-hud">
      <img class="gf-bonnie-img" src="${bnSrc}" onerror="this.style.display='none'"/>
      <span>Guitar Finder</span>
      <span id="gf-timer">⏱ 30s</span>
    </div>
    <div class="gf-instruction">Find Bonnie's guitar 🎸!</div>
    <div class="gf-grid" id="gf-grid">
      ${items.map((item, i) => `<button class="mp-btn gf-item" data-idx="${i}">${item}</button>`).join('')}
    </div>
  </div>`;

  document.getElementById('gf-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('.gf-item');
    if (!btn || done) return;
    const idx = +btn.dataset.idx;
    if (idx === gPos) {
      done = true; clearInterval(ct);
      const elapsed = ((Date.now() - start) / 1000).toFixed(2);
      const score   = Math.round(10000 / parseFloat(elapsed));
      document.getElementById('mg-content').innerHTML =
        `<div class="mg-done-msg">🎸 Found it in ${elapsed}s!</div>`;
      submitScore(score);
    } else {
      btn.style.background = '#8b2020'; btn.disabled = true;
    }
  });

  const ct = setInterval(() => {
    timeLeft--;
    const te = document.getElementById('gf-timer');
    if (te) te.textContent = `⏱ ${timeLeft}s`;
    if (timeLeft <= 0) {
      done = true; clearInterval(ct);
      document.getElementById('mg-content').innerHTML = `<div class="mg-done-msg">⏱ Didn't find it! 0 pts</div>`;
      submitScore(0);
    }
  }, 1000);

  mgCleanup = () => clearInterval(ct);
}

// ── Power Out ─────────────────────────────────────────────────────────────────
function playPowerOut(room, mg) {
  const attackDelay = mg.config.attackDelay ?? (Math.floor(Math.random() * 9000) + 1000);
  let survived = false;
  const start  = Date.now();
  const frSrc  = '../assets/images/chars/classic/freddy.png';

  document.getElementById('mg-content').innerHTML = `<div class="mg-play power-out">
    <div class="mg-hud">
      <img src="${frSrc}" style="width:26px;height:26px;border-radius:50%;object-fit:contain" onerror="this.style.display='none'"/>
      <span>Power Out</span>
      <span id="po-status">🌑 Waiting...</span>
    </div>
    <div class="po-scene" id="po-scene">
      <div class="po-darkness"></div>
      <div class="po-freddy-container" id="po-fc">
        <img class="po-freddy-img" src="${frSrc}" alt="Freddy" onerror="this.textContent='🐻'"/>
      </div>
      <div class="po-instruction">Close the door when Freddy appears!</div>
      <button class="mp-btn primary po-door-btn" id="po-door" disabled>🚪 Close Door!</button>
    </div>
  </div>`;

  let dots = 0;
  const dotTimer = setInterval(() => {
    dots = (dots + 1) % 4;
    const s = document.getElementById('po-status');
    if (s && !survived) s.textContent = '🌑 Waiting' + '.'.repeat(dots);
  }, 500);

  const attackTimer = setTimeout(() => {
    clearInterval(dotTimer);
    const scene  = document.getElementById('po-scene');
    const door   = document.getElementById('po-door');
    const status = document.getElementById('po-status');
    if (!scene) return;

    scene.classList.add('freddy-incoming');
    if (status) status.textContent = '😱 FREDDY!!!';
    if (door)   door.disabled = false;

    const missTimer = setTimeout(() => {
      if (!survived) {
        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        document.getElementById('mg-content').innerHTML =
          `<div class="mg-done-msg">💀 Freddy got you! (${elapsed}s)</div>`;
        submitScore(Math.round(parseFloat(elapsed) * 10));
      }
    }, 3000);

    door?.addEventListener('click', () => {
      if (survived) return;
      survived = true;
      clearTimeout(missTimer);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      const score   = Math.round(parseFloat(elapsed) * 10 + 500);
      document.getElementById('mg-content').innerHTML =
        `<div class="mg-done-msg">✅ Survived! (${elapsed}s) 🎉</div>`;
      submitScore(score);
    }, { once: true });
  }, attackDelay);

  mgCleanup = () => { clearInterval(dotTimer); clearTimeout(attackTimer); };
}

// ── Result screen ─────────────────────────────────────────────────────────────
function showResult(room) {
  const pc = room.player_count || 2;
  const st = pState(room);

  const ranked = allSlots(pc)
    .filter(s => room[`${s}_name`])
    .map(s => ({
      slot:   s,
      name:   room[`${s}_name`],
      char:   room[`${s}_char`] || 'freddy',
      color:  PLAYER_COLORS[slotNum(s) - 1],
      pizzas: (st.pizzas[s] || 0) + Math.floor((st.coins[s] || 0) / COINS_PER_PIZZA),
      coins:  (st.coins[s]  || 0) % COINS_PER_PIZZA,
    }))
    .sort((a, b) => b.pizzas !== a.pizzas ? b.pizzas - a.pizzas : b.coins - a.coins);

  showScreen('result');
  const rankEl = document.getElementById('result-rankings');
  const winner = ranked[0];
  if (!winner) return;

  rankEl.innerHTML = `
    <div class="result-winner-banner">
      <img class="rwb-avatar" src="${charImg(winner.char)}" onerror="this.style.display='none'"/>
      <div class="rwb-name" style="color:${winner.color}">${winner.name} Wins! 🎉</div>
      <div class="rwb-score">🍕 ${winner.pizzas} pizza${winner.pizzas !== 1 ? 's' : ''}</div>
    </div>
    ${ranked.map((p, i) => `
      <div class="result-rank-row${i === 0 ? ' result-winner' : ''}">
        <span class="result-medal">${['🥇','🥈','🥉','4️⃣'][i]}</span>
        <img class="result-avatar" src="${charImg(p.char)}" onerror="this.style.display='none'"/>
        <span class="result-player-name" style="color:${p.color}">${p.name}</span>
        <span class="result-score">🍕${p.pizzas} 🪙${p.coins}</span>
      </div>`).join('')}`;

  // Hide "Play Again" if game ended because someone left (only 1 active player)
  const wonByLeave = ranked.length === 1;
  const rematchBtn = document.getElementById('rematch-btn');
  if (rematchBtn) rematchBtn.style.display = wonByLeave ? 'none' : '';

  // Jumpscare — only for winner when opponents are present
  const isWinner = winner.slot === playerSlot;
  if (isWinner && !wonByLeave) {
    const wrap = document.querySelector('.party-result-wrap');
    const jsBtn = document.createElement('button');
    jsBtn.className = 'mp-btn accent jumpscare-btn';
    jsBtn.textContent = '🎃 Jumpscare!';

    const picker = document.createElement('div');
    picker.className = 'jumpscare-picker';
    picker.style.display = 'none';

    const jsOptions = [
      ...Object.entries(CHAR_CFG).map(([key, c]) => ({ key, label: c.name })),
      { key: 'golden_freddy', label: 'Golden Freddy' },
    ];
    jsOptions.forEach(({ key, label }) => {
      const btn = document.createElement('button');
      btn.className = 'mp-btn small jumpscare-opt-btn';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        jsBtn.style.display = 'none';
        picker.style.display = 'none';
        broadcastCh?.send({ type: 'broadcast', event: 'jumpscare', payload: { char: key, sender: playerId } });
      });
      picker.appendChild(btn);
    });

    jsBtn.addEventListener('click', () => {
      picker.style.display = picker.style.display === 'none' ? '' : 'none';
    });

    wrap.appendChild(jsBtn);
    wrap.appendChild(picker);
  }
}

async function voteRematch() {
  const btn = document.getElementById('rematch-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Waiting...'; }

  const room   = roomData;
  const pc     = room.player_count || 2;
  const current = room.mg_id || '';
  if (current.includes(playerSlot)) return;

  const newVotes = current ? current + ':' + playerSlot : playerSlot;
  await db.from('party_rooms').update({ mg_id: newVotes }).eq('id', roomId);

  // Check if all voted now (this player may be the last)
  const allSlotsList = allSlots(pc).filter(s => room[`${s}_name`]);
  if (allSlotsList.every(s => newVotes.includes(s))) {
    triggerPartyRematch({ ...room, mg_id: newVotes });
  }
}

async function triggerPartyRematch(room) {
  // Parse voter slots from mg_id e.g. "player1:player3"
  const voters  = (room.mg_id || '').split(':').filter(s => /^player\d+$/.test(s));
  const ordered = voters.sort((a, b) => slotNum(a) - slotNum(b));
  if (!ordered.includes(playerSlot)) return; // I didn't vote, skip
  if (playerSlot !== ordered[0]) return;     // Only lowest voter executes

  const newCount = ordered.length;
  const taken = [], pos = {}, coins = {}, pizzas = {}, cooldowns = {};
  const update = {
    state: 'waiting', player_count: newCount,
    board: JSON.stringify(generateBoard()),
    current_slot: 'player1', turn_phase: 'roll', dice_result: 0,
    mg_id: null, mg_config: '{}', mg_players: '[]', mg_reward: 1,
    mg_score_p1: 0, mg_score_p2: 0, mg_score_p3: 0, mg_score_p4: 0,
    mg_done_p1: false, mg_done_p2: false, mg_done_p3: false, mg_done_p4: false,
  };

  // Compact voter slots → player1, player2, …
  ordered.forEach((origSlot, idx) => {
    const ns = `player${idx + 1}`;
    update[`${ns}_id`]   = room[`${origSlot}_id`];
    update[`${ns}_name`] = room[`${origSlot}_name`];
    update[`${ns}_char`] = null; // must re-pick
    let p; do { p = Math.floor(Math.random() * BOARD_SIZE); } while (taken.includes(p));
    taken.push(p);
    pos[ns] = p; coins[ns] = 0; pizzas[ns] = 0; cooldowns[ns] = 0;
  });
  // Clear unused slots
  for (let i = newCount + 1; i <= 4; i++) {
    const ns = `player${i}`;
    update[`${ns}_id`] = null; update[`${ns}_name`] = null; update[`${ns}_char`] = null;
  }
  Object.assign(update, {
    player_pos:       JSON.stringify(pos),
    player_coins:     JSON.stringify(coins),
    player_pizzas:    JSON.stringify(pizzas),
    player_cooldowns: JSON.stringify(cooldowns),
  });

  await db.from('party_rooms').update(update).eq('id', roomId);
}

function restartParty() {
  roomId = null; playerSlot = null; roomData = null;
  liveScores = {}; activeMgId = null; mgWaitKey = null;
  if (mgCleanup) { mgCleanup(); mgCleanup = null; }
  const livebar = document.getElementById('mg-live-bar');
  if (livebar) livebar.style.display = 'none';
  showScreen('lobby');
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.createElement('div');
  t.className   = 'party-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

function toggleRules() {
  const box = document.getElementById('rules-box');
  if (box) box.style.display = box.style.display === 'none' ? '' : 'none';
}

// ── Player leave detection ────────────────────────────────────────────────────
async function cleanupPlayerLeft() {
  if (!roomId || !playerSlot || !roomData) return;
  const room       = roomData;
  const savedId    = roomId;
  const savedSlot  = playerSlot;
  // Clear local state immediately
  roomId = null; playerSlot = null; roomData = null;
  if (mgCleanup) { mgCleanup(); mgCleanup = null; }

  const pc     = room.player_count || 2;
  const active = allSlots(pc).filter(s => room[`${s}_name`] && s !== savedSlot);
  const update = {
    [`${savedSlot}_name`]: null,
    [`${savedSlot}_id`]:   null,
    [`${savedSlot}_char`]: null,
  };

  if (active.length === 0) {
    // Empty — nothing to do

  } else if (active.length === 1 && room.state === 'playing') {
    // Last player standing → auto-win
    update.state  = 'finished';
    update.mg_id  = null;

  } else if (active.length >= 1) {
    // Advance turn if it was the leaver's turn
    if (room.current_slot === savedSlot) {
      const order = allSlots(pc);
      const idx   = order.indexOf(savedSlot);
      const next  = order.slice(idx + 1).concat(order.slice(0, idx)).find(s => active.includes(s));
      if (next) { update.current_slot = next; update.turn_phase = 'roll'; update.dice_result = 0; }
    }
    // If a minigame was in progress, cancel it if not enough players remain
    if (room.turn_phase === 'mg_waiting' || room.turn_phase === 'minigame') {
      const mgPlayers = JSON.parse(room.mg_players || '[]').filter(s => s !== savedSlot);
      update.mg_players = JSON.stringify(mgPlayers);
      if (mgPlayers.length < 2) {
        update.turn_phase = 'roll';
        update.mg_id = null;
        update.mg_done_p1 = false; update.mg_done_p2 = false;
        update.mg_done_p3 = false; update.mg_done_p4 = false;
        if (!update.current_slot) update.current_slot = active[0];
      } else {
        // Mark leaver as done so remaining players aren't blocked
        update[mgDoneKey(savedSlot)] = true;
      }
    }
  }

  try { await db.from('party_rooms').update(update).eq('id', savedId); } catch (_) {}
}

// Override goHome so leaving cleans up the room
const _coreGoHome = window.goHome;
window.goHome = async function() {
  await cleanupPlayerLeft();
  _coreGoHome?.();
};

// Cleanup on tab close / browser back
window.addEventListener('beforeunload', () => {
  if (!roomId || !playerSlot) return;
  const savedId   = roomId;
  const savedSlot = playerSlot;
  const room      = roomData || {};
  roomId = null; playerSlot = null; roomData = null;

  const pc     = room.player_count || 2;
  const active = allSlots(pc).filter(s => room[`${s}_name`] && s !== savedSlot);
  const body   = { [`${savedSlot}_name`]: null, [`${savedSlot}_id`]: null };
  if (active.length === 1 && room.state === 'playing') body.state = 'finished';
  if (active.length > 0 && room.current_slot === savedSlot) {
    const order = allSlots(pc);
    const idx   = order.indexOf(savedSlot);
    const next  = order.slice(idx + 1).concat(order.slice(0, idx)).find(s => active.includes(s));
    if (next) { body.current_slot = next; body.turn_phase = 'roll'; }
  }
  fetch(`${cfg.SUPABASE_URL}/rest/v1/party_rooms?id=eq.${savedId}`, {
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
  showScreen('lobby');
  initLobby();
});
