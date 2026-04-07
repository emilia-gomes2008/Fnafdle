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
        eyeColor: "Blue",
        year:  1993,
        img:   "images/chars/freddy.png"
      },
      {
        name:  "Bonnie",
        animal:"Rabbit",
        type:  "Classic",
        color: "Blue",
        eyeColor: "Red",
        year:  1993,
        img:   "images/chars/bonnie.png"
      },
      {
        name:  "Chica",
        animal:"Chicken",
        type:  "Classic",
        color: "Yellow",
        eyeColor: "Magenta",
        year:  1993,
        img:   "images/chars/chica.png"
      },
      {
        name:  "Foxy",
        animal:"Fox",
        type:  "Classic",
        color: "Red",
        eyeColor: "Yellow",
        year:  1993,
        img:   "images/chars/foxy.png"
      },
      {
        name:  "Golden Freddy",
        animal:"Bear",
        type:  "Classic",
        color: "Yellow",
        eyeColor: "Black",
        year:  1993,          
        img:   "images/chars/golden_freddy.png"
      },
      {
        name:  "Toy Freddy",
        animal:"Bear",
        type:  "Toy",
        color: "Brown",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/toy_freddy.png"
      },
      {
        name:  "Toy Bonnie",
        animal:"Rabbit",
        type:  "Toy",
        color: "Blue",
        eyeColor: "Green",
        year:  1987,          
        img:   "images/chars/toy_bonnie.png"
      },
      {
        name:  "Toy Chica",
        animal:"Chicken",
        type:  "Toy",
        color: "Yellow",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/toy_chica.png"
      },
      {
        name:  "Mangle",
        animal:"Fox",
        type:  "Toy",
        color: "White",
        eyeColor: "Yellow",
        year:  1987,          
        img:   "images/chars/mangle.png"
      },
      {
        name:  "Balloon Boy",
        animal:"Hunanoid",
        type:  "Toy",
        color: "Red",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/bb.png"
      },
      {
        name:  "Puppet",
        animal:"Hunanoid",
        type:  "Toy",
        color: "Black",
        eyeColor: "Black",
        year:  1987,          
        img:   "images/chars/puppet.png"
      },
      {
        name:  "Withered Freddy",
        animal:"Bear",
        type:  "Withered",
        color: "Brown",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/withered_freddy.png"
      },
      {
        name:  "Withered Bonnie",
        animal:"Rabbit",
        type:  "Withered",
        color: "Blue",
        eyeColor: "Red",
        year:  1987,          
        img:   "images/chars/withered_bonnie.png"
      },
      {
        name:  "Withered Chica",
        animal:"Chicken",
        type:  "Withered",
        color: "Yellow",
        eyeColor: "Magenta",
        year:  1987,          
        img:   "images/chars/withered_chica.png"
      },
      {
        name:  "Withered Foxy",
        animal:"Fox",
        type:  "Withered",
        color: "Red",
        eyeColor: "Yellow",
        year:  1987,          
        img:   "images/chars/withered_foxy.png"
      },
      {
        name:  "Withered Golden Freddy",
        animal:"Bear",
        type:  "Withered",
        color: "Yellow",
        eyeColor: "Black",
        year:  1987,          
        img:   "images/chars/withered_golden.png"
      },
      {
        name:  "JJ",
        animal:"Humanoid",
        type:  "Toy",
        color: "Purple",
        eyeColor: "Magenta",
        year:  1987,          
        img:   "images/chars/jj.png"
      },
      {
        name:  "Shadow Freddy",
        animal:"Bear",
        type:  "Shadow",
        color: "Purple",
        eyeColor: "Black",
        year:  1987,          
        img:   "images/chars/shadow_freddy.png"
      },
      {
        name:  "RWQFSFASXC",
        animal:"Rabbit",
        type:  "Shadow",
        color: "Black",
        eyeColor: "Black",
        year:  1987,          
        img:   "images/chars/rxq.png"
      },
      {
        name:  "Endo-01",
        animal:"Skeleton",
        type:  "Endo",
        color: "Grey",
        eyeColor: "Blue",
        year:  1993,          
        img:   "images/chars/endo01.png"
      },
      {
        name:  "Endo-02",
        animal:"Skeleton",
        type:  "Endo",
        color: "Grey",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/endo02.png"
      },
      {
        name:  "Springtrap",
        animal:"Rabbit",
        type:  "Springlock",
        color: "Green",
        eyeColor: "Silver",
        year:  2023,          
        img:   "images/chars/springtrap.png"
      },
      {
        name:  "Phantom Freddy",
        animal:"Bear",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/p_freddy.png"
      },
      {
        name:  "Phantom Chica",
        animal:"Chicken",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/p_chica.png"
      },
      {
        name:  "Phantom Foxy",
        animal:"Fox",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/p_foxy.png"
      },
      {
        name:  "Phantom Mangle",
        animal:"Fox",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/p_mangle.png"
      },
      {
        name:  "Phantom Puppet",
        animal:"Humanoid",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/p_puppet.png"
      },
      {
        name:  "Phantom BB",
        animal:"Humanoid",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/p_bb.png"
      },
      {
        name:  "Springbonnie",
        animal:"Rabbit",
        type:  "Springlock",
        color: "Yellow",
        eyeColor: "Green",
        year:  1983,          
        img:   "images/chars/springbonnie.png"
      },
      {
        name:  "Fredbear",
        animal:"Bear",
        type:  "Springlock",
        color: "Yellow",
        eyeColor: "Blue",
        year:  1983,          
        img:   "images/chars/fredbear.png"
      },
    ];

