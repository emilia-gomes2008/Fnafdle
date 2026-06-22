/* ════════════════════════════════════════════════════════════
   FNAF TCG - Auth, Collection, Boosters & Trading  (tcg-auth.js)
   Depends on: tcg-cards.js, tcg.js (CARDS, GENERIC globals)
   ════════════════════════════════════════════════════════════ */

// ── SHA-256 ──────────────────────────────────────────────────
// Uses Web Crypto when available (HTTPS/localhost), pure-JS fallback for HTTP.
async function tcgHash(str) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) { }
  }
  return _sha256(str);
}

function _sha256(msg) {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  const rr = (x, n) => (x >>> n) | (x << (32 - n));
  // UTF-8 encode
  const b = [];
  for (let i = 0; i < msg.length; i++) {
    const c = msg.charCodeAt(i);
    if (c < 0x80) b.push(c);
    else if (c < 0x800) b.push((c >> 6) | 0xC0, (c & 0x3F) | 0x80);
    else b.push((c >> 12) | 0xE0, ((c >> 6) & 0x3F) | 0x80, (c & 0x3F) | 0x80);
  }
  const bitLen = b.length * 8;
  b.push(0x80);
  while ((b.length % 64) !== 56) b.push(0);
  for (let i = 7; i >= 0; i--) b.push((bitLen / Math.pow(2, i * 8)) & 0xFF);
  let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  for (let blk = 0; blk < b.length; blk += 64) {
    const W = Array(64);
    for (let j = 0; j < 16; j++) W[j] = (b[blk + j * 4] << 24) | (b[blk + j * 4 + 1] << 16) | (b[blk + j * 4 + 2] << 8) | b[blk + j * 4 + 3];
    for (let j = 16; j < 64; j++) {
      const s0 = rr(W[j - 15], 7) ^ rr(W[j - 15], 18) ^ (W[j - 15] >>> 3);
      const s1 = rr(W[j - 2], 17) ^ rr(W[j - 2], 19) ^ (W[j - 2] >>> 10);
      W[j] = (W[j - 16] + s0 + W[j - 7] + s1) | 0;
    }
    let [a, b2, c, d, e, f, g, h] = H;
    for (let j = 0; j < 64; j++) {
      const S1 = (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)), ch = (e & f) ^ (~e & g);
      const T1 = (h + S1 + ch + K[j] + W[j]) | 0;
      const S0 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)), maj = (a & b2) ^ (a & c) ^ (b2 & c);
      const T2 = (S0 + maj) | 0;
      h = g; g = f; f = e; e = (d + T1) | 0; d = c; c = b2; b2 = a; a = (T1 + T2) | 0;
    }
    H[0] = (H[0] + a) | 0; H[1] = (H[1] + b2) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
  }
  return H.map(x => (x >>> 0).toString(16).padStart(8, '0')).join('');
}

// ── Session (localStorage) ───────────────────────────────────
const TCG_AUTH_KEY = 'tcg_auth_v1';
window.TCG_USER = null;       // { id, username, points }
window.TCG_COLLECTION = {};      // { card_id: quantity }

function _authLoad() {
  try { window.TCG_USER = JSON.parse(localStorage.getItem(TCG_AUTH_KEY) || 'null'); } catch { window.TCG_USER = null; }
}
function _authSave(session) {
  window.TCG_USER = session;
  localStorage.setItem(TCG_AUTH_KEY, JSON.stringify(session));
}
function _authClear() {
  window.TCG_USER = null;
  window.TCG_COLLECTION = {};
  localStorage.removeItem(TCG_AUTH_KEY);
}

// ── Supabase client (reuse MP.db if available) ───────────────
function _getDB() {
  if (window.MP?.db) return window.MP.db;
  const cfg = window.FNAF_CONFIG || {};
  if (typeof supabase !== 'undefined' && cfg.SUPABASE_URL) {
    if (!window.MP) window.MP = {};
    window.MP.db = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    return window.MP.db;
  }
  return null;
}

// ── Register ─────────────────────────────────────────────────
async function tcgRegister(username, password) {
  const db = _getDB();
  if (!db) throw new Error('No database connection');
  username = username.trim().toLowerCase();
  if (username.length < 3) throw new Error('Username must be at least 3 characters');
  if (!/^[a-z0-9_]+$/.test(username)) throw new Error('Username can only contain letters, numbers and _');
  if (_containsHate(username)) throw new Error('Username not allowed');
  if (password.length < 4) throw new Error('Password must be at least 4 characters');

  const hash = await tcgHash(password);

  const { data: existing } = await db.from('tcg_users')
    .select('id').eq('username', username).maybeSingle();
  if (existing) throw new Error('Username already taken');

  const { data, error } = await db.from('tcg_users')
    .insert({ username, password_hash: hash, points: 0 })
    .select('id, username, points').single();
  if (error) throw new Error(error.message);

  // Starter collection: FNAF1 prebuilt deck cards
  const STARTER = [
    ['endo_01', 6], ['freddy', 2], ['bonnie', 1], ['chica', 1], ['foxy', 2], ['golden_freddy', 1],
    ['energy_remnant', 6], ['energy_agony', 1],
    ['cupcake', 2], ['power_out', 1], ['dee_dee_pearl', 3], ['birthday_cake', 3],
    ['system_corrupt', 2], ['energy_recharge', 3],
    ['phone_guy', 3], ['henry_emily', 1], ['fazbear_tech', 2],
    ['class_classic', 1]
  ];
  const starterRows = STARTER.map(([card_id, quantity]) => ({ user_id: data.id, card_id, quantity }));
  await db.from('tcg_user_cards').insert(starterRows);
  window.TCG_COLLECTION = Object.fromEntries(STARTER);

  _authSave({ id: data.id, username: data.username, points: data.points });
  return data;
}

// ── IP Rate Limiting ─────────────────────────────────────────
const _IP_MAX_ATTEMPTS = 5;
const _IP_BLOCK_MS = 2 * 60 * 60 * 1000; // 2 hours

async function _getClientIP() {
  try {
    const r = await fetch('https://api.ipify.org?format=json');
    const j = await r.json();
    return j.ip || 'unknown';
  } catch { return 'unknown'; }
}

async function _checkIPBlock(ip) {
  const db = _getDB(); if (!db) return { blocked: false, attempts: 0 };
  const { data } = await db.from('tcg_ip_blocks')
    .select('attempts, blocked_until').eq('ip', ip).maybeSingle();
  if (!data) return { blocked: false, attempts: 0 };
  if (data.blocked_until && new Date(data.blocked_until) > new Date()) {
    const mins = Math.ceil((new Date(data.blocked_until) - Date.now()) / 60000);
    return { blocked: true, minutesLeft: mins };
  }
  return { blocked: false, attempts: data.attempts || 0 };
}

async function _recordFailedAttempt(ip, currentAttempts) {
  const db = _getDB(); if (!db) return;
  const newAttempts = currentAttempts + 1;
  const blockedUntil = newAttempts >= _IP_MAX_ATTEMPTS
    ? new Date(Date.now() + _IP_BLOCK_MS).toISOString()
    : null;
  await db.from('tcg_ip_blocks')
    .upsert({ ip, attempts: newAttempts, blocked_until: blockedUntil }, { onConflict: 'ip' });
}

async function _clearIPAttempts(ip) {
  const db = _getDB(); if (!db) return;
  await db.from('tcg_ip_blocks')
    .upsert({ ip, attempts: 0, blocked_until: null }, { onConflict: 'ip' });
}

// ── Login ────────────────────────────────────────────────────
async function tcgLogin(username, password) {
  const db = _getDB();
  if (!db) throw new Error('No database connection');
  username = username.trim().toLowerCase();

  const ip = await _getClientIP();
  const ipStatus = await _checkIPBlock(ip);
  if (ipStatus.blocked) {
    const h = Math.floor(ipStatus.minutesLeft / 60);
    const m = ipStatus.minutesLeft % 60;
    const timeStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
    throw new Error(`Too many failed attempts. Try again in ${timeStr}.`);
  }

  const hash = await tcgHash(password);
  const { data, error } = await db.from('tcg_users')
    .select('id, username, points, password_hash')
    .eq('username', username).maybeSingle();

  const credentialsOk = data && !error && data.password_hash === hash;
  if (!credentialsOk) {
    await _recordFailedAttempt(ip, ipStatus.attempts);
    const used = ipStatus.attempts + 1;
    if (used >= _IP_MAX_ATTEMPTS) {
      throw new Error('Too many failed attempts. Your IP is blocked for 2 hours.');
    }
    const left = _IP_MAX_ATTEMPTS - used;
    if (!data || error) throw new Error(`User not found. ${left} attempt${left !== 1 ? 's' : ''} remaining.`);
    throw new Error(`Wrong password. ${left} attempt${left !== 1 ? 's' : ''} remaining.`);
  }

  await _clearIPAttempts(ip);
  const session = { id: data.id, username: data.username, points: data.points };
  _authSave(session);
  window.TCG_COLLECTION = await tcgGetCollection(data.id);
  return session;
}

// ── Logout ───────────────────────────────────────────────────
function tcgLogout() {
  _authClear();
  if (typeof initCloudDecks === 'function') initCloudDecks(); // resets _cloudDecks to null
  renderAuthBar();
  switchTab('play');
}

