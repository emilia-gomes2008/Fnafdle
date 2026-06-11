/* ═══════════════════════════════════════════════════════
   FNAF TCG - Online Multiplayer (tcg-mp.js)
   Party/Multiplayer-style room system:
     - Public lobby browser
     - Room names & privacy toggle
     - Waiting screen with live player list
     - Realtime subscription during lobby + game
   ═══════════════════════════════════════════════════════ */

/* ── Utilities ───────────────────────────────────────── */
function mpRandomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
function mpRandomId() {
  return 'p' + Math.random().toString(36).slice(2, 10);
}
function mpEscHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── Persistent player id ────────────────────────────── */
let _mpId = sessionStorage.getItem('tcg_mp_pid');
if (!_mpId) { _mpId = mpRandomId(); sessionStorage.setItem('tcg_mp_pid', _mpId); }

/* ── Module state ────────────────────────────────────── */
// MP object lives in tcg.js - we extend it here
// MP.db, MP.roomId, MP.roomCode, MP.myIdx, MP.mode, MP.channel

/* ── Init (called when Online tab is opened) ─────────── */
function tcgMpInit() {
  if (!mpEnsureDb()) return;
  renderMpLobby();
}
window.tcgMpInit = tcgMpInit;

/* ── Ensure Supabase client exists ──────────────────── */
function mpEnsureDb() {
  const cfg = window.FNAF_CONFIG || {};
  const wrap = document.getElementById('tab-content-online');
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
    if (wrap) wrap.innerHTML = `<p style="color:var(--red-text);padding:10px">${T('tcg.mp.noConfig')}</p>`;
    return false;
  }
  if (!MP.db) {
    if (typeof supabase === 'undefined') {
      if (wrap) wrap.innerHTML = `<p style="color:var(--red-text);padding:10px">${T('tcg.mp.noSupabase')}</p>`;
      return false;
    }
    try {
      MP.db = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    } catch (e) {
      if (wrap) wrap.innerHTML = `<p style="color:var(--red-text);padding:10px">${T('tcg.mp.supabaseError', { msg: e.message })}</p>`;
      return false;
    }
  }
  MP.myId = _mpId;
  return true;
}

/* ── Render the online lobby UI ──────────────────────── */
function renderMpLobby() {
  const wrap = document.getElementById('tab-content-online');
  if (!wrap) return;
  wrap.innerHTML = '';

  wrap.innerHTML = `
    <div class="mp-lobby-container">

      <!-- Player info row -->
      <div class="mp-form-row">
        <div class="setup-label">${T('tcg.mp.yourName')}</div>
        <input id="mp-name" class="tcg-input" type="text"
          placeholder="${T('tcg.mp.namePlaceholder')}" maxlength="20"
          value="${mpEscHtml(sessionStorage.getItem('tcg_mp_name') || '')}"
          style="max-width:220px" />
      </div>
      <!-- Action buttons -->
      <div class="mp-action-row" style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;align-items:center">
        <button class="tcg-btn primary" onclick="mpShowCreatePanel()">${T('tcg.mp.createRoom')}</button>
        <div style="display:flex;gap:6px;align-items:center">
          <input id="mp-join-code" class="tcg-input" type="text"
            placeholder="${T('tcg.mp.joinCode')}" maxlength="6"
            style="max-width:130px;text-transform:uppercase" />
          <button class="tcg-btn" onclick="mpJoinRoom()">${T('tcg.mp.joinBtn')}</button>
        </div>
      </div>

      <!-- Create room panel (hidden by default) -->
      <div id="mp-create-panel" style="display:none;margin-top:14px;padding:12px;border:1px solid var(--border);border-radius:8px;background:var(--card-bg)">
        <div class="setup-label" style="margin-bottom:6px">${T('tcg.mp.roomName')}</div>
        <input id="mp-room-name" class="tcg-input" type="text"
          placeholder="${T('tcg.mp.roomNamePlaceholder')}" maxlength="30"
          style="width:100%;max-width:none;margin-bottom:10px" />

        <div class="setup-label" style="margin-bottom:6px">${T('tcg.mp.privacy')}</div>
        <div style="display:flex;gap:14px;margin-bottom:10px">
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer">
            <input type="radio" name="tcg-privacy" value="public" checked /> ${T('tcg.mp.public')}
          </label>
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer">
            <input type="radio" name="tcg-privacy" value="private" /> ${T('tcg.mp.private')}
          </label>
        </div>

        <div style="display:flex;gap:8px">
          <button class="tcg-btn primary" onclick="mpConfirmCreate()">${T('tcg.mp.confirm')}</button>
          <button class="tcg-btn" onclick="mpCancelCreate()">${T('tcg.mp.cancel')}</button>
        </div>
      </div>

      <!-- Status area -->
      <div id="mp-status" class="mp-status-area"></div>

      <!-- Public lobby list -->
      <div id="mp-public-lobby" style="margin-top:18px">
        <div class="setup-label" style="margin-bottom:6px">${T('tcg.mp.publicRooms')}</div>
        <div id="mp-lobby-list"><div class="mp-lobby-empty">${T('tcg.mp.loadingRooms')}</div></div>
        <button class="tcg-btn" style="margin-top:8px;font-size:.78rem" onclick="mpLoadPublicLobby()">${T('tcg.mp.refresh')}</button>
      </div>
    </div>
  `;

  mpLoadPublicLobby();
}

