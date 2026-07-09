/* ═══════════════════════════════════════════════════════════════
   mp-chat.js  –  Real-time in-game chat for Guess Who & Party
   ═══════════════════════════════════════════════════════════════ */

(function () {
  const _HATE_RX = [
    /n[i1!|o0][g9q]{1,2}[ae3@*4]r?/i,
    /n[i1!|o0][g9q]{2,}[@a4]/i,
    /f[a@4][g9]{1,2}[o0][t7]?s?/i, /\bf[a@4][g9]s?\b/i,
    /tr[a@4]n+[iy1][e3]?/i,
    /\bd[yi1]k[e3]s?\b/i,
    /\b[ck][u0v@*][n*][t*]s?\b/i,
    /\bc[o0]{2}n\b/i, /\bsp[i1][ck]\b/i, /\bk[i1]k[e3]s?\b/i,
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
    /\bch[i1!]ld\s*p[o0]rn[o0]gr[a4]ph[yi!e]\b/i,
  ];
  function _norm(s) {
    return s.replace(/\|</g, 'k').replace(/\/\//g, 'n').replace(/\(\)/g, 'o').replace(/\|3/g, 'b');
  }
  function _hate(msg) { const t = _norm(msg); return _HATE_RX.some(p => p.test(t)); }
  window.mpChatContainsHate = _hate;
  function _esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  let _db = null;
  let _sub = null;
  let _poll = null;
  let _roomId = null;
  let _roomType = null;
  let _username = null;
  let _msgCount = 0;
  let _open = false;
  let _unread = 0;
  let _gifOpen = false;
  let _gifTimeout = null;
  let _replyingTo = null; // { username, text }
  let _askTargets = null; // [{ slot, name }] - eligible ask targets, or null if asking disabled
  let _asking = null;     // { slot, name } - target chosen while composing a question
  let _containerId = null; // if set, render embedded inside this element instead of floating

  function _getDb() {
    if (_db) return _db;
    if (window.MP?.db) { _db = window.MP.db; return _db; }
    const cfg = window.FNAF_CONFIG || {};
    if (typeof supabase !== 'undefined' && cfg.SUPABASE_URL) {
      if (!window.MP) window.MP = {};
      _db = window.MP.db = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
      return _db;
    }
    return null;
  }

  // ── Public API ──────────────────────────────────────────────
  // containerId (optional): if given, the chat renders embedded inside that
  // element (always open, no floating toggle) instead of as a floating widget.
  window.initMpChat = function (roomId, roomType, username, containerId) {
    if (_roomId === roomId && document.getElementById('mp-chat-widget')) return;
    stopMpChat();
    _roomId = roomId;
    _roomType = roomType;
    _username = username || 'Player';
    _containerId = containerId || null;
    _msgCount = 0;
    _unread = 0;
    _open = !!_containerId;
    _gifOpen = false;
    _replyingTo = null;
    _askTargets = null;
    _asking = null;

    _renderWidget();
    _subscribeChat();
    _loadHistory();
  };

  window.stopMpChat = function () {
    _roomId = null;
    _roomType = null;
    if (_sub) { try { _sub.unsubscribe(); } catch (e) { } _sub = null; }
    if (_poll) { clearInterval(_poll); _poll = null; }
    if (_gifTimeout) { clearTimeout(_gifTimeout); _gifTimeout = null; }
    const w = document.getElementById('mp-chat-widget');
    if (w) w.remove();
    _db = null;
  };

  // ── Widget rendering ────────────────────────────────────────
  function _renderWidget() {
    let w = document.getElementById('mp-chat-widget');
    if (w) w.remove();
    const embedded = !!_containerId;
    w = document.createElement('div');
    w.id = 'mp-chat-widget';
    w.className = embedded ? 'mpc-widget mpc-embedded' : 'mpc-widget';
    w.innerHTML = `
      ${embedded ? '' : `<button class="mpc-toggle" id="mpc-toggle" onclick="window._mpChatToggle()">
        💬 Chat <span class="mpc-badge" id="mpc-badge" style="display:none">0</span>
      </button>`}
      <div class="mpc-box" id="mpc-box" style="display:${embedded ? 'flex' : 'none'}">
        ${embedded ? '' : `<div class="mpc-header">
          💬 Chat
          <button class="mpc-close" onclick="window._mpChatToggle()">✕</button>
        </div>`}
        <div class="mpc-msgs" id="mpc-msgs"></div>
        <div class="mpc-gif-picker" id="mpc-gif-picker" style="display:none">
          <input class="mpc-gif-search" id="mpc-gif-search" type="text" placeholder="🔍 Search GIFs…" autocomplete="off" />
          <div class="mpc-gif-grid" id="mpc-gif-grid"></div>
          <div class="mpc-tenor-attr">Powered by KLIPY</div>
        </div>
        <div class="mpc-target-row" id="mpc-target-row" style="display:none"></div>
        <div class="mpc-reply-preview" id="mpc-reply-preview" style="display:none"></div>
        <div class="mpc-footer">
          <button class="mpc-ask-btn" id="mpc-ask-btn" style="display:none" title="Ask a question">❓</button>
          <input id="mpc-input" class="mpc-input" type="text" placeholder="Type a message…" maxlength="200" />
          <button class="mpc-gif-btn" id="mpc-gif-btn" onclick="window._mpChatGif()">GIF</button>
          <button class="mpc-pass-btn" id="mpc-pass-btn" style="display:none" title="Pass">⏭</button>
          <button class="mpc-send" id="mpc-send">→</button>
        </div>
      </div>`;

    if (embedded) {
      const container = document.getElementById(_containerId);
      (container || document.body).appendChild(w);
    } else {
      document.body.appendChild(w);
    }

    document.getElementById('mpc-send').onclick = _send;
    document.getElementById('mpc-ask-btn').onclick = _clickAsk;
    document.getElementById('mpc-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') _send();
    });
    document.getElementById('mpc-gif-search').addEventListener('input', e => {
      clearTimeout(_gifTimeout);
      _gifTimeout = setTimeout(() => _loadGifs(e.target.value), 400);
    });
  }

  window._mpChatToggle = function () {
    const box = document.getElementById('mpc-box');
    const badge = document.getElementById('mpc-badge');
    if (!box) return;
    _open = !_open;
    box.style.display = _open ? 'flex' : 'none';
    if (_open) {
      _unread = 0;
      if (badge) badge.style.display = 'none';
      const msgs = document.getElementById('mpc-msgs');
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
      document.getElementById('mpc-input')?.focus();
    } else {
      _closeGifPicker();
    }
  };

  // ── GIF picker ──────────────────────────────────────────────
  window._mpChatGif = function () {
    _gifOpen = !_gifOpen;
    const picker = document.getElementById('mpc-gif-picker');
    const btn = document.getElementById('mpc-gif-btn');
    if (!picker) return;
    picker.style.display = _gifOpen ? 'flex' : 'none';
    if (btn) btn.classList.toggle('active', _gifOpen);
    if (_gifOpen) {
      const grid = document.getElementById('mpc-gif-grid');
      if (grid && !grid.children.length) _loadGifs('');
      document.getElementById('mpc-gif-search')?.focus();
    }
  };

  function _closeGifPicker() {
    _gifOpen = false;
    const picker = document.getElementById('mpc-gif-picker');
    if (picker) picker.style.display = 'none';
    const btn = document.getElementById('mpc-gif-btn');
    if (btn) btn.classList.remove('active');
  }

  async function _loadGifs(q) {
    const grid = document.getElementById('mpc-gif-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="mpc-gif-loading">Loading…</div>';
    try {
      const key = (window.FNAF_CONFIG || {}).KLIPY_KEY || '';
      if (!key) { grid.innerHTML = '<div class="mpc-gif-loading">GIF search unavailable</div>'; return; }

      // KLIPY (Tenor-compatible GIF provider, Giphy-shaped response)
      const base = q.trim()
        ? `https://api.klipy.com/v2/gifs/search?q=${encodeURIComponent(q)}&key=${key}&per_page=15`
        : `https://api.klipy.com/v2/gifs/trending?key=${key}&per_page=15`;
      const r = await fetch(base);
      const data = await r.json();
      const gifs = (data.data || []).map(item => ({
        preview: item.images?.fixed_height_small?.url || item.images?.preview_gif?.url,
        url: item.images?.downsized?.url || item.images?.original?.url,
      })).filter(g => g.preview && g.url);

      grid.innerHTML = '';
      if (!gifs.length) {
        grid.innerHTML = '<div class="mpc-gif-loading">No results</div>';
        return;
      }
      gifs.forEach(g => {
        const img = document.createElement('img');
        img.className = 'mpc-gif-thumb';
        img.src = g.preview;
        img.loading = 'lazy';
        img.title = 'Send GIF';
        img.onclick = () => _sendGif(g.url);
        grid.appendChild(img);
      });
    } catch (e) {
      grid.innerHTML = '<div class="mpc-gif-loading">Failed to load</div>';
    }
  }

  async function _sendGif(url) {
    _closeGifPicker();
    const msg = 'gif:' + url;
    _appendMsg({ username: _username, message: msg });
    const db = _getDb();
    if (!db || !_roomId) return;
    try {
      await db.from('mp_chat').insert({
        room_type: _roomType, room_id: _roomId,
        username: _username, message: msg,
      });
    } catch (e) { _sysMsg('Failed to send GIF'); }
  }

  // ── Ask a question (Guess Who only) ───────────────────────────
  function _clickAsk() {
    if (!_askTargets || !_askTargets.length) return;
    if (_askTargets.length === 1) { _enterAsking(_askTargets[0]); return; }
    const row = document.getElementById('mpc-target-row');
    row.innerHTML = '';
    _askTargets.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'mpc-target-btn';
      btn.textContent = `To ${t.name}`;
      btn.onclick = () => _enterAsking(t);
      row.appendChild(btn);
    });
    row.style.display = 'flex';
  }
  function _enterAsking(t) {
    _asking = t;
    const row = document.getElementById('mpc-target-row');
    if (row) row.style.display = 'none';
    const input = document.getElementById('mpc-input');
    if (input) { input.placeholder = `Question to ${t.name}...`; input.focus(); }
  }
  function _cancelAsking() {
    _asking = null;
    const row = document.getElementById('mpc-target-row');
    if (row) { row.style.display = 'none'; row.innerHTML = ''; }
    const input = document.getElementById('mpc-input');
    if (input) input.placeholder = 'Type a message…';
  }
  window.mpChatShowAsk = function (targets) {
    _askTargets = targets && targets.length ? targets : null;
    const btn = document.getElementById('mpc-ask-btn');
    if (btn) btn.style.display = _askTargets ? '' : 'none';
  };
  window.mpChatHideAsk = function () {
    _askTargets = null;
    _cancelAsking();
    const btn = document.getElementById('mpc-ask-btn');
    if (btn) btn.style.display = 'none';
  };
  window.mpChatShowPass = function (onPass) {
    const btn = document.getElementById('mpc-pass-btn');
    if (!btn) return;
    btn.style.display = '';
    btn.onclick = onPass;
  };
  window.mpChatHidePass = function () {
    const btn = document.getElementById('mpc-pass-btn');
    if (btn) btn.style.display = 'none';
  };

  // ── Reply ────────────────────────────────────────────────────
  function _startReply(username, text) {
    _replyingTo = { username, text };
    _renderReplyPreview();
    document.getElementById('mpc-input')?.focus();
  }
  function _cancelReply() {
    _replyingTo = null;
    _renderReplyPreview();
  }
  function _renderReplyPreview() {
    const box = document.getElementById('mpc-reply-preview');
    if (!box) return;
    if (!_replyingTo) { box.style.display = 'none'; box.innerHTML = ''; return; }
    box.style.display = 'flex';
    box.innerHTML = `<span class="mpc-reply-text">↩ Replying to <strong>${_esc(_replyingTo.username)}</strong>: ${_esc(_replyingTo.text.slice(0, 60))}</span><button class="mpc-reply-cancel" id="mpc-reply-cancel">✕</button>`;
    document.getElementById('mpc-reply-cancel').onclick = _cancelReply;
  }

  // ── Send ─────────────────────────────────────────────────────
  async function _send() {
    const input = document.getElementById('mpc-input');
    if (!input || !_roomId) return;
    const msg = input.value.trim();
    if (!msg) return;
    if (msg.length > 200) { _sysMsg('Message too long (200 chars max)'); return; }
    if (_hate(msg)) { _sysMsg('Message not allowed'); return; }
    input.value = '';

    let payload = msg;
    if (_asking) {
      payload = 'ask:' + encodeURIComponent(JSON.stringify({ to: _asking.name, toSlot: _asking.slot, q: msg }));
      _cancelAsking();
    } else if (_replyingTo) {
      payload = 'reply:' + encodeURIComponent(JSON.stringify({ u: _replyingTo.username, t: _replyingTo.text.slice(0, 80), m: msg }));
    }
    _cancelReply();

    _appendMsg({ username: _username, message: payload });

    const db = _getDb();
    if (!db) { _sysMsg('Not connected'); return; }
    try {
      await db.from('mp_chat').insert({
        room_type: _roomType, room_id: _roomId,
        username: _username, message: payload,
      });
    } catch (e) { _sysMsg('Failed to send'); }
  }

  // ── Receive ──────────────────────────────────────────────────
  function _appendMsg(row) {
    const box = document.getElementById('mpc-msgs');
    if (!box) return;
    const isMine = row.username === _username;
    const div = document.createElement('div');
    div.className = 'mpc-msg ' + (isMine ? 'mpc-mine' : 'mpc-other');

    let bodyText = row.message;
    let quoteHtml = '';
    let headerExtra = '';
    let replyMeta = null;
    let askMeta = null;
    if (typeof row.message === 'string' && row.message.startsWith('ask:')) {
      let parsed = null;
      try { parsed = JSON.parse(decodeURIComponent(row.message.slice(4))); } catch (e) { }
      if (parsed) {
        headerExtra = ` → To ${_esc(parsed.to)}`;
        bodyText = parsed.q;
        askMeta = parsed;
      }
    } else if (typeof row.message === 'string' && row.message.startsWith('reply:')) {
      let parsed = null;
      try { parsed = JSON.parse(decodeURIComponent(row.message.slice(6))); } catch (e) { }
      if (parsed) {
        quoteHtml = `<div class="mpc-quote">↩ <strong>${_esc(parsed.u)}</strong>: ${_esc(parsed.t)}</div>`;
        bodyText = parsed.m;
        replyMeta = parsed;
      }
    }

    const isGif = typeof bodyText === 'string' && bodyText.startsWith('gif:');
    const content = isGif
      ? `<img class="mpc-gif-msg" src="${_esc(bodyText.slice(4))}" alt="GIF" loading="lazy" />`
      : `<span class="mpc-text">${_esc(bodyText)}</span>`;

    div.innerHTML = `<span class="mpc-who">${_esc(row.username)}${headerExtra}</span>${quoteHtml}${content}<button class="mpc-reply-btn" title="Reply">↩</button>`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    _msgCount++;

    const replyBtn = div.querySelector('.mpc-reply-btn');
    if (replyBtn) replyBtn.onclick = () => _startReply(row.username, isGif ? '[GIF]' : bodyText);

    if (!_open) {
      _unread++;
      const badge = document.getElementById('mpc-badge');
      if (badge) { badge.textContent = _unread; badge.style.display = ''; }
    }

    if (typeof window.mpChatOnMessage === 'function') {
      window.mpChatOnMessage({ username: row.username, isMine, text: bodyText, replyMeta, askMeta });
    }
  }

  function _sysMsg(text) {
    const box = document.getElementById('mpc-msgs');
    if (!box) return;
    const div = document.createElement('div');
    div.className = 'mpc-msg mpc-system';
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  // Locally-rendered system/game-event message (e.g. guess results) - each
  // client calls this when it independently observes the same game event,
  // so it appears for everyone without needing its own broadcast.
  window.mpChatSystemMsg = function (html) {
    const box = document.getElementById('mpc-msgs');
    if (!box) return;
    const div = document.createElement('div');
    div.className = 'mpc-msg mpc-system';
    div.innerHTML = html;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    if (!_open) {
      _unread++;
      const badge = document.getElementById('mpc-badge');
      if (badge) { badge.textContent = _unread; badge.style.display = ''; }
    }
  };

  async function _loadHistory() {
    const db = _getDb();
    if (!db || !_roomId) return;
    const { data } = await db.from('mp_chat')
      .select('*').eq('room_type', _roomType).eq('room_id', _roomId)
      .order('created_at', { ascending: true }).limit(100);
    if (!data) return;
    data.forEach(m => _appendMsg(m));
    _msgCount = data.length;
    _unread = 0;
    const badge = document.getElementById('mpc-badge');
    if (badge) badge.style.display = 'none';
  }

  function _subscribeChat() {
    const db = _getDb();
    if (!db || !_roomId) return;

    _sub = db.channel(`mp_chat_${_roomType}_${_roomId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'mp_chat',
        filter: `room_id=eq.${_roomId}`
      }, p => {
        if (p.new.username !== _username || _msgCount === 0) _appendMsg(p.new);
      })
      .subscribe();

    _poll = setInterval(async () => {
      if (!_roomId) return;
      const db2 = _getDb();
      if (!db2) return;
      const { data } = await db2.from('mp_chat')
        .select('*').eq('room_type', _roomType).eq('room_id', _roomId)
        .order('created_at', { ascending: true }).limit(100);
      if (!data || data.length <= _msgCount) return;
      data.slice(_msgCount).forEach(m => _appendMsg(m));
    }, 3000);
  }
})();
