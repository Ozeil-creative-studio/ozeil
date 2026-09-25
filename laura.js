// Ozeil — Projet Laura: a small gift opens on arrival, then the logo appears.
(function () {
  var hero = document.querySelector('.laura-hero');
  var card = document.querySelector('.laura-logo-card');
  if (!hero || !card) return;

  // without JS, or with reduced motion, the logo is simply there from the start
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.body.classList.add('laura-intro');

  var stage = document.createElement('div');
  stage.className = 'laura-gift-stage';
  stage.setAttribute('aria-hidden', 'true');

  var gift = document.createElement('div');
  gift.className = 'laura-gift';
  gift.innerHTML =
    '<span class="laura-gift-lid"></span>' +
    '<span class="laura-gift-box"></span>' +
    '<span class="laura-gift-ribbon"></span>';
  stage.appendChild(gift);

  var burst = document.createElement('div');
  burst.className = 'laura-confetti';
  var colours = ['#10ffc1', '#ff00e4', '#7af5d5', '#ff7ae8', '#ffffff'];
  for (var i = 0; i < 26; i++) {
    var piece = document.createElement('i');
    var angle = (Math.PI * 2 * i) / 26 + (Math.random() - 0.5) * 0.3;
    var distance = 90 + Math.random() * 140;
    piece.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
    piece.style.setProperty('--ty', Math.sin(angle) * distance - 40 + 'px');
    piece.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    piece.style.setProperty('--delay', (Math.random() * 0.12).toFixed(2) + 's');
    piece.style.background = colours[i % colours.length];
    if (i % 3 === 0) piece.style.borderRadius = '50%';
    burst.appendChild(piece);
  }
  stage.appendChild(burst);
  hero.appendChild(stage);

  // timeline: the box drops, wiggles, pops open, then the logo takes over
  setTimeout(function () { gift.classList.add('open'); burst.classList.add('go'); }, 1000);
  setTimeout(function () { document.body.classList.add('laura-revealed'); }, 1250);
  setTimeout(function () { stage.remove(); document.body.classList.remove('laura-intro'); }, 2600);
})();
