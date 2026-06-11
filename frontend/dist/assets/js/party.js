// ── Constants ─────────────────────────────────────────────────────────────────
const COIN_IMG = `<img src="../assets/images/fazcoin.png" class="fazcoin-icon" alt="coin">`;

const BOARD_SIZE = 20;  // default / easy board size
const TOTAL_LAPS = 5;
const COINS_PER_PIZZA = 10;
const TOLL_SKIP = 4;   // spaces skipped when paying Freddy

// ─── Board grids ──────────────────────────────────────────
const BOARD_GRID_EASY = [
  [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
  [2, 6], [3, 6], [4, 6], [5, 6],
  [6, 6], [6, 5], [6, 4], [6, 3], [6, 2], [6, 1],
  [5, 1], [4, 1], [3, 1], [2, 1],
]; // 20 spaces, 6×6

const BOARD_GRID_NORMAL = [
  [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], // top: 8
  [2, 8], [3, 8], [4, 8], [5, 8],                          // right: 4
  [6, 8], [6, 7], [6, 6], [6, 5], [6, 4], [6, 3], [6, 2], [6, 1], // bottom: 8
  [5, 1], [4, 1], [3, 1], [2, 1],                          // left: 4
]; // 24 spaces, 8×6 wide racetrack

function getBoardGrid(mapType) {
  return mapType === 'normal' ? BOARD_GRID_NORMAL : BOARD_GRID_EASY;
}

const SPACE_CFG = {
  normal: { cls: 'space-normal', emoji: '', label: 'Normal' },
  minigame: { cls: 'space-minigame', emoji: '🎮', label: 'Minigame' },
  coin: { cls: 'space-coin', emoji: '🪙', label: '+2 Coins' },
  pizza: { cls: 'space-pizza', emoji: '🍕', label: '+1 Pizza' },
  badluck: { cls: 'space-badluck', emoji: '💀', label: '-3 Coins' },
  trap: { cls: 'space-trap', emoji: '🪤', label: 'Trap!' },
  challenge: { cls: 'space-challenge', emoji: '⚔️', label: 'Challenge!' },
  question: { cls: 'space-question', emoji: '❓', label: 'Event' },
  tollbooth: { cls: 'space-tollbooth', emoji: '🐻', label: "Freddy's Toll" },
  freddy_zone: { cls: 'space-freddy-zone', emoji: '😱', label: 'Freddy Zone' },
  jackpot: { cls: 'space-jackpot', emoji: '💰', label: 'Jackpot!' },
};

// ─── Freddy face hard board ───────────────────────────────
// Nodes trace the real Freddy face outline clockwise from chin.
// Tollbooth at 5 → skip dest = 9 (5+TOLL_SKIP=4).
// Tollbooth at 12 → skip dest = 16 (12+TOLL_SKIP=4).
// Freddy-zone danger: nodes 6-8 (right eye), nodes 13-15 (left eye).
const FREDDY_HEAD_NODES = [
  { x: 50, y: 94 }, // 0  chin          (START)
  { x: 66, y: 89 }, // 1  right jaw
  { x: 79, y: 77 }, // 2  right cheek
  { x: 88, y: 60 }, // 3  right cheek upper
  { x: 90, y: 44 }, // 4  right ear
  { x: 77, y: 32 }, // 5  TOLLBOOTH right eyebrow   (skip → 9)
  { x: 76, y: 47 }, // 6  right eye upper  (freddy_zone)
  { x: 75, y: 57 }, // 7  right eye mid    (freddy_zone)
  { x: 69, y: 64 }, // 8  right eye lower  (freddy_zone)
  { x: 64, y: 17 }, // 9  hat brim right   (skip dest 5+4)
  { x: 50, y: 8 }, // 10 hat top          (JACKPOT)
  { x: 36, y: 17 }, // 11 hat brim left
  { x: 23, y: 32 }, // 12 TOLLBOOTH left eyebrow    (skip → 16)
  { x: 25, y: 47 }, // 13 left eye upper   (freddy_zone)
  { x: 25, y: 57 }, // 14 left eye mid     (freddy_zone)
  { x: 31, y: 64 }, // 15 left eye lower   (freddy_zone)
  { x: 10, y: 44 }, // 16 left ear         (skip dest 12+4)
  { x: 12, y: 60 }, // 17 left cheek
  { x: 21, y: 77 }, // 18 left cheek lower
  { x: 34, y: 89 }, // 19 left jaw
];

const CHAR_CFG = {
  freddy: {
    name: 'Freddy', emoji: '🐻', color: '#c48b14', img: 'images/chars/classic/freddy.png',
    desc: "At Freddy's Tollbooths, can take Path A for free (ignores toll cost). Cooldown: 3 turns.", ability: 'tollpass', cooldown: 3
  },
  bonnie: {
    name: 'Bonnie', emoji: '🎸', color: '#4169e1', img: 'images/chars/classic/bonnie.png',
    desc: 'Jumps exactly 4 spaces instead of rolling the dice. Cooldown: 3 turns.', ability: 'jump', cooldown: 3
  },
  chica: {
    name: 'Chica', emoji: '🐔', color: '#d4a017', img: 'images/chars/classic/chica.png',
    desc: 'Places a Cupcake trap on any board space. Anyone who lands there loses 1 pizza to Chica. Disappears after 1 lap. Cooldown: 3 turns.', ability: 'boardCupcake', cooldown: 3
  },
  foxy: {
    name: 'Foxy', emoji: '🦊', color: '#cc4400', img: 'images/chars/classic/foxy.png',
    desc: 'Re-rolls the dice after the first result. Cooldown: 2 turns.', ability: 'reroll', cooldown: 2
  },
  mangle: {
    name: 'Mangle', emoji: '🎀', color: '#e875b0', img: 'images/chars/toy/mangle.png',
    desc: 'Shuffles all non-locked board spaces. Cooldown: 5 turns.', ability: 'shuffle', cooldown: 5
  },
  puppet: {
    name: 'Puppet', emoji: '🎭', color: '#9a3ab0', img: 'images/chars/toy/puppet.png',
    desc: 'Gifts: converts 10 coins → 1 pizza for any player within 5 spaces (including self). Cooldown: 5 turns.', ability: 'gifts', cooldown: 5
  },
  springtrap: {
    name: 'Springtrap', emoji: '🪤', color: '#3a6a2a', img: 'images/chars/springlock/springtrap.png',
    desc: 'Kill: sends a player within 5 spaces back to start (resets laps, keeps coins & pizzas). Cooldown: 5 turns.', ability: 'kill', cooldown: 5
  },
  bb: {
    name: 'Balloon Boy', emoji: '🎈', color: '#4488cc', img: 'images/chars/toy/bb.png',
    desc: 'Hi! Every time BB rolls the dice, a random opponent automatically loses 1 coin. Ability: steal up to 5 coins from any player within 5 spaces. Cooldown: 3 turns.', ability: 'steal', cooldown: 3
  },
};

const PLAYER_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#1abca8', '#e67e22'];

// ─── Dice system ──────────────────────────────────────────
const DICE_TYPES = {
  d6: { label: 'Standard Die', emoji: '🎲', roll: () => Math.floor(Math.random() * 6) + 1 },
  d8: { label: "Foxy's Die (d8)", emoji: '🦊🎲', roll: () => Math.floor(Math.random() * 8) + 1 },
  chef: { label: "Chica's Chef Die", emoji: '🍗🎲', roll: () => [2, 2, 3, 3, 4, 5][Math.floor(Math.random() * 6)] },
  rocker: { label: "Bonnie's Rocker Die", emoji: '🎸🎲', roll: () => [1, 1, 3, 4, 6, 7][Math.floor(Math.random() * 6)] },
  '2d6': { label: 'Double Die (2d6)', emoji: '🎲🎲', roll: () => Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 },
  all1: { label: 'All-Ones Die', emoji: '1️⃣', roll: () => 1 },
  lucky7: { label: 'Lucky Seven Die', emoji: '7️⃣', roll: () => { const r = Math.random(); return r < 0.34 ? 6 : r < 0.67 ? 7 : 0; } },
  pick: { label: 'Pick Your Steps', emoji: '🎯', roll: null, pick: true },
  // Springtrap: faces 6-10 + Springlock (0 = go to start, no move)
  springlock: { label: 'Springlock Die', emoji: '🪤🎲', roll: () => [6, 7, 8, 9, 10, 0][Math.floor(Math.random() * 6)], springlock: true },
  // Puppet: faces 3-3-4-4-5-6; 6 = place a Music Box trap
  musicbox: { label: 'Music Box Die', emoji: '🎭🎲', roll: () => [3, 3, 4, 4, 5, 6][Math.floor(Math.random() * 6)], musicbox: true },
  // Mangle: 2d5 (2-10)
  '2d5': { label: "Mangle's 2d5", emoji: '🎀🎲', roll: () => Math.floor(Math.random() * 5) + 1 + Math.floor(Math.random() * 5) + 1 },
  // BB: 1-2-3-1-2-3 + passive coin steal on every roll
  balloon: { label: "BB's Balloon Die", emoji: '🎈🎲', roll: () => [1, 2, 3, 1, 2, 3][Math.floor(Math.random() * 6)], bbPassive: true },
};

const CHAR_DEFAULT_DICE = { freddy: 'd6', bonnie: 'd6', chica: 'd6', foxy: 'd6', mangle: 'd6', puppet: 'd6', springtrap: 'd6', bb: 'd6' };

const SHOP_DICE = [
  { id: 'd8', price: 8, maxUses: 4, label: "Foxy's Die (d8)", emoji: '🦊🎲', desc: 'Rolls 1-8. Foxy only. · 4 uses.', onlyChar: 'foxy' },
  { id: 'chef', price: 8, maxUses: 4, label: "Chica's Chef Die", emoji: '🍗🎲', desc: 'Rolls 2-2-3-3-4-5. Chica only. · 4 uses.', onlyChar: 'chica' },
  { id: 'rocker', price: 8, maxUses: 4, label: "Bonnie's Rocker Die", emoji: '🎸🎲', desc: 'Rolls 1-1-3-4-6-6. Bonnie only. · 4 uses.', onlyChar: 'bonnie' },
  { id: '2d5', price: 8, maxUses: 4, label: "Mangle's 2d5", emoji: '🎀🎲', desc: 'Rolls 2d5 (2-10). Mangle only. · 4 uses.', onlyChar: 'mangle' },
  { id: 'balloon', price: 8, maxUses: 4, label: "BB's Balloon Die", emoji: '🎈🎲', desc: 'Rolls 1-2-3-1-2-3. Passive: steals 1 coin from a random opponent every roll! BB only. · 4 uses.', onlyChar: 'bb' },
  { id: 'springlock', price: 8, maxUses: 3, label: 'Springlock Die', emoji: '🪤🎲', desc: 'Rolls 6-10 or Springlock (no move + back to start!). Springtrap only. · 3 uses.', onlyChar: 'springtrap' },
  { id: 'musicbox', price: 8, maxUses: 3, label: 'Music Box Die', emoji: '🎭🎲', desc: 'Rolls 3-3-4-4-5-6. On 6: places a Music Box trap! Puppet only. · 3 uses.', onlyChar: 'puppet' },
  { id: '2d6', price: 8, maxUses: 3, label: 'Double Die (2d6)', emoji: '🎲🎲', desc: 'Roll 2d6 and add results (2-12). · 3 uses.' },
  { id: 'all1', price: 3, maxUses: 5, forced: 5, label: 'All-Ones Die', emoji: '1️⃣', desc: 'Always rolls 1. FORCED for 5 turns - cannot unequip!' },
  { id: 'lucky7', price: 12, maxUses: 4, label: 'Lucky Seven Die', emoji: '7️⃣', desc: 'Rolls 6 or 7... or 0. High risk, high reward. · 4 uses.' },
  { id: 'pick', price: 15, maxUses: 3, label: 'Pick Your Steps Die', emoji: '🎯', desc: 'Choose exactly how many spaces to move (1-6). · 3 uses.' },
];

const TRAP_EFFECTS = [
  { text: 'Lost 5 coins! 💸', eff: (st, s) => { st.coins[s] = Math.max(0, (st.coins[s] || 0) - 5); } },
  { text: 'Lost 1 pizza! 🍕', eff: (st, s) => { if ((st.pizzas[s] || 0) > 0) st.pizzas[s]--; } },
  {
    text: 'Swapped with last place! 🔄', eff: (st, s, room) => {
      const pc = room.player_count || 2;
      const last = allSlots(pc).filter(sl => room[`${sl}_name`])
        .map(sl => ({ sl, score: (st.pizzas[sl] || 0) * 100 + (st.coins[sl] || 0) }))
        .sort((a, b) => a.score - b.score)[0]?.sl;
      if (last && last !== s) {
        [st.coins[s], st.coins[last]] = [st.coins[last] || 0, st.coins[s] || 0];
        [st.pizzas[s], st.pizzas[last]] = [st.pizzas[last] || 0, st.pizzas[s] || 0];
      }
    }
  },
  { text: 'Sent back to start! ⏮️', eff: (st, s) => { st.pos[s] = 0; } },
  {
    text: 'Dice reset to default! 🎲', eff: (st, s, room, ns) => {
      const char = room[`${s}_char`] || 'freddy';
      if (!ns[s]) ns[s] = { mgWins: 0, badLucks: 0 };
      ns[s].dice = CHAR_DEFAULT_DICE[char] || 'd6';
    }
  },
];

const ITEM_CFG = [
  { id: 'microphone', emoji: '🎤', price: 10 },
  { id: 'battery', emoji: '🔋', price: 25 },
  { id: 'helpy', emoji: '🐰', price: 5 },
  { id: 'swap', emoji: '🔃', price: 3 },
  { id: 'ballpit', emoji: '🎊', price: 5 },
  { id: 'm2', emoji: '🤖', price: 7 },
  { id: 'faz_mixer', emoji: '🎰', price: 2 },
  { id: 'glitchtrap', emoji: '🐇', price: 15 },
  { id: 'springlock', emoji: '🔒', price: 8 },
  { id: 'freddy_mask', emoji: '🎭', price: 22 },
];

const MINIGAME_LIST = [
  { id: 'helpyBoop', name: 'Helpy Boop', emoji: '👃', desc: 'Click Helpy\'s nose as many times as you can in 30 seconds!' },
  { id: 'moneyLaundry', name: 'Money Laundering', emoji: '💰', desc: 'Drag coins to Rockstar Freddy! Most coins deposited in 30s wins.' },
  { id: 'feedingFrenzy', name: 'Feeding Frenzy', emoji: '🍕', desc: 'Make Chica\'s pizza as fast as possible! Wrong ingredient = -1 pizza.' },
  { id: 'guitarFinder', name: 'Guitar Finder', emoji: '🎸', desc: 'Find Bonnie\'s guitar hidden in the grid as fast as possible!' },
  { id: 'powerOut', name: 'Power Out', emoji: '🔦', desc: 'Close the door before Freddy attacks! Random timing.' },
  { id: 'flashlight', name: 'Flashlight', emoji: '🔦', desc: 'Tap as fast as you can for 15 seconds! Watch out for Withered Foxy...' },
  { id: 'pizzaDough', name: 'Pizza Dough', emoji: '🍕', desc: 'Draw the most perfect circle you can in 5 seconds!' },
];

const QUESTION_EVENTS = [
  { text: "Freddy's Birthday! 🎂", desc: '+3 coins', eff: p => { p.coins += 3; } },
  { text: 'Toy Chica stole your coins! 😱', desc: '-3 coins', eff: p => { p.coins = Math.max(0, p.coins - 3); } },
  { text: 'Springtrap appeared! 💀', desc: 'Go back 3 spaces', eff: p => { p.pos = Math.max(0, p.pos - 3); } },
  { text: 'Ballora dances for you! 💃', desc: 'Go forward 3 spaces', eff: p => { p.pos = p.pos + 3; } },
  { text: 'Phantom Freddy appeared! 👻', desc: 'Lose 1 pizza', eff: p => { if (p.pizzas > 0) p.pizzas--; } },
  { text: 'Baby gave you a gift! 🎁', desc: '+1 pizza', eff: p => { p.pizzas++; } },
  { text: 'Good night, everyone! 🌙', desc: '+5 coins', eff: p => { p.coins += 5; } },
  { text: 'Nightmare Freddy invaded! 😨', desc: '-5 coins', eff: p => { p.coins = Math.max(0, p.coins - 5); } },
  { text: 'Mangle fixed everything! 🔧', desc: '+2 coins', eff: p => { p.coins += 2; } },
  { text: 'Withered Bonnie scared you! 😰', desc: 'Lose half your coins', eff: p => { p.coins = Math.floor(p.coins / 2); } },
  { text: 'Mangle shuffled the board! 🔀', desc: 'All spaces reshuffled!', eff: p => { }, boardShuffle: true },
  { text: 'Found a free item! 🎁', desc: 'Got a random item!', eff: p => { }, giveItem: true },
  { text: 'Faz-Blender activated! 🎰', desc: 'All coins & pizzas scrambled!', eff: p => { }, fazMix: true },
];

// ── Supabase ──────────────────────────────────────────────────────────────────
const cfg = window.FNAF_CONFIG || {};
if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
  document.querySelector('.container').innerHTML =
    '<p style="color:#dd6d6d;font-family:monospace;padding:2rem">Missing config.js - Supabase not configured.</p>';
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
let broadcastCh;
let liveScores = {};
let mgDoneLocal = {};   // tracks submitted slots via broadcast
let mgReadyLocal = new Set(); // tracks p5/p6 ready-for-minigame via broadcast
let podiumConfirmedLocal = new Set(); // tracks podium-confirmed slots via broadcast
let activeMgId = null;
let mgWaitKey = null;
let isHopping = false; // true during animateHops - blocks updateTokens interference
let mgCleanup = null;
let mgPoller = null;
let pendingRoll = null;
let lapCompletedLocal = false;     // local backup so lap-minigame survives Supabase race conditions
let devScoreBonus = 0;
let eventLog = [];              // local event history (broadcast to all clients)
let prevPlayerPos = {};            // track positions for movement animation

// ── Helpers ───────────────────────────────────────────────────────────────────
const imgPath = rel => '../assets/' + rel;
const charImg = char => imgPath(CHAR_CFG[char]?.img || 'images/default.png');
const slotNum = slot => +slot.replace('player', '');              // 'player2' → 2
const mgScoreKey = slot => `mg_score_p${slotNum(slot)}`;
const mgDoneKey = slot => `mg_done_p${slotNum(slot)}`;
const allSlots = n => ['player1', 'player2', 'player3', 'player4', 'player5', 'player6'].slice(0, n);

function pState(room) {
  return {
    pos: JSON.parse(room.player_pos || '{}'),
    coins: JSON.parse(room.player_coins || '{}'),
    pizzas: JSON.parse(room.player_pizzas || '{}'),
    cooldowns: JSON.parse(room.player_cooldowns || '{}'),
  };
}
function parseBoard(room) {
  try {
    const raw = JSON.parse(room.board || '[]');
    if (Array.isArray(raw)) return { tiles: raw, laps: TOTAL_LAPS, boardSize: BOARD_SIZE, mapType: 'easy', toll: 5, tollMap: {}, skipMap: {}, freeMap: {}, nodes: null, boardAspect: '1:1' };
    return {
      tiles: Array.isArray(raw.tiles) ? raw.tiles : [],
      laps: raw.laps || TOTAL_LAPS,
      boardSize: raw.boardSize || BOARD_SIZE,
      mapType: raw.mapType || 'easy',
      toll: raw.toll ?? 5,
      tollMap: raw.tollMap || {},
      skipMap: raw.skipMap || {},
      freeMap: raw.freeMap || {},
      nodes: Array.isArray(raw.nodes) ? raw.nodes : null,
      boardAspect: raw.boardAspect || '1:1',
      nextMap: raw.nextMap || {},
      endOfRoundMinigame: raw.endOfRoundMinigame || false,
    };
  } catch { return { tiles: [], laps: TOTAL_LAPS, boardSize: BOARD_SIZE, mapType: 'easy', toll: 5, tollMap: {}, skipMap: {}, freeMap: {}, nodes: null, boardAspect: '1:1' }; }
}
function pStats(room) {
  try { return JSON.parse(room.player_stats || '{}'); } catch { return {}; }
}
function isDoublePhase(room) {
  const { laps } = parseBoard(room);
  const pc = room.player_count || 2;
  return allSlots(pc).some(s => room[`${s}_name`] && playerLaps(room, s) >= laps - 1);
}
function getPlayerDice(room, slot) {
  const ns = pStats(room)[slot] || {};
  if (ns.forcedDice && (ns.forcedTurns || 0) > 0) return ns.forcedDice;
  const char = room[`${slot}_char`] || 'freddy';
  return ns.dice || CHAR_DEFAULT_DICE[char] || 'd6';
}
function getJackpotValue(room) {
  const pc = room.player_count || 2;
  const maxLap = Math.max(0, ...allSlots(pc)
    .filter(s => room[`${s}_name`])
    .map(s => playerLaps(room, s)));
  return Math.min(3 + maxLap * 3, 30);
}
function addEvent(msg) {
  eventLog.unshift(msg);
  if (eventLog.length > 300) eventLog.length = 300;
  const el = document.getElementById('event-log-list');
  if (!el) return;
  el.innerHTML = eventLog.map(m => `<div class="event-entry">${m}</div>`).join('');
  const panel = document.getElementById('event-log-panel');
  if (panel) panel.scrollTop = 0;
}
function emitEvent(msg) {
  addEvent(msg);
  broadcastCh?.send({ type: 'broadcast', event: 'game_event', payload: { msg } });
}

// ── Minigame poller - polls DB every 2s while minigame is active ──────────────
// Needed because Supabase real-time is unreliable for the allDone detection.
function startMgPoller() {
  stopMgPoller();
  mgPoller = setInterval(async () => {
    if (!roomId) return stopMgPoller();
    try {
      const { data: r } = await db.from('party_rooms').select('*').eq('id', roomId).single();
      if (!r) return;
      if (r.turn_phase === 'mg_podium') {
        stopMgPoller(); handleRoomUpdate(r); return;
      }
      if (r.turn_phase !== 'minigame') {
        stopMgPoller(); handleRoomUpdate(r); return;
      }
      const inv = JSON.parse(r.mg_players || '[]');
      if (inv.every(s => r[mgDoneKey(s)])) { stopMgPoller(); finishMinigame(r); }
    } catch { }
  }, 2000);
}
function stopMgPoller() {
  if (mgPoller) { clearInterval(mgPoller); mgPoller = null; }
}

// Broadcast-based allReady: fires when p5/p6 send mg_ready via broadcast.
function checkMgAllReadyLocal() {
  const room = roomData;
  if (!room || room.turn_phase !== 'mg_waiting') return;
  const involved = JSON.parse(room.mg_players || '[]');
  if (!involved.length) return;
  const allReady = involved.every(s =>
    slotNum(s) <= 4 ? room[mgDoneKey(s)] : mgReadyLocal.has(s)
  );
  if (allReady && involved[0] === playerSlot) {
    db.from('party_rooms').update({
      turn_phase: 'minigame',
      mg_done_p1: false, mg_done_p2: false, mg_done_p3: false, mg_done_p4: false,
    }).eq('id', roomId).eq('turn_phase', 'mg_waiting').then(() => { }, () => { });
  }
}

// Broadcast-based allDone: fires when all involved players sent mg_done via broadcast.
function checkMgAllDoneLocal() {
  if (!roomId) return;
  const involved = JSON.parse(roomData?.mg_players || '[]');
  if (!involved.length) return;
  if (involved.every(s => s in mgDoneLocal)) {
    stopMgPoller();
    (async () => {
      try { const { data: r } = await db.from('party_rooms').select('*').eq('id', roomId).single(); if (r) finishMinigame(r); } catch { }
    })();
  }
}

// Broadcast-based podium confirm: fires when all involved players confirmed via broadcast.
function checkPodiumAllConfirmedLocal() {
  if (!roomData) return;
  const involved = JSON.parse(roomData.mg_players || '[]');
  if (!involved.length) return;
  if (involved.every(s => podiumConfirmedLocal.has(s))) {
    // Everyone confirmed - advance to roll
    let nextPlayer;
    try { nextPlayer = JSON.parse(roomData.mg_config || '{}').nextPlayer; } catch { }
    nextPlayer = nextPlayer || nextSlot(roomData);
    db.from('party_rooms').update({
      turn_phase: 'roll', current_slot: nextPlayer, mg_id: null,
      mg_done_p1: false, mg_done_p2: false, mg_done_p3: false, mg_done_p4: false,
    }).eq('id', roomId).eq('turn_phase', 'mg_podium').then(() => { }, () => { });
    // Also advance locally without waiting for subscription
    document.getElementById('mg-result-overlay')?.remove();
    roomData = { ...roomData, turn_phase: 'roll', current_slot: nextPlayer, mg_id: null };
    showScreen('board');
    renderBoard(roomData);
    renderActionUI(roomData);
    renderStatusBar(roomData);
    updateTokens(roomData);
  }
}
function playerPos(room, slot) { return pState(room).pos[slot] || 0; }
function playerCoins(room, slot) { return pState(room).coins[slot] || 0; }
function playerPizzas(room, slot) { return pState(room).pizzas[slot] || 0; }
function playerLaps(room, slot) { const { boardSize } = parseBoard(room); return Math.floor(playerPos(room, slot) / boardSize); }
function boardPos(room, slot) { const { boardSize } = parseBoard(room); return playerPos(room, slot) % boardSize; }

function myPlayer(room) {
  const s = pState(room);
  return {
    slot: playerSlot,
    name: room[`${playerSlot}_name`],
    char: room[`${playerSlot}_char`] || 'freddy',
    color: PLAYER_COLORS[slotNum(playerSlot) - 1],
    pos: s.pos[playerSlot] || 0,
    coins: s.coins[playerSlot] || 0,
    pizzas: s.pizzas[playerSlot] || 0,
    cooldowns: s.cooldowns[playerSlot] || 0,
  };
}
function isMyTurn(room) { return room.current_slot === playerSlot; }
function nextSlot(room) {
  const pc = room.player_count || 2;
  const slots = allSlots(pc);
  const idx = slots.indexOf(room.current_slot);
  // Skip slots whose player has left (no name)
  for (let i = 1; i <= slots.length; i++) {
    const s = slots[(idx + i) % slots.length];
    if (room[`${s}_name`]) return s;
  }
  return room.current_slot;
}

function moveFwd(state, slot, steps, doConvert = true, boardSize = BOARD_SIZE) {
  state.pos[slot] = (state.pos[slot] || 0) + steps;
}
function moveBack(state, slot, steps) {
  state.pos[slot] = Math.max(0, (state.pos[slot] || 0) - steps);
}

// Graph-aware movement - follows nextMap connections, counts laps at node 0.
function moveByGraph(state, slot, steps, boardSize, nextMap) {
  let node = (state.pos[slot] || 0) % boardSize;
  let laps = Math.floor((state.pos[slot] || 0) / boardSize);
  for (let i = 0; i < steps; i++) {
    const nxt = (nextMap && nextMap[node] !== undefined) ? nextMap[node] : (node + 1) % boardSize;
    node = nxt;
    if (node === 0) laps++;
  }
  state.pos[slot] = laps * boardSize + node;
}

// Jump directly to a board node index.
// noLap = true: setback jump (freeMap going backward) - stays in same lap epoch, no coin conversion.
function jumpToNode(state, slot, targetIdx, boardSize, noLap = false) {
  const cur = state.pos[slot] || 0;
  const curNode = cur % boardSize;
  const lapBase = cur - curNode;
  const newPos = (noLap || targetIdx >= curNode)
    ? lapBase + targetIdx                  // no new lap: stay in current epoch
    : lapBase + boardSize + targetIdx;     // wraps forward: counts as lap
  const oldLap = Math.floor(cur / boardSize);
  const newLap = Math.floor(newPos / boardSize);
  state.pos[slot] = newPos;
}

function shufflePool(pool) {
  for (let i = pool.length - 1; i > 1; i--) {
    const j = 1 + Math.floor(Math.random() * i);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  pool[0] = 'normal';
  return pool;
}

function generateBoard() { return createBoard('easy').tiles; } // backwards compat for boardShuffle event

function createBoard(mapType = 'easy', laps = TOTAL_LAPS) {
  if (mapType === 'normal') {
    return {
      tiles: shufflePool([
        ...Array(5).fill('normal'), ...Array(4).fill('minigame'),
        ...Array(4).fill('coin'), ...Array(3).fill('pizza'),
        ...Array(3).fill('badluck'), ...Array(2).fill('trap'),
        'challenge', 'question', 'jackpot',
      ]), laps, boardSize: 24, mapType, toll: 5
    };
  }
  if (mapType === 'normal_map') {
    // 46-node custom board with split paths. Non-fixed tiles randomized each game.
    const FIXED = new Set(['tollbooth', 'freddy_zone', 'jackpot']);
    const template = [
      'normal', 'badluck', 'jackpot', 'pizza', 'normal', 'jackpot', 'badluck', 'coin', 'trap', 'question',
      'tollbooth', 'normal', 'coin', 'freddy_zone', 'minigame', 'freddy_zone', 'normal', 'coin', 'normal',
      'trap', 'normal', 'pizza', 'pizza', 'coin', 'normal', 'coin', 'minigame', 'minigame', 'trap',
      'freddy_zone', 'coin', 'minigame', 'coin', 'jackpot', 'normal', 'badluck', 'badluck', 'challenge',
      'question', 'minigame', 'minigame', 'badluck', 'pizza', 'normal', 'challenge', 'pizza',
    ];
    // 38 randomizable slots (skip index 0 START + 7 fixed-type nodes)
    const pool = shufflePool([
      ...Array(7).fill('normal'), ...Array(7).fill('coin'), ...Array(6).fill('pizza'),
      ...Array(6).fill('minigame'), ...Array(5).fill('badluck'), ...Array(3).fill('trap'),
      ...Array(2).fill('challenge'), ...Array(2).fill('question'),
    ]);
    let pi = 0;
    const tiles = template.map((t, i) => {
      if (i === 0) return 'normal'; // START always normal
      if (FIXED.has(t)) return t;
      return pool[pi++ % pool.length];
    });
    return {
      tiles, laps, boardSize: 46, mapType: 'normal_map', toll: 5,
      skipMap: { 10: 35 }, freeMap: { 10: 11 }, nextMap: { 34: 0 }, boardAspect: '1:1',
      nodes: [
        { x: 22.5, y: 13.5 }, { x: 30.9, y: 24.3 }, { x: 40.7, y: 12.9 }, { x: 46.1, y: 17.9 }, { x: 50.8, y: 27.2 },
        { x: 56.5, y: 23.4 }, { x: 65.5, y: 19.5 }, { x: 70.6, y: 28.0 }, { x: 76.9, y: 36.9 }, { x: 75.0, y: 45.4 },
        { x: 68.0, y: 57.3 }, { x: 63.0, y: 51.5 }, { x: 58.8, y: 55.0 }, { x: 53.4, y: 61.9 }, { x: 49.2, y: 54.7 },
        { x: 43.0, y: 61.4 }, { x: 36.9, y: 57.5 }, { x: 39.4, y: 53.8 }, { x: 37.3, y: 48.6 }, { x: 32.3, y: 49.1 },
        { x: 29.2, y: 56.9 }, { x: 32.1, y: 63.3 }, { x: 36.2, y: 68.3 }, { x: 33.3, y: 74.9 }, { x: 27.1, y: 74.4 },
        { x: 25.2, y: 68.0 }, { x: 24.5, y: 61.1 }, { x: 14.6, y: 60.6 }, { x: 14.7, y: 49.5 }, { x: 20.3, y: 44.5 },
        { x: 11.6, y: 33.4 }, { x: 12.5, y: 27.8 }, { x: 18.0, y: 25.7 }, { x: 15.4, y: 15.3 }, { x: 18.7, y: 8.4 },
        { x: 65.7, y: 63.9 }, { x: 61.2, y: 73.0 }, { x: 68.0, y: 79.1 }, { x: 60.3, y: 85.1 }, { x: 47.2, y: 82.7 },
        { x: 47.6, y: 71.1 }, { x: 47.9, y: 62.7 }, { x: 54.8, y: 42.7 }, { x: 40.2, y: 39.6 }, { x: 29.0, y: 35.4 },
        { x: 22.3, y: 23.9 },
      ],
    };
  }
  if (mapType === 'freddy') {
    // 58-node Freddy map · 3 tollbooths · complex paths
    const FIXED = new Set(['tollbooth', 'freddy_zone', 'jackpot']);
    const template = [
      'normal', 'tollbooth', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal',
      'tollbooth', 'jackpot', 'jackpot', 'jackpot', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal',
      'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal',
      'normal', 'normal', 'normal', 'normal', 'tollbooth', 'trap', 'challenge', 'freddy_zone', 'trap',
      'badluck', 'badluck', 'freddy_zone', 'badluck', 'challenge', 'normal', 'normal', 'normal', 'normal', 'normal',
      'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal',
    ];
    const pool = shufflePool([
      'normal', 'normal', 'normal', 'coin', 'coin', 'coin',
      'pizza', 'pizza', 'minigame', 'minigame', 'badluck', 'badluck', 'trap', 'challenge', 'question',
    ]);
    let pi = 0;
    const tiles = template.map((t, i) => {
      if (i === 0) return 'normal';
      if (FIXED.has(t)) return t;
      return pool[pi++ % pool.length];
    });
    return {
      tiles, laps, boardSize: 58, mapType: 'freddy', toll: 5,
      skipMap: { 1: 2, 10: 11, 34: 44 },
      freeMap: { 1: 23, 10: 14, 34: 35 },
      nextMap: { 22: 0 },
      boardAspect: '1:1',
      nodes: [
        { x: 49.2, y: 60.0 }, { x: 48.9, y: 51.4 }, { x: 39.8, y: 54.1 }, { x: 28.4, y: 57.2 }, { x: 26.5, y: 69.1 },
        { x: 25.8, y: 78.6 }, { x: 30.5, y: 92.8 }, { x: 48.5, y: 97.1 }, { x: 48.0, y: 77.9 }, { x: 17.3, y: 61.7 },
        { x: 23.2, y: 43.1 }, { x: 11.7, y: 42.5 }, { x: 4.6, y: 27.3 }, { x: 14.8, y: 21.4 }, { x: 25.9, y: 29.7 },
        { x: 30.9, y: 19.7 }, { x: 38.2, y: 18.9 }, { x: 36.3, y: 3.7 }, { x: 45.8, y: 2.5 }, { x: 46.0, y: 39.3 },
        { x: 35.3, y: 36.2 }, { x: 31.1, y: 48.2 }, { x: 39.0, y: 44.4 }, { x: 57.5, y: 55.6 }, { x: 65.2, y: 55.3 },
        { x: 70.2, y: 58.0 }, { x: 73.8, y: 64.1 }, { x: 74.2, y: 73.4 }, { x: 74.4, y: 83.7 }, { x: 66.3, y: 94.8 },
        { x: 56.0, y: 96.9 }, { x: 55.6, y: 77.4 }, { x: 84.6, y: 59.3 }, { x: 79.6, y: 54.0 }, { x: 74.8, y: 44.8 },
        { x: 78.9, y: 38.4 }, { x: 87.4, y: 41.9 }, { x: 96.3, y: 43.1 }, { x: 97.5, y: 36.7 }, { x: 100.0, y: 29.6 },
        { x: 96.8, y: 21.4 }, { x: 87.2, y: 18.2 }, { x: 81.3, y: 24.5 }, { x: 77.0, y: 30.3 }, { x: 70.3, y: 30.7 },
        { x: 64.7, y: 19.5 }, { x: 59.5, y: 12.2 }, { x: 60.2, y: 3.7 }, { x: 52.4, y: 3.4 }, { x: 51.7, y: 18.8 },
        { x: 51.5, y: 27.4 }, { x: 52.5, y: 39.9 }, { x: 56.0, y: 34.5 }, { x: 62.5, y: 32.7 }, { x: 68.1, y: 40.2 },
        { x: 60.0, y: 39.7 }, { x: 66.8, y: 46.6 }, { x: 55.6, y: 47.2 },
      ],
    };
  }
  if (mapType === 'bonnie') {
    // 26-node Bonnie silhouette map · single loop
    const FIXED = new Set(['jackpot']);
    const template = [
      'jackpot', 'normal', 'normal', 'normal', 'jackpot', 'normal',
      'normal', 'normal', 'jackpot', 'normal', 'normal', 'normal',
      'jackpot', 'normal', 'normal', 'normal', 'jackpot', 'normal',
      'normal', 'normal', 'jackpot', 'normal', 'normal', 'normal',
      'jackpot', 'normal',
    ];
    const pool = shufflePool([
      'normal', 'normal', 'normal', 'coin', 'coin', 'coin',
      'pizza', 'pizza', 'minigame', 'minigame', 'badluck', 'badluck', 'trap', 'challenge', 'question',
    ]);
    let pi = 0;
    const tiles = template.map(t => FIXED.has(t) ? t : (pool[pi++ % pool.length] || t));
    return {
      tiles, laps, boardSize: 26, mapType: 'bonnie', toll: 5,
      skipMap: {}, freeMap: {}, nextMap: {},
      boardAspect: '1:1',
      nodes: [
        { x: 17.6, y: 21.4 }, { x: 30.1, y: 21.4 }, { x: 40.5, y: 27.8 }, { x: 44.5, y: 38.4 },
        { x: 44.1, y: 48.5 }, { x: 49.8, y: 47.6 }, { x: 57.8, y: 48.2 }, { x: 57.4, y: 38 },
        { x: 58.9, y: 24.5 }, { x: 59.6, y: 10.6 }, { x: 68.5, y: 4 }, { x: 70.7, y: 12.7 },
        { x: 71.4, y: 24.9 }, { x: 68.8, y: 35.4 }, { x: 63.6, y: 50.7 }, { x: 68.4, y: 64.3 },
        { x: 69.7, y: 79.5 }, { x: 60.8, y: 96.7 }, { x: 48.1, y: 97.4 }, { x: 36.4, y: 90.8 },
        { x: 31.4, y: 79.6 }, { x: 32.3, y: 68.3 }, { x: 37.2, y: 52.9 }, { x: 33.9, y: 41.9 },
        { x: 31.3, y: 32.4 }, { x: 23, y: 29.7 },
      ],
    };
  }
  if (mapType === 'chica') {
    // 28-node Chica map · 1 tollbooth · looping paths
    const template = Array(28).fill('normal');
    template[11] = 'tollbooth';
    const pool = shufflePool([
      ...Array(7).fill('normal'), ...Array(5).fill('coin'), ...Array(4).fill('pizza'),
      ...Array(4).fill('minigame'), ...Array(3).fill('badluck'), 'trap',
      'challenge', 'question',
    ]);
    let pi = 0;
    const tiles = template.map((t, i) => {
      if (i === 0) return 'normal';
      if (t === 'tollbooth') return 'tollbooth';
      return pool[pi++ % pool.length];
    });
    return {
      tiles, laps, boardSize: 28, mapType: 'chica', toll: 5,
      skipMap: { 11: 12 },
      freeMap: { 11: 24 },
      nextMap: { 15: 27, 23: 0, 26: 12, 27: 16 },
      boardAspect: '1:1',
      nodes: [
        { x: 44.9, y: 56.6 }, { x: 35.7, y: 70.7 }, { x: 61.2, y: 70.6 }, { x: 49.8, y: 57 }, { x: 34.9, y: 78.9 },
        { x: 47.6, y: 94 }, { x: 61.4, y: 80.1 }, { x: 24, y: 80.4 }, { x: 14.1, y: 57.2 }, { x: 24.4, y: 28.3 },
        { x: 36.2, y: 21.6 }, { x: 47.1, y: 25.1 }, { x: 58.5, y: 21.2 }, { x: 68.3, y: 26.9 }, { x: 79.9, y: 53.1 },
        { x: 69.2, y: 81.2 }, { x: 35.9, y: 59.4 }, { x: 29.2, y: 50.9 }, { x: 38.2, y: 46.3 }, { x: 44.5, y: 52.2 },
        { x: 51.5, y: 52.7 }, { x: 57.4, y: 46.9 }, { x: 66.2, y: 53 }, { x: 58.9, y: 58.8 }, { x: 29, y: 8.6 },
        { x: 46.4, y: 21.7 }, { x: 61.7, y: 9 }, { x: 47.8, y: 87.9 },
      ],
    };
  }
  if (mapType === 'foxy') {
    // 48-node Foxy map · no tollbooths · pure random tiles
    const pool = shufflePool([
      ...Array(11).fill('normal'), ...Array(8).fill('coin'), ...Array(6).fill('pizza'),
      ...Array(6).fill('minigame'), ...Array(6).fill('badluck'), ...Array(4).fill('trap'),
      ...Array(3).fill('challenge'), ...Array(2).fill('question'), 'jackpot',
    ]);
    let pi = 0;
    const tiles = Array(48).fill(null).map((_, i) => i === 0 ? 'normal' : pool[pi++ % pool.length]);
    return {
      tiles, laps, boardSize: 48, mapType: 'foxy', toll: 5,
      nextMap: {}, skipMap: {}, freeMap: {},
      boardAspect: '1:1',
      nodes: [
        { x: 40.9, y: 35.9 }, { x: 48.6, y: 42.2 }, { x: 40.9, y: 48.2 }, { x: 33.3, y: 39.6 }, { x: 27.1, y: 35.6 },
        { x: 27.5, y: 46.9 }, { x: 20.4, y: 48.5 }, { x: 25.1, y: 52.1 }, { x: 11.7, y: 55.5 }, { x: 37.8, y: 60.7 },
        { x: 62.8, y: 55.3 }, { x: 50.1, y: 47.3 }, { x: 37, y: 54.8 }, { x: 49.7, y: 53.5 }, { x: 50.4, y: 63.3 },
        { x: 84.6, y: 56.6 }, { x: 76.6, y: 51.6 }, { x: 79.2, y: 47.6 }, { x: 71.4, y: 46.2 }, { x: 71, y: 33.7 },
        { x: 62.5, y: 24.3 }, { x: 65.2, y: 18.9 }, { x: 77.6, y: 4.9 }, { x: 90.2, y: 4.1 }, { x: 87.3, y: 17.5 },
        { x: 74.6, y: 29 }, { x: 67.5, y: 26.6 }, { x: 55, y: 20.7 }, { x: 47.9, y: 22.1 }, { x: 43.4, y: 15 },
        { x: 49.6, y: 19.2 }, { x: 56.2, y: 14 }, { x: 37.2, y: 22.5 }, { x: 33.7, y: 27.1 }, { x: 34.3, y: 20.8 },
        { x: 18.1, y: 5.1 }, { x: 9.5, y: 5 }, { x: 10.4, y: 16.7 }, { x: 25.6, y: 30.1 }, { x: 34.6, y: 62.1 },
        { x: 36, y: 88.5 }, { x: 50.1, y: 98.7 }, { x: 64.3, y: 89.9 }, { x: 64, y: 60.9 }, { x: 56.9, y: 36.4 },
        { x: 63.3, y: 42.6 }, { x: 56.1, y: 47.7 }, { x: 51.7, y: 41.7 },
      ],
    };
  }
  if (mapType === 'jackpot') {
    // 39-node map: 28 jackpots → 9 chained tollbooths → 1 pizza.
    // No randomization. Minigame every lap.
    const tiles = [
      'normal',
      ...Array(28).fill('jackpot'),
      ...Array(9).fill('tollbooth'),
      'pizza',
    ];
    return {
      tiles, laps, boardSize: 39, mapType: 'jackpot', toll: 5,
      skipMap: { 29: 30, 30: 31, 31: 32, 32: 33, 33: 34, 34: 35, 35: 36, 36: 37, 37: 38 },
      freeMap: { 29: 1, 30: 1, 31: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1 },
      boardAspect: '1:1',
      endOfRoundMinigame: true,
      nodes: [
        { x: 49.2, y: 67.9 }, { x: 47.9, y: 89.2 }, { x: 66.7, y: 87.2 }, { x: 49.0, y: 99.5 }, { x: 30.5, y: 86.4 },
        { x: 32.8, y: 52.1 }, { x: 38.3, y: 48.8 }, { x: 32.1, y: 33.4 }, { x: 34.7, y: 18.8 }, { x: 27.5, y: 16.7 },
        { x: 26.7, y: 8.4 }, { x: 36.0, y: 8.2 }, { x: 39.3, y: 14.2 }, { x: 44.7, y: 1.5 }, { x: 54.7, y: 1.9 },
        { x: 62.5, y: 13.3 }, { x: 66.4, y: 7.2 }, { x: 72.3, y: 8.2 }, { x: 70.7, y: 16.4 }, { x: 64.7, y: 19.9 },
        { x: 68.9, y: 34.1 }, { x: 64.3, y: 47.2 }, { x: 56.1, y: 50.4 }, { x: 51.2, y: 36.6 }, { x: 47.7, y: 31.5 },
        { x: 54.4, y: 31.0 }, { x: 44.6, y: 50.4 }, { x: 66.6, y: 52.4 }, { x: 67.6, y: 70.3 }, { x: 60.8, y: 65.9 },
        { x: 53.4, y: 64.3 }, { x: 49.7, y: 58.6 }, { x: 45.6, y: 63.8 }, { x: 39.2, y: 65.2 }, { x: 43.3, y: 69.7 },
        { x: 42.0, y: 76.8 }, { x: 49.1, y: 73.2 }, { x: 56.8, y: 77.4 }, { x: 55.0, y: 70.3 },
      ],
    };
  }

  // easy
  return {
    tiles: shufflePool([
      ...Array(5).fill('normal'), ...Array(3).fill('minigame'),
      ...Array(3).fill('coin'), ...Array(2).fill('pizza'),
      ...Array(2).fill('badluck'), ...Array(2).fill('trap'),
      'challenge', 'question', 'jackpot',
    ]), laps, boardSize: 20, mapType, toll: 5
  };
}
function genCode() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }

// ── Screens ───────────────────────────────────────────────────────────────────
function showScreen(name) {
  ['lobby', 'waiting', 'board', 'minigame', 'result'].forEach(s => {
    const el = document.getElementById(`screen-${s}`);
    if (el) el.style.display = (s === name) ? '' : 'none';
  });
  const inGame = ['board', 'minigame', 'result'].includes(name);
  const inGameHUD = ['board', 'minigame'].includes(name);
  const shop = document.getElementById('dice-shop-panel');
  if (shop) shop.style.display = inGameHUD ? '' : 'none';
  const actionPanel = document.getElementById('dice-action-panel');
  if (actionPanel) actionPanel.style.display = inGameHUD ? '' : 'none';
  const slots = document.getElementById('player-slots-panel');
  if (slots) slots.style.display = inGameHUD ? '' : 'none';
  // Hide header and reduce container padding on in-game screens
  const hdr = document.querySelector('.fnaf-header');
  if (hdr) hdr.style.display = inGame ? 'none' : '';
  const cnt = document.getElementById('party-container');
  if (cnt) cnt.style.padding = inGame ? '8px 12px' : '';
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
  document.getElementById('join-room-btn').addEventListener('click', joinRoom);
  document.getElementById('copy-code-btn').addEventListener('click', copyCode);
  document.getElementById('refresh-lobby-btn').addEventListener('click', loadPublicPartyLobby);
  document.getElementById('start-early-btn').addEventListener('click', startEarlyParty);

  // Translate input placeholders
  const lobbyName = document.getElementById('lobby-name');
  if (lobbyName) lobbyName.placeholder = T('lobby.nameInput');
  const joinCode = document.getElementById('join-code');
  if (joinCode) joinCode.placeholder = T('lobby.codeInput');
  const roomName = document.getElementById('create-room-name');
  if (roomName) roomName.placeholder = T('lobby.roomNameExample');

  // Render rules list
  const rulesList = document.getElementById('rules-list');
  if (rulesList) {
    const RULE_EMOJIS = ['🎲', '🔄', '🏆', '🪙', '🎮', '🐻', '👥', '🎲', '1️⃣', '🦊🐻🐔🎸🪤🎭🎀', '💰'];
    rulesList.innerHTML = Array.from({ length: 11 }, (_, i) =>
      `<li><span class="e">${RULE_EMOJIS[i]}</span> ${T('rules.' + i)}</li>`
    ).join('');
  }

  loadPublicPartyLobby();
}

// ── Create Panel ──────────────────────────────────────────────────────────────
function showPartyCreatePanel() {
  const name = document.getElementById('lobby-name').value.trim();
  if (!name) { lobbyError(T('error.enterName')); return; }
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
  if (!name) { lobbyError(T('error.enterName')); return; }

  const code = document.getElementById('create-room-code').textContent;
  const roomName = document.getElementById('create-room-name').value.trim() || `${name}'s Room`;
  const isPrivate = document.querySelector('input[name="party-privacy"]:checked')?.value === 'private';
  const pc = +document.querySelector('input[name="party-count"]:checked').value;
  const totalLaps = +document.querySelector('input[name="party-laps"]:checked').value;
  const mapType = document.querySelector('input[name="party-map"]:checked').value;
  const board = createBoard(mapType, totalLaps);

  const { data, error } = await db.from('party_rooms').insert({
    code, player_count: pc, state: 'waiting',
    player1_id: playerId, player1_name: name, player1_char: null,
    room_name: roomName, is_private: isPrivate,
    board: JSON.stringify(board),
    player_pos: JSON.stringify({ player1: 0 }),
    player_coins: JSON.stringify({ player1: 0 }),
    player_pizzas: JSON.stringify({ player1: 0 }),
    player_cooldowns: JSON.stringify({ player1: 0 }),
    player_stats: JSON.stringify({}),
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
  listEl.innerHTML = `<div class="lobby-empty">${T('lobby.loading')}</div>`;

  let data, error;
  ({ data, error } = await db.from('party_rooms')
    .select('id, code, room_name, player_count, player1_name, player2_name, player3_name, player4_name, player5_name, player6_name')
    .eq('state', 'waiting')
    .or('is_private.eq.false,is_private.is.null')
    .order('created_at', { ascending: false })
    .limit(10));

  if (error) {
    ({ data, error } = await db.from('party_rooms')
      .select('id, code, player_count, player1_name, player2_name, player3_name, player4_name, player5_name, player6_name')
      .eq('state', 'waiting')
      .order('created_at', { ascending: false })
      .limit(10));
  }

  if (error || !data) { listEl.innerHTML = `<div class="lobby-empty">${T('lobby.couldNotLoad')}</div>`; return; }
  renderPublicPartyLobby(data);
}

function renderPublicPartyLobby(rooms) {
  const listEl = document.getElementById('public-lobby-list');
  if (!listEl) return;
  if (!rooms.length) { listEl.innerHTML = `<div class="lobby-empty">${T('lobby.noRooms')}</div>`; return; }

  const escHtml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  listEl.innerHTML = '';
  let anyShown = false;
  rooms.forEach(r => {
    const pc = r.player_count || 2;
    const joined = allSlots(pc).filter(s => r[`${s}_name`]).length;
    if (joined === 0) return;
    anyShown = true;
    const name = r.room_name || (r.player1_name ? `${r.player1_name}'s Room` : 'Room');

    const entry = document.createElement('div');
    entry.className = 'lobby-room-entry';
    entry.innerHTML = `
      <div class="lobby-room-info">
        <div class="lobby-room-name">${escHtml(name)}</div>
        <div class="lobby-room-meta">${T('lobby.players', { joined, pc })}</div>
      </div>
      <div class="lobby-room-code">${r.code}</div>
      <button class="mp-btn small" onclick="joinFromPartyLobby('${r.code}')">${T('lobby.join')}</button>
    `;
    listEl.appendChild(entry);
  });
  if (!anyShown) listEl.innerHTML = `<div class="lobby-empty">${T('lobby.noRooms')}</div>`;
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
  const pc = room.player_count || 2;
  const joined = allSlots(pc).filter(s => room[`${s}_name`]).length;
  if (playerSlot === 'player1' && joined >= 2 && joined < pc) {
    btn.style.display = '';
    btn.textContent = T('lobby.startWith', { n: joined });
    btn.disabled = false;
  } else {
    btn.style.display = 'none';
  }
}

async function startEarlyParty() {
  if (playerSlot !== 'player1') return;
  const pc = roomData.player_count || 2;
  const joined = allSlots(pc).filter(s => roomData[`${s}_name`]).length;
  if (joined < 2) return;
  const btn = document.getElementById('start-early-btn');
  if (btn) btn.disabled = true;
  await db.from('party_rooms').update({ player_count: joined }).eq('id', roomId);
}

// ── Create / Join ─────────────────────────────────────────────────────────────

async function joinRoom() {
  const name = document.getElementById('lobby-name').value.trim();
  if (!name) { lobbyError(T('error.enterName')); return; }
  const code = document.getElementById('join-code').value.trim().toUpperCase();
  if (code.length < 6) { lobbyError(T('error.invalidCode')); return; }

  const { data: room, error } = await db.from('party_rooms')
    .select('*').eq('code', code).eq('state', 'waiting').single();
  if (error || !room) { lobbyError(T('error.roomNotFound')); return; }

  const pc = room.player_count || 2;
  let slot;
  if (!room.player2_id) slot = 'player2';
  else if (pc >= 3 && !room.player3_id) slot = 'player3';
  else if (pc >= 4 && !room.player4_id) slot = 'player4';
  else if (pc >= 5 && !room.player5_id) slot = 'player5';
  else if (pc >= 6 && !room.player6_id) slot = 'player6';
  else { lobbyError(T('error.roomFull')); return; }

  const st = pState(room);
  st.pos[slot] = 0;
  st.coins[slot] = 0;
  st.pizzas[slot] = 0;
  st.cooldowns[slot] = 0;

  const { data, error: err2 } = await db.from('party_rooms').update({
    [`${slot}_id`]: playerId,
    [`${slot}_name`]: name,
    [`${slot}_char`]: null,
    player_pos: JSON.stringify(st.pos),
    player_coins: JSON.stringify(st.coins),
    player_pizzas: JSON.stringify(st.pizzas),
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
  const pc = room.player_count || 2;
  const joined = allSlots(pc).filter(s => room[`${s}_name`]).length;

  // Player list
  const listEl = document.getElementById('waiting-players');
  if (listEl) {
    listEl.innerHTML = '';
    allSlots(pc).forEach((s, i) => {
      const name = room[`${s}_name`];
      const char = room[`${s}_char`];
      const row = document.createElement('div');
      row.className = 'waiting-player-row';
      if (name) {
        const c = CHAR_CFG[char];
        const confirmed = JSON.parse(room.player_stats || '{}')[`confirmed_${s}`];
        row.innerHTML = char
          ? `<img src="${charImg(char)}" style="width:16px;height:16px;border-radius:50%;object-fit:contain;vertical-align:middle;margin-right:4px" onerror="this.style.display='none'"/>${confirmed ? '✅' : '⏳'} ${name} <span style="color:var(--gold);font-size:.75rem">(${c ? T('char.' + char + '.name') : char})</span>`
          : T('waiting.choosing', { name });
        row.style.color = confirmed ? 'var(--green-text)' : char ? 'var(--yellow-text)' : 'var(--text-muted)';
      } else {
        row.textContent = T('waiting.waitingSlot', { n: i + 1 });
        row.style.color = 'var(--text-muted)';
      }
      listEl.appendChild(row);
    });
  }

  // Title
  const active = allSlots(pc).filter(s => room[`${s}_name`]);
  const allChosen = active.every(s => room[`${s}_char`]);
  const stats = JSON.parse(room.player_stats || '{}');
  const allConfirmed = allChosen && active.every(s => stats[`confirmed_${s}`]);
  const title = document.getElementById('waiting-title');
  if (title) {
    if (joined < pc) title.textContent = T('waiting.titleCount', { joined, pc });
    else if (!allChosen) title.textContent = T('waiting.titleChoose');
    else if (!allConfirmed) title.textContent = T('waiting.titleConfirm');
    else title.textContent = T('waiting.titleReady');
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

  // Conflict detection: if my char is already taken by someone else, clear it
  const myChar = room[`${playerSlot}_char`];
  if (myChar && playerSlot) {
    const conflict = allSlots(pc).some(s => s !== playerSlot && room[`${s}_char`] === myChar);
    if (conflict) {
      db.from('party_rooms').update({ [`${playerSlot}_char`]: null }).eq('id', roomId);
      showToast(T('error.charTaken'));
    }
  }

  // Check if can start
  checkAllCharsReady(room);
}

function renderWaitingCharPicker(room) {
  const pc = room.player_count || 2;
  const myChar = room[`${playerSlot}_char`];
  const takenBy = {};
  allSlots(pc).forEach(s => {
    if (s !== playerSlot && room[`${s}_char`]) takenBy[room[`${s}_char`]] = room[`${s}_name`];
  });

  const picker = document.getElementById('waiting-char-picker');
  const desc = document.getElementById('waiting-char-desc');
  if (!picker) return;

  const charEntries = Object.entries(CHAR_CFG);
  const ROW1_KEYS = ['freddy', 'bonnie', 'chica', 'foxy'];
  const renderCharOpt = ([k, c]) => {
    const taken = takenBy[k];
    const selected = myChar === k;
    return `<label class="char-pick-opt${selected ? ' selected' : ''}" data-k="${k}"
              style="opacity:${taken ? '0.3' : '1'};pointer-events:${taken ? 'none' : 'auto'}">
      <input type="radio" name="char-wait" value="${k}" ${selected ? 'checked' : ''} ${taken ? 'disabled' : ''}/>
      <img class="char-img" src="${charImg(k)}" alt="${c.name}"
           onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
      <span class="char-emoji-fb" style="display:none">${c.emoji}</span>
      <span class="char-name">${T('char.' + k + '.name')}${taken ? `<br><small style="font-size:.6rem">${taken}</small>` : ''}</span>
    </label>`;
  };
  const row1 = charEntries.filter(([k]) => ROW1_KEYS.includes(k));
  const row2 = charEntries.filter(([k]) => !ROW1_KEYS.includes(k));
  picker.innerHTML =
    row1.map(renderCharOpt).join('') +
    '<div style="width:100%;flex-basis:100%;height:0"></div>' +
    row2.map(renderCharOpt).join('');

  picker.querySelectorAll('.char-pick-opt').forEach(opt => {
    opt.addEventListener('click', () => selectChar(opt.dataset.k));
  });

  if (desc) desc.textContent = myChar ? T('char.' + myChar + '.desc') : T('waiting.clickSelect');

  // Confirm button
  const stats = JSON.parse(room.player_stats || '{}');
  const confirmed = stats[`confirmed_${playerSlot}`];
  let confirmWrap = document.getElementById('char-confirm-wrap');
  if (!confirmWrap) {
    confirmWrap = document.createElement('div');
    confirmWrap.id = 'char-confirm-wrap';
    confirmWrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:4px;width:100%';
    document.getElementById('char-select-wrap')?.appendChild(confirmWrap);
  }
  if (!myChar) {
    confirmWrap.innerHTML = '';
  } else if (confirmed) {
    confirmWrap.innerHTML = `<div style="color:var(--green-text);font-family:'Oswald',sans-serif;font-size:.85rem">${T('waiting.confirmed')}</div>`;
  } else {
    confirmWrap.innerHTML = `<button class="mp-btn primary" id="char-confirm-btn" style="margin-top:0">${T('waiting.confirmBtn', { name: T('char.' + myChar + '.name') })}</button>`;
    document.getElementById('char-confirm-btn')?.addEventListener('click', confirmChar, { once: true });
  }
}

async function selectChar(charKey) {
  const pc = (roomData.player_count || 2);
  const { data: fresh } = await db.from('party_rooms').select('*').eq('id', roomId).single();
  if (!fresh) return;
  const takenByOther = allSlots(pc).some(s => s !== playerSlot && fresh[`${s}_char`] === charKey);
  if (takenByOther) { showToast(T('error.alreadyTaken')); renderWaitingCharPicker(fresh); return; }
  // Clear confirmation when changing character
  const ps = JSON.parse(fresh.player_stats || '{}');
  delete ps[`confirmed_${playerSlot}`];
  await db.from('party_rooms').update({ [`${playerSlot}_char`]: charKey, player_stats: JSON.stringify(ps) }).eq('id', roomId);
}

async function confirmChar() {
  if (!roomData[`${playerSlot}_char`]) return;
  const { data: fresh } = await db.from('party_rooms').select('player_stats').eq('id', roomId).single();
  const ps = JSON.parse(fresh?.player_stats || '{}');
  ps[`confirmed_${playerSlot}`] = true;
  await db.from('party_rooms').update({ player_stats: JSON.stringify(ps) }).eq('id', roomId);
}

async function checkAllCharsReady(room) {
  const pc = room.player_count || 2;
  const active = allSlots(pc).filter(s => room[`${s}_name`]);
  if (active.length < pc) return;
  const allChosen = active.every(s => room[`${s}_char`]);
  if (!allChosen) return;
  const chars = active.map(s => room[`${s}_char`]);
  const unique = new Set(chars).size === chars.length;
  if (!unique) return;
  // Require all players to confirm their character
  const stats = JSON.parse(room.player_stats || '{}');
  if (!active.every(s => stats[`confirmed_${s}`])) return;
  if (playerSlot !== active[0]) return;
  const firstSlot = active[Math.floor(Math.random() * active.length)];
  const initStats = {};
  active.forEach(s => {
    const char = room[`${s}_char`] || 'freddy';
    const defaultDice = CHAR_DEFAULT_DICE[char] || 'd6';
    initStats[s] = { mgWins: 0, badLucks: 0, dice: defaultDice, ownedDice: defaultDice !== 'd6' ? [defaultDice] : [], shopVisited: false };
  });
  const firstEvent = T('waiting.goesFirst', { name: room[`${firstSlot}_name`] });
  await db.from('party_rooms').update({
    state: 'playing',
    current_slot: firstSlot,
    player_stats: JSON.stringify(initStats),
    mg_config: JSON.stringify({ firstEvent }),
  }).eq('id', roomId).eq('state', 'waiting');
}

// Find my slot in the current room (needed after slot compaction on rematch)
function refreshPlayerSlot(room) {
  const found = allSlots(6).find(s => room[`${s}_id`] === playerId);
  if (!found) {
    showToast(T('waiting.notInRematch'));
    setTimeout(() => { roomId = null; playerSlot = null; showScreen('lobby'); }, 2500);
    return false;
  }
  playerSlot = found;
  return true;
}

function copyCode() {
  const code = document.getElementById('waiting-code').textContent;
  const btn = document.getElementById('copy-code-btn');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).catch(() => { });
  } else {
    try {
      const el = document.createElement('textarea');
      el.value = code; el.style.position = 'fixed'; el.style.opacity = '0';
      document.body.appendChild(el); el.select(); document.execCommand('copy');
      document.body.removeChild(el);
    } catch (_) { }
  }
  btn.textContent = T('waiting.copied');
  setTimeout(() => { btn.textContent = T('waiting.copyCode'); }, 2000);
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
    .on('broadcast', { event: 'mg_done' }, ({ payload }) => {
      mgDoneLocal[payload.slot] = payload.score;
      liveScores[payload.slot] = payload.score;
      updateLiveBar();
      checkMgAllDoneLocal();
    })
    .on('broadcast', { event: 'mg_ready' }, ({ payload }) => {
      mgReadyLocal.add(payload.slot);
      checkMgAllReadyLocal();
    })
    .on('broadcast', { event: 'podium_confirm' }, ({ payload }) => {
      podiumConfirmedLocal.add(payload.slot);
      checkPodiumAllConfirmedLocal();
    })
    .on('broadcast', { event: 'jumpscare' }, ({ payload }) => {
      if (payload.sender !== playerId) triggerJumpscare(payload.char, () => { });
    })
    .on('broadcast', { event: 'game_event' }, ({ payload }) => {
      addEvent(payload.msg);
    })
    .subscribe();
}

async function handleRoomUpdate(room) {
  const prev = roomData;
  roomData = room;

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
        mgWaitKey = mgKey;
        activeMgId = null; // must be null so startMinigameScreen fires when phase → 'minigame'
        liveScores = {};
      }
      const involved = JSON.parse(room.mg_players || '[]');
      const allReady = involved.every(s =>
        slotNum(s) <= 4 ? room[mgDoneKey(s)] : mgReadyLocal.has(s)
      );
      if (allReady && involved[0] === playerSlot) {
        // All players ready - lowest slot kicks off the actual game
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
        const involved = JSON.parse(room.mg_players || '[]');
        const allDone = involved.every(s => room[mgDoneKey(s)]);
        if (allDone) { stopMgPoller(); finishMinigame(room); }
      }
    } else if (room.turn_phase === 'tollbooth') {
      showScreen('board');
      if (prev?.board !== room.board) renderBoard(room);
      renderStatusBar(room);
      updateTokens(room);
      if (isMyTurn(room)) {
        showTollboothUI(room);
      } else {
        const curName = room[`${room.current_slot}_name`] || '?';
        const curColor = PLAYER_COLORS[slotNum(room.current_slot) - 1];
        const el = document.getElementById('current-player-action');
        if (el) el.innerHTML = `<div class="action-card"><div class="action-waiting"><strong style="color:${curColor}">${T('action.atTollbooth', { name: curName })}</strong></div></div>`;
      }
      showDiceShop(room);
    } else if (room.turn_phase === 'mg_podium') {
      showScreen('board');
      if (prev?.board !== room.board) renderBoard(room);
      renderStatusBar(room);
      updateTokens(room);
      const involved = JSON.parse(room.mg_players || '[]');
      const allConfirmed = involved.every(s =>
        slotNum(s) <= 4 ? room[mgDoneKey(s)] : podiumConfirmedLocal.has(s)
      );
      if (allConfirmed) {
        let nextPlayer;
        try { nextPlayer = JSON.parse(room.mg_config || '{}').nextPlayer; } catch { }
        nextPlayer = nextPlayer || nextSlot(room);
        await db.from('party_rooms').update({
          turn_phase: 'roll', current_slot: nextPlayer, mg_id: null,
          mg_done_p1: false, mg_done_p2: false, mg_done_p3: false, mg_done_p4: false,
        }).eq('id', roomId).eq('turn_phase', 'mg_podium');
      } else if (!podiumConfirmedLocal.has(playerSlot)) {
        showMgPodium(room);
        showDiceShop(room);
      }
    } else if (room.turn_phase === 'roll' || room.turn_phase === 'rolled' || room.turn_phase === 'moved') {
      document.getElementById('mg-result-overlay')?.remove();
      showScreen('board');
      if (prev?.board !== room.board) renderBoard(room);
      renderActionUI(room);
    }
    return;
  }
  if (room.state === 'finished') {
    const pc = room.player_count || 2;
    const statsMap = pStats(room);
    if (!statsMap._awardsApplied) {
      const active = allSlots(pc).filter(s => room[`${s}_name`]);
      if (playerSlot === active[0]) {
        await applyEndAwards(room);
      }
      // Await DB propagation - don't show result yet
      return;
    }
    const voters = room.mg_id || '';
    const allVoted = allSlots(pc).filter(s => room[`${s}_name`]).every(s => voters.includes(s));
    if (allVoted) triggerPartyRematch(room);
    else showResult(room);
  }
}

// ── Game start ────────────────────────────────────────────────────────────────
function startGame(room) {
  roomData = room;
  // Emit the "goes first" event that was stored at game start
  try {
    const firstEvent = JSON.parse(room.mg_config || '{}').firstEvent;
    if (firstEvent) addEvent(firstEvent);
  } catch { }
  showScreen('board');
  renderBoard(room);
  renderStatusBar(room);
  renderActionUI(room);
}

// ── Board render ──────────────────────────────────────────────────────────────
function renderBoard(room) {
  const el = document.getElementById('party-board');
  const { tiles, laps, mapType, toll, nodes, skipMap, freeMap, boardAspect } = parseBoard(room);
  el.innerHTML = '';
  el.className = `party-board board-theme-${mapType}`;

  if (nodes && nodes.length > 0) {
    renderCustomBoard(el, tiles, laps, toll, nodes, skipMap, freeMap, boardAspect);
  } else if (mapType === 'freddy') {
    renderFreddyFaceBoard(el, tiles, laps, toll);
  } else {
    const grid = getBoardGrid(mapType);
    const maxCol = Math.max(...grid.map(([, c]) => c));
    const maxRow = Math.max(...grid.map(([r]) => r));
    el.style.gridTemplateColumns = `repeat(${maxCol}, 1fr)`;
    el.style.gridTemplateRows = `repeat(${maxRow}, 1fr)`;
    el.style.aspectRatio = `${maxCol} / ${maxRow}`;
    el.style.position = '';
    el.style.paddingBottom = '';
    el.style.height = '';

    grid.forEach(([row, col], idx) => {
      const type = tiles[idx] || 'normal';
      const cfg = SPACE_CFG[type] || SPACE_CFG.normal;
      const jackLabel = type === 'jackpot' ? `<span class="space-jack-val">${getJackpotValue(room)}</span>` : '';
      const sp = document.createElement('div');
      sp.className = `board-space ${cfg.cls}${idx === 0 ? ' space-start' : ''}`;
      sp.dataset.node = String(idx);
      sp.style.gridRow = row;
      sp.style.gridColumn = col;
      sp.innerHTML = `
        <span class="space-num">${idx === 0 ? '🏁' : idx}</span>
        ${cfg.emoji ? `<span class="space-emoji">${cfg.emoji}</span>` : ''}${jackLabel}
        <div class="space-tokens" id="tok-${idx}"></div>`;
      el.appendChild(sp);
    });

    const mapIcon = mapType === 'normal' ? '🍕' : '🎂';
    const center = document.createElement('div');
    center.className = 'board-center';
    center.style.gridColumn = `2 / ${maxCol}`;
    center.style.gridRow = `2 / ${maxRow}`;
    center.innerHTML = `
      <div class="board-center-logo">${mapIcon}</div>
      <div class="board-center-text">${T('board.center').replace('\n', '<br>')}</div>
      <div class="board-lap-info">${T('board.laps', { n: laps })}</div>`;
    el.appendChild(center);
  }

  updateTokens(room);
}

function renderFreddyFaceBoard(el, tiles, laps, toll) {
  el.style.gridTemplateColumns = 'none';
  el.style.gridTemplateRows = 'none';
  el.style.position = 'relative';
  el.style.width = 'min(480px, 100%)';
  el.style.paddingBottom = 'min(480px, 100%)';
  el.style.height = '0';

  // SVG face layer
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';

  function svgEl(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
  }

  // ── Face shape ────────────────────────────────────────
  // Main head oval (matches face proportions from Freddy image)
  svg.appendChild(svgEl('ellipse', { cx: '50', cy: '58', rx: '41', ry: '38', fill: '#1a0900', stroke: '#7a4200', 'stroke-width': '0.8', opacity: '0.65' }));
  // Hat brim (wide flat band at y≈17-21)
  svg.appendChild(svgEl('rect', { x: '28', y: '18', width: '44', height: '4', rx: '2', fill: '#0d0600', stroke: '#7a4200', 'stroke-width': '0.6', opacity: '0.65' }));
  // Hat body (tall rectangle above brim)
  svg.appendChild(svgEl('rect', { x: '35', y: '2', width: '30', height: '17', rx: '2', fill: '#0d0600', stroke: '#7a4200', 'stroke-width': '0.6', opacity: '0.65' }));
  // Right ear (circle at ~90%, 44%)
  svg.appendChild(svgEl('circle', { cx: '92', cy: '44', r: '7', fill: '#200e00', stroke: '#7a4200', 'stroke-width': '0.6', opacity: '0.6' }));
  // Left ear (circle at ~8%, 44%)
  svg.appendChild(svgEl('circle', { cx: '8', cy: '44', r: '7', fill: '#200e00', stroke: '#7a4200', 'stroke-width': '0.6', opacity: '0.6' }));
  // Right eye socket (danger zone, around nodes 6-8, center ≈ 75,55)
  svg.appendChild(svgEl('ellipse', { cx: '74', cy: '54', rx: '8', ry: '10', fill: '#1e0505', stroke: '#882222', 'stroke-width': '0.7', opacity: '0.8' }));
  // Left eye socket (danger zone, around nodes 13-15, center ≈ 26,55)
  svg.appendChild(svgEl('ellipse', { cx: '26', cy: '54', rx: '8', ry: '10', fill: '#1e0505', stroke: '#882222', 'stroke-width': '0.7', opacity: '0.8' }));
  // Nose (small oval at center)
  svg.appendChild(svgEl('ellipse', { cx: '50', cy: '68', rx: '5', ry: '4', fill: '#150800', stroke: '#7a4200', 'stroke-width': '0.5', opacity: '0.5' }));
  // Mouth (wide arc near bottom)
  svg.appendChild(svgEl('path', { d: 'M 35 76 Q 50 87 65 76', fill: 'none', stroke: '#7a4200', 'stroke-width': '0.7', opacity: '0.55' }));
  // Eyebrows (arcs above eye sockets)
  svg.appendChild(svgEl('path', { d: 'M 65 35 Q 74 30 82 33', fill: 'none', stroke: '#442200', 'stroke-width': '1.2', opacity: '0.6' }));
  svg.appendChild(svgEl('path', { d: 'M 35 35 Q 26 30 18 33', fill: 'none', stroke: '#442200', 'stroke-width': '1.2', opacity: '0.6' }));

  // ── Path connection lines ──────────────────────────────
  function line(a, b, col = '#7a4200', op = 0.45) {
    const n1 = FREDDY_HEAD_NODES[a], n2 = FREDDY_HEAD_NODES[b];
    svg.appendChild(svgEl('line', { x1: n1.x, y1: n1.y, x2: n2.x, y2: n2.y, stroke: col, 'stroke-width': '0.9', opacity: op }));
  }
  // Main outer path (clockwise, skipping danger zones)
  [0, 1, 2, 3, 4, 5, 9, 10, 11, 12, 16, 17, 18, 19].reduce((a, b) => { line(a, b); return b; });
  line(19, 0); // close loop
  // Danger zone right eye (red dashed-style, thinner)
  [5, 6, 7, 8, 9].reduce((a, b) => { line(a, b, '#cc2222', 0.55); return b; });
  // Danger zone left eye
  [12, 13, 14, 15, 16].reduce((a, b) => { line(a, b, '#cc2222', 0.55); return b; });

  el.appendChild(svg);

  // Space nodes with absolute positioning
  FREDDY_HEAD_NODES.forEach(({ x, y }, idx) => {
    const type = tiles[idx] || 'normal';
    const cfg = SPACE_CFG[type] || SPACE_CFG.normal;
    const jackLabel = type === 'jackpot' ? `<span class="space-jack-val">${getJackpotValue({ board: JSON.stringify({ tiles, laps, boardSize: 20, mapType: 'freddy', toll }) })}</span>` : '';
    const sp = document.createElement('div');
    sp.className = `board-space board-node ${cfg.cls}${idx === 0 ? ' space-start' : ''}`;
    sp.dataset.node = String(idx);
    sp.style.cssText = `position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);width:11%;aspect-ratio:1;z-index:2;`;
    sp.innerHTML = `
      <span class="space-num">${idx === 0 ? '🏁' : idx}</span>
      ${cfg.emoji ? `<span class="space-emoji">${cfg.emoji}</span>` : ''}${jackLabel}
      <div class="space-tokens" id="tok-${idx}"></div>`;
    el.appendChild(sp);
  });

  // Center label (nose area)
  const lbl = document.createElement('div');
  lbl.style.cssText = 'position:absolute;left:50%;top:67%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;z-index:1;';
  lbl.innerHTML = `<div style="font-family:Creepster,cursive;font-size:1.1rem;color:#c48b14;opacity:.45;letter-spacing:2px">FREDDY</div>
    <div style="font-size:.55rem;color:#8b5a00;opacity:.5">${laps} laps · Toll: ${toll}${COIN_IMG}</div>`;
  el.appendChild(lbl);
}

function renderCustomBoard(el, tiles, laps, toll, nodes, skipMap, freeMap, boardAspect) {
  el.style.gridTemplateColumns = 'none';
  el.style.gridTemplateRows = 'none';
  el.style.position = 'relative';

  const [aw, ah] = (boardAspect || '1:1').split(':').map(Number);
  const maxPx = nodes.length > 45 ? 960 : nodes.length > 35 ? 840 : nodes.length > 25 ? 640 : 480;
  const base = `min(${maxPx}px, 100%)`;
  el.style.width = base;
  el.style.paddingBottom = ah === aw ? base : `calc(${base} * ${ah / aw})`;
  el.style.height = '0';

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';

  function svgEl(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
  }

  // Auto-normalize coordinates: spread nodes to fill 5-95% of the canvas
  const PAD = 5;
  const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(...ys), yMax = Math.max(...ys);
  const xSpan = (xMax - xMin) || 1, ySpan = (yMax - yMin) || 1;
  const nx = x => +(PAD + (x - xMin) / xSpan * (100 - 2 * PAD)).toFixed(2);
  const ny = y => +(PAD + (y - yMin) / ySpan * (100 - 2 * PAD)).toFixed(2);

  // Sequential path lines
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i], b = nodes[(i + 1) % nodes.length];
    svg.appendChild(svgEl('line', { x1: nx(a.x), y1: ny(a.y), x2: nx(b.x), y2: ny(b.y), stroke: '#5a4a3a', 'stroke-width': '0.9', opacity: '0.5' }));
  }

  // Tollbooth split-path arrows
  tiles.forEach((type, i) => {
    if (type !== 'tollbooth') return;
    const n = nodes[i];
    if (!n) return;
    const payIdx = skipMap?.[i];
    const freeIdx = freeMap?.[i];
    if (payIdx !== undefined && nodes[payIdx]) {
      const d = nodes[payIdx];
      svg.appendChild(svgEl('line', { x1: nx(n.x), y1: ny(n.y), x2: nx(d.x), y2: ny(d.y), stroke: '#c48b14', 'stroke-width': '1.3', 'stroke-dasharray': '3,2', opacity: '0.75' }));
    }
    if (freeIdx !== undefined && nodes[freeIdx]) {
      const d = nodes[freeIdx];
      svg.appendChild(svgEl('line', { x1: nx(n.x), y1: ny(n.y), x2: nx(d.x), y2: ny(d.y), stroke: '#cc3322', 'stroke-width': '1.3', 'stroke-dasharray': '3,2', opacity: '0.7' }));
    }
  });

  el.appendChild(svg);

  const nodeW = nodes.length > 45 ? 4.5 : nodes.length > 35 ? 4 : nodes.length > 25 ? 5.5 : 8;

  // Space nodes
  nodes.forEach(({ x, y }, idx) => {
    const type = tiles[idx] || 'normal';
    const cfg = SPACE_CFG[type] || SPACE_CFG.normal;
    const jackLabel = type === 'jackpot' ? `<span class="space-jack-val">${getJackpotValue({ board: JSON.stringify({ tiles, laps, boardSize: nodes.length, mapType: 'custom', toll }) })}</span>` : '';
    const sp = document.createElement('div');
    sp.className = `board-space board-node ${cfg.cls}${idx === 0 ? ' space-start' : ''}`;
    sp.dataset.node = String(idx);
    sp.style.cssText = `position:absolute;left:${nx(x)}%;top:${ny(y)}%;transform:translate(-50%,-50%);width:${nodeW}%;aspect-ratio:1;z-index:2;`;
    sp.innerHTML = `
      <span class="space-num">${idx === 0 ? '🏁' : idx}</span>
      ${cfg.emoji ? `<span class="space-emoji">${cfg.emoji}</span>` : ''}${jackLabel}
      <div class="space-tokens" id="tok-${idx}"></div>`;
    el.appendChild(sp);
  });

  const lbl = document.createElement('div');
  lbl.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;z-index:1;';
  lbl.innerHTML = `<div style="font-family:Creepster,cursive;font-size:1.1rem;color:#c48b14;opacity:.3;letter-spacing:2px">PARTY</div>
    <div style="font-size:.55rem;color:#8b5a00;opacity:.4">${laps} laps · Toll: ${toll}${COIN_IMG}</div>`;
  el.appendChild(lbl);
}

