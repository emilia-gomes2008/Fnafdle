/* ═══════════════════════════════════════════════════════
   FNAF TCG — Online Multiplayer (tcg-mp.js)
   Pure Realtime (no polling) — same pattern as Party mode.
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

/* ── Persistent player id ────────────────────────────── */
let _mpId = sessionStorage.getItem('tcg_mp_pid');
if (!_mpId) { _mpId = mpRandomId(); sessionStorage.setItem('tcg_mp_pid', _mpId); }

/* ── Init (called when Online tab is opened) ─────────── */
function tcgMpInit() { renderMpLobby(); }
window.tcgMpInit = tcgMpInit;

/* ── Render the online lobby UI ──────────────────────── */
function renderMpLobby() {
  const wrap = document.getElementById('tab-content-online');
  if (!wrap) return;
  wrap.innerHTML = '';

  const cfg = window.FNAF_CONFIG || {};
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
    wrap.innerHTML = `<p style="color:#dd6d6d;padding:10px">${T('tcg.mp.noConfig')}</p>`;
    return;
  }

  if (!MP.db) {
    if (typeof supabase === 'undefined') {
      wrap.innerHTML = `<p style="color:#dd6d6d;padding:10px">${T('tcg.mp.noSupabase')}</p>`;
      return;
    }
    try {
      MP.db = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    } catch(e) {
      wrap.innerHTML = `<p style="color:#dd6d6d;padding:10px">${T('tcg.mp.supabaseError',{msg:e.message})}</p>`;
      return;
    }
  }
  MP.myId = _mpId;

  const decks = getDecksForSelect();
  const container = document.createElement('div');
  container.className = 'mp-lobby-container';

  container.innerHTML = `
    <div class="mp-form-row">
      <div class="setup-label">${T('tcg.mp.yourName')}</div>
      <input id="mp-name" class="tcg-input" type="text" placeholder="${T('tcg.mp.namePlaceholder')}" maxlength="20"
        value="${sessionStorage.getItem('tcg_mp_name')||''}" style="max-width:220px" />
    </div>
    <div class="mp-form-row" style="margin-top:10px">
      <div class="setup-label">${T('tcg.mp.yourDeck')}</div>
      <select id="mp-deck" class="tcg-select" style="max-width:280px"></select>
    </div>
  `;

  const deckSel = container.querySelector('#mp-deck');
  decks.forEach(d => {
    const o = document.createElement('option');
    o.value = d.id; o.textContent = d.name; deckSel.appendChild(o);
  });

  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:10px;margin-top:16px;flex-wrap:wrap';

  const createBtn = document.createElement('button');
  createBtn.className = 'tcg-btn primary';
  createBtn.textContent = T('tcg.mp.createRoom');
  createBtn.onclick = mpCreateRoom;
  btnRow.appendChild(createBtn);

  const joinSection = document.createElement('div');
  joinSection.style.cssText = 'display:flex;gap:6px;align-items:center';
  joinSection.innerHTML = `
    <input id="mp-join-code" class="tcg-input" type="text" placeholder="${T('tcg.mp.joinCode')}"
      maxlength="6" style="max-width:130px;text-transform:uppercase" />
    <button class="tcg-btn" id="mp-join-btn">${T('tcg.mp.joinBtn')}</button>
  `;
  joinSection.querySelector('#mp-join-btn').onclick = mpJoinRoom;
  btnRow.appendChild(joinSection);

  container.appendChild(btnRow);

  const status = document.createElement('div');
  status.id = 'mp-status'; status.className = 'mp-status-area';
  container.appendChild(status);

  wrap.appendChild(container);
}

/* ── Helpers ─────────────────────────────────────────── */
function mpGetFormData() {
  const name = (document.getElementById('mp-name')?.value.trim() || 'Online Player');
  sessionStorage.setItem('tcg_mp_name', name);
  const deckId = document.getElementById('mp-deck')?.value || '';
  const decks = getDecksForSelect();
  const deck = decks.find(d => d.id === deckId) || decks[0];
  return { name, deck };
}

function mpStatusHtml(html) {
  const el = document.getElementById('mp-status');
  if (el) el.innerHTML = html;
}

function mpCopyCode(code, btn) {
  const done = () => { if(btn){const o=btn.textContent;btn.textContent=T('tcg.mp.copied');setTimeout(()=>btn.textContent=o,2000);} };
  if(navigator.clipboard) {
    navigator.clipboard.writeText(code).then(done).catch(()=>{ prompt('Copy the room code:',code); });
  } else {
    try {
      const ta=document.createElement('textarea'); ta.value=code;
      ta.style.cssText='position:fixed;opacity:0'; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy'); document.body.removeChild(ta); done();
    } catch(e){ prompt('Copy the room code:',code); }
  }
}

function mpEncodeDeck(deck) {
  return JSON.stringify({id:deck.id,name:deck.name,list:deck.list,generator:deck.generator||'remnant',classCard:deck.classCard||'class_classic'});
}

function mpParseDeck(field) {
  try { return JSON.parse(field); } catch(e) {
    const decks = getDecksForSelect();
    return decks.find(d => d.id === field) || decks[0];
  }
}

