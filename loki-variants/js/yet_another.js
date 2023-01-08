const cards = document.querySelectorAll('.card');

for (let i = 0; i < cards.length; i++) {
  const card = cards[i];
  card.style.left = `${i + 10}px`;
  card.style.top = `${i + 10}px`;
  card.style.zIndex = `${i}`;
  card.style.transform = 'scale(0.9)';
  card.style.transition = 'all 0.5s ease-in-out, z-index 0s';
}

cards.forEach((card) => {
  card.addEventListener('mouseover', () => {
    if (card.classList.contains('selected')) {
      card.style.transform = 'scale(1.05)';
    } else {
      card.style.transform = 'translate(-50px, 0) scale(1) rotate(-5deg)';
    }
  });

  card.addEventListener('mouseout', () => {
    if (card.classList.contains('selected')) {
      card.style.transform = 'translate(-3px, 0)';
    } else {
      card.style.transform = 'translate(0, 0) scale(0.9)';
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
        card.style.left = `${320 + highestZIndex}px`;
        card.classList.add('selected');
        console.log('Left position: ' + card.style.left);
        console.log('Top position: ' + card.style.top);
    }
  });
});
