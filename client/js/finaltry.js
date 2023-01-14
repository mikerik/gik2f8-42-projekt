const wrapper = `
  <div class="wrapper">
    <div class="pile left-pile"></div>
    <div class="pile right-pile"></div>
  </div>
`;

document.body.innerHTML += wrapper;

const leftPile = document.querySelector('.left-pile');
const rightPile = document.querySelector('.right-pile');

const numDivs = 8;

for (let i = 0; i < numDivs; i++) {
  const div = `
    <div class="card" style="top: ${i * 10}px; left: ${i * 10}px; background-color: rgb(${i + 10 * 2}0, ${i + 5 * 3}0, ${i + 5 * 4}0">
      <div class="card-number">${i + 1}</div>
        <div class="card-img">
          <img src="./gifs/${i + 1}.gif" alt="card" />
          <h2>playername ${i}</h2>
          <p>Contents of card ${i}</p>
        </div>
    </div>
  `;
  leftPile.innerHTML += div;
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