// ── Points ───────────────────────────────────────────────────
async function tcgAddPoints(userId, delta) {
  const db = _getDB(); if (!db) return;
  const { data } = await db.from('tcg_users').select('points').eq('id', userId).single();
  const newPts = Math.max(0, (data?.points || 0) + delta);
  await db.from('tcg_users').update({ points: newPts }).eq('id', userId);
  if (window.TCG_USER?.id === userId) {
    window.TCG_USER.points = newPts;
    _authSave(window.TCG_USER);
    renderAuthBar();
  }
  return newPts;
}

async function tcgRefreshPoints() {
  if (!window.TCG_USER) return;
  const db = _getDB(); if (!db) return;
  const { data } = await db.from('tcg_users').select('points').eq('id', window.TCG_USER.id).single();
  if (data) {
    window.TCG_USER.points = data.points;
    _authSave(window.TCG_USER);
    renderAuthBar();
  }
}

// ── Cloud Decks ───────────────────────────────────────────────
async function tcgGetCloudDecks() {
  const db = _getDB(); if (!db || !window.TCG_USER) return null;
  const { data, error } = await db.from('tcg_users')
    .select('decks').eq('id', window.TCG_USER.id).maybeSingle();
  if (error || !data) return null;
  return Array.isArray(data.decks) ? data.decks : [];
}

async function tcgSaveCloudDecks(decks) {
  const db = _getDB(); if (!db || !window.TCG_USER) return;
  await db.from('tcg_users').update({ decks }).eq('id', window.TCG_USER.id);
}

// ── Collection ───────────────────────────────────────────────
async function tcgGetCollection(userId) {
  const db = _getDB(); if (!db) return {};
  const { data } = await db.from('tcg_user_cards').select('card_id, quantity').eq('user_id', userId);
  const out = {};
  (data || []).forEach(r => { out[r.card_id] = r.quantity; });
  return out;
}

async function _tcgUpsertCards(userId, entries) {
  // entries = [{card_id, delta}]
  const db = _getDB(); if (!db) return;
  for (const { card_id, delta } of entries) {
    const { data: ex } = await db.from('tcg_user_cards')
      .select('id, quantity').eq('user_id', userId).eq('card_id', card_id).maybeSingle();
    const newQty = Math.max(0, (ex?.quantity || 0) + delta);
    if (ex) {
      await db.from('tcg_user_cards').update({ quantity: newQty }).eq('id', ex.id);
    } else if (delta > 0) {
      await db.from('tcg_user_cards').insert({ user_id: userId, card_id, quantity: delta });
    }
    if (window.TCG_USER?.id === userId) {
      if (newQty > 0) window.TCG_COLLECTION[card_id] = newQty;
      else delete window.TCG_COLLECTION[card_id];
    }
  }
}

// ── Booster Definitions ──────────────────────────────────────
const BOOSTER_COST = 10;
const BOOSTER_SIZE = 10; // 9 regular + 1 forced energy

const BOOSTERS = {
  cries_of_the_past: {
    id: 'cries_of_the_past',
    name: 'Cries of the Past',
    subtitle: 'FNAF 1-3',
    desc: 'Classics, Toys, Withereds, Shadows & Phantoms',
    color: '#7ad',
    bg: '#07141f',
    classPool: ['class_classic', 'class_toy', 'class_withered', 'class_phantom', 'class_shadow'],
    classChance: 0.05,
    energyPool: ['energy_remnant', 'energy_agony', 'energy_phantom_agony'],
    regularPool: [
      // Endos (higher weight = multiple entries)
      'endo_01', 'endo_01', 'endo_01',
      'endo_02', 'endo_02', 'endo_02',
      'spring_endo', 'spring_endo',
      // Classic
      'freddy', 'bonnie', 'chica', 'foxy', 'golden_freddy',
      // Toy
      'toy_freddy', 'toy_bonnie', 'toy_chica', 'mangle', 'bb', 'jj', 'puppet',
      // Withered
      'withered_freddy', 'withered_bonnie', 'withered_chica', 'withered_foxy', 'withered_golden',
      // Phantom
      'springtrap', 'fredbear', 'springbonnie',
      'p_freddy', 'p_chica', 'p_bb', 'p_foxy', 'p_mangle', 'p_puppet',
      // Shadow
      'shadow_freddy', 'rwqfsfasxc',
      // Items (common ones get extra weight)
      'cupcake', 'cupcake', 'mini_cupcake', 'mini_cupcake',
      'birthday_cake', 'birthday_cake',
      'energy_recharge', 'energy_recharge',
      'lantern', 'power_out', 'dee_dee_pearl',
      'power_battery', 'security_tape', 'antidote', 'data_escape', 'system_corrupt',
      // Tools
      'freddy_mask', 'mendos_endos', 'hat_mic', 'guitar_axe', 'hook',
      'springlock_device', 'fireproof_suit', 'static_dampener', 'puppet_box',
      'fragmento_remnant', 'purple_guy',
      // Supporters
      'phone_guy', 'phone_guy', 'henry_emily', 'fazbear_tech',
      'william_afton', 'helpy', 'william_search', 'mrs_afton', 'night_guard'
    ]
  },
  flames_of_agony: {
    id: 'flames_of_agony',
    name: 'Flames of Agony',
    subtitle: 'FNAF 4-6',
    desc: 'Nightmares, Jack-Os, Funtimes, Scraps & Rockstars',
    color: '#e84',
    bg: '#1f0900',
    classPool: ['class_nightmare', 'class_jacko', 'class_funtime', 'class_scrap', 'class_rockstar'],
    classChance: 0.05,
    energyPool: ['energy_remnant', 'energy_agony', 'energy_phantom_agony'],
    regularPool: [
      // Endos
      'endo_nm', 'endo_nm', 'endo_nm',
      'yenndo', 'yenndo', 'yenndo',
      'rockstar', 'rockstar',
      // Nightmare
      'nightmare_freddy', 'nightmare_bonnie', 'nightmare_chica', 'nightmare_foxy',
      'nightmare_fredbear', 'plushtrap', 'nightmare_bb', 'nightmarionne',
      // Jack-O
      'jacko_bonnie', 'jacko_chica', 'jacko_lantern',
      'grim_foxy', 'grim_foxy',
      // Funtime
      'baby', 'ballora', 'funtime_freddy', 'funtime_foxy', 'yenndo_shell', 'lolbit', 'ennard',
      // Scrap
      'scraptrap', 'scrap_baby', 'molten_freddy', 'lefty',
      // Rockstar
      'rockstar_freddy', 'rockstar_bonnie', 'rockstar_chica', 'rockstar_foxy', 'carnie',
      // Trash n' Gang items (extra weight)
      'bucket_bob', 'bucket_bob', 'pan_stan', 'pan_stan',
      'no_1_crate', 'no_1_crate', 'mr_hugs', 'mr_hugs',
      'ennard_summon',
      // Tools
      'mr_can_do', 'mr_can_do',
      // Mediocre Melodies supporters (extra weight)
      'happy_frog', 'happy_frog', 'mr_hippo', 'mr_hippo',
      'pigpatch', 'pigpatch', 'nedd_bear', 'nedd_bear', 'orville_elephant', 'orville_elephant',
    ]
  },
  haunting_future: {
    id: 'haunting_future',
    name: 'Haunting Future',
    subtitle: 'FNAF Help Wanted',
    desc: 'Glitchtrap, Grim Foxy, Dreadbear & more from the Steel Wool era',
    color: '#b47fff',
    bg: '#0d001a',
    classPool: ['class_nightmare', 'class_jacko', 'class_glamrock', 'class_ruined', 'class_mimic'],
    classChance: 0.05,
    energyPool: ['energy_remnant', 'energy_agony', 'energy_phantom_agony'],
    regularPool: [
      // Endos
      'endo_nm', 'endo_nm', 'endo_nm', 'endo_01',
      'm2_endo', 'm2_endo', 'm2_endo',
      // Shells - Haunting Future
      'dreadbear', 'dreadbear',
      'glitchtrap',
      // Shells - Mimic
      'jackie', 'jackie',
      'big_top', 'big_top',
      'nurse_dollie', 'nurse_dollie',
      'party_time_chica', 'party_time_chica',
      'tiger_rock', 'm2_mimic',
      // Shells - Classic Variants
      'dark_freddy', 'dark_freddy', 'party_freddy', 'party_freddy',
      'neon_bonnie', 'neon_bonnie', 'neon_chica', 'neon_chica',
      'burnt_foxy', 'burnt_foxy',
      // Shells - Shadow
      'shadow_mangle', 'shadow_mangle',
      // Items
      'party_popper', 'party_popper', 'strobe_flash', 'strobe_flash',
      'party_hat', 'party_hat',
      'tilt', 'tilt',
      // Tools
      'shadow_band', 'shadow_band', 'repair_kit', 'repair_kit',
      // Supporters
      'plush_baby', 'plush_baby', 'plush_baby',
      'funtime_attendant', 'funtime_attendant', 'crying_child', 'crying_child',
      'party_guests', 'party_guests', 'vanny',
      // Endos
      'glamrock_endo', 'glamrock_endo', 'glamrock_endo',
      'tangle_blob', 'tangle_blob',
      // Glamrock Shells
      'glamrock_freddy', 'glamrock_freddy',
      'glamrock_chica', 'glamrock_chica',
      'roxy', 'roxy',
      'monty', 'monty',
      'sun', 'sun',
      'moon', 'moon',
      'glamrock_bonnie', 'glamrock_bonnie',
      // Ruined Shells
      'ruined_roxy', 'ruined_roxy',
      'ruined_freddy', 'ruined_freddy',
      'ruined_chica', 'ruined_chica',
      'ruined_monty', 'ruined_monty',
      'eclipse',
      // Special Shells
      'burntrap',
      'mxes', 'mxes',
      // Items
      'ruined_lil', 'ruined_lil',
      'ruined_dj', 'ruined_dj',
      // Tools
      'ruined_sun', 'ruined_sun',
      'ruined_moon', 'ruined_moon',
      // Supporters
      'glamrock_mr_hippo', 'glamrock_mr_hippo',
      'dj_music_man', 'dj_music_man',
      'edwin', 'edwin',
      'fiona', 'fiona',
      'david', 'david',
      'm1', 'm1'
    ]
  }
};

