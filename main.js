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
      heroMark.style.transform = 'translateY(-' + offset + 'px)';
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
    var modalThumbs = document.getElementById('modalThumbs');
    var modalBuyBtn = document.getElementById('modalBuyBtn');
    var modalVariantSelect = document.getElementById('modalVariantSelect');

    function formatModalPrice(n) {
      return Number(n).toFixed(2).replace('.', ',') + ' $';
    }

    function applyModalBuy(href) {
      if (!modalBuyBtn) return;
      if (href) {
        modalBuyBtn.href = href;
        modalBuyBtn.target = '_blank';
        modalBuyBtn.rel = 'noopener';
        modalBuyBtn.removeAttribute('disabled');
      } else {
        modalBuyBtn.href = '#';
        modalBuyBtn.removeAttribute('target');
        modalBuyBtn.setAttribute('disabled', '');
      }
    }

    function renderModalThumbs(mainImg, galleryJson) {
      if (!modalThumbs) return;
      modalThumbs.innerHTML = '';
      var gallery = [];
      try { gallery = galleryJson ? JSON.parse(galleryJson) : []; } catch (e) { gallery = []; }
      var all = [mainImg].concat(gallery).filter(Boolean);
      if (all.length <= 1) return;
      all.forEach(function (url, i) {
        var thumb = document.createElement('button');
        thumb.type = 'button';
        thumb.className = 'modal-thumb' + (i === 0 ? ' active' : '');
        var img = document.createElement('img');
        img.src = url;
        img.alt = '';
        thumb.appendChild(img);
        thumb.addEventListener('click', function () {
          modalImg.src = url;
          modalThumbs.querySelectorAll('.modal-thumb').forEach(function (t) { t.classList.remove('active'); });
          thumb.classList.add('active');
        });
        modalThumbs.appendChild(thumb);
      });
    }

    function openModal(btn) {
      modalTitle.textContent = btn.dataset.name;
      modalDesc.textContent = btn.dataset.desc;
      modalImg.src = btn.dataset.img;
      modalImg.alt = btn.dataset.name;
      renderModalThumbs(btn.dataset.img, btn.dataset.gallery);

      var basePrice = btn.dataset.price;
      var baseHref = btn.dataset.printify || '';
      var variants = [];
      try { variants = btn.dataset.variants ? JSON.parse(btn.dataset.variants) : []; } catch (e) { variants = []; }

      if (modalVariantSelect) {
        modalVariantSelect.innerHTML = '';
        if (variants.length > 0) {
          variants.forEach(function (v, i) {
            var opt = document.createElement('option');
            opt.value = i;
            opt.textContent = window.ozeilText(v.label, v.label_en);
            modalVariantSelect.appendChild(opt);
          });
          modalVariantSelect.style.display = '';
          modalVariantSelect.value = 0;
          modalVariantSelect.onchange = function () {
            var v = variants[modalVariantSelect.value];
            modalPrice.textContent = (v && v.price != null) ? formatModalPrice(v.price) : basePrice;
            applyModalBuy((v && v.printify_url) || baseHref);
          };
          var first = variants[0];
          modalPrice.textContent = (first.price != null) ? formatModalPrice(first.price) : basePrice;
          applyModalBuy(first.printify_url || baseHref);
        } else {
          modalVariantSelect.style.display = 'none';
          modalPrice.textContent = basePrice;
          applyModalBuy(baseHref);
        }
      } else {
        modalPrice.textContent = basePrice;
        applyModalBuy(baseHref);
      }

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
