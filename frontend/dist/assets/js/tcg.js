/* ═══════════════════════════════════════════════════════
   FNAF TCG  v4
   ═══════════════════════════════════════════════════════ */
const IMG = '../assets/images/chars/';
const GENERIC = '../assets/images/default.png';
window.GENERIC = GENERIC;

const ENERGY_META = {
  remnant: { name: 'Remnant', sym: '○', cls: 'etype-remnant', color: '#7ad' },
  agony: { name: 'Agony', sym: '●', cls: 'etype-agony', color: '#d77' },
  phantom_agony: { name: 'Phantom Agony', sym: '◆', cls: 'etype-phantom_agony', color: '#a7d' },
  generic: { name: 'Energy', sym: '⚡', cls: 'etype-generic', color: '#aad' }
};

/* CARDS loaded from tcg-cards.js database */
function buildCardsFromDB(db) {
  const out = {};
  for (const [id, data] of Object.entries(db || {})) {
    out[id] = { ...data, img: data.img ? IMG + data.img : GENERIC };
  }
  return out;
}
const CARDS = buildCardsFromDB(window.CARDS_DB);
window.CARDS = CARDS; // expose for tcg-auth.js

/* ═══════════════════════════════════════════════════════
   GENERATOR PRESETS
   ═══════════════════════════════════════════════════════ */
const SCRAP_MAP = { springtrap: 'scraptrap', baby: 'scrap_baby', funtime_freddy: 'molten_freddy', puppet: 'lefty', carnie: 'lefty', m2_endo: 'm2_mimic' };

function makeEnergy(type, n) {
  return Array.from({ length: n }, (_, i) => ({ id: `gen_${i}`, name: 'Energy', type: 'energy', energyType: 'generic', img: GENERIC }));
}
const GENERATOR_PRESETS = {
  remnant: () => shuffle([...makeEnergy('remnant', 30)]),
  agony: () => shuffle([...makeEnergy('agony', 30)]),
  phantom: () => shuffle([...makeEnergy('phantom_agony', 15), ...makeEnergy('agony', 15)]),
  mixed: () => shuffle([...makeEnergy('remnant', 15), ...makeEnergy('agony', 15)])
};

/* ═══════════════════════════════════════════════════════
   STARTER DECKS
   ═══════════════════════════════════════════════════════ */
const STARTER_DECKS = {
  fnaf1: {
    name: 'Freddy and the Gang', generator: 'remnant', classCard: 'class_classic',
    list: [
      ['endo_01', 6], ['freddy', 2], ['bonnie', 1], ['chica', 1], ['foxy', 2], ['golden_freddy', 1],
      ['energy_remnant', 6], ['energy_agony', 1],
      ['cupcake', 2], ['power_out', 1], ['dee_dee_pearl', 3], ['birthday_cake', 3], ['system_corrupt', 2], ['energy_recharge', 3],
      ['phone_guy', 3], ['henry_emily', 1], ['fazbear_tech', 2]
    ]
  },
  fnaf2_toys: {
    name: 'Renewed', generator: 'remnant', classCard: 'class_toy',
    list: [
      ['endo_02', 6], ['toy_freddy', 1], ['toy_bonnie', 2], ['toy_chica', 1], ['mangle', 2], ['bb', 1], ['puppet', 1],
      ['energy_remnant', 6],
      ['dee_dee_pearl', 3], ['birthday_cake', 3], ['system_corrupt', 2], ['energy_recharge', 2],
      ['puppet_box', 2], ['springlock_device', 1], ['hat_mic', 2],
      ['phone_guy', 3], ['henry_emily', 1], ['fazbear_tech', 1]
    ]
  },
  fnaf2_withereds: {
    name: 'Old and Ready', generator: 'remnant', classCard: 'class_withered',
    list: [
      ['endo_02', 6], ['withered_freddy', 2], ['withered_bonnie', 1], ['withered_chica', 2], ['withered_foxy', 1], ['withered_golden', 1],
      ['shadow_freddy', 2], ['rwqfsfasxc', 1],
      ['energy_remnant', 6], ['energy_agony', 2],
      ['birthday_cake', 3], ['system_corrupt', 2], ['energy_recharge', 2], ['dee_dee_pearl', 3],
      ['mendos_endos', 2], ['puppet_box', 1],
      ['phone_guy', 3]
    ]
  },
  fnaf3: {
    name: 'Phantom Menace', generator: 'remnant', classCard: 'class_phantom',
    list: [
      ['spring_endo', 3], ['springtrap', 3], ['springbonnie', 3],
      ['p_freddy', 1], ['p_chica', 1], ['p_bb', 1], ['p_foxy', 1], ['p_mangle', 1], ['p_puppet', 1],
      ['purple_guy', 3],
      ['energy_agony', 3],
      ['dee_dee_pearl', 3], ['birthday_cake', 3], ['system_corrupt', 2], ['energy_recharge', 2],
      ['phone_guy', 3], ['henry_emily', 3], ['fazbear_tech', 2], ['william_search', 1]
    ]
  },
  fnaf4: {
    name: 'Sleepless Nights', generator: 'remnant', classCard: 'class_nightmare',
    list: [
      ['endo_nm', 5],
      ['nightmare_freddy', 2], ['nightmare_bonnie', 1], ['nightmare_chica', 1], ['nightmare_foxy', 1], ['nightmare_fredbear', 1],
      ['plushtrap', 2], ['nightmare_bb', 1], ['dreadbear', 1], ['nightmarionne', 1],
      ['birthday_cake', 3], ['energy_agony', 6], ['dee_dee_pearl', 3],
      ['data_escape', 2], ['strobe_flash', 1], ['party_hat', 2],
      ['phone_guy', 3], ['fazbear_tech', 2], ['power_battery', 2]
    ]
  },
  fnaf4_jacko: {
    name: 'Fiery Night', generator: 'remnant', classCard: 'class_jacko',
    list: [
      ['endo_nm', 4],
      ['jacko_bonnie', 2], ['jacko_lantern', 2], ['jacko_chica', 1], ['grim_foxy', 2],
      ['energy_agony', 4],
      ['birthday_cake', 3], ['dee_dee_pearl', 3], ['power_battery', 2], ['data_escape', 2],
      ['party_guests', 1], ['shadow_band', 2], ['static_dampener', 3], ['puppet_box', 2],
      ['phone_guy', 3], ['fazbear_tech', 3], ['david', 1]
    ]
  },
  sl: {
    name: 'Showtime', generator: 'remnant', classCard: 'class_funtime',
    list: [
      ['yenndo', 6], ['baby', 2], ['ballora', 1], ['funtime_freddy', 1], ['funtime_foxy', 1], ['lolbit', 2],
      ['ennard_summon', 1], ['ennard', 1],
      ['energy_agony', 6],
      ['birthday_cake', 3], ['system_corrupt', 3], ['data_escape', 1], ['energy_recharge', 1], ['dee_dee_pearl', 3],
      ['mendos_endos', 2], ['static_dampener', 1], ['fireproof_suit', 1],
      ['phone_guy', 3], ['henry_emily', 1]
    ]
  },
  fnaf6: {
    name: 'Remnants of the Past', generator: 'remnant', classCard: 'class_scrap',
    list: [
      ['scraptrap', 1], ['scrap_baby', 1], ['molten_freddy', 1], ['lefty', 1],
      ['spring_endo', 1], ['springbonnie', 1], ['springtrap', 1], ['yenndo', 2], ['baby', 1], ['funtime_freddy', 1], ['endo_02', 1], ['puppet', 1],
      ['purple_guy', 2], ['fragmento_remnant', 3], ['mendos_endos', 2],
      ['energy_agony', 3], ['energy_remnant', 1],
      ['birthday_cake', 3], ['system_corrupt', 2], ['data_escape', 1], ['energy_recharge', 2], ['dee_dee_pearl', 1],
      ['phone_guy', 3], ['william_search', 2], ['fazbear_tech', 2]
    ]
  },
  fnaf_sb: {
    name: 'Gator Golf', generator: 'remnant', classCard: 'class_glamrock',
    list: [
      ['glamrock_endo', 5],
      ['monty', 3], ['glamrock_freddy', 1], ['glamrock_chica', 1], ['roxy', 1], ['sun', 1], ['moon', 1], ['glamrock_bonnie', 1],
      ['energy_agony', 4], ['energy_remnant', 4],
      ['dee_dee_pearl', 3], ['power_battery', 2], ['birthday_cake', 3],
      ['data_escape', 1], ['mr_hugs', 1], ['party_hat', 2], ['guitar_axe', 1],
      ['phone_guy', 3], ['william_search', 2]
    ]
  },
  sotm: {
    name: 'Mimic', generator: 'remnant', classCard: 'class_mimic',
    list: [
      ['m2_endo', 5],
      ['jackie', 2], ['big_top', 2], ['nurse_dollie', 1], ['party_time_chica', 1], ['tiger_rock', 1],
      ['energy_remnant', 4], ['energy_agony', 1],
      ['dee_dee_pearl', 3], ['power_battery', 2], ['birthday_cake', 3],
      ['strobe_flash', 2], ['party_hat', 2], ['ruined_dj', 1],
      ['phone_guy', 3], ['william_search', 2], ['edwin', 2], ['m1', 1], ['fiona', 1], ['david', 1]
    ]
  }
};

/* ─── Deck expansion ──────────────────────────────── */
function expandDeck(list) {
  const out = [];
  for (const [id, cnt] of list) {
    const c = CARDS[id]; if (!c) { console.warn('Unknown card:', id); continue; }
    for (let i = 0; i < cnt; i++) {
      out.push({
        ...c,
        attacks: (c.attacks || []).map(a => ({ ...a })),
        abilities: c.abilities ? c.abilities.map(a => ({ ...a })) : undefined,
        tools: [],
        uid: uid()
      });
    }
  }
  return out;
}
function deckFromList(list) { return shuffle(expandDeck(list)); }

/* ─── Starter deck validation ─────────────────────── */
// (for debugging)
function validateDecks() {
  for (const [k, d] of Object.entries(STARTER_DECKS)) {
    const bad = d.list.filter(([id]) => !CARDS[id]).map(([id]) => id);
    if (bad.length) console.warn(`${k} has unknown card IDs: ${bad.join(', ')}`);
    const t = d.list.reduce((s, [id, c]) => CARDS[id] ? s + c : s, 0);
    if (t !== 40) console.warn(`${k} has ${t} valid cards (expected 40)`);
  }
}

/* ═══════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════ */
let _uid = 0;
function uid() { return 'u' + (++_uid); }
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function mk(tag, cls, txt, fn) { const el = document.createElement(tag); el.className = cls; el.textContent = txt; if (fn) el.onclick = fn; return el; }
function energySym(type) { const m = ENERGY_META[type]; return m ? `<span class="sym-${type}">${m.sym}</span>` : '?'; }

/* ═══════════════════════════════════════════════════════
   GAME STATE
   ═══════════════════════════════════════════════════════ */
window.MP = { mode: 'local', myIdx: 0, myId: null, roomId: null, roomCode: null, db: null, channel: null };
let G = null, undoStack = [];
let pendingSearch = null, viewingBlob = null;
let _autoEndPending = false; // prevents multiple checkAutoEndTurn rAFs queuing up
let _endTurnGuard = false; // prevents endTurn running twice (e.g. button + rAF race)
// Online phase-render flags (local only, never sent to DB)
let _mpMulliganShown = false;
let _mpDiceRolling = false; // prevents pullGameState rebuilding dice UI mid-animation

function newSlot(card) {
  const s = {
    card, hp: card.hp, elec: 0, awake: card.wakeThreshold === 0,
    tools: [], usedToolThisTurn: false, attackedThisTurn: false,
    defense: null, stalledTurns: 0, burn: 0, trapped: 0,
    justPlaced: true, william: false, scrap: false, deathGuardUsed: false,
    canRepeatGamble: false, usedGambleRepeat: false, lastGambleFailed: false,
    usedAbilityThisTurn: false, extraAttacks: 0, abilityDisabledTurns: 0
  };
  if (card.passive === 'hp+40' || card.onEquip) { /* handled on equip */ }
  return s;
}
function checkAwake(slot) {
  if (slot) {
    slot.awake = slot.elec >= slot.card.wakeThreshold;
  }
}

function makePlayer(name, deckList, generatorKey, classCardId) {
  return {
    name, koPoints: 0,
    deck: deckFromList(deckList),
    generator: (GENERATOR_PRESETS[generatorKey] || GENERATOR_PRESETS.remnant)(),
    hand: [], energyPool: 0,
    party: [null, null, null, null],
    discard: [], genDiscard: [],
    supporterPlayedThisTurn: 0,
    supporterMax: 1,
    handBlocked: null,
    blockNextAttack: false,
    alliedDeathLastOpponentTurn: false,
    itemLocked: 0, skipNextDraw: false,
    classCard: CARDS[classCardId] || CARDS['class_classic'] || null,
    classCardUsed: false, classCardUsedForever: false,
    burnBonus: classCardId === 'class_jacko' ? 5 : 0
  };
}

/* ═══════════════════════════════════════════════════════
   LOBBY / DECK BUILDER
   ═══════════════════════════════════════════════════════ */
const LS_KEY = 'tcg_decks_v3';
let _cloudDecks = null; // null = not logged in / not loaded; array = loaded from cloud

function getSavedDecks() {
  if (_cloudDecks !== null) return _cloudDecks;
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
}
function setSavedDecks(a) {
  if (_cloudDecks !== null) {
    _cloudDecks = a;
    if (typeof tcgSaveCloudDecks === 'function') tcgSaveCloudDecks(a); // fire-and-forget
  } else {
    localStorage.setItem(LS_KEY, JSON.stringify(a));
  }
}

async function initCloudDecks() {
  if (typeof tcgGetCloudDecks !== 'function') return;
  if (!window.TCG_USER) {
    _cloudDecks = null; // not logged in → use localStorage
  } else {
    const decks = await tcgGetCloudDecks();
    _cloudDecks = decks ?? []; // logged in → always cloud mode, empty array on error
  }
  renderSavedDecks?.();
  populateDeckSelects?.();
  // Re-render online waiting room deck picker if it's currently open
  if (window.MP?._currentRow && document.getElementById('tcg-waiting-deck')) {
    if (typeof mpUpdateWaiting === 'function') mpUpdateWaiting(window.MP._currentRow);
  }
}

async function exportDecksToDB(btn) {
  if (typeof tcgSaveCloudDecks !== 'function' || !window.TCG_USER) {
    alert('You need to be logged in to export decks to the database.'); return;
  }
  const orig = btn?.textContent;
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
  try {
    const local = (() => { try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; } })();
    const cloud = _cloudDecks ?? [];
    // Merge: cloud base + any local decks not already in cloud (by name)
    const cloudNames = new Set(cloud.map(d => d.name));
    const merged = [...cloud, ...local.filter(d => !cloudNames.has(d.name))];
    await tcgSaveCloudDecks(merged);
    _cloudDecks = merged;
    renderSavedDecks?.(); populateDeckSelects?.();
    if (btn) btn.textContent = `Saved ${merged.length} deck${merged.length !== 1 ? 's' : ''}!`;
    setTimeout(() => { if (btn) { btn.textContent = orig; btn.disabled = false; } }, 2000);
  } catch (e) {
    if (btn) { btn.textContent = 'Error!'; btn.disabled = false; }
    alert('Failed to export decks: ' + e.message);
  }
}

async function loadDecksFromDB(btn) {
  if (typeof tcgGetCloudDecks !== 'function' || !window.TCG_USER) {
    alert('You need to be logged in to load decks from the database.');
    return;
  }
  const orig = btn?.textContent;
  if (btn) { btn.disabled = true; btn.textContent = 'Loading…'; }
  try {
    const decks = await tcgGetCloudDecks();
    _cloudDecks = decks ?? [];
    renderSavedDecks?.();
    populateDeckSelects?.();
    if (btn) btn.textContent = `Loaded ${_cloudDecks.length} deck${_cloudDecks.length !== 1 ? 's' : ''}`;
    setTimeout(() => { if (btn) { btn.textContent = orig; btn.disabled = false; } }, 2000);
  } catch (e) {
    if (btn) { btn.textContent = 'Error!'; btn.disabled = false; }
    alert('Failed to load decks: ' + e.message);
  }
}

function getDecksForSelect() {
  const saved = getSavedDecks();
  const starters = Object.entries(STARTER_DECKS).map(([k, d]) => ({ id: k, name: d.name, list: d.list, generator: d.generator, classCard: d.classCard || 'class_classic' }));
  return [...starters, ...saved.map((d, i) => ({ id: 'saved_' + i, name: d.name, list: d.list, generator: d.generator || 'remnant', classCard: d.classCard || 'class_classic', overLimit: d.overLimit || false }))];
}

function updateClassInfo(infoId, deckId, decks) {
  const el = document.getElementById(infoId); if (!el) return;
  const d = decks.find(x => x.id === deckId);
  const ccId = d?.classCard;
  const cc = ccId ? CARDS[ccId] : null;
  if (cc) {
    el.innerHTML = `<div style="display:flex;align-items:center;gap:6px;margin-top:6px;padding:5px 6px;background:#1a1a28;border:1px solid #333;border-radius:5px">
      <img src="${cc.img}" onerror="this.src='${GENERIC}'" style="width:28px;height:28px;object-fit:cover;border-radius:3px" />
      <span style="font-size:.72rem;color:var(--gold)">★ ${cc.name}</span>
    </div>`;
  } else {
    el.innerHTML = `<div style="font-size:.68rem;color:#666;margin-top:4px;font-style:italic">${T('tcg.lobby.noClassCard')}</div>`;
  }
}

function populateDeckSelects() {
  const decks = getDecksForSelect();
  ['p1-deck', 'p2-deck'].forEach((id, pidx) => {
    const sel = document.getElementById(id); if (!sel) return;
    sel.innerHTML = '';
    const rnd = document.createElement('option'); rnd.value = 'random'; rnd.textContent = T('tcg.db.randomDeck'); sel.appendChild(rnd);
    decks.forEach(d => { const o = document.createElement('option'); o.value = d.id; o.textContent = d.name; sel.appendChild(o); });
    if (id === 'p2-deck') sel.selectedIndex = decks.length > 1 ? 2 : 0;
    const infoId = pidx === 0 ? 'p1-class-info' : 'p2-class-info';
    updateClassInfo(infoId, sel.value, decks);
    sel.onchange = () => updateClassInfo(infoId, sel.value, decks);
  });
}

let dbDeck = {}, dbClassCard = null, dbFilters = new Set(), dbEditIdx = -1, dbSearch = '';
let dbEnergyFilters = new Set();
function filterCards(cls, btn) {
  if (cls === 'all') {
    dbFilters.clear(); dbEnergyFilters.clear();
    document.querySelectorAll('.class-filter-btn, .energy-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  } else {
    document.querySelector('[data-class="all"]')?.classList.remove('active');
    if (dbFilters.has(cls)) { dbFilters.delete(cls); btn.classList.remove('active'); }
    else { dbFilters.add(cls); btn.classList.add('active'); }
  }
  renderCardPool();
}
function toggleEnergyFilter(type, btn) {
  if (dbEnergyFilters.has(type)) { dbEnergyFilters.delete(type); btn.classList.remove('active'); }
  else { dbEnergyFilters.add(type); btn.classList.add('active'); }
  renderCardPool();
}

/* ── Card Face Builder ───────────────────────────── */
function getEffectLabels() {
  return {
    draw1: T('tcg.effect.draw1'), draw2: T('tcg.effect.draw2'), draw3: T('tcg.effect.draw3'),
    burn1: T('tcg.effect.burn1'), burn2: T('tcg.effect.burn2'),
    opponent_discard_energy1: T('tcg.effect.discardEnergy'),
    item_lock: T('tcg.effect.itemLock'),
    remove_stall: T('tcg.effect.removeStall'),
    defense_guard: T('tcg.effect.defenseGuard'),
    draw2energy: T('tcg.effect.draw2energy'),
    draw2energy_draw1: T('tcg.effect.draw2e1c'),
    heal30: T('tcg.effect.heal30'), heal15x2: T('tcg.effect.heal15x2'), heal_all20: T('tcg.effect.healAll20'),
  };
}
const EFFECT_LABELS = {}; // kept for compatibility - will be populated lazily

function buildCardFace(card, count, max) {
  const isSupport = ['item', 'tool', 'supporter'].includes(card.type);
  const isEnergy = card.type === 'energy';
  const isClass = card.type === 'class';
  const cls = isEnergy ? 'cf-energy' : isSupport ? 'cf-neutral' : isClass ? 'cf-class-card' : ('cf-' + (card.class || 'neutral'));
  const face = document.createElement('div');
  face.className = `card-face ${cls} cf-${card.class || 'neutral'}${count > 0 ? ' in-deck' : ''}${count >= max ? ' maxed' : ''}`;

  if (isClass) {
    const clsCols = { classic: '#7ad', toy: '#4b8', withered: '#c84', phantom: '#b7d', nightmare: '#d44', jacko: '#e84', shadow: '#66b', funtime: '#47d', scrap: '#a62', rockstar: '#d4af37', glitch: '#7b00ff', glamrock: '#00e5ff' };
    const col = clsCols[card.class] || '#aaa';
    face.innerHTML = `
      <div class="cf-header cf-class-header" style="background:${col}22;border-bottom:2px solid ${col}55">
        <span class="cf-class" style="color:${col};text-transform:uppercase;font-size:0.65em">${card.class || ''}</span>
        <span class="cf-name" style="font-size:0.85em">${card.name}</span>
      </div>
      <div class="cf-img cf-img-lg"><img src="${card.img}" onerror="this.src='${GENERIC}'" /></div>
      <div class="cf-class-effect">
        <div class="cf-move-row">
          <span class="cf-move-name">${T('tcg.card.effectLabel')}</span>
          <span class="cf-move-cost" style="color:${col}">${card.oncePer === 'turn' ? T('tcg.card.onceTurn') : T('tcg.card.onceGame')}</span>
        </div>
        <div class="cf-move-desc">${card.effectDesc || ''}</div>
      </div>
      <div class="cf-desc">${card.desc || ''}</div>`;
    if (count !== undefined) {
      const cntEl = document.createElement('div');
      cntEl.className = 'cf-count';
      cntEl.textContent = `${count}/${max}`;
      face.appendChild(cntEl);
    }
    return face;
  }

  if (isEnergy) {
    const eMeta = ENERGY_META[card.energyType] || ENERGY_META.generic;
    face.innerHTML = `
      <div class="cf-header">
        <span class="cf-name">${card.name}</span>
        <span class="cf-type-badge" style="color:${eMeta.color}">Energy ${eMeta.sym}</span>
      </div>
      <div class="cf-img"><img src="${card.img}" onerror="this.src='${GENERIC}'" /></div>
      <div class="cf-energy-body">
        <div class="cf-energy-desc">${card.desc || ''}</div>
      </div>`;
  } else if (isSupport) {
    face.innerHTML = `
      <div class="cf-header cf-sup-header">
        <span class="cf-name">${card.name}</span>
        <span class="cf-type-badge">${card.type}</span>
      </div>
      <div class="cf-img cf-img-lg"><img src="${card.img}" onerror="this.src='${GENERIC}'" /></div>
      <div class="cf-desc">${card.desc || ''}</div>
      <div class="cf-rules">${card.passive || card.effect || card.once_per_turn || ''}</div>`;
  } else {
    const eMeta = ENERGY_META[card.energyType] || {};
    const typeLabel = card.type === 'endo' ? T('tcg.card.typeEndo') : T('tcg.card.typeShell');
    const evoLabel = card.wakeThreshold > 0
      ? `${eMeta.sym || '⚡'}`
      : `${eMeta.sym || '⚡'}`;
    const moves = [];
    const _abl = card.ability || (card.abilities && card.abilities[0]);
    if (_abl) {
      const _ablLabel = card.abilities ? T('tcg.card.abilities', { n: card.abilities.length }) : T('tcg.card.abilityLabel', { name: _abl.name });
      const _ablDesc = card.abilities ? card.abilities.map(a => a.name).join(', ') : (_abl.desc || '');
      moves.push(`<div class="cf-move cf-ability">
        <div class="cf-move-row">
          <span class="cf-move-name">${_ablLabel}</span>
        </div>
        <div class="cf-move-desc">${_ablDesc}</div>
      </div>`);
    }
    (card.attacks || []).slice(0, _abl ? 1 : 2).forEach(atk => {
      let val;
      const t = atk.type;
      if (t === 'single') val = `${atk.damage} ×1`;
      else if (t === 'multi') val = `${atk.damage} ×${atk.targets === -1 ? 'T' : atk.targets}`;
      else if (t === 'heal') val = `+${atk.healAmount} ×${atk.healTargets}`;
      else if (t === 'stall') val = `×${atk.stallTargets} ${atk.stallTurns}T`;
      else if (t === 'defense') val = `-${atk.defenseReduction} ${atk.defenseTurns}T`;
      else if (t === 'gamble') val = `${Math.round((atk.successChance || .5) * 100)}% ×${atk.successTargets === -1 ? 'T' : '1'}`;
      else val = '-';
      // Auto-generate description when atk.desc isn't explicitly set
      let autoDesc = atk.desc || (atk.effect ? getEffectLabels()[atk.effect] : '') || '';
      if (!autoDesc) {
        if (t === 'stall') autoDesc = `Stalls ${atk.stallTargets === -1 ? 'all enemies' : atk.stallTargets + ' enemy(ies)'} for ${atk.stallTurns} turn(s).`;
        else if (t === 'defense') autoDesc = `Reduces incoming damage by ${atk.defenseReduction} for ${atk.defenseTurns} turn(s).`;
        else if (t === 'heal') autoDesc = `Heals ${atk.healAmount} HP to ${atk.healTargets} ally(ies).`;
        else if (t === 'multi' && atk.targets === -1) autoDesc = `Deals ${atk.damage} damage to all enemies.`;
      }
      moves.push(`<div class="cf-move">
        <div class="cf-move-row">
          <span class="cf-move-name">${atk.name}</span>
          <span class="cf-move-cost">${atk.cost}⚡</span>
          <span class="cf-move-val">${val}</span>
        </div>
        ${autoDesc ? `<div class="cf-move-desc">${autoDesc}</div>` : ''}
      </div>`);
    });
    face.innerHTML = `
      <div class="cf-header">
        <span class="cf-class">${card.class || ''}</span>
        <span class="cf-name">${card.name}</span>
        <span class="cf-hp">${card.hp}HP</span>
      </div>
      <div class="cf-img"><img src="${card.img}" onerror="this.src='${GENERIC}'" /></div>
      <div class="cf-typeline">
        <span>${typeLabel}${(card.requiredEndo || card.requiredShell || card.requiredShellAny) ? ' · ' + T('tcg.card.evoTag') : card.phantomSummon ? ' · ' + T('tcg.card.phantomTag') : ''}</span>
        <span style="color:${eMeta.color || '#aaa'}">${evoLabel}</span>
      </div>
      ${card.requiredShellAny ? `<div class="cf-endo-line">${T('tcg.card.evoFrom', { name: card.requiredShellAny.map(id => CARDS[id]?.name || id).join(' / ') })}</div>` : (card.requiredEndo || card.requiredShell) ? `<div class="cf-endo-line">${T('tcg.card.evoFrom', { name: CARDS[card.requiredEndo || card.requiredShell]?.name || (card.requiredEndo || card.requiredShell) })}</div>` : ''}
      <div class="cf-moves">${moves.join('')}</div>
      <div class="cf-footer">${card.wakeThreshold === 0 ? T('tcg.card.standbyAlways') : T('tcg.card.standby', { n: card.wakeThreshold })}</div>`;
  }
  if (count !== undefined) {
    const cntEl = document.createElement('div');
    cntEl.className = 'cf-count';
    cntEl.textContent = `${count}/${max}`;
    face.appendChild(cntEl);
  }
  return face;
}

function renderCardPool() {
  const pool = document.getElementById('db-card-pool'); if (!pool) return; pool.innerHTML = '';
  const isLoggedIn = !!window.TCG_USER;
  const _srch = dbSearch.toLowerCase();
  const TYPE_FILTERS = new Set(['endo', 'item', 'tool', 'supporter', 'energy', 'class']);
  Object.values(CARDS).filter(c => {
    if (c.summonOnly) return false;
    if (_srch && !c.name.toLowerCase().includes(_srch)) return false;
    // Class filter (multi-select)
    if (dbFilters.size > 0 && !_srch) {
      let pass = false;
      for (const f of dbFilters) {
        if (f === 'class' && c.type === 'class') { pass = true; break; }
        if (f === 'endo' && c.type === 'endo') { pass = true; break; }
        if (f === 'item' && c.type === 'item') { pass = true; break; }
        if (f === 'tool' && c.type === 'tool') { pass = true; break; }
        if (f === 'supporter' && c.type === 'supporter') { pass = true; break; }
        if (f === 'energy' && c.type === 'energy') { pass = true; break; }
        if (!TYPE_FILTERS.has(f) && c.class === f) { pass = true; break; }
      }
      if (!pass) return false;
    }
    // Class cards hidden unless 'class' filter active or searching
    if (c.type === 'class' && !_srch && !dbFilters.has('class') && dbFilters.size > 0) return false;
    // Energy type filter (only affects animatronics)
    const isAnim = c.type === 'endo' || c.type === 'shell';
    if (dbEnergyFilters.size > 0 && isAnim) {
      if (c.anyEnergy) return true; // accepts any energy (e.g. Rockstar Freddy)
      if (c.shadowSummon) return dbEnergyFilters.has('agony') || dbEnergyFilters.has('phantom_agony');
      if (!dbEnergyFilters.has(c.energyType)) return false;
    }
    return true;
  }).forEach(card => {
    const isClassCard = card.type === 'class';
    const count = isClassCard ? (dbClassCard === card.id ? 1 : 0) : (dbDeck[card.id] || 0);
    const cardMax = isClassCard ? 1 : (card.maxCopies || 3);
    const effectiveMax = (isLoggedIn && typeof window.tcgCollectionLimit === 'function')
      ? (window.tcgCollectionLimit(card.id, cardMax) ?? cardMax)
      : cardMax;
    const face = buildCardFace(card, count, effectiveMax);
    if (isLoggedIn) {
      const owned = window.TCG_COLLECTION?.[card.id] || 0;
      if (!isClassCard && effectiveMax === 0) face.style.opacity = '0.35';
      if (isClassCard && owned === 0) face.style.opacity = '0.35';
      const badge = document.createElement('div');
      badge.className = 'db-owned-badge';
      badge.textContent = `Own: ${owned}`;
      face.style.position = 'relative';
      face.appendChild(badge);
    }
    face.onclick = () => showDbCardInfo(card);
    face.addEventListener('mouseenter', () => showCardHoverPreview(card, face));
    face.addEventListener('mouseleave', hideCardHoverPreview);
    pool.appendChild(face);
  });
}

function showDbCardInfo(card) {
  showCardInfoData(card);
  const actions = document.getElementById('info-actions'); actions.innerHTML = '';

  if (card.type === 'class') {
    // Class card: Selecionar / Remover
    const isSelected = dbClassCard === card.id;
    const btn = mk('button', 'tcg-btn primary', isSelected ? T('tcg.db.classSelected') : T('tcg.db.classSelect'), () => {
      if (isSelected) removeCardFromDeck(card.id);
      else addCardToDeck(card.id);
      showDbCardInfo(card); // refresh
    });
    btn.style.cssText = 'width:100%;margin:8px 0 4px;font-size:.85rem';
    if (isSelected) btn.style.cssText += 'background:var(--gold-dark);';
    actions.appendChild(btn);
    const note = document.createElement('div');
    note.style.cssText = 'font-size:.68rem;color:var(--text-muted);text-align:center;margin-top:2px';
    note.textContent = `${T('tcg.db.classCard')} · ${card.oncePer === 'turn' ? T('tcg.db.classCardOnce') : T('tcg.db.classCardGame')}`;
    actions.appendChild(note);
    document.getElementById('card-info-panel').style.display = '';
    document.getElementById('card-info-overlay').style.display = '';
    return;
  }

  // Regular card: count row
  const countRow = document.createElement('div');
  countRow.style.cssText = 'display:flex;align-items:center;gap:10px;justify-content:center;margin:8px 0 4px';

  const id = card.id, max = card.maxCopies || 3;
  const countLabel = document.createElement('span');
  countLabel.style.cssText = 'font-size:1.1rem;font-weight:600;min-width:3.5rem;text-align:center;color:var(--gold)';

  const minusBtn = mk('button', 'tcg-btn small', '−', () => { removeCardFromDeck(id); refresh(); });
  const plusBtn = mk('button', 'tcg-btn small', '+', () => { addCardToDeck(id); refresh(); });
  minusBtn.style.fontSize = '1.1rem'; plusBtn.style.fontSize = '1.1rem';

  const refresh = () => {
    const count = dbDeck[id] || 0;
    const effectiveMax = (typeof window.tcgCollectionLimit === 'function')
      ? (window.tcgCollectionLimit(id, max) ?? max) : max;
    const over = count > effectiveMax;
    countLabel.textContent = `${count} / ${effectiveMax}`;
    countLabel.style.color = over ? 'var(--red, #f55)' : 'var(--gold)';
    minusBtn.disabled = count <= 0;
    plusBtn.disabled = false;
    renderCardPool();
    renderDeckList();
  };

  countRow.appendChild(minusBtn);
  countRow.appendChild(countLabel);
  countRow.appendChild(plusBtn);
  actions.appendChild(countRow);

  if (card.attacks?.length) {
    const note = document.createElement('div');
    note.style.cssText = 'font-size:.68rem;color:var(--text-muted);text-align:center;margin-top:2px';
    note.textContent = T('tcg.db.attacks', { n: card.attacks.length, wake: card.wakeThreshold === 0 ? T('tcg.db.wakeAlways') : card.wakeThreshold + '⚡' });
    actions.appendChild(note);
  }

  refresh();
  document.getElementById('card-info-panel').style.display = '';
  document.getElementById('card-info-overlay').style.display = '';
}

function addCardToDeck(id) {
  const c = CARDS[id]; if (!c) return;
  if (c.summonOnly) return;
  if (c.type === 'class') {
    if (window.TCG_USER && (window.TCG_COLLECTION?.[id] || 0) < 1) return;
    dbClassCard = id; renderDeckList(); renderCardPool(); return;
  }
  const cardMax = c.maxCopies || 3;
  const effectiveMax = (typeof window.tcgCollectionLimit === 'function')
    ? (window.tcgCollectionLimit(id, cardMax) ?? cardMax)
    : cardMax;
  const count = dbDeck[id] || 0;
  dbDeck[id] = count + 1; renderDeckList(); renderCardPool();
}
function removeCardFromDeck(id) {
  const c = CARDS[id]; if (!c) return;
  if (c.type === 'class') { dbClassCard = null; renderDeckList(); renderCardPool(); return; }
  if (!dbDeck[id]) return; if (--dbDeck[id] === 0) delete dbDeck[id]; renderDeckList(); renderCardPool();
}

function isDeckInvalid() {
  const total = Object.values(dbDeck).reduce((a, b) => a + b, 0);
  if (total !== 40) return true;
  return Object.entries(dbDeck).some(([id, count]) => count > (CARDS[id]?.maxCopies || 3));
}
function renderDeckList() {
  const list = document.getElementById('db-deck-list'), cnt = document.getElementById('db-count'); if (!list) return;
  const total = Object.values(dbDeck).reduce((a, b) => a + b, 0);
  const invalid = isDeckInvalid();
  cnt.textContent = `${total}/40`;
  cnt.style.color = invalid ? 'var(--red, #f55)' : 'var(--green, #5d5)';
  list.innerHTML = '';
  if (total < 40) {
    const warn = document.createElement('div');
    warn.style.cssText = 'font-size:.68rem;color:var(--red,#f55);text-align:center;padding:4px 0 6px';
    warn.textContent = `⚠ ${40 - total} more card(s) needed — can save but not play`;
    list.appendChild(warn);
  } else if (total > 40 || Object.entries(dbDeck).some(([id, c]) => c > (CARDS[id]?.maxCopies || 3))) {
    const warn = document.createElement('div');
    warn.style.cssText = 'font-size:.68rem;color:var(--red,#f55);text-align:center;padding:4px 0 6px';
    warn.textContent = '⚠ Deck over limit — can save but not play';
    list.appendChild(warn);
  }
  Object.entries(dbDeck).forEach(([id, count]) => {
    const c = CARDS[id]; if (!c) return;
    const cardMax = c.maxCopies || 3;
    const overCard = count > cardMax;
    const div = document.createElement('div'); div.className = 'deck-entry';
    div.innerHTML = `<img src="${c.img}" onerror="this.src='${GENERIC}'" /><span class="de-name">${c.name}</span><span class="de-qty" style="${overCard ? 'color:var(--red,#f55)' : ''}">×${count}${overCard ? ` (max ${cardMax})` : ''}</span><button class="de-minus" onclick="removeCardFromDeck('${id}')">−</button>`;
    list.appendChild(div);
  });
  // Class card (41st card)
  if (dbClassCard) {
    const cc = CARDS[dbClassCard]; if (cc) {
      const div = document.createElement('div'); div.className = 'deck-entry deck-class-entry';
      div.innerHTML = `<img src="${cc.img}" onerror="this.src='${GENERIC}'" /><span class="de-name" style="color:var(--gold)">★ ${cc.name}</span><span class="de-qty" style="font-size:.6rem;color:var(--text-muted)">Classe</span><button class="de-minus" onclick="removeCardFromDeck('${cc.id}')">−</button>`;
      list.appendChild(div);
    }
  } else {
    const div = document.createElement('div'); div.className = 'deck-entry deck-class-missing';
    div.innerHTML = `<span class="de-name" style="color:#888;font-style:italic;font-size:.72rem">${T('tcg.db.noClassMissing')}</span>`;
    list.appendChild(div);
  }
}
function saveDeck() {
  const name = (document.getElementById('db-name')?.value.trim() || 'Unnamed Deck');
  if (!Object.keys(dbDeck).length) { alert(T('tcg.db.deckEmpty')); return; }
  const gen = document.getElementById('db-generator')?.value || 'remnant';
  const list = Object.entries(dbDeck).map(([id, cnt]) => [id, cnt]);
  const overLimit = isDeckInvalid();
  const entry = { name, list, generator: gen, classCard: dbClassCard || undefined, overLimit: overLimit || undefined };
  const saved = getSavedDecks();
  if (dbEditIdx >= 0 && dbEditIdx < saved.length) {
    saved[dbEditIdx] = entry; // update in-place (preserves index even if name changed)
  } else {
    const ex = saved.findIndex(d => d.name === name);
    if (ex >= 0) saved[ex] = entry; else { saved.push(entry); dbEditIdx = saved.length - 1; }
  }
  setSavedDecks(saved); renderSavedDecks(); populateDeckSelects(); alert(T('tcg.db.deckSaved', { name }));
}
function clearDeck() { dbDeck = {}; dbClassCard = null; dbEditIdx = -1; renderDeckList(); renderCardPool(); }
function loadSavedDeck(idx) {
  const d = getSavedDecks()[idx]; if (!d) return;
  document.getElementById('db-name').value = d.name;
  if (d.generator) { const s = document.getElementById('db-generator'); if (s) s.value = d.generator; }
  dbDeck = {}; dbClassCard = d.classCard || null; dbEditIdx = idx;
  d.list.forEach(([id, cnt]) => { dbDeck[id] = cnt; });
  renderDeckList(); renderCardPool();
}
function deleteSavedDeck(idx) {
  if (!confirm(T('tcg.db.deleteConfirm'))) return;
  const s = getSavedDecks(); s.splice(idx, 1);
  if (dbEditIdx === idx) dbEditIdx = -1;
  else if (dbEditIdx > idx) dbEditIdx--;
  setSavedDecks(s); renderSavedDecks(); populateDeckSelects();
}

/* ── Deck Export / Import ─────────────────────────────── */
function exportCurrentDeck() {
  const name = document.getElementById('db-name')?.value.trim() || 'Unnamed Deck';
  const gen = document.getElementById('db-generator')?.value || 'remnant';
  const list = Object.entries(dbDeck).map(([id, cnt]) => [id, cnt]);
  if (!list.length) { alert(T('tcg.db.deckEmpty')); return; }
  const code = btoa(JSON.stringify({ name, generator: gen, classCard: dbClassCard || null, list }));
  _showDeckCodeModal(code, T('tcg.db.exportTitle') || 'Export Deck');
}
function exportSavedDeck(idx) {
  const d = getSavedDecks()[idx]; if (!d) return;
  const code = btoa(JSON.stringify({ name: d.name, generator: d.generator || 'remnant', classCard: d.classCard || null, list: d.list }));
  _showDeckCodeModal(code, `Export: ${d.name}`);
}
function importDeck() {
  _showDeckImportModal();
}
function _parseDeckCode(code) {
  try { return JSON.parse(atob(code.trim())); } catch (e) { return null; }
}
function _applyDeckData(d) {
  if (!d || !d.list) { alert('Invalid deck code.'); return; }
  document.getElementById('db-name').value = d.name || 'Imported Deck';
  if (d.generator) { const s = document.getElementById('db-generator'); if (s) s.value = d.generator; }
  dbDeck = {}; dbClassCard = d.classCard || null; dbEditIdx = -1;
  d.list.forEach(([id, cnt]) => { if (CARDS[id]) dbDeck[id] = cnt; });
  renderDeckList(); renderCardPool();
}
function _showDeckCodeModal(code, title) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:9999;display:flex;align-items:center;justify-content:center';
  overlay.innerHTML = `
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:20px;max-width:480px;width:90%;display:flex;flex-direction:column;gap:10px">
      <div style="font-weight:600;font-size:.9rem">${title}</div>
      <textarea id="_deck-code-ta" rows="4" style="width:100%;font-size:.65rem;font-family:monospace;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:4px;padding:6px;resize:vertical">${code}</textarea>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="tcg-btn small" id="_deck-code-copy">📋 Copy</button>
        <button class="tcg-btn small" onclick="this.closest('[style*=fixed]').remove()">Close</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  const ta = overlay.querySelector('#_deck-code-ta'); ta.select();
  overlay.querySelector('#_deck-code-copy').onclick = () => {
    if (navigator.clipboard) { navigator.clipboard.writeText(code).then(() => { const b = overlay.querySelector('#_deck-code-copy'); const o = b.textContent; b.textContent = '✓ Copied!'; setTimeout(() => b.textContent = o, 2000); }); }
    else { ta.select(); document.execCommand('copy'); }
  };
}
function _showDeckImportModal() {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:9999;display:flex;align-items:center;justify-content:center';
  overlay.innerHTML = `
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:20px;max-width:480px;width:90%;display:flex;flex-direction:column;gap:10px">
      <div style="font-weight:600;font-size:.9rem">Import Deck</div>
      <textarea id="_deck-import-ta" rows="4" placeholder="Paste deck code here..." style="width:100%;font-size:.65rem;font-family:monospace;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:4px;padding:6px;resize:vertical"></textarea>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="tcg-btn small primary" id="_deck-import-btn">Import</button>
        <button class="tcg-btn small" onclick="this.closest('[style*=fixed]').remove()">Cancel</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#_deck-import-btn').onclick = () => {
    const code = overlay.querySelector('#_deck-import-ta').value.trim();
    const d = _parseDeckCode(code);
    if (!d) { alert('Invalid deck code. Make sure you pasted the full code.'); return; }
    _applyDeckData(d); overlay.remove();
  };
}