// Spread offsets (px) per token count - scaled by JS for node vs grid boards
const TOKEN_OFFSET_PATTERNS = [
  [[0, 0]],
  [[-1, 0], [1, 0]],
  [[0, -1.1], [-1, 0.7], [1, 0.7]],
  [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  [[0, -1.2], [-1.1, -0.4], [1.1, -0.4], [-0.7, 1], [0.7, 1]],
  [[-1, -1], [1, -1], [-1.4, 0], [1.4, 0], [-1, 1], [1, 1]],
];

function updateTokens(room) {
  if (isHopping) return;
  const { boardSize, nodes } = parseBoard(room);
  // Node boards use compact 16px tokens; grid boards use 24px - scale offsets accordingly
  const spread = nodes && nodes.length > 0 ? 10 : 14;

  for (let i = 0; i < boardSize; i++) {
    const el = document.getElementById(`tok-${i}`);
    if (el) el.innerHTML = '';
  }
  const pc = room.player_count || 2;
  const newPos = JSON.parse(room.player_pos || '{}');

  // Group active players by their board position
  const byPos = {};
  allSlots(pc).forEach((slot, slotIdx) => {
    if (!room[`${slot}_name`]) return;
    const pos = boardPos(room, slot);
    if (!byPos[pos]) byPos[pos] = [];
    byPos[pos].push({ slot, slotIdx });
  });

  Object.entries(byPos).forEach(([posStr, players]) => {
    const el = document.getElementById(`tok-${posStr}`);
    if (!el) return;
    const count = players.length;
    const pattern = TOKEN_OFFSET_PATTERNS[Math.min(count, 6) - 1];

    players.forEach(({ slot, slotIdx }, tokIdx) => {
      const char = room[`${slot}_char`] || 'freddy';
      const moved = prevPlayerPos[slot] !== undefined && prevPlayerPos[slot] !== (newPos[slot] || 0);
      const tok = document.createElement('div');
      tok.className = `player-token${moved ? ' token-moved' : ''}`;
      tok.style.borderColor = PLAYER_COLORS[slotIdx];
      tok.title = room[`${slot}_name`];
      if (count > 1) {
        const [px, py] = pattern[tokIdx];
        tok.style.transform = `translate(calc(-50% + ${px * spread}px), calc(-50% + ${py * spread}px))`;
      }
      const img = document.createElement('img');
      img.src = charImg(char);
      img.onerror = () => { tok.textContent = room[`${slot}_name`][0]; };
      tok.appendChild(img);
      el.appendChild(tok);
    });
  });

  prevPlayerPos = JSON.parse(room.player_pos || '{}');

  // Springlock & cupcake overlays
  const ns_tok = pStats(room);
  (ns_tok._springlocks_ || []).forEach(sl => {
    const el = document.getElementById(`tok-${sl.spaceIdx}`);
    if (!el) return;
    const ov = document.createElement('span');
    ov.title = `🔒 Springlock (${room[`${sl.ownerSlot}_name`]})`;
    ov.style.cssText = 'position:absolute;top:-4px;right:-4px;font-size:.55rem;z-index:5;pointer-events:none;';
    ov.textContent = '🔒';
    el.style.position = 'relative';
    el.appendChild(ov);
  });
  (ns_tok._cupcakes_ || []).forEach(c => {
    const el = document.getElementById(`tok-${c.spaceIdx}`);
    if (!el) return;
    const ov = document.createElement('span');
    ov.title = `🧁 Cupcake (${room[`${c.ownerSlot}_name`]})`;
    ov.style.cssText = 'position:absolute;top:-4px;left:-4px;font-size:.55rem;z-index:5;pointer-events:none;';
    ov.textContent = '🧁';
    el.style.position = 'relative';
    el.appendChild(ov);
  });
}

async function animateHops(slot, char, fromNode, steps, boardSize, tiles, nextMap) {
  const HOP_MS = 140;

  // Hide real token(s) at the start cell immediately so they don't show during animation
  const startEl = document.getElementById(`tok-${fromNode}`);
  if (startEl) {
    startEl.querySelectorAll('.player-token:not(.token-hopping)').forEach(t => {
      t.style.visibility = 'hidden';
    });
  }

  let node = fromNode;
  let prevHopEl = null;
  for (let i = 0; i < steps; i++) {
    const nxt = (nextMap && nextMap[node] !== undefined) ? nextMap[node] : (node + 1) % boardSize;
    if (prevHopEl) prevHopEl.remove();

    const el = document.getElementById(`tok-${nxt}`);
    if (el) {
      const tok = document.createElement('div');
      tok.className = 'player-token token-hopping';
      tok.style.borderColor = PLAYER_COLORS[slotNum(slot) - 1];
      const img = document.createElement('img');
      img.src = charImg(char);
      tok.appendChild(img);
      el.appendChild(tok);
      prevHopEl = tok;
    }

    await new Promise(r => setTimeout(r, HOP_MS));
    node = nxt;
    if (i < steps - 1 && tiles[node] === 'tollbooth') break;
  }
  // Leave final ghost at landing cell - updateTokens clears it when isHopping goes false
  // NOTE: caller owns isHopping - must set false AFTER its DB write
}

function renderStatusBar(room) {
  const bar = document.getElementById('player-status-bar');
  if (bar) bar.innerHTML = '';
  renderPlayerSlots(room);
}

function renderPlayerSlots(room) {
  const panel = document.getElementById('ps-slots-area');
  if (!panel) return;
  const pc = room.player_count || 2;
  const { laps: boardLaps, boardSize } = parseBoard(room);

  panel.innerHTML = allSlots(pc).map((slot, i) => {
    const name = room[`${slot}_name`];
    if (!name) {
      return `<div class="player-slot ps-empty">
        <div class="ps-empty-label">${T('slot.waiting')}</div>
      </div>`;
    }
    const char = room[`${slot}_char`] || 'freddy';
    const c = CHAR_CFG[char] || {};
    const isCur = room.current_slot === slot && room.turn_phase !== 'minigame';
    const laps = playerLaps(room, slot);
    const coins = playerCoins(room, slot);
    const pizzas = playerPizzas(room, slot);
    const cd = pState(room).cooldowns[slot] || 0;
    const color = PLAYER_COLORS[i];
    const lapDisp = `${Math.min(laps + 1, boardLaps)}/${boardLaps}`;
    return `<div class="player-slot ps-occupied${isCur ? ' ps-current' : ''}">
      <div class="ps-header">
        <img class="ps-avatar" src="${charImg(char)}" alt="${char}" onerror="this.style.display='none'"/>
        <span class="ps-name" title="${name}">${name}</span>
      </div>
      <div class="ps-stats">
        <span>${COIN_IMG}${coins}</span>
        <span>🍕${pizzas}</span>
        <span>🔄${lapDisp}</span>
      </div>
      ${c.ability ? `<div class="ps-cd">${cd > 0 ? T('slot.cooldown', { n: cd }) : T('slot.ready')}</div>` : ''}
    </div>`;
  }).join('');
}

// ── Action UI ─────────────────────────────────────────────────────────────────
function renderActionUI(room) {
  const el = document.getElementById('current-player-action');
  if (!el) return;

  if (!isMyTurn(room)) {
    const curName = room[`${room.current_slot}_name`] || '?';
    const curColor = PLAYER_COLORS[slotNum(room.current_slot) - 1];
    const extra = room.turn_phase === 'rolled'
      ? ` - rolled <strong>🎲 ${room.dice_result}</strong>` : '';
    el.innerHTML = `<div class="action-card">
      <div class="action-waiting"><strong style="color:${curColor}">${room.turn_phase === 'rolled' ? T('action.otherRolled', { name: curName, n: room.dice_result }) : T('action.otherTurn', { name: curName })}</strong></div>
    </div>`;
    showDiceShop(room);
    return;
  }

  const me = myPlayer(room);
  const c = CHAR_CFG[me.char];
  const pos = boardPos(room, me.slot);
  const { laps: boardLaps, boardSize } = parseBoard(room);

  if (room.turn_phase === 'roll') {
    const diceId = getPlayerDice(room, playerSlot);
    const diceObj = DICE_TYPES[diceId] || DICE_TYPES.d6;
    const dblTag = isDoublePhase(room) ? ' <span style="color:#f9c;font-size:.7rem">2×</span>' : '';
    const psn = pStats(room)[playerSlot] || {};
    const forcedTag = (psn.forcedDice && (psn.forcedTurns || 0) > 0)
      ? `<div style="font-size:.65rem;color:#f66;margin:1px 0">${T('action.forcedTag', { n: psn.forcedTurns })}</div>` : '';
    el.innerHTML = `<div class="action-card">
      <div class="action-player-name" style="color:${me.color}">
        <img src="${charImg(me.char)}" style="width:22px;height:22px;border-radius:50%;object-fit:contain;vertical-align:middle;margin-right:5px" onerror="this.style.display='none'"/>
        ${me.name}
      </div>
      <div class="action-pos">${T('action.space', { n: pos })} · ${T('action.lap', { cur: Math.min(Math.floor(me.pos / boardSize) + 1, boardLaps), total: boardLaps })} · ${COIN_IMG}${me.coins} 🍕${me.pizzas}${dblTag}</div>
      <div style="font-size:.7rem;color:var(--text-muted);margin:1px 0">${diceObj.emoji} ${T('dname.' + diceId)}</div>
      ${forcedTag}
    </div>`;

  } else if (room.turn_phase === 'rolled') {
    const lastDice = pStats(room)[playerSlot]?.lastDiceId || getPlayerDice(room, playerSlot);
    const isSpringlock = lastDice === 'springlock' && room.dice_result === 0;
    const diceDisplay = isSpringlock ? T('action.springlockRolled') : `🎲 ${room.dice_result}`;
    el.innerHTML = `<div class="action-card">
      <div class="action-player-name" style="color:${me.color}">${me.name}</div>
      <div class="action-dice">${diceDisplay}</div>
      ${isSpringlock ? `<div style="font-size:.7rem;color:#f66;margin:2px 0">${T('action.springlockMsg')}</div>` : ''}
    </div>`;

  } else if (room.turn_phase === 'moved') {
    const { tiles: bt } = parseBoard(room);
    const spType = bt[pos] || 'normal';
    const cfg = SPACE_CFG[spType] || SPACE_CFG.normal;
    const jackInfo = spType === 'jackpot' ? ` (${getJackpotValue(room)}${COIN_IMG})` : '';
    el.innerHTML = `<div class="action-card">
      <div class="action-player-name" style="color:${me.color}">${me.name}</div>
      <div class="action-dice">🎲 ${room.dice_result}</div>
      <div class="action-space">${T('action.landed')} <span class="mp_emoji">${cfg.emoji || '⬜'}</span> <strong>${T('space.' + spType)}</strong>${jackInfo}</div>
    </div>`;
  }
  showDiceShop(room);
}

// ── Roll dice ─────────────────────────────────────────────────────────────────
async function doRoll() {
  const diceId = getPlayerDice(roomData, playerSlot);
  const dice = DICE_TYPES[diceId] || DICE_TYPES.d6;
  const roll = dice.roll();
  const ns = pStats(roomData);
  if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };

  const shopD = SHOP_DICE.find(d => d.id === diceId);
  if (shopD?.maxUses) {
    if (!ns[playerSlot].diceUses) ns[playerSlot].diceUses = {};
    const newUses = Math.max(0, (ns[playerSlot].diceUses[diceId] ?? shopD.maxUses) - 1);
    ns[playerSlot].diceUses[diceId] = newUses;

    // Count down forced turns (all1)
    if (ns[playerSlot].forcedDice === diceId) {
      const left = Math.max(0, (ns[playerSlot].forcedTurns || 0) - 1);
      ns[playerSlot].forcedTurns = left;
      if (left === 0) { ns[playerSlot].forcedDice = null; ns[playerSlot].forcedTurns = 0; }
    }

    // Auto-remove when uses run out
    if (newUses === 0) {
      ns[playerSlot].ownedDice = getOwnedDice(roomData, playerSlot).filter(id => id !== diceId);
      ns[playerSlot].dice = 'd6';
      showToast(T('dice.expired', { name: T('dname.' + shopD.id) }));
      emitEvent(`🎲 ${roomData[`${playerSlot}_name`]}'s ${shopD.label} expired!`);
    }
  }

  ns[playerSlot].lastDiceId = diceId;
  const rollLabel = (diceId === 'springlock' && roll === 0) ? '🪤 SPRINGLOCK!' : String(roll);
  emitEvent(`🎲 ${roomData[`${playerSlot}_name`]} rolled ${rollLabel} (${dice.label})`);

  // BB passive: "Hi!" - only triggers when using the Balloon Die
  // Randomly either steals 1 coin OR pushes the target back 1 space
  const bbExtra = {};
  if (dice.bbPassive && (roomData[`${playerSlot}_char`] || 'freddy') === 'bb') {
    const pc = roomData.player_count || 2;
    const opp = allSlots(pc).filter(s => s !== playerSlot && roomData[`${s}_name`]);
    if (opp.length) {
      const target = opp[Math.floor(Math.random() * opp.length)];
      const st = pState(roomData);
      if (Math.random() < 0.5) {
        st.coins[target] = Math.max(0, (st.coins[target] || 0) - 1);
        st.coins[playerSlot] = (st.coins[playerSlot] || 0) + 1;
        bbExtra.player_coins = JSON.stringify(st.coins);
        emitEvent(`🎈 Hi! BB annoyed ${roomData[`${target}_name`]}! -1🪙`);
      } else {
        st.pos[target] = Math.max(0, (st.pos[target] || 0) - 1);
        bbExtra.player_pos = JSON.stringify(st.pos);
        emitEvent(`🎈 Hi! BB annoyed ${roomData[`${target}_name`]}! -1 space ⬅️`);
      }
    }
  }

  await db.from('party_rooms').update({
    turn_phase: 'rolled', dice_result: roll, player_stats: JSON.stringify(ns), ...bbExtra,
  }).eq('id', roomId);
}

