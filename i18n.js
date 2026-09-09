// Ozeil — tiny helper so shared scripts can pick French or English text.
// The page declares its language via <html lang="fr"> or <html lang="en">.
(function () {
  window.ozeilLang = (document.documentElement.lang || 'fr').slice(0, 2).toLowerCase();
  window.ozeilText = function (frText, enText) {
    if (window.ozeilLang === 'en' && enText) return enText;
    return frText || '';
  };
})();
