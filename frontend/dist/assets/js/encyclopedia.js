/* =======================================================
       ENCYCLOPEDIA MODE
======================================================= */
function initEncyclopedia() {
  document.getElementById('enc-search').value = '';
  document.getElementById('enc-type-filter').value = '';
  renderEncyclopedia();
}

function renderEncyclopedia() {
  const q = document.getElementById('enc-search').value.trim().toLowerCase();
  const typeF = document.getElementById('enc-type-filter').value.toLowerCase();

  const filtered = CHARS.filter(c =>
    (!q || c.name.toLowerCase().includes(q)) &&
    (!typeF || String(c.type).toLowerCase() === typeF)
  );

  const grid = document.getElementById('enc-grid');
  grid.innerHTML = '';

  filtered.forEach(char => {
    const card = document.createElement('div');
    card.className = 'enc-card';
    card.onclick = () => showEncCard(char);

    if (char.img) {
      const img = document.createElement('img');
      img.src = '../assets/' + char.img;
      img.alt = char.name;
      if (char.imgFocusFace) { img.style.objectFit = 'cover'; img.style.objectPosition = 'top center'; }
      img.onerror = () => { img.style.display = 'none'; };
      card.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'enc-card-placeholder';
      ph.textContent = '?';
      card.appendChild(ph);
    }

    const name = document.createElement('div');
    name.className = 'enc-card-name';
    name.textContent = char.name;
    card.appendChild(name);

    const type = document.createElement('div');
    type.className = 'enc-card-type';
    type.textContent = T('db.type.' + char.type);
    card.appendChild(type);

    grid.appendChild(card);
  });

  // Books section — only when type filter is not active
  if (!typeF) {
    const filteredBooks = BOOKS.filter(b =>
      !q || b.title.toLowerCase().includes(q) || b.series.toLowerCase().includes(q)
    );

    if (filteredBooks.length > 0) {
      const divider = document.createElement('div');
      divider.style.cssText = 'grid-column:1/-1;text-align:center;padding:1.2rem 0 0.6rem;color:var(--gold);font-family:\'Creepster\',cursive;font-size:1.1rem;letter-spacing:3px;border-top:1px solid var(--border);margin-top:0.8rem;';
      divider.textContent = T('enc.books');
      grid.appendChild(divider);

      filteredBooks.forEach(book => {
        const card = document.createElement('div');
        card.className = 'enc-card';
        card.onclick = () => showEncBookCard(book);

        if (book.img) {
          const img = document.createElement('img');
          img.src = '../assets/' + book.img;
          img.alt = book.title;
          img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
          img.onerror = () => { img.style.display = 'none'; };
          card.appendChild(img);
        } else {
          const ph = document.createElement('div');
          ph.className = 'enc-card-placeholder';
          ph.textContent = '📖';
          card.appendChild(ph);
        }

        const name = document.createElement('div');
        name.className = 'enc-card-name';
        name.textContent = book.title;
        card.appendChild(name);

        const type = document.createElement('div');
        type.className = 'enc-card-type';
        type.textContent = book.series;
        card.appendChild(type);

        grid.appendChild(card);
      });
    }

    if (filtered.length === 0 && filteredBooks.length === 0) {
      grid.innerHTML = `<div style="color:var(--text-muted);text-align:center;padding:2rem;letter-spacing:2px;font-size:0.8rem;grid-column:1/-1;">${T('enc.noResults')}</div>`;
    }
  } else if (filtered.length === 0) {
    grid.innerHTML = `<div style="color:var(--text-muted);text-align:center;padding:2rem;letter-spacing:2px;font-size:0.8rem;grid-column:1/-1;">${T('enc.noChars')}</div>`;
  }
}