/* ── Create panel helpers ────────────────────────────── */
function mpShowCreatePanel() {
  const panel = document.getElementById('mp-create-panel');
  if (panel) panel.style.display = '';
  const nameInput = document.getElementById('mp-room-name');
  const playerName = document.getElementById('mp-name')?.value.trim();
  if (nameInput && playerName) nameInput.placeholder = `${playerName}'s Room`;
}
function mpCancelCreate() {
  const panel = document.getElementById('mp-create-panel');
  if (panel) panel.style.display = 'none';
}

/* ── Helpers ─────────────────────────────────────────── */
function mpStatusHtml(html) {
  const el = document.getElementById('mp-status');
  if (el) el.innerHTML = html;
}

function mpCopyCode(code, btn) {
  const done = () => {
    if (btn) { const o = btn.textContent; btn.textContent = T('tcg.mp.copied'); setTimeout(() => btn.textContent = o, 2000); }
  };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(done).catch(() => { prompt('Copy the room code:', code); });
  } else {
    try {
      const ta = document.createElement('textarea'); ta.value = code;
      ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy'); document.body.removeChild(ta); done();
    } catch (e) { prompt('Copy the room code:', code); }
  }
}

function mpEncodeDeck(deck) {
  return JSON.stringify({ id: deck.id, name: deck.name, list: deck.list, generator: deck.generator || 'remnant', classCard: deck.classCard || 'class_classic' });
}

function mpParseDeck(field) {
  try { return JSON.parse(field); } catch (e) {
    const decks = getDecksForSelect();
    return decks.find(d => d.id === field) || decks[0];
  }
}

/* ── Public Lobby ────────────────────────────────────── */
async function mpLoadPublicLobby() {
  const listEl = document.getElementById('mp-lobby-list');
  if (!listEl) return;
  listEl.innerHTML = `<div class="mp-lobby-empty">${T('tcg.mp.loadingRooms')}</div>`;

  const { data, error } = await MP.db
    .from('tcg_rooms')
    .select('id, room_code, room_name, host_name, status')
    .eq('status', 'waiting')
    .or('is_private.eq.false,is_private.is.null')
    .is('game_state', null)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error || !data || !data.length) {
    listEl.innerHTML = `<div class="mp-lobby-empty">${T('tcg.mp.noPublicRooms')}</div>`;
    return;
  }

  listEl.innerHTML = '';
  data.forEach(r => {
    const name = r.room_name || `${r.host_name}'s Room`;
    const entry = document.createElement('div');
    entry.className = 'mp-lobby-entry';
    entry.innerHTML = `
      <div class="mp-lobby-info">
        <div class="mp-lobby-name">${mpEscHtml(name)}</div>
        <div class="mp-lobby-meta">👤 ${mpEscHtml(r.host_name)} · TCG</div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <span class="mp-lobby-code">${mpEscHtml(r.room_code)}</span>
        <button class="tcg-btn small" onclick="mpJoinFromLobby('${mpEscHtml(r.room_code)}')">${T('tcg.mp.joinBtn')}</button>
      </div>
    `;
    listEl.appendChild(entry);
  });
}