/* =======================================================
       ESTADO DO JOGO
======================================================= */
let target, guesses, gameOver;
const MAX_GUESSES = 6;
let selectedIndex = -1;

const input = document.getElementById('search-input');
const dropdown = document.getElementById('dropdown');

function initGame() {
  target   = CHARS[Math.floor(Math.random() * CHARS.length)];
  guesses  = [];
  gameOver = false;
  selectedIndex = -1;

  document.getElementById('guesses-container').innerHTML = '';
  const banner = document.getElementById('result-banner');
  banner.classList.remove('show', 'lose');
  input.disabled = false;
  input.value = '';
  input.placeholder = 'Write an animatronic...';
  document.getElementById('search-area').style.display = '';
  dropdown.style.display = 'none';

  updateAttemptsLeft();
}

function updateAttemptsLeft() {
  const el = document.getElementById('attempts-left');
  const remaining = MAX_GUESSES - guesses.length;
  el.textContent = gameOver ? '' : `Tries left: ${remaining}`;
}

/* =======================================================
       RENDERIZAR UMA LINHA DE GUESS
======================================================= */
function renderGuess(char) {
  const fields = [
    { key: 'name', label: char.name },
    { key: 'animal', label: char.animal },
    { key: 'type', label: char.type },
    { key: 'color', label: char.color },
    { key: 'eyeColor', label: "Eye Color" },
    { key: 'year', label: char.year },
  ];

  const row = document.createElement('div');
  row.className = 'guess-row';

  const imgCell = document.createElement('div');
  imgCell.className = 'cell cell-img';

  if (char.img) {
    const img = document.createElement('img');
    img.src = char.img;
    img.alt = char.name;
    img.onerror = () => {
      imgCell.innerHTML = '';
      const ph = document.createElement('div');
      ph.className = 'placeholder-avatar';
      ph.textContent = char.emoji || '?';
      imgCell.appendChild(ph);
    };
    imgCell.appendChild(img);
  } else {
    const ph = document.createElement('div');
    ph.className = 'placeholder-avatar';
    ph.textContent = char.emoji || '?';
    imgCell.appendChild(ph);
  }

  row.appendChild(imgCell);

  fields.forEach(f => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    const isCorrect = String(char[f.key]) === String(target[f.key]);
    cell.classList.add(isCorrect ? 'correct' : 'wrong');

    const label = document.createElement('div');
    label.className = 'cell-label';
    label.textContent = f.label;
    cell.appendChild(label);

    row.appendChild(cell);
  });

  document.getElementById('guesses-container').prepend(row);
}