function renderSavedDecks() {
  const el = document.getElementById('db-saved-decks'); if (!el) return;
  const saved = getSavedDecks(); el.innerHTML = '';
  if (!saved.length) { el.innerHTML = `<div style="font-size:.78rem;color:var(--text-muted)">${T('tcg.db.noSaved')}</div>`; return; }
  saved.forEach((d, i) => {
    const total = d.list.reduce((s, [, c]) => s + c, 0);
    const row = document.createElement('div'); row.className = 'saved-deck-row';
    const active = dbEditIdx === i ? ` style="outline:2px solid var(--gold);outline-offset:2px;border-radius:4px"` : '';
    const overTag = d.overLimit ? ` <span style="color:var(--red,#f55);font-size:.65rem">⚠ invalid</span>` : '';
    row.innerHTML = `<span class="sd-name"${active}>${d.name}${overTag}</span><span class="sd-count">${total}</span>`
      + `<button class="tcg-btn small" onclick="loadSavedDeck(${i})">${T('tcg.db.load')}</button>`
      + `<button class="tcg-btn small" onclick="exportSavedDeck(${i})">↑</button>`
      + `<button class="tcg-btn small danger" onclick="deleteSavedDeck(${i})">✕</button>`;
    el.appendChild(row);
  });
}
let _currentTab = 'play';
function _switchTabRaw(tab) {
  _currentTab = tab;
  ['play', 'deck', 'rules', 'online', 'collection', 'booster', 'trade'].forEach(t => {
    const c = document.getElementById('tab-content-' + t);
    const b = document.getElementById('tab-' + t);
    if (c) c.style.display = t === tab ? '' : 'none';
    if (b) b.classList.toggle('active', t === tab);
  });
  if (tab === 'deck') { renderCardPool(); renderDeckList(); renderSavedDecks(); }
  if (tab === 'online' && window.tcgMpInit) tcgMpInit();
}
function switchTab(tab) {
  _switchTabRaw(tab);          // visual update imediato
  location.hash = 'lobby/' + tab; // cria entrada no histórico → back funciona
}

/* ═══════════════════════════════════════════════════════
   GAME START / MULLIGAN
   ═══════════════════════════════════════════════════════ */
let _startConfig = null;
function startGame() {
  const decks = getDecksForSelect();
  const resolve = val => val === 'random' ? decks[Math.floor(Math.random() * decks.length)] : decks.find(d => d.id === val);
  const p1d = resolve(document.getElementById('p1-deck')?.value);
  const p2d = resolve(document.getElementById('p2-deck')?.value);
  if (!p1d || !p2d) { alert(T('tcg.db.selectDecks')); return; }
  const _deckBadIds = d => (d.list || []).filter(([id]) => !CARDS[id]).map(([id]) => id);
  const _deckTotal = d => (d.list || []).reduce((s, [id, c]) => CARDS[id] ? s + c : s, 0);
  const _deckCardOver = d => (d.list || []).some(([id, c]) => c > (CARDS[id]?.maxCopies || 3));
  const b1 = _deckBadIds(p1d), b2 = _deckBadIds(p2d);
  if (b1.length) { alert(`"${p1d.name}" has unknown card ID(s): ${b1.join(', ')}. Edit the deck to fix it.`); return; }
  if (b2.length) { alert(`"${p2d.name}" has unknown card ID(s): ${b2.join(', ')}. Edit the deck to fix it.`); return; }
  if (_deckTotal(p1d) !== 40 || _deckCardOver(p1d) || p1d.overLimit) { alert(`"${p1d.name}" must have exactly 40 cards (within copy limits) to play.`); return; }
  if (_deckTotal(p2d) !== 40 || _deckCardOver(p2d) || p2d.overLimit) { alert(`"${p2d.name}" must have exactly 40 cards (within copy limits) to play.`); return; }
  const p1Name = document.getElementById('p1-name')?.value.trim() || 'Player 1';
  const p2Name = document.getElementById('p2-name')?.value.trim() || 'Player 2';
  const p1Class = p1d.classCard || 'class_classic';
  const p2Class = p2d.classCard || 'class_classic';
  _startConfig = { p1Name, p1List: p1d.list, p1Gen: p1d.generator, p1Class, p2Name, p2List: p2d.list, p2Gen: p2d.generator, p2Class };
  initGame(_startConfig);
}

function initGame(cfg) {
  G = {
    players: [makePlayer(cfg.p1Name, cfg.p1List, cfg.p1Gen || 'remnant', cfg.p1Class || 'class_classic'),
    makePlayer(cfg.p2Name, cfg.p2List, cfg.p2Gen || 'remnant', cfg.p2Class || 'class_classic')],
    activePlayer: 0, turn: 1, phase: 'mulligan', _seq: 0,
    mulliganAttempts: [0, 0], pendingTarget: null, log: [], winner: null,
    dice: { guesserIdx: 0, guess: null, roll: null, chooserIdx: null }
  };
  undoStack = [];
  _mpMulliganShown = false; _mpDiceRolling = false;
  startDicePhase();
}

/* ═══════════════════════════════════════════════════════
   DICE PHASE
   ═══════════════════════════════════════════════════════ */
function startDicePhase() {
  G.phase = 'dice';
  G.dice.guesserIdx = Math.floor(Math.random() * 2);
  G.dice.guess = null; G.dice.roll = null; G.dice.chooserIdx = null;
  showScreen('dice');
  renderDiceScreen('guess');
}

function renderDiceScreen(step) {
  const wrap = document.getElementById('dice-wrap');
  if (!wrap) return;
  const d = G.dice;
  const guesser = G.players[d.guesserIdx];
  const other = G.players[1 - d.guesserIdx];
  wrap.innerHTML = '';

  const isOnline = window.MP && MP.mode === 'online';
  const amGuesser = !isOnline || d.guesserIdx === MP.myIdx;

  const title = mk('h2', 'tcg-title', T('tcg.dice.title'));
  wrap.appendChild(title);

  if (step === 'guess') {
    if (!amGuesser) {
      wrap.appendChild(mk('p', 'tcg-sub', T('tcg.dice.guesserChoosing', { name: guesser.name })));
      return;
    }
    wrap.appendChild(mk('p', 'tcg-sub', T('tcg.dice.yourTurn', { name: guesser.name })));
    const row = document.createElement('div'); row.style.cssText = 'display:flex;gap:10px;justify-content:center;margin:14px 0';
    // Use G.dice directly (not captured d) to survive any G= replacement by pullGameState
    const btnPar = mk('button', 'tcg-btn primary', T('tcg.dice.even'), () => { G.dice.guess = 'par'; pushGameState(); renderDiceScreen('roll'); });
    const btnImpar = mk('button', 'tcg-btn primary', T('tcg.dice.odd'), () => { G.dice.guess = 'impar'; pushGameState(); renderDiceScreen('roll'); });
    row.appendChild(btnPar); row.appendChild(btnImpar);
    wrap.appendChild(row);

  } else if (step === 'roll') {
    if (!amGuesser) {
      wrap.appendChild(mk('p', 'tcg-sub', T('tcg.dice.chosen', { name: guesser.name, choice: d.guess === 'par' ? T('tcg.dice.chosenEven') : T('tcg.dice.chosenOdd') })));
      return;
    }
    wrap.appendChild(mk('p', 'tcg-sub', T('tcg.dice.choseLabel', { name: guesser.name, choice: d.guess === 'par' ? T('tcg.dice.chosenEven') : T('tcg.dice.chosenOdd') })));
    const diceEl = document.createElement('div'); diceEl.className = 'dice-face'; diceEl.textContent = '?';
    wrap.appendChild(diceEl);
    const btn = mk('button', 'tcg-btn primary', T('tcg.dice.rollBtn'), () => {
      btn.disabled = true;
      _mpDiceRolling = true; // block pullGameState from rebuilding UI mid-animation
      let ticks = 0, maxTicks = 8;
      const anim = setInterval(() => {
        diceEl.textContent = Math.ceil(Math.random() * 6); ticks++;
        if (ticks >= maxTicks) {
          clearInterval(anim);
          // Always write to G.dice (current), not captured d (may be stale after G= replacement)
          G.dice.roll = Math.ceil(Math.random() * 6);
          const isEven = G.dice.roll % 2 === 0;
          G.dice.chooserIdx = ((G.dice.guess === 'par') === isEven) ? G.dice.guesserIdx : 1 - G.dice.guesserIdx;
          diceEl.textContent = G.dice.roll;
          _mpDiceRolling = false;
          pushGameState();
          setTimeout(() => renderDiceScreen('result'), 400);
        }
      }, 80);
    });
    wrap.appendChild(btn);

  } else if (step === 'result') {
    const isEven = d.roll % 2 === 0;
    const rollWord = isEven ? T('tcg.dice.parityEven') : T('tcg.dice.parityOdd');
    const correct = (d.guess === 'par') === isEven;
    // chooserIdx already set when roll was made
    if (d.chooserIdx === null || d.chooserIdx === undefined) {
      d.chooserIdx = correct ? d.guesserIdx : 1 - d.guesserIdx;
    }
    const chooser = G.players[d.chooserIdx];
    const amChooser = !isOnline || d.chooserIdx === MP.myIdx;

    const rollEl = mk('p', 'tcg-sub', T('tcg.dice.result', { n: d.roll, parity: rollWord }));
    rollEl.style.fontSize = '1.2rem'; rollEl.style.color = 'var(--gold)';
    wrap.appendChild(rollEl);

    if (correct) wrap.appendChild(mk('p', 'tcg-sub', T('tcg.dice.correct', { guesser: guesser.name, chooser: chooser.name })));
    else wrap.appendChild(mk('p', 'tcg-sub', T('tcg.dice.wrong', { guesser: guesser.name, chooser: chooser.name })));

    if (!amChooser) {
      wrap.appendChild(mk('p', 'tcg-sub', T('tcg.dice.waiting', { name: chooser.name })));
      return;
    }
    const row = document.createElement('div'); row.style.cssText = 'display:flex;gap:10px;justify-content:center;margin:14px 0';
    row.appendChild(mk('button', 'tcg-btn primary', T('tcg.dice.first'), () => finishDicePhase(d.chooserIdx)));
    row.appendChild(mk('button', 'tcg-btn primary', T('tcg.dice.second'), () => finishDicePhase(1 - d.chooserIdx)));
    wrap.appendChild(row);
  }
}

function finishDicePhase(firstPlayerIdx) {
  G.activePlayer = firstPlayerIdx;
  if (window.MP && MP.mode === 'online') {
    // Sequential online mulligan: only one player mulligans at a time.
    // G._mulliganTurn tracks whose mulligan it currently is.
    G.phase = 'mulligan';
    G._firstPlayer = firstPlayerIdx;
    G._mulliganTurn = firstPlayerIdx; // first player goes first
    // Draw first player's starting hand
    const fp = G.players[firstPlayerIdx]; fp.hand = [];
    for (let j = 0; j < 5; j++) { const c = fp.deck.pop(); if (c) fp.hand.push(c); }
    _mpMulliganShown = false; _mpDiceRolling = false;
    pushGameState();
    showScreen('mulligan');
    if (G._mulliganTurn === MP.myIdx) {
      _mpMulliganShown = true;
      renderMulligan(G._mulliganTurn);
    } else {
      mpShowMulliganWait(G._mulliganTurn);
    }
    return;
  }
  drawStartingHand(firstPlayerIdx);
}

function drawStartingHand(pidx) {
  const p = G.players[pidx]; p.hand = [];
  for (let i = 0; i < 5; i++) { const c = p.deck.pop(); if (c) p.hand.push(c); }
  showScreen('mulligan'); renderMulligan(pidx);
}

function mpShowMulliganWait(activePlayerIdx) {
  const name = G.players[activePlayerIdx]?.name || '?';
  const att = G.mulliganAttempts[activePlayerIdx] || 0;
  document.getElementById('mulligan-title').textContent = T('tcg.mulligan.waiting');
  document.getElementById('mulligan-sub').textContent = T('tcg.mulligan.waitingFor', { name, n: att });
  document.getElementById('mulligan-hand').innerHTML = '';
  document.getElementById('mulligan-buttons').innerHTML = '';
}

function renderMulligan(pidx) {
  const p = G.players[pidx];
  const hasEndo = p.hand.some(c => c.type === 'endo' && !c.blobSummon);
  const att = G.mulliganAttempts[pidx];
  document.getElementById('mulligan-title').textContent = T('tcg.mulligan.titleFor', { name: p.name });
  document.getElementById('mulligan-sub').textContent = hasEndo
    ? T('tcg.mulligan.hasEndo', { n: p.hand.filter(c => c.type === 'endo' && !c.blobSummon).length })
    : att >= 2 ? T('tcg.mulligan.noEndoForce') : T('tcg.mulligan.noEndo');
  const handEl = document.getElementById('mulligan-hand'); handEl.innerHTML = '';
  p.hand.forEach(c => {
    const face = buildCardFace(c);
    face.classList.add('mulligan-cf');
    face.onclick = () => openCardInfoPanel(c);
    handEl.appendChild(face);
  });
  const btns = document.getElementById('mulligan-buttons'); btns.innerHTML = '';
  if (!hasEndo && att < 2) { doMulliganDraw(pidx); return; }
  if (!hasEndo && att >= 2) { forceEndoSearch(pidx); return; }
  if (hasEndo) {
    btns.appendChild(mk('button', 'tcg-btn primary', T('tcg.mulligan.keep'), () => finishMulligan(pidx)));
    if (att < 2) btns.appendChild(mk('button', 'tcg-btn', T('tcg.mulligan.swap'), () => doMulliganDraw(pidx)));
  }
}

function doMulliganDraw(pidx) {
  const att = G.mulliganAttempts[pidx];
  G.mulliganAttempts[pidx]++;
  if (att >= 1) {
    const opp = 1 - pidx;
    G.players[opp]._mulliganBonus = (G.players[opp]._mulliganBonus || 0) + 1;
  }
  const p = G.players[pidx];
  p.deck = shuffle([...p.deck, ...p.hand]); p.hand = [];
  for (let i = 0; i < 5; i++) { const c = p.deck.pop(); if (c) p.hand.push(c); }
  renderMulligan(pidx);
}

function forceEndoSearch(pidx) {
  const p = G.players[pidx];
  p.hand = [];
  const endoIdx = p.deck.findIndex(c => c.type === 'endo' && !c.blobSummon);
  if (endoIdx >= 0) {
    const endo = p.deck.splice(endoIdx, 1)[0];
    p.deck = shuffle(p.deck);
    p.hand = [endo];
    for (let i = 0; i < 4; i++) { const c = p.deck.pop(); if (c) p.hand.push(c); }
  } else {
    p.deck = shuffle(p.deck);
    for (let i = 0; i < 5; i++) { const c = p.deck.pop(); if (c) p.hand.push(c); }
  }
  finishMulligan(pidx);
}

function mpBeginGame() {
  // Online: place only the FIRST endo (minimum required), rest stay in hand
  G.players.forEach(p => {
    if (!p.party.some(s => s)) {
      const first = p.hand.find(c => c.type === 'endo' && !c.blobSummon);
      if (first) { const slot = p.party.findIndex(s => !s); if (slot >= 0) { p.party[slot] = newSlot(first); p.hand = p.hand.filter(c => c.uid !== first.uid); } }
    }
  });
  G.players.forEach((p, i) => { if (p._mulliganBonus) { for (let j = 0; j < p._mulliganBonus; j++)drawCardImmediate(i); delete p._mulliganBonus; } });
  beginGame();
}

function finishMulligan(pidx) {
  if (window.MP && MP.mode === 'online') {
    const firstPidx = G._firstPlayer;
    const secondPidx = 1 - firstPidx;
    if (pidx === firstPidx) {
      // First player done - draw second player's hand and switch turn
      G._mulliganTurn = secondPidx;
      const sp = G.players[secondPidx]; sp.hand = [];
      for (let j = 0; j < 5; j++) { const c = sp.deck.pop(); if (c) sp.hand.push(c); }
      _mpMulliganShown = false;
      pushGameState(); // second player's machine will see G._mulliganTurn===MP.myIdx and render mulligan
      showScreen('mulligan');
      if (G._mulliganTurn === MP.myIdx) {
        _mpMulliganShown = true;
        renderMulligan(G._mulliganTurn);
      } else {
        mpShowMulliganWait(G._mulliganTurn);
      }
    } else {
      // Second player done - start game
      G.players.forEach((p, i) => { if (p._mulliganBonus) { for (let j = 0; j < p._mulliganBonus; j++)drawCardImmediate(i); delete p._mulliganBonus; } });
      mpBeginGame();
    }
    return;
  }
  // Local sequential
  const firstPidx = G.activePlayer;
  if (pidx === firstPidx) drawStartingHand(1 - firstPidx);
  else {
    G.players.forEach((p, i) => { if (p._mulliganBonus) { for (let j = 0; j < p._mulliganBonus; j++)drawCardImmediate(i); delete p._mulliganBonus; } });
    G.phase = 'setup'; startSetupPhase(firstPidx);
  }
}
function drawCardImmediate(pidx) { const p = G.players[pidx]; if (!p.deck.length) return; const c = p.deck.pop(); if (c) p.hand.push(c); }

/* ── Setup ───────────────────────────────────────── */
function startSetupPhase(pidx) { showScreen('mulligan'); renderSetup(pidx); }
function renderSetup(pidx) {
  const p = G.players[pidx];
  const endos = p.hand.filter(c => c.type === 'endo');
  document.getElementById('mulligan-title').textContent = T('tcg.setup.title', { name: p.name });
  document.getElementById('mulligan-sub').textContent =
    T('tcg.setup.sub') + ` - Select 1–4 Endos to place (${endos.length} available). Other cards stay in hand.`;
  const handEl = document.getElementById('mulligan-hand'); handEl.innerHTML = '';
  let selected = [];

  p.hand.forEach(c => {
    const face = buildCardFace(c);
    face.classList.add('mulligan-cf');
    const isEndo = c.type === 'endo';
    const isBlobEndo = isEndo && c.blobSummon;
    if (isEndo && !isBlobEndo) {
      face.style.cursor = 'pointer';
      face.onclick = () => {
        if (selected.some(s => s.uid === c.uid)) {
          selected = selected.filter(s => s.uid !== c.uid);
          face.classList.remove('setup-selected');
        } else if (selected.length < 4) {
          selected.push(c);
          face.classList.add('setup-selected');
        }
        selLabel.textContent = `${selected.length} endo${selected.length !== 1 ? 's' : ''} selected`;
        confirmBtn.disabled = selected.length === 0;
        openCardInfoPanel(c);
      };
    } else if (isBlobEndo) {
      face.style.cursor = 'not-allowed';
      face.style.opacity = '0.45';
      face.title = 'Tangle Blob cannot be placed at setup — needs Blob Pile cards.';
      face.onclick = () => openCardInfoPanel(c);
    } else {
      face.style.cursor = 'pointer';
      face.style.opacity = '0.65';
      face.onclick = () => openCardInfoPanel(c);
    }
    handEl.appendChild(face);
  });

  const btns = document.getElementById('mulligan-buttons'); btns.innerHTML = '';
  const selLabel = document.createElement('span');
  selLabel.style.cssText = 'font-size:.8rem;color:var(--text-muted);align-self:center';
  selLabel.textContent = '0 selected';
  btns.appendChild(selLabel);

  const firstPidx = G.activePlayer;
  const confirmBtn = mk('button', 'tcg-btn primary', T('tcg.setup.confirm'), () => {
    if (!selected.length) { alert(T('tcg.setup.needEndo')); return; }
    selected.forEach((c, i) => { p.party[i] = newSlot(c); p.hand = p.hand.filter(h => h.uid !== c.uid); });
    if (pidx === firstPidx) startSetupPhase(1 - firstPidx); else beginGame();
  });
  confirmBtn.disabled = true;
  btns.appendChild(confirmBtn);
}

function beginGame() {
  // Safety net: only if a player placed NO endos at all during setup (edge case)
  G.players.forEach(p => {
    if (!p.party.some(s => s)) {
      const first = p.hand.find(c => c.type === 'endo' && !c.blobSummon);
      if (first) { const slot = p.party.findIndex(s => !s); if (slot >= 0) { p.party[slot] = newSlot(first); p.hand = p.hand.filter(h => h.uid !== first.uid); } }
    }
  });
  G.phase = 'play'; G.turn = 1;
  // Show banner if this machine is the one who goes first
  if (window.MP && MP.mode === 'online' && G.activePlayer === MP.myIdx) showYourTurnBanner();
  showScreen('game'); beginTurn();
  pushGameState();
}

/* ═══════════════════════════════════════════════════════
   TURN ENGINE
   ═══════════════════════════════════════════════════════ */
function showYourTurnBanner() {
  const existing = document.getElementById('your-turn-banner'); if (existing) existing.remove();
  const el = document.createElement('div'); el.id = 'your-turn-banner';
  el.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);' +
    'font-size:2.2rem;font-weight:900;letter-spacing:.08em;color:#fff;' +
    'text-shadow:0 0 24px #ffd700,0 0 8px #ffd700;' +
    'background:rgba(0,0,0,.82);padding:14px 44px;border-radius:14px;' +
    'border:3px solid #ffd700;z-index:9999;pointer-events:none;' +
    'animation:yourTurnPop .35s cubic-bezier(.175,.885,.32,1.275);';
  el.textContent = 'YOUR TURN!';
  document.body.appendChild(el);
  setTimeout(() => { el.style.transition = 'opacity .5s'; el.style.opacity = '0'; }, 1400);
  setTimeout(() => el.remove(), 1900);
  // inject keyframe if not already there
  if (!document.getElementById('your-turn-style')) {
    const s = document.createElement('style'); s.id = 'your-turn-style';
    s.textContent = '@keyframes yourTurnPop{from{transform:translate(-50%,-50%) scale(.6);opacity:0}to{transform:translate(-50%,-50%) scale(1);opacity:1}}';
    document.head.appendChild(s);
  }
}

function beginTurn() {
  syncEnnardMoveset(0); syncEnnardMoveset(1); // keep Ennard in sync with Blob state
  syncMimicMoveset(0); syncMimicMoveset(1);   // keep M2 in sync with Blob state
  const p = G.players[G.activePlayer];
  p.supporterPlayedThisTurn = 0;
  p.supporterMax = p._nextSupporterMax ?? 1;
  p._nextSupporterMax = undefined;
  p.classCardUsed = false;
  // Clear the opponent's hand block (set last turn by Plush Baby) now that it has taken effect
  G.players[1 - G.activePlayer].handBlocked = null;
  // Clear the revenge flag on the opponent (they already had their chance to use it last turn)
  G.players[1 - G.activePlayer].alliedDeathLastOpponentTurn = false;
  G.pendingTarget = null; undoStack = [];
  closeCardInfo();

  // Timers & flags for active player's slots
  p.party.forEach(slot => {
    if (!slot) return;
    slot.attackedThisTurn = false; slot.usedToolThisTurn = false;
    slot.canRepeatGamble = false; slot.usedGambleRepeat = false; slot.lastGambleFailed = false;
    slot.usedAbilityThisTurn = false; slot.extraAttacks = 0;
    slot.costReductionThisTurn = 0;
    if (slot.abilityDisabledTurns > 0) slot.abilityDisabledTurns--;
    if (slot.defense) { slot.defense.turnsLeft--; if (slot.defense.turnsLeft <= 0) slot.defense = null; }
    if (slot.stalledTurns > 0) slot.stalledTurns--;
    if (slot.tools.some(t => t.passive === 'regen10')) { slot.hp = Math.min(slot.card.hp, slot.hp + 10); addLog(`${slot.card.name} regenerated 10 HP.`, 'good'); }
  });

  // itemLocked is decremented at END of the locked player's turn (see endTurn)
  applyBurnDamage();
  if (G.winner) return; // burn ended the game
  _autoEndPending = false; _endTurnGuard = false; // reset for this turn
  if (p.skipNextDraw) { p.skipNextDraw = false; addLog(T('tcg.log.noDraw', { name: p.name }), 'ko'); }
  else drawCardImmediate(G.activePlayer);
  drawEnergyToPool(G.activePlayer, 1);

  addLog(T('tcg.log.turn', { name: p.name, round: G.turn }), 'info');
  renderGame();
}

function drawEnergyToPool(pidx, count = 1) {
  const p = G.players[pidx];
  for (let i = 0; i < count; i++) {
    if (!p.generator.length) {
      if (!p.genDiscard.length) { addLog(T('tcg.log.noGenEnergy', { name: p.name })); break; }
      p.generator = shuffle([...p.genDiscard]); p.genDiscard = []; addLog(T('tcg.log.recycled', { name: p.name }));
    }
    const e = p.generator.pop();
    if (e) { p.energyPool++; }
  }
}

