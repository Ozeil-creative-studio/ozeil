// Ozeil — renders dashboard-managed content blocks (table `page_sections`) into #dynamicSections.
(function () {
  function el(tag, cls) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  function addButton(host, s) {
    if (!s.button_text || !s.button_url) return;
    var a = document.createElement('a');
    a.className = 'btn btn-primary';
    a.href = s.button_url;
    a.textContent = s.button_text;
    host.appendChild(a);
  }

  function buildTexte(s) {
    var section = el('section', 'section dyn-section');
    var container = el('div', 'container');
    var head = el('div', 'section-head');
    var h2 = document.createElement('h2');
    h2.textContent = s.heading || '';
    var p = document.createElement('p');
    p.textContent = s.body || '';
    head.appendChild(h2);
    head.appendChild(p);
    container.appendChild(head);
    section.appendChild(container);
    return section;
  }

  function buildImageTexte(s) {
    var section = el('section', 'section dyn-section');
    var container = el('div', 'container');
    var wrap = el('div', 'dyn-image-text' + (s.image_side === 'right' ? ' dyn-image-right' : ''));

    var imgWrap = el('div', 'dyn-image');
    var img = document.createElement('img');
    img.src = s.image_url || '';
    img.alt = s.heading || '';
    imgWrap.appendChild(img);

    var textWrap = el('div', 'dyn-text');
    var h2 = document.createElement('h2');
    h2.textContent = s.heading || '';
    var p = document.createElement('p');
    p.textContent = s.body || '';
    textWrap.appendChild(h2);
    textWrap.appendChild(p);
    addButton(textWrap, s);

    wrap.appendChild(imgWrap);
    wrap.appendChild(textWrap);
    container.appendChild(wrap);
    section.appendChild(container);
    return section;
  }

  function buildBandeau(s) {
    var section = el('section', 'section dyn-section dyn-bandeau');
    if (s.image_url) section.style.backgroundImage = 'url(' + s.image_url + ')';
    var overlay = el('div', 'dyn-bandeau-overlay');
    var container = el('div', 'container');
    var content = el('div', 'dyn-bandeau-content');
    var h2 = document.createElement('h2');
    h2.textContent = s.heading || '';
    var p = document.createElement('p');
    p.textContent = s.body || '';
    content.appendChild(h2);
    content.appendChild(p);
    addButton(content, s);
    container.appendChild(content);
    section.appendChild(overlay);
    section.appendChild(container);
    return section;
  }

  var builders = { texte: buildTexte, image_texte: buildImageTexte, bandeau: buildBandeau };

  async function renderPageSections(page) {
    var host = document.getElementById('dynamicSections');
    if (!host || !window.ozeilSupabase) return;
    var res = await window.ozeilSupabase
      .from('page_sections')
      .select('*')
      .eq('page', page)
      .order('position', { ascending: true });
    if (res.error || !res.data) return;
    res.data.forEach(function (s) {
      var build = builders[s.type];
      if (build) host.appendChild(build(s));
    });
  }

  window.ozeilRenderPageSections = renderPageSections;
})();