function mpJoinFromLobby(code) {
  const codeInput = document.getElementById('mp-join-code');
  if (codeInput) codeInput.value = code;
  mpJoinRoom();
}

/* ── Create Room ─────────────────────────────────────── */
async function mpConfirmCreate() {
  const name = (document.getElementById('mp-name')?.value.trim() || 'Online Player');
  sessionStorage.setItem('tcg_mp_name', name);
  const roomCode = mpRandomCode();
  const roomNameInput = document.getElementById('mp-room-name')?.value.trim();
  const roomName = roomNameInput || `${name}'s Room`;
  const isPrivate = document.querySelector('input[name="tcg-privacy"]:checked')?.value === 'private';

  mpCancelCreate();
  mpStatusHtml(`<div class="mp-waiting">${T('tcg.mp.creating')}</div>`);

  const { data, error } = await MP.db.from('tcg_rooms').insert({
    room_code: roomCode,
    host_id: MP.myId,
    host_name: name,
    host_deck: null,
    status: 'waiting',
    room_name: roomName,
    is_private: isPrivate,
  }).select().single();

  if (error) {
    mpStatusHtml(`<div style="color:var(--red-text)">${T('tcg.mp.joinError', { msg: error.message })}</div>`);
    return;
  }

  MP.roomId = data.id;
  MP.roomCode = roomCode;
  MP.myIdx = 0;

  mpShowWaiting(data);
  mpSubscribe(data.id, 'host');
}

/* ── Join Room ───────────────────────────────────────── */
async function mpJoinRoom() {
  const name = (document.getElementById('mp-name')?.value.trim() || 'Online Player');
  sessionStorage.setItem('tcg_mp_name', name);
  const code = (document.getElementById('mp-join-code')?.value.trim().toUpperCase()) || '';
  if (code.length < 4) { alert(T('tcg.mp.enterCode')); return; }

  mpStatusHtml(`<div class="mp-waiting">${T('tcg.mp.searching')}</div>`);

  const { data: rooms, error: ferr } = await MP.db.from('tcg_rooms')
    .select('*').eq('room_code', code).eq('status', 'waiting').limit(1);

  if (ferr || !rooms || !rooms.length) {
    mpStatusHtml(`<div style="color:var(--red-text)">${T('tcg.mp.notFound')}</div>`);
    return;
  }

  const room = rooms[0];
  if (room.host_id === MP.myId) {
    mpStatusHtml(`<div style="color:var(--red-text)">You can't join your own room! Use Local Play instead.</div>`);
    return;
  }

  const { data, error: uerr } = await MP.db.from('tcg_rooms').update({
    guest_id: MP.myId,
    guest_name: name,
    guest_deck: null,
    status: 'ready',
  }).eq('id', room.id).select().single();

  if (uerr) {
    mpStatusHtml(`<div style="color:var(--red-text)">${T('tcg.mp.joinError', { msg: uerr.message })}</div>`);
    return;
  }

  MP.roomId = room.id;
  MP.roomCode = code;
  MP.myIdx = 1;

  mpShowWaiting(data || { ...room, guest_name: name, status: 'ready' });
  mpSubscribe(room.id, 'guest');
}