function applyBurnDamage() {
  const opp = G.players[1 - G.activePlayer];
  const burnBonus = opp.burnBonus || 0;
  G.players[G.activePlayer].party.forEach(slot => {
    if (!slot || slot.burn <= 0) return;
    if (slot.tools.some(t => t.passive === 'burn_immune')) { slot.burn = 0; return; } // immune
    const d = slot.burn * (10 + burnBonus); slot.hp -= d; slot.burn--;
    addLog(T('tcg.log.burn', { name: slot.card.name, n: d }));
    checkKO(G.activePlayer, slot);
  });
  checkWin(); // burn can kill the last animatronic → end game
}

function endTurn() {
  if (_endTurnGuard) return; // prevent double-call
  if (window.MP && MP.mode === 'online' && G.activePlayer !== MP.myIdx) return;
  if (G.winner) return;
  _endTurnGuard = true;
  G.pendingTarget = null; // clear any pending action (attach energy, target selection, etc.)
  closeCardInfo();
  // Decrement item lock for the player who just ended their turn
  const endingPlayer = G.players[G.activePlayer];
  if (endingPlayer.itemLocked > 0) endingPlayer.itemLocked--;
  endingPlayer.party.forEach(slot => { if (slot) slot.justPlaced = false; });
  G.activePlayer = 1 - G.activePlayer; G.turn++;
  if (window.MP && MP.mode === 'online') {
    // In online mode: push and wait - opponent's machine will call beginTurn when it receives state
    pushGameState();
    renderGame();
    return;
  }
  pushGameState();
  beginTurn();
}

function markAttacked(slot) {
  if ((slot.extraAttacks || 0) > 0) { slot.extraAttacks--; } // allow extra attack
  else { slot.attackedThisTurn = true; }
}

function checkAutoEndTurn() {
  if (_autoEndPending || G.winner || G.pendingTarget) return;
  const p = G.players[G.activePlayer];
  if (p.party.some(s => s && s.awake && (!s.attackedThisTurn || (s.extraAttacks || 0) > 0) && s.stalledTurns === 0)) return;
  if (p.party.some(s => s && s.canRepeatGamble && !s.usedGambleRepeat)) return;
  _autoEndPending = true;
  addLog(T('tcg.log.allAttacked'), 'info');
  renderGame();
  requestAnimationFrame(() => { _autoEndPending = false; if (G && !G.winner) endTurn(); });
}

/* ═══════════════════════════════════════════════════════
   CARD PLAY
   ═══════════════════════════════════════════════════════ */
function playHandCard(handIdx) {
  if (window.MP && MP.mode === 'online' && G.activePlayer !== MP.myIdx) return;
  const p = G.players[G.activePlayer]; const card = p.hand[handIdx]; if (!card) return;
  if (p.handBlocked && p.handBlocked.uid === card.uid) { addLog(`${card.name} is blocked this turn by Plush Baby!`, 'ko'); return; }
  const pt = G.pendingTarget;
  if (pt && !['attachEnergy'].includes(pt.action)) return;
  closeCardInfo(); saveUndo();
  if (card.type === 'endo') playEndo(handIdx, card);
  else if (card.type === 'shell') playShell(handIdx, card);
  else if (card.type === 'item') playItem(handIdx, card);
  else if (card.type === 'tool') startEquipTool(handIdx, card);
  else if (card.type === 'supporter') playSupporter(handIdx, card);
}

function playEndo(handIdx, card) {
  const p = G.players[G.activePlayer];
  const slot = p.party.findIndex(s => s === null);
  if (slot < 0) { addLog(T('tcg.log.zoneFull')); return; }
  if (card.blobSummon) {
    const needed = card.blobSummonCost || 5;
    if (p.discard.length < needed) {
      addLog(`Tangle Blob needs ${needed}+ cards in your Blob Pile to emerge (you have ${p.discard.length}).`, 'ko');
      return;
    }
    p.hand.splice(handIdx, 1);
    const s = newSlot(card); s.justPlaced = true;
    p.party[slot] = s;
    addLog(`${p.name}'s Blob Pile gave birth to ${card.name}!`, 'good');
    renderGame(); pushGameState(); return;
  }
  p.hand.splice(handIdx, 1);
  const s = newSlot(card); s.justPlaced = true;
  p.party[slot] = s;
  addLog(T('tcg.log.played', { name: p.name, card: card.name }), 'good');
  renderGame();
  pushGameState();
}

function playShell(handIdx, card) {
  if (card.unusable) { addLog(`${card.name} cannot be played yet - no class card exists for this animatronic.`, 'ko'); return; }
  if (card.itemSummonOnly) { addLog(T('tcg.log.ennardOnlyCable'), 'ko'); return; }
  // Scrap shell - replaces the predecessor (with Fragment) in its own party slot
  if (card.scrapFrom) {
    const p = G.players[G.activePlayer];
    let predIdx = -1;
    let isCarnieEvo = false;
    if (card.id === 'lefty') {
      predIdx = p.party.findIndex(s => s && s.card.id === 'puppet' && s.tools.some(t => t.passive === 'scrap'));
      if (predIdx < 0) {
        predIdx = p.party.findIndex(s => s && s.card.id === 'carnie' && s.tools.some(t => t.passive === 'scrap'));
        if (predIdx >= 0) {
          isCarnieEvo = true;
        }
      }
    } else {
      predIdx = p.party.findIndex(s => s && s.card.id === card.scrapFrom && s.tools.some(t => t.passive === 'scrap'));
    }

    if (predIdx < 0) {
      if (card.id === 'lefty') {
        addLog(`Need Puppet or Carnie with Remnant Fragment on the field!`, 'ko');
      } else {
        addLog(`Need ${CARDS[card.scrapFrom]?.name || card.scrapFrom} with Remnant Fragment on the field!`, 'ko');
      }
      return;
    }

    if (isCarnieEvo) {
      const puppetIdx = p.hand.findIndex((c, i) => c.id === 'puppet' && i !== handIdx);
      if (puppetIdx < 0) {
        addLog('Need Puppet in hand to evolve Carnie into Lefty!', 'ko');
        return;
      }
      const agonyIdx = p.hand.findIndex((c, i) => c.type === 'energy' && c.energyType === 'remnant' && i !== handIdx && i !== puppetIdx);
      if (agonyIdx < 0) {
        addLog('Need 1 Remnant in hand to evolve Carnie into Lefty!', 'ko');
        return;
      }

      const indicesToSplice = [puppetIdx, agonyIdx].sort((a, b) => b - a);
      indicesToSplice.forEach(idx => {
        const consumed = p.hand.splice(idx, 1)[0];
        p.discard.push(consumed);
      });
      handIdx = p.hand.indexOf(card);
    }

    // Require 1 matching energy card in hand for hand-evolution (KO path is free)
    if (!isCarnieEvo) {
      const eType = card.energyType;
      const eIdx = p.hand.findIndex((c, i) => c.type === 'energy' && c.energyType === eType && i !== handIdx);
      if (eIdx < 0) { addLog(`Need 1 ${ENERGY_META[eType]?.name || eType} energy in hand to evolve ${card.name}!`, 'ko'); return; }
      p.discard.push(p.hand.splice(eIdx, 1)[0]);
      handIdx = eIdx < handIdx ? handIdx - 1 : handIdx;
    }
    const pred = p.party[predIdx];
    // Save predecessor's attached energy to Blob Pile
    for (let i = 0; i < pred.elec; i++) p.discard.push({ id: 'energy_spent', name: 'Energy', type: 'energy', energyType: 'generic', img: GENERIC });
    p.discard.push(pred.card); pred.tools.forEach(t => p.discard.push(t));
    if (pred.card.class === 'funtime') syncEnnardMoveset(G.activePlayer);
    p.hand.splice(handIdx, 1);
    const s = newSlot(card); s.justPlaced = true;
    p.party[predIdx] = s;
    addLog(T('tcg.log.scrapRevived', { from: pred.card.name, to: card.name }), 'good');
    renderGame(); pushGameState(); return;
  }
  // Shadow shell - costs 1 Agony or 1 Phantom Agony from hand
  if (card.shadowSummon) {
    const p = G.players[G.activePlayer];
    const emptySlot = p.party.findIndex(s => s === null);
    if (emptySlot < 0) { addLog(T('tcg.log.zoneFull')); return; }
    const eIdx = p.hand.findIndex((c, i) => c.type === 'energy' && (c.energyType === 'agony' || c.energyType === 'phantom_agony') && i !== handIdx);
    if (eIdx < 0) { addLog(T('tcg.log.noShadowEnergy')); return; }
    p.discard.push(p.hand.splice(eIdx, 1)[0]);
    const sIdx = eIdx < handIdx ? handIdx - 1 : handIdx;
    p.hand.splice(sIdx, 1);
    const s = newSlot(card); s.justPlaced = true;
    p.party[emptySlot] = s;
    addLog(T('tcg.log.agonyConsumed', { name: p.name, card: card.name }), 'good');
    renderGame(); return;
  }
  // Glitch shell - costs 1 Agony
  if (card.glitchSummon) {
    const p = G.players[G.activePlayer];
    const emptySlot = p.party.findIndex(s => s === null);
    if (emptySlot < 0) { addLog(T('tcg.log.zoneFull')); return; }
    const eIdx = p.hand.findIndex((c, i) => c.energyType === 'agony' && i !== handIdx);
    if (eIdx < 0) { addLog('Needs 1 Agony in hand to summon Glitchtrap!'); return; }
    p.discard.push(p.hand.splice(eIdx, 1)[0]);
    const sIdx = eIdx < handIdx ? handIdx - 1 : handIdx;
    p.hand.splice(sIdx, 1);
    const s = newSlot(card); s.justPlaced = true;
    p.party[emptySlot] = s;
    addLog('Glitchtrap has entered the system.', 'good');
    renderGame(); return;
  }
  // Phantom special summon
  if (card.phantomSummon) {
    const p = G.players[G.activePlayer];
    const freeViaWilliam = p.party.some(s => s && s.tools.some(t => t.passive === 'william'));
    const emptySlot = p.party.findIndex(s => s === null);
    if (emptySlot < 0) { addLog(T('tcg.log.zoneFull')); return; }
    if (freeViaWilliam) {
      p.hand.splice(handIdx, 1);
      const s = newSlot(card); s.justPlaced = false; // phantoms awake immediately
      p.party[emptySlot] = s;
      addLog(T('tcg.log.invokedWilliam', { name: p.name, card: card.name }), 'good');
      renderGame(); return;
    }
    // Find phantom_agony card in hand (must be a different card from the phantom shell)
    const phanCard = p.hand.find((c, i) => c.type === 'energy' && c.energyType === 'phantom_agony' && i !== handIdx);
    if (!phanCard) { addLog(T('tcg.log.noPhantomEnergy')); return; }
    p.discard.push(p.hand.splice(p.hand.indexOf(phanCard), 1)[0]); // consume it
    const phantomIdx = p.hand.indexOf(card); // re-find phantom (index may have shifted)
    p.hand.splice(phantomIdx >= 0 ? phantomIdx : handIdx, 1);
    const s = newSlot(card); s.justPlaced = false;
    p.party[emptySlot] = s;
    addLog(T('tcg.log.invoked', { name: p.name, card: card.name }), 'good');
    renderGame(); return;
  }
  // Shell→Shell evolution (classic variants, ruined forms etc.)
  if (card.requiredShell || card.requiredShellAny) {
    const p = G.players[G.activePlayer];
    const validIds = card.requiredShellAny || [card.requiredShell];
    const valid = p.party.filter(s => s && validIds.includes(s.card.id) && !s.justPlaced);
    if (!valid.length) {
      const nameList = validIds.map(id => CARDS[id]?.name || id).join(' or ');
      addLog(T('tcg.log.noEvoTarget', { endo: nameList }), 'ko');
      return;
    }
    const eType = card.energyType;
    const altType = card.energyTypeAlt;
    const hasEnergyCard = p.hand.some((c, i) => c.type === 'energy' && (c.energyType === eType || (altType && c.energyType === altType)) && i !== handIdx);
    if (!hasEnergyCard) { addLog(T('tcg.log.noEvoEnergy', { energy: ENERGY_META[eType]?.name || eType }), 'ko'); return; }
    G.pendingTarget = { action: 'evolve', handIdx, card };
    addLog(T('tcg.log.clickEvo', { card: card.name }), 'info');
    renderGame(); return;
  }
  // Regular shell → needs endo to evolve
  const p = G.players[G.activePlayer];
  const isSpringtrap = card.id === 'springtrap';
  const isGlitchtrap = card.id === 'glitchtrap';
  const isMimicRuin = card.id === 'm2_mimic';
  const valid = p.party.filter(s => {
    if (!s || s.card.id !== card.requiredEndo || s.justPlaced) return false;
    if (isSpringtrap && !s.tools.some(t => t.passive === 'william')) return false;
    if (isGlitchtrap && !s.tools.some(t => t.passive === 'william')) return false;
    if (isMimicRuin && !s.tools.some(t => t.passive === 'scrap')) return false;
    return true;
  });
  if (!valid.length) {
    if (isSpringtrap) addLog(T('tcg.log.needSpringbonniePurple'));
    else if (isGlitchtrap) addLog('Glitchtrap requires Purple Guy equipped on M2!', 'ko');
    else if (isMimicRuin) addLog('The Mimic requires Remnant Fragment equipped on M2!', 'ko');
    else addLog(T('tcg.log.noEvoTarget', { endo: card.requiredEndo }));
    return;
  }
  if (!isSpringtrap && !isGlitchtrap) {
    // Normal evolution: need matching energy card in hand
    const eType = card.energyType;
    const anyEnergy = card.id === 'rockstar_freddy';
    const hasEnergyCard = p.hand.some((c, i) => c.type === 'energy' && (anyEnergy || c.energyType === eType) && i !== handIdx);
    if (!hasEnergyCard) { addLog(anyEnergy ? 'No energy card in hand to evolve Rockstar Freddy!' : T('tcg.log.noEvoEnergy', { energy: ENERGY_META[eType]?.name || eType })); return; }
  }
  G.pendingTarget = { action: 'evolve', handIdx, card };
  addLog((isSpringtrap || isGlitchtrap || isMimicRuin) ? T('tcg.log.clickSpringtrapEvo') : T('tcg.log.clickEvo', { card: card.name }), 'info');
  renderGame();
}

