// Ozeil — mobile navigation: the bar keeps only the logo and a burger button,
// which opens into a panel holding the pages, the login link, the language
// switch, the cart and a close button.
(function () {
  var nav = document.querySelector('header .nav');
  if (!nav || document.getElementById('navPanel')) return;

  var center = nav.querySelector('.nav-center');
  var logo = nav.querySelector('.nav-logo');
  var loginPill = nav.querySelector('.nav-pill');
  var end = nav.querySelector('.nav-end');
  if (!center || !logo) return;

  var isEnglish = document.documentElement.lang === 'en';

  // brand name shown next to the mark on mobile
  if (!logo.querySelector('.nav-logo-name')) {
    var name = document.createElement('span');
    name.className = 'nav-logo-name';
    name.textContent = 'Ozeil';
    logo.appendChild(name);
  }

  // ---------- burger ----------
  var burger = document.createElement('button');
  burger.type = 'button';
  burger.className = 'nav-burger';
  burger.setAttribute('aria-label', isEnglish ? 'Open the menu' : 'Ouvrir le menu');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-controls', 'navPanel');
  burger.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(burger);

  // ---------- panel ----------
  var panel = document.createElement('div');
  panel.className = 'nav-panel';
  panel.id = 'navPanel';

  var top = document.createElement('div');
  top.className = 'nav-panel-top';

  var lang = nav.querySelector('.nav-lang-link');
  if (lang) top.appendChild(lang.cloneNode(true));

  var cart = end ? end.querySelector('.nav-icon-btn') : null;
  if (cart) top.appendChild(cart.cloneNode(true));

  var close = document.createElement('button');
  close.type = 'button';
  close.className = 'nav-panel-close';
  close.setAttribute('aria-label', isEnglish ? 'Close the menu' : 'Fermer le menu');
  close.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';
  top.appendChild(close);
  panel.appendChild(top);

  var links = document.createElement('div');
  links.className = 'nav-panel-links';
  center.querySelectorAll('.nav-link').forEach(function (a) {
    links.appendChild(a.cloneNode(true));
  });
  panel.appendChild(links);

  if (loginPill) {
    var login = loginPill.cloneNode(true);
    login.classList.add('nav-panel-login');
    panel.appendChild(login);
  }

  nav.appendChild(panel);

  // ---------- open / close ----------
  var open = false;
  function setOpen(next) {
    open = next;
    nav.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-menu-open', open);
    if (open) {
      var first = panel.querySelector('.nav-panel-links a');
      if (first) first.focus({ preventScroll: true });
    }
  }

  burger.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!open);
  });
  close.addEventListener('click', function () {
    setOpen(false);
    burger.focus({ preventScroll: true });
  });
  panel.addEventListener('click', function (e) { e.stopPropagation(); });
  document.addEventListener('click', function () { if (open) setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      burger.focus({ preventScroll: true });
    }
  });
  window.addEventListener('resize', function () { if (open && window.innerWidth > 720) setOpen(false); });
})();