/* ── Create Room ─────────────────────────────────────── */
async function mpCreateRoom() {
  const { name, deck } = mpGetFormData();
  const roomCode = mpRandomCode();
  mpStatusHtml(`<div class="mp-waiting">${T('tcg.mp.creating')}</div>`);

  const { data, error } = await MP.db.from('tcg_rooms').insert({
    room_code: roomCode,
    host_id:   MP.myId,
    host_name: name,
    host_deck: mpEncodeDeck(deck),
    status:    'waiting'
  }).select().single();

  if (error) { mpStatusHtml(`<div style="color:var(--red-text)">${T('tcg.mp.joinError',{msg:error.message})}</div>`); return; }

  MP.roomId   = data.id;
  MP.roomCode = roomCode;
  MP.myIdx    = 0;

  mpStatusHtml(`
    <div class="mp-room-code-block">
      <div class="setup-label">${T('tcg.mp.roomCodeLabel')}</div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="mp-room-code">${roomCode}</div>
        <button class="tcg-btn small" onclick="mpCopyCode('${roomCode}',this)">${T('tcg.mp.copy')}</button>
      </div>
      <div class="mp-waiting"><span class="mp-spinner"></span> ${T('tcg.mp.waitingOpponent')}</div>
    </div>
  `);

  mpSubscribe(data.id, 'host');
}

/* ── Join Room ───────────────────────────────────────── */
async function mpJoinRoom() {
  const { name, deck } = mpGetFormData();
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
  const { error: uerr } = await MP.db.from('tcg_rooms').update({
    guest_id:   MP.myId,
    guest_name: name,
    guest_deck: mpEncodeDeck(deck),
    status:     'ready'
  }).eq('id', room.id);

  if (uerr) { mpStatusHtml(`<div style="color:var(--red-text)">${T('tcg.mp.joinError',{msg:uerr.message})}</div>`); return; }

  MP.roomId   = room.id;
  MP.roomCode = code;
  MP.myIdx    = 1;

  mpStatusHtml(`
    <div class="mp-room-code-block">
      <div class="mp-waiting">
        <span class="mp-spinner"></span>
        ${T('tcg.mp.waitingHost',{name:room.host_name})}
      </div>
    </div>
  `);

  mpSubscribe(room.id, 'guest');
}

/* ── Shared handler: process any room row update ─────── */
function mpHandleRow(row, role) {
  // ── Lobby: guest joined → show Start Game button to host ──
  if (role === 'host' && row.status === 'ready' && !row.game_state) {
    const el = document.getElementById('mp-status');
    if (el && el.querySelector('[data-start-btn]')) return; // already shown
    const guestName = row.guest_name || 'Guest';
    mpStatusHtml(`
      <div class="mp-room-code-block">
        <div class="setup-label">${T('tcg.mp.roomCodeLabel')}</div>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="mp-room-code">${MP.roomCode}</div>
          <button class="tcg-btn small" onclick="mpCopyCode('${MP.roomCode}',this)">${T('tcg.mp.copy')}</button>
        </div>
        <div style="color:var(--green-text);margin:8px 0">${T('tcg.mp.guestJoined',{name:guestName})}</div>
        <button data-start-btn class="tcg-btn primary" onclick="mpStartGame()">${T('tcg.mp.startGame')}</button>
      </div>
    `);
    return;
  }

  if (!row.game_state) return;
  const gs = row.game_state;

  // Seq guard: skip if we already have this or newer state
  const dbSeq    = gs._seq || 0;
  const localSeq = (window.G && G) ? (G._seq || 0) : -1;
  if (dbSeq <= localSeq) return;

  if (MP.mode !== 'online') MP.mode = 'online';
  pullGameState(gs);
}

/* ── Realtime subscription (primary) ────────────────── */
function mpSubscribe(roomId, role) {
  if (MP.channel) { try { MP.channel.unsubscribe(); } catch(e){} MP.channel = null; }

  MP.channel = MP.db
    .channel('tcg_room_' + roomId)
    .on('postgres_changes', {
      event:  'UPDATE',
      schema: 'public',
      table:  'tcg_rooms',
      filter: `id=eq.${roomId}`
    }, payload => mpHandleRow(payload.new, role))
    .subscribe();
}


/* ── Host starts the game ────────────────────────────── */
async function mpStartGame() {
  const { data: room, error } = await MP.db.from('tcg_rooms').select('*').eq('id', MP.roomId).single();
  if (error || !room) { alert(T('tcg.mp.roomError')); return; }

  const p1Deck = mpParseDeck(room.host_deck);
  const p2Deck = mpParseDeck(room.guest_deck);

  MP.mode = 'online';

  initGame({
    p1Name:  room.host_name  || 'Host',
    p1List:  p1Deck.list, p1Gen: p1Deck.generator,
    p1Class: p1Deck.classCard || 'class_classic',
    p2Name:  room.guest_name || 'Guest',
    p2List:  p2Deck.list, p2Gen: p2Deck.generator,
    p2Class: p2Deck.classCard || 'class_classic'
  });

  await pushGameState();
}

/* ── Disconnect: mark opponent as winner on tab close ─── */
window.addEventListener('beforeunload', () => {
  if (!MP.db || !MP.roomId || MP.mode !== 'online') return;
  if (window.G && G && !G.winner) {
    G.winner = G.players[1 - MP.myIdx];
    G.phase  = 'result';
    navigator.sendBeacon && navigator.sendBeacon('/noop');
    try {
      MP.db.from('tcg_rooms').update({ game_state: G }).eq('id', MP.roomId);
    } catch(e) {}
  }
});