function showPickDiceUI() {
  const me = myPlayer(roomData);
  const el = document.getElementById('current-player-action');
  if (!el) return;
  el.innerHTML = `<div class="action-card">
    <div class="action-player-name" style="color:${me.color}">${T('action.pickPrompt')}</div>
    <div class="pick-dice-grid">
      ${[1, 2, 3, 4, 5, 6].map(n => `<button class="mp-btn pick-num-btn" data-n="${n}">${n}</button>`).join('')}
    </div>
  </div>`;
  el.querySelectorAll('.pick-num-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      el.querySelectorAll('.pick-num-btn').forEach(b => b.disabled = true);
      const ns = pStats(roomData);
      if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };
      const shopD = SHOP_DICE.find(d => d.id === 'pick');
      if (!ns[playerSlot].diceUses) ns[playerSlot].diceUses = {};
      const newUses = Math.max(0, (ns[playerSlot].diceUses['pick'] ?? shopD.maxUses) - 1);
      ns[playerSlot].diceUses['pick'] = newUses;
      ns[playerSlot].lastDiceId = 'pick';
      if (newUses === 0) {
        ns[playerSlot].ownedDice = getOwnedDice(roomData, playerSlot).filter(id => id !== 'pick');
        ns[playerSlot].dice = 'd6';
        showToast(T('dice.expired', { name: T('dname.pick') }));
      }
      await db.from('party_rooms').update({
        turn_phase: 'rolled', dice_result: +btn.dataset.n,
        player_stats: JSON.stringify(ns),
      }).eq('id', roomId);
    }, { once: true });
  });
}

