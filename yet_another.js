const cards = document.querySelectorAll('.card');

// loop through each element in the cards array
for (let index = 0; index < cards.length; index++) {
  // get the current card element
  const card = cards[index];
  // add the current index value to the card's current left position
  card.style.left = `${50 + index}%`;
  // add the current index value to the card's current top position
  card.style.top = `${50 + index}%`;
  // set the card's z-index to the current index value
  card.style.zIndex = `${index}`;
  // set the card's transform to translate(-50%, -50%) and scale(0.9)
  card.style.transform = 'translate(-50%, -50%) scale(0.9)';
  // set the card's transition to all 0.5s ease-in-out
  card.style.transition = 'all 0.5s ease-in-out, z-index 0s';
}

cards.forEach((card) => {
  card.addEventListener('mouseover', () => {
    if (card.classList.contains('selected')) {
      card.style.transform = 'translate(-50%, -50%) scale(1.05) rotate(5deg)';
    } else {
      card.style.transform = 'translate(-60%, -50%) scale(1) rotate(-10deg)';
    }
  });

  card.addEventListener('mouseout', () => {
    if (card.classList.contains('selected')) {
      card.style.transform = 'translate(-50%, -50%)';
    } else {
      card.style.transform = 'translate(-50%, -50%) scale(0.9)';
    }
  });

  function findHighestZIndex(elements) {
    let highestIndex = 0;
    for (let element of elements) {
      let zIndex = window.getComputedStyle(element).getPropertyValue('z-index');
      zIndex = parseInt(zIndex);
      if (zIndex > highestIndex) {
        highestIndex = zIndex;
      }
    }
    return highestIndex;
  }

  card.addEventListener('click', () => {
    let currentLeft = card.offsetLeft;
    let highestZIndex = parseInt(findHighestZIndex(cards));
    switch (true) {
      case card.classList.contains('selected'):
        card.style.zIndex = `${highestZIndex + 1}`;
        card.style.left = `${currentLeft - 300}` + 'px';
        card.classList.remove('selected');
        console.log('Left position: ' + card.style.left);
        console.log('Top position: ' + card.style.top);
        break;
      default:
        card.style.zIndex = `${highestZIndex + 1}`;
        card.style.transform = 'translate(-50%, -50%)';
        card.style.left = `${currentLeft + 300}` + 'px';
        card.classList.add('selected');
        console.log('Left position: ' + card.style.left);
        console.log('Top position: ' + card.style.top);
    }
  });
});