/* ── Waiting Screen ──────────────────────────────────── */
function mpShowWaiting(row) {
  MP._currentRow = row;
  // Hide lobby content, show waiting panel
  const lobbyWrap = document.getElementById('tab-content-online');
  if (lobbyWrap) lobbyWrap.style.display = 'none';

  let waitEl = document.getElementById('tcg-mp-waiting');
  if (!waitEl) {
    waitEl = document.createElement('div');
    waitEl.id = 'tcg-mp-waiting';
    waitEl.className = 'tcg-mp-waiting-screen';
    // Insert inside the lobby screen, after the lobby wrap
    const lobbyScreen = document.getElementById('screen-lobby');
    if (lobbyScreen) lobbyScreen.appendChild(waitEl);
    else document.getElementById('tcg-root')?.appendChild(waitEl);
  }
  waitEl.style.display = '';
  mpRenderWaiting(row);
}

function mpHideWaiting() {
  const waitEl = document.getElementById('tcg-mp-waiting');
  if (waitEl) waitEl.style.display = 'none';
  const lobbyWrap = document.getElementById('tab-content-online');
  if (lobbyWrap) lobbyWrap.style.display = '';
}

function mpRenderWaiting(row) {
  const waitEl = document.getElementById('tcg-mp-waiting');
  if (!waitEl) return;

  const roomName = row.room_name || `${row.host_name}'s Room`;
  const isHost = MP.myIdx === 0;
  const guestName = row.guest_name;
  const hasGuest = row.status === 'ready' && !!guestName;

  waitEl.innerHTML = `
    <div class="tcg-card" style="max-width:460px;margin:0 auto">
      <h2 class="tcg-title" style="font-size:1.3rem;margin-bottom:4px">${T('tcg.mp.waitingTitle')}</h2>
      <div style="color:var(--gold);font-size:.85rem;margin-bottom:12px">${mpEscHtml(roomName)}</div>

      <div style="margin-bottom:12px">
        <div class="setup-label" style="margin-bottom:4px">${T('tcg.mp.roomCodeLabel')}</div>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="mp-room-code">${mpEscHtml(MP.roomCode)}</div>
          <button class="tcg-btn small" onclick="mpCopyCode('${mpEscHtml(MP.roomCode)}',this)">${T('tcg.mp.copy')}</button>
        </div>
      </div>

      <div id="tcg-waiting-players" class="tcg-waiting-players">
        ${mpRenderPlayerSlots(row)}
      </div>

      <div id="tcg-waiting-deck" style="margin-top:14px;padding:10px;border:1px solid var(--border);border-radius:6px;background:var(--card-bg)">
        ${mpRenderDeckPicker(row)}
      </div>

      <div id="tcg-waiting-status" style="margin-top:12px">
        ${mpRenderStartArea(row, isHost, hasGuest)}
      </div>

      <button class="tcg-btn" style="margin-top:10px;width:100%;font-size:.78rem" onclick="mpLeaveWaiting()">${T('tcg.mp.leaveRoom')}</button>
    </div>
  `;
}

function mpRenderDeckPicker(row) {
  const isHost = MP.myIdx === 0;
  const myDeck = isHost ? mpParseDeck(row.host_deck) : mpParseDeck(row.guest_deck);
  const confirmed = isHost ? !!row.host_deck : !!row.guest_deck;
  const decks = getDecksForSelect().filter(d => !d.overLimit);
  const opts = decks.map(d => `<option value="${d.id}"${myDeck?.id === d.id ? ' selected' : ''}>${mpEscHtml(d.name)}</option>`).join('');
  return `
    <div class="setup-label" style="margin-bottom:6px">Your Deck</div>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <select id="mp-waiting-deck" class="tcg-select" style="flex:1;min-width:160px">${opts}</select>
      <button class="tcg-btn primary" onclick="mpConfirmDeck()">
        ${confirmed ? '✓ Change Deck' : 'Confirm Deck'}
      </button>
    </div>
    ${confirmed ? `<div style="font-size:.68rem;color:var(--green,#5d5);margin-top:4px">✓ Deck confirmed: ${mpEscHtml(myDeck?.name || '-')}</div>` : '<div style="font-size:.68rem;color:var(--text-muted);margin-top:4px">Select a deck and confirm to be ready.</div>'}
  `;
}

