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
    ======================================================= */
    const CHARS = [
      {
        name:  "Freddy Fazbear",
        animal:"Bear",
        type:  "Classic",
        color: "Brown",
        year:  1993,
        img:   "images/chars/freddy.png"
      },
      {
        name:  "Bonnie",
        animal:"Rabbit",
        type:  "Classic",
        color: "Blue",
        year:  1993,
        img:   "images/chars/bonnie.png"
      },
      {
        name:  "Chica",
        animal:"Chicken",
        type:  "Classic",
        color: "Yellow",
        year:  1993,
        img:   "images/chars/chica.png"
      },
      {
        name:  "Foxy",
        animal:"Fox",
        type:  "Classic",
        color: "Red",
        year:  1993,
        img:   "images/chars/foxy.png"
      },
      {
        name:  "Golden Freddy",
        animal:"Bear",
        type:  "Classic",
        color: "Yellow",
        year:  1993,          
        img:   "images/chars/golden_freddy.png"
      },
      {
        name:  "Toy Freddy",
        animal:"Bear",
        type:  "Toy",
        color: "Brown",
        year:  1987,          
        img:   "images/chars/toy_freddy.png"
      },
      {
        name:  "Toy Bonnie",
        animal:"Rabbit",
        type:  "Toy",
        color: "Blue",
        year:  1987,          
        img:   "images/chars/toy_bonnie.png"
      },
      {
        name:  "Toy Chica",
        animal:"Chicken",
        type:  "Toy",
        color: "Yellow",
        year:  1987,          
        img:   "images/chars/toy_chica.png"
      },
      {
        name:  "Mangle",
        animal:"Fox",
        type:  "Toy",
        color: "White",
        year:  1987,          
        img:   "images/chars/mangle.png"
      },
      {
        name:  "Balloon Boy",
        animal:"Hunanoid",
        type:  "Toy",
        color: "Red",
        year:  1987,          
        img:   "images/chars/bb.png"
      },
      {
        name:  "Puppet",
        animal:"Hunanoid",
        type:  "Toy",
        color: "Black",
        year:  1987,          
        img:   "images/chars/puppet.png"
      },
      {
        name:  "Withered Freddy",
        animal:"Bear",
        type:  "Withered",
        color: "Brown",
        year:  1987,          
        img:   "images/chars/withered_freddy.png"
      },
      {
        name:  "Withered Bonnie",
        animal:"Rabbit",
        type:  "Withered",
        color: "Blue",
        year:  1987,          
        img:   "images/chars/withered_bonnie.png"
      },
      {
        name:  "Withered Chica",
        animal:"Chicken",
        type:  "Withered",
        color: "Yellow",
        year:  1987,          
        img:   "images/chars/withered_chica.png"
      },
      {
        name:  "Withered Foxy",
        animal:"Fox",
        type:  "Withered",
        color: "Red",
        year:  1987,          
        img:   "images/chars/withered_foxy.png"
      },
      {
        name:  "Withered Golden Freddy",
        animal:"Bear",
        type:  "Withered",
        color: "Yellow",
        year:  1987,          
        img:   "images/chars/withered_golden.png"
      },
      {
        name:  "JJ",
        animal:"Humanoid",
        type:  "Toy",
        color: "Purple",
        year:  1987,          
        img:   "images/chars/jj.png"
      },
      {
        name:  "Shadow Freddy",
        animal:"Bear",
        type:  "Shadow",
        color: "Purple",
        year:  1987,          
        img:   "images/chars/shadow_freddy.png"
      },
      {
        name:  "RWQFSFASXC",
        animal:"Rabbit",
        type:  "Shadiw",
        color: "Black",
        year:  1987,          
        img:   "images/chars/rxq.png"
      },
      {
        name:  "Endo-01",
        animal:"Skeleton",
        type:  "Endo",
        color: "Grey",
        year:  1993,          
        img:   "images/chars/endo01.png"
      },
      {
        name:  "Endo-02",
        animal:"Skeleton",
        type:  "Endo",
        color: "Grey",
        year:  1987,          
        img:   "images/chars/endo02.png"
      },
      {
        name:  "Springtrap",
        animal:"Rabbit",
        type:  "Springlock",
        color: "Green",
        year:  2023,          
        img:   "images/chars/springtrap.png"
      },
      {
        name:  "Phantom Freddy",
        animal:"Bear",
        type:  "Phantom",
        color: "Green",
        year:  2023,          
        img:   "images/chars/p_freddy.png"
      },
      {
        name:  "Phantom Chica",
        animal:"Chicken",
        type:  "Phantom",
        color: "Green",
        year:  2023,          
        img:   "images/chars/p_chica.png"
      },
      {
        name:  "Phantom Foxy",
        animal:"Fox",
        type:  "Phantom",
        color: "Green",
        year:  2023,          
        img:   "images/chars/p_foxy.png"
      },
      {
        name:  "Phantom Mangle",
        animal:"Fox",
        type:  "Phantom",
        color: "Green",
        year:  2023,          
        img:   "images/chars/p_mangle.png"
      },
      {
        name:  "Phantom Puppet",
        animal:"Humanoid",
        type:  "Phantom",
        color: "Green",
        year:  2023,          
        img:   "images/chars/p_puppet.png"
      },
      {
        name:  "Phantom BB",
        animal:"Humanoid",
        type:  "Phantom",
        color: "Green",
        year:  2023,          
        img:   "images/chars/p_bb.png"
      },
      {
        name:  "Springbonnie",
        animal:"Rabbit",
        type:  "Springlock",
        color: "Yellow",
        year:  1983,          
        img:   "images/chars/springbonnie.png"
      },
      {
        name:  "Fredbear",
        animal:"Bear",
        type:  "Springlock",
        color: "Yellow",
        year:  1983,          
        img:   "images/chars/fredbear.png"
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
      document.getElementById('search-input').placeholder = 'Write an animatronic...';
      document.getElementById('search-area').style.display = '';
      document.getElementById('dropdown').style.display    = 'none';

      updateAttemptsLeft();
    }

    function updateAttemptsLeft() {
      const el        = document.getElementById('attempts-left');
      const remaining = MAX_GUESSES - guesses.length;
      el.textContent  = gameOver ? '' : `Tries left: ${remaining}`;
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
        ? '🎉 Got it!'
        : '💀 Game Over';

      document.getElementById('result-msg').textContent = won
        ? `It was ${target.name}! You guessed it in ${guesses.length} tries.`
        : `It was ${target.name}. Better luck next time!`;
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