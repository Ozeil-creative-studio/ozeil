// Ozeil — Projet Laura: a full-screen gift opens, the logo comes out of it
// and flies to its place in the hero.
(function () {
  var hero = document.querySelector('.laura-hero');
  var card = document.querySelector('.laura-logo-card');
  var target = card && card.querySelector('img');
  if (!hero || !card || !target) return;

  // without JS, or with reduced motion, the page is simply there from the start
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.body.classList.add('laura-intro');

  var overlay = document.createElement('div');
  overlay.className = 'laura-stage';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<div class="laura-stage-glow"></div>' +
    '<div class="laura-gift">' +
      '<span class="laura-gift-lid"></span>' +
      '<span class="laura-gift-box"></span>' +
      '<span class="laura-gift-ribbon"></span>' +
    '</div>' +
    '<div class="laura-confetti"></div>' +
    '<img class="laura-flyer" src="/images/projet-laura-logo.svg" alt="">';
  document.body.appendChild(overlay);

  var gift = overlay.querySelector('.laura-gift');
  var burst = overlay.querySelector('.laura-confetti');
  var flyer = overlay.querySelector('.laura-flyer');

  var colours = ['#10ffc1', '#ff00e4', '#7af5d5', '#ff7ae8', '#ffffff'];
  for (var i = 0; i < 34; i++) {
    var piece = document.createElement('i');
    var angle = (Math.PI * 2 * i) / 34 + (Math.random() - 0.5) * 0.3;
    var distance = 120 + Math.random() * 220;
    piece.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
    piece.style.setProperty('--ty', Math.sin(angle) * distance - 60 + 'px');
    piece.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    piece.style.setProperty('--delay', (Math.random() * 0.14).toFixed(2) + 's');
    piece.style.background = colours[i % colours.length];
    if (i % 3 === 0) piece.style.borderRadius = '50%';
    burst.appendChild(piece);
  }

  var done = false;
  function finish() {
    if (done) return;
    done = true;
    document.body.classList.add('laura-revealed');
    document.body.classList.remove('laura-intro');
    overlay.classList.add('gone');
    setTimeout(function () { overlay.remove(); }, 500);
  }

  // the logo leaves the box, then flies to the spot it occupies in the hero
  function fly() {
    var to = target.getBoundingClientRect();

    // measure the flyer's own layout box, not whatever the pop animation
    // happens to be showing at this instant
    flyer.style.animation = 'none';
    flyer.style.transform = 'none';
    var from = flyer.getBoundingClientRect();
    var scale = from.width / to.width;
    var dx = (from.left + from.width / 2) - (to.left + to.width / 2);
    var dy = (from.top + from.height / 2) - (to.top + to.height / 2);

    flyer.style.left = to.left + 'px';
    flyer.style.top = to.top + 'px';
    flyer.style.width = to.width + 'px';
    flyer.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')';
    flyer.classList.add('flying');

    // next frame, let it settle into place
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { flyer.style.transform = 'translate(0,0) scale(1)'; });
    });
    setTimeout(finish, 950);
  }

  setTimeout(function () { gift.classList.add('open'); burst.classList.add('go'); }, 900);
  setTimeout(function () { flyer.classList.add('out'); }, 1150);
  setTimeout(fly, 1900);

  // safety net, and a way out for the impatient
  overlay.addEventListener('click', finish);
  setTimeout(finish, 6000);
})();