function mpRenderStartArea(row, isHost, hasGuest) {
  const bothReady = !!row.host_deck && !!row.guest_deck;
  if (!hasGuest) return `<div class="mp-waiting"><span class="mp-spinner"></span> ${T('tcg.mp.waitingOpponent')}</div>`;
  if (isHost && bothReady) return `<button class="tcg-btn primary" style="width:100%" onclick="mpStartGame()">${T('tcg.mp.startGame')}</button>`;
  if (isHost && !bothReady) return `<div class="mp-waiting"><span class="mp-spinner"></span> Waiting for both players to confirm decks…</div>`;
  if (!isHost && bothReady) return `<div class="mp-waiting"><span class="mp-spinner"></span> ${T('tcg.mp.waitingHost', { name: row.host_name })}</div>`;
  return `<div class="mp-waiting"><span class="mp-spinner"></span> Waiting for both players to confirm decks…</div>`;
}

async function mpConfirmDeck() {
  const deckId = document.getElementById('mp-waiting-deck')?.value;
  if (!deckId) { alert('Select a deck first!'); return; }
  const decks = getDecksForSelect();
  const deck = decks.find(d => d.id === deckId);
  if (!deck) { alert('Deck not found!'); return; }
  if (deck.overLimit) { alert('That deck is over the card limit and cannot be used.'); return; }
  const isHost = MP.myIdx === 0;
  const field = isHost ? 'host_deck' : 'guest_deck';
  const { data, error } = await MP.db.from('tcg_rooms')
    .update({ [field]: mpEncodeDeck(deck) })
    .eq('id', MP.roomId).select().single();
  if (error) { alert('Failed to confirm deck: ' + error.message); return; }
  const deckEl = document.getElementById('tcg-waiting-deck');
  if (deckEl) deckEl.innerHTML = mpRenderDeckPicker(data);
  const statusEl = document.getElementById('tcg-waiting-status');
  if (statusEl) statusEl.innerHTML = mpRenderStartArea(data, isHost, !!data.guest_name);
}

function mpRenderPlayerSlots(row) {
  const hostDeck = mpParseDeck(row.host_deck || '{}');
  const guestDeck = row.guest_deck ? mpParseDeck(row.guest_deck) : null;

  const slot = (label, name, deckName, filled) => `
    <div class="tcg-waiting-slot ${filled ? 'filled' : 'empty'}">
      <div class="tcg-waiting-slot-label">${label}</div>
      ${filled
      ? `<div class="tcg-waiting-slot-name">${mpEscHtml(name)}</div>
           <div class="tcg-waiting-slot-deck" style="font-size:.72rem;color:var(--text-muted)">${mpEscHtml(deckName || '-')}</div>`
      : `<div class="tcg-waiting-slot-name" style="color:var(--text-muted);font-style:italic">${T('tcg.mp.waitingForPlayer')}</div>`
    }
    </div>
  `;

  const hostDeckName = row.host_deck ? (hostDeck?.name || '?') : '⏳ No deck';
  const guestDeckName = row.guest_deck ? (guestDeck?.name || '?') : '⏳ No deck';
  return slot(T('tcg.mp.host'), row.host_name, hostDeckName, true)
    + slot(T('tcg.mp.guest'), row.guest_name, guestDeckName, !!row.guest_name);
}

function mpUpdateWaiting(row) {
  MP._currentRow = row;
  const playersEl = document.getElementById('tcg-waiting-players');
  if (playersEl) playersEl.innerHTML = mpRenderPlayerSlots(row);

  const isHost = MP.myIdx === 0;
  const hasGuest = row.status === 'ready' && !!row.guest_name;

  // Only update opponent's deck display, not our own picker
  const deckEl = document.getElementById('tcg-waiting-deck');
  if (deckEl) deckEl.innerHTML = mpRenderDeckPicker(row);

  const statusEl = document.getElementById('tcg-waiting-status');
  if (statusEl) statusEl.innerHTML = mpRenderStartArea(row, isHost, hasGuest);
}