// ── Open Booster ─────────────────────────────────────────────
async function tcgOpenBooster(boosterId, qty = 1) {
  if (!window.TCG_USER) throw new Error('Not logged in');
  await tcgRefreshPoints();
  const totalCost = BOOSTER_COST * qty;
  if (window.TCG_USER.points < totalCost)
    throw new Error(`Not enough points (need ${totalCost}, have ${window.TCG_USER.points})`);

  const bDef = BOOSTERS[boosterId];
  if (!bDef) throw new Error('Unknown booster');

  const allDrawn = [];
  for (let b = 0; b < qty; b++) {
    const drawn = [];
    for (let i = 0; i < BOOSTER_SIZE - 1; i++) {
      drawn.push(Math.random() < bDef.classChance
        ? bDef.classPool[Math.floor(Math.random() * bDef.classPool.length)]
        : bDef.regularPool[Math.floor(Math.random() * bDef.regularPool.length)]);
    }
    drawn.push(bDef.energyPool[Math.floor(Math.random() * bDef.energyPool.length)]);
    allDrawn.push(...drawn);
  }

  await tcgAddPoints(window.TCG_USER.id, -totalCost);

  const tally = {};
  allDrawn.forEach(id => { tally[id] = (tally[id] || 0) + 1; });
  await _tcgUpsertCards(window.TCG_USER.id, Object.entries(tally).map(([card_id, delta]) => ({ card_id, delta })));

  return allDrawn;
}

// ── Trades ───────────────────────────────────────────────────
async function tcgGetTrades() {
  const db = _getDB(); if (!db) return [];
  const { data } = await db.from('tcg_trades')
    .select('*').eq('status', 'pending')
    .order('created_at', { ascending: false }).limit(60);
  return data || [];
}