// Step-by-step movement - stops early if a tollbooth is hit mid-roll.
function moveStepByStep(state, slot, steps, boardSize, tiles, nextMap) {
  let node = (state.pos[slot] || 0) % boardSize;
  let laps = Math.floor((state.pos[slot] || 0) / boardSize);
  const startLaps = laps;
  for (let i = 0; i < steps; i++) {
    const nxt = (nextMap && nextMap[node] !== undefined) ? nextMap[node] : (node + 1) % boardSize;
    node = nxt;
    if (node === 0) laps++;
    // Stop if passing THROUGH a tollbooth (not the final step)
    if (tiles[node] === 'tollbooth' && i < steps - 1) {
      state.pos[slot] = laps * boardSize + node;
      return { hitTollbooth: true, remainingSteps: steps - i - 1, completedLap: laps > startLaps };
    }
  }
  state.pos[slot] = laps * boardSize + node;
  return { hitTollbooth: false, remainingSteps: 0, completedLap: laps > startLaps };
}

// Apply movement (called after confirming dice in 'rolled' phase)
async function applyMove() {
  const room = roomData;
  const roll = pendingRoll ?? room.dice_result;
  pendingRoll = null;
  const st = pState(room);
  const { laps, boardSize, tiles, nextMap, endOfRoundMinigame } = parseBoard(room);
  if ((st.cooldowns[playerSlot] || 0) > 0) st.cooldowns[playerSlot]--;

  const ns = pStats(room);
  if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };

  const lastDiceId = ns[playerSlot].lastDiceId || getPlayerDice(room, playerSlot);

  // Springlock: no movement, go back to start (reset laps/position, keep coins/pizzas)
  if (lastDiceId === 'springlock' && roll === 0) {
    st.pos[playerSlot] = 0;
    emitEvent(`🪤 ${room[`${playerSlot}_name`]}'s Springlock triggered! Back to start!`);
    showToast(T('toast.springlock'));
    await db.from('party_rooms').update({
      player_pos: JSON.stringify(st.pos), player_cooldowns: JSON.stringify(st.cooldowns),
      player_stats: JSON.stringify(ns), turn_phase: 'moved',
    }).eq('id', roomId);
    return;
  }

  const fromNodeIdx = (st.pos[playerSlot] || 0) % boardSize;
  const result = moveStepByStep(st, playerSlot, roll, boardSize, tiles, nextMap);
  if (result.completedLap) { ns[playerSlot].lapCompleted = true; lapCompletedLocal = true; }

  const stepsActual = result.hitTollbooth ? (roll - result.remainingSteps) : roll;
  isHopping = true;
  try {
    await animateHops(playerSlot, room[`${playerSlot}_char`] || 'freddy', fromNodeIdx, stepsActual, boardSize, tiles, nextMap || {});

    // Music Box: on roll 6 with musicbox die, place a trap on the landing space
    if (lastDiceId === 'musicbox' && roll === 6 && !result.hitTollbooth) {
      const landingNode = st.pos[playerSlot] % boardSize;
      if (!ns._musicBoxes) ns._musicBoxes = [];
      ns._musicBoxes = ns._musicBoxes.filter(mb => mb.ownerSlot !== playerSlot);
      ns._musicBoxes.push({ spaceIdx: landingNode, ownerSlot: playerSlot });
      emitEvent(`🎵 ${room[`${playerSlot}_name`]} placed a Music Box on space ${landingNode}!`);
      showToast(T('toast.musicBox'));
    }

    if (result.hitTollbooth) {
      ns[playerSlot].pendingSteps = result.remainingSteps;
      emitEvent(`🐻 ${room[`${playerSlot}_name`]} hit Freddy's Tollbooth! (${result.remainingSteps} steps left)`);
      await db.from('party_rooms').update({
        player_pos: JSON.stringify(st.pos), player_coins: JSON.stringify(st.coins),
        player_pizzas: JSON.stringify(st.pizzas), player_cooldowns: JSON.stringify(st.cooldowns),
        player_stats: JSON.stringify(ns), turn_phase: 'tollbooth',
      }).eq('id', roomId);
      return;
    }

    const finished = Math.floor(st.pos[playerSlot] / boardSize) >= laps;
    await db.from('party_rooms').update({
      player_pos: JSON.stringify(st.pos),
      player_coins: JSON.stringify(st.coins),
      player_pizzas: JSON.stringify(st.pizzas),
      player_cooldowns: JSON.stringify(st.cooldowns),
      player_stats: JSON.stringify(ns),
      turn_phase: finished ? undefined : 'moved',
      ...(finished ? { state: 'finished' } : {}),
    }).eq('id', roomId);
  } finally {
    isHopping = false;
  }
}

async function doFoxyReroll() {
  const diceId = getPlayerDice(roomData, playerSlot);
  const dice = DICE_TYPES[diceId] || DICE_TYPES.d6;
  const roll = dice.roll ? dice.roll() : Math.floor(Math.random() * 6) + 1;
  pendingRoll = roll;
  const st = pState(roomData);
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
  showToast(T('toast.rerolled'));
}

// Returns true if slotB is within 5 board steps (either direction) of slotA
function inRange5(room, slotA, slotB) {
  const { boardSize } = parseBoard(room);
  const a = boardPos(room, slotA) % boardSize;
  const b = boardPos(room, slotB) % boardSize;
  const fwd = (b - a + boardSize) % boardSize;
  const bwd = (a - b + boardSize) % boardSize;
  return Math.min(fwd, bwd) <= 5;
}

// ── Space effect ──────────────────────────────────────────────────────────────
// Passes turn to next player, or fires end-of-lap minigame first if flag is set.
// extraUpdates: any DB fields to include in the turn-pass update.
// If extraUpdates contains player_stats, that value is used for the flag check.
async function passOrMinigame(room, extraUpdates = {}) {
  const ns = extraUpdates.player_stats
    ? JSON.parse(extraUpdates.player_stats)
    : pStats(room);

  // Expire springlocks: decrement turnsLeft, remove expired ones
  if (ns._springlocks_?.length) {
    const before = ns._springlocks_.length;
    ns._springlocks_ = ns._springlocks_.filter(sl => {
      sl.turnsLeft = (sl.turnsLeft ?? 1) - 1;
      return sl.turnsLeft > 0;
    });
    if (ns._springlocks_.length < before)
      emitEvent(`🔒 A Springlock trap expired!`);
    extraUpdates = { ...extraUpdates, player_stats: JSON.stringify(ns) };
  }

  // Expire cupcakes: disappear when owner completes 1 full lap from placement
  if (ns._cupcakes_?.length) {
    const before = ns._cupcakes_.length;
    ns._cupcakes_ = ns._cupcakes_.filter(c => playerLaps(room, c.ownerSlot) <= c.lapAtPlacement);
    if (ns._cupcakes_.length < before)
      emitEvent(`🧁 A Cupcake trap expired!`);
    extraUpdates = { ...extraUpdates, player_stats: JSON.stringify(ns) };
  }

  if (ns[playerSlot]?.lapCompleted) {
    // Clear Freddy Mask on lap completion
    if (ns[playerSlot]?.maskActive) ns[playerSlot].maskActive = false;
    // DON'T clear microphoneActive here - finishMinigame will clear it after applying the reward
    if (ns[playerSlot]) ns[playerSlot].lapCompleted = false;
    const allPlayers = allSlots(room.player_count || 2).filter(s => room[`${s}_name`]);
    await db.from('party_rooms').update({
      ...extraUpdates,
      player_stats: JSON.stringify(ns),
    }).eq('id', roomId);
    await triggerMinigame(allPlayers, { nextPlayer: nextSlot(room) });
  } else if (ns[playerSlot]?.extraTurn) {
    ns[playerSlot].extraTurn = false;
    // Clear microphone: turn ends without entering a minigame
    if (ns[playerSlot]?.microphoneActive) ns[playerSlot].microphoneActive = false;
    emitEvent(`🔋 ${room[`${playerSlot}_name`]} activated the Battery - extra turn!`);
    await db.from('party_rooms').update({
      turn_phase: 'roll', current_slot: playerSlot,
      ...extraUpdates,
      player_stats: JSON.stringify(ns),
    }).eq('id', roomId);
  } else {
    // Clear microphone: normal turn end
    if (ns[playerSlot]?.microphoneActive) {
      ns[playerSlot].microphoneActive = false;
      extraUpdates = { ...extraUpdates, player_stats: JSON.stringify(ns) };
    }
    await db.from('party_rooms').update({
      turn_phase: 'roll', current_slot: nextSlot(room),
      ...extraUpdates,
    }).eq('id', roomId);
  }
}
// After a space effect, either trigger a same-space collision minigame (if others share
// the space) or hand off to passOrMinigame. Lap-completion minigame takes priority
// because it already involves all players, making the collision a subset.
async function resolveSpace(room, updates, others) {
  const ns = updates.player_stats ? JSON.parse(updates.player_stats) : pStats(room);
  if (!ns[playerSlot]?.lapCompleted && others.length > 0) {
    if (Object.keys(updates).length > 0) {
      await db.from('party_rooms').update(updates).eq('id', roomId);
    }
    const involved = [playerSlot, ...others];
    emitEvent(`💥 ${involved.map(s => room[`${s}_name`]).join(' & ')} on the same space! Minigame!`);
    await triggerMinigame(involved);
  } else {
    await passOrMinigame(room, updates);
  }
}

async function handleSpace() {
  // Guard: re-read DB to confirm we're still in 'moved' phase for our slot.
  // A stale delayed Supabase event can re-show the Continue button after the
  // phase already advanced to mg_waiting, causing the minigame to be skipped.
  try {
    const { data: guard } = await db.from('party_rooms')
      .select('turn_phase,current_slot').eq('id', roomId).single();
    if (!guard || guard.turn_phase !== 'moved' || guard.current_slot !== playerSlot) return;
  } catch { return; }

  const room = roomData;
  const { tiles, laps, boardSize: bs } = parseBoard(room);
  const pos = boardPos(room, playerSlot);
  const type = tiles[pos] || 'normal';
  const pc = room.player_count || 2;
  const others = allSlots(pc).filter(s =>
    s !== playerSlot && room[`${s}_name`] && boardPos(room, s) === pos);

  const st = pState(room);
  const ns = pStats(room);
  // Restore lap-completion flag from local backup in case Supabase was stale
  if (lapCompletedLocal) {
    if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };
    ns[playerSlot].lapCompleted = true;
    lapCompletedLocal = false;
  }
  const mul = isDoublePhase(room) ? 2 : 1;

  // Music Box trap: if an opponent placed a box on this node
  const currentNode = pos % bs;
  const masked = !!(ns[playerSlot]?.maskActive);
  const mbIdx = (ns._musicBoxes || []).findIndex(mb => mb.spaceIdx === currentNode && mb.ownerSlot !== playerSlot && room[`${mb.ownerSlot}_name`]);
  if (mbIdx !== -1) {
    const mb = ns._musicBoxes[mbIdx];
    ns._musicBoxes.splice(mbIdx, 1);
    if (masked) {
      emitEvent(`🎵 ${room[`${playerSlot}_name`]} triggered Puppet's Music Box - 🎭 Mask blocked it!`);
      showToast('🎭 Mask blocked Music Box!');
    } else {
      st.coins[playerSlot] = (st.coins[playerSlot] || 0) - 5; // can go negative
      st.coins[mb.ownerSlot] = (st.coins[mb.ownerSlot] || 0) + 5;
      emitEvent(`🎵 ${room[`${playerSlot}_name`]} triggered Puppet's Music Box! -5🪙 → ${room[`${mb.ownerSlot}_name`]}`);
      showToast(T('toast.musicBoxTrap'));
    }
  }

  // Board cupcake trap (Chica ability)
  const cupIdx = (ns._cupcakes_ || []).findIndex(c => c.spaceIdx === currentNode && c.ownerSlot !== playerSlot && room[`${c.ownerSlot}_name`]);
  if (cupIdx !== -1) {
    const cup = ns._cupcakes_[cupIdx];
    ns._cupcakes_.splice(cupIdx, 1);
    if (masked) {
      emitEvent(`🧁 ${room[`${playerSlot}_name`]} landed on Chica's Cupcake - 🎭 Mask blocked it!`);
      showToast('🎭 Mask blocked Cupcake!');
    } else {
      st.pizzas[playerSlot] = (st.pizzas[playerSlot] || 0) - 1; // can go negative
      st.pizzas[cup.ownerSlot] = (st.pizzas[cup.ownerSlot] || 0) + 1;
      emitEvent(`🧁 ${room[`${playerSlot}_name`]} ate Chica's Cupcake! -1🍕 → ${room[`${cup.ownerSlot}_name`]}`);
      showToast('🧁 Cupcake! -1🍕');
    }
  }

  // Springlock trap: if any player placed a springlock on this node
  const slIdx = (ns._springlocks_ || []).findIndex(sl => sl.spaceIdx === currentNode && sl.ownerSlot !== playerSlot && room[`${sl.ownerSlot}_name`]);
  if (slIdx !== -1) {
    const sl = ns._springlocks_[slIdx];
    ns._springlocks_.splice(slIdx, 1);
    if (masked) {
      emitEvent(`🔒 ${room[`${playerSlot}_name`]} triggered a Springlock - 🎭 Mask blocked it!`);
      showToast('🎭 Mask blocked Springlock!');
    } else {
      st.coins[playerSlot] = (st.coins[playerSlot] || 0) - 5; // can go negative
      st.coins[sl.ownerSlot] = (st.coins[sl.ownerSlot] || 0) + 5;
      emitEvent(`🔒 ${room[`${playerSlot}_name`]} triggered ${room[`${sl.ownerSlot}_name`]}'s Springlock! -5🪙 → ${room[`${sl.ownerSlot}_name`]}`);
      showToast('🔒 Springlock! -5🪙');
    }
  }

  if (type === 'coin') {
    const gain = micMultiplied(ns, playerSlot, 2 * mul);
    st.coins[playerSlot] = (st.coins[playerSlot] || 0) + gain;
    const micTag = ns[playerSlot]?.microphoneActive ? ' 🎤×2' : '';
    emitEvent(`🪙 ${room[`${playerSlot}_name`]} got ${gain} coins!${micTag}`);
    showToast(`+${gain} coins! 🪙${micTag}`);
    await resolveSpace(room, { player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) }, others);
    return;
  }
  if (type === 'jackpot') {
    const jackVal = micMultiplied(ns, playerSlot, getJackpotValue(room) * mul);
    st.coins[playerSlot] = (st.coins[playerSlot] || 0) + jackVal;
    const micTag = ns[playerSlot]?.microphoneActive ? ' 🎤×2' : '';
    emitEvent(`💰 ${room[`${playerSlot}_name`]} hit the JACKPOT for ${jackVal} coins!${micTag}`);
    showToast(`💰 JACKPOT! +${jackVal} coins!${micTag}`);
    await resolveSpace(room, { player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) }, others);
    return;
  }
  if (type === 'badluck') {
    if (masked) {
      emitEvent(`💀 ${room[`${playerSlot}_name`]} hit Bad Luck - 🎭 Mask blocked it!`);
      showToast('🎭 Mask blocked Bad Luck!');
      await resolveSpace(room, { player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) }, others);
      return;
    }
    const loss = micMultiplied(ns, playerSlot, -(3 * mul));
    st.coins[playerSlot] = Math.max(0, (st.coins[playerSlot] || 0) + loss); // loss is negative
    if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };
    ns[playerSlot].badLucks = (ns[playerSlot].badLucks || 0) + 1;
    const micTag = ns[playerSlot]?.microphoneActive ? ' 🎤×4' : '';
    emitEvent(`💀 ${room[`${playerSlot}_name`]} hit bad luck! ${loss} coins${micTag}`);
    showToast(`${loss} coins 💀${mul > 1 ? ' ×2' : ''}${micTag}`);
    await resolveSpace(room, { player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) }, others);
    return;
  }
  if (type === 'pizza') {
    const coins = st.coins[playerSlot] || 0;
    if (coins < 10) {
      emitEvent(`🍕 ${room[`${playerSlot}_name`]} landed on Pizza but needs 10🪙 (${coins}/10)`);
      showToast(T('pizza.need10'));
      await passOrMinigame(room, { player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) });
      return;
    }
    // Save music box state now (before player makes a choice)
    if (mbIdx !== -1) await db.from('party_rooms').update({ player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) }).eq('id', roomId);
    const el = document.getElementById('current-player-action');
    if (el) el.innerHTML = `<div class="action-card">
      <div class="action-player-name" style="color:${PLAYER_COLORS[slotNum(playerSlot) - 1]}">${T('pizza.shopTitle')}</div>
      <div class="action-space">${T('pizza.buyPrompt', { coins })}</div>
      <div class="action-btns">
        <button class="mp-btn primary" id="pizza-buy-btn">${T('pizza.buyBtn')}</button>
        <button class="mp-btn" id="pizza-skip-btn">${T('pizza.skipBtn')}</button>
      </div>
    </div>`;
    document.getElementById('pizza-buy-btn').addEventListener('click', () => buyPizza(), { once: true });
    document.getElementById('pizza-skip-btn').addEventListener('click', () => skipPizza(), { once: true });
    return;
  }
  if (type === 'tollbooth') {
    // Save music box state before toll choice UI
    if (mbIdx !== -1) await db.from('party_rooms').update({ player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) }).eq('id', roomId);
    const _tb = parseBoard(room); const _tbToll = (_tb.tollMap[boardPos(room, playerSlot)] !== undefined ? _tb.tollMap[boardPos(room, playerSlot)] : _tb.toll);
    emitEvent(`🐻 ${room[`${playerSlot}_name`]} reached Freddy's Tollbooth! (toll: ${_tbToll}🪙)`);
    await db.from('party_rooms').update({ turn_phase: 'tollbooth' }).eq('id', roomId);
    return;
  }
  if (type === 'freddy_zone') {
    if (masked) {
      emitEvent(`😱 ${room[`${playerSlot}_name`]} entered the Freddy Zone - 🎭 Mask blocked it!`);
      showToast('🎭 Mask blocked Freddy Zone!');
      await resolveSpace(room, { player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) }, others);
      return;
    }
    const effIdx = Math.floor(Math.random() * 2);
    const eff = TRAP_EFFECTS[effIdx];
    eff.eff(st, playerSlot, room, ns);
    const effText = T('trap.' + effIdx);
    emitEvent(`😱 ${room[`${playerSlot}_name`]} entered the Freddy Zone! ${effText}`);
    showToast(`😱 Freddy Zone! ${effText}`);
    await resolveSpace(room, { player_pos: JSON.stringify(st.pos), player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) }, others);
    return;
  }
  if (type === 'trap') {
    if (masked) {
      emitEvent(`🪤 ${room[`${playerSlot}_name`]} hit a Trap - 🎭 Mask blocked it!`);
      showToast('🎭 Mask blocked Trap!');
      await resolveSpace(room, { player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) }, others);
      return;
    }
    const effIdx = Math.floor(Math.random() * TRAP_EFFECTS.length);
    const eff = TRAP_EFFECTS[effIdx];
    eff.eff(st, playerSlot, room, ns);
    const effText = T('trap.' + effIdx);
    emitEvent(`🪤 ${room[`${playerSlot}_name`]} hit a Trap! ${effText}`);
    showToast(`🪤 Trap! ${effText}`);
    await resolveSpace(room, { player_pos: JSON.stringify(st.pos), player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) }, others);
    return;
  }
  if (type === 'challenge') {
    const active = allSlots(pc).filter(s => room[`${s}_name`]);
    if (active.length < 2) {
      await passOrMinigame(room, { player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) });
      return;
    }
    // Save trap effects (cupcake, springlock, musicbox) before entering minigame
    await db.from('party_rooms').update({ player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) }).eq('id', roomId);
    const reward = active.length === 2 ? 5 : active.length === 3 ? 10 : 0;
    emitEvent(`⚔️ ${room[`${playerSlot}_name`]} issued a Challenge! (1v${active.length - 1})`);
    await triggerMinigame(active, { isChallenge: true, challenger: playerSlot, challengeReward: reward, isPizzaReward: active.length >= 4 });
    return;
  }
  if (type === 'minigame') {
    const involved = allSlots(pc).filter(s => room[`${s}_name`]);
    // Save trap effects (cupcake, springlock, musicbox) before entering minigame
    await db.from('party_rooms').update({ player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) }).eq('id', roomId);
    emitEvent(`🎮 Minigame triggered by ${room[`${playerSlot}_name`]}!`);
    await triggerMinigame(involved);
    return;
  }
  if (type === 'question') {
    // Always save trap effects before triggering the event
    await db.from('party_rooms').update({ player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) }).eq('id', roomId);
    emitEvent(`❓ ${room[`${playerSlot}_name`]} landed on Event!`);
    await triggerQuestion();
    return;
  }
  // Normal space (collision handled by resolveSpace)
  emitEvent(`⬜ ${room[`${playerSlot}_name`]} landed on Normal (space ${pos})`);
  await resolveSpace(room, { player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns) }, others);
}

