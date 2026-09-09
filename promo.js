// Ozeil — renders the site-wide announcement (table `promo`) as a top bar and/or a section below the hero.
(function () {
  function buildBar(p) {
    var bar = document.createElement('div');
    bar.className = 'promo-bar';

    if (p.image_url) {
      var img = document.createElement('img');
      img.src = p.image_url;
      img.alt = '';
      bar.appendChild(img);
    }

    var text = document.createElement('div');
    text.className = 'promo-bar-text';
    var heading = window.ozeilText(p.heading, p.heading_en);
    var body = window.ozeilText(p.body, p.body_en);
    var buttonText = window.ozeilText(p.button_text, p.button_text_en);
    if (heading) {
      var strong = document.createElement('strong');
      strong.textContent = heading;
      text.appendChild(strong);
    }
    if (body) {
      var span = document.createElement('span');
      span.textContent = body;
      text.appendChild(span);
    }
    bar.appendChild(text);

    if (buttonText && p.button_url) {
      var a = document.createElement('a');
      a.className = 'promo-bar-btn';
      a.href = p.button_url;
      a.textContent = buttonText;
      bar.appendChild(a);
    }
    return bar;
  }

  function buildSection(p) {
    var section = document.createElement('section');
    section.className = 'section promo-section';
    if (p.image_url) section.style.backgroundImage = 'url(' + p.image_url + ')';

    var overlay = document.createElement('div');
    overlay.className = 'promo-section-overlay';

    var container = document.createElement('div');
    container.className = 'container';
    var content = document.createElement('div');
    content.className = 'promo-section-content';
    var heading = window.ozeilText(p.heading, p.heading_en);
    var body = window.ozeilText(p.body, p.body_en);
    var buttonText = window.ozeilText(p.button_text, p.button_text_en);
    if (heading) {
      var h2 = document.createElement('h2');
      h2.textContent = heading;
      content.appendChild(h2);
    }
    if (body) {
      var pEl = document.createElement('p');
      pEl.textContent = body;
      content.appendChild(pEl);
    }
    if (buttonText && p.button_url) {
      var a = document.createElement('a');
      a.className = 'btn btn-primary';
      a.href = p.button_url;
      a.textContent = buttonText;
      content.appendChild(a);
    }
    container.appendChild(content);
    section.appendChild(overlay);
    section.appendChild(container);
    return section;
  }

  async function renderPromo() {
    if (!window.ozeilSupabase) return;
    var res = await window.ozeilSupabase.from('promo').select('*').eq('active', true).limit(1).maybeSingle();
    if (res.error || !res.data) return;
    var promo = res.data;

    var barHost = document.getElementById('promoBarHost');
    if (barHost && (promo.placement === 'bande' || promo.placement === 'les_deux')) {
      barHost.appendChild(buildBar(promo));
    }

    var sectionHost = document.getElementById('promoSectionHost');
    if (sectionHost && (promo.placement === 'section' || promo.placement === 'les_deux')) {
      sectionHost.appendChild(buildSection(promo));
    }
  }

  window.ozeilRenderPromo = renderPromo;
})();