async function tcgPostTrade(offerCardId, wantCardId) {
  if (!window.TCG_USER) throw new Error('Not logged in');
  if ((window.TCG_COLLECTION[offerCardId] || 0) < 1) throw new Error("You don't have that card");
  const db = _getDB();
  const { data, error } = await db.from('tcg_trades').insert({
    from_user_id: window.TCG_USER.id,
    from_username: window.TCG_USER.username,
    offer_card_id: offerCardId,
    want_card_id: wantCardId,
    status: 'pending'
  }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

async function tcgAcceptTrade(tradeId) {
  if (!window.TCG_USER) throw new Error('Not logged in');
  const db = _getDB();
  const { data: trade } = await db.from('tcg_trades').select('*').eq('id', tradeId).single();
  if (!trade || trade.status !== 'pending') throw new Error('Trade no longer available');
  if (trade.from_user_id === window.TCG_USER.id) throw new Error("You can't accept your own trade");

  if ((window.TCG_COLLECTION[trade.want_card_id] || 0) < 1)
    throw new Error("You don't have the requested card");

  const theirCol = await tcgGetCollection(trade.from_user_id);
  if ((theirCol[trade.offer_card_id] || 0) < 1)
    throw new Error('The other user no longer has that card');

  // Execute swap
  await _tcgUpsertCards(trade.from_user_id, [
    { card_id: trade.offer_card_id, delta: -1 },
    { card_id: trade.want_card_id, delta: 1 }
  ]);
  await _tcgUpsertCards(window.TCG_USER.id, [
    { card_id: trade.want_card_id, delta: -1 },
    { card_id: trade.offer_card_id, delta: 1 }
  ]);

  await db.from('tcg_trades').update({
    status: 'accepted',
    accepted_by_user_id: window.TCG_USER.id,
    accepted_by_username: window.TCG_USER.username
  }).eq('id', tradeId);
}

async function tcgCancelTrade(tradeId) {
  if (!window.TCG_USER) throw new Error('Not logged in');
  const db = _getDB();
  await db.from('tcg_trades').update({ status: 'cancelled' })
    .eq('id', tradeId).eq('from_user_id', window.TCG_USER.id);
}

// ═══════════════════════════════════════════════════════════════
// UI - Auth Bar
// ═══════════════════════════════════════════════════════════════
function renderAuthBar() {
  const bar = document.getElementById('tcg-auth-bar');
  if (!bar) return;
  const showPts = bar.dataset.showPoints === 'true';
  if (window.TCG_USER) {
    bar.innerHTML = `
      <span class="auth-username">👤 ${_escHtml(window.TCG_USER.username)}</span>
      ${showPts ? `<span class="auth-points" id="auth-points-display">⭐ ${window.TCG_USER.points} pts</span>` : ''}
      <button class="tcg-btn small" onclick="tcgLogout()">Log Out</button>`;
  } else {
    bar.innerHTML = `
      <span class="auth-guest">Not logged in</span>
      <button class="tcg-btn small primary" onclick="showAuthModal('login')">Login</button>
      <button class="tcg-btn small" onclick="showAuthModal('register')">Register</button>`;
  }
}

// ═══════════════════════════════════════════════════════════════
// UI - Auth Modal (Login / Register)
// ═══════════════════════════════════════════════════════════════
function showAuthModal(mode) {
  const existing = document.getElementById('tcg-auth-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'tcg-auth-modal-overlay';
  overlay.className = 'auth-modal-overlay';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

  overlay.innerHTML = `
    <div class="auth-modal">
      <h3 class="auth-modal-title">${mode === 'login' ? 'Login' : 'Register'}</h3>
      <div class="auth-tabs">
        <button class="auth-tab${mode === 'login' ? ' active' : ''}" onclick="switchAuthMode('login',this)">Login</button>
        <button class="auth-tab${mode === 'register' ? ' active' : ''}" onclick="switchAuthMode('register',this)">Register</button>
      </div>

      <div id="auth-form-login" class="auth-form" style="${mode !== 'login' ? 'display:none' : ''}">
        <input id="auth-login-user" class="tcg-input" type="text" placeholder="Username" autocomplete="username" />
        <input id="auth-login-pass" class="tcg-input" type="password" placeholder="Password" autocomplete="current-password" />
        <div id="auth-login-err" class="auth-error"></div>
        <button class="tcg-btn primary" style="width:100%" onclick="doLogin()">Log In</button>
      </div>

      <div id="auth-form-register" class="auth-form" style="${mode !== 'register' ? 'display:none' : ''}">
        <input id="auth-reg-user" class="tcg-input" type="text" placeholder="Username (3+ chars, a-z0-9_)" autocomplete="username" />
        <input id="auth-reg-pass" class="tcg-input" type="password" placeholder="Password (4+ chars)" autocomplete="new-password" />
        <input id="auth-reg-conf" class="tcg-input" type="password" placeholder="Confirm Password" autocomplete="new-password" />
        <div id="auth-reg-err" class="auth-error"></div>
        <button class="tcg-btn primary" style="width:100%" onclick="doRegister()">Create Account</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  // Enter key submits
  overlay.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const activeForm = overlay.querySelector('.auth-form:not([style*="none"])');
        activeForm?.querySelector('button.primary')?.click();
      }
    });
  });
}

function switchAuthMode(mode, btn) {
  btn.closest('.auth-modal').querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  ['login', 'register'].forEach(m => {
    const f = document.getElementById(`auth-form-${m}`);
    if (f) f.style.display = m === mode ? '' : 'none';
  });
}

async function doLogin() {
  const errEl = document.getElementById('auth-login-err');
  const user = document.getElementById('auth-login-user')?.value;
  const pass = document.getElementById('auth-login-pass')?.value;
  errEl.textContent = '';
  const btn = errEl.parentElement.querySelector('button');
  btn.disabled = true; btn.textContent = 'Logging in…';
  try {
    await tcgLogin(user, pass);
    document.getElementById('tcg-auth-modal-overlay')?.remove();
    renderAuthBar();
    _prefillPlayerName();
    if (typeof initCloudDecks === 'function') await initCloudDecks();
    // Refresh whatever tab is currently active
    const active = document.querySelector('.lobby-tab.active')?.id;
    if (active === 'tab-deck') {
      renderDeckBuilderGate();
      renderCardPool(); renderDeckList(); renderSavedDecks();
    }
    if (active === 'tab-collection') renderCollectionTab();
    if (active === 'tab-booster') renderBoosterTab();
    if (active === 'tab-trade') renderTradeTab();
  } catch (e) {
    errEl.textContent = e.message;
  } finally {
    btn.disabled = false; btn.textContent = 'Log In';
  }
}

async function doRegister() {
  const errEl = document.getElementById('auth-reg-err');
  const user = document.getElementById('auth-reg-user')?.value;
  const pass = document.getElementById('auth-reg-pass')?.value;
  const conf = document.getElementById('auth-reg-conf')?.value;
  errEl.textContent = '';
  if (pass !== conf) { errEl.textContent = 'Passwords do not match'; return; }
  const btn = errEl.parentElement.querySelector('button');
  btn.disabled = true; btn.textContent = 'Registering…';
  try {
    await tcgRegister(user, pass);
    document.getElementById('tcg-auth-modal-overlay')?.remove();
    renderAuthBar();
  } catch (e) {
    errEl.textContent = e.message;
  } finally {
    btn.disabled = false; btn.textContent = 'Create Account';
  }
}

// ═══════════════════════════════════════════════════════════════
// UI - Collection Tab
// ═══════════════════════════════════════════════════════════════
function renderCollectionTab() {
  const wrap = document.getElementById('tab-content-collection');
  if (!wrap) return;

  if (!window.TCG_USER) {
    wrap.innerHTML = `<div class="auth-gate">
      <p>Log in to see your card collection.</p>
      <button class="tcg-btn primary" onclick="showAuthModal('login')">Login</button>
    </div>`;
    return;
  }

  const col = window.TCG_COLLECTION;
  const owned = Object.entries(col).filter(([, q]) => q > 0);
  const totalOwned = owned.reduce((s, [, q]) => s + q, 0);

  const GROUPS = [
    { key: 'all', label: 'All' },
    { key: 'endo', label: 'Endos' },
    { key: 'classic', label: 'Classic' },
    { key: 'toy', label: 'Toy' },
    { key: 'withered', label: 'Withered' },
    { key: 'phantom', label: 'Phantom' },
    { key: 'shadow', label: 'Shadow' },
    { key: 'nightmare', label: 'Nightmare' },
    { key: 'jacko', label: 'Jack-O' },
    { key: 'funtime', label: 'Funtime' },
    { key: 'scrap', label: 'Scrap' },
    { key: 'rockstar', label: 'Rockstar' },
    { key: 'item', label: 'Items' },
    { key: 'tool', label: 'Tools' },
    { key: 'supporter', label: 'Supporters' },
    { key: 'energy', label: 'Energies' },
    { key: 'class', label: '★ Classes' },
  ];

  wrap.innerHTML = `
    <div class="col-header">
      <span class="col-total">Collection: <strong>${totalOwned}</strong> cards (${owned.length} unique)</span>
    </div>
    <div class="class-filter-row">
      ${GROUPS.map(g => `<button class="class-filter-btn${g.key === 'all' ? ' active' : ''}" data-col-filter="${g.key}" onclick="colFilter('${g.key}',this)">${g.label}</button>`).join('')}
    </div>
    <div id="col-card-grid" class="db-card-pool"></div>`;

  renderCollectionGrid('all');
}

let _colFilter = 'all';
function colFilter(cls, btn) {
  _colFilter = cls;
  document.querySelectorAll('[data-col-filter]').forEach(b => b.classList.remove('active'));
  btn?.classList.add('active');
  renderCollectionGrid(cls);
}

function renderCollectionGrid(filter) {
  const grid = document.getElementById('col-card-grid');
  if (!grid) return;
  const col = window.TCG_COLLECTION;
  const CARDS_OBJ = window.CARDS || {};
  grid.innerHTML = '';

  const cards = Object.values(CARDS_OBJ).filter(c => {
    if (c.summonOnly) return false;
    const owned = (col[c.id] || 0);
    if (filter === 'all') return true;
    if (filter === 'class') return c.type === 'class';
    if (filter === 'endo') return c.type === 'endo';
    if (filter === 'item') return c.type === 'item';
    if (filter === 'tool') return c.type === 'tool';
    if (filter === 'supporter') return c.type === 'supporter';
    if (filter === 'energy') return c.type === 'energy';
    return c.class === filter;
  });

  cards.forEach(card => {
    const owned = col[card.id] || 0;
    const face = buildCardFace(card, undefined, undefined);
    face.style.position = 'relative';
    face.style.opacity = owned > 0 ? '1' : '0.35';
    face.style.cursor = 'pointer';
    const badge = document.createElement('div');
    badge.className = 'col-qty-badge' + (owned > 0 ? ' owned' : '');
    badge.textContent = owned > 0 ? `×${owned}` : '0';
    face.appendChild(badge);
    face.onclick = () => (typeof openCardInfoPanel === 'function') && openCardInfoPanel(card);
    grid.appendChild(face);
  });
}

// ═══════════════════════════════════════════════════════════════
// UI - Booster Tab
// ═══════════════════════════════════════════════════════════════
let _boosterQty = 1;
function changeBoosterQty(delta) {
  _boosterQty = Math.max(1, Math.min(10, _boosterQty + delta));
  const disp = document.getElementById('booster-qty-display');
  const cost = document.getElementById('booster-qty-cost');
  if (disp) disp.textContent = _boosterQty;
  if (cost) cost.textContent = `${_boosterQty * BOOSTER_COST} pts total`;
  // Update all open buttons
  const pts = window.TCG_USER?.points || 0;
  document.querySelectorAll('.booster-open-btn').forEach(btn => {
    btn.disabled = pts < _boosterQty * BOOSTER_COST;
    const id = btn.dataset.boosterId;
    btn.textContent = `Open ×${_boosterQty} (${_boosterQty * BOOSTER_COST} pts)`;
  });
}
window.changeBoosterQty = changeBoosterQty;

function renderBoosterTab() {
  const wrap = document.getElementById('tab-content-booster');
  if (!wrap) return;

  if (!window.TCG_USER) {
    wrap.innerHTML = `<div class="auth-gate">
      <p>Log in to open boosters.</p>
      <button class="tcg-btn primary" onclick="showAuthModal('login')">Login</button>
    </div>`;
    return;
  }

  const pts = window.TCG_USER.points;
  wrap.innerHTML = `
    <div class="booster-intro">
      <div class="booster-pts-info">⭐ You have <strong>${pts}</strong> points &nbsp;·&nbsp; Each booster costs <strong>${BOOSTER_COST}</strong> pts · 10 cards each</div>
      <div class="booster-pts-info" style="font-size:.75rem;color:var(--text-muted)">Per match: +5 pts (play) +5 pts (win)</div>
      <div class="booster-qty-row">
        <span style="font-size:.85rem;color:var(--text-muted)">Open:</span>
        <button class="tcg-btn small" onclick="changeBoosterQty(-1)">−</button>
        <span id="booster-qty-display" class="booster-qty-num">${_boosterQty}</span>
        <button class="tcg-btn small" onclick="changeBoosterQty(+1)">+</button>
        <span id="booster-qty-cost" class="booster-pts-info" style="font-size:.8rem">${_boosterQty * BOOSTER_COST} pts total</span>
      </div>
    </div>
    <div class="booster-grid">
      ${Object.values(BOOSTERS).map(b => `
        <div class="booster-card" style="--bc:${b.color};--bb:${b.bg}">
          <div class="booster-card-header" style="color:${b.color}">${b.name}</div>
          <div class="booster-card-sub">${b.subtitle}</div>
          <div class="booster-card-desc">${b.desc}</div>
          <div class="booster-card-classes">
            ${b.classPool.map(cls => {
    const cc = (window.CARDS || {})[cls];
    return cc ? `<img src="${cc.img}" title="${cc.name}" class="booster-class-icon" onerror="this.style.display='none'" />` : '';
  }).join('')}
          </div>
          <button class="tcg-btn primary booster-open-btn" style="border-color:${b.color}"
            data-booster-id="${b.id}"
            onclick="openBoosterUI('${b.id}')" ${pts < _boosterQty * BOOSTER_COST ? 'disabled' : ''}>
            Open ×${_boosterQty} (${_boosterQty * BOOSTER_COST} pts)
          </button>
        </div>`).join('')}
    </div>`;
}

async function openBoosterUI(boosterId) {
  const wrap = document.getElementById('tab-content-booster');
  const bDef = BOOSTERS[boosterId];
  if (!bDef) return;
  const qty = _boosterQty;

  wrap.innerHTML = `<div class="booster-opening"><div class="booster-opening-title" style="color:${bDef.color}">Opening ${bDef.name}${qty > 1 ? ` ×${qty}` : ''}…</div><div class="booster-spinner"></div></div>`;

  let drawn;
  try {
    drawn = await tcgOpenBooster(boosterId, qty);
  } catch (e) {
    alert(e.message);
    renderBoosterTab();
    return;
  }

  wrap.innerHTML = `
    <div class="booster-reveal" style="--bc:${bDef.color}">
      <div class="booster-reveal-title" style="color:${bDef.color}">${bDef.name}${qty > 1 ? ` ×${qty}` : ''} - ${drawn.length} cards obtained!</div>
      <div id="booster-reveal-grid" class="booster-reveal-grid"></div>
      <button class="tcg-btn primary" style="margin-top:16px;border-color:${bDef.color}" onclick="renderBoosterTab()">← Back</button>
    </div>`;

  const grid = document.getElementById('booster-reveal-grid');
  const CARDS_OBJ = window.CARDS || {};
  drawn.forEach((cardId, i) => {
    const card = CARDS_OBJ[cardId];
    if (!card) return;
    const isClass = card.type === 'class';
    const isEnergy = card.type === 'energy';
    const wrapper = document.createElement('div');
    wrapper.className = 'booster-card-reveal' + (isClass ? ' is-class' : '') + (isEnergy ? ' is-energy' : '');
    wrapper.style.animationDelay = `${i * 0.08}s`;
    if (isClass) wrapper.style.setProperty('--rc', bDef.color);

    const face = buildCardFace(card);
    face.style.cursor = 'pointer';
    face.onclick = () => (typeof openCardInfoPanel === 'function') && openCardInfoPanel(card);
    wrapper.appendChild(face);
    grid.appendChild(wrapper);

    // Mark the last card of each booster (every 10th) as the guaranteed energy
    if ((i + 1) % BOOSTER_SIZE === 0) {
      const lbl = document.createElement('div');
      lbl.className = 'booster-energy-label';
      lbl.textContent = '⚡ Energy';
      wrapper.appendChild(lbl);
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// Trade Room System (private 2-player rooms with chat)
// ═══════════════════════════════════════════════════════════════

// ── Word filter: blocks hate slurs, allows regular swear words ─
const _HATE_RX = [
  /n[i1!|o0][g9q]{1,2}[ae3@*4]r?/i,
  /n[i1!|o0][g9q]{2,}[@a4]/i,
  /f[a@4][g9]{1,2}[o0][t7]?s?/i, /\bf[a@4][g9]s?\b/i,
  /tr[a@4]n+[iy1][e3]?/i,
  /\bd[yi1]k[e3]s?\b/i,
  /\b[ck][u0v@*][n*][t*]s?\b/i, /\bc[o0]{2}n\b/i,
  /\bsp[i1][ck]\b/i, /\bk[i1]k[e3]s?\b/i,
  /\bwetbacks?\b/i, /\bbeaners?\b/i, /\bgooks?\b/i, /\bchinks?\b/i, /\bretards?\b/i,
  /\bkys\b/i,
  /k[i!1][l1]{1,2}[\s_-]*(?:your?|ur)[\s_-]*s[e3]lf/i,
  /m[a@4]t[a@4][\s-]*t[e3]/i,
  /\bse[\s-]*m[a@4]t[a@4]/i,
  /\bsmt\b/i,
  /\bd[i1!]dd?y\b/i,
  /\bch[a@4]rl[i1!]e[\s_-]*k[i1!]rk\b/i,
  /\bc[._-]?p\b/i,
  /\bch[i1!]ld\s*p[o0]rn\b/i,
];
function _normHate(s) {
  return s.replace(/\|</g, 'k').replace(/\/\//g, 'n').replace(/\(\)/g, 'o').replace(/\|3/g, 'b');
}
function _containsHate(msg) { const t = _normHate(msg); return _HATE_RX.some(p => p.test(t)); }

// ── Room state ────────────────────────────────────────────────
let _tradeRoom = null;
let _tradeRoomSub = null;
let _tradeRoomPoll = null;   // polling fallback interval
let _tradeOtherCol = {};
let _tradeMyPick = {};     // { card_id: count } - +/- controlled
let _tradeTheirPick = {};     // { card_id: count }

function _genRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ── DB layer ──────────────────────────────────────────────────
async function tcgCreateTradeRoom(isPublic = false) {
  if (!window.TCG_USER) throw new Error('Not logged in');
  const db = _getDB();
  const code = _genRoomCode();
  const { data, error } = await db.from('tcg_trade_rooms').insert({
    code, creator_id: window.TCG_USER.id,
    creator_username: window.TCG_USER.username,
    status: 'waiting', is_public: isPublic
  }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

async function tcgGetPublicRooms() {
  const { data } = await _getDB().from('tcg_trade_rooms')
    .select('id, code, creator_username, created_at')
    .eq('status', 'waiting').eq('is_public', true)
    .order('created_at', { ascending: false }).limit(20);
  return data || [];
}

async function tcgJoinTradeRoom(code) {
  if (!window.TCG_USER) throw new Error('Not logged in');
  const db = _getDB();
  const { data: room } = await db.from('tcg_trade_rooms')
    .select('*').eq('code', code.toUpperCase().trim()).eq('status', 'waiting').maybeSingle();
  if (!room) throw new Error('Room not found or already full');
  if (room.creator_id === window.TCG_USER.id) throw new Error("Can't join your own room");
  const { data, error } = await db.from('tcg_trade_rooms').update({
    joiner_id: window.TCG_USER.id,
    joiner_username: window.TCG_USER.username, status: 'active'
  }).eq('id', room.id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

async function tcgCloseTradeRoom(roomId) {
  await _getDB().from('tcg_trade_rooms').update({ status: 'closed' }).eq('id', roomId);
}

async function tcgSendTradeOffer(roomId, offeredCards, requestedCards) {
  if (!window.TCG_USER) throw new Error('Not logged in');
  if (!offeredCards.length && !requestedCards.length) throw new Error('Select at least one card');
  const tally = {};
  offeredCards.forEach(id => { tally[id] = (tally[id] || 0) + 1; });
  for (const [id, n] of Object.entries(tally))
    if ((window.TCG_COLLECTION[id] || 0) < n) throw new Error(`Not enough ${(window.CARDS || {})[id]?.name || id}`);
  const db = _getDB();
  const { data, error } = await db.from('tcg_trade_offers').insert({
    room_id: roomId, from_user_id: window.TCG_USER.id,
    from_username: window.TCG_USER.username,
    offered_cards: offeredCards, requested_cards: requestedCards, status: 'pending'
  }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

async function tcgRespondTradeOffer(offerId, accept) {
  if (!window.TCG_USER) throw new Error('Not logged in');
  const db = _getDB();
  if (!accept) {
    await db.from('tcg_trade_offers').update({ status: 'declined' })
      .eq('id', offerId).neq('from_user_id', window.TCG_USER.id);
    return;
  }
  const { data: offer } = await db.from('tcg_trade_offers').select('*').eq('id', offerId).single();
  if (!offer || offer.status !== 'pending') throw new Error('Offer no longer available');
  if (offer.from_user_id === window.TCG_USER.id) throw new Error("Can't accept your own offer");
  const theirCol = await tcgGetCollection(offer.from_user_id);
  const tO = {}, tR = {};
  offer.offered_cards.forEach(id => { tO[id] = (tO[id] || 0) + 1; });
  offer.requested_cards.forEach(id => { tR[id] = (tR[id] || 0) + 1; });
  for (const [id, n] of Object.entries(tO))
    if ((theirCol[id] || 0) < n) throw new Error('Offerer no longer has all those cards');
  for (const [id, n] of Object.entries(tR))
    if ((window.TCG_COLLECTION[id] || 0) < n) throw new Error(`Not enough ${(window.CARDS || {})[id]?.name || id}`);
  await _tcgUpsertCards(window.TCG_USER.id, [
    ...Object.entries(tO).map(([id, n]) => ({ card_id: id, delta: +n })),
    ...Object.entries(tR).map(([id, n]) => ({ card_id: id, delta: -n })),
  ]);
  await _tcgUpsertCards(offer.from_user_id, [
    ...Object.entries(tO).map(([id, n]) => ({ card_id: id, delta: -n })),
    ...Object.entries(tR).map(([id, n]) => ({ card_id: id, delta: +n })),
  ]);
  await db.from('tcg_trade_offers').update({ status: 'accepted' }).eq('id', offerId);
}

async function tcgCancelTradeOffer(offerId) {
  await _getDB().from('tcg_trade_offers').update({ status: 'cancelled' })
    .eq('id', offerId).eq('from_user_id', window.TCG_USER?.id);
}

async function tcgGetTradeOffers(roomId) {
  const { data } = await _getDB().from('tcg_trade_offers').select('*')
    .eq('room_id', roomId).in('status', ['pending', 'accepted', 'declined'])
    .order('created_at', { ascending: false }).limit(30);
  return data || [];
}

async function tcgSendChat(roomId, msg) {
  if (!window.TCG_USER) throw new Error('Not logged in');
  msg = msg.trim();
  if (!msg) return false;
  if (msg.length > 200) throw new Error('Message too long (200 chars max)');
  if (_containsHate(msg)) throw new Error('Message contains prohibited language');
  await _getDB().from('tcg_trade_chat').insert({
    room_id: roomId, user_id: window.TCG_USER.id,
    username: window.TCG_USER.username, message: msg
  });
  return true;
}

async function tcgGetChat(roomId) {
  const { data } = await _getDB().from('tcg_trade_chat').select('*')
    .eq('room_id', roomId).order('created_at', { ascending: true }).limit(100);
  return data || [];
}

// ── Realtime + polling fallback ───────────────────────────────
async function _subscribeTradeRoom(roomId) {
  _stopTradePoll();
  const db = _getDB(); if (!db) return;

  _tradeRoomSub = db.channel(`tcg_tr_${roomId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tcg_trade_rooms', filter: `id=eq.${roomId}` },
      async p => { await _handleRoomUpdate(p.new); })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tcg_trade_offers', filter: `room_id=eq.${roomId}` },
      () => _refreshOffers())
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tcg_trade_chat', filter: `room_id=eq.${roomId}` },
      p => _appendChatMsg(p.new))
    .subscribe();

  // Always poll (2.5s) as fallback - works even without Realtime or same-window testing
  _tradeRoomPoll = setInterval(() => _pollTradeRoom(roomId), 2500);
}

async function _pollTradeRoom(roomId) {
  if (!_tradeRoom || !roomId) return;
  const { data } = await _getDB().from('tcg_trade_rooms').select('*').eq('id', roomId).maybeSingle();
  if (!data) return;
  if (data.status !== _tradeRoom.status) {
    await _handleRoomUpdate(data); return;
  }
  if (_tradeRoom.status === 'active') {
    _refreshOffers();
    const box = document.getElementById('trade-chat-msgs');
    if (box) {
      const msgs = await tcgGetChat(roomId);
      if (msgs.length > box.children.length) {
        const extra = msgs.slice(box.children.length);
        extra.forEach(m => _appendChatMsg(m));
      }
    }
  }
}

async function _handleRoomUpdate(roomData) {
  _tradeRoom = roomData;
  if (_tradeRoom.status === 'active' && !Object.keys(_tradeOtherCol).length) {
    const oid = _tradeRoom.creator_id === window.TCG_USER?.id ? _tradeRoom.joiner_id : _tradeRoom.creator_id;
    if (oid) _tradeOtherCol = await tcgGetCollection(oid);
  }
  if (_tradeRoom.status === 'closed') {
    _stopTradePoll(); _tradeRoom = null; renderTradeTab(); alert('The other player left.'); return;
  }
  _reRenderTradeRoom();
}

function _stopTradePoll() {
  if (_tradeRoomPoll) { clearInterval(_tradeRoomPoll); _tradeRoomPoll = null; }
  if (_tradeRoomSub) { try { _tradeRoomSub.unsubscribe(); } catch (e) { } _tradeRoomSub = null; }
}

// ── Copy helper (fixes .then(b=>b.textContent) bug) ──────────
window.copyTradeCode = function (code, btn) {
  const doFallback = () => {
    try {
      const ta = document.createElement('textarea');
      ta.value = code; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) { }
    btn.textContent = '✓ Copied'; setTimeout(() => btn.textContent = 'Copy', 1500);
  };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code)
      .then(() => { btn.textContent = '✓ Copied'; setTimeout(() => btn.textContent = 'Copy', 1500); })
      .catch(doFallback);
  } else doFallback();
};

