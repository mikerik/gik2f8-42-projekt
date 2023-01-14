playerCardForm.name.addEventListener('keyup', (e) => validateField(e.target));
playerCardForm.name.addEventListener('blur', (e) => validateField(e.target));
playerCardForm.jerseynumber.addEventListener('input', (e) => validateField(e.target));
playerCardForm.jerseynumber.addEventListener('blur', (e) => validateField(e.target));
playerCardForm.playerTeam.addEventListener('input', (e) => validateField(e.target));
playerCardForm.playerTeam.addEventListener('blur', (e) => validateField(e.target));
playerCardForm.addEventListener('submit', onSubmit);
const hockeyCardsElement = document.getElementById('hockeyCards');
let nameValid = true;
let jerseynumberValid = true;
let playerTeamValid = true;
const api = new Api('http://localhost:5678/playerCards');

function validateField(field) {
  const { name, value } = field;
  let = validationMessage = '';
  switch (name) {
    case 'name': {
      if (value.length < 2) {
        nameValid = false;
        validationMessage = 'Spelarens namn måste vara minst fyra tecken.';
      } else if (value.length > 70) {
        nameValid = false;
        validationMessage = 'Spelarens namn får inte vara längre än 70 tecken.';
      } else {
        nameValid = true;
      }
      break;
    }
    case 'jerseynumber': {
      if (value.length < 1) {
        jerseynumberValid = false;
        validationMessage = 'Spelarens tröjnummer måste vara mellan 1-99.';
      } else if (value.length > 2) {
        jerseynumberValid = false;
        validationMessage = 'Spelarens tröjnummer måste vara mellan 1-99.';
      } else {
        jerseynumberValid = true;
      }
      break;
    }
    case 'playerTeam': {
      if (value.length === 0) {
        playerTeamValid = false;
        validationMessage = 'Felaktigt lag valt, laget existerar inte.';
      } else {
        playerTeamValid = true;
      }
      break;
    }
  }
  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
}

function onSubmit(e) {
  e.preventDefault();
  if (nameValid && jerseynumberValid && playerTeamValid) {
    console.log('Submit');
    saveCard();
  }
}

function saveCard() {
  const playerCard = {
    name: playerCardForm.name.value,
    jerseynumber: playerCardForm.jerseynumber.value,
    playerTeam: playerCardForm.playerTeam.value,
    completed: false,
  };
  api.create(playerCard).then((playerCard) => {
    if (playerCard) {
      renderList();
    }
  });
}

renderList = async () => {
  console.log('rendering');
  try {
    const playerCards = await api.getAll();
    hockeyCardsElement.innerHTML = '';
    if (playerCards && playerCards.length > 0) {
      playerCards.sort((a, b) => {
        if (a.completed && !b.completed) {
          return 1;
        }
        if (!a.completed && b.completed) {
          return -1;
        }
        if (a.playerTeam < b.playerTeam) {
          return -1;
        }
        if (a.playerTeam > b.playerTeam) {
          return 1;
        }
        return 0;
      });
      playerCards.forEach((playerCard) => {
        hockeyCardsElement.insertAdjacentHTML('beforeend', renderplayerCard(playerCard));
      });
    }
  } catch (err) {
    return err;
  }
};

function renderplayerCard({ id, name, jerseynumber, playerTeam, completed }) {
  let html = `
    <li class="select-none mt-2 p-3 ${completed ? 'bg-green-500' : 'bg-red-500'} border-[0.25rem] border-black hover:bg-blue-500">
      <div class="flex items-center">
        <div id="inputContainer${id}">
          <input type="checkbox" ${
            completed ? 'checked' : ''
          } onclick="updateplayerCard(${id}) "id="checkBox${id}" class="appearance-none border-[0.25rem] border-black bg-red-500 checked:bg-green-500 hover:bg-yellow-500"/>
          <style>
            input[type="checkbox"]:checked:before{
              content: "✔";
              font-size: 12px;
            }
            input[type="checkbox"]:before{
              content: "✖";
              font-size: 12px;
            }
          </style>
        </div> 
        <h3 class="pl-4 mb-3 flex-1 text-xl font-bold text-black">${name}</h3>
        <div>
          <span><b>Deadline: ${playerTeam}</b></span>
          <button onclick="deleteplayerCard(${id})" class="inline-block bg-gray-300 text-md text-slate-900 border-[0.25rem] border-black px-3 py-1 ml-2 hover:bg-white">Ta bort</button>
        </div>
      </div>`;
  jerseynumber &&
    (html += `
      <p class="ml-8 mt-2 text-md italic">${jerseynumber}</p>
  `);
  html += `
    </li>`;
  return html;
}

deleteplayerCard = async (id) => {
  try {
    await api.remove(id);
    renderList();
  } catch (err) {
    return err;
  }
};

updateplayerCard = async (id) => {
  const checkBox = document.getElementById(`checkBox${id}`);
  let data;
  if (checkBox.checked) {
    data = {
      completed: true,
    };
  } else {
    data = {
      completed: false,
    };
  }
  try {
    await api.update(id, data);
    renderList();
  } catch (err) {
    return err;
  }
};

renderList();