function mpLeaveWaiting() {
  MP._currentRow = null;
  if (MP.channel) { try { MP.channel.unsubscribe(); } catch (e) { } MP.channel = null; }
  if (MP.roomId && MP.myIdx === 0) {
    // Host left: mark room abandoned
    MP.db.from('tcg_rooms').update({ status: 'abandoned' }).eq('id', MP.roomId).then(() => { }, () => { });
  }
  MP.roomId = null; MP.roomCode = null;
  mpHideWaiting();
  renderMpLobby();
}

/* ── Realtime subscription ───────────────────────────── */
function mpSubscribe(roomId, role) {
  if (MP.channel) { try { MP.channel.unsubscribe(); } catch (e) { } MP.channel = null; }

  MP.channel = MP.db
    .channel('tcg_room_' + roomId)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'tcg_rooms',
      filter: `id=eq.${roomId}`,
    }, payload => mpHandleRow(payload.new, role))
    .subscribe();
}

/* ── Handle row updates ──────────────────────────────── */
function mpHandleRow(row, role) {
  // Room abandoned by host
  if (row.status === 'abandoned' && role === 'guest') {
    mpHideWaiting();
    renderMpLobby();
    mpStatusHtml(`<div style="color:var(--red-text)">${T('tcg.mp.hostLeft')}</div>`);
    return;
  }

  // Guest joined → update waiting screen for host
  if (role === 'host' && row.status === 'ready' && !row.game_state) {
    mpUpdateWaiting(row);
    return;
  }

  // Game started → transition to game
  if (!row.game_state) return;
  const gs = row.game_state;

  const dbSeq = gs._seq || 0;
  const localSeq = (window.G && G) ? (G._seq || 0) : -1;
  if (dbSeq <= localSeq) return;

  // Hide waiting screen, enter game
  mpHideWaiting();
  if (MP.mode !== 'online') MP.mode = 'online';
  pullGameState(gs);
}

/* ── Host starts the game ────────────────────────────── */
async function mpStartGame() {
  const { data: room, error } = await MP.db.from('tcg_rooms').select('*').eq('id', MP.roomId).single();
  if (error || !room) { alert(T('tcg.mp.roomError')); return; }

  const p1Deck = mpParseDeck(room.host_deck);
  const p2Deck = mpParseDeck(room.guest_deck);

  const _badIds = d => (d?.list || []).filter(([id]) => !CARDS[id]).map(([id]) => id);
  const _validTotal = d => (d?.list || []).reduce((s, [id, c]) => CARDS[id] ? s + c : s, 0);
  const b1 = _badIds(p1Deck), b2 = _badIds(p2Deck);
  if (b1.length) { alert(`Host deck has unknown card ID(s): ${b1.join(', ')}. The host must edit their deck.`); return; }
  if (b2.length) { alert(`Guest deck has unknown card ID(s): ${b2.join(', ')}. The guest must edit their deck.`); return; }
  if (_validTotal(p1Deck) !== 40) { alert('Host deck does not have exactly 40 valid cards.'); return; }
  if (_validTotal(p2Deck) !== 40) { alert('Guest deck does not have exactly 40 valid cards.'); return; }

  MP.mode = 'online';

  initGame({
    p1Name: room.host_name || 'Host',
    p1List: p1Deck.list, p1Gen: p1Deck.generator,
    p1Class: p1Deck.classCard || 'class_classic',
    p2Name: room.guest_name || 'Guest',
    p2List: p2Deck.list, p2Gen: p2Deck.generator,
    p2Class: p2Deck.classCard || 'class_classic',
  });

  mpHideWaiting();
  await pushGameState();
}

/* ── Disconnect: mark opponent as winner on tab close ─── */
window.addEventListener('beforeunload', () => {
  if (!MP.db || !MP.roomId || MP.mode !== 'online') return;
  if (window.G && G && !G.winner) {
    G.winner = G.players[1 - MP.myIdx];
    G.phase = 'result';
    try {
      MP.db.from('tcg_rooms').update({ game_state: G }).eq('id', MP.roomId);
    } catch (e) { }
  }
});