// ── Landing ───────────────────────────────────────────────────
function renderTradeTab() {
  const wrap = document.getElementById('tab-content-trade');
  if (!wrap) return;
  if (!window.TCG_USER) {
    wrap.innerHTML = `<div class="auth-gate"><p>Log in to use the trading room.</p>
      <button class="tcg-btn primary" onclick="showAuthModal('login')">Login</button></div>`;
    return;
  }
  if (_tradeRoom && _tradeRoom.status !== 'closed') { _renderTradeRoomUI(); return; }
  _tradeRoom = null;
  wrap.innerHTML = `
    <div class="trade-landing">
      <h3 class="trade-section-title">Trading Room</h3>
      <p style="font-size:.82rem;color:var(--text-muted);margin-bottom:12px">
        Create a room and share the code, or join a public room.<br>
        Trade any number of cards (1-for-3, 2-for-2, etc.) and chat in real time.
      </p>
      <div class="trade-landing-actions">
        <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start">
          <label class="trade-visibility-toggle">
            <input type="checkbox" id="trade-public-cb" />
            <span>Make room public (appears in lobby)</span>
          </label>
          <button class="tcg-btn primary" style="min-width:130px" onclick="createTradeRoomUI()">+ Create Room</button>
        </div>
        <div class="trade-join-row">
          <input id="trade-join-code" class="tcg-input" type="text"
            placeholder="Room code (e.g. ABC123)" maxlength="8"
            style="text-transform:uppercase;max-width:180px" />
          <button class="tcg-btn" onclick="joinTradeRoomUI()">Join →</button>
        </div>
      </div>
      <div id="trade-landing-err" class="auth-error" style="text-align:center;margin-top:6px"></div>
      <div class="trade-public-lobby">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <span class="trade-col-title" style="margin:0">Public Rooms</span>
          <button class="tcg-btn small" onclick="refreshPublicRooms()">↻ Refresh</button>
        </div>
        <div id="trade-public-list">Loading…</div>
      </div>
    </div>`;
  document.getElementById('trade-join-code')?.addEventListener('keydown', e => { if (e.key === 'Enter') joinTradeRoomUI(); });
  refreshPublicRooms();
}