async function triggerQuestion() {
  const evIdx = Math.floor(Math.random() * QUESTION_EVENTS.length);
  const ev = QUESTION_EVENTS[evIdx];
  const st = pState(roomData);
  const ns = pStats(roomData);

  const tempPlayer = { coins: st.coins[playerSlot] || 0, pizzas: st.pizzas[playerSlot] || 0, pos: st.pos[playerSlot] || 0 };
  ev.eff(tempPlayer);
  st.coins[playerSlot] = Math.max(0, tempPlayer.coins);
  st.pizzas[playerSlot] = Math.max(0, tempPlayer.pizzas);
  st.pos[playerSlot] = Math.max(0, tempPlayer.pos);

  const extra = ev.boardShuffle ? { board: JSON.stringify(createBoard(parseBoard(roomData).mapType, parseBoard(roomData).laps)) } : {};

  if (ev.giveItem) {
    const item = ITEM_CFG[Math.floor(Math.random() * ITEM_CFG.length)];
    if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };
    (ns[playerSlot].ownedItems = ns[playerSlot].ownedItems || []).push(item.id);
    emitEvent(`🎁 ${roomData[`${playerSlot}_name`]} got a free ${item.emoji} ${T('item.' + item.id + '.name')}!`);
    showToast(`🎁 Free ${item.emoji} ${T('item.' + item.id + '.name')}!`);
  } else if (ev.fazMix) {
    const active = allSlots(roomData.player_count || 2).filter(s => roomData[`${s}_name`]);
    const pool = [];
    active.forEach(s => { pool.push(st.coins[s] || 0); pool.push(st.pizzas[s] || 0); });
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    let pi = 0;
    active.forEach(s => { st.coins[s] = pool[pi++]; st.pizzas[s] = pool[pi++]; });
    emitEvent(`🎰 Faz-Blender activated! Everyone's coins & pizzas were scrambled!`);
    showToast('🎰 Faz-Blender!');
  } else {
    emitEvent(`❓ ${roomData[`${playerSlot}_name`]} got event: ${T('qevent.' + evIdx + '.text')} → ${T('qevent.' + evIdx + '.desc')}`);
    showToast(T('qevent.' + evIdx + '.text'));
  }

  await passOrMinigame(roomData, {
    player_pos: JSON.stringify(st.pos),
    player_coins: JSON.stringify(st.coins),
    player_pizzas: JSON.stringify(st.pizzas),
    player_stats: JSON.stringify(ns),
    ...extra,
  });
}

// ── Pizza choice ──────────────────────────────────────────────────────────────
async function buyPizza() {
  const room = roomData;
  const { laps, tiles, boardSize, mapType, toll, skipMap, freeMap, nodes, boardAspect, nextMap } = parseBoard(room);
  const pos = boardPos(room, playerSlot);
  const st = pState(room);
  const ns = pStats(room);
  const mul = isDoublePhase(room) ? 2 : 1;

  st.coins[playerSlot] = Math.max(0, (st.coins[playerSlot] || 0) - 10);
  st.pizzas[playerSlot] = (st.pizzas[playerSlot] || 0) + mul;

  const newTiles = [...tiles];
  newTiles[pos] = 'normal';
  const free = newTiles.map((t, i) => i).filter(i => newTiles[i] === 'normal' && i !== 0);
  if (free.length) newTiles[free[Math.floor(Math.random() * free.length)]] = 'pizza';
  const newBoard = { tiles: newTiles, laps, boardSize, mapType, toll, skipMap, freeMap };
  if (nodes) newBoard.nodes = nodes;
  if (boardAspect) newBoard.boardAspect = boardAspect;
  if (nextMap && Object.keys(nextMap).length) newBoard.nextMap = nextMap;

  emitEvent(`🍕 ${room[`${playerSlot}_name`]} bought a pizza! (-10🪙)`);
  showToast(T('pizza.bought'));

  // Resume any pending steps saved when the player was stopped at pizza mid-roll (Jackpot)
  const pendingSteps = ns[playerSlot]?.pendingSteps || 0;
  if (pendingSteps > 0) {
    if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };
    ns[playerSlot].pendingSteps = 0;
    const result = moveStepByStep(st, playerSlot, pendingSteps, boardSize, newTiles, nextMap);
    if (result.completedLap) { ns[playerSlot].lapCompleted = true; lapCompletedLocal = true; }
    let finalPhase = 'roll', finalSlot = nextSlot(room);
    if (result.hitTollbooth) {
      ns[playerSlot].pendingSteps = result.remainingSteps;
      finalPhase = 'tollbooth'; finalSlot = playerSlot;
    } else {
      finalPhase = 'moved'; finalSlot = playerSlot;
    }
    await db.from('party_rooms').update({
      player_pos: JSON.stringify(st.pos), player_coins: JSON.stringify(st.coins),
      player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns),
      board: JSON.stringify(newBoard), turn_phase: finalPhase, current_slot: finalSlot,
    }).eq('id', roomId);
  } else {
    await passOrMinigame(room, {
      player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas),
      board: JSON.stringify(newBoard), player_stats: JSON.stringify(ns),
    });
  }
}

async function skipPizza() {
  const room = roomData;
  const { tiles, boardSize, nextMap } = parseBoard(room);
  const st = pState(room);
  const ns = pStats(room);
  showToast(T('pizza.skipped'));

  // Resume any pending steps saved when the player was stopped at pizza mid-roll (Jackpot)
  const pendingSteps = ns[playerSlot]?.pendingSteps || 0;
  if (pendingSteps > 0) {
    if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };
    ns[playerSlot].pendingSteps = 0;
    const result = moveStepByStep(st, playerSlot, pendingSteps, boardSize, tiles, nextMap);
    if (result.completedLap) { ns[playerSlot].lapCompleted = true; lapCompletedLocal = true; }
    let finalPhase = 'roll', finalSlot = nextSlot(room);
    if (result.hitTollbooth) {
      ns[playerSlot].pendingSteps = result.remainingSteps;
      finalPhase = 'tollbooth'; finalSlot = playerSlot;
    } else {
      finalPhase = 'moved'; finalSlot = playerSlot;
    }
    await db.from('party_rooms').update({
      player_pos: JSON.stringify(st.pos), player_coins: JSON.stringify(st.coins),
      player_pizzas: JSON.stringify(st.pizzas), player_stats: JSON.stringify(ns),
      turn_phase: finalPhase, current_slot: finalSlot,
    }).eq('id', roomId);
  } else {
    await passOrMinigame(room);
  }
}

// ── Character abilities ───────────────────────────────────────────────────────
function useAbility() {
  const me = myPlayer(roomData);
  const copiedAb = pStats(roomData)[playerSlot]?.copiedAbility;
  const ability = copiedAb?.ability || CHAR_CFG[me.char]?.ability;
  switch (ability) {
    case 'cupcake':
    case 'steal': showCupcakeTarget(); break;
    case 'boardCupcake': showBoardCupcakeUI(); break;
    case 'jump': doJump(); break;
    case 'reroll': doReroll(); break;
    case 'kill': showKillTarget(); break;
    case 'gifts': showGiftsTarget(); break;
    case 'shuffle': doShuffle(); break;
  }
  if (copiedAb) {
    // consume M2 copied ability after use
    const ns = pStats(roomData);
    if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };
    delete ns[playerSlot].copiedAbility;
    db.from('party_rooms').update({ player_stats: JSON.stringify(ns) }).eq('id', roomId).then(() => { }, () => { });
  }
}

// ── Mangle: Shuffle ability ───────────────────────────────────────────────────
async function doShuffle() {
  const board = parseBoard(roomData);
  const locked = new Set(['start', 'tollbooth', 'freddy_zone', 'jackpot']);
  const tiles = [...board.tiles];

  // Collect shuffleable indices and their values
  const freeIdx = tiles.map((t, i) => i).filter(i => !locked.has(tiles[i]));
  const freeVals = freeIdx.map(i => tiles[i]);
  // Fisher-Yates shuffle
  for (let i = freeVals.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [freeVals[i], freeVals[j]] = [freeVals[j], freeVals[i]];
  }
  freeIdx.forEach((idx, i) => { tiles[idx] = freeVals[i]; });

  const newBoard = { ...board, tiles };
  const st = pState(roomData);
  st.cooldowns[playerSlot] = CHAR_CFG['mangle'].cooldown;

  await db.from('party_rooms').update({
    board: JSON.stringify(newBoard),
    player_cooldowns: JSON.stringify(st.cooldowns),
  }).eq('id', roomId);

  emitEvent(`🎀 ${roomData[`${playerSlot}_name`]} tangled the board! Spaces shuffled!`);
  showToast(T('toast.shuffled'));
  renderActionUI(roomData);
}

// ── Microphone item: pick target ──────────────────────────────────────────────
function showMicrophoneTarget(targets) {
  const room = roomData;
  const el = document.getElementById('current-player-action');
  if (!el) return;
  el.innerHTML = `<div class="action-card">
    <div class="action-player-name" style="color:${PLAYER_COLORS[slotNum(playerSlot) - 1]}">🎤 ${T('item.microphone.name')}</div>
    <p style="font-size:.7rem;color:var(--text-muted);margin:2px 0">${T('item.microphone.pickDesc')}</p>
    <div class="ability-targets">
      ${targets.map(s => {
    const char = room[`${s}_char`] || 'freddy';
    return `<button class="mp-btn" onclick="applyMicrophone('${s}')">
          <img src="${charImg(char)}" style="width:20px;height:20px;border-radius:50%;object-fit:contain;vertical-align:middle" onerror="this.style.display='none'"/>
          ${room[`${s}_name`]}${s === playerSlot ? ' (você)' : ''}
        </button>`;
  }).join('')}
    </div>
    <button class="mp-btn small" onclick="renderActionUI(roomData)" style="margin-top:4px">${T('ability.kill.cancel')}</button>
  </div>`;
}

async function applyMicrophone(target) {
  const ns = pStats(roomData);
  if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };
  // Consume the item
  const items = (ns[playerSlot].ownedItems || []);
  const idx = items.indexOf('microphone');
  if (idx === -1) return;
  items.splice(idx, 1);
  ns[playerSlot].ownedItems = items;
  if (!ns[target]) ns[target] = { mgWins: 0, badLucks: 0 };
  ns[target].microphoneActive = true;
  await db.from('party_rooms').update({ player_stats: JSON.stringify(ns) }).eq('id', roomId);
  const targetName = roomData[`${target}_name`];
  emitEvent(`🎤 ${roomData[`${playerSlot}_name`]} used Microphone on ${targetName}! Gains ×2 · Losses ×4 until turn ends`);
  showToast(`🎤 ${T('item.microphone.name')} → ${targetName}!`);
  renderActionUI(roomData);
}

// ── Springlock placement UI ───────────────────────────────────────────────────
let springlockBoardClickHandler = null;

function enterSpringlockPlacement() {
  const { boardSize } = parseBoard(roomData);
  const pc = roomData.player_count || 2;
  const currentNode = boardPos(roomData, playerSlot) % boardSize;
  const occupied = allSlots(pc).map(s => boardPos(roomData, s) % boardSize);

  const el = document.getElementById('current-player-action');
  if (el) el.innerHTML = `<div class="action-card">
    <div class="action-player-name" style="color:${PLAYER_COLORS[slotNum(playerSlot) - 1]}">🔒 ${T('item.springlock.name')}</div>
    <p style="font-size:.7rem;color:var(--text-muted);margin:2px 0">${T('item.springlock.pickDesc')}</p>
    <button class="mp-btn small" onclick="cancelSpringlockPlacement()">${T('ability.kill.cancel')}</button>
  </div>`;

  // Highlight valid spaces
  document.querySelectorAll('[data-node]').forEach(node => {
    const i = parseInt(node.dataset.node);
    if (i === 0 || occupied.includes(i)) node.classList.add('sl-invalid');
    else node.classList.add('sl-available');
  });

  const boardEl = document.getElementById('party-board');
  springlockBoardClickHandler = e => {
    const node = e.target.closest('[data-node]');
    if (!node) return;
    const i = parseInt(node.dataset.node);
    if (i === 0 || occupied.includes(i)) return;
    placeSpringlock(i);
  };
  boardEl?.addEventListener('click', springlockBoardClickHandler);
}

function cancelSpringlockPlacement() {
  exitSpringlockPlacement();
  renderActionUI(roomData);
}

function exitSpringlockPlacement() {
  const boardEl = document.getElementById('party-board');
  if (springlockBoardClickHandler) {
    boardEl?.removeEventListener('click', springlockBoardClickHandler);
    springlockBoardClickHandler = null;
  }
  document.querySelectorAll('.sl-available, .sl-invalid').forEach(n => {
    n.classList.remove('sl-available', 'sl-invalid');
  });
}

async function placeSpringlock(spaceIdx) {
  exitSpringlockPlacement();
  const ns = pStats(roomData);
  if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };
  const items = (ns[playerSlot].ownedItems || []);
  const itmIdx = items.indexOf('springlock');
  if (itmIdx === -1) return;
  items.splice(itmIdx, 1);
  ns[playerSlot].ownedItems = items;
  if (!ns._springlocks_) ns._springlocks_ = [];
  ns._springlocks_.push({ spaceIdx, ownerSlot: playerSlot, turnsLeft: roomData.player_count || 2 });
  await db.from('party_rooms').update({ player_stats: JSON.stringify(ns) }).eq('id', roomId);
  emitEvent(`🔒 ${roomData[`${playerSlot}_name`]} set a Springlock on space ${spaceIdx}! Anyone who lands there pays 5🪙!`);
  showToast(`🔒 Springlock on space ${spaceIdx}!`);
  showDiceShop(roomData);
}

// ── Chica: Board Cupcake placement ───────────────────────────────────────────
let cupcakeBoardClickHandler = null;

function showBoardCupcakeUI() {
  const { boardSize } = parseBoard(roomData);
  const pc = roomData.player_count || 2;
  const occupied = allSlots(pc).map(s => boardPos(roomData, s) % boardSize);

  const el = document.getElementById('current-player-action');
  if (el) el.innerHTML = `<div class="action-card">
    <div class="action-player-name" style="color:${PLAYER_COLORS[slotNum(playerSlot) - 1]}">🧁 ${T('ability.boardCupcake.title')}</div>
    <p style="font-size:.7rem;color:var(--text-muted);margin:2px 0">${T('ability.boardCupcake.pickDesc')}</p>
    <button class="mp-btn small" onclick="cancelBoardCupcakePlacement()">${T('ability.kill.cancel')}</button>
  </div>`;

  document.querySelectorAll('[data-node]').forEach(node => {
    const i = parseInt(node.dataset.node);
    if (i === 0 || occupied.includes(i)) node.classList.add('cup-invalid');
    else node.classList.add('cup-available');
  });

  const boardEl = document.getElementById('party-board');
  cupcakeBoardClickHandler = e => {
    const node = e.target.closest('[data-node]');
    if (!node) return;
    const i = parseInt(node.dataset.node);
    if (i === 0 || occupied.includes(i)) return;
    placeBoardCupcake(i);
  };
  boardEl?.addEventListener('click', cupcakeBoardClickHandler);
}

function cancelBoardCupcakePlacement() {
  exitBoardCupcakePlacement();
  renderActionUI(roomData);
}

function exitBoardCupcakePlacement() {
  const boardEl = document.getElementById('party-board');
  if (cupcakeBoardClickHandler) {
    boardEl?.removeEventListener('click', cupcakeBoardClickHandler);
    cupcakeBoardClickHandler = null;
  }
  document.querySelectorAll('.cup-available, .cup-invalid').forEach(n => {
    n.classList.remove('cup-available', 'cup-invalid');
  });
}

async function placeBoardCupcake(spaceIdx) {
  exitBoardCupcakePlacement();
  const ns = pStats(roomData);
  const st = pState(roomData);
  if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };
  const charCfg = CHAR_CFG[roomData[`${playerSlot}_char`] || 'freddy'];
  if (!ns._cupcakes_) ns._cupcakes_ = [];
  ns._cupcakes_.push({
    spaceIdx,
    ownerSlot: playerSlot,
    lapAtPlacement: playerLaps(roomData, playerSlot),
  });
  st.cooldowns[playerSlot] = charCfg?.cooldown || 3;
  await db.from('party_rooms').update({
    player_stats: JSON.stringify(ns),
    player_cooldowns: JSON.stringify(st.cooldowns),
  }).eq('id', roomId);
  emitEvent(`🧁 ${roomData[`${playerSlot}_name`]} placed a Cupcake trap on space ${spaceIdx}!`);
  showToast(`🧁 Cupcake placed on space ${spaceIdx}!`);
  showDiceShop(roomData);
}

// ── Springtrap: Kill ability ──────────────────────────────────────────────────
function showKillTarget() {
  const room = roomData;
  const pc = room.player_count || 2;
  const targets = allSlots(pc).filter(s =>
    s !== playerSlot && room[`${s}_name`] && inRange5(room, playerSlot, s));
  if (!targets.length) { showToast(T('error.noRange')); return; }

  const el = document.getElementById('current-player-action');
  el.innerHTML = `<div class="action-card">
    <div class="action-player-name" style="color:${PLAYER_COLORS[slotNum(playerSlot) - 1]}">${T('ability.kill.title')}</div>
    <p style="font-size:.7rem;color:var(--text-muted);margin:2px 0">${T('ability.kill.desc')}</p>
    <div class="ability-targets">
      ${targets.map(s => {
    const char = room[`${s}_char`] || 'freddy';
    return `<button class="mp-btn" onclick="executeKill('${s}')">
          <img src="${charImg(char)}" style="width:20px;height:20px;border-radius:50%;object-fit:contain;vertical-align:middle" onerror="this.style.display='none'"/>
          ${room[`${s}_name`]}
        </button>`;
  }).join('')}
    </div>
    <button class="mp-btn small" onclick="renderActionUI(roomData)" style="margin-top:4px">${T('ability.kill.cancel')}</button>
  </div>`;
}

async function executeKill(targetSlot) {
  const st = pState(roomData);
  st.pos[targetSlot] = 0; // reset to start (lap 0, node 0) - coins/pizzas stay
  st.cooldowns[playerSlot] = CHAR_CFG['springtrap'].cooldown;
  await db.from('party_rooms').update({
    player_pos: JSON.stringify(st.pos),
    player_cooldowns: JSON.stringify(st.cooldowns),
  }).eq('id', roomId);
  emitEvent(`🪤 ${roomData[`${playerSlot}_name`]} killed ${roomData[`${targetSlot}_name`]}! Back to start!`);
  showToast(T('toast.killed', { name: roomData[`${targetSlot}_name`] }));
  renderActionUI(roomData);
}

// ── Puppet: Gifts ability ─────────────────────────────────────────────────────
function showGiftsTarget() {
  const room = roomData;
  const pc = room.player_count || 2;
  const targets = allSlots(pc).filter(s => {
    if (!room[`${s}_name`]) return false;
    return s === playerSlot || inRange5(room, playerSlot, s);
  });
  if (!targets.length) { showToast(T('error.noRange')); return; }

  const el = document.getElementById('current-player-action');
  el.innerHTML = `<div class="action-card">
    <div class="action-player-name" style="color:${PLAYER_COLORS[slotNum(playerSlot) - 1]}">${T('ability.gifts.title')}</div>
    <p style="font-size:.7rem;color:var(--text-muted);margin:2px 0">${T('ability.gifts.desc')}</p>
    <div class="ability-targets">
      ${targets.map(s => {
    const char = room[`${s}_char`] || 'freddy';
    const coins = playerCoins(room, s);
    const canGift = coins >= 10;
    return `<button class="mp-btn" onclick="executeGifts('${s}')" ${canGift ? '' : 'disabled'} title="${canGift ? '' : `Needs 10${COIN_IMG}`}">
          <img src="${charImg(char)}" style="width:20px;height:20px;border-radius:50%;object-fit:contain;vertical-align:middle" onerror="this.style.display='none'"/>
          ${room[`${s}_name`]} (${coins}${COIN_IMG})
        </button>`;
  }).join('')}
    </div>
    <button class="mp-btn small" onclick="renderActionUI(roomData)" style="margin-top:4px">${T('ability.gifts.cancel')}</button>
  </div>`;
}

async function executeGifts(targetSlot) {
  const st = pState(roomData);
  if ((st.coins[targetSlot] || 0) < 10) { showToast(T('error.notEnoughCoins')); return; }
  st.coins[targetSlot] = (st.coins[targetSlot] || 0) - 10;
  st.pizzas[targetSlot] = (st.pizzas[targetSlot] || 0) + 1;
  st.cooldowns[playerSlot] = CHAR_CFG['puppet'].cooldown;
  await db.from('party_rooms').update({
    player_coins: JSON.stringify(st.coins),
    player_pizzas: JSON.stringify(st.pizzas),
    player_cooldowns: JSON.stringify(st.cooldowns),
  }).eq('id', roomId);
  const target = roomData[`${targetSlot}_name`];
  emitEvent(`🎁 ${roomData[`${playerSlot}_name`]} gifted a pizza to ${target}!`);
  showToast(targetSlot === playerSlot ? T('toast.giftSelf') : T('toast.giftOther', { name: target }));
  renderActionUI(roomData);
}

function showCupcakeTarget() {
  const room = roomData;
  const pc = room.player_count || 2;
  const targets = allSlots(pc).filter(s =>
    s !== playerSlot && room[`${s}_name`] && inRange5(room, playerSlot, s));
  if (!targets.length) { showToast(T('error.noRangeShort')); return; }

  const abilKey = (CHAR_CFG[room[`${playerSlot}_char`] || 'freddy']?.ability === 'steal') ? 'steal' : 'cupcake';
  const el = document.getElementById('current-player-action');
  el.innerHTML = `<div class="action-card">
    <div class="action-player-name" style="color:${PLAYER_COLORS[slotNum(playerSlot) - 1]}">${T('ability.' + abilKey + '.title')}</div>
    <div class="ability-targets">
      ${targets.map(s => {
    const char = room[`${s}_char`] || 'freddy';
    return `<button class="mp-btn" onclick="executeCupcake('${s}')">
          <img src="${charImg(char)}" style="width:20px;height:20px;border-radius:50%;object-fit:contain;vertical-align:middle" onerror="this.style.display='none'"/>
          ${room[`${s}_name`]}
        </button>`;
  }).join('')}
    </div>
    <button class="mp-btn small" onclick="renderActionUI(roomData)" style="margin-top:4px">${T('ability.' + abilKey + '.cancel')}</button>
  </div>`;
}

async function executeCupcake(targetSlot) {
  const st = pState(roomData);
  const stolen = Math.min(5, st.coins[targetSlot] || 0);
  st.coins[targetSlot] = Math.max(0, (st.coins[targetSlot] || 0) - stolen);
  st.coins[playerSlot] = (st.coins[playerSlot] || 0) + stolen;
  st.cooldowns[playerSlot] = CHAR_CFG[roomData[`${playerSlot}_char`]].cooldown;
  await db.from('party_rooms').update({
    player_coins: JSON.stringify(st.coins),
    player_cooldowns: JSON.stringify(st.cooldowns),
  }).eq('id', roomId);
  showToast(T('toast.stolen', { name: roomData[`${playerSlot}_name`], n: stolen }));
  renderActionUI(roomData);
}

async function doJump() {
  const steps = 4;
  const room = roomData;
  const st = pState(room);
  const { laps, boardSize, tiles, nextMap } = parseBoard(room);
  const fromNodeIdx = (st.pos[playerSlot] || 0) % boardSize;
  st.cooldowns[playerSlot] = CHAR_CFG[room[`${playerSlot}_char`]].cooldown;
  moveFwd(st, playerSlot, steps, true, boardSize);
  isHopping = true;
  try {
    await animateHops(playerSlot, room[`${playerSlot}_char`] || 'freddy', fromNodeIdx, steps, boardSize, tiles, nextMap || {});
    const finished = Math.floor(st.pos[playerSlot] / boardSize) >= laps;
    await db.from('party_rooms').update({
      player_pos: JSON.stringify(st.pos),
      player_coins: JSON.stringify(st.coins),
      player_pizzas: JSON.stringify(st.pizzas),
      player_cooldowns: JSON.stringify(st.cooldowns),
      turn_phase: 'moved', dice_result: steps,
      ...(finished ? { state: 'finished' } : {}),
    }).eq('id', roomId);
  } finally {
    isHopping = false;
  }
  showToast(T('toast.jumped', { name: roomData[`${playerSlot}_name`], n: steps, s: steps > 1 ? 's' : '' }));
}

