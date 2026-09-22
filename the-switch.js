// Ozeil — The Switch page: Lottie intro, entrance flash, sparks and scroll reveals.
(function () {
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- hero fills exactly the visible screen below the header / promo bar ----------
  var hero = document.querySelector('.switch-hero');
  function sizeHero() {
    if (!hero) return;
    var top = hero.getBoundingClientRect().top + window.scrollY;
    document.documentElement.style.setProperty('--sw-hero-top', top + 'px');
  }
  sizeHero();
  window.addEventListener('resize', sizeHero);
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(sizeHero);
    [document.querySelector('header'), document.getElementById('promoBarHost')].forEach(function (el) { if (el) ro.observe(el); });
  }

  // ---------- sparks ----------
  var sparks = document.getElementById('switchSparks');
  if (sparks && !reduceMotion) {
    for (var i = 0; i < 28; i++) {
      var s = document.createElement('i');
      s.style.left = (Math.random() * 100) + '%';
      s.style.top = (Math.random() * 100) + '%';
      s.style.animationDelay = (Math.random() * 3.2).toFixed(2) + 's';
      s.style.animationDuration = (2.4 + Math.random() * 2.4).toFixed(2) + 's';
      sparks.appendChild(s);
    }
  }

  // ---------- scroll reveal ----------
  var observer = null;
  if ('IntersectionObserver' in window && !reduceMotion) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  }
  function reveal(el) {
    if (observer) observer.observe(el);
    else el.classList.add('in');
  }
  window.ozeilSwitchReveal = reveal;

  // ---------- intro ----------
  var intro = document.getElementById('switchIntro');
  var started = false;
  var finished = false;
  // frame where the black panel starts sliding off to the left
  var REVEAL_FRAME = 225;

  function startPage() {
    if (started) return;
    started = true;
    body.classList.remove('switch-intro-on');
    body.classList.add('switch-ready');
    document.querySelectorAll('[data-reveal]').forEach(reveal);
  }

  function finishIntro(anim) {
    if (finished) return;
    finished = true;
    startPage();
    if (!intro) return;
    intro.classList.add('done');
    setTimeout(function () {
      if (anim) anim.destroy();
      intro.remove();
    }, 500);
  }

  if (!intro || reduceMotion || !window.lottie) {
    finishIntro(null);
    return;
  }

  // 16:9 composition: fill landscape screens (cropping edges), fit it whole on portrait phones.
  var portrait = window.innerHeight > window.innerWidth;
  var anim = lottie.loadAnimation({
    container: document.getElementById('switchIntroAnim'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: '/the-switch-intro.json?v=2',
    rendererSettings: { preserveAspectRatio: portrait ? 'xMidYMid meet' : 'xMidYMid slice' }
  });
  // the page is revealed behind the panel while it slides away
  anim.addEventListener('enterFrame', function () {
    if (!started && anim.currentFrame >= REVEAL_FRAME) {
      intro.classList.add('reveal');
      startPage();
    }
  });
  anim.addEventListener('complete', function () { finishIntro(anim); });
  anim.addEventListener('data_failed', function () { finishIntro(anim); });

  var skip = document.getElementById('switchIntroSkip');
  if (skip) skip.addEventListener('click', function () { finishIntro(anim); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finishIntro(anim);
  });

  // safety net if the animation never loads or stalls
  setTimeout(function () { finishIntro(anim); }, 12000);
})();