async function refreshPublicRooms() {
  const el = document.getElementById('trade-public-list');
  if (!el) return;
  el.textContent = 'Loading…';
  try {
    const rooms = await tcgGetPublicRooms();
    if (!rooms.length) {
      el.innerHTML = '<div style="color:var(--text-muted);font-size:.8rem;padding:6px">No public rooms right now.</div>';
      return;
    }
    el.innerHTML = '';
    rooms.forEach(r => {
      const row = document.createElement('div');
      row.className = 'trade-public-row';
      row.innerHTML = `
        <span class="trade-public-host">👤 ${_escHtml(r.creator_username)}</span>
        <span class="trade-public-code">${r.code}</span>
        <button class="tcg-btn small primary" onclick="joinPublicRoom('${r.code}')">Join</button>`;
      el.appendChild(row);
    });
  } catch (e) { el.textContent = 'Could not load public rooms.'; }
}
window.refreshPublicRooms = refreshPublicRooms;

async function joinPublicRoom(code) {
  document.getElementById('trade-join-code').value = code;
  joinTradeRoomUI();
}
window.joinPublicRoom = joinPublicRoom;

async function createTradeRoomUI() {
  const err = document.getElementById('trade-landing-err');
  if (err) err.textContent = '';
  const isPublic = document.getElementById('trade-public-cb')?.checked || false;
  try {
    const room = await tcgCreateTradeRoom(isPublic);
    _tradeRoom = room; _tradeOtherCol = {}; _tradeMyPick = {}; _tradeTheirPick = {};
    await _subscribeTradeRoom(room.id);
    _renderTradeRoomUI();
  } catch (e) { if (err) err.textContent = e.message; }
}

async function joinTradeRoomUI() {
  const code = document.getElementById('trade-join-code')?.value?.trim();
  const err = document.getElementById('trade-landing-err');
  if (err) err.textContent = '';
  if (!code) { if (err) err.textContent = 'Enter a room code'; return; }
  try {
    const room = await tcgJoinTradeRoom(code);
    _tradeRoom = room; _tradeMyPick = {}; _tradeTheirPick = {};
    const oid = room.creator_id === window.TCG_USER.id ? room.joiner_id : room.creator_id;
    _tradeOtherCol = oid ? await tcgGetCollection(oid) : {};
    await _subscribeTradeRoom(room.id);
    _renderTradeRoomUI();
  } catch (e) { if (err) err.textContent = e.message; }
}

async function leaveTradeRoomUI() {
  if (!_tradeRoom) return;
  if (!confirm('Leave this trade room? Both players will be disconnected.')) return;
  await tcgCloseTradeRoom(_tradeRoom.id);
  _stopTradePoll();
  _tradeRoom = null; _tradeOtherCol = {}; _tradeMyPick = {}; _tradeTheirPick = {};
  renderTradeTab();
}
window.leaveTradeRoomUI = leaveTradeRoomUI;

