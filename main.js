// Ozeil — shared front-end behaviour for the public pages (index.html, boutique.html).
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- scroll-driven parallax (only runs if the relevant elements exist) ----------
  var heroMark = document.getElementById('heroMark');
  var contactMark = document.getElementById('contactMark');
  var contactSection = document.getElementById('contact');
  var aproposMark = document.getElementById('aproposMark');
  var aproposSection = document.getElementById('apropos');

  function clamp01(n) { return Math.max(0, Math.min(1, n)); }

  function updateParallax() {
    var vh = window.innerHeight;

    if (heroMark) {
      var offset = Math.min(window.scrollY * 0.28, 260);
      heroMark.style.transform = 'translate(-50%,0) translateY(-' + offset + 'px)';
    }

    if (contactMark && contactSection) {
      var cRect = contactSection.getBoundingClientRect();
      var cProgress = clamp01((vh - cRect.top) / (vh + cRect.height));
      var x = -20 + cProgress * 140;
      contactMark.style.transform = 'translate(' + x + '%,0)';
    }

    if (aproposMark && aproposSection) {
      var aRect = aproposSection.getBoundingClientRect();
      var aProgress = clamp01((vh - aRect.top) / (vh + aRect.height));
      var y = 70 - aProgress * 140;
      aproposMark.style.transform = 'translateY(' + y + 'px)';
    }
  }

  if (!reduceMotion && (heroMark || contactMark || aproposMark)) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
  }

  // ---------- subtle mouse-follow effect on the feature (nouveauté) photo ----------
  function wireFeatureCardParallax() {
    var featureCard = document.querySelector('.feature-card');
    var featureImg = featureCard ? featureCard.querySelector('img') : null;
    if (!featureCard || !featureImg || reduceMotion) return;
    featureCard.addEventListener('mousemove', function (e) {
      var rect = featureCard.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      var offset = 16;
      featureImg.style.transform = 'translate(calc(-50% + ' + (x * offset) + 'px), calc(-50% + ' + (y * offset) + 'px))';
    });
    featureCard.addEventListener('mouseleave', function () {
      featureImg.style.transform = 'translate(-50%,-50%)';
    });
  }
  wireFeatureCardParallax();
  window.ozeilWireFeatureCardParallax = wireFeatureCardParallax;

  // ---------- product modal ----------
  var backdrop = document.getElementById('modalBackdrop');
  if (backdrop) {
    var modalTitle = document.getElementById('modalTitle');
    var modalPrice = document.getElementById('modalPrice');
    var modalDesc = document.getElementById('modalDesc');
    var modalImg = document.getElementById('modalImg');

    function openModal(btn) {
      modalTitle.textContent = btn.dataset.name;
      modalPrice.textContent = btn.dataset.price;
      modalDesc.textContent = btn.dataset.desc;
      modalImg.src = btn.dataset.img;
      modalImg.alt = btn.dataset.name;
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    function wireModalTriggers() {
      document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
        if (btn.dataset.modalWired) return;
        btn.dataset.modalWired = '1';
        btn.addEventListener('click', function () { openModal(btn); });
      });
    }
    wireModalTriggers();
    window.ozeilWireModalTriggers = wireModalTriggers;

    var closeBtn = document.getElementById('modalCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }
})();
