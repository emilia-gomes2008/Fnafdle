/* =======================================================
       BASE DE DADOS DE PERSONAGENS
       =======================================================
       Campos:
         name   → nome do personagem (aparece na célula "Nome")
         animal → tipo de animal (Bear, Rabbit, etc.)
         type   → variante (Classic, Withered, Toy, Shadow, etc.)
         color  → cor principal
         year   → ano de origem (do jogo onde aparece pela 1ª vez)
         img    → caminho para a imagem PNG
                  coloca os teus ficheiros em images/<nome>.png
                  deixa "" para usar o placeholder emoji
         emoji  → emoji de fallback enquanto não tens imagem
    ======================================================= */
    const CHARS = [
      {
        name:  "Freddy Fazbear",
        animal:"Bear",
        type:  "Classic",
        color: "Brown",
        year:  1993,
        img:   "images/chars/freddy.png",    
        emoji: "🐻"
      },
      {
        name:  "Bonnie",
        animal:"Rabbit",
        type:  "Classic",
        color: "Blue",
        year:  1993,
        img:   "images/chars/bonnie.png",
        emoji: "🐰"
      },
      {
        name:  "Chica",
        animal:"Chicken",
        type:  "Classic",
        color: "Yellow",
        year:  1993,
        img:   "images/chars/chica.png",
        emoji: "🐤"
      },
      {
        name:  "Foxy",
        animal:"Fox",
        type:  "Classic",
        color: "Red",
        year:  1993,
        img:   "images/chars/foxy.png",
        emoji: "🦊"
      },
      {
        name:  "Golden Freddy",
        animal:"Bear",
        type:  "Classic",
        color: "Yellow",
        year:  1993,          
        img:   "images/chars/golden_freddy.png",
        emoji: "✨"
      },
    ];

    /* =======================================================
       ESTADO DO JOGO
    ======================================================= */
    let target, guesses, gameOver;
    const MAX_GUESSES = 6;

    function initGame() {
      target   = CHARS[Math.floor(Math.random() * CHARS.length)];
      guesses  = [];
      gameOver = false;

      document.getElementById('guesses-container').innerHTML = '';
      const banner = document.getElementById('result-banner');
      banner.classList.remove('show', 'lose');
      document.getElementById('search-input').disabled = false;
      document.getElementById('search-input').value    = '';
      document.getElementById('search-input').placeholder = 'Escreve o nome do animatronic...';
      document.getElementById('search-area').style.display = '';
      document.getElementById('dropdown').style.display    = 'none';

      updateAttemptsLeft();
    }

    function updateAttemptsLeft() {
      const el        = document.getElementById('attempts-left');
      const remaining = MAX_GUESSES - guesses.length;
      el.textContent  = gameOver ? '' : `Tentativas restantes: ${remaining}`;
    }

    /* =======================================================
       RENDERIZAR UMA LINHA DE GUESS
    ======================================================= */
    function renderGuess(char) {
      /* campos a comparar: [chave no objeto, valor a mostrar] */
      const fields = [
        { key: 'name',   label: char.name   },
        { key: 'animal', label: char.animal },
        { key: 'type',   label: char.type   },
        { key: 'color',  label: char.color  },
        { key: 'year',   label: char.year   },
      ];

      const row = document.createElement('div');
      row.className = 'guess-row';

      /* --- Célula da imagem (sem cor de certo/errado) --- */
      const imgCell = document.createElement('div');
      imgCell.className = 'cell cell-img';

      if (char.img) {
        /* Tenta carregar a imagem PNG; se falhar usa o placeholder */
        const img     = document.createElement('img');
        img.src        = char.img;
        img.alt        = char.name;
        img.onerror   = () => {
          imgCell.innerHTML = '';
          const ph = document.createElement('div');
          ph.className  = 'placeholder-avatar';
          ph.textContent = char.emoji;
          imgCell.appendChild(ph);
        };
        imgCell.appendChild(img);
      } else {
        const ph       = document.createElement('div');
        ph.className   = 'placeholder-avatar';
        ph.textContent = char.emoji;
        imgCell.appendChild(ph);
      }

      row.appendChild(imgCell);

      /* --- Células dos atributos --- */
      fields.forEach(f => {
        const cell      = document.createElement('div');
        cell.className  = 'cell';
        const isCorrect = String(char[f.key]) === String(target[f.key]);
        cell.classList.add(isCorrect ? 'correct' : 'wrong');

        const label      = document.createElement('div');
        label.className  = 'cell-label';
        label.textContent = f.label;
        cell.appendChild(label);

        row.appendChild(cell);
      });

      /* Insere no topo (guess mais recente primeiro) */
      document.getElementById('guesses-container').prepend(row);
    }

    /* =======================================================
       SUBMETER UM GUESS
    ======================================================= */
    function submitGuess(char) {
      if (gameOver) return;

      if (guesses.some(g => g.name === char.name)) {
        document.getElementById('search-input').placeholder = 'Já tentaste esse!';
        document.getElementById('search-input').value = '';
        document.getElementById('dropdown').style.display = 'none';
        return;
      }

      guesses.push(char);
      renderGuess(char);
      document.getElementById('search-input').value = '';
      document.getElementById('dropdown').style.display = 'none';

      if (char.name === target.name) {
        endGame(true);
      } else if (guesses.length >= MAX_GUESSES) {
        endGame(false);
      }

      updateAttemptsLeft();
    }

    function endGame(won) {
      gameOver = true;
      document.getElementById('search-input').disabled = true;
      document.getElementById('search-area').style.display = 'none';

      const banner = document.getElementById('result-banner');
      banner.classList.add('show');
      if (!won) banner.classList.add('lose');

      document.getElementById('result-title').textContent = won
        ? '🎉 Correto!'
        : '💀 Game Over';

      document.getElementById('result-msg').textContent = won
        ? `Era o ${target.name}! Conseguiste em ${guesses.length} tentativa${guesses.length > 1 ? 's' : ''}.`
        : `Era o ${target.name}. Mais sorte na próxima!`;
    }

    /* =======================================================
       DROPDOWN / PESQUISA
    ======================================================= */
    const input    = document.getElementById('search-input');
    const dropdown = document.getElementById('dropdown');

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { dropdown.style.display = 'none'; return; }

      const filtered = CHARS.filter(c =>
        c.name.toLowerCase().includes(q) &&
        !guesses.some(g => g.name === c.name)
      );

      if (!filtered.length) { dropdown.style.display = 'none'; return; }

      dropdown.innerHTML = '';
      filtered.forEach(char => {
        const item  = document.createElement('div');
        item.className = 'dropdown-item';

        /* imagem ou emoji no dropdown */
        if (char.img) {
          const img   = document.createElement('img');
          img.src      = char.img;
          img.alt      = char.name;
          img.onerror  = () => { img.style.display='none'; span2.textContent = char.emoji + ' ' + char.name; };
          const span2  = document.createElement('span');
          span2.textContent = char.name;
          item.appendChild(img);
          item.appendChild(span2);
        } else {
          const span  = document.createElement('span');
          span.textContent = char.emoji + '  ' + char.name;
          item.appendChild(span);
        }

        item.addEventListener('click', () => submitGuess(char));
        dropdown.appendChild(item);
      });

      dropdown.style.display = 'block';
    });

    /* Fechar dropdown ao clicar fora */
    document.addEventListener('click', e => {
      if (!document.getElementById('search-area').contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') dropdown.style.display = 'none';
    });

    initGame();