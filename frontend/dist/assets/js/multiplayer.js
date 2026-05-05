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
let roomId          = null;
let playerSlot      = null;
let roomData        = null;
let myChar          = null;
let gameInit        = false;
let selectionShown  = false;  // prevents showSelectionScreen resetting on every room update

// ── Game filter ───────────────────────────────────────────────────────────────
const GAMES = [
  { name: "Five Nights at Freddy's",             start: 0,   end: 8   },
  { name: "Five Nights at Freddy's 2",             start: 9,   end: 29  },
  { name: "Five Nights at Freddy's 3",             start: 30,  end: 39  },
  { name: "Five Nights at Freddy's 4",             start: 40,  end: 59  },
  { name: 'FNAF World',         start: 60,  end: 137 },
  { name: "Five Nights at Freddy's: Sister Location",    start: 138, end: 155 },
  { name: "Freddy Fazbear's Pizzeria Simulator", start: 156, end: 195 },
  { name: 'Ultimate Custom Night',                start: 196, end: 210 },
  { name: "Five Nights at Freddy's: Help Wanted",        start: 211, end: 227 },
  { name: "Five Nights at Freddy's: Security Breach",    start: 228, end: 268 },
  { name: "Five Nights at Freddy's: Security Breach - RUIN",               start: 269, end: 287 },
  { name: "Five Nights at Freddy's: Help Wanted 2",      start: 288, end: 295 },
  { name: "Five Nights at Freddy's: Secret of the Mimic",               start: 296, end: 352 },
];

function getFilteredChars() {
  const filter = roomData && roomData.game_filter;
  if (!filter) return CHARS;
  const [from, to] = filter.split('-').map(Number);
  const s = GAMES[from].start, e = GAMES[to].end;
  return CHARS.filter((_, i) => i >= s && i <= e);
}

function getFilterVal() {
  if (document.getElementById('filter-all').checked) return null;
  const from = parseInt(document.getElementById('filter-from').value);
  const to   = parseInt(document.getElementById('filter-to').value);
  return `${Math.min(from, to)}-${Math.max(from, to)}`;
}

function filterLabel(filter) {
  if (!filter) return 'All games';
  const [from, to] = filter.split('-').map(Number);
  return from === to ? GAMES[from].name : `${GAMES[from].name} → ${GAMES[to].name}`;
}

// ── Predefined questions ──────────────────────────────────────────────────────
const QUESTIONS = [
  { field: 'animal',   text: '🐾 What animal is this animatronic?',              uiType: 'list'  },
  { field: 'type',     text: '🏷️ What type category is this animatronic?',       uiType: 'list'  },
  { field: 'color',    text: '🎨 What is the main color of this animatronic?',    uiType: 'color' },
  { field: 'eyeColor', text: '👁️ What eye color does this animatronic have?',    uiType: 'color' },
  { field: 'year',     text: '📅 What year does this animatronic originate from?', uiType: 'year' },
];

function getQuestion(field) { return QUESTIONS.find(q => q.field === field) || QUESTIONS[0]; }

function randomQuestion() {
  return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)].field;
}

