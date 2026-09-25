// Ozeil — Projet Laura: the gift animation plays full screen, then the logo
// it reveals flies to the spot it occupies in the hero.
(function () {
  var hero = document.querySelector('.laura-hero');
  var card = document.querySelector('.laura-logo-card');
  var target = card && card.querySelector('img');
  if (!hero || !card || !target) return;

  // without JS, without Lottie, or with reduced motion: the page is simply there
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.lottie) return;

  // the animation's own canvas, and where the logo ends up inside it
  var CANVAS_W = 926, CANVAS_H = 1054, LOGO_W = 595, HANDOFF_FRAME = 186;

  document.body.classList.add('laura-intro');

  var overlay = document.createElement('div');
  overlay.className = 'laura-stage';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<div class="laura-stage-anim"></div>' +
    '<img class="laura-flyer" src="/images/projet-laura-logo.png" alt="">';
  document.body.appendChild(overlay);

  var flyer = overlay.querySelector('.laura-flyer');
  var anim = lottie.loadAnimation({
    container: overlay.querySelector('.laura-stage-anim'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: '/projet-laura-intro.json',
    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' }
  });

  var done = false;
  function finish() {
    if (done) return;
    done = true;
    document.body.classList.add('laura-revealed');
    document.body.classList.remove('laura-intro');
    overlay.classList.add('gone');
    setTimeout(function () { anim.destroy(); overlay.remove(); }, 500);
  }

  var flying = false;
  function fly() {
    if (flying || done) return;
    flying = true;
    anim.pause();

    // where the animation leaves the logo on screen
    var k = Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H);
    var fromW = LOGO_W * k;
    var to = target.getBoundingClientRect();
    var scale = fromW / to.width;
    var dx = window.innerWidth / 2 - (to.left + to.width / 2);
    var dy = window.innerHeight / 2 - (to.top + to.height / 2);

    flyer.style.left = to.left + 'px';
    flyer.style.top = to.top + 'px';
    flyer.style.width = to.width + 'px';
    flyer.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')';
    flyer.classList.add('ready');
    overlay.classList.add('handoff');

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        flyer.classList.add('flying');
        flyer.style.transform = 'translate(0,0) scale(1)';
      });
    });
    setTimeout(finish, 900);
  }

  anim.addEventListener('enterFrame', function () {
    if (anim.currentFrame >= HANDOFF_FRAME) fly();
  });
  anim.addEventListener('complete', fly);
  anim.addEventListener('data_failed', finish);

  overlay.addEventListener('click', finish);
  setTimeout(finish, 8000);
})();