function showEncBookCard(book) {
  const existing = document.getElementById('enc-modal-overlay');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'enc-modal-overlay';
  modal.style.cssText = `position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.82);display:flex;align-items:center;justify-content:center;padding:1rem;`;
  modal.innerHTML = `
    <div style="background:var(--bg-card);border:1.5px solid var(--gold);border-radius:14px;padding:28px 24px;max-width:360px;width:100%;position:relative;text-align:center;">
      <button onclick="document.getElementById('enc-modal-overlay').remove()" style="position:absolute;top:10px;right:14px;background:transparent;border:none;color:var(--text-muted);font-size:1.3rem;padding:0;margin:0;cursor:pointer;">✕</button>
      ${book.img
        ? `<img src="../assets/${book.img}" alt="${book.title}" style="width:90px;height:130px;object-fit:cover;border-radius:8px;border:2px solid var(--gold);margin-bottom:14px;" onerror="this.style.display='none'">`
        : `<div style="width:90px;height:130px;border-radius:8px;border:2px solid var(--border);background:var(--bg-page);display:inline-flex;align-items:center;justify-content:center;font-size:3rem;margin-bottom:14px;">📖</div>`
      }
      <div style="font-family:'Creepster',cursive;font-size:1.4rem;color:var(--gold);letter-spacing:2px;margin-bottom:4px;">${book.title}</div>
      <div style="font-size:0.7rem;color:var(--text-muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:18px;">${book.series}</div>
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.82rem;">
        <tr style="border-bottom:1px solid var(--border);">
          <td style="padding:7px 8px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;font-size:0.68rem;width:40%;">${T('enc.year')}</td>
          <td style="padding:7px 8px;color:var(--text);">${book.year}</td>
        </tr>
        <tr>
          <td style="padding:7px 8px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;font-size:0.68rem;">${T('enc.edition')}</td>
          <td style="padding:7px 8px;color:var(--text);">#${book.number}</td>
        </tr>
      </table>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

function showEncCard(char) {
  const existing = document.getElementById('enc-modal-overlay');
  if (existing) existing.remove();

  const colors = toArr(char.color);
  const eyeColors = toArr(char.eyeColor);

  function swatchesHTML(arr) {
    return arr.map(c => {
      const hex = COLOR_HEX[c.toLowerCase()] || '#666';
      const bg = hex.startsWith('linear') ? `background-image:${hex}` : `background:${hex}`;
      return `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);${bg};margin-right:4px;vertical-align:middle; transform: translateY(-6px);" title="${c}"></span>${T('db.color.' + c)}`;
    }).join(' / ');
  }

  const modal = document.createElement('div');
  modal.id = 'enc-modal-overlay';
  modal.style.cssText = `position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.82);display:flex;align-items:center;justify-content:center;padding:1rem;`;
  modal.innerHTML = `
    <div style="background:var(--bg-card);border:1.5px solid var(--gold);border-radius:14px;padding:28px 24px;max-width:360px;width:100%;position:relative;text-align:center;">
      <button onclick="document.getElementById('enc-modal-overlay').remove()" style="position:absolute;top:10px;right:14px;background:transparent;border:none;color:var(--text-muted);font-size:1.3rem;padding:0;margin:0;cursor:pointer;">✕</button>
      ${char.img
        ? `<img src="../assets/${char.img}" alt="${char.name}" style="width:120px;height:120px;object-fit:cover;${char.imgFocusFace ? 'object-position:top center;' : ''}border-radius:12px;border:2px solid var(--gold);margin-bottom:14px;" onerror="this.style.display='none'">`
        : `<div style="width:120px;height:120px;border-radius:12px;border:2px solid var(--border);background:var(--bg-page);display:inline-flex;align-items:center;justify-content:center;font-size:3rem;margin-bottom:14px;">?</div>`
      }
      <div style="font-family:'Creepster',cursive;font-size:1.6rem;color:var(--gold);letter-spacing:2px;margin-bottom:4px;">${char.name}</div>
      <div style="font-size:0.7rem;color:var(--text-muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:18px;">${T('db.type.' + char.type)}</div>
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.82rem;">
        <tr style="border-bottom:1px solid var(--border);">
          <td style="padding:7px 8px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;font-size:0.68rem;width:40%;">${T('enc.animal')}</td>
          <td style="padding:7px 8px;color:var(--text);">${T('db.animal.' + char.animal)}</td>
        </tr>
        <tr style="border-bottom:1px solid var(--border);">
          <td style="padding:7px 8px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;font-size:0.68rem;">${T('enc.color')}</td>
          <td style="padding:7px 8px;color:var(--text);">${swatchesHTML(colors)}</td>
        </tr>
        <tr style="border-bottom:1px solid var(--border);">
          <td style="padding:7px 8px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;font-size:0.68rem;">${T('enc.eyeColor')}</td>
          <td style="padding:7px 8px;color:var(--text);">${swatchesHTML(eyeColors)}</td>
        </tr>
        <tr>
          <td style="padding:7px 8px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;font-size:0.68rem;">${T('enc.year')}</td>
          <td style="padding:7px 8px;color:var(--text);">${char.year}</td>
        </tr>
      </table>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

function populateEncTypeFilter() {
  const types = [...new Set(CHARS.map(c => c.type).filter(Boolean))].sort();
  const sel = document.getElementById('enc-type-filter');
  if (!sel) return;
  sel.innerHTML = `<option value="">${T('enc.allTypes')}</option>`;
  types.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    sel.appendChild(opt);
  });
}

// Event Listeners
document.getElementById('enc-search').addEventListener('input', renderEncyclopedia);
document.getElementById('enc-type-filter').addEventListener('change', renderEncyclopedia);

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('encyclopedia-screen').style.display = 'block';
  populateEncTypeFilter();
  initEncyclopedia();
});