async function doReroll() {
  const st = pState(roomData);
  st.cooldowns[playerSlot] = CHAR_CFG[roomData[`${playerSlot}_char`]].cooldown;
  await db.from('party_rooms').update({ player_cooldowns: JSON.stringify(st.cooldowns) }).eq('id', roomId);
  showToast(T('toast.rollAgain'));
}

// ── Dice shop ─────────────────────────────────────────────────────────────────
// Returns array of die IDs the player owns (always includes d6)
function getOwnedDice(room, slot) {
  const stats = pStats(room)[slot] || {};
  if (Array.isArray(stats.ownedDice)) return stats.ownedDice;
  // backwards compat: own d6 + whatever was equipped
  const cur = stats.dice || 'd6';
  return cur === 'd6' ? ['d6'] : ['d6', cur];
}

function getOwnedItems(room, slot) {
  const stats = pStats(room)[slot] || {};
  return Array.isArray(stats.ownedItems) ? [...stats.ownedItems] : [];
}

function micMultiplied(ns, slot, delta) {
  if (!ns[slot]?.microphoneActive) return delta;
  return delta > 0 ? Math.round(delta * 2) : Math.round(delta * 4);
}

function showDiceShop(room) {
  const coins = playerCoins(room, playerSlot);
  const myChar = room[`${playerSlot}_char`] || 'freddy';
  const equipped = getPlayerDice(room, playerSlot);
  const owned = getOwnedDice(room, playerSlot);
  const btnsEl = document.getElementById('dice-action-btns');
  const panel = document.getElementById('dice-shop-content') || document.getElementById('dice-shop-panel');
  if (!panel) return;

  const psn = pStats(room)[playerSlot] || {};
  const forcedDie = psn.forcedDice;
  const forcedTurns = psn.forcedTurns || 0;
  const isForced = !!(forcedDie && forcedTurns > 0);

  const allDice = [
    { id: 'd6', label: T('dname.d6'), emoji: '🎲', desc: T('ddesc.d6'), price: 0 },
    ...SHOP_DICE.filter(d => !d.onlyChar || d.onlyChar === myChar).map(d => ({ ...d, label: T('dname.' + d.id), desc: T('ddesc.' + d.id) })),
  ];

  const cards = allDice.map(d => {
    const isEquipped = equipped === d.id;
    const isOwned = owned.includes(d.id);
    const canBuy = !isOwned && d.price > 0 && coins >= d.price;
    const shopD = SHOP_DICE.find(x => x.id === d.id);
    const usesLeft = isOwned && shopD?.maxUses
      ? (psn.diceUses?.[d.id] ?? shopD.maxUses)
      : null;
    const isThisForced = isForced && d.id === forcedDie;
    const otherForced = isForced && d.id !== forcedDie;

    const cls = isEquipped ? 'dic-equipped' : (!isOwned ? 'dic-locked' : '');

    let usesTag = '';
    if (usesLeft !== null) usesTag = `<span class="dic-uses">${usesLeft !== 1 ? T('dice.usesLeft', { n: usesLeft, s: 's' }) : T('dice.usesLeft1', { n: usesLeft })}</span>`;
    if (isThisForced) usesTag += `<span class="dic-forced">${T('dice.forcedTag', { n: forcedTurns })}</span>`;

    let footer;
    if (isEquipped) {
      const canUnequip = d.id !== 'd6' && !isThisForced;
      footer = `<span class="dic-status">${T('dice.equipped')}</span>${canUnequip ? ` <button class="mp-btn small dic-unequip-btn">${T('dice.unequip')}</button>` : ''}`;
    } else if (isOwned) {
      footer = otherForced
        ? `<button class="mp-btn small dic-equip-btn" data-id="${d.id}" disabled title="${T('dice.locked')}">${T('dice.locked')}</button>`
        : `<button class="mp-btn small dic-equip-btn" data-id="${d.id}">${T('dice.equip')}</button>`;
    } else {
      footer = `<span class="dic-price">${d.price}${COIN_IMG}</span>
        <button class="mp-btn small dic-buy-btn" data-id="${d.id}" data-price="${d.price}" ${canBuy ? '' : 'disabled'}>${coins < d.price ? T('dice.needCoins', { n: d.price }) : T('dice.buy')}</button>`;
    }

    return `<div class="dic-card ${cls}">
      <div class="dic-header">
        <span class="dic-emoji">${d.emoji}</span>
        <span class="dic-name">${d.label}</span>
      </div>
      <span class="dic-desc">${d.desc}</span>
      ${usesTag ? `<div class="dic-uses-row">${usesTag}</div>` : ''}
      <div class="dic-footer">${footer}</div>
    </div>`;
  }).join('');

  const myTurn = isMyTurn(room);
  const diceObj = DICE_TYPES[getPlayerDice(room, playerSlot)] || DICE_TYPES.d6;

  // ── build action section based on phase ─────────────────
  let actionHTML = '';
  if (myTurn) {
    if (room.turn_phase === 'roll') {
      const me = myPlayer(room);
      const c = CHAR_CFG[me.char] || {};
      const copiedAb = pStats(room)[playerSlot]?.copiedAbility;
      const effectiveAbility = copiedAb?.ability || c.ability;
      const canAbility = effectiveAbility && effectiveAbility !== 'reroll' && effectiveAbility !== 'tollpass'
        && (pState(room).cooldowns[playerSlot] || 0) === 0;
      const abilLabel = { cupcake: T('action.ability.cupcake'), steal: T('action.ability.steal'), boardCupcake: T('action.ability.boardCupcake'), jump: T('action.ability.jump'), kill: T('action.ability.kill'), gifts: T('action.ability.gifts'), shuffle: T('action.ability.shuffle') }[effectiveAbility] || '✨ Ability';
      actionHTML = `
        <button class="mp-btn primary dp-action-btn" id="dp-roll-btn">${diceObj.pick ? T('action.pickSteps') : T('action.roll', { emoji: diceObj.emoji })}</button>
        ${canAbility ? `<button class="mp-btn accent dp-action-btn" id="dp-ability-btn">${abilLabel}</button>` : ''}`;

    } else if (room.turn_phase === 'rolled') {
      const me = myPlayer(room);
      const c = CHAR_CFG[me.char] || {};
      const canReroll = c.ability === 'reroll' && (pState(room).cooldowns[playerSlot] || 0) === 0;
      const lastDice = pStats(room)[playerSlot]?.lastDiceId || getPlayerDice(room, playerSlot);
      const isSpringlock = lastDice === 'springlock' && room.dice_result === 0;
      actionHTML = `
        <button class="mp-btn primary dp-action-btn" id="dp-apply-btn">${isSpringlock ? T('action.backToStart') : T('action.continue')}</button>
        ${canReroll && !isSpringlock ? `<button class="mp-btn accent dp-action-btn" id="dp-reroll-btn">${T('action.reroll')}</button>` : ''}`;

    } else if (room.turn_phase === 'moved') {
      actionHTML = `<button class="mp-btn primary dp-action-btn" id="dp-cont-btn">${T('action.contBtn')}</button>`;

    } else if (room.turn_phase === 'tollbooth') {
      const { toll, tollMap, skipMap, freeMap, boardSize, tiles } = parseBoard(room);
      const pos = boardPos(room, playerSlot);
      const currentToll = tollMap[pos] !== undefined ? tollMap[pos] : toll;
      const canAfford = coins >= currentToll;
      const myChar = room[`${playerSlot}_char`] || 'freddy';
      const cd = pState(room).cooldowns[playerSlot] || 0;
      const canPass = myChar === 'freddy' && cd === 0;
      const nextToll = Math.min(toll + 25, currentToll + 5);
      const skipIdx = skipMap[pos] !== undefined ? skipMap[pos] : (pos + TOLL_SKIP) % boardSize;
      const freeIdx = freeMap[pos] !== undefined ? freeMap[pos] : null;
      const skipCfg = SPACE_CFG[tiles[skipIdx]] || SPACE_CFG.normal;
      const freeCfg = freeIdx !== null ? (SPACE_CFG[tiles[freeIdx]] || SPACE_CFG.normal) : null;
      const skipLabel = `${T('toll.spaceLabel', { n: skipIdx })} ${skipCfg.emoji || ''}`;
      const freeLabel = freeIdx !== null ? `${T('toll.spaceLabel', { n: freeIdx })} ${freeCfg.emoji || ''}` : T('toll.dangerZone');
      actionHTML = `
        <div class="dp-toll-title">${T('toll.title')}</div>
        ${canPass ? `<button class="mp-btn accent dp-action-btn" id="dp-freddy-pass">${T('toll.freePass', { dest: skipLabel })}</button>` : ''}
        <button class="mp-btn primary dp-action-btn" id="dp-pay-toll" ${canAfford ? '' : 'disabled'}>${canAfford ? T('toll.pay', { cost: currentToll, dest: skipLabel }) : T('toll.needCoins', { cost: currentToll })}</button>
        ${currentToll < nextToll ? `<div class="dp-toll-next-info">${T('toll.nextPrice', { cost: nextToll })}</div>` : `<div class="dp-toll-next-info dp-toll-max-info">${T('toll.maxPrice')}</div>`}
        <button class="mp-btn dp-action-btn" id="dp-free-path">${T('toll.freePath', { dest: freeLabel })}</button>`;
    }
  }

  // ── Items section ─────────────────────────────────────
  const ownedItems = getOwnedItems(room, playerSlot);
  const myTurnForItems = isMyTurn(room) && ['roll', 'rolled', 'moved', 'tollbooth'].includes(room.turn_phase);
  const ns_items = pStats(room);

  const itemShopCards = ITEM_CFG.map(it => {
    const count = ownedItems.filter(id => id === it.id).length;
    const canBuy = coins >= it.price;
    const isBattery = it.id === 'battery';
    const isFazMixer = it.id === 'faz_mixer';
    const isMask = it.id === 'freddy_mask';
    const batteryUsed = isBattery && !!(ns_items[playerSlot]?.batteryUsed);
    const fazMixerBought = isFazMixer ? (ns_items[playerSlot]?.fazMixerBought || 0) : 0;
    const maskUsed = isMask && !!(ns_items[playerSlot]?.maskUsed);
    const activeEffects = [];
    if (it.id === 'battery' && ns_items[playerSlot]?.extraTurn) activeEffects.push('⚡');
    if (it.id === 'helpy' && ns_items[playerSlot]?.helpyActive) activeEffects.push('✨');
    if (it.id === 'm2' && ns_items[playerSlot]?.copiedAbility) activeEffects.push('🔮');
    if (it.id === 'freddy_mask' && ns_items[playerSlot]?.maskActive) activeEffects.push('🛡️');
    if (it.id === 'faz_mixer') activeEffects.push(`${fazMixerBought}/3`);

    const onceLocked = (isBattery && (batteryUsed || count > 0))
      || (isFazMixer && fazMixerBought >= 3)
      || (isMask && (maskUsed || count > 0));
    const canBuyItem = canBuy && !onceLocked;
    const isUsed = (isBattery && batteryUsed) || (isMask && maskUsed);
    const useBtn = count > 0 && myTurnForItems && !isUsed
      ? `<button class="mp-btn small itm-use-btn" data-id="${it.id}">${T('item.use')}</button>` : '';
    const countTag = count > 0 ? `<span class="itm-count">${count > 1 ? '×' + count : '●'}</span>` : '';
    const activeTag = activeEffects.length ? `<span class="itm-active">${activeEffects.join('')}</span>` : '';
    const buyLabel = !canBuyItem && onceLocked ? T('item.battery.used') : coins < it.price ? T('dice.needCoins', { n: it.price }) : T('item.buy');
    return `<div class="itm-card ${count > 0 ? 'itm-owned' : 'itm-locked'}">
      <div class="itm-header">
        <span class="itm-emoji">${it.emoji}</span>
        <span class="itm-name">${T('item.' + it.id + '.name')}</span>
        ${countTag}${activeTag}
      </div>
      <span class="itm-desc">${T('item.' + it.id + '.desc')}</span>
      <div class="itm-footer">
        ${useBtn}
        <span class="itm-price">${it.price}${COIN_IMG}</span>
        <button class="mp-btn small itm-buy-btn" data-id="${it.id}" data-price="${it.price}" ${canBuyItem ? '' : 'disabled'}>${buyLabel}</button>
      </div>
    </div>`;
  }).join('');

  if (btnsEl) btnsEl.innerHTML = actionHTML ? `<div class="dice-panel-actions">${actionHTML}</div>` : '';
  panel.innerHTML = `
    <div class="dice-shop-title">${T('dice.title')}</div>
    <div class="dice-shop-coins">${T('dice.coinsAvailable', { n: coins })}</div>
    <div class="dice-inv-list">${cards}</div>
    <div class="dice-shop-title" style="margin-top:10px">${T('item.shopTitle')}</div>
    <div class="itm-list">${itemShopCards}</div>`;

  panel.querySelectorAll('.dic-buy-btn').forEach(btn => {
    if (!btn.disabled) btn.addEventListener('click', () => buyDice(btn.dataset.id, +btn.dataset.price), { once: true });
  });
  panel.querySelectorAll('.dic-equip-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => equipDice(btn.dataset.id), { once: true });
  });
  panel.querySelectorAll('.dic-unequip-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const ns = pStats(roomData);
      if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };
      ns[playerSlot].dice = 'd6';
      await db.from('party_rooms').update({ player_stats: JSON.stringify(ns) }).eq('id', roomId);
      showToast(T('dice.unequippedBack'));
    }, { once: true });
  });
  panel.querySelectorAll('.itm-buy-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => buyItem(btn.dataset.id, +btn.dataset.price), { once: true });
  });
  panel.querySelectorAll('.itm-use-btn').forEach(btn => {
    btn.addEventListener('click', () => useItem(btn.dataset.id), { once: true });
  });

  // ── action button wires ──────────────────────────────────
  const dpRoll = document.getElementById('dp-roll-btn');
  if (dpRoll) dpRoll.addEventListener('click', () => { dpRoll.disabled = true; if (diceObj.pick) showPickDiceUI(); else doRoll(); }, { once: true });
  const dpAbility = document.getElementById('dp-ability-btn');
  if (dpAbility) dpAbility.addEventListener('click', () => { dpAbility.disabled = true; useAbility(); }, { once: true });
  const dpApply = document.getElementById('dp-apply-btn');
  if (dpApply) dpApply.addEventListener('click', () => { dpApply.disabled = true; applyMove(); }, { once: true });
  const dpReroll = document.getElementById('dp-reroll-btn');
  if (dpReroll) dpReroll.addEventListener('click', () => { dpReroll.disabled = true; doFoxyReroll(); }, { once: true });
  const dpCont = document.getElementById('dp-cont-btn');
  if (dpCont) dpCont.addEventListener('click', () => { dpCont.disabled = true; handleSpace(); }, { once: true });
  const dpPass = document.getElementById('dp-freddy-pass');
  if (dpPass) dpPass.addEventListener('click', () => { dpPass.disabled = true; freddyTollPass(); }, { once: true });
  const dpPayToll = document.getElementById('dp-pay-toll');
  if (dpPayToll && !dpPayToll.disabled) dpPayToll.addEventListener('click', () => { dpPayToll.disabled = true; payToll(); }, { once: true });
  const dpFreePath = document.getElementById('dp-free-path');
  if (dpFreePath) dpFreePath.addEventListener('click', () => { dpFreePath.disabled = true; passTollFree(); }, { once: true });
}

async function buyDice(diceId, price) {
  const ns = pStats(roomData);
  if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0, shopVisited: true };
  const owned = getOwnedDice(roomData, playerSlot);
  if (!owned.includes(diceId)) owned.push(diceId);
  ns[playerSlot].ownedDice = owned;
  ns[playerSlot].dice = diceId;
  const shopD = SHOP_DICE.find(d => d.id === diceId);
  if (shopD?.maxUses) {
    if (!ns[playerSlot].diceUses) ns[playerSlot].diceUses = {};
    ns[playerSlot].diceUses[diceId] = shopD.maxUses;
  }
  if (shopD?.forced) {
    ns[playerSlot].forcedDice = diceId;
    ns[playerSlot].forcedTurns = shopD.forced;
  }
  const st = pState(roomData);
  st.coins[playerSlot] = Math.max(0, (st.coins[playerSlot] || 0) - price);
  await db.from('party_rooms').update({
    player_stats: JSON.stringify(ns),
    player_coins: JSON.stringify(st.coins),
  }).eq('id', roomId);
  emitEvent(`🎲 ${roomData[`${playerSlot}_name`]} bought the ${DICE_TYPES[diceId].label}!`);
  const forcedNote = shopD?.forced ? T('dice.boughtForced', { n: shopD.forced }) : '';
  showToast(T('dice.bought', { name: T('dname.' + diceId), forced: forcedNote, emoji: DICE_TYPES[diceId].emoji }));
}

async function equipDice(diceId) {
  const owned = getOwnedDice(roomData, playerSlot);
  if (!owned.includes(diceId)) return;
  const ns = pStats(roomData);
  const psn = ns[playerSlot] || {};
  if (psn.forcedDice && (psn.forcedTurns || 0) > 0 && diceId !== psn.forcedDice) {
    showToast(T('dice.forcedActive', { n: psn.forcedTurns, s: psn.forcedTurns > 1 ? 's' : '' }));
    return;
  }
  if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };
  ns[playerSlot].dice = diceId;
  await db.from('party_rooms').update({ player_stats: JSON.stringify(ns) }).eq('id', roomId);
  showToast(T('dice.equipped2', { name: T('dname.' + diceId), emoji: DICE_TYPES[diceId]?.emoji || '🎲' }));
}

// ── Item shop ─────────────────────────────────────────────────────────────────
async function buyItem(itemId) {
  const item = ITEM_CFG.find(i => i.id === itemId);
  if (!item) return;
  const ns = pStats(roomData);
  if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };
  (ns[playerSlot].ownedItems = ns[playerSlot].ownedItems || []).push(itemId);
  // Track faz_mixer purchase count for the 3-buy cap
  if (itemId === 'faz_mixer') ns[playerSlot].fazMixerBought = (ns[playerSlot].fazMixerBought || 0) + 1;
  const st = pState(roomData);
  st.coins[playerSlot] = Math.max(0, (st.coins[playerSlot] || 0) - item.price);
  await db.from('party_rooms').update({
    player_stats: JSON.stringify(ns),
    player_coins: JSON.stringify(st.coins),
  }).eq('id', roomId);
  emitEvent(`${item.emoji} ${roomData[`${playerSlot}_name`]} bought ${T('item.' + itemId + '.name')}!`);
  showToast(`${item.emoji} ${T('item.' + itemId + '.name')} purchased!`);
}

async function useItem(itemId) {
  const item = ITEM_CFG.find(i => i.id === itemId);
  if (!item) return;
  const ns = pStats(roomData);
  if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };
  const items = (ns[playerSlot].ownedItems || []);
  const idx = items.indexOf(itemId);
  if (idx === -1) return;
  items.splice(idx, 1);
  ns[playerSlot].ownedItems = items;

  const st = pState(roomData);
  const pc = roomData.player_count || 2;
  const others = allSlots(pc).filter(s => s !== playerSlot && roomData[`${s}_name`]);

  switch (itemId) {
    case 'microphone': {
      const allActive = allSlots(pc).filter(s => roomData[`${s}_name`]);
      if (!allActive.length) { showToast(T('error.noRange')); return; }
      showMicrophoneTarget(allActive);
      return; // target picker handles the rest
    }
    case 'battery': {
      if (ns[playerSlot].batteryUsed) { showToast(T('item.battery.used')); return; }
      ns[playerSlot].batteryUsed = true;
      ns[playerSlot].extraTurn = true;
      await db.from('party_rooms').update({ player_stats: JSON.stringify(ns) }).eq('id', roomId);
      emitEvent(`🔋 ${roomData[`${playerSlot}_name`]} activated the Battery - extra turn coming!`);
      showToast(`🔋 ${T('item.battery.name')} activated!`);
      break;
    }
    case 'helpy': {
      ns[playerSlot].helpyActive = true;
      await db.from('party_rooms').update({ player_stats: JSON.stringify(ns) }).eq('id', roomId);
      emitEvent(`🐰 ${roomData[`${playerSlot}_name`]} used Helpy - next minigame score ×2!`);
      showToast(`🐰 ${T('item.helpy.name')} activated!`);
      break;
    }
    case 'swap': {
      if (!others.length) { showToast(T('error.noRange')); return; }
      const target = others[Math.floor(Math.random() * others.length)];
      const posA = st.pos[playerSlot] || 0;
      const posB = st.pos[target] || 0;
      st.pos[playerSlot] = posB;
      st.pos[target] = posA;
      await db.from('party_rooms').update({
        player_pos: JSON.stringify(st.pos),
        player_stats: JSON.stringify(ns),
      }).eq('id', roomId);
      emitEvent(`🔃 ${roomData[`${playerSlot}_name`]} swapped positions with ${roomData[`${target}_name`]}!`);
      showToast(`🔃 Swapped with ${roomData[`${target}_name`]}!`);
      break;
    }
    case 'ballpit': {
      const { boardSize } = parseBoard(roomData);
      const currentLap = Math.floor((st.pos[playerSlot] || 0) / boardSize);
      const randomNode = Math.floor(Math.random() * boardSize);
      st.pos[playerSlot] = currentLap * boardSize + randomNode;
      await db.from('party_rooms').update({
        player_pos: JSON.stringify(st.pos),
        player_stats: JSON.stringify(ns),
      }).eq('id', roomId);
      emitEvent(`🎊 ${roomData[`${playerSlot}_name`]} used Ball Pit - teleported to space ${randomNode}!`);
      showToast(`🎊 Teleported to space ${randomNode}!`);
      break;
    }
    case 'm2': {
      if (!others.length) { showToast(T('error.noRange')); return; }
      const target = others[Math.floor(Math.random() * others.length)];
      const targetChar = roomData[`${target}_char`] || 'freddy';
      const targetAbility = CHAR_CFG[targetChar]?.ability;
      if (!targetAbility || targetAbility === 'tollpass') {
        await db.from('party_rooms').update({ player_stats: JSON.stringify(ns) }).eq('id', roomId);
        emitEvent(`🤖 ${roomData[`${playerSlot}_name`]} copied ${roomData[`${target}_name`]}'s style - nothing useful!`);
        showToast(`🤖 Nothing to copy from ${roomData[`${target}_name`]}!`);
        break;
      }
      ns[playerSlot].copiedAbility = { ability: targetAbility, cooldown: CHAR_CFG[targetChar].cooldown };
      await db.from('party_rooms').update({ player_stats: JSON.stringify(ns) }).eq('id', roomId);
      emitEvent(`🤖 ${roomData[`${playerSlot}_name`]} copied ${CHAR_CFG[targetChar]?.name}'s ability from ${roomData[`${target}_name`]}!`);
      showToast(`🤖 Copied ${CHAR_CFG[targetChar]?.name}'s ability!`);
      break;
    }
    case 'faz_mixer': {
      const active = allSlots(pc).filter(s => roomData[`${s}_name`]);
      const pool = [];
      active.forEach(s => { pool.push(st.coins[s] || 0); pool.push(st.pizzas[s] || 0); });
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      let pi = 0;
      active.forEach(s => { st.coins[s] = pool[pi++]; st.pizzas[s] = pool[pi++]; });
      await db.from('party_rooms').update({
        player_coins: JSON.stringify(st.coins),
        player_pizzas: JSON.stringify(st.pizzas),
        player_stats: JSON.stringify(ns),
      }).eq('id', roomId);
      emitEvent(`🎰 ${roomData[`${playerSlot}_name`]} used Faz-Blender - everyone's coins & pizzas scrambled!`);
      showToast('🎰 Faz-Blender! Everything scrambled!');
      break;
    }
    case 'glitchtrap': {
      const board = parseBoard(roomData);
      const shuffled = [...board.tiles];
      // Shuffle all tiles except index 0 (start always stays normal)
      for (let i = shuffled.length - 1; i > 1; i--) {
        const j = 1 + Math.floor(Math.random() * i);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      shuffled[0] = 'normal';
      const newBoard = { ...board, tiles: shuffled };
      await db.from('party_rooms').update({
        board: JSON.stringify(newBoard),
        player_stats: JSON.stringify(ns),
      }).eq('id', roomId);
      emitEvent(`🐇 ${roomData[`${playerSlot}_name`]} used Glitchtrap - the board has been corrupted!`);
      showToast('🐇 Board shuffled!');
      break;
    }
    case 'springlock': {
      enterSpringlockPlacement();
      return; // placement UI handles item removal + DB write
    }
    case 'freddy_mask': {
      if (ns[playerSlot]?.maskUsed) { showToast(T('item.battery.used')); return; }
      ns[playerSlot].maskUsed = true;
      ns[playerSlot].maskActive = true;
      await db.from('party_rooms').update({ player_stats: JSON.stringify(ns) }).eq('id', roomId);
      emitEvent(`🎭 ${roomData[`${playerSlot}_name`]} put on the Freddy Mask - immune to negative effects for 1 lap!`);
      showToast('🎭 Freddy Mask active! Immune for 1 lap!');
      break;
    }
  }
  showDiceShop(roomData);
}

// ── Tollbooth (hard mode) ─────────────────────────────────────────────────────
function showTollboothUI(room) {
  const { boardSize, tiles, skipMap, freeMap } = parseBoard(room);
  const pos = boardPos(room, playerSlot);
  const el = document.getElementById('current-player-action');
  if (!el) return;

  const skipIdx = skipMap[pos] !== undefined ? skipMap[pos] : (pos + TOLL_SKIP) % boardSize;
  const freeIdx = freeMap[pos] !== undefined ? freeMap[pos] : null;
  const skipCfg = SPACE_CFG[tiles[skipIdx]] || SPACE_CFG.normal;
  const freeCfg = freeIdx !== null ? (SPACE_CFG[tiles[freeIdx]] || SPACE_CFG.normal) : null;
  const skipDesc = `${T('toll.spaceLabel', { n: skipIdx })} ${skipCfg.emoji || ''}`;
  const freeDesc = freeIdx !== null ? `${T('toll.spaceLabel', { n: freeIdx })} ${freeCfg.emoji || ''}` : T('toll.dangerZone');
  const pendingSteps = pStats(room)[playerSlot]?.pendingSteps || 0;

  el.innerHTML = `<div class="action-card">
    <div class="tollbooth-title">${T('toll.cardTitle')}</div>
    <div class="action-pos">${T('toll.pathInfo', { a: skipDesc, b: freeDesc })}</div>
    ${pendingSteps > 0 ? `<div style="font-size:.65rem;color:var(--gold)">${T('toll.stepsLeft', { n: pendingSteps })}</div>` : ''}
    <div style="font-size:.65rem;color:var(--text-muted);margin-top:2px">${T('toll.choosePanel')}</div>
  </div>`;
}