// ── Room UI ───────────────────────────────────────────────────
function _renderTradeRoomUI() {
  const wrap = document.getElementById('tab-content-trade');
  if (!wrap || !_tradeRoom) return;
  const room = _tradeRoom;
  const isCreator = room.creator_id === window.TCG_USER?.id;
  const myName = window.TCG_USER.username;
  const otherName = (isCreator ? room.joiner_username : room.creator_username) || '-';

  if (room.status === 'waiting') {
    wrap.innerHTML = `
      <div class="trade-room-waiting">
        <div class="trade-room-code-display">
          <span>Room Code:</span>
          <strong class="trade-room-code">${room.code}</strong>
          <button class="tcg-btn small" onclick="copyTradeCode('${room.code}',this)">Copy</button>
          <span class="trade-visibility-badge ${room.is_public ? 'pub' : 'prv'}">${room.is_public ? '🌐 Public' : '🔒 Private'}</span>
        </div>
        <p style="color:var(--text-muted);font-size:.85rem;margin:10px 0">Waiting for another player to join…</p>
        <div class="trade-spinner"></div>
        <button class="tcg-btn small danger" style="margin-top:14px" onclick="leaveTradeRoomUI()">Close Room</button>
      </div>`;
    return;
  }

  wrap.innerHTML = `
    <div class="trade-room-header">
      <button class="tcg-btn small danger" onclick="leaveTradeRoomUI()">✕ Leave</button>
      <span class="trade-room-id">Room <strong>${room.code}</strong></span>
      <span class="trade-room-vs">👤 <strong>${_escHtml(myName)}</strong>
        <span style="color:var(--gold)"> ⇄ </span>
        👤 <strong>${_escHtml(otherName)}</strong></span>
    </div>
    <div class="trade-room-body">
      <div class="trade-room-main">
        <div class="trade-cols-row">
          <div class="trade-col-panel">
            <div class="trade-col-title">Your Cards
              <span id="my-pick-badge" class="trade-pick-badge"></span>
            </div>
            <div id="trade-my-col" class="trade-col-grid"></div>
          </div>
          <div class="trade-col-panel">
            <div class="trade-col-title">${_escHtml(otherName)}'s Cards
              <span id="their-pick-badge" class="trade-pick-badge"></span>
            </div>
            <div id="trade-their-col" class="trade-col-grid"></div>
          </div>
        </div>
        <div class="trade-propose-bar">
          <div class="trade-propose-summary">
            <div id="trade-my-picks" class="trade-picks-list">-</div>
            <span class="trade-propose-arrow">⇄</span>
            <div id="trade-their-picks" class="trade-picks-list">-</div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <button class="tcg-btn primary" onclick="proposeTradeUI()">Propose Trade</button>
            <button class="tcg-btn small" onclick="clearTradePicksUI()">Clear</button>
            <div id="trade-propose-err" class="auth-error"></div>
          </div>
        </div>
        <div class="trade-offers-panel">
          <div class="trade-col-title">Active Offers</div>
          <div id="trade-offers-list">Loading…</div>
        </div>
      </div>
      <div class="trade-room-chat">
        <div class="trade-col-title">Chat</div>
        <div id="trade-chat-msgs" class="trade-chat-msgs"></div>
        <div class="trade-chat-footer">
          <input id="trade-chat-input" class="tcg-input" type="text"
            placeholder="Type a message…" maxlength="200"
            style="flex:1;max-width:none" />
          <button class="tcg-btn small primary" onclick="sendChatUI()">Send</button>
        </div>
        <div id="trade-chat-err" class="auth-error"></div>
      </div>
    </div>`;

  _renderMyCol(); _renderTheirCol(); _refreshOffers(); _loadChatHistory();
  document.getElementById('trade-chat-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatUI(); });
}

function _reRenderTradeRoom() {
  if (!_tradeRoom || _tradeRoom.status === 'closed') return;
  if (document.querySelector('.trade-room-body')) { _refreshOffers(); _renderMyCol(); _renderTheirCol(); }
  else _renderTradeRoomUI();
}

// ── Collection cards inside room (+/- selection) ─────────────
function _renderMyCol() {
  const grid = document.getElementById('trade-my-col'); if (!grid) return;
  grid.innerHTML = '';
  const myCards = Object.values(window.CARDS || {})
    .filter(c => !c.summonOnly && (window.TCG_COLLECTION[c.id] || 0) > 0);
  if (!myCards.length) {
    grid.innerHTML = '<div style="color:var(--text-muted);font-size:.72rem;padding:8px">No cards to offer.<br>Open boosters to get cards!</div>';
  } else {
    myCards.forEach(card => grid.appendChild(
      _tradeCardEl(card, window.TCG_COLLECTION[card.id] || 0, _tradeMyPick[card.id] || 0, 'my')));
  }
  _updatePickSummary();
}

function _renderTheirCol() {
  const grid = document.getElementById('trade-their-col'); if (!grid) return;
  grid.innerHTML = '';
  const theirCards = Object.entries(_tradeOtherCol).filter(([, q]) => q > 0);
  if (!theirCards.length) {
    const msg = Object.keys(_tradeOtherCol).length === 0
      ? '<div style="color:var(--text-muted);font-size:.72rem;padding:8px">Waiting for their collection to load…</div>'
      : '<div style="color:var(--text-muted);font-size:.72rem;padding:8px">Other player has no cards.</div>';
    grid.innerHTML = msg;
  } else {
    theirCards.forEach(([id, qty]) => {
      const card = (window.CARDS || {})[id]; if (!card || card.summonOnly) return;
      grid.appendChild(_tradeCardEl(card, qty, _tradeTheirPick[id] || 0, 'their'));
    });
  }
  _updatePickSummary();
}

function _tradeCardEl(card, owned, selected, side) {
  const el = document.createElement('div');
  el.className = 'trade-card-item' + (selected > 0 ? ' selected' : '');
  el.dataset.cardId = card.id; el.dataset.side = side;
  el.innerHTML = `
    <img src="${card.img}" onerror="this.src='${window.GENERIC || ''}'" />
    <div class="tci-name">${card.name}</div>
    <div class="tci-owned">Own: ${owned}</div>
    <div class="tci-controls">
      <button class="tci-btn" onclick="tradePickDelta('${side}','${card.id}',-1)">−</button>
      <span class="tci-count" id="tci-count-${side}-${card.id}">${selected}</span>
      <button class="tci-btn" onclick="tradePickDelta('${side}','${card.id}',+1)">+</button>
    </div>`;
  return el;
}

function tradePickDelta(side, cardId, delta) {
  const picks = side === 'my' ? _tradeMyPick : _tradeTheirPick;
  const maxOwned = side === 'my' ? (window.TCG_COLLECTION[cardId] || 0) : (_tradeOtherCol[cardId] || 0);
  const cur = picks[cardId] || 0;
  const next = Math.max(0, Math.min(maxOwned, cur + delta));
  if (next === 0) delete picks[cardId]; else picks[cardId] = next;

  // Update count display and card highlight without full re-render
  const countEl = document.getElementById(`tci-count-${side}-${cardId}`);
  if (countEl) countEl.textContent = next;
  const cardEl = countEl?.closest('.trade-card-item');
  if (cardEl) cardEl.className = 'trade-card-item' + (next > 0 ? ' selected' : '');

  _updatePickSummary();
}
window.tradePickDelta = tradePickDelta;

function _updatePickSummary() {
  const C = window.CARDS || {};
  const _fmt = picks => {
    const entries = Object.entries(picks).filter(([, n]) => n > 0);
    if (!entries.length) return '<em style="color:var(--text-muted)">Nothing</em>';
    return entries.map(([id, n]) => `<span class="trade-pick-chip">
      <img src="${C[id]?.img || ''}" onerror="this.style.display='none'" />${C[id]?.name || id}${n > 1 ? ` ×${n}` : ''}</span>`).join('');
  };
  const mp = document.getElementById('trade-my-picks'), tp = document.getElementById('trade-their-picks');
  const mb = document.getElementById('my-pick-badge'), tb = document.getElementById('their-pick-badge');
  const myTotal = Object.values(_tradeMyPick).reduce((a, b) => a + b, 0);
  const theirTotal = Object.values(_tradeTheirPick).reduce((a, b) => a + b, 0);
  if (mp) mp.innerHTML = _fmt(_tradeMyPick);
  if (tp) tp.innerHTML = _fmt(_tradeTheirPick);
  if (mb) mb.textContent = myTotal ? `(${myTotal})` : '';
  if (tb) tb.textContent = theirTotal ? `(${theirTotal})` : '';
}

function clearTradePicksUI() {
  _tradeMyPick = {}; _tradeTheirPick = {};
  // Reset all counters without full re-render
  document.querySelectorAll('.tci-count').forEach(el => el.textContent = '0');
  document.querySelectorAll('.trade-card-item.selected').forEach(el => el.classList.remove('selected'));
  _updatePickSummary();
}
window.clearTradePicksUI = clearTradePicksUI;

async function proposeTradeUI() {
  const err = document.getElementById('trade-propose-err'); if (err) err.textContent = '';
  // Convert objects to flat arrays (repeated entries for quantity)
  const myCards = Object.entries(_tradeMyPick).flatMap(([id, n]) => Array(n).fill(id));
  const theirCards = Object.entries(_tradeTheirPick).flatMap(([id, n]) => Array(n).fill(id));
  try {
    await tcgSendTradeOffer(_tradeRoom.id, myCards, theirCards);
    _tradeMyPick = {}; _tradeTheirPick = {};
    document.querySelectorAll('.tci-count').forEach(el => el.textContent = '0');
    document.querySelectorAll('.trade-card-item.selected').forEach(el => el.classList.remove('selected'));
    _updatePickSummary(); _refreshOffers();
  } catch (e) { if (err) err.textContent = e.message; }
}
window.proposeTradeUI = proposeTradeUI;

// ── Offers ────────────────────────────────────────────────────
async function _refreshOffers() {
  const el = document.getElementById('trade-offers-list'); if (!el || !_tradeRoom) return;
  const offers = await tcgGetTradeOffers(_tradeRoom.id);

  // If any of MY offers just got accepted, reload my collection from DB
  const myAccepted = offers.find(o => o.from_user_id === window.TCG_USER?.id && o.status === 'accepted');
  if (myAccepted && window.TCG_USER) {
    const fresh = await tcgGetCollection(window.TCG_USER.id);
    // Only update if something actually changed
    const changed = Object.entries(fresh).some(([id, q]) => window.TCG_COLLECTION[id] !== q)
      || Object.keys(window.TCG_COLLECTION).some(id => !(id in fresh));
    if (changed) {
      window.TCG_COLLECTION = fresh;
      _renderMyCol();
      // Also refresh their col since trade changed it
      const oid = _tradeRoom.creator_id === window.TCG_USER.id ? _tradeRoom.joiner_id : _tradeRoom.creator_id;
      if (oid) { _tradeOtherCol = await tcgGetCollection(oid); _renderTheirCol(); }
    }
  }
  const C = window.CARDS || {};
  const chips = arr => arr.map(id => `<span class="trade-pick-chip sm">
    <img src="${C[id]?.img || ''}" onerror="this.style.display='none'"/>${C[id]?.name || id}</span>`).join('');
  if (!offers.length) { el.innerHTML = '<div style="color:var(--text-muted);font-size:.8rem;padding:6px">No offers yet.</div>'; return; }
  el.innerHTML = '';
  offers.forEach(o => {
    const isMine = o.from_user_id === window.TCG_USER?.id;
    const sc = { pending: '#aaa', accepted: '#7d7', declined: '#d77', cancelled: '#888' }[o.status] || '#aaa';
    const div = document.createElement('div');
    div.className = 'trade-offer-row';
    div.innerHTML = `
      <span class="trade-offer-by">👤 ${_escHtml(o.from_username)}</span>
      <div class="trade-offer-cards">
        <div class="trade-picks-list sm">${chips(o.offered_cards)}</div>
        <span style="color:var(--gold)">⇄</span>
        <div class="trade-picks-list sm">${chips(o.requested_cards)}</div>
      </div>
      <span class="trade-offer-status" style="color:${sc}">${o.status}</span>
      <div class="trade-offer-btns">
        ${o.status === 'pending' ? (isMine
        ? `<button class="tcg-btn small" onclick="cancelOfferUI('${o.id}')">Cancel</button>`
        : `<button class="tcg-btn small primary" onclick="acceptOfferUI('${o.id}')">Accept</button>
            <button class="tcg-btn small" onclick="declineOfferUI('${o.id}')">Decline</button>`
      ) : ''}
      </div>`;
    el.appendChild(div);
  });
}

async function acceptOfferUI(id) {
  try {
    await tcgRespondTradeOffer(id, true);
    // Reload both collections from DB so UI reflects the actual state immediately
    window.TCG_COLLECTION = await tcgGetCollection(window.TCG_USER.id);
    const oid = _tradeRoom?.creator_id === window.TCG_USER?.id
      ? _tradeRoom?.joiner_id : _tradeRoom?.creator_id;
    if (oid) _tradeOtherCol = await tcgGetCollection(oid);
    _renderMyCol(); _renderTheirCol(); _refreshOffers();
  } catch (e) { alert(e.message); }
}
async function declineOfferUI(id) { try { await tcgRespondTradeOffer(id, false); _refreshOffers(); } catch (e) { alert(e.message); } }
async function cancelOfferUI(id) { try { await tcgCancelTradeOffer(id); _refreshOffers(); } catch (e) { alert(e.message); } }
window.acceptOfferUI = acceptOfferUI; window.declineOfferUI = declineOfferUI; window.cancelOfferUI = cancelOfferUI;

// ── Chat ──────────────────────────────────────────────────────
async function _loadChatHistory() {
  const msgs = await tcgGetChat(_tradeRoom?.id);
  const box = document.getElementById('trade-chat-msgs'); if (!box) return;
  box.innerHTML = '';
  msgs.forEach(m => _appendChatMsg(m));
}

function _appendChatMsg(msg) {
  const box = document.getElementById('trade-chat-msgs'); if (!box) return;
  const isMine = msg.user_id === window.TCG_USER?.id;
  const div = document.createElement('div');
  div.className = 'trade-chat-msg' + (isMine ? ' mine' : '');
  div.innerHTML = `<span class="chat-user">${_escHtml(msg.username)}</span><span class="chat-text">${_escHtml(msg.message)}</span>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

async function sendChatUI() {
  const input = document.getElementById('trade-chat-input');
  const err = document.getElementById('trade-chat-err');
  if (!input || !_tradeRoom) return;
  if (err) err.textContent = '';
  try { const ok = await tcgSendChat(_tradeRoom.id, input.value); if (ok) input.value = ''; }
  catch (e) { if (err) err.textContent = e.message; }
}
window.sendChatUI = sendChatUI;

// ═══════════════════════════════════════════════════════════════
// Deck Builder - collection awareness
// ═══════════════════════════════════════════════════════════════

// Called by tcg.js renderCardPool to get the effective limit for a card
window.tcgCollectionLimit = function (cardId, cardMaxCopies) {
  if (!window.TCG_USER) return null; // null = no restriction (not logged in)
  return Math.min(cardMaxCopies || 3, window.TCG_COLLECTION[cardId] || 0);
};

// Render the deck builder gate (if not logged in, hide builder and show login prompt)
function renderDeckBuilderGate() {
  const gate = document.getElementById('db-login-gate');
  const wrap = document.getElementById('deck-builder-wrap');
  if (!gate) return;
  if (window.TCG_USER) {
    gate.style.display = 'none';
    if (wrap) wrap.style.display = '';
  } else {
    gate.style.display = '';
    gate.innerHTML = `<div class="auth-gate">
      <p>Log in to build decks with your collection.</p>
      <p style="font-size:.75rem;color:var(--text-muted)">Pre-built decks are always available in the <strong>Play</strong> tab without logging in.</p>
      <button class="tcg-btn primary" onclick="showAuthModal('login')">Login</button>
      <button class="tcg-btn small" onclick="showAuthModal('register')">Register</button>
    </div>`;
    if (wrap) wrap.style.display = 'none';
  }
}

// ═══════════════════════════════════════════════════════════════
// Points award helper (called from tcg.js after a game ends)
// ═══════════════════════════════════════════════════════════════
window.tcgAwardMatchPoints = async function (winnerName) {
  if (!window.TCG_USER) return null;
  const isWinner = window.TCG_USER.username === winnerName?.toLowerCase();
  const pts = 5 + (isWinner ? 5 : 0);
  await tcgAddPoints(window.TCG_USER.id, pts);
  return { pts, isWinner };
};

// ═══════════════════════════════════════════════════════════════
// Tab switch (replaces tcg.js version to support extra tabs)
// ═══════════════════════════════════════════════════════════════
function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.lobby-tab').forEach(el => el.classList.remove('active'));
  const content = document.getElementById(`tab-content-${tab}`);
  if (content) content.style.display = '';
  const btn = document.getElementById(`tab-${tab}`);
  if (btn) btn.classList.add('active');

  // Original tcg.js behaviours
  if (tab === 'deck') {
    renderDeckBuilderGate();
    if (window.TCG_USER && typeof renderCardPool === 'function') {
      renderCardPool(); renderDeckList(); renderSavedDecks();
    }
  }
  if (tab === 'online' && typeof tcgMpInit === 'function') tcgMpInit();

  // New tabs
  if (tab === 'collection') renderCollectionTab();
  if (tab === 'booster') renderBoosterTab();
  if (tab === 'trade') renderTradeTab();

  // Update URL hash for back-navigation
  if (location.hash !== '#lobby/' + tab) location.hash = 'lobby/' + tab;
}
window.switchTab = switchTab;

// ── Utility ───────────────────────────────────────────────────
function _escHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ═══════════════════════════════════════════════════════════════
// Init
// ═══════════════════════════════════════════════════════════════
function _prefillPlayerName() {
  if (!window.TCG_USER) return;
  const username = window.TCG_USER.username;
  const p1 = document.getElementById('p1-name');
  if (p1 && (p1.value === 'Player 1' || !p1.value)) p1.value = username;
  const mpName = document.getElementById('mp-name');
  if (mpName && !mpName.value) mpName.value = username;
  const lobbyName = document.getElementById('lobby-name');
  if (lobbyName && !lobbyName.value) lobbyName.value = username;
  localStorage.setItem('tcg_player_name', username);
}

document.addEventListener('DOMContentLoaded', async () => {
  _authLoad();
  _prefillPlayerName();
  renderAuthBar();
  if (window.TCG_USER) {
    const db = _getDB();
    if (db) {
      try {
        window.TCG_COLLECTION = await tcgGetCollection(window.TCG_USER.id);
        await tcgRefreshPoints();
        renderAuthBar();
      } catch (e) { /* offline */ }
    }
  }
});

// ── Dev: tcgGiveAll(n) ───────────────────────────────────────
// Call from the browser console: tcgGiveAll() or tcgGiveAll(4)
window.tcgGiveAll = async function(n = 12) {
  if (!window.TCG_USER) { console.error('[tcgGiveAll] Not logged in!'); return; }
  const db = _getDB(); if (!db) { console.error('[tcgGiveAll] No DB!'); return; }
  const allIds = Object.keys(window.CARDS || {});
  if (!allIds.length) { console.error('[tcgGiveAll] CARDS not loaded yet!'); return; }
  console.log(`[tcgGiveAll] Setting ${allIds.length} cards to ${n}…`);
  await db.from('tcg_user_cards').delete().eq('user_id', window.TCG_USER.id);
  const rows = allIds.map(card_id => ({ user_id: window.TCG_USER.id, card_id, quantity: n }));
  const { error } = await db.from('tcg_user_cards').insert(rows);
  if (error) { console.error('[tcgGiveAll] DB error:', error); return; }
  allIds.forEach(id => { window.TCG_COLLECTION[id] = n; });
  console.log(`[tcgGiveAll] Done! ${allIds.length} cards set to ${n}.`);
  if (typeof renderCollectionTab === 'function') renderCollectionTab();
};
