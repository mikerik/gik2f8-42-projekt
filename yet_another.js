const cards = document.querySelectorAll('.card');

cards.forEach((card) => {
  card.addEventListener('click', () => {
    if (card.classList.contains('selected')) {
      card.classList.replace('selected', 'putback');
    } else if (card.classList.contains('putback')) {
      card.classList.replace('putback', 'selected');
    } else {
      card.classList.add('selected');
    }
  });
});