/* =======================================================
       SUBMETER UM GUESS
======================================================= */
function submitGuess(char) {
  if (gameOver) return;

  if (guesses.some(g => g.name === char.name)) {
    input.placeholder = 'Já tentaste esse!';
    input.value = '';
    dropdown.style.display = 'none';
    return;
  }

  guesses.push(char);
  renderGuess(char);
  input.value = '';
  dropdown.style.display = 'none';
  selectedIndex = -1;

  if (char.name === target.name) endGame(true);
  else if (guesses.length >= MAX_GUESSES) endGame(false);

  updateAttemptsLeft();
}

function endGame(won) {
  gameOver = true;
  input.disabled = true;
  document.getElementById('search-area').style.display = 'none';

  const banner = document.getElementById('result-banner');
  banner.classList.add('show');
  if (!won) banner.classList.add('lose');

  document.getElementById('result-title').textContent = won ? '🎉 Got it!' : '💀 Game Over';
  document.getElementById('result-msg').textContent = won
    ? `It was ${target.name}! You guessed it in ${guesses.length} tries.`
    : `It was ${target.name}. Better luck next time!`;
}

/* =======================================================
       DROPDOWN / PESQUISA COM TECLADO
======================================================= */
function renderDropdown() {
  const q = input.value.trim().toLowerCase();

  const filtered = CHARS.filter(c =>
    (q === '' || c.name.toLowerCase().includes(q)) &&
    !guesses.some(g => g.name === c.name)
  );

  if (!filtered.length) { 
    dropdown.style.display = 'none'; 
    return; 
  }

  dropdown.innerHTML = '';

  filtered.forEach(char => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.tabIndex = -1;

    if (char.img) {
      const img = document.createElement('img');
      img.src = char.img;
      img.alt = char.name;

      const span = document.createElement('span');
      span.textContent = char.name;

      item.appendChild(img);
      item.appendChild(span);
    } else {
      const span = document.createElement('span');
      span.textContent = char.name; // melhor mostrar nome em vez de emoji aqui
      item.appendChild(span);
    }

    item.addEventListener('click', () => submitGuess(char));
    dropdown.appendChild(item);
  });

  dropdown.style.display = 'block';
  selectedIndex = -1;
}

input.addEventListener('focus', renderDropdown);
input.addEventListener('input', renderDropdown);

/* NAVEGAÇÃO COM TECLADO */
input.addEventListener('keydown', e => {
  const items = Array.from(dropdown.querySelectorAll('.dropdown-item'));
  if (!items.length) return;

  switch(e.key) {
    case 'ArrowDown':
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      break;
    case 'ArrowUp':
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      break;
    case 'Enter':
    case 'Tab':
      if (selectedIndex >= 0 && selectedIndex < items.length) {
        items[selectedIndex].click();
        e.preventDefault();
      }
      break;
    case 'Escape':
      dropdown.style.display = 'none';
      selectedIndex = -1;
      break;
  }

  // Atualiza a classe visual de seleção
  items.forEach((el, i) => el.classList.toggle('selected', i === selectedIndex));
  if (selectedIndex >= 0 && selectedIndex < items.length) {
    items[selectedIndex].scrollIntoView({ block: 'nearest' });
  }
});

/* Fechar dropdown ao clicar fora */
document.addEventListener('click', e => {
  if (!document.getElementById('search-area').contains(e.target)) {
    dropdown.style.display = 'none';
    selectedIndex = -1;
  }
});

initGame();