// Shared helper: after a tollbooth choice, moves to destination then continues pending steps.
// noLap = true when the free path is a setback (goes backward) so it doesn't count as a lap or a round.
// coinDeduct: amount to subtract from player's coins (for payToll).
async function resolveTollChoice(destIdx, orSkipFwd, labelA, labelB, noLap = false, coinDeduct = 0) {
  const room = roomData;
  const board = parseBoard(room);
  const { tiles, laps, boardSize, mapType, toll, tollMap, skipMap, freeMap, nodes, boardAspect, nextMap } = board;
  const st = pState(room);
  const ns = pStats(room);
  const pos = boardPos(room, playerSlot);
  if (coinDeduct > 0) st.coins[playerSlot] = Math.max(0, (st.coins[playerSlot] || 0) - coinDeduct);

  // Jump to chosen destination
  if (destIdx !== null && destIdx !== undefined) {
    jumpToNode(st, playerSlot, destIdx, boardSize, noLap);
  } else if (orSkipFwd) {
    moveFwd(st, playerSlot, TOLL_SKIP, true, boardSize);
  }

  const pendingSteps = ns[playerSlot]?.pendingSteps || 0;
  if (!ns[playerSlot]) ns[playerSlot] = { mgWins: 0, badLucks: 0 };
  ns[playerSlot].pendingSteps = 0;

  let finalPhase = 'roll', finalSlot = nextSlot(room), hitAnother = false;

  // Stop at pizza: always when pendingSteps=0 (all maps), or when passing through in Jackpot
  const destTileType = (destIdx !== null && destIdx !== undefined) ? (tiles[destIdx] || 'normal') : null;
  const stopAtPizza = destTileType === 'pizza' && (pendingSteps === 0 || mapType === 'jackpot');

  if (stopAtPizza) {
    if (pendingSteps > 0) ns[playerSlot].pendingSteps = pendingSteps;
    finalPhase = 'moved'; finalSlot = playerSlot;
  } else if (pendingSteps > 0) {
    const result = moveStepByStep(st, playerSlot, pendingSteps, boardSize, tiles, nextMap);
    if (result.hitTollbooth) {
      ns[playerSlot].pendingSteps = result.remainingSteps;
      finalPhase = 'tollbooth'; finalSlot = playerSlot; hitAnother = true;
    } else {
      finalPhase = 'moved'; finalSlot = playerSlot;
    }
  }

  const finished = Math.floor(st.pos[playerSlot] / boardSize) >= laps;
  // Per-tollbooth pricing: only increase the node we were on, only when paying (coinDeduct > 0)
  const newTollMap = { ...tollMap };
  if (coinDeduct > 0) {
    const nodeToll = newTollMap[pos] !== undefined ? newTollMap[pos] : toll;
    newTollMap[pos] = Math.min(toll + 25, nodeToll + 5);
  }
  const newBoard = { tiles, laps, boardSize, mapType, toll, tollMap: newTollMap, skipMap, freeMap };
  if (nodes) newBoard.nodes = nodes;
  if (boardAspect) newBoard.boardAspect = boardAspect;
  if (nextMap && Object.keys(nextMap).length) newBoard.nextMap = nextMap;
  if (board.endOfRoundMinigame) newBoard.endOfRoundMinigame = true;

  await db.from('party_rooms').update({
    player_pos: JSON.stringify(st.pos),
    player_coins: JSON.stringify(st.coins),
    player_pizzas: JSON.stringify(st.pizzas),
    player_stats: JSON.stringify(ns),
    board: JSON.stringify(newBoard),
    turn_phase: finished ? undefined : finalPhase,
    current_slot: finished ? undefined : finalSlot,
    ...(finished ? { state: 'finished' } : {}),
  }).eq('id', roomId);

  emitEvent(`🐻 ${room[`${playerSlot}_name`]} ${labelA}`);
  showToast(labelB);
}

async function payToll() {
  const room = roomData;
  const { toll, tollMap, skipMap } = parseBoard(room);
  const pos = boardPos(room, playerSlot);
  const currentToll = tollMap[pos] !== undefined ? tollMap[pos] : toll;
  const skipIdx = skipMap[pos] !== undefined ? skipMap[pos] : null;
  const dest = skipIdx !== null ? `Space ${skipIdx}` : `+${TOLL_SKIP} spaces`;
  await resolveTollChoice(skipIdx, skipIdx === null, `paid ${currentToll}🪙 - Path A → ${dest}`, `Paid ${currentToll}🪙 - Path A! 🐻`, false, currentToll);
}

async function passTollFree() {
  const room = roomData;
  const { freeMap } = parseBoard(room);
  const pos = boardPos(room, playerSlot);
  const freeIdx = freeMap[pos];

  if (freeIdx !== undefined) {
    // noLap=true: free path is a setback, don't count as lap completion or round end
    await resolveTollChoice(freeIdx, false, `took Path B → Space ${freeIdx}`, `Free path → Space ${freeIdx}! 😰`, true);
  } else {
    // No explicit free destination: sequential continuation (into freddy zone)
    await resolveTollChoice(null, false, 'entered the Freddy Zone!', 'Entering the Freddy Zone... 😰', false);
  }
}

// Freddy's ability: take Path A for free (no coin cost), sets cooldown
async function freddyTollPass() {
  const room = roomData;
  const { skipMap } = parseBoard(room);
  const pos = boardPos(room, playerSlot);
  const st = pState(room);
  const skipIdx = skipMap[pos] !== undefined ? skipMap[pos] : null;
  st.cooldowns[playerSlot] = CHAR_CFG['freddy'].cooldown;
  await resolveTollChoice(skipIdx, skipIdx === null, `used Freddy's Pass - Path A for free! 🐻`, `Freddy's Pass! Path A for free 🐻`);
  await db.from('party_rooms').update({ player_cooldowns: JSON.stringify(st.cooldowns) }).eq('id', roomId);
}

// ── Minigame trigger ──────────────────────────────────────────────────────────
async function triggerMinigame(involvedSlots, extraCfg = {}) {
  const lastMgId = roomData?.mg_id;
  const mgPool = MINIGAME_LIST.filter(m => m.id !== lastMgId);
  const cfg = (mgPool.length > 0 ? mgPool : MINIGAME_LIST)[Math.floor(Math.random() * (mgPool.length || MINIGAME_LIST.length))];
  let reward = extraCfg.challengeReward !== undefined ? extraCfg.challengeReward : Math.floor(Math.random() * 3) + 1;

  // Double multiplier: last-lap double phase OR triggering player has 2d6 equipped
  let rewardMul = 1;
  if (isDoublePhase(roomData)) rewardMul *= 2;
  if (getPlayerDice(roomData, playerSlot) === '2d6') rewardMul *= 2;
  reward = reward * rewardMul;

  const config = { seed: Date.now(), recipe: null, guitarPos: null, attackDelay: null, rewardMul, ...extraCfg };

  // Deterministic seeds for fairness
  if (cfg.id === 'feedingFrenzy') {
    const FF_INGREDIENTS = ['🍅', '🧀', '🥓', '🫑', '🧅', '🍄', '🫒', '🌶️', '🥚', '🍗'];
    const rng = seededRand(config.seed);
    const shuffled = [...FF_INGREDIENTS].sort(() => rng() - .5);
    config.recipe = shuffled.slice(0, 3);
  }
  if (cfg.id === 'guitarFinder') {
    config.guitarPos = Math.floor(seededRand(config.seed)() * 16);
  }
  if (cfg.id === 'powerOut') {
    config.attackDelay = Math.floor(seededRand(config.seed)() * 5000) + 500;
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
  }).eq('id', roomId).eq('turn_phase', 'moved');
}

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

// ── Minigame wait screen (all-ready gate) ────────────────────────────────────
function showMgWaitScreen(room) {
  const involved = JSON.parse(room.mg_players || '[]');
  const cfg = MINIGAME_LIST.find(m => m.id === room.mg_id);
  if (!cfg) return;

  const isP56 = slotNum(playerSlot) > 4;
  const alreadyReady = isP56 ? mgReadyLocal.has(playerSlot) : room[mgDoneKey(playerSlot)];
  showScreen('minigame');
  const livebar = document.getElementById('mg-live-bar');
  if (livebar) livebar.style.display = 'none';

  document.getElementById('mg-content').innerHTML = `<div class="minigame-intro">
    <div class="mg-emoji">${cfg.emoji}</div>
    <h2 class="mg-title">${T('mg.' + cfg.id + '.name')}</h2>
    <p class="mg-desc">${T('mg.' + cfg.id + '.desc')}</p>
    <div class="mg-players" id="mg-ready-list">
      ${involved.map(s => {
    const char = room[`${s}_char`] || 'freddy';
    const color = PLAYER_COLORS[slotNum(s) - 1];
    const ready = slotNum(s) <= 4 ? room[mgDoneKey(s)] : mgReadyLocal.has(s);
    return `<span class="mg-player-tag" id="ready-tag-${s}"
            style="border-color:${color};background:${ready ? color + '40' : color + '15'}">
          <img src="${charImg(char)}" style="width:16px;height:16px;border-radius:50%;object-fit:contain;vertical-align:middle;margin-right:4px" onerror="this.style.display='none'"/>
          ${room[`${s}_name`]} ${ready ? '✅' : '⏳'}
        </span>`;
  }).join('')}
    </div>
    <div class="mg-reward">${T('mg.reward', { n: room.mg_reward })}</div>
    ${!alreadyReady && involved.includes(playerSlot)
      ? `<button class="mp-btn primary" id="mg-ready-btn">${T('mg.imReady')}</button>`
      : `<p class="mg-desc" style="font-size:.8rem">${T('mg.waitingAll')}</p>`}
  </div>`;

  if (!alreadyReady && involved.includes(playerSlot)) {
    document.getElementById('mg-ready-btn').addEventListener('click', readyForMinigame);
  }
}

async function readyForMinigame() {
  const btn = document.getElementById('mg-ready-btn');
  if (btn) { btn.disabled = true; btn.textContent = T('mg.readyBtn'); }
  if (slotNum(playerSlot) <= 4) {
    await db.from('party_rooms').update({ [mgDoneKey(playerSlot)]: true }).eq('id', roomId);
  } else {
    mgReadyLocal.add(playerSlot);
    broadcastCh?.send({ type: 'broadcast', event: 'mg_ready', payload: { slot: playerSlot } });
    checkMgAllReadyLocal();
  }
}

// ── Minigame screen (auto-starts when all ready) ──────────────────────────────
function startMinigameScreen(room) {
  if (mgCleanup) { mgCleanup(); mgCleanup = null; }
  stopMgPoller();
  mgDoneLocal = {};
  mgReadyLocal = new Set();
  podiumConfirmedLocal = new Set();
  const mg = { id: room.mg_id, config: JSON.parse(room.mg_config || '{}'), reward: room.mg_reward };
  const involved = JSON.parse(room.mg_players || '[]');
  const cfg = MINIGAME_LIST.find(m => m.id === mg.id);
  if (!cfg) return;

  showScreen('minigame');
  buildLiveBar(room, involved);
  // Poller runs for everyone - participants detect allDone, spectators detect mg_podium
  startMgPoller();

  // Spectator view
  if (!involved.includes(playerSlot)) {
    document.getElementById('mg-content').innerHTML = `<div class="minigame-intro">
      <div class="mg-emoji">${cfg.emoji}</div>
      <h2 class="mg-title">${T('mg.' + mg.id + '.name')}</h2>
      <p class="mg-desc">${T('mg.inProgress')}</p>
    </div>`;
    return;
  }

  const runners = {
    helpyBoop: () => playHelpyBoop(room, mg),
    moneyLaundry: () => playMoneyLaundry(room, mg),
    feedingFrenzy: () => playFeedingFrenzy(room, mg),
    guitarFinder: () => playGuitarFinder(room, mg),
    powerOut: () => playPowerOut(room, mg),
    flashlight: () => playFlashlight(room, mg),
    pizzaDough: () => playPizzaDough(room, mg),
  };
  runners[mg.id]?.();
}

// ── Live scores bar ───────────────────────────────────────────────────────────
function buildLiveBar(room, involved) {
  const bar = document.getElementById('mg-live-bar');
  bar.style.display = 'flex';
  bar.innerHTML = involved.map(s => {
    const char = room[`${s}_char`] || 'freddy';
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

async function submitScore(rawScore) {
  const score = rawScore + devScoreBonus;
  devScoreBonus = 0;
  mgDoneLocal[playerSlot] = score;
  liveScores[playerSlot] = score;
  updateLiveBar();
  broadcastCh?.send({ type: 'broadcast', event: 'mg_done', payload: { slot: playerSlot, score } });
  broadcastCh?.send({ type: 'broadcast', event: 'mg_score', payload: { slot: playerSlot, score } });

  // Write to DB
  if (slotNum(playerSlot) <= 4) {
    const { error: we } = await db.from('party_rooms').update({
      [mgScoreKey(playerSlot)]: score,
      [mgDoneKey(playerSlot)]: true,
    }).eq('id', roomId);
  }

  let r0 = null;
  try { const res = await db.from('party_rooms').select('*').eq('id', roomId).single(); r0 = res.data; } catch { }
  if (!r0) return;
  const inv0 = JSON.parse(r0.mg_players || '[]');

  if (r0.turn_phase === 'mg_podium') { stopMgPoller(); handleRoomUpdate(r0); return; }
  if (r0.turn_phase === 'minigame') {
    const allDone = inv0.every(s => r0[mgDoneKey(s)] || (s in mgDoneLocal));
    if (allDone) { stopMgPoller(); finishMinigame(r0); return; }
  }

  checkMgAllDoneLocal();

  const forceTry = async () => {
    if (!roomId) return;
    let r = null;
    try { r = (await db.from('party_rooms').select('*').eq('id', roomId).single()).data; } catch { }
    if (!r) return;
    if (r.turn_phase === 'mg_podium') { stopMgPoller(); handleRoomUpdate(r); return; }
    if (r.turn_phase !== 'minigame') return;
    const inv = JSON.parse(r.mg_players || '[]');
    const allDB = inv.every(s => r[mgDoneKey(s)]);
    const allBC = inv.every(s => s in mgDoneLocal);
    if (allDB || allBC) { stopMgPoller(); finishMinigame(r); }
  };
  setTimeout(forceTry, 2000);
  setTimeout(forceTry, 5000);
  setTimeout(forceTry, 10000);
}

async function finishMinigame(room) {
  try {
    const involved = JSON.parse(room.mg_players || '[]');
    if (!involved.length) return;
    const ranked = involved
      .map(s => ({ slot: s, score: mgDoneLocal[s] ?? room[mgScoreKey(s)] ?? 0 }))
      .sort((a, b) => b.score - a.score);

    const st = pState(room);
    const ns = pStats(room);

    // Helpy: double score of affected player in this minigame
    let helpyApplied = false;
    ranked.forEach(r => {
      if (ns[r.slot]?.helpyActive) {
        r.score = r.score * 2;
        ns[r.slot].helpyActive = false;
        helpyApplied = true;
      }
    });
    if (helpyApplied) ranked.sort((a, b) => b.score - a.score);

    const winner = ranked[0].slot;
    const loser = ranked[ranked.length - 1].slot;
    const topScore = ranked[0].score;
    const isTie = ranked.length > 1 && ranked.every(r => r.score === topScore);

    let mgConfig = {};
    try { mgConfig = JSON.parse(room.mg_config || '{}'); } catch { }
    const isChallenge = !!mgConfig.isChallenge;
    const rewardMul = mgConfig.rewardMul || 1;
    const reward = room.mg_reward || 0;
    let challengeCoinsChange = {};
    const actualCoinsChange = {}; // tracks real coin deltas for podium display

    if (isChallenge) {
      const challenger = mgConfig.challenger;
      const challengeReward = (mgConfig.challengeReward || 5) * rewardMul;
      const isPizzaReward = !!mgConfig.isPizzaReward;
      const challengerWon = ranked[0].slot === challenger;
      const others = involved.filter(s => s !== challenger);

      if (!isTie) {
        if (challengerWon) {
          if (isPizzaReward) {
            st.pizzas[challenger] = (st.pizzas[challenger] || 0) + 1;
          } else {
            const actualReward = micMultiplied(ns, challenger, challengeReward);
            st.coins[challenger] = (st.coins[challenger] || 0) + actualReward;
            challengeCoinsChange[challenger] = actualReward;
          }
          if (!ns[challenger]) ns[challenger] = { mgWins: 0, badLucks: 0 };
          ns[challenger].mgWins = (ns[challenger].mgWins || 0) + 1;
          if (!isPizzaReward) challengeCoinsChange[challenger] = micMultiplied(ns, challenger, challengeReward);
          emitEvent(`⚔️ ${room[`${challenger}_name`]} won the Challenge! ${isPizzaReward ? '+🍕' : '+' + challengeCoinsChange[challenger] + '🪙'}`);
        } else {
          // Challenger loses: deduct from challenger, split among others
          const actualLoss = micMultiplied(ns, challenger, -challengeReward);
          st.coins[challenger] = Math.max(0, (st.coins[challenger] || 0) + actualLoss);
          challengeCoinsChange[challenger] = actualLoss;
          const split = Math.ceil(challengeReward / Math.max(1, others.length));
          others.forEach(s => {
            const actualSplit = micMultiplied(ns, s, split);
            st.coins[s] = (st.coins[s] || 0) + actualSplit;
            challengeCoinsChange[s] = actualSplit;
          });
          if (!ns[winner]) ns[winner] = { mgWins: 0, badLucks: 0 };
          ns[winner].mgWins = (ns[winner].mgWins || 0) + 1;
          emitEvent(`⚔️ ${room[`${challenger}_name`]} lost the Challenge! Coins split among others`);
        }
      }
    } else {
      const mulTag = rewardMul > 1 ? ` (${rewardMul}×!)` : '';
      if (isTie) {
        const perPlayer = reward > 0 ? Math.max(1, Math.ceil(reward / ranked.length)) : 0;
        if (perPlayer > 0) {
          ranked.forEach(r => {
            const actual = micMultiplied(ns, r.slot, perPlayer);
            st.coins[r.slot] = (st.coins[r.slot] || 0) + actual;
            actualCoinsChange[r.slot] = actual;
          });
          emitEvent(`🎮 Minigame tied! Each player gets ${perPlayer}🪙`);
        } else {
          emitEvent(`🎮 Minigame tied!`);
        }
      } else {
        const actualReward = micMultiplied(ns, winner, reward);
        st.coins[winner] = (st.coins[winner] || 0) + actualReward;
        actualCoinsChange[winner] = actualReward;
        if (!ns[winner]) ns[winner] = { mgWins: 0, badLucks: 0 };
        ns[winner].mgWins = (ns[winner].mgWins || 0) + 1;
        const micTag = ns[winner]?.microphoneActive ? ' 🎤×2' : '';
        emitEvent(`🎮 ${room[`${winner}_name`]} won the minigame! +${actualReward}🪙${mulTag}${micTag}`);
      }
    }

    // Clear microphone effect for all involved players now that rewards are computed
    involved.forEach(s => { if (ns[s]?.microphoneActive) ns[s].microphoneActive = false; });

    const podiumRows = ranked.map(r => ({
      slot: r.slot, name: room[`${r.slot}_name`], char: room[`${r.slot}_char`] || 'freddy', score: r.score,
      coinsChange: isChallenge ? (challengeCoinsChange[r.slot] || 0) : (actualCoinsChange[r.slot] || 0),
    }));
    const nextPlayer = nextSlot(room);
    const mgCfg = MINIGAME_LIST.find(m => m.id === room.mg_id);

    const podiumCfg = {
      podium: podiumRows, nextPlayer, mgId: room.mg_id, isTie, rewardMul,
      mgName: mgCfg ? `${mgCfg.emoji} ${mgCfg.name}${rewardMul > 1 ? ` ${rewardMul}×` : ''}` : (isChallenge ? '⚔️ Challenge' : 'Minigame'),
    };
    const { data: updated } = await db.from('party_rooms').update({
      turn_phase: 'mg_podium',
      mg_config: JSON.stringify(podiumCfg),
      player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas),
      player_stats: JSON.stringify(ns),
      mg_done_p1: false, mg_done_p2: false, mg_done_p3: false, mg_done_p4: false,
    }).eq('id', roomId).eq('turn_phase', 'minigame').select('id');

    // Build the podium room for local display (works whether or not we won the DB race)
    const podiumRoom = {
      ...room, turn_phase: 'mg_podium', mg_config: JSON.stringify(podiumCfg),
      player_coins: JSON.stringify(st.coins), player_pizzas: JSON.stringify(st.pizzas),
      player_stats: JSON.stringify(ns),
      mg_done_p1: false, mg_done_p2: false, mg_done_p3: false, mg_done_p4: false,
    };
    roomData = podiumRoom;
    showScreen('board');
    renderBoard(podiumRoom);
    renderStatusBar(podiumRoom);
    updateTokens(podiumRoom);
    showMgPodium(podiumRoom);
    showDiceShop(podiumRoom);
  } catch (e) { console.error('[finishMinigame]', e); }
}

function showMgPodium(room) {
  const involved = JSON.parse(room.mg_players || '[]');
  let podiumRows = [], mgName = 'Minigame', isTie = false;
  try {
    const cfg = JSON.parse(room.mg_config || '{}');
    podiumRows = cfg.podium || [];
    mgName = cfg.mgName || 'Minigame';
    isTie = !!cfg.isTie;
  } catch { }

  const alreadyConfirmed = room[mgDoneKey(playerSlot)];
  const isInvolved = involved.includes(playerSlot);
  const myRank = podiumRows.findIndex(p => p.slot === playerSlot);

  document.getElementById('mg-result-overlay')?.remove();

  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'];

  const podiumHTML = podiumRows.map((p, i) => {
    const color = PLAYER_COLORS[slotNum(p.slot) - 1];
    const isMe = p.slot === playerSlot;
    const change = p.coinsChange > 0 ? `<span style="color:#2ecc71">+${p.coinsChange}${COIN_IMG}</span>`
      : p.coinsChange < 0 ? `<span style="color:#e74c3c">${p.coinsChange}${COIN_IMG}</span>` : '';
    return `<div class="pdm-row${isMe ? ' pdm-me' : ''}" style="border-color:${isMe ? color : 'transparent'}">
      <span class="pdm-medal">${isTie ? '🤝' : medals[i]}</span>
      <img class="pdm-avatar" src="${charImg(p.char)}" style="border-color:${color}" onerror="this.style.display='none'"/>
      <div class="pdm-info">
        <span class="pdm-name" style="color:${color}">${p.name}${isMe ? ` ${T('podium.you')}` : ''}</span>
        <span class="pdm-pts">${T('podium.pts', { n: p.score })} ${change}</span>
      </div>
    </div>`;
  }).join('');

  const tieCoins = podiumRows[0]?.coinsChange || 0;
  const verdict = isTie ? (tieCoins > 0 ? T('podium.tie', { n: tieCoins }) : T('podium.tieSplit'))
    : myRank === 0 ? T('podium.youWon')
      : myRank === podiumRows.length - 1 ? T('podium.youLost')
        : T('podium.youRank', { n: myRank + 1 });

  const overlay = document.createElement('div');
  overlay.id = 'mg-result-overlay';
  overlay.className = 'mg-result-overlay';
  overlay.innerHTML = `
    <div class="mg-result-card">
      <div class="mg-result-title">${mgName}</div>
      ${isInvolved ? `<div class="mg-result-verdict ${myRank === 0 && !isTie ? 'mg-result-win' : myRank === podiumRows.length - 1 && !isTie ? 'mg-result-lose' : ''}">${verdict}</div>` : ''}
      <div class="pdm-list">${podiumHTML}</div>
      ${!alreadyConfirmed && isInvolved
      ? `<button class="mp-btn primary" id="mg-result-confirm" style="margin-top:6px;width:100%">${T('podium.continue')}</button>`
      : `<p class="mg-result-waiting">${T('podium.waitingOthers')}</p>`}
    </div>`;

  document.body.appendChild(overlay);
  const btn = document.getElementById('mg-result-confirm');
  if (btn) btn.addEventListener('click', () => {
    btn.disabled = true; btn.textContent = '⏳';
    // PRIMARY: broadcast confirm (doesn't depend on DB columns)
    podiumConfirmedLocal.add(playerSlot);
    broadcastCh?.send({ type: 'broadcast', event: 'podium_confirm', payload: { slot: playerSlot } });
    // Also write to DB (best-effort)
    db.from('party_rooms').update({ [mgDoneKey(playerSlot)]: true }).eq('id', roomId).then(() => { }, () => { });
    overlay.remove();
    checkPodiumAllConfirmedLocal();
  }, { once: true });
}

async function confirmPodium() {
  await db.from('party_rooms').update({ [mgDoneKey(playerSlot)]: true }).eq('id', roomId);
}

// ── Helpy Boop ────────────────────────────────────────────────────────────────
function playHelpyBoop(room, mg) {
  let score = 0, timeLeft = 30, done = false;
  let spawnTimer, countTimer;
  const helpyImgSrc = '../assets/images/chars/other/helpy.gif';

  function end() {
    if (done) return; done = true;
    clearInterval(countTimer); clearTimeout(spawnTimer);
    const el = document.getElementById('mg-content');
    if (el) el.innerHTML = `<div class="mg-done-msg">${T('mg.waitingResults')}</div>`;
    submitScore(score);
  }
  mgCleanup = end;

  document.getElementById('mg-content').innerHTML = `<div class="mg-play helpy-boop">
    <div class="mg-hud">
      <img src="${helpyImgSrc}" style="width:28px;height:28px;object-fit:contain;border-radius:50%" onerror="this.style.display='none'"/>
      <span>${T('mg.helpy.hud')}</span>
      <span id="hb-score">👃 0</span>
      <span id="hb-timer">⏱ 30s</span>
    </div>
    <div class="hb-area" id="hb-area">
      <div style="padding:20px;text-align:center;color:var(--text-muted);font-size:.85rem">${T('mg.helpy.prompt')}</div>
    </div>
  </div>`;

  const area = document.getElementById('hb-area');
  const scoreEl = document.getElementById('hb-score');
  const timerEl = document.getElementById('hb-timer');

  function spawnHelpy() {
    if (done) return;
    const old = area.querySelector('.helpy-face');
    if (old) old.remove();
    const h = document.createElement('div');
    h.className = 'helpy-face';
    const maxX = Math.max(10, area.clientWidth - 72);
    const maxY = Math.max(10, area.clientHeight - 72);
    h.style.left = Math.random() * maxX + 'px';
    h.style.top = Math.random() * maxY + 'px';
    const img = document.createElement('img');
    img.src = helpyImgSrc; img.draggable = false;
    img.onerror = () => { h.textContent = '😊'; h.style.fontSize = '2.5rem'; h.style.background = '#ffcc44'; };
    h.appendChild(img);
    h.addEventListener('click', () => {
      if (done) return;
      score++;
      scoreEl.textContent = `👃 ${score}`;
      try { const a = new Audio('../assets/sounds/honk.mp3'); a.volume = 0.6; a.play(); } catch (e) { }
      liveScores[playerSlot] = score; updateLiveBar();
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
    if (timeLeft <= 0) end();
  }, 1000);
}

// ── Money Laundering (drag to Rockstar Freddy) ────────────────────────────────
function playMoneyLaundry(room, mg) {
  let deposited = 0, timeLeft = 30, done = false;
  let dragCoin = null, dragOX = 0, dragOY = 0;
  const rfSrc = '../assets/images/chars/rockstar/rockstar_freddy.png';

  function end() {
    if (done) return; done = true;
    clearInterval(ct);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onUp);
    const el = document.getElementById('mg-content');
    if (el) el.innerHTML = `<div class="mg-done-msg">${T('mg.waitingResults')}</div>`;
    submitScore(deposited);
  }
  mgCleanup = end;

  document.getElementById('mg-content').innerHTML = `<div class="mg-play money-laundry">
    <div class="mg-hud">
      <img src="${rfSrc}" style="width:26px;height:26px;object-fit:contain;border-radius:50%" onerror="this.style.display='none'"/>
      <span>${T('mg.money.hud')}</span>
      <span id="ml-dep">🏦 0</span>
      <span id="ml-timer">⏱ 30s</span>
    </div>
    <div class="ml-scene" id="ml-scene">
      <div class="ml-freddy-ring"></div>
      <div class="ml-freddy" id="ml-freddy">
        <img src="${rfSrc}" alt="Rockstar Freddy" draggable="false" onerror="this.innerHTML='🐻'"/>
      </div>
    </div>
    <p style="font-size:.75rem;color:var(--text-muted);text-align:center;margin:0">${T('mg.money.prompt')}</p>
  </div>`;

  const scene = document.getElementById('ml-scene');
  const freddy = document.getElementById('ml-freddy');
  const depEl = document.getElementById('ml-dep');
  const timerEl = document.getElementById('ml-timer');

  function isOverFreddy(x, y) {
    const r = freddy.getBoundingClientRect();
    return Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)) < 55;
  }

  function spawnCoin() {
    if (done) return;
    const coin = document.createElement('div');
    coin.className = 'ml-coin';
    const w = scene.clientWidth || 300, h = scene.clientHeight || 260;
    const cx0 = w / 2, cy0 = h / 2;
    let cx, cy, t = 0;
    do { cx = Math.random() * Math.max(w - 40, 40); cy = Math.random() * Math.max(h - 40, 40); t++; }
    while (t < 30 && Math.abs(cx - cx0) < 60 && Math.abs(cy - cy0) < 60);
    coin.style.left = cx + 'px'; coin.style.top = cy + 'px'; coin.innerHTML = `<img src="../assets/images/fazcoin.png" style="width:28px;height:28px;object-fit:contain;pointer-events:none;">`;
    coin.addEventListener('mousedown', startDrag);
    coin.addEventListener('touchstart', startDrag, { passive: false });
    scene.appendChild(coin);
  }

  function startDrag(e) {
    if (done) return; e.preventDefault();
    dragCoin = e.currentTarget;
    const client = e.touches ? e.touches[0] : e;
    const rect = dragCoin.getBoundingClientRect();
    dragOX = client.clientX - rect.left; dragOY = client.clientY - rect.top;
    dragCoin.classList.add('dragging');
  }
  const onMove = (e) => {
    if (!dragCoin) return; e.preventDefault();
    const client = e.touches ? e.touches[0] : e;
    const sr = scene.getBoundingClientRect();
    dragCoin.style.left = (client.clientX - sr.left - dragOX) + 'px';
    dragCoin.style.top = (client.clientY - sr.top - dragOY) + 'px';
  };
  const onUp = (e) => {
    if (!dragCoin) return;
    const client = e.changedTouches ? e.changedTouches[0] : e;
    dragCoin.classList.remove('dragging');
    if (isOverFreddy(client.clientX, client.clientY)) {
      deposited++; depEl.textContent = `🏦 ${deposited}`;
      try { const a = new Audio('../assets/sounds/money.mp3'); a.volume = 0.6; a.play(); } catch (e) { }
      liveScores[playerSlot] = deposited; updateLiveBar();
      broadcastCh?.send({ type: 'broadcast', event: 'mg_score', payload: { slot: playerSlot, score: deposited } });
      dragCoin.classList.add('deposited');
      const dc = dragCoin; dragCoin = null;
      setTimeout(() => { dc.remove(); spawnCoin(); }, 280);
    } else { dragCoin = null; }
  };

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onUp);

  for (let i = 0; i < 6; i++) setTimeout(spawnCoin, i * 150);

  const ct = setInterval(() => {
    timeLeft--;
    if (timerEl) timerEl.textContent = `⏱ ${timeLeft}s`;
    if (timeLeft <= 0) end();
  }, 1000);
}