function playItem(handIdx, card) {
  const p = G.players[G.activePlayer];
  if (p.itemLocked > 0) { addLog(T('tcg.log.itemLocked'), 'ko'); return; }
  if (card.effect === 'ruined_dj_stall' && p.energyPool < 2) { addLog('DJ Music Man: need at least 2 energy in pool!', 'ko'); return; }
  if (card.effect === 'summon_ennard') {
    const ennardInHand = p.hand.find((c, i) => c.id === 'ennard' && i !== handIdx);
    if (!ennardInHand) { addLog(T('tcg.log.noEnnard'), 'ko'); return; }
    const funtimeShells = p.party.filter(s => s && s.card.class === 'funtime' && s.card.type === 'shell' && s.card.id !== 'ennard');
    if (funtimeShells.length < 2) { addLog(T('tcg.log.noFuntimes'), 'ko'); return; }
    if (p.party.some(s => s && s.card.id === 'ennard')) { addLog(T('tcg.log.ennardExists'), 'ko'); return; }
    // First: send all party Funtimes (shells + endos) to the Blob Pile
    for (let i = 0; i < 4; i++) {
      const slot = p.party[i];
      if (!slot || slot.card.class !== 'funtime') continue;
      p.discard.push(slot.card); p.party[i] = null;
    }
    // Then: read ALL Funtime cards now in the Blob (including ones already there)
    const inheritedAttacks = [];
    const seenAtkNames = new Set();
    const seenAbils = new Set(['ennard_generator_boost']);
    const inheritedAbilities = [{ name: 'Central Wire', desc: 'Transfer 1 energy from the Generator to a Funtime ally.', id: 'ennard_generator_boost' }];
    p.discard.forEach(fc => {
      if (fc.class !== 'funtime') return;
      (fc.attacks || []).forEach(atk => {
        if (!seenAtkNames.has(atk.name)) {
          seenAtkNames.add(atk.name);
          inheritedAttacks.push({ ...atk, name: `${atk.name} (${fc.name})` });
        }
      });
      const abls = fc.abilities ? fc.abilities : (fc.ability ? [fc.ability] : []);
      abls.forEach(abl => { if (!seenAbils.has(abl.id)) { seenAbils.add(abl.id); inheritedAbilities.push(abl); } });
    });
    // Consume Ennard card and item from hand
    const eiIdx = p.hand.indexOf(ennardInHand); if (eiIdx >= 0) p.hand.splice(eiIdx, 1);
    const itemIdx = p.hand.indexOf(card); if (itemIdx >= 0) p.hand.splice(itemIdx, 1);
    p.discard.push(card);
    // Build dynamic Ennard with inherited moves and place in first empty slot
    const ennardCard = { ...CARDS['ennard'], attacks: inheritedAttacks, abilities: inheritedAbilities };
    const ennardSlot = newSlot(ennardCard);
    const emptySlot = p.party.findIndex(s => !s);
    if (emptySlot >= 0) p.party[emptySlot] = ennardSlot;
    addLog(T('tcg.log.ennardSummoned', { name: p.name }), 'good');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  const needsTarget = ['heal30', 'heal15x2', 'ruined_lil_heal'].includes(card.effect);
  const needsSearch = ['dee_dee_pearl', 'power_out', 'blob_recover2', 'hand_discard2_search', 'deck_discard3_choose'].includes(card.effect);
  if (needsTarget) {
    G._lastPlayedCard = { card, playerIdx: G.activePlayer, seq: (G._lastPlayedCard?.seq || 0) + 1 };
    G.pendingTarget = { action: 'itemTarget', handIdx, card };
    addLog(T('tcg.log.itemTarget', { card: card.name }), 'info');
    renderGame(); pushGameState(); return;
  }
  if (needsSearch) { launchItemSearch(handIdx, card, G.activePlayer); return; }
  G._lastPlayedCard = { card, playerIdx: G.activePlayer, seq: (G._lastPlayedCard?.seq || 0) + 1 };
  applyItemEffect(card.effect, G.activePlayer);
  p.hand.splice(handIdx, 1); p.discard.push(card);
  addLog(T('tcg.log.supporterPlayed', { name: p.name, card: card.name }), 'good');
  renderGame(); pushGameState();
}

function launchItemSearch(handIdx, card, pidx) {
  const p = G.players[pidx];
  G._lastPlayedCard = { card, playerIdx: pidx, seq: (G._lastPlayedCard?.seq || 0) + 1 };
  const consume = () => { const ci = p.hand.indexOf(card); if (ci >= 0) p.hand.splice(ci, 1); p.discard.push(card); addLog(T('tcg.log.supporterPlayed', { name: p.name, card: card.name }), 'good'); renderGame(); pushGameState(); };

  if (card.effect === 'dee_dee_pearl') {
    const cards = p.discard.filter(c => c.type === 'endo' || c.type === 'shell' || c.type === 'energy');
    if (!cards.length) { addLog(T('tcg.search.noRecoverable')); consume(); return; }
    startDeckSearch(T('tcg.search.deedee'), cards, 5, pidx, (sel) => {
      sel.forEach(c => {
        const i = p.discard.indexOf(c); if (i >= 0) p.discard.splice(i, 1);
        if (c.type === 'energy' && c.energyType === 'generic') { p.energyPool++; addLog(T('tcg.log.energyToPool'), 'good'); }
        else { p.hand.push(c); addLog(T('tcg.log.energyToHand', { card: c.name }), 'good'); }
      });
      addLog(T('tcg.log.deeDeeRecovered', { n: sel.length }), 'good');
      syncEnnardMoveset(pidx); // Blob changed - re-sync Ennard if in play
      consume();
    });
    return;
  }
  if (card.effect === 'power_out') {
    if (p.energyPool < 2) { addLog(T('tcg.search.needPowerOut')); return; }
    p.energyPool -= 2;
    if (!p.deck.length) { addLog(T('tcg.log.deckEmpty')); consume(); return; }
    startDeckSearch(T('tcg.search.powerout'), [...p.deck], 1, pidx, (sel) => {
      sel.forEach(c => { const i = p.deck.indexOf(c); if (i >= 0) p.deck.splice(i, 1); p.hand.push(c); });
      p.deck = shuffle(p.deck);
      consume();
    });
    return;
  }
  if (card.effect === 'blob_recover2') {
    const cards = p.discard.filter(c => c.type === 'energy');
    if (!cards.length) { addLog(T('tcg.log.noEnergyBlob')); consume(); return; }
    startDeckSearch(T('tcg.search.blobRecover'), cards, 2, pidx, (sel) => {
      sel.forEach(c => {
        const i = p.discard.indexOf(c); if (i >= 0) p.discard.splice(i, 1);
        if (c.energyType === 'generic') { p.energyPool++; addLog(T('tcg.log.poolRecovered'), 'good'); }
        else { p.hand.push(c); addLog(T('tcg.log.cardRecovered', { card: c.name }), 'good'); }
      });
      consume();
    });
    return;
  }
  if (card.effect === 'hand_discard2_search') {
    const handChoices = p.hand.filter(c => c !== card);
    if (handChoices.length < 2) { addLog(T('tcg.log.need2Discard')); return; }
    startDeckSearch(T('tcg.search.dataEscape'), handChoices, 2, pidx, (sel) => {
      if (sel.length < 2) { addLog(T('tcg.log.fugaCancelled')); return; }
      // Only discard hand cards and consume item AFTER deck search is confirmed
      if (!p.deck.length) {
        sel.forEach(c => { const i = p.hand.indexOf(c); if (i >= 0) p.hand.splice(i, 1); p.discard.push(c); });
        addLog(T('tcg.log.deckEmpty')); consume(); return;
      }
      startDeckSearch(T('tcg.search.dataEscape2'), [...p.deck], 1, pidx, (sel2) => {
        // Now commit the hand discard
        sel.forEach(c => { const i = p.hand.indexOf(c); if (i >= 0) p.hand.splice(i, 1); p.discard.push(c); });
        sel2.forEach(c => { const i = p.deck.indexOf(c); if (i >= 0) p.deck.splice(i, 1); p.hand.push(c); });
        p.deck = shuffle(p.deck);
        addLog(T('tcg.log.fugaAdded', { cards: sel2.map(c => c.name).join(', ') || 'nothing' }), 'good');
        syncEnnardMoveset(pidx);
        consume();
      });
    });
    return;
  }
  if (card.effect === 'deck_discard3_choose') {
    if (!p.deck.length) { addLog(T('tcg.log.deckEmpty')); consume(); return; }
    startDeckSearch(T('tcg.search.dataCorrupt'), [...p.deck], 2, pidx, (sel) => {
      sel.forEach(c => { const i = p.deck.indexOf(c); if (i >= 0) p.deck.splice(i, 1); p.discard.push(c); });
      addLog(T('tcg.log.corruptDiscarded', { n: sel.length }), 'good');
      syncEnnardMoveset(G.activePlayer);
      consume();
    });
    return;
  }
}

function startEquipTool(handIdx, card) {
  const p = G.players[G.activePlayer];
  if (!p.party.some(s => s)) { addLog(T('tcg.log.noEquipSlot')); return; }
  // Tools with toolTarget can only be equipped to specific animatronics
  if (card.toolTarget) {
    const hasValid = p.party.some(s => s && card.toolTarget.includes(s.card.id));
    if (!hasValid) { addLog(`${card.name} can only be equipped to: ${card.toolTarget.join(', ')}. None in play.`, 'ko'); return; }
  }
  G.pendingTarget = { action: 'equipTool', handIdx, card };
  addLog(T('tcg.log.clickEquip', { card: card.name }), 'info');
  renderGame();
}


function playSupporter(handIdx, card) {
  const p = G.players[G.activePlayer];
  if (p.supporterPlayedThisTurn >= (p.supporterMax || 1)) { addLog(T('tcg.log.noSupporters')); return; }
  G._lastPlayedCard = { card, playerIdx: G.activePlayer, seq: (G._lastPlayedCard?.seq || 0) + 1 };
  const consumeSupporter = () => {
    const ci = p.hand.indexOf(card);
    if (ci >= 0) p.hand.splice(ci, 1);
    p.discard.push(card);
  };

  if (card.effect === 'william_gamble') {
    p.supporterPlayedThisTurn++;
    const ap = G.activePlayer, op = 1 - ap;
    const success = Math.random() < 0.5;
    if (success) {
      G.players[op].party.forEach(s => { if (!s) return; s.hp -= 20; addLog(`William: ${s.card.name} -20!`); checkKO(op, s); });
      addLog(T('tcg.log.williamSuccess'), 'good');
    } else {
      p.party.forEach(s => { if (!s) return; s.hp -= 20; addLog(`William gambling failed: ${s.card.name} -20!`); checkKO(ap, s); });
      addLog(T('tcg.log.williamFail'), 'ko');
    }
    checkWin();
    consumeSupporter();
    G.pendingTarget = null; renderGame(); return;
  }

  if (card.effect === 'helpy_gamble') {
    p.supporterPlayedThisTurn++;
    const ap = G.activePlayer, op = 1 - ap;

    // 1% de hipótese de sucesso (0.01)
    const success = Math.random() < 0.01;

    if (success) {
      // Filtra apenas os alvos válidos (que não sejam null) na mesa do oponente
      const validTargets = G.players[op].party.filter(s => s !== null);

      if (validTargets.length > 0) {
        // Escolhe um único alvo aleatório da party dele
        const randomTarget = validTargets[Math.floor(Math.random() * validTargets.length)];

        const damage = 10000000000; // Altera para 100 se o teu "1B" for 100
        randomTarget.hp -= damage;
        checkKO(op, randomTarget);
      }
    } else {
      //
    }

    checkWin();
    consumeSupporter();
    G.pendingTarget = null; renderGame(); return;
  }

  if (card.effect === 'william_search') {
    p.supporterPlayedThisTurn++;
    const choices = p.deck.filter(c => c.type === 'energy' && (c.energyType === 'remnant' || c.energyType === 'agony'));
    if (!choices.length) { addLog(T('tcg.log.aftonNoEnergy')); consumeSupporter(); renderGame(); return; }
    startDeckSearch(T('tcg.search.aftonSearch'), choices, 2, G.activePlayer, (sel) => {
      sel.forEach(c => { const i = p.deck.indexOf(c); if (i >= 0) p.deck.splice(i, 1); p.hand.push(c); addLog(T('tcg.log.aftonFound', { card: c.name }), 'good'); });
      p.deck = shuffle(p.deck);
      consumeSupporter();
      G.pendingTarget = null; renderGame();
    });
    return;
  }
  if (card.effect === 'search_animatronic') {
    p.supporterPlayedThisTurn++;
    const cards = p.deck.filter(c => c.type === 'endo' || c.type === 'shell');
    if (!cards.length) { addLog(T('tcg.log.noAnimatronics')); consumeSupporter(); renderGame(); return; }
    startDeckSearch(T('tcg.search.henryEmily'), cards, 1, G.activePlayer, (sel) => {
      sel.forEach(c => { const i = p.deck.indexOf(c); if (i >= 0) p.deck.splice(i, 1); p.hand.push(c); });
      p.deck = shuffle(p.deck);
      consumeSupporter();
      addLog(T('tcg.log.searchAnimatronic', { cards: sel.map(c => c.name).join(', ') || 'nothing' }), 'good');
      renderGame();
    });
    return;
  }
  if (card.effect === 'party_guests_double') {
    p.supporterPlayedThisTurn++;
    p.supporterMax = p.supporterPlayedThisTurn + 2; // 2 more plays after this
    G.players[1 - G.activePlayer]._nextSupporterMax = 2;
    addLog(`Party Guests! ${p.name} can play 2 more supporters this turn. ${G.players[1 - G.activePlayer].name} gets 2 on their next turn.`, 'good');
    consumeSupporter();
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }

  if (card.effect === 'vanny_search') {
    const otherCards = p.hand.filter(c => c.uid !== card.uid);
    if (otherCards.length < 2) { addLog('Vanny: need at least 2 other cards in hand to discard.', 'ko'); return; }
    p.supporterPlayedThisTurn++;
    consumeSupporter(); // remove Vanny from hand before showing the discard picker

    const doSearch = (label, filterFn, next) => {
      const pool = p.deck.filter(filterFn);
      if (!pool.length) { addLog(`Vanny: no ${label} found in deck.`, 'info'); next(); return; }
      startDeckSearch(`Vanny - pick 1 ${label}`, pool, 1, G.activePlayer, (sel) => {
        sel.forEach(c => { const i = p.deck.indexOf(c); if (i >= 0) p.deck.splice(i, 1); p.hand.push(c); addLog(`Vanny found ${c.name}!`, 'good'); });
        p.deck = shuffle(p.deck); next();
      });
    };
    const startSearchChain = () => {
      doSearch('Supporter', c => c.type === 'supporter', () =>
        doSearch('Tool', c => c.type === 'tool', () =>
          doSearch('Item', c => c.type === 'item', () =>
            doSearch('Animatronic', c => c.type === 'endo' || c.type === 'shell', () =>
              doSearch('Energy', c => c.type === 'energy', () => {
                G.pendingTarget = null; renderGame(); pushGameState();
              })
            )
          )
        )
      );
    };

    // Player chooses the 2 cards to discard
    startDeckSearch('Vanny - choose 2 cards to discard', otherCards, 2, G.activePlayer, (sel) => {
      sel.forEach(c => {
        const i = p.hand.indexOf(c); if (i >= 0) { p.discard.push(p.hand.splice(i, 1)[0]); addLog(`Vanny discards ${c.name}.`, 'ko'); }
      });
      // If fewer than 2 were confirmed (player skipped), fill randomly
      for (let d = sel.length; d < 2; d++) {
        const pool = [...p.hand]; if (!pool.length) break;
        const dc = pool[Math.floor(Math.random() * pool.length)];
        const hi = p.hand.indexOf(dc); if (hi >= 0) { p.discard.push(p.hand.splice(hi, 1)[0]); addLog(`Vanny discards ${dc.name} (random).`, 'ko'); }
      }
      startSearchChain();
    });
    return;
  }

  if (card.effect === 'search_tool') {
    p.supporterPlayedThisTurn++;
    const tools = p.deck.filter(c => c.type === 'tool');
    if (!tools.length) { addLog('No tool cards left in deck.', 'info'); consumeSupporter(); renderGame(); return; }
    startDeckSearch('Search for a Tool (Funtime Attendant)', tools, 1, G.activePlayer, (sel) => {
      sel.forEach(c => { const i = p.deck.indexOf(c); if (i >= 0) p.deck.splice(i, 1); p.hand.push(c); addLog(`Funtime Attendant: found ${c.name}!`, 'good'); });
      p.deck = shuffle(p.deck);
      consumeSupporter();
      G.pendingTarget = null; renderGame();
    });
    return;
  }
  if (card.effect === 'hand_block_random') {
    p.supporterPlayedThisTurn++;
    const op = G.players[1 - G.activePlayer];
    const playable = op.hand.filter(c => c.type !== 'energy');
    if (playable.length) {
      const blocked = playable[Math.floor(Math.random() * playable.length)];
      op.handBlocked = blocked;
      addLog(`Plush Baby blocks ${op.name}'s ${blocked.name} this turn!`, 'ko');
    } else {
      addLog(`Plush Baby found no cards to block in ${op.name}'s hand.`, 'info');
    }
    consumeSupporter();
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }

  // ── Edwin: look at top 4 cards, add 1 to hand ──
  if (card.effect === 'edwin_look4') {
    p.supporterPlayedThisTurn++;
    const mimicCards = p.deck.filter(c => c.class === 'mimic');
    if (!mimicCards.length) { addLog('Edwin: no Mimic class cards in deck!', 'info'); consumeSupporter(); G.pendingTarget = null; renderGame(); pushGameState(); return; }
    startDeckSearch('Edwin Murray — choose up to 3 Mimic class cards from your deck', mimicCards, 3, G.activePlayer, (sel) => {
      sel.forEach(c => { const i = p.deck.findIndex(x => x.uid === c.uid); if (i >= 0) p.deck.splice(i, 1); p.hand.push(c); });
      p.deck = shuffle(p.deck);
      addLog(`${p.name}: Edwin Murray searched ${sel.length} Mimic card(s) to hand!`, 'good');
      consumeSupporter(); G.pendingTarget = null; renderGame(); pushGameState();
    });
    return;
  }

  // ── Fiona: look at opponent's hand, pick 1 to discard ──
  if (card.effect === 'fiona_hand_discard') {
    p.supporterPlayedThisTurn++;
    const opp = G.players[1 - G.activePlayer];
    if (!opp.hand.length) { addLog('Fiona: opponent has no cards in hand!', 'info'); consumeSupporter(); G.pendingTarget = null; renderGame(); pushGameState(); return; }
    startDeckSearch("Fiona — choose 1 card from opponent's hand to discard", opp.hand, 1, G.activePlayer, (sel) => {
      sel.forEach(c => { const i = opp.hand.indexOf(c); if (i >= 0) opp.hand.splice(i, 1); opp.discard.push(c); });
      if (sel.length) addLog(`${p.name}: Fiona forced ${opp.name} to discard ${sel[0].name}!`, 'good');
      consumeSupporter(); G.pendingTarget = null; renderGame(); pushGameState();
    });
    return;
  }

  // ── David: discard 1, draw 2 ──
  if (card.effect === 'discard1_draw4') {
    p.supporterPlayedThisTurn++;
    if (!p.hand.length) { addLog('David: no cards in hand to discard.', 'info'); consumeSupporter(); G.pendingTarget = null; renderGame(); pushGameState(); return; }
    const handWithoutDavid = p.hand.filter(c => c.uid !== card.uid);
    if (!handWithoutDavid.length) { addLog('David: no other cards in hand.', 'info'); consumeSupporter(); G.pendingTarget = null; renderGame(); pushGameState(); return; }
    startDeckSearch('David — discard 1 card from your hand', handWithoutDavid, 1, G.activePlayer, (sel) => {
      sel.forEach(c => { const i = p.hand.indexOf(c); if (i >= 0) p.hand.splice(i, 1); p.discard.push(c); });
      for (let i = 0; i < 4; i++) drawCardImmediate(G.activePlayer);
      addLog(`${p.name}: David — discarded ${sel[0]?.name || '?'}, drew 4 cards!`, 'good');
      consumeSupporter(); G.pendingTarget = null; renderGame(); pushGameState();
    });
    return;
  }

  // ── M1: spy top 5 of opponent's deck and reorder ──
  if (card.effect === 'm1_deck_spy') {
    p.supporterPlayedThisTurn++;
    const opp = G.players[1 - G.activePlayer];
    const topCards = opp.deck.slice(-5);
    if (!topCards.length) { addLog('M1: opponent deck is empty!', 'info'); consumeSupporter(); G.pendingTarget = null; renderGame(); pushGameState(); return; }
    addLog(`${p.name}: M1 is reading the opponent's deck...`, 'info');
    openDeckSpyModal([...topCards], (ordered) => {
      // ordered[0] = drawn first = top of deck = last in deck array
      const n = ordered.length;
      opp.deck.splice(opp.deck.length - n, n);
      [...ordered].reverse().forEach(c => opp.deck.push(c));
      addLog(`${p.name}: M1 rearranged the opponent's top ${n} cards!`, 'good');
      consumeSupporter(); G.pendingTarget = null; renderGame(); pushGameState();
    });
    return;
  }

  if (card.effect === 'glamrock_hippo_shields') {
    p.supporterPlayedThisTurn++;
    p.party.forEach(s => {
      if (!s) return;
      s.hp = Math.min(s.card.hp, s.hp + 20);
      s.burn = 0;
      s.stalledTurns = 0;
      s.tools.push({ name: 'Status Shield', effect: 'status_shield' });
    });
    addLog(`${card.name}: All allies healed 20 HP, status cleared, and gained a Status Shield!`, 'good');
    consumeSupporter();
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }

  if (card.effect === 'dj_music_man_recover') {
    p.supporterPlayedThisTurn++;
    const blobCards = [...p.discard];
    if (!blobCards.length) { addLog('Blob Pile is empty!', 'info'); consumeSupporter(); G.pendingTarget = null; renderGame(); pushGameState(); return; }
    startDeckSearch('DJ Music Man - choose up to 3 cards to shuffle back', blobCards, 3, G.activePlayer, (sel) => {
      sel.forEach(c => { const i = p.discard.indexOf(c); if (i >= 0) p.discard.splice(i, 1); p.deck.push(c); });
      p.deck = shuffle(p.deck);
      consumeSupporter();
      addLog(`DJ Music Man shuffled ${sel.length} card(s) back into ${p.name}'s deck.`, 'good');
      G.pendingTarget = null; renderGame(); pushGameState();
    });
    return;
  }

  p.supporterPlayedThisTurn++;
  consumeSupporter();
  applyItemEffect(card.effect, G.activePlayer);
  addLog(T('tcg.log.supporterPlayed', { name: p.name, card: card.name }), 'good');
  renderGame(); pushGameState();
}


/* ── Attach energy from pool ─────────────────────── */
function startAttachEnergy() {
  const p = G.players[G.activePlayer];
  if (p.energyPool <= 0) { addLog(T('tcg.log.noEnergyPool')); return; }
  G.pendingTarget = { action: 'attachEnergy' };
  addLog(T('tcg.log.clickAttach'), 'info');
  renderGame();
}

/* ═══════════════════════════════════════════════════════
   SLOT CLICK HANDLER
   ═══════════════════════════════════════════════════════ */
function clickSlot(pidx, slotIdx) {
  const slot = G.players[pidx].party[slotIdx];
  const pt = G.pendingTarget; const isOwn = pidx === G.activePlayer; const isEnemy = !isOwn;
  // During opponent's online turn: only allow viewing card info, no actions
  if (window.MP && MP.mode === 'online' && G.activePlayer !== MP.myIdx) {
    if (!pt && slot) showCardInfo(slot.card, slot, slotIdx, pidx, false, -1);
    return;
  }

  if (pt?.action === 'attachEnergy') {
    if (!isOwn || !slot) return;
    const p = G.players[pidx];
    p.energyPool--; slot.elec++; checkAwake(slot);
    addLog(T('tcg.log.energyAttached', { card: slot.card.name }));
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }

  if (pt?.action === 'evolve') {
    const _evoValidIds = pt.card.requiredShellAny || (pt.card.requiredShell ? [pt.card.requiredShell] : [pt.card.requiredEndo]);
    if (!isOwn || !slot || !_evoValidIds.includes(slot.card.id) || slot.justPlaced) return;
    const p = G.players[G.activePlayer];
    if (pt.card.id === 'ennard') {
      addLog(T('tcg.log.ennardOnlyItem'), 'ko');
      return;
    }
    const isSpringtrap = pt.card.id === 'springtrap';
    const isGlitchtrapEvo = pt.card.id === 'glitchtrap';
    const isMimicRuinEvo = pt.card.id === 'm2_mimic';
    if (isSpringtrap && !slot.tools.some(t => t.passive === 'william')) { addLog(T('tcg.log.needSpringbonniePurple')); return; }
    if (isGlitchtrapEvo && !slot.tools.some(t => t.passive === 'william')) { addLog('Glitchtrap requires Purple Guy equipped on M2!', 'ko'); return; }
    if (isMimicRuinEvo && !slot.tools.some(t => t.passive === 'scrap')) { addLog('The Mimic requires Remnant Fragment equipped on M2!', 'ko'); return; }
    if (!isSpringtrap) {
      const type = pt.card.energyType;
      const altType = pt.card.energyTypeAlt;
      const anyEnergy = pt.card.id === 'rockstar_freddy';
      const eCardIdx = p.hand.findIndex((c, i) => c.type === 'energy' && (anyEnergy || c.energyType === type || (altType && c.energyType === altType)) && i !== pt.handIdx);
      if (eCardIdx < 0) { addLog(anyEnergy ? 'No energy card in hand to evolve Rockstar Freddy!' : T('tcg.log.noEvoEnergy', { energy: ENERGY_META[type]?.name || type })); return; }
      p.discard.push(p.hand.splice(eCardIdx, 1)[0]);
      const shellIdx = eCardIdx < pt.handIdx ? pt.handIdx - 1 : pt.handIdx;
      p.hand.splice(shellIdx, 1);
      const endoCard = slot.card;
      const oldElec = slot.elec; const dmgTaken = endoCard.hp - slot.hp;
      p.discard.push(endoCard);
      slot.card = { ...pt.card, uid: uid() }; slot.hp = Math.max(1, pt.card.hp - dmgTaken); slot.elec = oldElec; slot.justPlaced = false; checkAwake(slot);
      addLog(T('tcg.log.evolved', { name: p.name, card: pt.card.name, energy: ENERGY_META[type]?.name || type }), 'good');
    } else {
      // Springtrap: Purple Guy consumed, no energy card needed
      p.hand.splice(pt.handIdx, 1);
      const endoCardSt = slot.card;
      const oldElec = slot.elec; const dmgTakenSt = endoCardSt.hp - slot.hp;
      p.discard.push(endoCardSt);
      slot.card = { ...pt.card, uid: uid() }; slot.hp = Math.max(1, pt.card.hp - dmgTakenSt); slot.elec = oldElec;
      slot.justPlaced = false; slot.william = false; slot.tools = slot.tools.filter(t => t.id !== 'purple_guy');
      checkAwake(slot);
      addLog(T('tcg.log.invokedSpringtrap', { name: p.name }), 'good');
    }
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }

  if (pt?.action === 'equipTool') {
    if (!isOwn || !slot) return;
    const tool = pt.card;
    // Generic toolTarget restriction
    if (tool.toolTarget && !tool.toolTarget.includes(slot.card.id)) { addLog(`${tool.name} can only be equipped to: ${tool.toolTarget.join(', ')}.`, 'ko'); return; }
    if (slot.tools.length >= 1) { addLog(T('tcg.log.alreadyTool')); return; }
    slot.tools.push({ ...tool });
    if (tool.passive === 'hp+40') { slot.hp += 40; slot.card = { ...slot.card, hp: slot.card.hp + 40 }; }
    if (tool.passive === 'burn_immune') { slot.burn = 0; addLog(`${slot.card.name} is now immune to Burn!`, 'good'); }
    if (tool.passive === 'stall_immune') { slot.stalledTurns = 0; addLog(`${slot.card.name} is now immune to Stall!`, 'good'); }
    if (tool.passive === 'william') {
      const opp = G.players[1 - G.activePlayer];
      if (opp.hand.length) { const i = Math.floor(Math.random() * opp.hand.length); const c = opp.hand.splice(i, 1)[0]; opp.discard.push(c); addLog(T('tcg.log.discarded', { name: opp.name, card: c.name })); }
    }
    G.players[G.activePlayer].hand.splice(pt.handIdx, 1);
    addLog(T('tcg.log.toolEquipped', { tool: tool.name, card: slot.card.name }), 'good');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }

  if (pt?.action === 'itemTarget') {
    const card = pt.card; const p = G.players[G.activePlayer];
    if (card.effect === 'heal30' && isOwn && slot) {
      slot.hp = Math.min(slot.card.hp, slot.hp + 30);
      addLog(T('tcg.log.healHp', { healer: card.name, n: 30, card: slot.card.name }), 'good');
      p.hand.splice(pt.handIdx, 1); p.discard.push(card);
      G.pendingTarget = null; renderGame(); return;
    }
    if (card.effect === 'heal15x2' && isOwn && slot) {
      if (!pt.selected) pt.selected = [];
      if (pt.selected.includes(slotIdx)) return;
      pt.selected.push(slotIdx); slot.hp = Math.min(slot.card.hp, slot.hp + 15);
      addLog(T('tcg.log.healHp', { healer: card.name, n: 15, card: slot.card.name }), 'good');
      if (pt.selected.length >= 2 || p.party.filter(s => s).length === pt.selected.length) {
        p.hand.splice(pt.handIdx, 1); p.discard.push(card); G.pendingTarget = null; renderGame();
      }
      return;
    }
    if (card.effect === 'ruined_lil_heal' && isOwn && slot) {
      const h = Math.min(25, slot.card.hp - slot.hp); slot.hp += h;
      addLog(`Ruined Lil': ${slot.card.name} healed ${h} HP!`, 'good');
      p.hand.splice(pt.handIdx, 1); p.discard.push(card);
      drawCardImmediate(G.activePlayer);
      G.pendingTarget = null; renderGame(); pushGameState(); return;
    }
    return;
  }

  if (pt?.action === 'selectSingleTarget') {
    if (pidx === G.activePlayer) return; if (!slot) return;
    finalizeSingleAttack(pt, slot, pidx, slotIdx); return;
  }
  if (pt?.action === 'selectMultiTarget') {
    if (pidx === G.activePlayer) return; if (!slot) return;
    if (pt.selected.some(s => s.slotIdx === slotIdx)) return;
    pt.selected.push({ pidx, slotIdx }); addLog(T('tcg.log.multiSelected', { cur: pt.selected.length, needed: pt.needed, card: slot.card.name }));
    updateTargetCounter(pt.selected.length, pt.needed);
    if (pt.selected.length >= pt.needed) finalizeMultiAttack(pt); return;
  }
  if (pt?.action === 'selectStallTargets') {
    if (pidx === G.activePlayer) return; if (!slot) return;
    if (pt.selected.some(s => s.slotIdx === slotIdx)) return;
    pt.selected.push({ pidx, slotIdx }); addLog(T('tcg.log.stallSelected', { cur: pt.selected.length, needed: pt.needed, card: slot.card.name }));
    updateTargetCounter(pt.selected.length, pt.needed);
    if (pt.selected.length >= pt.needed) finalizeStallAttack(pt); return;
  }
  if (pt?.action === 'postStallPick') {
    if (pidx === G.activePlayer || !slot) return;
    if (pt.selected.some(s => s.slotIdx === slotIdx)) return;
    pt.selected.push({ pidx, slotIdx }); addLog(`Stall target: ${slot.card.name} (${pt.selected.length}/${pt.needed})`, 'ko');
    updateTargetCounter(pt.selected.length, pt.needed);
    if (pt.selected.length >= pt.needed) finalizePostStall(pt); else renderGame(); return;
  }
  if (pt?.action === 'selectHealTargets') {
    if (pidx !== G.activePlayer || !slot) return;
    if (pt.selected.some(s => s.slotIdx === slotIdx)) return;
    pt.selected.push({ pidx, slotIdx }); addLog(T('tcg.log.healSelected', { cur: pt.selected.length, needed: pt.needed, card: slot.card.name }));
    updateTargetCounter(pt.selected.length, pt.needed);
    if (pt.selected.length >= pt.needed) finalizeHealAttack(pt); return;
  }

  // Ability: Withered Freddy - pick which Withered receives energy from blob
  if (pt?.action === 'abilityTarget' && pt.ability === 'wfreddy_blob_energy') {
    if (!isOwn || !slot || slot.card.class !== 'withered') return;
    const p = G.players[pidx];
    const eIdx = p.discard.findIndex(c => c.type === 'energy');
    if (eIdx >= 0) { p.discard.splice(eIdx, 1); slot.elec++; checkAwake(slot); addLog(T('tcg.log.wfreddyTransfer', { card: slot.card.name }), 'good'); }
    G.pendingTarget = null; renderGame(); return;
  }
  // Ability: Withered Chica - pick which Withered gets double attack
  if (pt?.action === 'abilityTarget' && pt.ability === 'wchica_double_attack') {
    if (!isOwn || !slot || slot.card.class !== 'withered' || slot.card.id === 'withered_chica') return;
    slot.extraAttacks = (slot.extraAttacks || 0) + 1;
    addLog(T('tcg.log.wchicaDouble', { card: slot.card.name }), 'good');
    G.pendingTarget = null; renderGame(); return;
  }

  if (pt?.action === 'abilityTarget' && pt.ability === 'plushtrap_plush_trap') {
    if (!isEnemy || !slot) return;
    slot.plushTrap = true;
    addLog(`Plushtrap: Plush Trap placed on ${slot.card.name}! It will take 30 damage before its next attack.`, 'ko');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }

  // Ability: Baby - trap target (enemy slot)
  if (pt?.action === 'abilityTarget' && pt.ability === 'baby_trap_target') {
    if (!isEnemy || !slot) return;
    slot.trapped = (slot.trapped || 0) + 1;
    addLog(T('tcg.log.babyTrapped', { card: slot.card.name }), 'ko');
    G.pendingTarget = null; renderGame(); return;
  }
  // Ability: JJ - Switcheroo (swap bench position AND negative status with ally)
  if (pt?.action === 'abilityTarget' && pt.ability === 'jj_switcheroo') {
    if (!isOwn || !slot || slotIdx === pt.slotIdx) return;
    const p = G.players[pidx];
    const jjSlot = p.party[pt.slotIdx];   // JJ (initiator)
    const allySlot = p.party[slotIdx];    // chosen ally
    // Swap bench positions
    p.party[pt.slotIdx] = allySlot;
    p.party[slotIdx] = jjSlot;
    // JJ trades her negative status conditions (stall + burn) with the ally
    const tmpStall = jjSlot.stalledTurns; jjSlot.stalledTurns = allySlot.stalledTurns; allySlot.stalledTurns = tmpStall;
    const tmpBurn = jjSlot.burn || 0; jjSlot.burn = allySlot.burn || 0; allySlot.burn = tmpBurn;
    addLog(`JJ: Switcheroo! JJ switched with ${allySlot.card.name}.`, 'good');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  // Ability: Ballora - steal 1 energy from enemy slot
  if (pt?.action === 'abilityTarget' && pt.ability === 'ballora_steal') {
    if (!isEnemy || !slot || slot.elec <= 0) return;
    slot.elec--; checkAwake(slot);
    G.players[G.activePlayer].energyPool++;
    addLog(T('tcg.log.balloraStolen', { card: slot.card.name }), 'ko');
    G.pendingTarget = null; renderGame(); return;
  }
  // Ability: Molten Freddy - steal ALL energies from enemy slot
  if (pt?.action === 'abilityTarget' && pt.ability === 'molten_steal') {
    if (!isEnemy || !slot || slot.elec <= 0) return;
    const stolen = slot.elec; slot.elec = 0; checkAwake(slot);
    G.players[G.activePlayer].energyPool += stolen;
    addLog(T('tcg.log.moltenStolen', { card: slot.card.name, n: stolen }), 'ko');
    G.pendingTarget = null; renderGame(); return;
  }

  // Ability: Bonnie - Backstage Dash (give defense to ally)
  if (pt?.action === 'abilityTarget' && pt.ability === 'bonnie_quick_defense') {
    if (!isOwn || !slot) return;
    slot.defense = { reduction: 15, turnsLeft: 1 };
    addLog(`Bonnie: Backstage Dash! ${slot.card.name} +15 defense for 1 turn.`, 'good');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  // Ability: Neon Bonnie - Live Wire (burn 1 to 1 enemy)
  if (pt?.action === 'abilityTarget' && pt.ability === 'live_wire') {
    if (!isEnemy || !slot) return;
    slot.burn = (slot.burn || 0) + 1;
    addLog(`Neon Bonnie: Live Wire! ${slot.card.name} +1 Burn.`, 'ko');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  // Ability: Neon Chica - Strobe Effect (stall 1 enemy 1 turn, free)
  if (pt?.action === 'abilityTarget' && pt.ability === 'strobe_effect') {
    if (!isEnemy || !slot) return;
    slot.stalledTurns = Math.max(slot.stalledTurns, 2);
    addLog(`Neon Chica: Strobe Effect! ${slot.card.name} stalled for 1 turn.`, 'ko');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  // Ability: Toy Freddy - Game Over (stall 1 enemy 1 turn)
  if (pt?.action === 'abilityTarget' && pt.ability === 'toy_freddy_stall') {
    if (!isEnemy || !slot) return;
    slot.stalledTurns = Math.max(slot.stalledTurns, 2);
    addLog(`Toy Freddy: Game Over! ${slot.card.name} stalled for 1 turn.`, 'ko');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  // Ability: Funtime Foxy - Showstopper (stall 1 enemy 1 turn)
  if (pt?.action === 'abilityTarget' && pt.ability === 'funtime_foxy_showstopper') {
    if (!isEnemy || !slot) return;
    slot.stalledTurns = Math.max(slot.stalledTurns, 2);
    addLog(`Funtime Foxy: Showstopper! ${slot.card.name} stalled for 1 turn.`, 'ko');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  // Ability: Toy Bonnie - heal ally 20 HP
  if (pt?.action === 'abilityTarget' && pt.ability === 'toy_bonnie_heal') {
    if (!isOwn || !slot) return;
    const h = Math.min(20, slot.card.hp - slot.hp); slot.hp += h;
    addLog(`Toy Bonnie: Rock Star Encore! ${slot.card.name} healed ${h} HP.`, 'good');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  // Ability: Glamrock Freddy - Superstar (heal 20 to 1 ally)
  if (pt?.action === 'abilityTarget' && pt.ability === 'roxy_speed_boost') {
    if (!isOwn || !slot) return;
    slot.costReductionThisTurn = Math.max(slot.costReductionThisTurn || 0, 1);
    addLog(`Roxy: Speed Boost! ${slot.card.name}'s attack costs -1⚡ this turn.`, 'good');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  if (pt?.action === 'abilityTarget' && pt.ability === 'glamrock_freddy_heal') {
    if (!isOwn || !slot) return;
    const h = Math.min(20, slot.card.hp - slot.hp); slot.hp += h;
    addLog(`Glamrock Freddy: Superstar! ${slot.card.name} healed ${h} HP.`, 'good');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  // Ability: Sun - Solar Care (heal 30 to 1 ally)
  if (pt?.action === 'abilityTarget' && pt.ability === 'ruined_roxy_salvage') {
    if (!isOwn || !slot || slot.card.class !== 'ruined') return;
    const eIdx = p.discard.findIndex(c => c.type === 'energy');
    if (eIdx < 0) { addLog('Salvage: no energy in Blob Pile!', 'ko'); G.pendingTarget = null; renderGame(); return; }
    p.discard.splice(eIdx, 1); slot.elec++; checkAwake(slot);
    addLog(`Ruined Roxy: Salvage! Attached 1 energy to ${slot.card.name}.`, 'good');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  if (pt?.action === 'abilityTarget' && pt.ability === 'sun_solar_care') {
    if (!isOwn || !slot) return;
    const h = Math.min(30, slot.card.hp - slot.hp); slot.hp += h;
    addLog(`Sun: Solar Care! ${slot.card.name} healed ${h} HP.`, 'good');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  // Ability: Glamrock Chica - Beat Drop (stall 1 enemy after healing)
  if (pt?.action === 'abilityTarget' && pt.ability === 'glamrock_chica_beat_drop') {
    if (!isEnemy || !slot) return;
    slot.stalledTurns = Math.max(slot.stalledTurns, 2);
    addLog(`Glamrock Chica: Beat Drop! ${slot.card.name} stalled for 1 turn.`, 'ko');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  // Ability: Moon - Bedtime (stall 1 enemy 1 turn)
  if (pt?.action === 'abilityTarget' && pt.ability === 'moon_bedtime') {
    if (!isEnemy || !slot) return;
    slot.stalledTurns = Math.max(slot.stalledTurns, 2);
    addLog(`Moon: Bedtime! ${slot.card.name} stalled for 1 turn.`, 'ko');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  // Ability: Burntrap - Ignite (burn 2 to 1 enemy)
  if (pt?.action === 'abilityTarget' && pt.ability === 'jackie_ambush') {
    if (!isEnemy || !slot) return;
    if (!slot.stalledTurns || slot.stalledTurns <= 0) { addLog('Ambush: that enemy is not stalled!', 'ko'); return; }
    slot.hp = Math.max(0, slot.hp - 30); addLog(`Jackie: Ambush! ${slot.card.name} took 30 damage.`, 'ko'); checkKO(pidx, slot); checkWin();
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  if (pt?.action === 'abilityTarget' && pt.ability === 'big_top_crowd_control') {
    if (!isEnemy || !slot) return;
    if (!consumeStatusShield(slot, 'Stall')) { slot.stalledTurns = Math.max(slot.stalledTurns || 0, 2); addLog(`Big Top: Crowd Control! ${slot.card.name} stalled 1 turn.`, 'ko'); }
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  if (pt?.action === 'abilityTarget' && pt.ability === 'nurse_dollie_heal') {
    if (!isOwn || !slot) return;
    const healed = Math.min(30, slot.card.hp - slot.hp);
    slot.hp = Math.min(slot.card.hp, slot.hp + 30);
    addLog(`Nurse Dollie: Field Medic! ${slot.card.name} restored ${healed} HP.`, 'good');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  if (pt?.action === 'abilityTarget' && pt.ability === 'burntrap_ignite') {
    if (!isEnemy || !slot) return;
    if (!consumeStatusShield(slot, 'Burn')) { slot.burn = (slot.burn || 0) + 2; }
    addLog(`Burntrap: Ignite! ${slot.card.name} +2 Burn.`, 'ko');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  // Ability: Tangle Blob - Blob Drain (15 dmg to 1 enemy)
  if (pt?.action === 'abilityTarget' && pt.ability === 'blob_drain') {
    if (!isEnemy || !slot) return;
    const bDmg = 15;
    slot.hp = Math.max(0, slot.hp - bDmg);
    addLog(`Tangle Blob: Blob Drain! ${slot.card.name} took ${bDmg} damage.`, 'ko');
    checkKO(pidx, slot); checkWin();
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }
  // Ability: M.X.E.S. - Protocol Override (drain 1 energy from enemy)
  if (pt?.action === 'abilityTarget' && pt.ability === 'mxes_override') {
    if (!isEnemy || !slot) return;
    if (slot.elec > 0) { slot.elec--; checkAwake(slot); G.players[G.activePlayer].energyPool++; addLog(`M.X.E.S.: Protocol Override! Drained 1 energy from ${slot.card.name} to your Pool.`, 'ko'); }
    else { addLog(`${slot.card.name} has no energy to drain.`, 'info'); G.players[G.activePlayer].party[pt.slotIdx].usedAbilityThisTurn = false; }
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }

  // Ability: Ennard - transfer 1 generator energy to a Funtime ally
  if (pt?.action === 'ennardGeneratorBoost') {
    if (!isOwn || !slot || slot.card.class !== 'funtime') return;
    const p2 = G.players[pidx];
    if (!p2.generator.length) { addLog(T('tcg.log.ennardNoGen')); G.pendingTarget = null; renderGame(); return; }
    const e = p2.generator.pop(); p2.genDiscard.push(e);
    slot.elec++; checkAwake(slot);
    addLog(T('tcg.log.ennardGenBoost', { card: slot.card.name }), 'good');
    G.pendingTarget = null;
    renderGame(); return;
  }

  // Item: Fazbear Antidote - remove burn from selected ally
  if (pt?.action === 'removeBurnTarget') {
    if (!isOwn || !slot) return;
    const prev = slot.burn || 0; slot.burn = 0;
    addLog(`Fazbear Antidote: All ${prev} Burn stacks removed from ${slot.card.name}!`, 'good');
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }

  if (pt?.action === 'itemEnemyEffect') {
    if (!isEnemy || !slot) return;
    const { effect } = pt;
    if (effect === 'disable_ability') {
      slot.abilityDisabledTurns = Math.max(slot.abilityDisabledTurns, 2);
      addLog(`${slot.card.name} cannot use abilities on its next turn.`, 'ko');
    }
    if (effect === 'pan_stan') return;
    if (effect === 'trash_stall') {
      if (!consumeStatusShield(slot, 'Stall')) {
        slot.stalledTurns = Math.max(slot.stalledTurns, 3);
        addLog(`${slot.card.name} was stalled for 2 turns.`, 'ko');
      }
    }
    if (effect === 'energy_steal') {
      if (slot.elec > 0) {
        slot.elec--; checkAwake(slot);
        G.players[G.activePlayer].energyPool++;
        addLog(`Stole 1 energy from ${slot.card.name}.`, 'good');
      } else addLog(`${slot.card.name} has no energy to steal.`, 'info');
    }
    if (effect === 'remove_enemy_tools') {
      const count = slot.tools.length;
      if (count) {
        const opp = G.players[pidx];
        slot.tools.forEach(t => opp.discard.push(t));
        slot.tools = [];
      }
      addLog(count ? `Removed ${count} tool(s) from ${slot.card.name}.` : 'Target has no tools.', 'info');
    }
    if (effect === 'stall_single2') {
      if (!consumeStatusShield(slot, 'Stall')) {
        slot.stalledTurns = Math.max(slot.stalledTurns, 3);
        addLog(`Strobe Flash! ${slot.card.name} stalled for 2 turns.`, 'ko');
      }
    }
    G.pendingTarget = null; renderGame(); pushGameState(); return;
  }

  // Class card target selection
  if (pt?.action === 'classCardTarget') {
    const eid = pt.ability; const activePidx = pt.pidx;
    const needsAlly = ['class_toy_heal', 'class_withered_def', 'class_rockstar_discount'].includes(eid);
    const needsEnemy = ['class_jacko_burn', 'class_shadow_drain', 'class_phantom_stall'].includes(eid);
    if (needsAlly && pidx === activePidx && slot) {
      applyClassCardEffect(activePidx, eid, { slotIdx }); return;
    }
    if (needsEnemy && pidx !== activePidx && slot) {
      applyClassCardEffect(activePidx, eid, { slotIdx }); return;
    }
    return;
  }

  // No pending: click own slot → card info
  if (!pt && slot) {
    showCardInfo(slot.card, slot, slotIdx, pidx, false, -1);
  }
}

function updateTargetCounter(cur, needed) {
  const el = document.getElementById('target-counter');
  if (el) { el.textContent = `${cur}/${needed} selected`; el.style.display = ''; }
}

/* ═══════════════════════════════════════════════════════
   ATTACK FLOW (triggered from card info panel)
   ═══════════════════════════════════════════════════════ */
function getEffectiveAttacks(slot) {
  const attacks = [...slot.card.attacks];
  slot.tools.forEach(t => {
    if (t.grantAttack) {
      const src = CARDS[t.grantAttack];
      if (src?.attacks) src.attacks.forEach(a => attacks.push({ ...a }));
    }
  });
  return attacks;
}

function initiateAttack(slotIdx, atkIdx) {
  closeCardInfo();
  const slot = G.players[G.activePlayer].party[slotIdx]; if (!slot) return;
  const atk = getEffectiveAttacks(slot)[atkIdx]; if (!atk) return;
  if (G.turn <= 1) { addLog('Cannot attack on the first turn.', 'info'); return; }
  if (!slot.awake) { addLog(T('tcg.log.standby', { card: slot.card.name })); return; }
  if (slot.attackedThisTurn) { addLog(T('tcg.log.alreadyAttacked', { card: slot.card.name })); return; }
  if (slot.stalledTurns > 0) { addLog(T('tcg.log.stalled', { card: slot.card.name })); return; }
  const actualCost = Math.max(0, atk.cost - (slot.costReductionThisTurn || 0));
  if (slot.elec < actualCost) { addLog(T('tcg.log.notEnoughEnergy', { card: slot.card.name, n: actualCost })); return; }
  saveUndo();
  const base = { attackerPidx: G.activePlayer, attackerSlotIdx: slotIdx, atk: { ...atk, cost: actualCost } };

  if (atk.type === 'defense') { resolveDefenseAttack(base); return; }
  if (atk.type === 'search') {
    consumeEnergy(slot, base.atk.cost, G.activePlayer);
    if (base.atk.effect === 'rockstar_search_top') {
      const p = G.players[G.activePlayer];
      const options = p.deck.filter(c => c.type === 'shell' && c.class === 'rockstar');
      if (!options.length) {
        addLog('No Rockstar shell found in deck.', 'info');
        markAttacked(slot); renderGame(); pushGameState(); return;
      }
      startDeckSearch('Choose a Rockstar shell to place on top of deck', options, 1, G.activePlayer, (sel) => {
        const chosen = sel[0];
        if (chosen) {
          const i = p.deck.indexOf(chosen);
          if (i >= 0) p.deck.splice(i, 1);
          p.deck.push(chosen);
          addLog(`${chosen.name} was placed on top of deck.`, 'good');
        }
        markAttacked(slot); renderGame(); pushGameState();
      });
      return;
    }
    markAttacked(slot); renderGame(); pushGameState(); return;
  }
  if (atk.type === 'gamble') { resolveGamble(base, slot, atkIdx, false); return; }
  if (atk.type === 'heal') {
    const allyCount = G.players[G.activePlayer].party.filter(s => s).length;
    const needed = Math.min(atk.healTargets, allyCount);
    if (!needed) { addLog(T('tcg.log.noAllies')); return; }
    G.pendingTarget = { ...base, action: 'selectHealTargets', needed, selected: [] };
    addLog(T('tcg.log.chooseHeal', { n: needed }), 'info'); renderGame(); return;
  }
  if (atk.type === 'stall') {
    const ep = 1 - G.activePlayer;
    if (atk.stallTargets === -1) { finalizeStallAttack({ ...base, action: 'selectStallTargets', needed: -1, selected: [] }); return; }
    if (atk.stallRandom) {
      const avail = G.players[ep].party.map((s, i) => s ? { pidx: ep, slotIdx: i } : null).filter(Boolean);
      avail.sort(() => Math.random() - 0.5);
      finalizeStallAttack({ ...base, action: 'selectStallTargets', needed: avail.slice(0, atk.stallTargets).length, selected: avail.slice(0, atk.stallTargets) });
      return;
    }
    const ec = G.players[ep].party.filter(s => s).length;
    const needed = Math.min(atk.stallTargets, ec);
    if (!needed) { addLog(T('tcg.log.noEnemies')); return; }
    G.pendingTarget = { ...base, action: 'selectStallTargets', needed, selected: [] };
    addLog(T('tcg.log.chooseStall', { n: needed }), 'info'); renderGame(); return;
  }
  if (atk.type === 'multi') {
    const ep = 1 - G.activePlayer;
    if (atk.targets === -1) { finalizeMultiAttack({ ...base, action: 'selectMultiTarget', needed: -1, selected: [] }); return; }
    const ec = G.players[ep].party.filter(s => s).length;
    const needed = Math.min(atk.targets, ec);
    if (!needed) { addLog(T('tcg.log.noEnemies')); return; }
    G.pendingTarget = { ...base, action: 'selectMultiTarget', needed, selected: [] };
    addLog(T('tcg.log.chooseMulti', { n: needed }), 'info'); renderGame(); return;
  }
  // single
  G.pendingTarget = { ...base, action: 'selectSingleTarget' };
  addLog(T('tcg.log.clickEnemy'), 'info'); renderGame();
}

/* ── Freddy Mask check ───────────────────────────── */
function checkMimicCounter(attackerCard, atk, defSlot) {
  if (!defSlot.tools?.some(t => t.passive === 'mimic_counter') && defSlot.card?.passive !== 'mimic_counter') return false;
  if (attackerCard.class !== 'mimic') return false;
  // M2 Endo's native Glitch Shock (not synced) still deals damage
  if (attackerCard.id === 'm2_endo' && !atk.synced) return false;
  return true;
}

function checkMask(attackerCard, defSlot) {
  if (!defSlot.tools.some(t => t.id === 'freddy_mask')) return false;
  const cls = attackerCard.class;
  if ((cls === 'toy' || cls === 'withered') && attackerCard.id !== 'withered_foxy') {
    addLog(T('tcg.log.maskImmune', { card: defSlot.card.name, cls: cls === 'toy' ? T('tcg.log.clsMaskToy') : T('tcg.log.clsMaskWithered') }));
    return true;
  }
  return false;
}

/* ── Energy consumption ──────────────────────────── */
function consumeEnergy(attackerSlot, cost, pidx) {
  const actual = Math.min(attackerSlot.elec, cost);
  attackerSlot.elec -= actual;
  const p = G.players[pidx];
  for (let i = 0; i < actual; i++) p.discard.push({ id: 'energy_spent', name: 'Energy', type: 'energy', energyType: 'generic', img: GENERIC });
  checkAwake(attackerSlot);
}

/* ── Damage calculation ──────────────────────────── */
function calcDmg(attackerSlot, atk, base) {
  let d = base || atk.damage || 0;
  attackerSlot.tools.forEach(t => {
    if (t.passive === 'attack+10') d += 10;
    if (t.passive === 'heavyattack+20' && atk.cost >= 3) d += 20;
  });
  // Toy Chica Glamour Boost: +15 if active for this player
  if (G._glamourBoost && G._glamourBoost[G.activePlayer]) {
    d += 15;
    delete G._glamourBoost[G.activePlayer];
    addLog('Glamour Boost! +15 damage!', 'good');
  }
  return d;
}
function dealDamage(defSlot, raw) {
  let d = raw; if (defSlot.defense) d = Math.max(0, d - defSlot.defense.reduction);
  defSlot.hp -= d; return d;
}

/* ── Single ──────────────────────────────────────── */
function finalizeSingleAttack(pt, defSlot, dPidx, dSlotIdx) {
  const att = G.players[pt.attackerPidx].party[pt.attackerSlotIdx]; if (!att) return;
  if (checkMask(att.card, defSlot)) { markAttacked(att); G.pendingTarget = null; renderGame(); return; }

  // Check if attacker has plushTrap on them - if so, take damage before attacking
  if (att && att.plushTrap) {
    const trapDmg = 30;
    att.hp = Math.max(0, att.hp - trapDmg);
    att.plushTrap = false; // Remove the trap after triggering
    addLog(`Plush Trap activated! ${att.card.name} took ${trapDmg} damage!`, 'ko');
    checkKO(pt.attackerPidx, att);

    // If the attacker was KO'd by the trap, stop the attack
    if (att.hp <= 0) {
      markAttacked(att); G.pendingTarget = null; checkWin(); renderGame(); pushGameState(); return;
    }
  }

  consumeEnergy(att, pt.atk.cost, pt.attackerPidx);
  let dmg = calcDmg(att, pt.atk);
  if ((defSlot.trapped || 0) > 0) { dmg += 20; defSlot.trapped--; addLog(T('tcg.log.trapBaby', { card: defSlot.card.name }), 'ko'); }
  if (checkMimicCounter(att.card, pt.atk, defSlot)) { addLog(`M.X.E.S. blocked ${att.card.name}'s attack — Mimic damage nullified!`, 'info'); dmg = 0; }
  const dealt = dealDamage(defSlot, dmg);
  addLog(T('tcg.log.damage', { atk: att.card.name, def: defSlot.card.name, n: dealt, move: pt.atk.name }));
  applyAttackEffect(pt.atk.effect, pt.attackerPidx, dPidx, dSlotIdx);
  if (pt.atk.effect === 'remnant_on_kill' && defSlot.hp <= 0) {
    G.players[pt.attackerPidx].energyPool++;
    addLog(`${att.card.name} gained 1 energy for the KO.`, 'good');
  }
  checkRevenge(dPidx, defSlot, att, pt.attackerPidx);
  markAttacked(att); G.pendingTarget = null;
  checkKO(dPidx, defSlot);
  checkWin(); renderGame(); pushGameState();
}

/* ── Multi ───────────────────────────────────────── */
function finalizeMultiAttack(pt) {
  const ep = 1 - G.activePlayer;
  const att = G.players[pt.attackerPidx].party[pt.attackerSlotIdx]; if (!att) return;
  const targets = pt.atk.targets === -1 || pt.needed === -1
    ? G.players[ep].party.map((s, i) => s ? { pidx: ep, slotIdx: i } : null).filter(Boolean)
    : pt.selected;
  consumeEnergy(att, pt.atk.cost, pt.attackerPidx);
  const multiCount = targets.length;
  targets.forEach(({ pidx: dp, slotIdx: di }) => {
    const def = G.players[dp].party[di]; if (!def) return;
    if (multiCount > 1 && def.tools?.some(t => t.passive === 'shadow_band')) { addLog(`Shadow Band shielded ${def.card.name}!`, 'good'); return; }
    if (checkMask(att.card, def)) return;
    let dmg = calcDmg(att, pt.atk);
    if ((def.trapped || 0) > 0) { dmg += 20; def.trapped--; addLog(T('tcg.log.trapBaby', { card: def.card.name }), 'ko'); }
    if (checkMimicCounter(att.card, pt.atk, def)) { addLog(`M.X.E.S. blocked ${att.card.name}'s attack — Mimic damage nullified!`, 'info'); dmg = 0; }
    const dealt = dealDamage(def, dmg);
    addLog(T('tcg.log.damageNoMove', { atk: att.card.name, def: def.card.name, n: dealt }));
    applyAttackEffect(pt.atk.effect, pt.attackerPidx, dp, di);
    checkRevenge(dp, def, att, pt.attackerPidx); checkKO(dp, def);
  });
  addLog(T('tcg.log.multiUsed', { card: att.card.name, move: pt.atk.name, n: targets.length }));
  if (pt.atk.postEffect === 'stall_pick2') {
    const ep = 1 - G.activePlayer;
    const enemies = G.players[ep].party.filter(Boolean);
    if (!enemies.length) { markAttacked(att); G.pendingTarget = null; checkWin(); renderGame(); pushGameState(); return; }
    const needed = Math.min(2, enemies.length);
    G.pendingTarget = { action: 'postStallPick', needed, selected: [], attackerPidx: pt.attackerPidx, attackerSlotIdx: pt.attackerSlotIdx };
    addLog(`Choose ${needed} enem${needed > 1 ? 'ies' : 'y'} to stall for 1 turn!`, 'info');
    updateTargetCounter(0, needed); renderGame(); return;
  }
  markAttacked(att); G.pendingTarget = null; checkWin(); renderGame(); pushGameState();
}

/* ── Heal ────────────────────────────────────────── */
function finalizeHealAttack(pt) {
  const att = G.players[pt.attackerPidx].party[pt.attackerSlotIdx]; if (!att) return;
  consumeEnergy(att, pt.atk.cost, pt.attackerPidx);
  pt.selected.forEach(({ pidx, slotIdx }) => {
    const s = G.players[pidx].party[slotIdx]; if (!s) return;
    const h = Math.min(pt.atk.healAmount, s.card.hp - s.hp); s.hp += h; addLog(T('tcg.log.healHp', { healer: att.card.name, n: h, card: s.card.name }), 'good');
  });
  addLog(T('tcg.log.healUsed', { card: att.card.name, move: pt.atk.name }));
  markAttacked(att); G.pendingTarget = null; renderGame(); pushGameState();
}

/* ── Stall ───────────────────────────────────────── */
function finalizeStallAttack(pt) {
  const ep = 1 - G.activePlayer;
  const att = G.players[pt.attackerPidx].party[pt.attackerSlotIdx]; if (!att) return;
  const targets = pt.atk.stallTargets === -1 || pt.needed === -1
    ? G.players[ep].party.map((s, i) => s ? { pidx: ep, slotIdx: i } : null).filter(Boolean)
    : pt.selected;
  consumeEnergy(att, pt.atk.cost, pt.attackerPidx);
  targets.forEach(({ pidx: dp, slotIdx: di }) => {
    const def = G.players[dp].party[di]; if (!def) return;
    if (checkMask(att.card, def)) return;
    if (consumeStatusShield(def, 'Stall')) return;
    if (def.tools.some(t => t.passive === 'stall_immune')) { addLog(`${def.card.name} is immune to Stall!`, 'good'); return; }
    def.stalledTurns = Math.max(def.stalledTurns, pt.atk.stallTurns + 1); addLog(T('tcg.log.stallApplied', { card: def.card.name, n: pt.atk.stallTurns }));
    if (pt.atk.effect === 'burn1_on_stalled') def.burn = (def.burn || 0) + 1;
  });
  addLog(T('tcg.log.stallUsed', { card: att.card.name, move: pt.atk.name }));
  markAttacked(att); G.pendingTarget = null; checkWin(); renderGame(); pushGameState();
}

/* ── Post-AoE stall pick ─────────────────────────── */
function finalizePostStall(pt) {
  const att = G.players[pt.attackerPidx]?.party[pt.attackerSlotIdx];
  pt.selected.forEach(({ pidx: dp, slotIdx: di }) => {
    const def = G.players[dp].party[di]; if (!def) return;
    if (consumeStatusShield(def, 'Stall')) return;
    if (def.tools?.some(t => t.passive === 'stall_immune')) { addLog(`${def.card.name} is immune to Stall!`, 'good'); return; }
    def.stalledTurns = Math.max(def.stalledTurns, 2); addLog(`${def.card.name} stalled 1 turn!`, 'ko');
  });
  if (att && !pt.fromAbility) markAttacked(att);
  G.pendingTarget = null; checkWin(); renderGame(); pushGameState();
}

/* ── Defense ─────────────────────────────────────── */
function resolveDefenseAttack(base) {
  const att = G.players[base.attackerPidx].party[base.attackerSlotIdx]; if (!att) return;
  consumeEnergy(att, base.atk.cost, base.attackerPidx);
  let turns = base.atk.defenseTurns;
  if (att.tools.some(t => t.passive === 'defense+1turn')) turns++;
  att.defense = { reduction: base.atk.defenseReduction, turnsLeft: turns };
  addLog(T('tcg.log.defense', { card: att.card.name, move: base.atk.name, n: base.atk.defenseReduction, t: turns }), 'good');
  markAttacked(att); G.pendingTarget = null; renderGame(); pushGameState();
}

/* ── Gamble ──────────────────────────────────────── */
function resolveGamble(base, slot, atkIdx, isRepeat) {
  const att = G.players[base.attackerPidx].party[base.attackerSlotIdx]; if (!att) return;
  const atk = base.atk; const success = Math.random() < atk.successChance;
  if (!isRepeat) consumeEnergy(att, atk.cost, base.attackerPidx);
  if (success) {
    if (atk.successDamage) {
      if (atk.successTargets === -1) {
        // Multi-target: all enemies
        const ep = 1 - base.attackerPidx;
        G.players[ep].party.forEach(s => { if (!s) return; s.hp -= atk.successDamage; addLog(`${s.card.name} took ${atk.successDamage} damage!`, 'ko'); checkKO(ep, s); });
        addLog(T('tcg.log.gambleSuccessAll', { n: atk.successDamage }), 'good');
        markAttacked(att); G.pendingTarget = null; checkWin(); renderGame(); pushGameState(); return;
      }
      // Single target - inject correct damage so finalizeSingleAttack uses successDamage
      G.pendingTarget = { ...base, atk: { ...base.atk, damage: base.atk.successDamage }, action: 'selectSingleTarget', gambleSuccess: true };
      addLog(T('tcg.log.gambleSuccess', { pct: Math.round(atk.successChance * 100) }), 'good');
      renderGame(); return;
    }
  } else {
    addLog(T('tcg.log.gambleFail'), 'ko');
    att.lastGambleFailed = true;
    // Shadow Freddy passive: if Shadow Freddy is alive in the party and hasn't used its repeat yet,
    // it can repeat ANY gamble that just failed (not only its own).
    const sfSlotIdx = G.players[base.attackerPidx].party.findIndex(s => s && s.card.id === 'shadow_freddy' && !s.usedGambleRepeat);
    if (sfSlotIdx !== -1) {
      const sfSlot = G.players[base.attackerPidx].party[sfSlotIdx];
      sfSlot.canRepeatGamble = true;
      G.pendingTarget = { action: 'gambleRepeat', slotIdx: base.attackerSlotIdx, pidx: base.attackerPidx, atk: base.atk, sfSlotIdx };
      renderGame(); return;
    }
    if (atk.failEffect === 'springlock_failure') {
      addLog(T('tcg.log.springlockFail', { card: att.card.name }), 'ko');
      const pidx = base.attackerPidx;
      triggerSpringtrapSearch(pidx, base.attackerSlotIdx, att);
    }
    markAttacked(att); G.pendingTarget = null;
  }
  renderGame(); pushGameState();
}

function useAbility(slotIdx, abilityId) {
  const p = G.players[G.activePlayer];
  const slot = p.party[slotIdx]; if (!slot) return;
  if (slot.abilityDisabledTurns > 0) {
    addLog(`${slot.card.name} cannot use abilities this turn.`, 'ko');
    return;
  }
  slot.usedAbilityThisTurn = true;
  closeCardInfo();

  if (abilityId === 'wfreddy_blob_energy') {
    const eIdx = p.discard.findIndex(c => c.type === 'energy');
    if (eIdx < 0) { addLog(T('tcg.log.noWitheredBlob')); slot.usedAbilityThisTurn = false; return; }
    const witherds = p.party.filter(s => s && s.card.class === 'withered');
    if (!witherds.length) { addLog(T('tcg.log.noWitheredAllies')); slot.usedAbilityThisTurn = false; return; }
    G.pendingTarget = { action: 'abilityTarget', ability: 'wfreddy_blob_energy', slotIdx };
    addLog(T('tcg.log.clickWitheredEnergy'), 'info');
    renderGame(); return;
  }

  if (abilityId === 'wbonnie_discard_defend') {
    if (p.generator.length < 2) { addLog(T('tcg.log.wbonnieNoGenerator')); slot.usedAbilityThisTurn = false; return; }
    p.discard.push(p.generator.splice(0, 1)[0]);
    p.discard.push(p.generator.splice(0, 1)[0]);
    slot.defense = { reduction: 20, turnsLeft: 2 };
    addLog(T('tcg.log.wbonnieDefense'), 'good');
    renderGame(); return;
  }

  if (abilityId === 'wchica_double_attack') {
    if (slot.elec < 1) { addLog(T('tcg.log.wchicaNoEnergy')); slot.usedAbilityThisTurn = false; return; }
    slot.elec--;
    checkAwake(slot);
    G.pendingTarget = { action: 'abilityTarget', ability: 'wchica_double_attack', slotIdx };
    addLog(T('tcg.log.clickWitheredDouble'), 'info');
    renderGame(); return;
  }
  // ── JJ: Switcheroo (swap bench position with ally) ──
  if (abilityId === 'jj_switcheroo') {
    const allies = p.party
      .map((s, i) => ({ s, i }))
      .filter(({ s, i }) => s && i !== slotIdx);
    if (!allies.length) {
      addLog('No allies to swap with!');
      slot.usedAbilityThisTurn = false;
      return;
    }
    G.pendingTarget = { action: 'abilityTarget', ability: 'jj_switcheroo', slotIdx };
    addLog('JJ: Switcheroo! Click an ally to swap bench positions.', 'info');
    renderGame(); return;
  }


  if (abilityId === 'springtrap_phantom_search') {
    const emptySlot = p.party.findIndex(s => s === null);
    if (emptySlot < 0) { addLog(T('tcg.log.zoneFull')); slot.usedAbilityThisTurn = false; return; }
    const phantoms = p.deck.filter(c => c.type === 'shell' && c.phantomSummon);
    if (!phantoms.length) { addLog(T('tcg.log.springtrapNoPhantoms')); renderGame(); return; }
    startDeckSearch(T('tcg.search.springtrap'), phantoms, 1, G.activePlayer, (sel) => {
      sel.forEach(c => { const i = p.deck.indexOf(c); if (i >= 0) p.deck.splice(i, 1); const ns = newSlot(c); ns.justPlaced = false; const es = p.party.indexOf(null); if (es >= 0) p.party[es] = ns; addLog(T('tcg.log.springtrapSummoned', { name: c.name }), 'good'); });
      p.deck = shuffle(p.deck); renderGame();
    });
    return;
  }

  if (abilityId === 'plushtrap_plush_trap') {
    const ep = 1 - G.activePlayer;
    if (!G.players[ep].party.some(s => s)) {
      addLog('No enemies to trap!');
      slot.usedAbilityThisTurn = false;
      return;
    }
    G.pendingTarget = { action: 'abilityTarget', ability: 'plushtrap_plush_trap', slotIdx };
    addLog('Plushtrap: Click an enemy to place a Plush Trap!', 'info');
    renderGame(); return;
  }
  if (abilityId === 'rockstar_freddy_draw') {
    if (!p.alliedDeathLastOpponentTurn) {
      addLog('Rockstar Freddy: can only draw after an ally was KO\'d on the opponent\'s last turn.', 'info');
      slot.usedAbilityThisTurn = false; return;
    }
    for (let i = 0; i < 3; i++)drawCardImmediate(G.activePlayer);
    addLog('Rockstar Freddy drew 3 cards.', 'good');
    renderGame(); pushGameState(); return;
  }
  if (abilityId === 'rockstar_bonnie_item') {
    if (!p.alliedDeathLastOpponentTurn) {
      addLog('Rockstar Bonnie: can only search for an item after an ally was KO\'d on the opponent\'s last turn.', 'info');
      slot.usedAbilityThisTurn = false; return;
    }
    const items = p.deck.filter(c => c.type === 'item');
    if (!items.length) { addLog('No item cards in deck.', 'info'); slot.usedAbilityThisTurn = false; return; }
    startDeckSearch('Choose an item card', items, 1, G.activePlayer, (sel) => {
      const chosen = sel[0];
      if (chosen) {
        const i = p.deck.indexOf(chosen);
        if (i >= 0) p.deck.splice(i, 1);
        p.hand.push(chosen);
        p.deck = shuffle(p.deck);
        addLog(`${chosen.name} added to hand.`, 'good');
      }
      renderGame(); pushGameState();
    });
    return;
  }
  if (abilityId === 'chica_revive') {
    if (!p.alliedDeathLastOpponentTurn) {
      addLog('Rockstar Chica: can only revive after an ally was KO\'d on the opponent\'s last turn.', 'info');
      slot.usedAbilityThisTurn = false; return;
    }
    const emptySlot = p.party.findIndex(s => !s);
    if (emptySlot === -1) { addLog('No empty slot to revive into!', 'info'); slot.usedAbilityThisTurn = false; return; }
    const revivables = p.discard.filter(c => c.type === 'shell' || c.type === 'endo');
    if (!revivables.length) { addLog('No animatronics in Blob to revive.', 'info'); slot.usedAbilityThisTurn = false; return; }
    startDeckSearch('Choose an animatronic to revive (50% HP)', revivables, 1, G.activePlayer, (sel) => {
      const chosen = sel[0];
      if (chosen) {
        const i = p.discard.indexOf(chosen);
        if (i >= 0) p.discard.splice(i, 1);
        const rs = newSlot(chosen);
        rs.hp = Math.ceil(chosen.hp * 0.5);
        rs.justPlaced = false;
        p.party[emptySlot] = rs;
        addLog(`Rockstar Chica: Revived ${chosen.name} at ${rs.hp} HP!`, 'good');
        syncEnnardMoveset(G.activePlayer);
      }
      renderGame(); pushGameState();
    });
    return;
  }

  if (abilityId === 'rockstar_foxy_treasure') {
    if (!p.alliedDeathLastOpponentTurn) {
      addLog('Rockstar Foxy: can only search for a supporter after an ally was KO\'d on the opponent\'s last turn.', 'info');
      slot.usedAbilityThisTurn = false; return;
    }
    const supporters = p.deck.filter(c => c.type === 'supporter');
    if (!supporters.length) { addLog('No supporter cards in deck.', 'info'); slot.usedAbilityThisTurn = false; return; }
    startDeckSearch('Choose a supporter (Pirate Treasure)', supporters, 1, G.activePlayer, (sel) => {
      const chosen = sel[0];
      if (chosen) {
        const i = p.deck.indexOf(chosen);
        if (i >= 0) p.deck.splice(i, 1);
        p.hand.push(chosen);
        p.deck = shuffle(p.deck);
        addLog(`Rockstar Foxy: Pirate Treasure! Found ${chosen.name}.`, 'good');
      }
      renderGame(); pushGameState();
    });
    return;
  }
  if (abilityId === 'rockstar_lefty_ability') {
    if (slot.elec < 1) { addLog('Carnie needs 1 energy for this ability.', 'info'); slot.usedAbilityThisTurn = false; return; }
    slot.elec--; checkAwake(slot);
    slot.defense = { reduction: 15, turnsLeft: 1 };
    addLog(`Carnie gained +15 defense for this turn.`, 'good');
    renderGame(); pushGameState(); return;
  }


  if (abilityId === 'repeat_gamble') {
    useRepeatGamble(slotIdx);
    return;
  }

  if (abilityId === 'baby_trap_target') {
    const ep = 1 - G.activePlayer;
    if (!G.players[ep].party.some(s => s)) { addLog(T('tcg.log.babyNoEnemies')); slot.usedAbilityThisTurn = false; return; }
    G.pendingTarget = { action: 'abilityTarget', ability: 'baby_trap_target', slotIdx };
    addLog(T('tcg.log.clickEnemyTrap'), 'info');
    renderGame(); return;
  }

  if (abilityId === 'ballora_steal') {
    const ep = 1 - G.activePlayer;
    if (!G.players[ep].party.some(s => s && s.elec > 0)) { addLog(T('tcg.log.balloraNoEnergy')); slot.usedAbilityThisTurn = false; return; }
    G.pendingTarget = { action: 'abilityTarget', ability: 'ballora_steal', slotIdx };
    addLog(T('tcg.log.clickEnemySteal'), 'info');
    renderGame(); return;
  }

  if (abilityId === 'ftfreddy_discard') {
    const op = G.players[1 - G.activePlayer];
    if (!op.hand.length) { addLog(T('tcg.log.bonBonNoHand')); slot.usedAbilityThisTurn = false; return; }
    const i = Math.floor(Math.random() * op.hand.length);
    const c = op.hand.splice(i, 1)[0]; op.discard.push(c);
    addLog(T('tcg.log.bonBonDiscard', { name: op.name, card: c.name }), 'ko');
    renderGame(); return;
  }

  if (abilityId === 'lolbit_buffer') {
    if (slot.elec <= 0) { addLog(T('tcg.log.lolbitNoEnergy')); slot.usedAbilityThisTurn = false; return; }
    slot.elec--; checkAwake(slot);
    G.players[1 - G.activePlayer].skipNextDraw = true;
    addLog(T('tcg.log.lolbitBuffer', { name: G.players[1 - G.activePlayer].name }), 'ko');
    renderGame(); return;
  }

  if (abilityId === 'yenndo_system_surge') {
    const c = p.deck.pop();
    if (c) { p.hand.push(c); addLog(`Yenndo: System Surge! Drew ${c.name}.`, 'good'); }
    else { addLog('Yenndo: System Surge! Deck empty, no card drawn.', 'info'); }
    renderGame(); pushGameState(); return;
  }


  if (abilityId === 'ennard_generator_boost') {
    if (!p.generator.length) { addLog(T('tcg.log.ennardNoGen')); slot.usedAbilityThisTurn = false; return; }
    if (!p.party.some(s => s && s.card.class === 'funtime')) { addLog(T('tcg.log.ennardNoFuntimes')); slot.usedAbilityThisTurn = false; return; }
    G.pendingTarget = { action: 'ennardGeneratorBoost', slotIdx };
    addLog(T('tcg.log.clickFuntime'), 'info');
    renderGame(); return;
  }

  if (abilityId === 'scrap_baby_scissors') {
    const ep = 1 - G.activePlayer;
    if (!G.players[ep].party.some(s => s)) { addLog(T('tcg.log.scrapBabyNoEnemies')); slot.usedAbilityThisTurn = false; return; }
    // Free attack: cost 0, damage 30, counts as attack via markAttacked in finalizeSingleAttack
    G.pendingTarget = { action: 'selectSingleTarget', attackerPidx: G.activePlayer, attackerSlotIdx: slotIdx, atk: { name: T('tcg.log.scrapBabyScissors'), cost: 0, type: 'single', damage: 30 } };
    addLog(T('tcg.log.scissors'), 'info');
    renderGame(); return;
  }

  if (abilityId === 'molten_steal') {
    const ep = 1 - G.activePlayer;
    if (!G.players[ep].party.some(s => s && s.elec > 0)) { addLog(T('tcg.log.moltenNoEnergy')); slot.usedAbilityThisTurn = false; return; }
    G.pendingTarget = { action: 'abilityTarget', ability: 'molten_steal', slotIdx };
    addLog(T('tcg.log.moltenSteal'), 'info');
    renderGame(); return;
  }

  if (abilityId === 'lefty_heal') {
    p.party.forEach(s => { if (s) { s.hp = Math.min(s.card.hp, s.hp + 30); } });
    addLog(T('tcg.log.leftyHeal'), 'good');
    renderGame(); return;
  }

  // ── Classic Freddy: Showtime (draw 1) ──
  if (abilityId === 'class_classic_draw') {
    const c = p.deck.pop(); if (c) p.hand.push(c);
    addLog(`${slot.card.name}: Showtime! ${p.name} drew ${c ? 1 : 0} card.`, 'good');
    slot.usedAbilityThisTurn = true; renderGame(); pushGameState(); return;
  }

  // ── Classic Bonnie: Backstage Dash ──
  if (abilityId === 'bonnie_quick_defense') {
    if (slot.elec < 1) { addLog('Bonnie needs 1 energy for Backstage Dash.'); slot.usedAbilityThisTurn = false; return; }
    slot.elec--; checkAwake(slot);
    G.pendingTarget = { action: 'abilityTarget', ability: 'bonnie_quick_defense', slotIdx };
    addLog('Click an ally to give +15 defense for 1 turn.', 'info');
    renderGame(); return;
  }

  // ── Classic Chica: Kitchen Raid ──
  if (abilityId === 'chica_blob_energy') {
    const eIdx = p.discard.findIndex(c => c.type === 'energy');
    if (eIdx < 0) { addLog('No energies in the Blob!'); slot.usedAbilityThisTurn = false; return; }
    p.discard.splice(eIdx, 1); p.energyPool++;
    addLog(`${slot.card.name}: Kitchen Raid! Recovered 1 energy to Pool.`, 'good');
    renderGame(); pushGameState(); return;
  }

  // ── Dark Freddy: Dark Stage (opponent discards 1 random non-energy card) ──
  if (abilityId === 'dark_stage') {
    const ep = 1 - G.activePlayer;
    const opp = G.players[ep];
    const validIdx = opp.hand.map((c, i) => c.type !== 'energy' ? i : -1).filter(i => i >= 0);
    if (!validIdx.length) { addLog(`${slot.card.name}: Dark Stage - opponent's hand is empty or has no valid cards.`, 'ko'); slot.usedAbilityThisTurn = false; return; }
    const pick = validIdx[Math.floor(Math.random() * validIdx.length)];
    const discarded = opp.hand.splice(pick, 1)[0];
    addLog(`${slot.card.name}: Dark Stage! Opponent discarded ${discarded.name}.`, 'good');
    opp.discard.push(discarded);
    renderGame(); pushGameState(); return;
  }

  // ── Party Freddy: Party Spirit (heal 20 to all allies) ──
  if (abilityId === 'party_spirit') {
    p.party.forEach(s => { if (!s) return; const h = Math.min(10, s.card.hp - s.hp); s.hp += h; });
    addLog(`${slot.card.name}: Party Spirit! All allies healed 10 HP.`, 'good');
    renderGame(); pushGameState(); return;
  }

  // ── Neon Bonnie: Live Wire (discard 1⚡ → burn1 to 1 enemy) ──
  if (abilityId === 'live_wire') {
    if (slot.elec <= 0) { addLog('No energy on Neon Bonnie for Live Wire!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    const ep = 1 - G.activePlayer;
    if (!G.players[ep].party.some(s => s)) { addLog('No enemies to burn!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    slot.elec--;
    G.pendingTarget = { action: 'abilityTarget', ability: 'live_wire', slotIdx };
    addLog('Live Wire! Click an enemy to apply Burn 1.', 'info');
    renderGame(); return;
  }

  // ── Neon Chica: Strobe Effect (discard 1⚡ → stall 1 enemy 1 turn) ──
  if (abilityId === 'strobe_effect') {
    if (slot.elec <= 0) { addLog('No energy on Neon Chica for Strobe Effect!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    const ep = 1 - G.activePlayer;
    if (!G.players[ep].party.some(s => s)) { addLog('No enemies to stall!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    slot.elec--;
    G.pendingTarget = { action: 'abilityTarget', ability: 'strobe_effect', slotIdx };
    addLog('Strobe Effect! Click an enemy to stall for 1 turn.', 'info');
    renderGame(); return;
  }

  // ── Classic Golden Freddy: It's Me ──
  if (abilityId === 'golden_freddy_stall_gamble') {
    if (Math.random() < 0.5) {
      const ep = 1 - G.activePlayer;
      G.players[ep].party.forEach(s => { if (!s) return; s.stalledTurns = Math.max(s.stalledTurns, 2); });
      addLog(`${slot.card.name}: IT'S ME! All enemies stalled for 1 turn!`, 'good');
    } else {
      addLog(`${slot.card.name}: It's Me... Nothing happened.`, 'ko');
    }
    renderGame(); pushGameState(); return;
  }

  // ── Withered Golden Freddy: Mass Hallucination ──
  if (abilityId === 'wgolden_mass_stall') {
    if (Math.random() < 0.5) {
      const ep = 1 - G.activePlayer;
      G.players[ep].party.forEach(s => { if (!s) return; s.stalledTurns = Math.max(s.stalledTurns, 2); });
      addLog(`${slot.card.name}: Mass Hallucination! All enemies stalled!`, 'good');
    } else {
      addLog(`${slot.card.name}: Mass Hallucination... faded. Nothing happened.`, 'ko');
    }
    renderGame(); pushGameState(); return;
  }

  // ── Toy Freddy: Game Over (stall 1 enemy) ──
  if (abilityId === 'toy_freddy_stall') {
    if (slot.elec < 1) { addLog('Toy Freddy needs 1 energy for Game Over.'); slot.usedAbilityThisTurn = false; return; }
    const ep = 1 - G.activePlayer;
    if (!G.players[ep].party.some(s => s)) { addLog('No enemies to stall!'); slot.usedAbilityThisTurn = false; return; }
    slot.elec--; checkAwake(slot);
    G.pendingTarget = { action: 'abilityTarget', ability: 'toy_freddy_stall', slotIdx };
    addLog('Click an enemy to stall for 1 turn.', 'info');
    renderGame(); return;
  }

  // ── Funtime Foxy: Showstopper (discard 1 energy → stall 1 enemy 1T) ──
  if (abilityId === 'funtime_foxy_showstopper') {
    if (slot.elec < 1) { addLog('Funtime Foxy needs 1 energy for Showstopper.'); slot.usedAbilityThisTurn = false; return; }
    const ep = 1 - G.activePlayer;
    if (!G.players[ep].party.some(s => s)) { addLog('No enemies to stall!'); slot.usedAbilityThisTurn = false; return; }
    slot.elec--; checkAwake(slot);
    G.pendingTarget = { action: 'abilityTarget', ability: 'funtime_foxy_showstopper', slotIdx };
    addLog('Showstopper! Click an enemy to stall for 1 turn.', 'info');
    renderGame(); return;
  }

  // ── Toy Bonnie: Rock Star Encore (heal ally) ──
  if (abilityId === 'toy_bonnie_heal') {
    if (!p.party.some(s => s && s.hp < s.card.hp)) { addLog('No injured allies to heal!'); slot.usedAbilityThisTurn = false; return; }
    G.pendingTarget = { action: 'abilityTarget', ability: 'toy_bonnie_heal', slotIdx };
    addLog('Click an ally to heal 20 HP.', 'info');
    renderGame(); return;
  }

  // ── Toy Chica: Glamour Boost (next ally attack +15) ──
  if (abilityId === 'toy_chica_dmgbuff') {
    if (!G._glamourBoost) G._glamourBoost = {};
    G._glamourBoost[G.activePlayer] = true;
    addLog(`${slot.card.name}: Glamour Boost! Next ally attack deals +15 damage.`, 'good');
    renderGame(); pushGameState(); return;
  }

  // ── Nightmare Freddy: Freddles (10 dmg to all standby enemies) ──
  if (abilityId === 'nightmare_freddy_freddles') {
    const ep = 1 - G.activePlayer;
    let hit = 0;
    G.players[ep].party.forEach(s => {
      if (!s || s.awake) return;
      s.hp = Math.max(0, s.hp - 10); hit++;
      addLog(`Freddles swarmed ${s.card.name} for 10 damage!`, 'ko');
      checkKO(ep, s);
    });
    if (!hit) addLog('Freddles found no sleeping enemies.', 'info');
    checkWin(); renderGame(); pushGameState(); return;
  }

  // ── Dreadbear: Dread Aura (20 dmg to all standby enemies) ──
  if (abilityId === 'dreadbear_aoe') {
    const ep = 1 - G.activePlayer;
    let hit = 0;
    G.players[ep].party.forEach(s => {
      if (!s || s.awake) return;
      s.hp = Math.max(0, s.hp - 20); hit++;
      addLog(`Dread Aura struck ${s.card.name} for 20 damage!`, 'ko');
      checkKO(ep, s);
    });
    if (!hit) addLog('Dread Aura: no enemies in Standby.', 'info');
    checkWin(); renderGame(); pushGameState(); return;
  }

  // ── Glamrock Freddy: Superstar (heal 20 to 1 ally) ──
  if (abilityId === 'glamrock_freddy_heal') {
    if (!p.party.some(s => s && s.hp < s.card.hp)) { addLog('No injured allies to heal!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    G.pendingTarget = { action: 'abilityTarget', ability: 'glamrock_freddy_heal', slotIdx };
    addLog('Superstar! Click an ally to heal 20 HP.', 'info');
    renderGame(); return;
  }

  // ── Glamrock Chica: Beat Drop (heal 15 all allies, stall 1 enemy) ──
  if (abilityId === 'glamrock_chica_beat_drop') {
    const ep = 1 - G.activePlayer;
    p.party.forEach(s => { if (s) s.hp = Math.min(s.card.hp, s.hp + 15); });
    addLog(`${slot.card.name}: Beat Drop! All allies healed 15 HP.`, 'good');
    if (!G.players[ep].party.some(s => s)) { renderGame(); pushGameState(); return; }
    G.pendingTarget = { action: 'abilityTarget', ability: 'glamrock_chica_beat_drop', slotIdx };
    addLog('Click an enemy to stall for 1 turn.', 'info');
    renderGame(); return;
  }

  // ── Roxy: Speed Boost (self attack cost -1 this turn) ──
  if (abilityId === 'roxy_speed_boost') {
    if (slot.elec < 1) { addLog('Roxy needs 1 energy for Speed Boost.', 'ko'); slot.usedAbilityThisTurn = false; return; }
    slot.elec--; checkAwake(slot);
    G.pendingTarget = { action: 'abilityTarget', ability: 'roxy_speed_boost', slotIdx };
    addLog('Speed Boost! Click an ally to reduce their attack cost by 1 this turn.', 'info');
    renderGame(); return;
  }

  // ── Sun: Solar Care (heal 30 to 1 ally) ──
  if (abilityId === 'sun_solar_care') {
    if (!p.party.some(s => s && s.hp < s.card.hp)) { addLog('No injured allies to heal!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    G.pendingTarget = { action: 'abilityTarget', ability: 'sun_solar_care', slotIdx };
    addLog('Solar Care! Click an ally to heal 30 HP.', 'info');
    renderGame(); return;
  }

  // ── Moon: Bedtime (stall 1 enemy 1 turn) ──
  if (abilityId === 'moon_bedtime') {
    const ep = 1 - G.activePlayer;
    if (!G.players[ep].party.some(s => s)) { addLog('No enemies to stall!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    G.pendingTarget = { action: 'abilityTarget', ability: 'moon_bedtime', slotIdx };
    addLog('Bedtime! Click an enemy to stall for 1 turn.', 'info');
    renderGame(); return;
  }

  // ── Glamrock Bonnie: Band Leader (draw 1, heal 10 all allies) ──
  if (abilityId === 'glamrock_bonnie_band') {
    drawCardImmediate(G.activePlayer);
    p.party.forEach(s => { if (s) s.hp = Math.min(s.card.hp, s.hp + 10); });
    addLog(`${slot.card.name}: Band Leader! Drew 1 card and healed all allies 10 HP.`, 'good');
    renderGame(); pushGameState(); return;
  }

  // ── Ruined Roxy: Salvage (move 1 energy from Blob Pile to a Ruined ally) ──
  if (abilityId === 'ruined_roxy_salvage') {
    if (!p.discard.some(c => c.type === 'energy')) { addLog('Salvage: no energy in the Blob Pile!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    if (!p.party.some(s => s && s.card.class === 'ruined')) { addLog('Salvage: no Ruined allies on the field!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    G.pendingTarget = { action: 'abilityTarget', ability: 'ruined_roxy_salvage', slotIdx };
    addLog('Salvage! Click a Ruined ally to attach 1 energy from the Blob Pile.', 'info');
    renderGame(); return;
  }

  // ── Ruined Freddy: Fractured Stage (20 dmg to all standby enemies) ──
  if (abilityId === 'ruined_freddy_stage') {
    const ep = 1 - G.activePlayer;
    let hit = 0;
    G.players[ep].party.forEach(s => {
      if (!s || s.awake) return;
      s.hp = Math.max(0, s.hp - 20); hit++;
      addLog(`Fractured Stage hit ${s.card.name} for 20 damage!`, 'ko');
      checkKO(ep, s);
    });
    if (!hit) addLog('Fractured Stage: no enemies in Standby.', 'info');
    checkWin(); renderGame(); pushGameState(); return;
  }

  // ── Ruined Chica: Primal Shriek (discard 1⚡ → Burn 1 to all enemies) ──
  if (abilityId === 'ruined_chica_shriek') {
    if (slot.elec <= 0) { addLog('No energy on Ruined Chica for Primal Shriek!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    slot.elec--;
    const ep = 1 - G.activePlayer;
    let hit = false;
    G.players[ep].party.forEach(s => {
      if (!s) return;
      if (!consumeStatusShield(s, 'Burn')) { s.burn = (s.burn || 0) + 1; hit = true; addLog(`Primal Shriek! ${s.card.name} +1 Burn.`, 'ko'); }
    });
    if (!hit) addLog('Primal Shriek: no enemies to burn.', 'info');
    renderGame(); pushGameState(); return;
  }

  // ── Eclipse: Equilibrium (heal 15 all allies + stall all enemies 1T) ──
  if (abilityId === 'eclipse_equilibrium') {
    const ep = 1 - G.activePlayer;
    p.party.forEach(s => { if (s) s.hp = Math.min(s.card.hp, s.hp + 15); });
    addLog(`${slot.card.name}: Equilibrium! All allies healed 15 HP.`, 'good');
    G.players[ep].party.forEach(s => {
      if (!s) return;
      if (!consumeStatusShield(s, 'Stall')) { s.stalledTurns = Math.max(s.stalledTurns, 2); addLog(`${s.card.name} stalled for 1 turn!`, 'ko'); }
    });
    renderGame(); pushGameState(); return;
  }

  // ── Dreadbear: Undying Terror (stall all enemies 1T) ──
  if (abilityId === 'dreadbear_stall_pick2') {
    const ep = 1 - G.activePlayer;
    const enemies = G.players[ep].party.filter(Boolean);
    if (!enemies.length) { addLog('Undying Terror: no valid targets.', 'info'); slot.usedAbilityThisTurn = false; return; }
    const needed = Math.min(2, enemies.length);
    G.pendingTarget = { action: 'postStallPick', needed, selected: [], attackerPidx: G.activePlayer, attackerSlotIdx: slotIdx, fromAbility: true };
    addLog(`Undying Terror: choose ${needed} enem${needed > 1 ? 'ies' : 'y'} to stall for 1 turn!`, 'info');
    updateTargetCounter(0, needed); renderGame(); return;
  }

  // ── Tiger Rock: Claw Rend (20 dmg to all sleeping enemies) ──
  if (abilityId === 'claw_rend') {
    const ep = 1 - G.activePlayer;
    let hit = 0;
    G.players[ep].party.forEach(s => {
      if (!s || s.awake) return;
      s.hp = Math.max(0, s.hp - 20); hit++;
      addLog(`${s.card.name} took 20 damage from Claw Rend!`, 'ko');
      checkKO(ep, s);
    });
    if (!hit) addLog('Claw Rend: no sleeping enemies.', 'info');
    checkWin(); renderGame(); pushGameState(); return;
  }

  // ── Glitchtrap: Corrupt Mind (choose 1 card from opponent's hand to discard) ──
  if (abilityId === 'glitchtrap_corrupt') {
    const opp2 = G.players[1 - G.activePlayer];
    if (!opp2.hand.length) { addLog('Corrupt Mind: opponent has no cards in hand!', 'info'); slot.usedAbilityThisTurn = false; return; }
    startDeckSearch("Corrupt Mind — choose 1 card from opponent's hand to discard", opp2.hand, 1, G.activePlayer, (sel) => {
      sel.forEach(c => { const i = opp2.hand.indexOf(c); if (i >= 0) opp2.hand.splice(i, 1); opp2.discard.push(c); });
      if (sel.length) addLog(`Glitchtrap: Corrupt Mind! Forced ${opp2.name} to discard ${sel[0].name}!`, 'ko');
      G.pendingTarget = null; renderGame(); pushGameState();
    });
    return;
  }

  // ── M2 Mimic: Endless Adaptation (deal 20 to all enemies) ──
  if (abilityId === 'm2_mimic_aoe') {
    const ep = 1 - G.activePlayer;
    const candidates = G.players[ep].party.map((s, i) => s ? { s, i } : null).filter(Boolean);
    if (!candidates.length) { addLog('Endless Adaptation: no valid targets.', 'info'); checkWin(); renderGame(); pushGameState(); return; }
    for (let i = candidates.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[candidates[i], candidates[j]] = [candidates[j], candidates[i]]; }
    candidates.slice(0, 2).forEach(({ s }) => {
      s.hp = Math.max(0, s.hp - 20);
      addLog(`${s.card.name} took 20 damage from Endless Adaptation!`, 'ko');
      checkKO(ep, s);
    });
    checkWin(); renderGame(); pushGameState(); return;
  }

  // ── M2 Endo: Data Absorb (send Mimic shell from hand to Blob) ──
  if (abilityId === 'm2_data_absorb') {
    const mimicShells = p.hand.filter(c => c.class === 'mimic' && c.type === 'shell');
    if (!mimicShells.length) { addLog('Data Absorb: no Mimic class shells in hand!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    startDeckSearch('Data Absorb — send 1 Mimic shell to Blob Pile', mimicShells, 1, G.activePlayer, (sel) => {
      if (!sel.length) { addLog('Data Absorb cancelled.', 'info'); slot.usedAbilityThisTurn = false; renderGame(); return; }
      const c = sel[0]; const ci = p.hand.indexOf(c); if (ci >= 0) p.hand.splice(ci, 1); p.discard.push(c);
      syncMimicMoveset(G.activePlayer);
      addLog(`M2: Data Absorb — ${c.name}'s attacks absorbed into moveset!`, 'good');
      G.pendingTarget = null; renderGame(); pushGameState();
    });
    return;
  }

  // ── Grim Foxy: Burning Frenzy (20 dmg to all burning enemies) ──
  if (abilityId === 'grim_foxy_burning_frenzy') {
    const ep = 1 - G.activePlayer;
    let hit = 0;
    G.players[ep].party.forEach(s => {
      if (!s || !s.burn) return;
      s.hp = Math.max(0, s.hp - 20); hit++;
      addLog(`Grim Foxy: Burning Frenzy! ${s.card.name} took 20 damage!`, 'ko');
      checkKO(ep, s);
    });
    if (!hit) addLog('Burning Frenzy: no burning enemies!', 'info');
    checkWin(); renderGame(); pushGameState(); return;
  }

  // ── Jackie: Ambush (30 dmg to 1 stalled enemy) ──
  if (abilityId === 'jackie_ambush') {
    const ep = 1 - G.activePlayer;
    if (!G.players[ep].party.some(s => s && s.stalledTurns > 0)) { addLog('Ambush: no stalled enemies!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    G.pendingTarget = { action: 'abilityTarget', ability: 'jackie_ambush', slotIdx };
    addLog('Ambush! Click a stalled enemy to deal 30 damage.', 'info');
    renderGame(); return;
  }

  // ── Big Top: Crowd Control (stall 1 enemy 1 turn) ──
  if (abilityId === 'big_top_crowd_control') {
    const ep = 1 - G.activePlayer;
    if (!G.players[ep].party.some(s => s)) { addLog('Crowd Control: no enemies!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    G.pendingTarget = { action: 'abilityTarget', ability: 'big_top_crowd_control', slotIdx };
    addLog('Crowd Control! Click an enemy to stall for 1 turn.', 'info');
    renderGame(); return;
  }

  // ── Nurse Dollie: Field Medic (heal 30 HP to 1 ally) ──
  if (abilityId === 'nurse_dollie_heal') {
    if (!p.party.some(s => s)) { addLog('Field Medic: no allies!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    G.pendingTarget = { action: 'abilityTarget', ability: 'nurse_dollie_heal', slotIdx };
    addLog('Field Medic! Click an ally to restore 30 HP.', 'info');
    renderGame(); return;
  }

  // ── Party Time Chica: Encore (draw 1 card) ──
  if (abilityId === 'party_chica_encore') {
    if (!p.deck.length) { addLog('Encore: deck is empty!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    drawCardImmediate(G.activePlayer);
    addLog(`${p.name}: Party Time Chica — Encore! Drew 1 card.`, 'good');
    renderGame(); pushGameState(); return;
  }

  // ── Burntrap: Ignite (burn 2 to 1 enemy) ──
  if (abilityId === 'burntrap_ignite') {
    const ep = 1 - G.activePlayer;
    if (!G.players[ep].party.some(s => s)) { addLog('No enemies to ignite!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    G.pendingTarget = { action: 'abilityTarget', ability: 'burntrap_ignite', slotIdx };
    addLog('Ignite! Click an enemy to apply Burn 2.', 'info');
    renderGame(); return;
  }

  // ── Tangle Blob: Blob Drain (discard top of blob → 10 dmg to 1 enemy) ──
  if (abilityId === 'blob_drain') {
    if (!p.discard.length) { addLog('Blob Pile is empty!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    const ep = 1 - G.activePlayer;
    if (!G.players[ep].party.some(s => s)) { addLog('No enemies to drain into!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    // Discard top card first, then pick target
    const topCard = p.discard.pop();
    addLog(`Blob Drain: ${topCard.name} consumed from Blob Pile.`, 'info');
    G.pendingTarget = { action: 'abilityTarget', ability: 'blob_drain', slotIdx };
    addLog('Click an enemy to deal 15 damage.', 'info');
    renderGame(); return;
  }

  // ── M.X.E.S.: Protocol Override (drain 1 energy from 1 enemy animatronic) ──
  if (abilityId === 'mxes_override') {
    const ep = 1 - G.activePlayer;
    if (!G.players[ep].party.some(s => s)) { addLog('No enemies to override!', 'ko'); slot.usedAbilityThisTurn = false; return; }
    G.pendingTarget = { action: 'abilityTarget', ability: 'mxes_override', slotIdx };
    addLog('Protocol Override! Click an enemy to drain 1 energy.', 'info');
    renderGame(); return;
  }

  renderGame();
}

function useRepeatGamble(slotIdx) {
  // Find Shadow Freddy in the party - it's the one granting the repeat
  const sfSlotIdx = G.players[G.activePlayer].party.findIndex(s => s && s.card.id === 'shadow_freddy' && s.canRepeatGamble && !s.usedGambleRepeat);
  const sfSlot = sfSlotIdx !== -1 ? G.players[G.activePlayer].party[sfSlotIdx] : null;
  const att = G.players[G.activePlayer].party[slotIdx];
  if (!att || !sfSlot) { addLog(T('tcg.log.noRepeatGamble')); return; }
  sfSlot.usedGambleRepeat = true; sfSlot.canRepeatGamble = false;
  const atk = att.card.attacks.find(a => a.type === 'gamble'); if (!atk) return;
  addLog(T('tcg.log.shadowFreddy'), 'info');
  resolveGamble({ attackerPidx: G.activePlayer, attackerSlotIdx: slotIdx, atk }, att, 0, true);
}

function confirmGambleRepeat(repeat) {
  const pt = G.pendingTarget;
  if (!pt || pt.action !== 'gambleRepeat') return;
  const att = G.players[pt.pidx].party[pt.slotIdx];
  if (!att) return;
  // Shadow Freddy is the one spending its ability - mark it, not the attacker
  const sfSlotIdx = pt.sfSlotIdx != null ? pt.sfSlotIdx : pt.slotIdx;
  const sfSlot = G.players[pt.pidx].party[sfSlotIdx];
  G.pendingTarget = null;
  if (repeat) {
    if (sfSlot) { sfSlot.usedGambleRepeat = true; sfSlot.canRepeatGamble = false; }
    addLog(T('tcg.log.shadowFreddy'), 'info');
    resolveGamble({ attackerPidx: pt.pidx, attackerSlotIdx: pt.slotIdx, atk: pt.atk }, att, 0, true);
  } else {
    if (sfSlot) { sfSlot.canRepeatGamble = false; }
    markAttacked(att);
    renderGame();
  }
}

/* ── Springtrap search ───────────────────────────── */
function triggerSpringtrapSearch(pidx, slotIdx, dyingSlot) {
  const p = G.players[pidx]; const hasWilliam = dyingSlot.tools.some(t => t.passive === 'william');
  const elec = dyingSlot.elec;
  // KO the Springbonnie
  G.players[1 - pidx].koPoints++;
  addLog(T('tcg.log.koPlusOpp'), 'ko');
  p.discard.push(dyingSlot.card); dyingSlot.tools.forEach(t => p.discard.push(t));
  p.party[slotIdx] = null;

  if (!hasWilliam) { checkWin(); renderGame(); return; }
  // Search hand, deck, then discard for Springtrap
  const stHand = p.hand.findIndex(c => c.id === 'springtrap');
  const stDeck = p.deck.findIndex(c => c.id === 'springtrap');
  const stDiscard = p.discard.findIndex(c => c.id === 'springtrap');
  if (stHand < 0 && stDeck < 0 && stDiscard < 0) { addLog(T('tcg.log.springtrapNotFound')); checkWin(); renderGame(); return; }
  let st;
  if (stHand >= 0) { st = p.hand.splice(stHand, 1)[0]; }
  else if (stDeck >= 0) { st = p.deck.splice(stDeck, 1)[0]; }
  else { st = p.discard.splice(stDiscard, 1)[0]; }
  const newSlotSt = newSlot(st); newSlotSt.elec = elec; newSlotSt.justPlaced = false; checkAwake(newSlotSt);
  p.party[slotIdx] = newSlotSt;
  addLog(T('tcg.log.springtrapFound', { n: elec }), 'good');
  checkWin(); renderGame();
}

function triggerScrapTransform(pidx, idx, dyingSlot) {
  const p = G.players[pidx]; const att = G.players[1 - pidx];
  const scrapId = SCRAP_MAP[dyingSlot.card.id];
  att.koPoints++;
  addLog(T('tcg.log.scrapKo', { card: dyingSlot.card.name, name: att.name }), 'ko');
  p.discard.push(dyingSlot.card); dyingSlot.tools.forEach(t => p.discard.push(t));
  for (let i = 0; i < dyingSlot.elec; i++) p.discard.push({ id: 'energy_spent', name: 'Energy', type: 'energy', energyType: 'generic', img: GENERIC });
  if (dyingSlot.card.class === 'funtime') syncEnnardMoveset(pidx);
  if (dyingSlot.card.class === 'mimic') syncMimicMoveset(pidx);

  if (dyingSlot.card.id === 'carnie') {
    const puppetIdx = p.hand.findIndex(c => c.id === 'puppet');
    const agonyIdx = p.hand.findIndex(c => c.type === 'energy' && c.energyType === 'remnant');
    if (puppetIdx >= 0 && agonyIdx >= 0) {
      const indicesToSplice = [puppetIdx, agonyIdx].sort((a, b) => b - a);
      indicesToSplice.forEach(idx => {
        const consumed = p.hand.splice(idx, 1)[0];
        p.discard.push(consumed);
      });
      addLog('Puppet and 1 Remnant were consumed from hand to form Lefty!', 'info');
    } else {
      p.party[idx] = null;
      addLog('Carnie requires Puppet and 1 Remnant in hand to transform into Lefty!', 'ko');
      checkWin(); return;
    }
  }

  let scrapCard = null;
  const hIdx = p.hand.findIndex(c => c.id === scrapId);
  if (hIdx >= 0) { scrapCard = p.hand.splice(hIdx, 1)[0]; }
  else {
    const dIdx = p.deck.findIndex(c => c.id === scrapId); if (dIdx >= 0) { scrapCard = p.deck.splice(dIdx, 1)[0]; }
    else { const bIdx = p.discard.findIndex(c => c.id === scrapId); if (bIdx >= 0) { scrapCard = p.discard.splice(bIdx, 1)[0]; } }
  }
  if (scrapCard) {
    const ns = newSlot(scrapCard); ns.justPlaced = false;
    p.party[idx] = ns;
    addLog(T('tcg.log.scrapRevived', { from: dyingSlot.card.name, to: scrapCard.name }), 'good');
  } else {
    p.party[idx] = null;
    addLog(T('tcg.log.reviveFailed', { card: CARDS[scrapId]?.name || scrapId }), 'ko');
  }
  checkWin();
}

/* ── Attack effects ──────────────────────────────── */
function applyAttackEffect(effect, aPidx, dPidx, dSlotIdx) {
  if (!effect) return;
  if (effect === 'item_lock') { G.players[dPidx].itemLocked = 1; addLog(T('tcg.log.itemLockEffect'), 'ko'); }
  const def = G.players[dPidx].party[dSlotIdx]; if (!def) return;
  if (effect.startsWith('burn')) {
    if (consumeStatusShield(def, 'Burn')) return;
    const n = parseInt(effect.replace('burn', '')) || 1;
    def.burn = (def.burn || 0) + n;
    addLog(T('tcg.log.burnApplied', { n, card: def.card.name }));
  }
  if (effect === 'discard_energy1' && def.elec > 0) { def.elec--; checkAwake(def); addLog(T('tcg.log.energyRemoved')); }
  if (effect === 'opponent_discard_energy1' && def.elec > 0) { def.elec--; checkAwake(def); addLog(T('tcg.log.energyStolen')); }
  if (effect === 'draw1') drawCardImmediate(aPidx);
  if (effect === 'stall1' || effect === 'stall1_1') {
    if (!consumeStatusShield(def, 'Stall')) {
      def.stalledTurns = Math.max(def.stalledTurns, 2);
      addLog(T('tcg.log.stallTurn', { card: def.card.name }));
    }
  }
  if (effect === 'stall3') {
    if (!consumeStatusShield(def, 'Stall')) {
      def.stalledTurns = Math.max(def.stalledTurns, 4);
      addLog(`${def.card.name} was stalled for 3 turns!`, 'ko');
    }
  }
  if (effect === 'lefty_rockstar') {
    if (!consumeStatusShield(def, 'Stall')) {
      def.stalledTurns = Math.max(def.stalledTurns, 2);
      addLog(`${def.card.name} was stalled for 1 turn.`, 'ko');
    }
  }
  if (effect === 'stall2') {
    if (!consumeStatusShield(def, 'Stall')) {
      def.stalledTurns = Math.max(def.stalledTurns, 3);
      addLog(`${def.card.name} was stalled for 2 turns!`, 'ko');
    }
  }
  if (effect === 'discard5') {
    const op = G.players[dPidx];
    const num = Math.min(5, op.deck.length);
    for (let i = 0; i < num; i++) {
      if (op.deck.length > 0) {
        op.discard.push(op.deck.pop());
      }
    }
    addLog(`${G.players[aPidx].name}'s attack milled ${num} cards from opponent's deck!`, 'ko');
  }
  if (effect === 'blob_stall10') {
    const attacker = G.players[aPidx];
    if (attacker.discard.length >= 10) {
      if (!consumeStatusShield(def, 'Stall')) {
        def.stalledTurns = Math.max(def.stalledTurns, 2);
        addLog(`Blob Tide! Blob Pile has ${attacker.discard.length} cards — ${def.card.name} stalled for 1 turn!`, 'ko');
      }
    }
  }
}

function applyItemEffect(effect, pidx) {
  if (!effect) return;
  const p = G.players[pidx], op = G.players[1 - pidx];
  if (effect === 'draw2energy') drawEnergyToPool(pidx, 2);
  if (effect === 'draw2') { drawCardImmediate(pidx); drawCardImmediate(pidx); addLog(`${p.name} drew 2 cards.`); }
  if (effect === 'draw3') { for (let i = 0; i < 3; i++)drawCardImmediate(pidx); addLog(`${p.name} drew 3 cards.`); }
  if (effect === 'draw2energy_draw1') { drawEnergyToPool(pidx, 2); drawCardImmediate(pidx); }
  if (effect === 'remove_stall') { const s = p.party.find(s => s?.stalledTurns > 0); if (s) { s.stalledTurns = 0; addLog('Stall removed.', 'good'); } }
  if (effect === 'remove_burn') {
    G.pendingTarget = { action: 'removeBurnTarget', pidx };
    addLog('Click an ally to remove all Burn stacks.', 'info');
    return; // pendingTarget will be handled in clickSlot
  }
  if (effect === 'opponent_discard_hand1' && op.hand.length) { const i = Math.floor(Math.random() * op.hand.length); const c = op.hand.splice(i, 1)[0]; op.discard.push(c); addLog(`${op.name} discarded ${c.name}!`); }
  if (effect === 'heal_all20') { p.party.forEach(s => { if (s) s.hp = Math.min(s.card.hp, s.hp + 20); }); addLog(`All allies of ${p.name} +20 HP.`, 'good'); }
  if (effect === 'party_hat_draw') { const n = Math.min(3, p.party.filter(Boolean).length); for (let i = 0; i < n; i++) drawCardImmediate(pidx); addLog(`Party Hat: drew ${n} card(s)!`, 'good'); }

  if (effect === 'defense_guard') { const s = p.party[0]; if (s) { s.defense = { reduction: 15, turnsLeft: 2 }; addLog(`${s.card.name} -15 damage for 2 turns.`, 'good'); } }
  if (effect === 'lantern_stall') { const ep = 1 - pidx; let any = false; G.players[ep].party.forEach(s => { if (!s) return; const id = s.card.id; if (id.includes('foxy') || id === 'mangle' || id === 'p_mangle') { s.stalledTurns = Math.max(s.stalledTurns, 2); addLog(`Lantern! ${s.card.name} stalled for 1 turn.`, 'ko'); any = true; } }); if (!any) addLog('No enemy Foxy or Mangle.'); }
  if (effect === 'pan_stan') {
    const targets = op.party.filter(Boolean);
    if (!targets.length) { addLog('No enemy targets for Pan Stan.', 'info'); return; }
    const randomTarget = targets[Math.floor(Math.random() * targets.length)];
    randomTarget.hp = Math.max(0, randomTarget.hp - 10);
    addLog(`Pan Stan hit ${randomTarget.card.name} for 10 damage.`, 'ko');
    checkKO(1 - pidx, randomTarget);
  }
  if (effect === 'no1_crate_stall') {
    const targets = G.players[1 - pidx].party.filter(Boolean);
    if (!targets.length) { addLog('#1 Crate: no enemies!', 'info'); return; }
    const shuffled = targets.slice().sort(() => Math.random() - 0.5);
    shuffled.slice(0, 2).forEach(s => {
      if (!consumeStatusShield(s, 'Stall')) { s.stalledTurns = Math.max(s.stalledTurns, 3); addLog(`${s.card.name} was stalled for 2 turns by #1 Crate!`, 'ko'); }
    });
    checkWin(); renderGame(); pushGameState(); return;
  }
  if (['disable_ability', 'trash_stall', 'energy_steal', 'remove_enemy_tools'].includes(effect)) {
    G.pendingTarget = { action: 'itemEnemyEffect', effect, pidx };
    addLog('Click an enemy target for this item effect.', 'info');
    return;
  }
  if (effect === 'hand_reset_4') {
    const pCards = [...p.hand], opCards = [...op.hand];
    p.deck = shuffle([...p.deck, ...pCards]); p.hand = [];
    op.deck = shuffle([...op.deck, ...opCards]); op.hand = [];
    for (let i = 0; i < 4; i++) { drawCardImmediate(pidx); drawCardImmediate(1 - pidx); }
    addLog('Both players shuffled their hands into deck and drew 4 cards.', 'info');
  }
  if (effect === 'hand_reset_6') {
    p.discard.push(...p.hand); p.hand = [];
    for (let i = 0; i < 6; i++) drawCardImmediate(pidx);
    addLog(`${p.name} discarded their hand and drew 6 cards.`, 'info');
  }
  if (effect === 'nedd_gamble') {
    p.deck = shuffle([...p.deck, ...p.hand]); p.hand = [];
    const drawN = Math.random() < 0.5 ? 8 : 1;
    for (let i = 0; i < drawN; i++)drawCardImmediate(pidx);
    addLog(`Nedd Bear effect resolved. ${p.name} drew ${drawN} card(s).`, 'info');
  }
  if (effect === 'recover_item_from_blob') {
    const idx = p.discard.findIndex(c => c.type === 'item');
    if (idx >= 0) {
      const it = p.discard.splice(idx, 1)[0];
      p.hand.push(it);
      addLog(`${p.name} recovered ${it.name} from Blob.`, 'good');
    } else addLog('No item card in Blob to recover.', 'info');
  }
  if (effect === 'tilt_disrupt') {
    const opp = G.players[1 - pidx];
    if (!opp.hand.length) { addLog('Tilt: opponent has no cards to discard!', 'info'); return; }
    const count = Math.min(5, opp.hand.length);
    const names = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * opp.hand.length);
      const [c] = opp.hand.splice(idx, 1);
      opp.discard.push(c);
      names.push(c.name);
    }
    addLog(`Tilt! Forced ${opp.name} to discard: ${names.join(', ')}`, 'ko');
    renderGame(); pushGameState(); return;
  }
  if (effect === 'burn_all1') {
    const ep = G.players[1 - pidx];
    let hit = false;
    ep.party.forEach(s => {
      if (!s) return;
      if (!consumeStatusShield(s, 'Burn')) { s.burn = (s.burn || 0) + 1; addLog(`Party Popper! ${s.card.name} gets Burn 1!`, 'ko'); hit = true; }
    });
    if (!hit) addLog('No enemies to burn.', 'info');
  }
  if (effect === 'stall_single2') {
    G.pendingTarget = { action: 'itemEnemyEffect', effect: 'stall_single2', pidx };
    addLog('Click an enemy to stall for 2 turns.', 'info');
    return;
  }
  if (effect === 'stall_all1') {
    const ep = G.players[1 - pidx];
    let hit = false;
    ep.party.forEach(s => {
      if (!s) return;
      if (!consumeStatusShield(s, 'Stall')) { s.stalledTurns = Math.max(s.stalledTurns, 2); addLog(`Crying Child stalled ${s.card.name}!`, 'ko'); hit = true; }
    });
    if (!hit) addLog('No enemies to stall.', 'info');
  }
  if (effect === 'ruined_dj_stall') {
    p.energyPool -= 2;
    addLog(`${p.name} discarded 2 energy from pool for DJ Music Man.`, 'info');
    const ep = G.players[1 - pidx];
    let hit = false;
    ep.party.forEach(s => {
      if (!s) return;
      if (!consumeStatusShield(s, 'Stall')) { s.stalledTurns = Math.max(s.stalledTurns, 2); addLog(`Ruined DJ Music Man stalled ${s.card.name}!`, 'ko'); hit = true; }
    });
    if (!hit) addLog('No enemies to stall.', 'info');
    drawCardImmediate(pidx);
    addLog(`${p.name} drew 1 card from Ruined DJ.`, 'good');
  }
  if (effect === 'rearrange_opponent_deck') {
    if (!op.deck.length) { addLog('Opponent deck is empty.', 'info'); return; }
    const peek = Math.min(5, op.deck.length);
    const top = op.deck.slice(-peek);
    // Create a modal/dialog for rearranging - store the cards to rearrange
    G._deckRearrange = {
      cards: [...top],
      originalIndices: Array.from({ length: peek }, (_, i) => op.deck.length - peek + i),
      pidx: dPidx
    };
    addLog(`Happy Frog revealed the top ${peek} cards of opponent's deck. Rearrange them!`, 'info');
    // Show UI for rearranging - this will be handled in renderGame
    showDeckRearrangeUI(top);
  }
}

/* ── KO & Revenge ────────────────────────────────── */
function checkRevenge(dPidx, defSlot, attSlot, aPidx) {
  if (defSlot.hp <= 0 && defSlot.tools.some(t => t.passive === 'revenge30')) {
    attSlot.hp -= 30; addLog(T('tcg.log.revengeHit', { card: attSlot.card.name }));
    checkKO(aPidx, attSlot);
  }
}

// Rebuild Ennard's inherited attacks/abilities from ALL Funtimes in pidx's Blob Pile.
// Called whenever a new Funtime lands in the Blob while Ennard is in play.
function syncEnnardMoveset(pidx) {
  const p = G.players[pidx];
  const ennardSlot = p.party.find(s => s && s.card.id === 'ennard');
  if (!ennardSlot) return;
  const seenAtk = new Set();
  const seenAbl = new Set(['ennard_generator_boost']);
  const atks = [];
  const abls = [{ name: 'Central Wire', desc: 'Transfer 1 energy from the Generator to a Funtime ally.', id: 'ennard_generator_boost' }];
  p.discard.forEach(fc => {
    if (fc.class !== 'funtime') return;
    (fc.attacks || []).forEach(atk => {
      if (!seenAtk.has(atk.name)) {
        seenAtk.add(atk.name);
        atks.push({ ...atk, name: `${atk.name} (${fc.name})`, synced: true });
      }
    });
    const fa = fc.abilities ? fc.abilities : (fc.ability ? [fc.ability] : []);
    fa.forEach(a => { if (!seenAbl.has(a.id)) { seenAbl.add(a.id); abls.push(a); } });
  });
  ennardSlot.card.attacks = atks;
  ennardSlot.card.abilities = abls;
}

function syncMimicMoveset(pidx) {
  const p = G.players[pidx];
  const m2Slots = p.party.filter(s => s && (s.card.id === 'm2_endo' || s.card.id === 'm2_mimic'));
  if (!m2Slots.length) return;
  const seen = new Set(['Glitch Shock']);
  const atks = [
    { name: 'Glitch Shock', cost: 1, type: 'single', damage: 25, desc: 'Deals 25 damage.' }
  ];
  p.discard.forEach(fc => {
    if (fc.class !== 'mimic' || fc.type !== 'shell') return;
    (fc.attacks || []).forEach(atk => {
      if (!seen.has(atk.name)) {
        seen.add(atk.name);
        atks.push({ ...atk, name: `${atk.name} (${fc.name})`, synced: true });
      }
    });
  });
  m2Slots.forEach(slot => { slot.card = { ...slot.card, attacks: atks }; });
}

function triggerGlitchtrapTransform(pidx, slotIdx, dyingSlot) {
  const p = G.players[pidx];
  const elec = dyingSlot.elec;
  G.players[1 - pidx].koPoints++;
  addLog(`${dyingSlot.card.name} was destroyed — Glitchtrap emerges from the ruins!`, 'ko');
  p.discard.push(dyingSlot.card); dyingSlot.tools.forEach(t => p.discard.push(t));
  p.party[slotIdx] = null;
  const gtHand = p.hand.findIndex(c => c.id === 'glitchtrap');
  const gtDeck = p.deck.findIndex(c => c.id === 'glitchtrap');
  const gtDisc = p.discard.findIndex(c => c.id === 'glitchtrap');
  if (gtHand < 0 && gtDeck < 0 && gtDisc < 0) { addLog('No Glitchtrap found in hand, deck, or Blob Pile.', 'info'); checkWin(); renderGame(); return; }
  let gt;
  if (gtHand >= 0) gt = p.hand.splice(gtHand, 1)[0];
  else if (gtDeck >= 0) gt = p.deck.splice(gtDeck, 1)[0];
  else gt = p.discard.splice(gtDisc, 1)[0];
  const newGt = newSlot(gt); newGt.elec = elec; newGt.justPlaced = false; checkAwake(newGt);
  p.party[slotIdx] = newGt;
  addLog(`Glitchtrap materialized with ${elec} energy!`, 'good');
  checkWin(); renderGame();
}

function checkKO(pidx, slot) {
  if (!slot || slot.hp > 0) return;
  const idx = G.players[pidx].party.indexOf(slot);
  // Scraptrap passive: survives first KO at 10 HP
  if (slot.card.id === 'scraptrap' && !slot.deathGuardUsed) {
    slot.hp = 10; slot.deathGuardUsed = true;
    addLog(T('tcg.log.scraptrapSurvive'), 'good');
    return;
  }
  // Springbonnie with William → trigger Springtrap mechanic instead of normal KO
  if (slot.card.id === 'springbonnie' && slot.tools.some(t => t.passive === 'william') && idx >= 0) {
    triggerSpringtrapSearch(pidx, idx, slot);
    return;
  }
  // M2 with Purple Guy → Glitchtrap transform on KO
  if (slot.card.id === 'm2_endo' && slot.tools.some(t => t.passive === 'william') && idx >= 0) {
    triggerGlitchtrapTransform(pidx, idx, slot);
    return;
  }
  // Scrap transform: animatronic with Fragmento de Remnant → Scrap version
  if (slot.tools.some(t => t.passive === 'scrap') && SCRAP_MAP[slot.card.id] && idx >= 0) {
    triggerScrapTransform(pidx, idx, slot);
    return;
  }
  const p = G.players[pidx]; const att = G.players[1 - pidx];
  // Flag that this player lost an ally this turn (used by revenge abilities)
  if (G.activePlayer !== pidx) p.alliedDeathLastOpponentTurn = true;
  att.koPoints++;
  addLog(T('tcg.log.koPlus', { card: slot.card.name, name: att.name, pts: att.koPoints }), 'ko');
  if (idx >= 0) {
    p.discard.push(slot.card); slot.tools.forEach(t => p.discard.push(t)); p.party[idx] = null;
    if (slot.card.class === 'funtime') syncEnnardMoveset(pidx);
    if (slot.card.class === 'mimic') syncMimicMoveset(pidx);
  }
}

function consumeStatusShield(slot, statusName) {
  if (!slot || !slot.tools) return false;
  const shieldIdx = slot.tools.findIndex(t => t.effect === 'status_shield');
  if (shieldIdx < 0) return false;
  const shield = slot.tools.splice(shieldIdx, 1)[0];
  addLog(`${shield.name} blocked ${statusName} on ${slot.card.name}!`, 'good');
  return true;
}

function checkWin() {
  for (const p of G.players) { if (p.koPoints >= 4) { G.winner = p; showResult(); pushGameState(); return; } }
  for (let i = 0; i < 2; i++) {
    if (G.players[i].party.every(s => !s)) { G.winner = G.players[1 - i]; showResult(); pushGameState(); return; }
  }
}

/* ═══════════════════════════════════════════════════════
   UNDO / CANCEL
   ═══════════════════════════════════════════════════════ */
function saveUndo() {
  undoStack.push(JSON.parse(JSON.stringify(G)));
  if (undoStack.length > 5) undoStack.shift();
  const isOnlineMode = window.MP && MP.mode === 'online';
  const btn = document.getElementById('undo-btn'); if (btn) btn.style.display = isOnlineMode ? 'none' : '';
}
function undoAction() { if (!undoStack.length) return; G = undoStack.pop(); if (!undoStack.length) { const b = document.getElementById('undo-btn'); if (b) b.style.display = 'none'; } closeCardInfo(); renderGame(); }
function cancelPending() {
  if (G.pendingTarget?.action === 'gambleRepeat') return;
  if (!G.winner && G) {
    // Reset ability used flag - covers abilityTarget AND ennardGeneratorBoost
    const abilityActions = ['abilityTarget', 'ennardGeneratorBoost'];
    if (abilityActions.includes(G.pendingTarget?.action) && G.pendingTarget?.slotIdx != null) {
      const slot = G.players[G.activePlayer]?.party[G.pendingTarget.slotIdx];
      if (slot) slot.usedAbilityThisTurn = false;
    }
    // Reset class card used flag ONLY when cancelling a class card target action
    if (G.pendingTarget?.action === 'classCardTarget') {
      const cp = G.players[G.pendingTarget?.pidx ?? G.activePlayer];
      if (cp) cp.classCardUsed = false;
    }
  }
  G.pendingTarget = null;
  const el = document.getElementById('target-counter'); if (el) el.style.display = 'none';
  closeCardInfo(); renderGame();
}

function openDeckSpyModal(spiedCards, onConfirm) {
  const n = spiedCards.length;
  const ordered = []; // indices into spiedCards, in chosen draw order
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;';
  const title = document.createElement('div');
  title.textContent = 'M1 — Click cards in order (1st = drawn first). Click again to deselect.';
  title.style.cssText = 'color:#fff;font-size:1em;font-weight:bold;text-align:center;padding:0 12px;';
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:14px;flex-wrap:wrap;justify-content:center;';
  const wrappers = [], labels = [];
  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Confirm Order';
  confirmBtn.disabled = true;
  confirmBtn.style.cssText = 'opacity:0.4;padding:10px 28px;font-size:1em;cursor:pointer;background:#2a2a3a;color:#fff;border:2px solid #666;border-radius:6px;';
  function refresh() {
    spiedCards.forEach((_, i) => {
      const pos = ordered.indexOf(i);
      labels[i].textContent = pos === -1 ? '—' : pos + 1;
      labels[i].style.color = pos === -1 ? '#aaa' : '#0f0';
      wrappers[i].style.opacity = pos === -1 ? '1' : '0.55';
    });
    const done = ordered.length === n;
    confirmBtn.disabled = !done;
    confirmBtn.style.opacity = done ? '1' : '0.4';
  }
  spiedCards.forEach((card, i) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;transition:opacity .2s;';
    const face = buildCardFace(card, 0, 0);
    face.style.pointerEvents = 'none';
    const lbl = document.createElement('div');
    lbl.textContent = '—';
    lbl.style.cssText = 'color:#aaa;font-size:1.3em;font-weight:bold;min-width:24px;text-align:center;';
    labels.push(lbl); wrappers.push(wrapper);
    wrapper.appendChild(face); wrapper.appendChild(lbl);
    wrapper.onclick = () => {
      const pos = ordered.indexOf(i);
      if (pos === -1) ordered.push(i); else ordered.splice(pos, 1);
      refresh();
    };
    row.appendChild(wrapper);
  });
  confirmBtn.onclick = () => {
    document.body.removeChild(overlay);
    onConfirm(ordered.map(i => spiedCards[i]));
  };
  overlay.appendChild(title); overlay.appendChild(row); overlay.appendChild(confirmBtn);
  document.body.appendChild(overlay);
}

/* ═══════════════════════════════════════════════════════
   DECK SEARCH UI
   ═══════════════════════════════════════════════════════ */
function startDeckSearch(title, cards, maxCount, pidx, onConfirm) {
  pendingSearch = { title, cards, maxCount, pidx, selected: [], onConfirm };
  renderSearchPanel();
}
function renderSearchPanel() {
  const ps = pendingSearch; if (!ps) return;
  const panel = document.getElementById('search-panel'), bg = document.getElementById('search-bg');
  if (!panel) return;
  document.getElementById('sp-title').textContent = ps.title;
  const info = document.getElementById('sp-sel-info');
  if (info) info.textContent = ps.maxCount > 1 ? T('tcg.db.selectUpto', { n: ps.maxCount }) : T('tcg.db.clickSelect');
  const cardsEl = document.getElementById('sp-cards'); cardsEl.innerHTML = '';
  const prev = document.getElementById('sp-preview'); if (prev) prev.innerHTML = '';
  ps.cards.forEach(card => {
    const isSel = ps.selected.includes(card);
    const div = document.createElement('div');
    div.className = 'sp-card' + (isSel ? ' selected' : '');
    div.innerHTML = `<img src="${card.img || GENERIC}" onerror="this.src='${GENERIC}'" /><div class="spc-name">${card.name}</div><div class="spc-type">${card.type}${card.energyType ? ' ' + ENERGY_META[card.energyType].sym : ''}</div>`;
    div.onclick = () => _showSearchPreview(card, ps, panel, bg);
    cardsEl.appendChild(div);
  });
  const confirm = document.getElementById('sp-confirm');
  if (confirm) { confirm.style.display = ps.maxCount > 1 ? '' : 'none'; confirm.textContent = ps.selected.length ? T('tcg.search.confirmN', { n: ps.selected.length }) : T('tcg.search.skip'); }
  panel.style.display = ''; if (bg) bg.style.display = '';
}
function _showSearchPreview(card, ps, panel, bg) {
  const prev = document.getElementById('sp-preview'); if (!prev) return;
  prev.innerHTML = '';
  // Full card face in the search panel's right column (shares z-index 200 - always visible)
  const face = buildCardFace(card, 0, 0);
  face.style.pointerEvents = 'none';
  prev.appendChild(face);
  const isSel = ps.selected.includes(card);
  if (ps.maxCount === 1) {
    const btn = mk('button', 'tcg-btn primary', '✓ Select', () => {
      pendingSearch = null; panel.style.display = 'none'; if (bg) bg.style.display = 'none';
      ps.onConfirm([card]);
    });
    prev.appendChild(btn);
  } else {
    const btn = mk('button', 'tcg-btn primary', isSel ? '✕ Remove' : '+ Select', () => {
      const si = ps.selected.indexOf(card);
      if (si >= 0) ps.selected.splice(si, 1);
      else if (ps.selected.length < ps.maxCount) ps.selected.push(card);
      renderSearchPanel(); _showSearchPreview(card, ps, panel, bg);
    });
    prev.appendChild(btn);
  }
}

function confirmSearch() {
  const ps = pendingSearch; if (!ps) return;
  const sel = [...ps.selected]; pendingSearch = null;
  const panel = document.getElementById('search-panel'), bg = document.getElementById('search-bg');
  if (panel) panel.style.display = 'none'; if (bg) bg.style.display = 'none';
  if (ps.onConfirm) ps.onConfirm(sel);
}
function closeSearch() {
  // X = CANCEL - close panel without consuming/using the item
  const ps = pendingSearch;
  pendingSearch = null;
  const panel = document.getElementById('search-panel'), bg = document.getElementById('search-bg');
  if (panel) panel.style.display = 'none'; if (bg) bg.style.display = 'none';
  // Reset class card used state so the player can retry after cancelling
  if (window.G && G && !G.winner) {
    const pidx = ps != null ? ps.pidx : G.activePlayer;
    const p = G.players[pidx];
    if (p) p.classCardUsed = false; // only per-turn flag; classCardUsedForever stays
    renderGame();
  }
}

/* ═══════════════════════════════════════════════════════
   BLOB PILE VIEWER
   ═══════════════════════════════════════════════════════ */
function showBlobPile(pidx) {
  viewingBlob = { pidx, cards: [...G.players[pidx].discard] };
  const panel = document.getElementById('blob-panel'), bg = document.getElementById('blob-bg');
  if (!panel) return;
  document.getElementById('bp-title').textContent = T('tcg.blob.title', { name: G.players[pidx].name, n: viewingBlob.cards.length });
  const cardsEl = document.getElementById('bp-cards'); cardsEl.innerHTML = '';
  if (!viewingBlob.cards.length) { cardsEl.innerHTML = `<div class="sp-empty">${T('tcg.blob.empty')}</div>`; }
  else viewingBlob.cards.forEach(card => {
    const div = document.createElement('div'); div.className = 'sp-card';
    div.innerHTML = `<img src="${card.img || GENERIC}" onerror="this.src='${GENERIC}'" /><div class="spc-name">${card.name}</div><div class="spc-type">${card.type}${card.energyType ? ' ' + ENERGY_META[card.energyType].sym : ''}</div>`;
    div.onclick = () => showCardInfo(card, null, -1, pidx, false, -1);
    cardsEl.appendChild(div);
  });
  panel.style.display = ''; if (bg) bg.style.display = '';
}
function closeBlobPile() {
  viewingBlob = null;
  const panel = document.getElementById('blob-panel'), bg = document.getElementById('blob-bg');
  if (panel) panel.style.display = 'none'; if (bg) bg.style.display = 'none';
}

/* ═══════════════════════════════════════════════════════
   CARD INFO PANEL
   ═══════════════════════════════════════════════════════ */
let _infoContext = null;

function showCardInfo(card, slot, slotIdx, pidx, isHand, handIdx) {
  _infoContext = { card, slot, slotIdx, pidx, isHand, handIdx };
  showCardInfoData(card);
  const actions = document.getElementById('info-actions'); actions.innerHTML = '';
  const isOwn = pidx === G.activePlayer;

  if (isHand) {
    if (card.type === 'energy') {
      const msg = document.createElement('div');
      msg.style.cssText = 'font-size:.7rem;color:var(--text-muted);padding:6px 0';
      msg.textContent = card.energyType === 'phantom_agony'
        ? T('tcg.game.useEnergyPhantom')
        : T('tcg.game.useEnergyShell', { type: ENERGY_META[card.energyType]?.name || '' });
      actions.appendChild(msg);
    } else {
      const playBtn = mk('button', 'tcg-btn primary', T('tcg.game.play'), () => { playHandCard(handIdx); closeCardInfo(); });
      actions.appendChild(playBtn);
    }
  } else if (slot && isOwn && !isHand) {
    // Field animatronic: show attacks if can attack
    const canAtk = slot.awake && !slot.attackedThisTurn && slot.stalledTurns === 0 && G.turn > 1;
    if (canAtk && card.attacks) {
      const lbl = document.createElement('div'); lbl.style.cssText = 'font-size:.72rem;color:var(--text-muted);margin-bottom:4px'; lbl.textContent = T('tcg.game.atkLabel');
      actions.appendChild(lbl);
      getEffectiveAttacks(slot).forEach((atk, i) => {
        const btn = document.createElement('button'); btn.className = 'info-attack-btn';
        const actualCost = Math.max(0, atk.cost - (slot.costReductionThisTurn || 0));
        btn.disabled = slot.elec < actualCost;
        let meta = '';
        if (atk.type === 'single') meta = `${atk.damage} dmg · single`;
        if (atk.type === 'multi') meta = `${atk.damage} dmg × ${atk.targets === -1 ? 'all' : atk.targets}`;
        if (atk.type === 'heal') meta = `Heal ${atk.healAmount} × ${atk.healTargets} ally/allies`;
        if (atk.type === 'defense') meta = `Defense ${atk.defenseReduction} for ${atk.defenseTurns}T`;
        if (atk.type === 'stall') meta = `Stall ${atk.stallTargets === -1 ? 'all' : atk.stallTargets} × ${atk.stallTurns}T`;
        if (atk.type === 'gamble') meta = atk.desc || `${Math.round(atk.successChance * 100)}% success`;
        if (atk.effect?.startsWith('burn')) meta += ` + Burn${atk.effect.replace('burn', '')}`;
        // Auto-generate description for non-damage attacks
        let atkDesc = atk.desc || '';
        if (!atkDesc) {
          if (atk.type === 'stall') atkDesc = `Stalls ${atk.stallTargets === -1 ? 'all enemies' : atk.stallTargets + ' enemy animatronic(s)'} for ${atk.stallTurns} turn(s).`;
          else if (atk.type === 'defense') atkDesc = `Reduces incoming damage by ${atk.defenseReduction} for ${atk.defenseTurns} turn(s).`;
          else if (atk.type === 'heal') atkDesc = `Heals ${atk.healAmount} HP on ${atk.healTargets} ally/allies.`;
          else if (atk.type === 'multi' && atk.targets === -1) atkDesc = `Deals ${atk.damage} damage to all enemies.`;
        }
        const costDisplay = actualCost < atk.cost ? `<span style="text-decoration:line-through;opacity:0.5">${atk.cost}</span><span style="color:#7ad;font-weight:bold">${actualCost}</span>⚡` : `${actualCost}⚡`;
        btn.innerHTML = `<div class="iab-name">${atk.name}</div><div class="iab-meta"><span class="iab-cost">${costDisplay}</span> · ${meta}</div>${atkDesc ? `<div class="iab-desc" style="font-size:.63rem;color:var(--text-muted);margin-top:2px;line-height:1.3">${atkDesc}</div>` : ''}`;
        btn.onclick = () => initiateAttack(slotIdx, i);
        actions.appendChild(btn);
      });
      // Shadow Freddy repeat gambling (now via ability button below)
    }
    // Ability buttons (once per turn) - supports single card.ability or card.abilities array, plus tool-granted abilities
    const _grantedAbls = [];
    slot.tools.forEach(t => {
      if (t.grantAbility) { const src = CARDS[t.grantAbility]; if (src?.ability) _grantedAbls.push(src.ability); }
    });
    const _ablList = [...(card.abilities?.length ? card.abilities : (card.ability && card.ability.id !== 'repeat_gamble' ? [card.ability] : [])), ..._grantedAbls];
    if (!slot.usedAbilityThisTurn) {
      _ablList.forEach(abl => {
        let abled = true;
        if (slot.abilityDisabledTurns > 0) abled = false;
        if (abl.id === 'wfreddy_blob_energy') { abled = G.players[pidx].discard.some(c => c.type === 'energy') && G.players[pidx].party.some(s => s && s.card.class === 'withered'); }
        if (abl.id === 'wbonnie_discard_defend') { abled = G.players[pidx].generator.length >= 2; }
        if (abl.id === 'wchica_double_attack') { abled = slot.elec >= 1 && G.players[pidx].party.some(s => s && s.card.class === 'withered' && s.card.id !== 'withered_chica'); }
        if (abl.id === 'springtrap_phantom_search') { abled = G.players[pidx].deck.some(c => c.type === 'shell' && c.phantomSummon) && G.players[pidx].party.some(s => !s); }
        if (abl.id === 'baby_trap_target') { abled = G.players[1 - pidx].party.some(s => s); }
        if (abl.id === 'ballora_steal') { abled = G.players[1 - pidx].party.some(s => s && s.elec > 0); }
        if (abl.id === 'ftfreddy_discard') { abled = G.players[1 - pidx].hand.length > 0; }
        if (abl.id === 'lolbit_buffer') { abled = slot.elec > 0; }
        if (abl.id === 'ennard_generator_boost') { abled = G.players[pidx].generator.length > 0 && G.players[pidx].party.some(s => s && s.card.class === 'funtime'); }
        if (abl.id === 'scrap_baby_scissors') { abled = G.turn > 1 && !slot.attackedThisTurn && G.players[1 - pidx].party.some(s => s); }
        if (abl.id === 'molten_steal') { abled = G.players[1 - pidx].party.some(s => s && s.elec > 0); }
        if (abl.id === 'lefty_heal') { abled = G.players[pidx].party.some(s => s); }
        if (abl.id === 'chica_revive') { abled = G.players[pidx].alliedDeathLastOpponentTurn && G.players[pidx].party.some(s => !s) && G.players[pidx].discard.some(c => c.type === 'shell' || c.type === 'endo'); }
        if (abl.id === 'rockstar_foxy_treasure') { abled = G.players[pidx].alliedDeathLastOpponentTurn && G.players[pidx].deck.some(c => c.type === 'supporter'); }
        if (abl.id === 'rockstar_freddy_draw') { abled = G.players[pidx].alliedDeathLastOpponentTurn; }
        if (abl.id === 'rockstar_bonnie_item') { abled = G.players[pidx].alliedDeathLastOpponentTurn && G.players[pidx].deck.some(c => c.type === 'item'); }
        if (abl.id === 'dreadbear_aoe') { abled = G.players[1 - pidx].party.some(s => s && !s.awake); }
        if (abl.id === 'ruined_roxy_salvage') { abled = G.players[pidx].discard.some(c => c.type === 'energy') && G.players[pidx].party.some(s => s && s.card.class === 'ruined'); }
        if (abl.id === 'live_wire') { abled = slot.elec > 0 && G.players[1 - pidx].party.some(s => s); }
        if (abl.id === 'strobe_effect') { abled = slot.elec > 0 && G.players[1 - pidx].party.some(s => s); }
        if (abl.id === 'ruined_chica_shriek') { abled = slot.elec > 0 && G.players[1 - pidx].party.some(s => s); }
        if (abl.id === 'sun_solar_care') { abled = G.players[pidx].party.some(s => s && s.hp < s.card.hp); }
        if (abl.id === 'moon_bedtime') { abled = G.players[1 - pidx].party.some(s => s); }
        if (abl.id === 'dreadbear_stall_pick2') { abled = G.players[1 - pidx].party.some(s => s); }
        if (abl.id === 'claw_rend') { abled = G.players[1 - pidx].party.some(s => s && !s.awake); }
        if (abl.id === 'glitchtrap_corrupt') { abled = G.players[1 - pidx].hand.length > 0; }
        if (abl.id === 'm2_mimic_aoe') { abled = G.players[1 - pidx].party.some(s => s); }
        if (abl.id === 'm2_data_absorb') { abled = G.players[pidx].hand.some(c => c.class === 'mimic' && c.type === 'shell'); }
        if (abl.id === 'grim_foxy_burning_frenzy') { abled = G.players[1 - pidx].party.some(s => s && s.burn > 0); }
        if (abl.id === 'jackie_ambush') { abled = G.players[1 - pidx].party.some(s => s && s.stalledTurns > 0); }
        if (abl.id === 'big_top_crowd_control') { abled = G.players[1 - pidx].party.some(s => s); }
        if (abl.id === 'nurse_dollie_heal') { abled = G.players[pidx].party.some(s => s); }
        if (abl.id === 'party_chica_encore') { abled = G.players[pidx].deck.length > 0; }
        const ablBtn = document.createElement('button'); ablBtn.className = 'info-attack-btn';
        ablBtn.disabled = !abled;
        ablBtn.innerHTML = `<div class="iab-name">✦ ${abl.name}</div><div class="iab-meta" style="color:#c9a">${abl.desc}</div>`;
        ablBtn.onclick = () => useAbility(slotIdx, abl.id);
        actions.appendChild(ablBtn);
      });
    }
    // Tool activation (once per turn)
    slot.tools.forEach((tool, ti) => {
      if (tool.once_per_turn && !slot.usedToolThisTurn && slot.awake && slot.elec > 0) {
        const tBtn = mk('button', 'tcg-btn small', T('tcg.game.toolActivate', { name: tool.name }), () => {
          slot.usedToolThisTurn = true;
          if (tool.once_per_turn === 'draw1') drawCardImmediate(G.activePlayer);
          G._lastPlayedCard = { card: tool, playerIdx: G.activePlayer, seq: (G._lastPlayedCard?.seq || 0) + 1 };
          addLog(T('tcg.log.toolEquipped', { tool: tool.name, card: slot.card.name }), 'good');
          closeCardInfo(); renderGame(); pushGameState();
        }); actions.appendChild(tBtn);
      }
      // View tool button (own and enemy)
      const viewBtn = mk('button', 'tcg-btn small', `🔍 ${tool.name}`, () => openCardInfoPanel(tool));
      viewBtn.style.cssText = 'margin-top:4px;width:100%';
      actions.appendChild(viewBtn);
    });
  } else if (slot && !isOwn && !isHand) {
    // Enemy animatronic: show tool view button if equipped
    slot.tools.forEach(tool => {
      const viewBtn = mk('button', 'tcg-btn small', `🔍 ${tool.name}`, () => openCardInfoPanel(tool));
      viewBtn.style.cssText = 'margin-top:4px;width:100%';
      actions.appendChild(viewBtn);
    });
  }
  document.getElementById('card-info-panel').style.display = '';
  document.getElementById('card-info-overlay').style.display = '';
}

function showCardInfoData(card) {
  const scroll = document.querySelector('.info-scroll');
  scroll.innerHTML = '';
  const face = buildCardFace(card);
  scroll.appendChild(face);
  const actEl = document.createElement('div');
  actEl.id = 'info-actions'; actEl.className = 'info-actions';
  scroll.appendChild(actEl);
}

// Opens the side info panel with no action buttons - usable from any screen
function openCardInfoPanel(card) {
  showCardInfoData(card);
  document.getElementById('card-info-panel').style.display = '';
  document.getElementById('card-info-overlay').style.display = '';
}
window.openCardInfoPanel = openCardInfoPanel;

function showCardHoverPreview(card, sourceEl) {
  const prev = document.getElementById('card-hover-preview'); if (!prev) return;
  prev.innerHTML = '';
  const f = buildCardFace(card);
  prev.appendChild(f);
  const rect = sourceEl.getBoundingClientRect();
  const scale = 1.75;
  const cw = rect.width * scale, ch = rect.height * scale;
  let x = rect.left - cw - 14;
  if (x < 8) x = rect.right + 14;
  if (x + cw > window.innerWidth - 8) x = Math.max(8, window.innerWidth - cw - 8);
  let y = rect.top;
  if (y + ch > window.innerHeight - 8) y = Math.max(8, window.innerHeight - ch - 8);
  prev.style.left = x + 'px'; prev.style.top = y + 'px'; prev.style.display = '';
}

function hideCardHoverPreview() {
  const prev = document.getElementById('card-hover-preview'); if (prev) prev.style.display = 'none';
}

function closeCardInfo() {
  document.getElementById('card-info-panel').style.display = 'none';
  document.getElementById('card-info-overlay').style.display = 'none';
  _infoContext = null;
}

function showDeckRearrangeUI(cards) {
  // Store the current arrangement globally for rearranging
  G._deckRearrangeCards = [...cards];

  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(20,20,30,0.98);border:3px solid #7ad;border-radius:10px;padding:25px;z-index:10000;max-width:700px;max-height:600px;overflow-y:auto;font-family:monospace;';

  const title = document.createElement('h3');
  title.textContent = 'Happy Frog - Rearrange Top Cards';
  title.style.cssText = 'color:#7ad;margin:0 0 15px 0;text-align:center;';
  container.appendChild(title);

  const info = document.createElement('p');
  info.textContent = 'Select two cards to swap them. Top card will be drawn first.';
  info.style.cssText = 'color:#aaa;font-size:12px;text-align:center;margin:0 0 15px 0;';
  container.appendChild(info);

  let selectedIdx = -1;
  const renderCards = () => {
    // Clear existing list
    const oldList = document.getElementById('deck-rearrange-list');
    if (oldList) oldList.remove();

    const cardList = document.createElement('div');
    cardList.id = 'deck-rearrange-list';
    cardList.style.cssText = 'display:flex;flex-direction:column;gap:8px;margin:15px 0;';

    G._deckRearrangeCards.forEach((card, idx) => {
      const cardDiv = document.createElement('div');
      const isSelected = idx === selectedIdx;
      cardDiv.style.cssText = `background:${isSelected ? '#7ad22' : '#333'};border:2px solid ${isSelected ? '#7ad' : '#555'};padding:12px;border-radius:5px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:all 0.2s;`;

      const text = document.createElement('span');
      text.textContent = `${idx + 1}. ${card.name}`;
      text.style.cssText = `color:${isSelected ? '#000' : '#ccc'};font-weight:${isSelected ? 'bold' : 'normal'};`;

      cardDiv.appendChild(text);

      cardDiv.addEventListener('click', () => {
        if (selectedIdx === -1) {
          selectedIdx = idx;
          renderCards();
        } else if (selectedIdx === idx) {
          selectedIdx = -1;
          renderCards();
        } else {
          // Swap
          const temp = G._deckRearrangeCards[selectedIdx];
          G._deckRearrangeCards[selectedIdx] = G._deckRearrangeCards[idx];
          G._deckRearrangeCards[idx] = temp;
          selectedIdx = -1;
          renderCards();
        }
      });

      cardDiv.addEventListener('mouseover', () => {
        if (selectedIdx !== idx) cardDiv.style.borderColor = '#7ad';
      });

      cardDiv.addEventListener('mouseout', () => {
        if (selectedIdx !== idx) cardDiv.style.borderColor = '#555';
      });

      cardList.appendChild(cardDiv);
    });

    container.appendChild(cardList);
  };

  renderCards();

  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = 'display:flex;gap:10px;margin-top:15px;justify-content:center;flex-wrap:wrap;';

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = '✓ Confirm';
  confirmBtn.style.cssText = 'background:#7ad;color:#000;border:none;padding:10px 20px;border-radius:5px;font-weight:bold;cursor:pointer;font-size:14px;';
  confirmBtn.addEventListener('click', () => {
    const op = G.players[G._deckRearrange.pidx];
    const peek = G._deckRearrangeCards.length;
    // Replace the top cards in the deck with the rearranged ones
    op.deck.splice(op.deck.length - peek, peek, ...G._deckRearrangeCards);
    addLog(`Happy Frog rearranged the top ${peek} cards of opponent's deck!`, 'good');
    document.body.removeChild(container);
    G._deckRearrange = null;
    G._deckRearrangeCards = null;
    renderGame();
    pushGameState();
  });
  buttonContainer.appendChild(confirmBtn);

  const resetBtn = document.createElement('button');
  resetBtn.textContent = '↺ Reset';
  resetBtn.style.cssText = 'background:#666;color:#fff;border:none;padding:10px 20px;border-radius:5px;font-weight:bold;cursor:pointer;font-size:14px;';
  resetBtn.addEventListener('click', () => {
    G._deckRearrangeCards = [...cards];
    selectedIdx = -1;
    renderCards();
  });
  buttonContainer.appendChild(resetBtn);

  container.appendChild(buttonContainer);
  document.body.appendChild(container);
}

/* ═══════════════════════════════════════════════════════
   GAME RENDERING
   ═══════════════════════════════════════════════════════ */
function renderGame() {
  if (!G || G.phase === 'mulligan') return;
  const ap = G.activePlayer, ep = 1 - ap;
  // In online mode, always render from the perspective of the local player
  const viewMe = (window.MP && MP.mode === 'online') ? MP.myIdx : ap;
  const viewOpp = 1 - viewMe;
  const active = G.players[ap], enemy = G.players[ep];
  const viewMeP = G.players[viewMe], viewOppP = G.players[viewOpp];
  const pt = G.pendingTarget;

  document.getElementById('turn-banner').textContent = T('tcg.game.turnBanner', { name: active.name, round: G.turn });
  document.getElementById('ko-score').textContent = T('tcg.game.koScore', { a: active.name, ka: active.koPoints, kb: enemy.koPoints, b: enemy.name });
  document.getElementById('gen-active').textContent = T('tcg.game.genActive', { name: viewMeP.name, n: viewMeP.generator.length });
  document.getElementById('gen-enemy').textContent = T('tcg.game.genActive', { name: viewOppP.name, n: viewOppP.generator.length });
  // Show name + KO count beside each party
  document.getElementById('active-label').textContent = viewMeP.name;
  document.getElementById('enemy-label').textContent = viewOppP.name;
  // KO badges next to parties
  const setKoBadge = (id, n) => { const el = document.getElementById(id); if (!el) return; el.textContent = n; el.style.display = ''; };
  setKoBadge('ko-badge-active', viewMeP.koPoints);
  setKoBadge('ko-badge-enemy', viewOppP.koPoints);
  document.getElementById('active-stats').textContent = T('tcg.game.handSupp', { n: viewMeP.hand.length, s: viewMeP.supporterPlayedThisTurn >= (viewMeP.supporterMax || 1) ? T('tcg.game.supp.yes') : T('tcg.game.supp.no') });
  document.getElementById('enemy-stats').textContent = T('tcg.game.handOnly', { n: viewOppP.hand.length });
  document.getElementById('active-deck-info').innerHTML = T('tcg.game.deckInfo', { deck: viewMeP.deck.length, blob: '<span class="blob-link" onclick="showBlobPile(' + viewMe + ')">Blob: ' + viewMeP.discard.length + ' 🗂</span>' });
  document.getElementById('enemy-deck-info').innerHTML = T('tcg.game.deckInfo', { deck: viewOppP.deck.length, blob: '<span class="blob-link" onclick="showBlobPile(' + viewOpp + ')">Blob: ' + viewOppP.discard.length + ' 🗂</span>' });

  // Pending hint
  const hintEl = document.getElementById('pending-hint'), cancelBtn = document.getElementById('cancel-pending-btn');
  const tcEl = document.getElementById('target-counter');
  if (pt) {
    if (pt.action === 'gambleRepeat') {
      hintEl.innerHTML = `${T('tcg.hint.gambleRepeat')} <button class="gamble-repeat-btn" onclick="confirmGambleRepeat(true)">↺ Repeat</button> <button class="gamble-repeat-btn" onclick="confirmGambleRepeat(false)">✕ Decline</button>`;
      hintEl.style.display = ''; cancelBtn.style.display = 'none';
      if (tcEl) tcEl.style.display = 'none';
    } else {
      const hints = { attachEnergy: T('tcg.hint.attachEnergy'), evolve: T('tcg.hint.evolve'), equipTool: T('tcg.hint.equipTool'), itemTarget: T('tcg.hint.itemTarget'), itemEnemyEffect: 'Select an enemy target', selectSingleTarget: T('tcg.hint.selectSingle'), selectMultiTarget: T('tcg.hint.selectMulti'), selectHealTargets: T('tcg.hint.selectHeal'), selectStallTargets: T('tcg.hint.selectStall'), postStallPick: 'Choose enemies to stall for 1 turn', abilityTarget: T('tcg.hint.ability'), ennardGeneratorBoost: T('tcg.hint.ennard'), classCardTarget: T('tcg.hint.classCard') };
      if (pt.ability === 'baby_trap_target') hints.abilityTarget = T('tcg.hint.babyTrap');
      if (pt.ability === 'ballora_steal') hints.abilityTarget = T('tcg.hint.balloraSteal');
      hintEl.textContent = hints[pt.action] || ''; hintEl.style.display = ''; cancelBtn.style.display = '';
      if (tcEl && ['selectMultiTarget', 'selectHealTargets', 'selectStallTargets', 'postStallPick'].includes(pt.action)) { tcEl.style.display = ''; tcEl.textContent = `${pt.selected?.length || 0}/${pt.needed}`; }
      else if (tcEl) tcEl.style.display = 'none';
    }
  } else { hintEl.style.display = 'none'; cancelBtn.style.display = 'none'; if (tcEl) tcEl.style.display = 'none'; }

  // Parties
  renderParty('party-enemy', viewOpp, pt);
  renderParty('party-active', viewMe, pt);
  // Class card zones
  renderClassZone('class-zone-enemy', viewOpp, true);
  renderClassZone('class-zone-active', viewMe, false);
  // Energy pool (only for the local player's perspective)
  renderEnergyPool(viewMe);
  // Hand
  renderHand(viewMe, pt);
  // Undo btn
  const undoBtn = document.getElementById('undo-btn'); if (undoBtn) undoBtn.style.display = (undoStack.length && !(window.MP && MP.mode === 'online')) ? '' : 'none';
  // Log
  const logEl = document.getElementById('game-log');
  if (logEl) logEl.innerHTML = G.log.slice(0, 25).map(e => `<div class="log-entry ${e.type}">${e.msg}</div>`).join('');
}

function renderParty(elId, pidx, pt) {
  const el = document.getElementById(elId); if (!el) return;
  el.innerHTML = '';
  G.players[pidx].party.forEach((slot, i) => el.appendChild(renderSlot(slot, pidx, i, pt)));
}

function renderSlot(slot, pidx, slotIdx, pt) {
  const div = document.createElement('div');
  const isEnemy = pidx !== G.activePlayer;
  if (!slot) {
    div.className = 'slot-card empty';
    div.innerHTML = '<div style="font-size:.6rem;color:#333;padding-top:55px">-</div>';
    return div;
  }
  const canEvo = !isEnemy && !slot.justPlaced && (
    (slot.card.type === 'endo' && G.players[pidx].hand.some(c => c.type === 'shell' && c.requiredEndo === slot.card.id)) ||
    (slot.card.type === 'shell' && G.players[pidx].hand.some(c => c.type === 'shell' && (c.requiredShell === slot.card.id || (c.requiredShellAny && c.requiredShellAny.includes(slot.card.id)))))
  );

  let cls = 'slot-card';
  if (slot.stalledTurns > 0) cls += ' stalled';
  else if (slot.awake) cls += ' awake';
  else cls += ' standby';
  if (canEvo) cls += ' can-evolve';

  const selMulti = pt && ['selectMultiTarget', 'selectStallTargets', 'postStallPick'].includes(pt.action) && isEnemy && pt.selected?.some(s => s.slotIdx === slotIdx);
  if (selMulti) cls += ' selected-target';
  const isEnemyAbility = pt?.action === 'abilityTarget' && ['baby_trap_target', 'ballora_steal', 'molten_steal', 'toy_freddy_stall', 'funtime_foxy_showstopper', 'plushtrap_plush_trap', 'live_wire', 'strobe_effect', 'blob_drain', 'moon_bedtime', 'burntrap_ignite', 'mxes_override', 'glamrock_chica_beat_drop'].includes(pt?.ability);
  const isClassEnemyTarget = pt?.action === 'classCardTarget' && ['class_shadow_drain', 'class_jacko_burn', 'class_phantom_stall'].includes(pt?.ability);
  const isClassAllyTarget = pt?.action === 'classCardTarget' && ['class_toy_heal', 'class_withered_def', 'class_rockstar_discount'].includes(pt?.ability);
  if (isEnemy && pt && (['selectSingleTarget', 'selectMultiTarget', 'selectStallTargets', 'itemEnemyEffect'].includes(pt.action) || isEnemyAbility || isClassEnemyTarget)) cls += ' enemy-target';
  const isEquipToolValid = pt?.action === 'equipTool' && (!pt.card.toolTarget || (slot && pt.card.toolTarget.includes(slot.card.id)));
  if (!isEnemy && pt && ((['selectHealTargets', 'evolve', 'attachEnergy', 'ennardGeneratorBoost', 'removeBurnTarget'].includes(pt.action)) || (pt.action === 'equipTool' && isEquipToolValid) || (pt.action === 'abilityTarget' && !isEnemyAbility) || isClassAllyTarget)) cls += ' ally-target';

  div.className = cls; div.onclick = () => clickSlot(pidx, slotIdx);

  const hpPct = clamp(slot.hp / slot.card.hp * 100, 0, 100);
  const defStr = slot.defense ? ` 🛡${slot.defense.reduction}×${slot.defense.turnsLeft}T` : '';
  const stallStr = slot.stalledTurns > 0 ? ` ⚡${slot.stalledTurns}T` : '';
  const burnStr = slot.burn > 0 ? ` 🔥${slot.burn}` : '';
  const trapStr = slot.plushTrap ? ' 🪤' : '';
  const atkIcon = slot.attackedThisTurn ? ' ✓' : '' + (slot.extraAttacks > 0 ? ` ×${slot.extraAttacks + 1}` : '');
  const willIcon = slot.tools.some(t => t.passive === 'william') ? ' 👤' : '';
  const eMeta = ENERGY_META[slot.card.energyType];
  const toolNames = slot.tools.map(t => t.name).join(', ');

  div.innerHTML = `
    <div class="sc-stage">${slot.card.type === 'endo' ? T('tcg.game.slotStage.endo') : T('tcg.game.slotStage.shell')}</div>
    <div class="sc-energy-type" style="color:${eMeta?.color || '#888'}">${eMeta?.sym || ''}</div>
    <img src="${slot.card.img}" onerror="this.src='${GENERIC}'" />
    <div class="sc-name">${slot.card.name}${burnStr}${willIcon}</div>
    <div class="sc-hp${hpPct < 30 ? ' low' : ''}">${slot.hp}/${slot.card.hp} HP</div>
    <div class="sc-elec">⚡ ${slot.elec}/${slot.card.wakeThreshold === 0 ? '∞' : slot.card.wakeThreshold}</div>
    <div class="sc-status">${slot.stalledTurns > 0 ? T('tcg.game.slotStalled') : slot.awake ? T('tcg.game.slotAwake') : T('tcg.game.slotStandby')}${defStr}${stallStr}${atkIcon}</div>
    ${toolNames ? `<div class="sc-tools">🔧 ${toolNames}</div>` : ''}
    ${canEvo ? `<div style="font-size:.6rem;color:var(--green-text)">${T('tcg.game.canEvolve')}</div>` : ''}
  `;
  return div;
}

function renderEnergyPool(pidx) {
  const el = document.getElementById('energy-pool-area'); if (!el) return;
  const p = G.players[pidx];
  el.innerHTML = `<div class="pool-header">${T('tcg.game.pool', { n: p.energyPool })}</div><div class="pool-energies"></div>`;
  const row = el.querySelector('.pool-energies');
  const btn = document.createElement('button'); btn.className = 'pool-energy-btn';
  btn.disabled = p.energyPool <= 0;
  btn.style.borderColor = p.energyPool > 0 ? '#aad' : '#333';
  btn.innerHTML = `<span class="pe-symbol" style="color:#aad">⚡</span><span class="pe-count" style="color:${p.energyPool > 0 ? '#aad' : '#555'}">${p.energyPool}</span>`;
  btn.title = T('tcg.game.poolAttach');
  btn.onclick = () => startAttachEnergy();
  row.appendChild(btn);
}

function renderHand(pidx, pt) {
  const p = G.players[pidx];
  const el = document.getElementById('hand-cards'); if (!el) return;
  const hcEl = document.getElementById('hand-count'); if (hcEl) hcEl.textContent = p.hand.length;
  el.innerHTML = '';
  const locked = pt && ['selectSingleTarget', 'selectMultiTarget', 'selectStallTargets', 'selectHealTargets', 'evolve', 'equipTool', 'gambleRepeat'].includes(pt.action);
  p.hand.forEach((card, handIdx) => {
    const div = document.createElement('div');
    const canPhantom = card.phantomSummon && (p.hand.some((c, i) => c.type === 'energy' && c.energyType === 'phantom_agony' && i !== handIdx) || p.party.some(s => s?.tools.some(t => t.passive === 'william')));
    const canShadow = card.shadowSummon && p.party.some(s => s === null) && p.hand.some((c, i) => c.type === 'energy' && (c.energyType === 'agony' || c.energyType === 'phantom_agony') && i !== handIdx);
    const canBlob = card.blobSummon && p.party.some(s => s === null) && p.discard.length >= (card.blobSummonCost || 5);
    div.className = `hand-card type-${card.type}${locked ? ' locked' : ''}${canPhantom ? ' can-summon-phantom' : ''}${canShadow ? ' can-summon-phantom' : ''}${canBlob ? ' can-summon-blob' : ''}`;
    const eMeta = ENERGY_META[card.energyType];
    div.innerHTML = `
      <img src="${card.img}" onerror="this.src='${GENERIC}'" />
      <div class="hc-name">${card.name}</div>
      <div class="hc-type">${card.type}${card.class && card.class !== 'neutral' ? ' · ' + card.class : ''}</div>
      ${eMeta ? `<div class="hc-energy" style="color:${eMeta.color}">${eMeta.sym}</div>` : ''}
      ${card.blobSummon ? `<div class="hc-blob-cost" style="color:${canBlob ? '#00e5ff' : '#666'}" title="Needs ${card.blobSummonCost || 5} Blob cards">🫧${card.blobSummonCost || 5}</div>` : ''}
    `;
    div.onclick = () => showCardInfo(card, null, -1, pidx, true, handIdx);
    el.appendChild(div);
  });
}

function addLog(msg, type = '') { if (!G) return; G.log.unshift({ msg, type }); if (G.log.length > 60) G.log.pop(); }

/* ═══════════════════════════════════════════════════════
   CLASS CARD ZONE
   ═══════════════════════════════════════════════════════ */
function renderClassZone(elId, pidx, isEnemy) {
  const el = document.getElementById(elId); if (!el) return;
  const p = G.players[pidx];
  const cc = p.classCard;
  if (!cc) { el.innerHTML = ''; return; }

  const isPassive = cc.oncePer === 'passive';
  const isMyTurn = G.activePlayer === pidx;
  const alreadyUsed = !isPassive && (p.classCardUsed || p.classCardUsedForever);
  const canUse = !isPassive && !isEnemy && isMyTurn && !alreadyUsed &&
    !(window.MP && MP.mode === 'online' && G.activePlayer !== MP.myIdx);

  const clsCols = { classic: '#7ad', toy: '#4b8', withered: '#c84', phantom: '#b7d', nightmare: '#d44', jacko: '#e84', shadow: '#66b', funtime: '#47d', scrap: '#a62', rockstar: '#d4af37', glitch: '#7b00ff', glamrock: '#00e5ff' };
  const col = clsCols[cc.class] || '#aaa';
  const usedLabel = isPassive ? T('tcg.game.classCardPass') : p.classCardUsedForever ? T('tcg.game.classCardDone') : p.classCardUsed ? T('tcg.game.classCardUsed') : '';

  el.innerHTML = `
    <div class="class-zone-card${alreadyUsed ? ' used' : ''}" style="border-color:${col}88;cursor:pointer" onclick="_showClassCardInfo(${pidx})">
      <img src="${cc.img}" onerror="this.src='${GENERIC}'" />
      <div class="class-zone-name" style="color:${col}">${cc.name}</div>
      <div class="class-zone-effect">${cc.effectDesc}</div>
      ${usedLabel ? `<div class="class-zone-used" style="${isPassive ? 'color:' + col : ''}">${usedLabel}</div>` : ''}
    </div>
    ${canUse ? `<button class="tcg-btn small" style="margin-top:4px;font-size:0.65rem;padding:2px 8px" onclick="event.stopPropagation();useClassCard(${pidx})">${T('tcg.game.classCardUse')}</button>` : ''}
  `;
}

let _classInfoShownFor = null;
function _closeClassCardInfo(pidx) {
  // Close info box AND cancel/clear any pending class card action or open search
  const box = document.getElementById('class-card-info');
  if (box) { box.style.display = 'none'; _classInfoShownFor = null; }
  if (pendingSearch) closeSearch();           // close search + reset classCardUsed
  else if (window.G && G && G.pendingTarget?.action === 'classCardTarget') cancelPending(); // cancel target
}
function _showClassCardInfo(pidx) {
  const box = document.getElementById('class-card-info'); if (!box) return;
  // Toggle: clicking the same player's card again closes the box
  if (_classInfoShownFor === pidx && box.style.display !== 'none') {
    box.style.display = 'none'; _classInfoShownFor = null; return;
  }
  const cc = G.players[pidx]?.classCard; if (!cc) return;
  _classInfoShownFor = pidx;
  const per = cc.oncePer === 'passive' ? '★ Passive' : cc.oncePer === 'game' ? '1×/game' : cc.oncePer === 'free' ? '∞/turn' : '1×/turn';
  const col = ({ classic: '#7ad', toy: '#4b8', withered: '#c84', phantom: '#b7d', nightmare: '#d44', jacko: '#e84', shadow: '#66b', funtime: '#47d', scrap: '#a62', rockstar: '#d4af37', glitch: '#7b00ff', glamrock: '#00e5ff' })[cc.class] || '#aaa';
  box.innerHTML =
    `<button onclick="_closeClassCardInfo(${pidx})" style="position:absolute;top:4px;right:6px;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:.9rem">✕</button>`
    + `<span style="font-weight:700;color:${col}">${cc.name}</span> <span style="color:var(--text-muted);font-size:.6rem">${per}</span><br>`
    + `<span style="color:var(--text-muted)">${cc.effectDesc}</span>`;
  box.style.display = '';
}

function useClassCard(pidx) {
  if (window.MP && MP.mode === 'online' && G.activePlayer !== MP.myIdx) return;
  const p = G.players[pidx];
  const cc = p.classCard;
  if (!cc || G.activePlayer !== pidx) return;
  if (cc.oncePer === 'passive') { addLog(T('tcg.log.classCardPassive'), 'info'); return; }
  if (p.classCardUsed || p.classCardUsedForever) { addLog(T('tcg.log.classCardUsed'), 'info'); return; }

  const eid = cc.effectId;
  G._lastPlayedCard = { card: cc, playerIdx: pidx, seq: (G._lastPlayedCard?.seq || 0) + 1 };

  // Effects that need an allied slot target
  if (['class_toy_heal', 'class_withered_def', 'class_rockstar_discount'].includes(eid)) {
    G.pendingTarget = { action: 'classCardTarget', ability: eid, pidx };
    addLog(T('tcg.log.classSelectAlly', { card: cc.name }), 'info');
    renderGame(); pushGameState(); return;
  }
  // Effects that need an enemy slot target
  if (['class_shadow_drain', 'class_jacko_burn', 'class_phantom_stall'].includes(eid)) {
    G.pendingTarget = { action: 'classCardTarget', ability: eid, pidx };
    addLog(T('tcg.log.classSelectEnemy', { card: cc.name }), 'info');
    renderGame(); pushGameState(); return;
  }
  // Instant effects
  applyClassCardEffect(pidx, eid, null);
}

function applyClassCardEffect(pidx, effectId, targetInfo) {
  const p = G.players[pidx];
  const opp = G.players[1 - pidx];
  const cc = p.classCard;

  switch (effectId) {
    case 'class_classic_draw': {
      const c = p.deck.pop(); if (c) p.hand.push(c);
      addLog(T('tcg.log.classDraw', { name: p.name, card: cc.name, n: c ? 1 : 0 }), 'info');
      break;
    }
    case 'class_nightmare_aoe': {
      let hit = 0;
      opp.party.forEach(slot => {
        if (!slot || slot.awake) return;
        slot.hp = Math.max(0, slot.hp - 15); hit++;
        addLog(`${slot.card.name} took 15 damage.`);
        checkKO(1 - pidx, slot);
      });
      addLog(T('tcg.log.classNightmareAoe', { name: p.name, card: cc.name, n: hit }), 'info');
      checkWin();
      break;
    }
    case 'class_funtime_draw': {
      if (!p.hand.length) { addLog(T('tcg.log.classNoHand'), 'info'); return; }
      p.classCardUsed = true;
      if (cc.oncePer === 'game') p.classCardUsedForever = true;
      G.pendingTarget = null;
      startDeckSearch(T('tcg.search.funtime'), [...p.hand], 1, pidx, (sel) => {
        if (!sel.length) { addLog(T('tcg.log.classNoneDiscarded', { card: cc.name }), 'info'); renderGame(); return; }
        const discCard = sel[0]; const i = p.hand.indexOf(discCard); if (i >= 0) p.hand.splice(i, 1);
        p.discard.push(discCard);
        let drew = 0;
        for (let j = 0; j < 2; j++) { const dc = p.deck.pop(); if (dc) { p.hand.push(dc); drew++; } }
        addLog(T('tcg.log.classFuntimeDiscarded', { name: p.name, card: cc.name, discarded: discCard.name, n: drew }), 'info');
        syncEnnardMoveset(pidx);
        renderGame(); pushGameState();
      });
      return;
    }
    case 'class_toy_heal': {
      if (targetInfo) {
        const slot = G.players[pidx].party[targetInfo.slotIdx];
        if (!slot) { addLog(T('tcg.log.classSelectAlly', { card: cc.name }), 'info'); return; }
        let heal = 10;
        if (p.energyPool >= 1 && confirm('Discard 1⚡ from the Pool to heal 30 instead of 10?')) {
          p.energyPool -= 1; p.discard.push({ id: 'energy_spent', name: 'Energy', type: 'energy', energyType: 'generic', img: GENERIC }); heal = 30;
        }
        slot.hp = Math.min(slot.card.hp, slot.hp + heal);
        addLog(T('tcg.log.classHeal', { name: p.name, card: cc.name, slot: slot.card.name, n: heal }), 'info');
      }
      break;
    }
    case 'class_withered_def': {
      if (targetInfo) {
        const slot = G.players[pidx].party[targetInfo.slotIdx];
        if (slot && slot.card.class === 'withered') {
          slot.defense = { reduction: 15, turnsLeft: 1 };
          addLog(T('tcg.log.classWitheredDef', { name: p.name, card: cc.name, slot: slot.card.name }), 'info');
        } else { addLog(T('tcg.log.classNeedWithered'), 'info'); return; }
      }
      break;
    }
    case 'class_jacko_burn': {
      if (targetInfo) {
        const slot = G.players[1 - pidx].party[targetInfo.slotIdx];
        if (!slot) { addLog(T('tcg.log.classNeedEnemy'), 'info'); return; }
        if (p.energyPool < 1) { addLog(T('tcg.log.classNoEnergyPool'), 'info'); return; }
        p.energyPool -= 1;
        p.discard.push({ id: 'energy_spent', name: 'Energy', type: 'energy', energyType: 'generic', img: GENERIC });
        slot.burn = (slot.burn || 0) + 1;
        addLog(T('tcg.log.classJackoBurn', { name: p.name, card: cc.name, slot: slot.card.name }), 'info');
      }
      break;
    }
    case 'class_shadow_drain': {
      if (targetInfo) {
        const slot = G.players[1 - pidx].party[targetInfo.slotIdx];
        if (slot && slot.elec > 0) {
          slot.elec = Math.max(0, slot.elec - 1); checkAwake(slot);
          addLog(T('tcg.log.classShadowDrain', { name: p.name, card: cc.name, slot: slot.card.name }), 'info');
        } else { addLog(T('tcg.log.classShadowNoDrain'), 'info'); return; }
      }
      break;
    }
    case 'class_phantom_stall': {
      if (targetInfo) {
        const slot = G.players[1 - pidx].party[targetInfo.slotIdx];
        if (!slot) { addLog(T('tcg.log.classNeedEnemy'), 'info'); return; }
        if (p.energyPool < 1) { addLog(T('tcg.log.classNoEnergyPool'), 'info'); return; }
        p.energyPool -= 1;
        p.discard.push({ id: 'energy_spent', name: 'Energy', type: 'energy', energyType: 'generic', img: GENERIC });
        slot.stalledTurns = Math.max(slot.stalledTurns, 2);
        addLog(T('tcg.log.classPhantomStall', { name: p.name, card: cc.name, slot: slot.card.name }), 'info');
      }
      break;
    }
    case 'class_scrap_revive': {
      const emptySlot = G.players[pidx].party.findIndex(s => !s);
      if (emptySlot === -1) { addLog(T('tcg.log.classNoEmptySlot'), 'info'); return; }
      const scraps = p.discard.filter(c => c.type === 'shell' && c.class === 'scrap');
      if (!scraps.length) { addLog(T('tcg.log.classNoBlobScraps'), 'info'); return; }
      p.classCardUsed = true;
      if (cc.oncePer === 'game') p.classCardUsedForever = true;
      G.pendingTarget = null;
      startDeckSearch('Choose a Scrap to revive (Remnants)', scraps, 1, pidx, (sel) => {
        const toRevive = sel[0];
        if (toRevive) {
          const i = p.discard.indexOf(toRevive);
          if (i >= 0) p.discard.splice(i, 1);
          const rs = newSlot(toRevive); rs.hp = rs.card.hp;
          G.players[pidx].party[emptySlot] = rs;
          addLog(T('tcg.log.classRevived', { name: p.name, card: cc.name, revived: toRevive.name }), 'info');
          syncEnnardMoveset(pidx);
        }
        renderGame(); pushGameState();
      });
      return;
    }
    case 'class_rockstar_discount': {
      if (!targetInfo) { addLog('Select an ally to receive discount.', 'info'); return; }
      if (!p.hand.length) { addLog('No cards in hand to discard for Rockstar Discount.', 'info'); return; }
      const slot = G.players[pidx].party[targetInfo.slotIdx];
      if (!slot) { addLog('Invalid ally target.', 'info'); return; }
      // Let player choose which card to discard
      startDeckSearch('Choose a card to discard for Discount', p.hand, 1, G.activePlayer, (sel) => {
        if (sel && sel[0]) {
          const discarded = sel[0];
          const idx = p.hand.indexOf(discarded);
          if (idx >= 0) p.hand.splice(idx, 1);
          p.discard.push(discarded);
          slot.costReductionThisTurn = Math.max(slot.costReductionThisTurn || 0, 1);
          addLog(`${slot.card.name} gets -1 attack cost this turn (${discarded.name} discarded).`, 'good');
          p.classCardUsed = true;
          if (cc.oncePer === 'game') p.classCardUsedForever = true;
          G.pendingTarget = null;
          renderGame();
          pushGameState();
        }
      });
      return;
    }
    case 'class_mimic_cycle': {
      const activeShellIdxs = p.party.map((s, i) => s && s.card.class === 'mimic' && s.card.type === 'shell' ? i : -1).filter(i => i >= 0);
      if (!activeShellIdxs.length) { addLog('Imitation Protocol: no Mimic shell in play to swap!', 'info'); return; }
      const mimicInHand = p.hand.filter(c => c.class === 'mimic' && c.type === 'shell');
      if (!mimicInHand.length) { addLog('Imitation Protocol: no Mimic shells in hand!', 'info'); return; }
      G.pendingTarget = null;
      const doMimicSwap = (newShell, slotIdx) => {
        const slot = p.party[slotIdx];
        const oldCard = slot.card;
        const hi = p.hand.findIndex(c => c.uid === newShell.uid); if (hi >= 0) p.hand.splice(hi, 1);
        p.hand.push({ ...oldCard, uid: `${oldCard.id}_${Date.now()}` });
        slot.card = newShell;
        syncMimicMoveset(pidx);
        addLog(`${p.name}: Imitation Protocol — swapped ${oldCard.name} for ${newShell.name}! (${oldCard.name} returned to hand)`, 'good');
        G.pendingTarget = null; renderGame(); pushGameState();
      };
      // Step 1: choose which shell from hand to bring in
      startDeckSearch('Imitation Protocol — choose a Mimic shell from hand to swap in', mimicInHand, 1, pidx, (sel) => {
        if (!sel.length) { addLog('Imitation Protocol cancelled.', 'info'); renderGame(); return; }
        const newShell = sel[0];
        // Step 2: if only one party slot, swap immediately; otherwise let the player choose which to replace
        if (activeShellIdxs.length === 1) {
          doMimicSwap(newShell, activeShellIdxs[0]);
        } else {
          const partyShells = activeShellIdxs.map(i => p.party[i].card);
          startDeckSearch('Imitation Protocol — choose which Mimic shell in play to replace', partyShells, 1, pidx, (sel2) => {
            if (!sel2.length) { addLog('Imitation Protocol cancelled.', 'info'); renderGame(); return; }
            const slotIdx = activeShellIdxs.find(i => p.party[i].card === sel2[0]);
            doMimicSwap(newShell, slotIdx);
          });
        }
      });
      return;
    }
    case 'class_glamrock_boost': {
      if (!p.hand.length) { addLog('Neon Attraction: no cards in hand to discard.', 'info'); return; }
      p.classCardUsed = true;
      if (cc.oncePer === 'game') p.classCardUsedForever = true;
      G.pendingTarget = null;
      startDeckSearch('Neon Attraction — discard 1 card from your hand', [...p.hand], 1, pidx, (sel) => {
        if (!sel.length) { addLog('Neon Attraction cancelled.', 'info'); p.classCardUsed = false; renderGame(); return; }
        sel.forEach(c => { const i = p.hand.indexOf(c); if (i >= 0) p.hand.splice(i, 1); p.discard.push(c); });
        for (let i = 0; i < 2; i++) drawCardImmediate(pidx);
        p.energyPool++;
        addLog(`${p.name}: Neon Attraction — discarded ${sel[0].name}, drew 2 cards and gained 1 Energy!`, 'good');
        G.pendingTarget = null; renderGame(); pushGameState();
      });
      return;
    }
    case 'class_ruined_energize': {
      if (!p.hand.length) { addLog("Ruined Signal: no cards in hand to discard.", 'info'); return; }
      p.classCardUsed = true;
      if (cc.oncePer === 'game') p.classCardUsedForever = true;
      G.pendingTarget = null;
      startDeckSearch("Ruined Signal — discard 1 card from your hand", [...p.hand], 1, pidx, (sel) => {
        if (!sel.length) { addLog("Ruined Signal cancelled.", 'info'); p.classCardUsed = false; renderGame(); return; }
        const c = sel[0]; const i = p.hand.indexOf(c); if (i >= 0) p.hand.splice(i, 1); p.discard.push(c);
        drawEnergyToPool(pidx, 2);
        addLog(`${p.name}: Ruined Signal — discarded ${c.name}, gained 2 energy from Generator!`, 'good');
        G.pendingTarget = null; renderGame(); pushGameState();
      });
      return;
    }
  }

  p.classCardUsed = true;
  if (cc.oncePer === 'game') p.classCardUsedForever = true;
  G.pendingTarget = null;
  renderGame();
  pushGameState();
}

/* ═══════════════════════════════════════════════════════
   ONLINE MULTIPLAYER HELPERS
   ═══════════════════════════════════════════════════════ */
async function pushGameState() {
  if (!window.MP || MP.mode !== 'online' || !MP.db) return;
  G._seq = (G._seq || 0) + 1;
  await MP.db.from('tcg_rooms').update({ game_state: G }).eq('id', MP.roomId);
}

let _lastShownCardSeq = 0;
function pullGameState(gs) {
  if (!gs) return;
  const prevActive = G ? G.activePlayer : -1;
  const prevPhase = G ? G.phase : null;
  G = gs;

  // Always keep M2 moveset in sync with Mimic shells in both Blob Piles
  syncMimicMoveset(0); syncMimicMoveset(1);

  // Show opponent's played card if it's new
  if (G._lastPlayedCard && G._lastPlayedCard.playerIdx !== MP.myIdx && G._lastPlayedCard.seq > _lastShownCardSeq) {
    _lastShownCardSeq = G._lastPlayedCard.seq;
    openCardInfoPanel(G._lastPlayedCard.card);
  }

  if (G.phase === 'play') {
    if (G.winner) { showResult(); return; } // winner set mid-play (burn, etc.)
    if (prevPhase !== 'play') {
      // Mulligan → play: run endo-placement safety net in case mpBeginGame missed them
      G.players.forEach(p => {
        p.hand.filter(c => c.type === 'endo').forEach(endo => {
          const slot = p.party.findIndex(s => !s);
          if (slot >= 0) { p.party[slot] = newSlot(endo); p.hand = p.hand.filter(h => h.uid !== endo.uid); }
        });
      });
      _showScreenRaw('game'); renderGame();
    } else if (G.activePlayer === MP.myIdx && prevActive !== MP.myIdx) {
      showYourTurnBanner(); // only fires on real turn transition via Realtime
      beginTurn();
    } else if (G.activePlayer !== MP.myIdx) {
      // Opponent's turn - refresh view (their action arrived)
      renderGame();
    }
    // else: already my turn, no handoff (class card push etc.) - skip
  } else if (G.phase === 'dice') {
    _showScreenRaw('dice');
    if (!_mpDiceRolling) renderDiceFromState(); // skip if mid-animation

  } else if (G.phase === 'mulligan' || G.phase === 'setup') {
    _showScreenRaw('mulligan');
    const mt = G._mulliganTurn; // whose mulligan it currently is
    if (mt === MP.myIdx) {
      // It's my turn to mulligan
      if (!_mpMulliganShown) {
        _mpMulliganShown = true;
        renderMulligan(mt);
      }
      // else: already rendered, don't rebuild (player is mid-decision)
    } else {
      // Opponent is mulliganing - show wait screen
      mpShowMulliganWait(mt);
    }
  } else if (G.phase === 'result' || G.winner) {
    showResult();
  }
}
// Render the correct dice step based on current G.dice state (for online sync)
function renderDiceFromState() {
  const d = G.dice;
  if (!d) return;
  if (d.chooserIdx !== null && d.chooserIdx !== undefined) renderDiceScreen('result');
  else if (d.roll !== null && d.roll !== undefined) renderDiceScreen('result');
  else if (d.guess !== null && d.guess !== undefined) renderDiceScreen('roll');
  else renderDiceScreen('guess');
}

/* ═══════════════════════════════════════════════════════
   SCREENS
   ═══════════════════════════════════════════════════════ */
function _showScreenRaw(id) { ['lobby', 'dice', 'mulligan', 'game', 'result'].forEach(s => { const el = document.getElementById('screen-' + s); if (el) el.style.display = s === id ? '' : 'none'; }); }
function showScreen(id) {
  if (id === 'dice') location.hash = 'dice';           // nova entrada no histórico
  else if (id === 'lobby') location.hash = 'lobby/' + _currentTab;
  else history.replaceState(null, '', '#' + id);       // mulligan/game/result: sem entrada extra
  _showScreenRaw(id);
}
async function showResult() {
  showScreen('result');
  window.scrollTo(0, 0); document.getElementById('tcg-root')?.scrollTo(0, 0);
  document.getElementById('result-title').textContent = G.winner ? T('tcg.result.win', { name: G.winner.name }) : T('tcg.result.draw');
  document.getElementById('result-details').innerHTML = G.players.map(p => `<div>${p.name}: ${T('tcg.result.ko', { n: p.koPoints, s: p.koPoints !== 1 ? 's' : '' })}</div>`).join('');

  const ptsEl = document.getElementById('result-points');
  if (ptsEl && typeof window.tcgAwardMatchPoints === 'function') {
    try {
      const result = await window.tcgAwardMatchPoints(G.winner?.name?.toLowerCase());
      if (result) {
        ptsEl.style.display = '';
        ptsEl.innerHTML = result.isWinner
          ? `⭐ +${result.pts} points! (Playing +5, Winning +5)`
          : `⭐ +${result.pts} points for playing!`;
      } else {
        ptsEl.style.display = 'none';
      }
    } catch (e) { ptsEl.style.display = 'none'; }
  }
}
function goLobby() { closeCardInfo(); location.hash = 'lobby/' + _currentTab; _showScreenRaw('lobby'); populateDeckSelects(); }
function rematchGame() { if (_startConfig) initGame(_startConfig); }
function confirmConcede() {
  if (confirm(T('tcg.result.concede'))) {
    const opIdx = (window.MP && MP.mode === 'online') ? 1 - MP.myIdx : 1 - G.activePlayer;
    G.winner = G.players[opIdx];
    showResult();
    pushGameState();
  }
}

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.code === 'Space' && G && G.phase === 'play') {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
    e.preventDefault();
    // If a pending action is active (e.g. attach energy stuck), cancel it first
    if (G.pendingTarget) { cancelPending(); return; } // properly resets ability used flag
    endTurn();
  }
});

function _tcgRestoreFromHash(hash) {
  const TABS = ['play','deck','online','collection','booster','trade'];
  const GAME_SCREENS = ['dice','mulligan','game','result'];
  if (hash.startsWith('lobby/') || hash === 'lobby' || !hash) {
    const rest = hash.startsWith('lobby/') ? hash.slice(6) : '';
    const parts = rest.split('/');
    const tab = TABS.includes(parts[0]) ? parts[0] : 'play';
    const subscreen = parts[1];
    const waitEl = document.getElementById('tcg-mp-waiting');
    const isWaiting = waitEl && waitEl.style.display !== 'none';
    if (subscreen === 'waiting') {
      const lobbyWrap = document.getElementById('tab-content-online');
      if (lobbyWrap) lobbyWrap.style.display = 'none';
      if (waitEl) waitEl.style.display = '';
      _showScreenRaw('lobby');
      _currentTab = 'online';
    } else {
      if (isWaiting && typeof mpLeaveWaiting === 'function') mpLeaveWaiting();
      _showScreenRaw('lobby');
      _switchTabRaw(tab);
    }
  } else if (GAME_SCREENS.includes(hash)) {
    _showScreenRaw(hash);
  } else {
    _showScreenRaw('lobby');
    _switchTabRaw('play');
  }
}
window.addEventListener('hashchange', () => {
  _tcgRestoreFromHash(location.hash.replace(/^#/, ''));
});

document.addEventListener('DOMContentLoaded', () => {
  validateDecks();
  populateDeckSelects();
  initCloudDecks(); // load cloud decks if already logged in (fire-and-forget)

  // Restore screen from URL hash on load
  const hash = location.hash.replace(/^#/, '');
  const TABS = ['play','deck','online','collection','booster','trade'];
  let initScreen = 'lobby', initTab = 'play';
  if (hash.startsWith('lobby/')) {
    const parts = hash.slice(6).split('/');
    initTab = TABS.includes(parts[0]) ? parts[0] : 'play';
  } else if (hash && ['dice','mulligan','game','result'].includes(hash)) {
    initScreen = hash;
  }
  history.replaceState(null, '', initScreen === 'lobby' ? '#lobby/' + initTab : '#' + initScreen);
  _showScreenRaw(initScreen);
  _switchTabRaw(initTab);
  // Apply translations to all static elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (el.dataset.i18n) {
      const val = T(el.dataset.i18n);
      if (val.includes('<') && val.includes('>')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = T(el.dataset.i18nPlaceholder);
  });
});