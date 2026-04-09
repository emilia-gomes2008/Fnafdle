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
        img:   "images/chars/classic/freddy.png"
      },
      {
        name:  "Bonnie",
        animal:"Rabbit",
        type:  "Classic",
        color: "Blue",
        eyeColor: "Red",
        year:  1993,
        img:   "images/chars/classic/bonnie.png"
      },
      {
        name:  "Chica",
        animal:"Chicken",
        type:  "Classic",
        color: "Yellow",
        eyeColor: "Magenta",
        year:  1993,
        img:   "images/chars/classic/chica.png"
      },
      {
        name:  "Cupcake",
        animal:"Cupcake",
        type:  "Classic",
        color: "Pink",
        eyeColor: "Yellow",
        year:  1993,          
        img:   "images/chars/classic/cupcake.png"
      },
      {
        name:  "Foxy",
        animal:"Fox",
        type:  "Classic",
        color: "Red",
        eyeColor: "Yellow",
        year:  1993,
        img:   "images/chars/classic/foxy.png"
      },
      {
        name:  "Golden Freddy",
        animal:"Bear",
        type:  "Classic",
        color: "Yellow",
        eyeColor: "Black",
        year:  1993,          
        img:   "images/chars/classic/golden_freddy.png"
      },
      {
        name:  "Endo-01",
        animal:"Skeleton",
        type:  "Endo",
        color: "Grey",
        eyeColor: "Blue",
        year:  1993,          
        img:   "images/chars/endo/endo01.png"
      },
      {
        name:  "Toy Freddy",
        animal:"Bear",
        type:  "Toy",
        color: "Brown",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/toy/toy_freddy.png"
      },
      {
        name:  "Toy Bonnie",
        animal:"Rabbit",
        type:  "Toy",
        color: "Blue",
        eyeColor: "Green",
        year:  1987,          
        img:   "images/chars/toy/toy_bonnie.png"
      },
      {
        name:  "Toy Chica",
        animal:"Chicken",
        type:  "Toy",
        color: "Yellow",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/toy/toy_chica.png"
      },
      {
        name:  "Toy Cupcake",
        animal:"Cupcake",
        type:  "Toy",
        color: "Pink",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/toy/toy_cupcake.png"
      },
      {
        name:  "Toy Foxy",
        animal:"Fox",
        type:  "Toy",
        color: "White",
        eyeColor: "Yellow",
        year:  1987,          
        img:   "images/chars/toy/toy_foxy.png"
      },
      {
        name:  "Mangle",
        animal:"Fox",
        type:  "Toy",
        color: "White",
        eyeColor: "Yellow",
        year:  1987,          
        img:   "images/chars/toy/mangle.png"
      },
      {
        name:  "Balloon Boy",
        animal:"Hunanoid",
        type:  "Toy",
        color: "Red",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/toy/bb.png"
      },
      {
        name:  "JJ",
        animal:"Humanoid",
        type:  "Toy",
        color: "Purple",
        eyeColor: "Magenta",
        year:  1987,          
        img:   "images/chars/toy/jj.png"
      },
      {
        name:  "Endo-02",
        animal:"Skeleton",
        type:  "Endo",
        color: "Grey",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/endo/endo02.png"
      },
      {
        name:  "Puppet",
        animal:"Hunanoid",
        type:  "Toy",
        color: "Black",
        eyeColor: "Black",
        year:  1987,          
        img:   "images/chars/toy/puppet.png"
      },
      {
        name:  "Withered Freddy",
        animal:"Bear",
        type:  "Withered",
        color: "Brown",
        eyeColor: "Blue",
        year:  1987,          
        img:   "images/chars/withered/withered_freddy.png"
      },
      {
        name:  "Withered Bonnie",
        animal:"Rabbit",
        type:  "Withered",
        color: "Blue",
        eyeColor: "Red",
        year:  1987,          
        img:   "images/chars/withered/withered_bonnie.png"
      },
      {
        name:  "Withered Chica",
        animal:"Chicken",
        type:  "Withered",
        color: "Yellow",
        eyeColor: "Magenta",
        year:  1987,          
        img:   "images/chars/withered/withered_chica.png"
      },
      {
        name:  "Withered Foxy",
        animal:"Fox",
        type:  "Withered",
        color: "Red",
        eyeColor: "Yellow",
        year:  1987,          
        img:   "images/chars/withered/withered_foxy.png"
      },
      {
        name:  "Withered Golden Freddy",
        animal:"Bear",
        type:  "Withered",
        color: "Yellow",
        eyeColor: "Black",
        year:  1987,          
        img:   "images/chars/withered/withered_golden.png"
      },
      {
        name:  "Shadow Freddy",
        animal:"Bear",
        type:  "Shadow",
        color: "Purple",
        eyeColor: "Black",
        year:  1987,          
        img:   "images/chars/shadow/shadow_freddy.png"
      },
      {
        name:  "RWQFSFASXC",
        animal:"Rabbit",
        type:  "Shadow",
        color: "Black",
        eyeColor: "White",
        year:  1987,          
        img:   "images/chars/shadow/rxq.png"
      },
      {
        name:  "Paper Pals",
        animal:"Other",
        type:  "Other",
        color: "White",
        eyeColor: "White",
        year:  1987,          
        img:   "images/chars/other/Paperpals.png"
      },
      {
        name:  "Crying Child",
        animal:"Other",
        type:  "Other",
        color: "White",
        eyeColor: "Grey",
        year:  "1980s",          
        img:   "images/chars/other/crying_child.png"
      },
      {
        name:  "William Afton",
        animal:"Human",
        type:  "Other",
        color: "Purple",
        eyeColor: "White",
        year:  "1980s",          
        img:   "images/chars/other/afton.png"
      },
      {
        name:  "Springtrap",
        animal:"Rabbit",
        type:  "Springlock",
        color: "Green",
        eyeColor: "Silver",
        year:  2023,          
        img:   "images/chars/springlock/springtrap.png"
      },
      {
        name:  "Phantom Freddy",
        animal:"Bear",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/phantom/p_freddy.png"
      },
      {
        name:  "Phantom Chica",
        animal:"Chicken",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/phantom/p_chica.png"
      },
      {
        name:  "Shadow Cupcake",
        animal:"Cupcake",
        type:  "Shadow",
        color: "Black",
        eyeColor: "Black",
        year:  1987,          
        img:   "images/chars/shadow/cupcake.png"
      },
      {
        name:  "Phantom Foxy",
        animal:"Fox",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/phantom/p_foxy.png"
      },
      {
        name:  "Phantom Mangle",
        animal:"Fox",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/phantom/p_mangle.png"
      },
      {
        name:  "Phantom Puppet",
        animal:"Humanoid",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/phantom/p_puppet.png"
      },
      {
        name:  "Phantom BB",
        animal:"Humanoid",
        type:  "Phantom",
        color: "Green",
        eyeColor: "Black",
        year:  2023,          
        img:   "images/chars/phantom/p_bb.png"
      },
      {
        name:  "Springbonnie",
        animal:"Rabbit",
        type:  "Springlock",
        color: "Yellow",
        eyeColor: "Green",
        year:  1983,          
        img:   "images/chars/springlock/springbonnie.png"
      },
      {
        name:  "Fredbear",
        animal:"Bear",
        type:  "Springlock",
        color: "Yellow",
        eyeColor: "Blue",
        year:  1983,          
        img:   "images/chars/springlock/fredbear.png"
      },
      {
        name:  "Golden Cupcake",
        animal:"Cupcake",
        type:  "Springlock",
        color: "Yellow",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "images/chars/springlock/cupcake.png"
      },
      {
        name:  "Nightmare Freddy",
        animal:"Bear",
        type:  "Nightmare",
        color: "Brown",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare_freddy.png"
      },
      {
        name:  "Freddles",
        animal:"Bear",
        type:  "Nightmare",
        color: "Brown",
        eyeColor: "White",
        year:  1983,          
        img:   "images/chars/nightmare/freddles.png"
      },
      {
        name:  "Nightmare Bonnie",
        animal:"Rabbit",
        type:  "Nightmare",
        color: "Blue",
        eyeColor: "Magenta",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare_bonnie.png"
      },
      {
        name:  "Nightmare Chica",
        animal:"Chicken",
        type:  "Nightmare",
        color: "Yellow",
        eyeColor: "Red",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare_chica.png"
      },
      {
        name:  "Nightmare Cupcake",
        animal:"Cupcake",
        type:  "Nightmare",
        color: "Pink",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "images/chars/nightmare/cupcake.png"
      },
      {
        name:  "Nightmare Foxy",
        animal:"Fox",
        type:  "Nightmare",
        color: "Red",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare_foxy.png"
      },
      {
        name:  "Nightmare Fredbear",
        animal:"Bear",
        type:  "Nightmare",
        color: "Yellow",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare_fredbear.png"
      },
      {
        name:  "Plushtrap",
        animal:"Rabbit",
        type:  "Nightmare",
        color: "Green",
        eyeColor: "Black",
        year:  1983,          
        img:   "images/chars/nightmare/creonzadoruin.png"
      },
      {
        name:  "Nightmare",
        animal:"Bear",
        type:  "Nightmare",
        color: "Black",
        eyeColor: "Red",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare.png"
      },
      {
        name:  "Jack-O-Bonnie",
        animal:"Rabbit",
        type:  "Jack-O",
        color: "Orange",
        eyeColor: "Orange",
        year:  1983,          
        img:   "images/chars/nightmare/jack-o/bonnie.png"
      },
      {
        name:  "Jack-O-Chica",
        animal:"Chicken",
        type:  "Jack-O",
        color: "Orange",
        eyeColor: "Orange",
        year:  1983,          
        img:   "images/chars/nightmare/jack-o/chica.png"
      },
      {
        name:  "Jack-O-Lantern",
        animal:"Cuocake",
        type:  "Jack-O",
        color: "Orange",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "images/chars/nightmare/jack-o/lantern.png"
      },
      {
        name:  "Nightmare Mangle",
        animal:"Fox",
        type:  "Nightmare",
        color: "White",
        eyeColor: "Yellow",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare_mangle.png"
      },
      {
        name:  "Nightmare Balloon Boy",
        animal:"Humanoid",
        type:  "Nightmare",
        color: "Purple",
        eyeColor: "Red",
        year:  1983,          
        img:   "images/chars/nightmare/nightmare_bb.png"
      },
      {
        name:  "Nightmarionne",
        animal:"Humanoid",
        type:  "Nightmare",
        color: "Black",
        eyeColor: "White",
        year:  1983,          
        img:   "images/chars/nightmare/nightmarionne.png"
      },
      {
        name:  "Endo Plush",
        animal:"Skeleton",
        type:  "Endo",
        color: "Grey",
        eyeColor: "Green",
        year:  "1980s",          
        img:   "images/chars/endo/plush.png"
      },
      {
        name:  "Animdude",
        animal:"Human",
        type:  "Other",
        color: "Blue",
        eyeColor: "White",
        year:  1978,          
        img:   "images/chars/other/Animdude.png"
      },
      {
        name:  "Mr. Chipper",
        animal:"Beaver",
        type:  "Other",
        color: "Brown",
        eyeColor: "Blue",
        year:  2013,          
        img:   "images/chars/other/chipper.png"
      },
      {
        name:  "Coffee",
        animal:"Coffee Machine",
        type:  "Other",
        color: "Brown",
        eyeColor: "Yellow",
        year:  2012,          
        img:   "images/chars/other/coffee.png"
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
    { key: 'eyeColor', label: char.eyeColor},
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
    input.placeholder = 'You tried that already!';
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