// ── Feeding Frenzy ────────────────────────────────────────────────────────────
const FF_INGREDIENTS = ['🍅', '🧀', '🥓', '🫑', '🧅', '🍄', '🫒', '🌶️', '🥚', '🍗'];

function playFeedingFrenzy(room, mg) {
  const recipe = mg.config.recipe || [...FF_INGREDIENTS].sort(() => Math.random() - .5).slice(0, 3);
  const chSrc = '../assets/images/chars/classic/chica.png';
  let step = 0, done = false, ct = null;
  const start = Date.now();

  function end(score) {
    if (done) return; done = true;
    if (ct) clearInterval(ct);
    const el = document.getElementById('mg-content');
    if (el) el.innerHTML = `<div class="mg-done-msg">${T('mg.waitingResults')}</div>`;
    submitScore(score);
  }
  mgCleanup = () => end(0);

  function render() {
    if (done) return;
    const shuffled = [...FF_INGREDIENTS].sort(() => Math.random() - .5);
    document.getElementById('mg-content').innerHTML = `<div class="mg-play feeding-frenzy">
      <div class="mg-hud">
        <img class="ff-chica-img" src="${chSrc}" onerror="this.style.display='none'"/>
        <span>${T('mg.feedingFrenzy.name')}</span>
        <span>${step + 1}/${recipe.length}</span>
        <span id="ff-timer">⏱ 60s</span>
      </div>
      <div class="ff-recipe">
        <div class="ff-label">${T('mg.feeding.recipe')}</div>
        <div class="ff-recipe-items">
          ${recipe.map((ing, i) => `<span class="ff-recipe-ing ${i < step ? 'done' : i === step ? 'current' : ''}">${i < step ? '✅' : ing}</span>`).join('')}
        </div>
      </div>
      <div class="ff-instruction">${T('mg.feeding.click')} <span class="ff-target">${recipe[step]}</span></div>
      <div class="ff-ingredients" id="ff-grid">
        ${shuffled.map(ing => `<button class="mp-btn ff-ing-btn" data-ing="${ing}">${ing}</button>`).join('')}
      </div>
    </div>`;

    document.getElementById('ff-grid').addEventListener('click', (e) => {
      if (done) return;
      const btn = e.target.closest('.ff-ing-btn'); if (!btn) return;
      const ing = btn.dataset.ing;
      if (ing === recipe[step]) {
        step++;
        if (step >= recipe.length) {
          const elapsed = ((Date.now() - start) / 1000).toFixed(1);
          end(Math.round(1000 / parseFloat(elapsed)));
        } else render();
      } else {
        end(0);
      }
    });

    if (ct) clearInterval(ct);
    let tLeft = 60 - Math.floor((Date.now() - start) / 1000);
    ct = setInterval(() => {
      tLeft--;
      const te = document.getElementById('ff-timer'); if (te) te.textContent = `⏱ ${tLeft}s`;
      if (tLeft <= 0) end(0);
    }, 1000);
  }

  render();
}

// ── Guitar Finder ─────────────────────────────────────────────────────────────
const GF_ITEMS = ['🎹', '🥁', '🎺', '🎻', '🎤', '🔊', '💡', '🎭', '🎪', '🎨', '🪗', '🎵', '🎼', '🎙️', '🔔', '📯'];

function playGuitarFinder(room, mg) {
  const gPos = mg.config.guitarPos ?? Math.floor(Math.random() * 16);
  const items = Array.from({ length: 16 }, (_, i) =>
    i === gPos ? '🎸' : GF_ITEMS[Math.floor(Math.random() * GF_ITEMS.length)]);
  const start = Date.now();
  let timeLeft = 30, done = false;
  const bnSrc = '../assets/images/chars/classic/bonnie.png';

  function end(score) {
    if (done) return; done = true;
    clearInterval(ct);
    const el = document.getElementById('mg-content');
    if (el) el.innerHTML = `<div class="mg-done-msg">${T('mg.waitingResults')}</div>`;
    submitScore(score);
  }
  mgCleanup = () => end(0);

  document.getElementById('mg-content').innerHTML = `<div class="mg-play guitar-finder">
    <div class="mg-hud">
      <img class="gf-bonnie-img" src="${bnSrc}" onerror="this.style.display='none'"/>
      <span>${T('mg.guitarFinder.name')}</span>
      <span id="gf-timer">⏱ 30s</span>
    </div>
    <div class="gf-instruction">${T('mg.guitar.inst')}</div>
    <div class="gf-grid" id="gf-grid">
      ${items.map((item, i) => `<button class="mp-btn gf-item" data-idx="${i}">${item}</button>`).join('')}
    </div>
  </div>`;

  document.getElementById('gf-grid').addEventListener('click', (e) => {
    if (done) return;
    const btn = e.target.closest('.gf-item'); if (!btn) return;
    const idx = +btn.dataset.idx;
    if (idx === gPos) {
      end(Math.round(10000 / ((Date.now() - start) / 1000)));
    } else { btn.style.background = '#8b2020'; btn.disabled = true; }
  });

  const ct = setInterval(() => {
    timeLeft--;
    const te = document.getElementById('gf-timer'); if (te) te.textContent = `⏱ ${timeLeft}s`;
    if (timeLeft <= 0) end(0);
  }, 1000);
}

// ── Power Out ─────────────────────────────────────────────────────────────────
function playPowerOut(room, mg) {
  const attackDelay = mg.config.attackDelay ?? (Math.floor(Math.random() * 4000) + 500);
  const REACT_WINDOW = 3000;
  let done = false, freddyTime = 0;
  let reactPoll = null, dotTimer = null, attackTimer = null;
  const frSrc = '../assets/images/chars/classic/freddy.png';

  function end(score) {
    if (done) return; done = true;
    clearInterval(reactPoll); clearInterval(dotTimer); clearTimeout(attackTimer);
    const el = document.getElementById('mg-content');
    if (el) el.innerHTML = `<div class="mg-done-msg">${T('mg.waitingResults')}</div>`;
    submitScore(score);
  }
  mgCleanup = () => end(0);

  document.getElementById('mg-content').innerHTML = `<div class="mg-play power-out">
    <div class="mg-hud">
      <img src="${frSrc}" style="width:26px;height:26px;border-radius:50%;object-fit:contain" onerror="this.style.display='none'"/>
      <span>${T('mg.powerOut.name')}</span>
      <span id="po-status">🌑 ${T('mg.power.waiting')}...</span>
    </div>
    <div class="po-scene" id="po-scene">
      <div class="po-darkness"></div>
      <div class="po-freddy-container" id="po-fc">
        <img class="po-freddy-img" src="${frSrc}" alt="Freddy" onerror="this.textContent='🐻'"/>
      </div>
      <div class="po-instruction" id="po-inst">${T('mg.power.wait')}</div>
      <div id="po-bar-wrap" style="display:none;width:80%;height:8px;background:#333;border-radius:4px;z-index:3;overflow:hidden">
        <div id="po-bar" style="height:100%;background:#e74c3c;width:100%;transition:none"></div>
      </div>
      <button class="mp-btn primary po-door-btn" id="po-door" disabled>${T('mg.power.closeDoor')}</button>
    </div>
  </div>`;

  let dots = 0;
  dotTimer = setInterval(() => {
    dots = (dots + 1) % 4;
    const s = document.getElementById('po-status');
    if (s) s.textContent = '🌑 ' + T('mg.power.waiting') + '.'.repeat(dots);
  }, 500);

  attackTimer = setTimeout(() => {
    if (done) return;
    clearInterval(dotTimer);
    const scene = document.getElementById('po-scene');
    const door = document.getElementById('po-door');
    const status = document.getElementById('po-status');
    const inst = document.getElementById('po-inst');
    const barWrap = document.getElementById('po-bar-wrap');
    const bar = document.getElementById('po-bar');
    if (!scene) { end(0); return; }

    freddyTime = Date.now();
    scene.classList.add('freddy-incoming');
    if (status) status.textContent = T('mg.power.closeNow');
    if (inst) inst.textContent = T('mg.power.clickNow');
    if (door) door.disabled = false;
    if (barWrap) barWrap.style.display = 'block';
    if (bar) { bar.style.transition = `width ${REACT_WINDOW}ms linear`; requestAnimationFrame(() => { bar.style.width = '0%'; }); }

    reactPoll = setInterval(() => {
      if (done) { clearInterval(reactPoll); return; }
      if (Date.now() - freddyTime >= REACT_WINDOW) end(0);
    }, 50);

    if (door) door.addEventListener('click', () => {
      end(REACT_WINDOW - Math.min(REACT_WINDOW, Date.now() - freddyTime));
    }, { once: true });
  }, attackDelay);
}

// ── Flashlight ────────────────────────────────────────────────────────────────
function playFlashlight(room, mg) {
  const DURATION = 15000;
  let done = false, clicks = 0, foxyShown = false;
  let timer = null, foxyTimer = null, countdownTimer = null;

  function end(score) {
    if (done) return; done = true;
    clearInterval(timer); clearTimeout(foxyTimer); clearInterval(countdownTimer);
    const el = document.getElementById('mg-content');
    if (el) el.innerHTML = `<div class="mg-done-msg">${T('mg.waitingResults')}</div>`;
    submitScore(score);
  }
  mgCleanup = () => end(clicks);

  const wfSrc = '../assets/images/chars/withered/withered_foxy.png';
  document.getElementById('mg-content').innerHTML = `
    <div class="mg-play" style="gap:6px">
      <div class="mg-hud">
        <span>🔦 ${T('mg.flashlight.name')}</span>
        <span id="fl-time">${DURATION / 1000}s</span>
        <span id="fl-clicks">${T('mg.flash.taps', { n: 0 })}</span>
      </div>
      <div id="fl-scene" class="fl-scene">
        <div id="fl-beam" class="fl-beam"></div>
        <div id="fl-foxy" class="fl-foxy" style="display:none">
          <img src="${wfSrc}" alt="Withered Foxy" onerror="this.textContent='🦊'" draggable="false" style="pointer-events:none;-webkit-user-drag:none"/>
        </div>
        <div id="fl-tap-hint" class="fl-tap-hint">${T('mg.flash.tap')}</div>
      </div>
    </div>`;

  const scene = document.getElementById('fl-scene');
  const beam = document.getElementById('fl-beam');
  const foxyEl = document.getElementById('fl-foxy');
  const hint = document.getElementById('fl-tap-hint');

  let lit = false;
  function flash() {
    lit = !lit;
    scene.classList.toggle('fl-lit', lit);
    beam.style.opacity = lit ? '1' : '0';
  }

  scene.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (done) return;
    clicks++;
    document.getElementById('fl-clicks').textContent = T('mg.flash.taps', { n: clicks });
    flash();
    if (hint) hint.style.opacity = '0';
  });

  let elapsed = 0;
  countdownTimer = setInterval(() => {
    elapsed += 100;
    const left = Math.max(0, Math.ceil((DURATION - elapsed) / 1000));
    const tEl = document.getElementById('fl-time');
    if (tEl) tEl.textContent = `${left}s`;
    if (elapsed >= DURATION) end(clicks);
  }, 100);

  // Withered Foxy: 12% chance to appear briefly
  const foxyDelay = 3000 + Math.random() * 8000;
  foxyTimer = setTimeout(() => {
    if (done || !foxyEl) return;
    foxyShown = true;
    foxyEl.style.display = 'flex';
    foxyEl.classList.add('fl-foxy-scare');
    setTimeout(() => { if (foxyEl) { foxyEl.style.display = 'none'; foxyEl.classList.remove('fl-foxy-scare'); } }, 1200);
  }, Math.random() < 0.12 ? foxyDelay : DURATION + 1000);

  timer = setInterval(() => { if (done) clearInterval(timer); }, 200);
}

// ── Pizza Dough ───────────────────────────────────────────────────────────────
function playPizzaDough(room, mg) {
  const DURATION = 5000;
  let done = false, drawing = false, path = [], startTime = null;
  let countdownTimer = null;

  function circleScore(pts) {
    if (pts.length < 20) return 0;
    // Centroid
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    // Radii
    const radii = pts.map(p => Math.hypot(p.x - cx, p.y - cy));
    const rMean = radii.reduce((s, r) => s + r, 0) / radii.length;
    if (rMean < 20) return 0;
    const variance = radii.reduce((s, r) => s + (r - rMean) ** 2, 0) / radii.length;
    const stdDev = Math.sqrt(variance);
    const roundness = Math.max(0, 1 - stdDev / rMean);
    // Closure: distance between first and last point vs radius
    const closure = 1 - Math.min(1, Math.hypot(pts[0].x - pts[pts.length - 1].x, pts[0].y - pts[pts.length - 1].y) / (rMean * 2));
    return Math.round(roundness * 0.7 * 100 + closure * 0.3 * 100);
  }

  function drawPath(canvas, pts, score) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (pts.length < 2) return;
    // Draw circle guide (faint)
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    const rMean = pts.map(p => Math.hypot(p.x - cx, p.y - cy)).reduce((s, r) => s + r, 0) / pts.length;
    ctx.beginPath(); ctx.arc(cx, cy, rMean, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(200,134,0,.2)'; ctx.lineWidth = 2; ctx.stroke();
    // Draw user path
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    const hue = score > 70 ? 120 : score > 40 ? 45 : 0;
    ctx.strokeStyle = `hsl(${hue},80%,55%)`; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.stroke();
  }

  function end(score) {
    if (done) return; done = true;
    clearInterval(countdownTimer);
    const el = document.getElementById('mg-content');
    if (el) el.innerHTML = `<div class="mg-done-msg">${T('mg.waitingResults')}</div>`;
    submitScore(score);
  }
  mgCleanup = () => end(done ? undefined : circleScore(path));

  document.getElementById('mg-content').innerHTML = `
    <div class="mg-play" style="gap:6px">
      <div class="mg-hud">
        <span>🍕 ${T('mg.pizzaDough.name')}</span>
        <span id="pd-time">${DURATION / 1000}s</span>
        <span id="pd-score">${T('mg.pizza.draw')}</span>
      </div>
      <canvas id="pd-canvas" class="pd-canvas" width="360" height="300"></canvas>
      <div id="pd-hint" style="font-size:.72rem;color:var(--text-muted)">${T('mg.pizza.hint')}</div>
    </div>`;

  const canvas = document.getElementById('pd-canvas');

  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }

  canvas.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (done) return;
    drawing = true; path = [];
    path.push(getPos(e));
    const hint = document.getElementById('pd-hint');
    if (hint) hint.style.display = 'none';
  });
  canvas.addEventListener('pointermove', e => {
    e.preventDefault();
    if (!drawing || done) return;
    path.push(getPos(e));
    const s = circleScore(path);
    const sc = document.getElementById('pd-score');
    if (sc) sc.textContent = path.length > 30 ? `${s}%` : T('mg.pizza.keep');
    drawPath(canvas, path, s);
  });
  canvas.addEventListener('pointerup', e => {
    e.preventDefault();
    if (!drawing || done) return;
    drawing = false;
    if (path.length < 20) return;
    const s = circleScore(path);
    drawPath(canvas, path, s);
    const sc = document.getElementById('pd-score');
    if (sc) sc.textContent = `${s}% - ${s > 80 ? T('mg.circle.perfect') : s > 60 ? T('mg.circle.great') : s > 40 ? T('mg.circle.notBad') : T('mg.circle.tryAgain')}`;
    // Auto-submit on release if < 5s left, otherwise let them redraw
    const elapsed2 = Date.now() - startTime;
    if (DURATION - elapsed2 < 5000) end(s);
  });
  canvas.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
  canvas.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

  startTime = Date.now();
  let elapsed = 0;
  countdownTimer = setInterval(() => {
    elapsed += 100;
    const left = Math.max(0, Math.ceil((DURATION - elapsed) / 1000));
    const tEl = document.getElementById('pd-time');
    if (tEl) tEl.textContent = `${left}s`;
    if (elapsed >= DURATION) end(circleScore(path));
  }, 100);
}

// ── Result screen ─────────────────────────────────────────────────────────────
async function applyEndAwards(room) {
  const pc = room.player_count || 2;
  const active = allSlots(pc).filter(s => room[`${s}_name`]);
  const statsMap = pStats(room);
  const st = pState(room);

  const best = (key) => active.reduce((b, s) =>
    ((statsMap[s]?.[key] || 0) > (statsMap[b]?.[key] || 0) ? s : b), active[0]);

  const mgChamp = best('mgWins');
  const badLucky = best('badLucks');

  if ((statsMap[mgChamp]?.mgWins || 0) > 0) {
    st.pizzas[mgChamp] = (st.pizzas[mgChamp] || 0) + 1;
    emitEvent(`🎮 ${room[`${mgChamp}_name`]} wins the Minigame Champion award! +1🍕`);
  }
  if ((statsMap[badLucky]?.badLucks || 0) > 0) {
    st.pizzas[badLucky] = (st.pizzas[badLucky] || 0) + 1;
    emitEvent(`💀 ${room[`${badLucky}_name`]} wins the Most Unlucky award! +1🍕`);
  }

  const ns = { ...statsMap, _awardsApplied: true };
  await db.from('party_rooms').update({
    player_pizzas: JSON.stringify(st.pizzas),
    player_stats: JSON.stringify(ns),
  }).eq('id', roomId).eq('state', 'finished');
}

function showResult(room) {
  const pc = room.player_count || 2;
  const st = pState(room);

  const ranked = allSlots(pc)
    .filter(s => room[`${s}_name`])
    .map(s => ({
      slot: s,
      name: room[`${s}_name`],
      char: room[`${s}_char`] || 'freddy',
      color: PLAYER_COLORS[slotNum(s) - 1],
      pizzas: (st.pizzas[s] || 0),
      coins: (st.coins[s] || 0),
    }))
    .sort((a, b) => b.pizzas !== a.pizzas ? b.pizzas - a.pizzas : b.coins - a.coins);

  showScreen('result');
  const rankEl = document.getElementById('result-rankings');
  const winner = ranked[0];
  if (!winner) return;

  const statsMap = pStats(room);
  const mostMgWins = ranked.reduce((b, p) => ((statsMap[p.slot]?.mgWins || 0) > (statsMap[b.slot]?.mgWins || 0) ? p : b), ranked[0]);
  const mostBadLucks = ranked.reduce((b, p) => ((statsMap[p.slot]?.badLucks || 0) > (statsMap[b.slot]?.badLucks || 0) ? p : b), ranked[0]);

  rankEl.innerHTML = `
    <div class="result-winner-banner">
      <img class="rwb-avatar" src="${charImg(winner.char)}" onerror="this.style.display='none'"/>
      <div class="rwb-name" style="color:${winner.color}">${T('result.wins', { name: winner.name })}</div>
      <div class="rwb-score">${winner.pizzas !== 1 ? T('result.pizzas', { n: winner.pizzas }) : T('result.pizza1', { n: winner.pizzas })}</div>
    </div>
    ${ranked.map((p, i) => `
      <div class="result-rank-row${i === 0 ? ' result-winner' : ''}">
        <span class="result-medal">${['🥇', '🥈', '🥉', '4️⃣'][i]}</span>
        <img class="result-avatar" src="${charImg(p.char)}" onerror="this.style.display='none'"/>
        <span class="result-player-name" style="color:${p.color}">${p.name}</span>
        <span class="result-score">🍕${p.pizzas} ${COIN_IMG}${p.coins}</span>
      </div>`).join('')}
    <div class="result-awards">
      <div class="result-awards-title">${T('result.awards.title')}</div>
      <div class="result-award-row">
        <span class="award-icon">🎮</span>
        <span class="award-label">${T('result.awards.mgChamp')}</span>
        <span class="award-winner" style="color:${mostMgWins.color}">${mostMgWins.name}</span>
        <span class="award-detail">${(statsMap[mostMgWins.slot]?.mgWins || 0) !== 1 ? T('result.awards.wins', { n: statsMap[mostMgWins.slot]?.mgWins || 0 }) : T('result.awards.wins1', { n: 1 })}</span>
      </div>
      <div class="result-award-row">
        <span class="award-icon">💀</span>
        <span class="award-label">${T('result.awards.badLuck')}</span>
        <span class="award-winner" style="color:${mostBadLucks.color}">${mostBadLucks.name}</span>
        <span class="award-detail">${(statsMap[mostBadLucks.slot]?.badLucks || 0) !== 1 ? T('result.awards.badLucks', { n: statsMap[mostBadLucks.slot]?.badLucks || 0 }) : T('result.awards.badLuck1', { n: 1 })}</span>
      </div>
    </div>`;

  // Hide "Play Again" if game ended because someone left (only 1 active player)
  const wonByLeave = ranked.length === 1;
  const rematchBtn = document.getElementById('rematch-btn');
  if (rematchBtn) rematchBtn.style.display = wonByLeave ? 'none' : '';

  // Jumpscare - only for winner when opponents are present
  const isWinner = winner.slot === playerSlot;
  if (isWinner && !wonByLeave) {
    const wrap = document.querySelector('.party-result-wrap');
    const jsBtn = document.createElement('button');
    jsBtn.className = 'mp-btn accent jumpscare-btn';
    jsBtn.textContent = T('result.jumpscare');

    const picker = document.createElement('div');
    picker.className = 'jumpscare-picker';
    picker.style.display = 'none';

    const CHARS_WITH_JUMPSCARE = new Set(['freddy', 'bonnie', 'chica', 'foxy']);
    const jsOptions = [
      ...Object.entries(CHAR_CFG)
        .filter(([key]) => CHARS_WITH_JUMPSCARE.has(key))
        .map(([key, c]) => ({ key, label: c.name })),
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
  if (btn) { btn.disabled = true; btn.textContent = T('result.waiting'); }

  const room = roomData;
  const pc = room.player_count || 2;
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
  const voters = (room.mg_id || '').split(':').filter(s => /^player\d+$/.test(s));
  const ordered = voters.sort((a, b) => slotNum(a) - slotNum(b));
  if (!ordered.includes(playerSlot)) return; // I didn't vote, skip
  if (playerSlot !== ordered[0]) return;     // Only lowest voter executes

  const newCount = ordered.length;
  const taken = [], pos = {}, coins = {}, pizzas = {}, cooldowns = {};
  const { laps, mapType } = parseBoard(room);
  const rematchBoard = createBoard(mapType, laps);
  const update = {
    state: 'waiting', player_count: newCount,
    board: JSON.stringify(rematchBoard),
    player_stats: JSON.stringify({}),
    current_slot: 'player1', turn_phase: 'roll', dice_result: 0,
    mg_id: null, mg_config: '{}', mg_players: '[]', mg_reward: 1,
    mg_score_p1: 0, mg_score_p2: 0, mg_score_p3: 0, mg_score_p4: 0,
    mg_done_p1: false, mg_done_p2: false, mg_done_p3: false, mg_done_p4: false,
  };

  // Compact voter slots → player1, player2, …
  ordered.forEach((origSlot, idx) => {
    const ns = `player${idx + 1}`;
    update[`${ns}_id`] = room[`${origSlot}_id`];
    update[`${ns}_name`] = room[`${origSlot}_name`];
    update[`${ns}_char`] = null; // must re-pick
    let p; do { p = Math.floor(Math.random() * rematchBoard.boardSize); } while (taken.includes(p));
    taken.push(p);
    pos[ns] = p; coins[ns] = 0; pizzas[ns] = 0; cooldowns[ns] = 0;
  });
  // Clear unused slots
  for (let i = newCount + 1; i <= 6; i++) {
    const ns = `player${i}`;
    update[`${ns}_id`] = null; update[`${ns}_name`] = null; update[`${ns}_char`] = null;
  }
  Object.assign(update, {
    player_pos: JSON.stringify(pos),
    player_coins: JSON.stringify(coins),
    player_pizzas: JSON.stringify(pizzas),
    player_cooldowns: JSON.stringify(cooldowns),
  });

  await db.from('party_rooms').update(update).eq('id', roomId);
}

function restartParty() {
  roomId = null; playerSlot = null; roomData = null;
  liveScores = {}; activeMgId = null; mgWaitKey = null;
  stopMgPoller();
  if (mgCleanup) { mgCleanup(); mgCleanup = null; }
  const livebar = document.getElementById('mg-live-bar');
  if (livebar) livebar.style.display = 'none';
  showScreen('lobby');
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'party-toast';
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
  const room = roomData;
  const savedId = roomId;
  const savedSlot = playerSlot;
  // Clear local state immediately
  roomId = null; playerSlot = null; roomData = null;
  if (mgCleanup) { mgCleanup(); mgCleanup = null; }

  const pc = room.player_count || 2;
  const active = allSlots(pc).filter(s => room[`${s}_name`] && s !== savedSlot);
  const update = {
    [`${savedSlot}_name`]: null,
    [`${savedSlot}_id`]: null,
    [`${savedSlot}_char`]: null,
  };

  if (active.length === 0) {
    // Empty - nothing to do

  } else if (active.length === 1 && room.state === 'playing') {
    // Last player standing → auto-win
    update.state = 'finished';
    update.mg_id = null;

  } else if (active.length >= 1) {
    // Advance turn if it was the leaver's turn
    if (room.current_slot === savedSlot) {
      const order = allSlots(pc);
      const idx = order.indexOf(savedSlot);
      const next = order.slice(idx + 1).concat(order.slice(0, idx)).find(s => active.includes(s));
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

  try { await db.from('party_rooms').update(update).eq('id', savedId); } catch (_) { }
}

// Override goHome so leaving cleans up the room
const _coreGoHome = window.goHome;
window.goHome = async function () {
  await cleanupPlayerLeft();
  _coreGoHome?.();
};

// Cleanup on tab close / browser back
window.addEventListener('beforeunload', () => {
  if (!roomId || !playerSlot) return;
  const savedId = roomId;
  const savedSlot = playerSlot;
  const room = roomData || {};
  roomId = null; playerSlot = null; roomData = null;

  const pc = room.player_count || 2;
  const active = allSlots(pc).filter(s => room[`${s}_name`] && s !== savedSlot);
  const body = { [`${savedSlot}_name`]: null, [`${savedSlot}_id`]: null };
  if (active.length === 1 && room.state === 'playing') body.state = 'finished';
  if (active.length > 0 && room.current_slot === savedSlot) {
    const order = allSlots(pc);
    const idx = order.indexOf(savedSlot);
    const next = order.slice(idx + 1).concat(order.slice(0, idx)).find(s => active.includes(s));
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