// Derive unique values from CHARS
function uniqueVals(field) {
  const vals = new Set();
  CHARS.forEach(c => {
    const v = c[field];
    if (Array.isArray(v)) v.forEach(x => vals.add(String(x)));
    else if (v !== undefined && v !== null) vals.add(String(v));
  });
  const arr = [...vals];
  if (field === 'year') arr.sort((a, b) => { if (a === 'Unconfirmed') return 1; if (b === 'Unconfirmed') return -1; return +a - +b; });
  else arr.sort();
  return arr;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const SCREENS = ['lobby', 'waiting', 'selection', 'game', 'result'];
function showScreen(name) {
  SCREENS.forEach(id => {
    const el = document.getElementById('screen-' + id);
    if (el) el.style.display = id === name ? '' : 'none';
  });
}

function lobbyError(msg) { document.getElementById('lobby-error').textContent = msg; }
function genCode() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }
function other(slot) { return slot === 'player1' ? 'player2' : 'player1'; }
function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function colorSwatch(val) {
  if (/^#[0-9a-f]{6}$/i.test(val))
    return `<span style="display:inline-block;width:14px;height:14px;background:${val};border-radius:3px;border:1px solid rgba(255,255,255,0.3);vertical-align:middle;margin-right:5px;flex-shrink:0;"></span>`;
  return '';
}

// ── Create / Join ─────────────────────────────────────────────────────────────
async function createRoom() {
  const name = document.getElementById('lobby-name').value.trim();
  if (!name) return lobbyError('Enter your name first.');

  const { data, error } = await db.from('mp_rooms').insert({
    room_code: genCode(), state: 'waiting',
    player1_id: playerId, player1_name: name,
    game_filter: getFilterVal(),
  }).select().single();

  if (error) return lobbyError('Could not create room. Try again.');
  roomId = data.id; playerSlot = 'player1'; roomData = data;
  document.getElementById('waiting-code').textContent = data.room_code;
  document.getElementById('waiting-filter-label').textContent = '\u{1F3AE} ' + filterLabel(data.game_filter);
  showScreen('waiting');
  subscribeRoom();
}

async function joinRoom() {
  const name = document.getElementById('lobby-name').value.trim();
  const code = document.getElementById('lobby-code').value.trim().toUpperCase();
  if (!name) return lobbyError('Enter your name first.');
  if (code.length < 6) return lobbyError('Enter the full 6-character code.');

  const { data: room, error } = await db.from('mp_rooms').select('*').eq('room_code', code).eq('state', 'waiting').single();
  if (error || !room) return lobbyError('Room not found or already started.');

  const { data, error: err2 } = await db.from('mp_rooms').update({
    state: 'selecting', player2_id: playerId, player2_name: name,
  }).eq('id', room.id).select().single();

  if (err2) return lobbyError('Could not join. Try again.');
  roomId = room.id; playerSlot = 'player2'; roomData = data;
  subscribeRoom(); subscribeEvents();
  selectionShown = true;
  showSelectionScreen();
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

function handleRoomUpdate(room) {
  const prevState = roomData ? roomData.state : null;
  roomData = room;
  if (room.state === 'selecting') {
    if (prevState === 'finished' || prevState === 'playing') {
      gameInit = false; myChar = null; selectionShown = true;
      showSelectionScreen();
    } else if (!selectionShown) {
      if (playerSlot === 'player1') subscribeEvents();
      selectionShown = true;
      showSelectionScreen();
    }
  } else if (room.state === 'playing') {
    if (!gameInit) renderGameScreen(room);
    else updateTurnUI(room.phase, room.current_question);
  } else if (room.state === 'finished') {
    renderResultScreen(room);
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
  pool.forEach(char => {
    const card = document.createElement('div');
    card.className = 'char-grid-card';
    card.dataset.name = char.name;
    const img = document.createElement('img');
    img.src = '../assets/' + char.img;
    img.alt = char.name;
    img.onerror = () => { img.src = '../assets/images/default.png'; };
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

function filterCharGrid(grid, q) {
  const lq = q.toLowerCase();
  grid.querySelectorAll('.char-grid-card').forEach(card => {
    const match = !lq || card.dataset.name.toLowerCase().includes(lq);
    card.style.display = match ? '' : 'none';
  });
}

document.getElementById('confirm-selection-btn').addEventListener('click', async () => {
  if (!myChar) return;
  document.getElementById('confirm-selection-btn').disabled = true;
  document.getElementById('selection-status').textContent = 'Waiting for opponent to choose...';

  const update = { [`${playerSlot}_char`]: myChar.name, [`${playerSlot}_ready`]: true };
  const { data } = await db.from('mp_rooms').update(update).eq('id', roomId).select().single();
  roomData = data;

  if (data[`${other(playerSlot)}_ready`]) {
    // Coinflip: p1_turn_ask or p2_turn_ask
    const firstPhase = Math.random() < 0.5 ? 'p2_turn_ask' : 'p1_turn_ask';
    const firstAskerSlot = firstPhase === 'p2_turn_ask' ? 'player2' : 'player1';
    const { data: gameData } = await db.from('mp_rooms').update({
      state: 'playing', phase: firstPhase,
      current_question: null,
      first_asker: firstAskerSlot,
    }).eq('id', roomId).select().single();
    // Supabase won't echo this back to the client that made the change,
    // so we render the game screen directly for the triggering player.
    roomData = gameData;
    renderGameScreen(gameData);
  }
});

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
function renderGameScreen(room) {
  if (gameInit) return;
  gameInit = true;
  startPeriodicSync();
  showScreen('game');

  // My char badge
  const badge = document.getElementById('my-char-badge');
  badge.style.display = 'flex';
  const bImg = document.getElementById('my-char-badge-img');
  bImg.src = '../assets/' + myChar.img;
  document.getElementById('my-char-badge-name').textContent = myChar.name;

  // Coinflip result system message
  const firstAsker = room.first_asker || 'player1';
  const firstName = room[`${firstAsker}_name`] || 'Player 1';
  const chatLog = document.getElementById('chat-log');
  chatLog.innerHTML = `<div class="chat-msg msg-system">🪙 Coin flip! <strong>${firstName}</strong> goes first.</div>`;

  // Build elimination grid
  const elimGrid = document.getElementById('elim-grid');
  buildCharGrid(elimGrid, (char, card) => {
    card.classList.toggle('eliminated');
  });

  // Elim search
  document.getElementById('elim-search').oninput = function() {
    filterCharGrid(elimGrid, this.value);
  };

  updateTurnUI(room.phase, room.current_question);
}

function buildAskUI() {
  const container = document.getElementById('ask-questions-list');
  if (container.innerHTML !== '') return;
  QUESTIONS.forEach(q => {
    const btn = document.createElement('button');
    btn.className = 'list-pick-btn';
    btn.style.textAlign = 'left';
    btn.textContent = q.text;
    btn.addEventListener('click', async () => {
      container.querySelectorAll('button').forEach(b => b.disabled = true);
      const nextPhase = playerSlot === 'player1' ? 'p2_turn_answer' : 'p1_turn_answer';
      await db.from('mp_events').insert({
        room_id: roomId, player: playerSlot, type: 'question',
        content: JSON.stringify({ question: q.text }),
      });
      const { data } = await db.from('mp_rooms').update({ 
        phase: nextPhase, current_question: q.field 
      }).eq('id', roomId).select().single();
      roomData = data;
      container.querySelectorAll('button').forEach(b => b.disabled = false);
      updateTurnUI(nextPhase, q.field);
    });
    container.appendChild(btn);
  });
}

// ── Turn UI ───────────────────────────────────────────────────────────────────
function updateTurnUI(phase, questionField) {
  const indicator   = document.getElementById('turn-indicator');
  const actingPanel = document.getElementById('acting-panel');
  const answerPanel = document.getElementById('answer-panel');
  const waitingPanel = document.getElementById('waiting-panel');
  const askPanel    = document.getElementById('ask-panel');

  actingPanel.style.display  = 'none';
  answerPanel.style.display  = 'none';
  waitingPanel.style.display = 'none';
  if (askPanel) askPanel.style.display = 'none';

  const q = questionField ? getQuestion(questionField) : null;

  const myAsking    = (playerSlot === 'player1' && phase === 'p1_turn_ask') || (playerSlot === 'player2' && phase === 'p2_turn_ask');
  const myActing    = (playerSlot === 'player1' && phase === 'p1_turn_act') || (playerSlot === 'player2' && phase === 'p2_turn_act');
  const myAnswering = (playerSlot === 'player1' && phase === 'p1_turn_answer') || (playerSlot === 'player2' && phase === 'p2_turn_answer');
  const iAsked      = (playerSlot === 'player1' && phase === 'p2_turn_answer') || (playerSlot === 'player2' && phase === 'p1_turn_answer');

  if (myAsking) {
    indicator.className = 'turn-indicator my-turn';
    indicator.textContent = 'Your turn — choose a question to ask!';
    if (askPanel) {
      buildAskUI();
      askPanel.style.display = '';
    }
  } else if (myActing) {
    indicator.className = 'turn-indicator my-turn';
    indicator.textContent = 'Your turn — review the answer and guess or pass!';
    if (q) document.getElementById('acting-question-text').textContent = q.text;
    actingPanel.style.display = '';
  } else if (myAnswering) {
    indicator.className = 'turn-indicator answer-turn';
    indicator.textContent = 'Answer your opponent\'s question!';
    if (q) renderAnswerUI(q);
    answerPanel.style.display = '';
  } else if (iAsked) {
    indicator.className = 'turn-indicator opponent-turn';
    indicator.textContent = 'Waiting for opponent to answer...';
    document.getElementById('waiting-panel-text').innerHTML = q ? 
      `Waiting for opponent to answer:<br><em class="qa-q-text">${q.text}</em>` : 'Waiting for opponent to answer...';
    waitingPanel.style.display = '';
  } else {
    indicator.className = 'turn-indicator opponent-turn';
    indicator.textContent = 'Waiting for opponent...';
    document.getElementById('waiting-panel-text').textContent = 
      (phase === 'p1_turn_ask' || phase === 'p2_turn_ask') 
        ? 'Waiting for opponent to choose a question...' 
        : 'Waiting for opponent to act...';
    waitingPanel.style.display = '';
  }
}

// ── Answer UI ─────────────────────────────────────────────────────────────────
let pendingAnswer = null;

function renderAnswerUI(q) {
  pendingAnswer = null;
  document.getElementById('submit-answer-btn').disabled = true;
  document.getElementById('answer-chosen-preview').textContent = '';
  document.getElementById('answer-question-text').textContent = q.text;

  const colorPicker = document.getElementById('answer-color-picker');
  const listPicker  = document.getElementById('answer-list-picker');
  const yearPicker  = document.getElementById('answer-year-picker');
  colorPicker.style.display = listPicker.style.display = yearPicker.style.display = 'none';

  if (q.uiType === 'color') {
    colorPicker.style.display = '';
    const colorInput = document.getElementById('answer-color-input');
    const colorIdk = document.getElementById('answer-color-idk');
    
    colorInput.oninput = () => {
      pendingAnswer = colorInput.value;
      document.getElementById('answer-chosen-preview').innerHTML = `${colorSwatch(pendingAnswer)}Selected: ${pendingAnswer}`;
      document.getElementById('submit-answer-btn').disabled = false;
    };
    
    colorIdk.onclick = () => {
      pendingAnswer = "I don't know";
      document.getElementById('answer-chosen-preview').textContent = `Selected: I don't know`;
      document.getElementById('submit-answer-btn').disabled = false;
    };
  } else if (q.uiType === 'list') {
    listPicker.style.display = '';
    const grid = document.getElementById('answer-list-items');
    grid.innerHTML = '';
    const vals = uniqueVals(q.field);
    vals.forEach(val => {
      const btn = document.createElement('button');
      btn.className = 'list-pick-btn';
      btn.textContent = val;
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.list-pick-btn').forEach(b => b.classList.remove('chosen'));
        btn.classList.add('chosen');
        pendingAnswer = val;
        document.getElementById('answer-chosen-preview').textContent = `Selected: ${val}`;
        document.getElementById('submit-answer-btn').disabled = false;
      });
      grid.appendChild(btn);
    });
    document.getElementById('answer-list-idk').onclick = () => {
      grid.querySelectorAll('.list-pick-btn').forEach(b => b.classList.remove('chosen'));
      pendingAnswer = "I don't know";
      document.getElementById('answer-chosen-preview').textContent = `Selected: I don't know`;
      document.getElementById('submit-answer-btn').disabled = false;
    };
  } else if (q.uiType === 'year') {
    yearPicker.style.display = '';
    const yrInput = document.getElementById('answer-year-input');
    const yrUnc = document.getElementById('answer-year-unconfirmed');
    const yrIdk = document.getElementById('answer-year-idk');

    yrInput.value = '';
    yrInput.oninput = () => {
      if (yrInput.value.trim() !== '') {
        pendingAnswer = yrInput.value.trim();
        document.getElementById('answer-chosen-preview').textContent = `Selected: ${pendingAnswer}`;
        document.getElementById('submit-answer-btn').disabled = false;
      }
    };
    yrUnc.onclick = () => {
      pendingAnswer = 'Unconfirmed';
      yrInput.value = '';
      document.getElementById('answer-chosen-preview').textContent = `Selected: Unconfirmed`;
      document.getElementById('submit-answer-btn').disabled = false;
    };
    yrIdk.onclick = () => {
      pendingAnswer = "I don't know";
      yrInput.value = '';
      document.getElementById('answer-chosen-preview').textContent = `Selected: I don't know`;
      document.getElementById('submit-answer-btn').disabled = false;
    };
  }
}

document.getElementById('submit-answer-btn').addEventListener('click', async () => {
  if (!pendingAnswer) return;
  document.getElementById('submit-answer-btn').disabled = true;

  const q = getQuestion(roomData.current_question);
  await db.from('mp_events').insert({
    room_id: roomId, player: playerSlot, type: 'answer',
    content: JSON.stringify({ field: q.field, value: pendingAnswer, question: q.text }),
  });

  // Advance phase: answerer's acting phase → other player's acting phase
  let nextPhase;
  if (playerSlot === 'player2') nextPhase = 'p1_turn_act';   // P2 answered P1's Q → P1 acts
  else                          nextPhase = 'p2_turn_act';   // P1 answered P2's Q → P2 acts

  const { data } = await db.from('mp_rooms').update({ phase: nextPhase }).eq('id', roomId).select().single();
  roomData = data;
  updateTurnUI(nextPhase, roomData.current_question);
});

// ── Guess dropdown ────────────────────────────────────────────────────────────
const guessInput    = document.getElementById('guess-input');
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

  const opponentChar = roomData[`${other(playerSlot)}_char`];
  const correct = char.name === opponentChar;

  await db.from('mp_events').insert({
    room_id: roomId, player: playerSlot, type: 'guess', content: char.name, correct,
  });

  if (correct) {
    await db.from('mp_rooms').update({ state: 'finished', winner: playerSlot }).eq('id', roomId);
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
  let nextPhase;
  if (playerSlot === 'player1' && roomData.phase === 'p1_turn_act')
    nextPhase = 'p2_turn_ask';
  else if (playerSlot === 'player2' && roomData.phase === 'p2_turn_act')
    nextPhase = 'p1_turn_ask';
  else return;

  const { data } = await db.from('mp_rooms').update({ phase: nextPhase, current_question: null }).eq('id', roomId).select().single();
  roomData = data;
  updateTurnUI(nextPhase, null);
}

document.getElementById('pass-btn').addEventListener('click', passRound);

// ── Render event ──────────────────────────────────────────────────────────────
function renderEvent(ev) {
  const log    = document.getElementById('chat-log');
  const isMe   = ev.player === playerSlot;
  const myName = roomData[`${playerSlot}_name`] || 'You';
  const opName = roomData[`${other(playerSlot)}_name`] || 'Opponent';
  const sender = isMe ? myName : opName;

  const msg = document.createElement('div');

  if (ev.type === 'question') {
    let parsed; try { parsed = JSON.parse(ev.content); } catch { parsed = { question: ev.content }; }
    msg.className = `chat-msg ${isMe ? 'msg-me' : 'msg-opponent'}`;
    msg.innerHTML =
      `<span class="msg-sender">${sender}</span> asked:<br>` +
      `<em class="qa-q-text">${escHtml(parsed.question || '')}</em>`;
  } else if (ev.type === 'answer') {
    let parsed; try { parsed = JSON.parse(ev.content); } catch { parsed = { question: '?', value: ev.content }; }
    msg.className = `chat-msg ${isMe ? 'msg-me' : 'msg-opponent'}`;
    const val = parsed.value || '';
    msg.innerHTML =
      `<span class="msg-sender">${sender}</span> answered:<br>` +
      `<em class="qa-q-text">${escHtml(parsed.question || '')}</em><br>` +
      `<strong class="qa-a-text" style="display:inline-flex;align-items:center;">${colorSwatch(val)}${escHtml(val)}</strong>`;

    // Also populate acting panel if it's my acting turn
    if (!isMe) {
      document.getElementById('acting-question-text').textContent = parsed.question || '';
      const ansDisp = document.getElementById('acting-answer-display');
      ansDisp.innerHTML = `<span class="qa-a-badge" style="display:inline-flex;align-items:center;gap:6px;">${colorSwatch(val)}${escHtml(val)}</span>`;
    }
  } else if (ev.type === 'guess') {
    msg.className = 'chat-msg msg-system';
    const icon = ev.correct ? '✅' : '❌';
    msg.textContent = `${sender} guessed "${ev.content}" ${icon}`;
  } else if (ev.type === 'rematch_vote') {
    rematchVotes.add(ev.player);
    if (rematchVotes.size >= 2) {
      triggerRematch();
    } else {
      const btn = document.getElementById('rematch-btn');
      if (btn && !btn.disabled) btn.textContent = '🔄 Rematch (opponent ready!)';
    }
    return;
  }

  log.appendChild(msg);
  log.scrollTop = log.scrollHeight;
}

// ── Result screen ─────────────────────────────────────────────────────────────
function renderResultScreen(room) {
  stopPeriodicSync();
  rematchVotes.clear();
  const rematchBtn = document.getElementById('rematch-btn');
  rematchBtn.disabled = false;
  rematchBtn.textContent = '🔄 Rematch';
  showScreen('result');
  const isWinner   = room.winner === playerSlot;
  const myCharName = room[`${playerSlot}_char`];
  const opCharName = room[`${other(playerSlot)}_char`];

  const banner = document.getElementById('mp-result-banner');
  banner.classList.add('show');
  if (!isWinner) banner.classList.add('lose');

  document.getElementById('result-title').textContent = isWinner ? '🎉 You Won!' : '💀 You Lost!';
  document.getElementById('result-msg').textContent = isWinner
    ? `You correctly guessed ${opCharName}!`
    : `Your opponent guessed ${myCharName}!`;

  const container = document.getElementById('result-chars');
  container.innerHTML = '';
  [{ label: 'Your character', name: myCharName }, { label: "Opponent's character", name: opCharName }]
    .forEach(({ label, name }) => {
      const char = CHARS.find(c => c.name === name);
      const div  = document.createElement('div');
      div.className = 'result-char';
      if (char && char.img) {
        const img = document.createElement('img');
        img.src = '../assets/' + char.img;
        img.alt = name;
        div.appendChild(img);
      }
      const lbl = document.createElement('div'); lbl.className = 'result-char-label'; lbl.textContent = label;
      const nm  = document.createElement('div'); nm.className  = 'result-char-name';  nm.textContent  = name || '???';
      div.append(lbl, nm);
      container.appendChild(div);
    });
}

// ── Rematch ───────────────────────────────────────────────────────────────────
const rematchVotes = new Set();

async function triggerRematch() {
  stopPeriodicSync();
  rematchVotes.clear();
  gameInit = false; myChar = null; selectionShown = false;
  await db.from('mp_rooms').update({
    state: 'selecting',
    player1_char: null, player2_char: null,
    player1_ready: false, player2_ready: false,
    current_question: null, phase: null, winner: null,
  }).eq('id', roomId);
  selectionShown = true;
  showSelectionScreen();
}

document.getElementById('rematch-btn').addEventListener('click', async () => {
  const btn = document.getElementById('rematch-btn');
  btn.disabled = true;
  rematchVotes.add(playerSlot);
  if (rematchVotes.size >= 2) { triggerRematch(); return; }
  btn.textContent = '⏳ Waiting for opponent... (1/2)';
  await db.from('mp_events').insert({
    room_id: roomId, player: playerSlot, type: 'rematch_vote', content: 'yes',
  });
});

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('multiplayer-screen').style.display = 'block';
  showScreen('lobby');
  // Filter dropdowns init
  const fromSel = document.getElementById('filter-from');
  const toSel   = document.getElementById('filter-to');
  if (fromSel && toSel) {
    GAMES.forEach((g, i) => {
      fromSel.add(new Option(g.name, i));
      toSel.add(new Option(g.name, i));
    });
    toSel.value = GAMES.length - 1;
    const filterAllEl = document.getElementById('filter-all');
    const filterRangeEl = document.getElementById('filter-range');
    filterAllEl.checked = true;
    filterRangeEl.style.display = 'none';
    filterAllEl.addEventListener('change', function() {
      filterRangeEl.style.display = this.checked ? 'none' : 'flex';
    });
    fromSel.addEventListener('change', () => {
      if (parseInt(toSel.value) < parseInt(fromSel.value)) toSel.value = fromSel.value;
    });
  }
  document.getElementById('create-room-btn').addEventListener('click', createRoom);
  document.getElementById('join-room-btn').addEventListener('click', joinRoom);
  document.getElementById('lobby-code').addEventListener('keydown', e => { if (e.key === 'Enter') joinRoom(); });
  document.getElementById('lobby-name').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('lobby-code').focus(); });
});
