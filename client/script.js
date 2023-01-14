playerCardForm.name.addEventListener('keyup', (e) => validateField(e.target));
playerCardForm.name.addEventListener('blur', (e) => validateField(e.target));
playerCardForm.jerseynumber.addEventListener('input', (e) => validateField(e.target));
playerCardForm.jerseynumber.addEventListener('blur', (e) => validateField(e.target));
playerCardForm.playerTeam.addEventListener('input', (e) => validateField(e.target));
playerCardForm.playerTeam.addEventListener('blur', (e) => validateField(e.target));
playerCardForm.addEventListener('submit', onSubmit);

const hockeyCardsElement = document.getElementById('hockeyCards');

// const wrapper = `
//     <div class="pile left-pile"></div>
//     <div class="pile right-pile"></div>
// `;

// hockeyCardsElement.innerHTML += wrapper

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
      const leftPile = document.createElement('div');
      leftPile.classList.add('pile', 'left-pile');
      leftPile.id = 'leftPile';
      hockeyCardsElement.appendChild(leftPile);
      playerCards.forEach((playerCard) => {
        leftPile.insertAdjacentHTML('beforeend', renderplayerCard(playerCard));
      });
      const rightPile = document.createElement('div');
      rightPile.classList.add('pile', 'right-pile');
      rightPile.id = 'rightPile';
      hockeyCardsElement.appendChild(rightPile);
    }
  } catch (err) {
    return err;
  }
};

function renderplayerCard({ id, name, jerseynumber, playerTeam }) {
  let imgSrc;
  if (jerseynumber >= 12.25 && jerseynumber <= 24.5) {
    imgSrc = '2';
  } else if (jerseynumber >= 24.5 && jerseynumber <= 36.75) {
    imgSrc = '3';
  } else if (jerseynumber >= 36.75 && jerseynumber <= 49) {
    imgSrc = '4';
  } else if (jerseynumber >= 49 && jerseynumber <= 61.25) {
    imgSrc = '5';
  } else if (jerseynumber >= 61.25 && jerseynumber <= 73.5) {
    imgSrc = '6';
  } else if (jerseynumber >= 73.5 && jerseynumber <= 85.75) {
    imgSrc = '7';
  } else if (jerseynumber >= 85.75 && jerseynumber <= 99) {
    imgSrc = '8';
  } else {
    imgSrc = '1';
  }

  let teamBgColor;
  if (playerTeam === 'Systemvetenskap') {
    teamBgColor = 'hsla(250, 50%, 50%, 0.75)';
  } else if (playerTeam === 'Informationsdesign') {
    teamBgColor = 'hsla(0, 50%, 50%, 0.75)';
  } else {
    teamBgColor = 'hsla(50, 50%, 50%, 0.75)';
  }

  let html = `
      <div class="card" style="
        top: ${id * 10}px;
        left: ${id * 10}px;">
        <span class="card-name" style="background: ${teamBgColor};">${name}</span>
        <span class="card-number">${jerseynumber}</span>
        <span class="card-team" style="background: ${teamBgColor};">${playerTeam}</span>
          <img src="./gifs/${imgSrc}.gif" alt="card" />
          <button onclick="deleteplayerCard(${id})" class="w-fit bg-gray-300 hover:bg-gray-400 hover:translate-y-px px-4 py-2 rounded-lg shadow-md">Radera kortet!</button> 
    </div>`;

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

renderList();

document.addEventListener('click', (event) => {
  const target = event.target;
  console.log('Was the card div clicked? ' + target.classList.contains('card'));
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
