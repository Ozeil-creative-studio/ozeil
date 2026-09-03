// Ozeil — blurred loading overlay shown while the page's assets load, using the brand Lottie animation.
(function () {
  var overlay = document.getElementById('loadingOverlay');
  var container = document.getElementById('loadingLottie');
  if (!overlay || !container) return;

  var anim = null;
  if (window.lottie) {
    anim = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'loading-animation.json'
    });
  }

  function hideOverlay() {
    document.body.classList.remove('is-loading');
    overlay.classList.add('hidden');
    setTimeout(function () {
      if (anim) anim.destroy();
      overlay.remove();
    }, 500);
  }

  if (document.readyState === 'complete') {
    hideOverlay();
  } else {
    window.addEventListener('load', hideOverlay);
    // safety net in case the load event is delayed by a slow third-party asset
    setTimeout(hideOverlay, 6000);
  }
})();
