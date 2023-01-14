playerCardForm.name.addEventListener('keyup', (e) => validateField(e.target));
playerCardForm.name.addEventListener('blur', (e) => validateField(e.target));
playerCardForm.jerseynumber.addEventListener('input', (e) => validateField(e.target));
playerCardForm.jerseynumber.addEventListener('blur', (e) => validateField(e.target));
playerCardForm.playerTeam.addEventListener('input', (e) => validateField(e.target));
playerCardForm.playerTeam.addEventListener('blur', (e) => validateField(e.target));
playerCardForm.addEventListener('submit', onSubmit);

const hockeyCardsElement = document.getElementById('hockeyCards');

const wrapper = `
    <div class="pile left-pile"></div>
    <div class="pile right-pile"></div>
`;

console.log('what is this' + hockeyCardsElement);

hockeyCardsElement.innerHTML += wrapper

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
    viewed: false,
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
      playerCards.forEach((playerCard) => {
        hockeyCardsElement.insertAdjacentHTML('beforeend', renderplayerCard(playerCard));
      });
    }
  } catch (err) {
    return err;
  }
};

function renderplayerCard({ id, name, jerseynumber, playerTeam }) {
  let html = `
      <div class="card" style="
        top: ${id * 10}px;
        left: ${id * 10}px;
        background-color: rgb(${id + 10 * 2}0, ${id + 5 * 3}0, ${id + 5 * 4}0">
      <div class="card-number">${jerseynumber}</div>
        <div class="card-img">
          <img src="./gifs/3.gif" alt="card" />
          <h2>${name}</h2>
          <p>${playerTeam}</p>
        </div>       
    </div>`;
  jerseynumber &&
    (html += `
      <p class="ml-8 mt-2 text-md italic">${jerseynumber}</p>
  `);
  return html;
}

document.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('card')) {
    const card = target;
    const pile = card.parentElement;
    const otherPile = pile.classList.contains('left-pile') ? rightPile : leftPile;

    // Remove the card from the current pile
    pile.removeChild(card);

    // Update the styles of the remaining cards in the current pile
    for (let i = 0; i < pile.children.length; i++) {
      pile.children[i].style.top = `${i * 10}px`;
      pile.children[i].style.left = `${i * 10}px`;
      pile.children[i].style.zIndex = `${i + 1}`;
    }

    // Add the card to the other pile
    card.style.zIndex = otherPile.children.length + 1;
    otherPile.appendChild(card);

    // Update the styles of the cards in the other pile
    for (let i = 0; i < otherPile.children.length; i++) {
      otherPile.children[i].style.top = `${i * 10}px`;
      otherPile.children[i].style.left = `${i * 10}px`;
      otherPile.children[i].style.zIndex = `${i + 1}`;
    }
  }
});

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
      viewed: true,
    };
  } else {
    data = {
      viewed: false,
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
