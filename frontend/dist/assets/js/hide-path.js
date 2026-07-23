// Cosmetic-only: strips "frontend/dist/pages/" from the visible address bar URL.
// The real file still loads from that path - this just rewrites what's displayed,
// via history.replaceState (no navigation, no reload). If the shortened URL is later
// reloaded or shared, the site's custom 404.html redirects it back to the real path.
// Only runs on the actual GitHub Pages deployment: that 404.html fallback isn't present
// on localhost/LAN dev servers, so reloading the shortened URL there would just 404.
(function () {
  if (!/\.github\.io$/.test(window.location.hostname)) return;
  var marker = '/frontend/dist/pages/';
  var path = window.location.pathname;
  var idx = path.indexOf(marker);
  if (idx === -1) return;
  var clean = path.slice(0, idx) + '/' + path.slice(idx + marker.length);
  window.history.replaceState(window.history.state, document.title, clean + window.location.search + window.location.hash);
})();
