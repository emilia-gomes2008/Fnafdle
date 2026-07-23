// Cosmetic-only: strips "frontend/dist/pages/" from the visible address bar URL.
// The real file still loads from that path - this just rewrites what's displayed,
// via history.replaceState (no navigation, no reload). If the shortened URL is later
// reloaded or shared, the site's custom 404.html redirects it back to the real path.
// Only runs on the actual GitHub Pages deployment: that 404.html fallback isn't present
// on localhost/LAN dev servers, so reloading the shortened URL there would just 404.
(function () {
  // Pin every relative path (css/js/images, including ones injected by game JS later,
  // e.g. result screenshots) to the real directory *before* changing what the address bar
  // shows. Without this, anything resolved after the URL is rewritten - even much later,
  // by in-game code - would resolve against the shortened fake path instead.
  var realPath = window.location.pathname;
  var dir = realPath.slice(0, realPath.lastIndexOf('/') + 1);
  var base = document.createElement('base');
  base.href = window.location.origin + dir;
  document.head.insertBefore(base, document.head.firstChild);

  if (!/\.github\.io$/.test(window.location.hostname)) return;
  var marker = '/frontend/dist/pages/';
  var idx = realPath.indexOf(marker);
  if (idx === -1) return;
  var clean = realPath.slice(0, idx) + '/' + realPath.slice(idx + marker.length);
  window.history.replaceState(window.history.state, document.title, clean + window.location.search + window.location.hash);
})();
