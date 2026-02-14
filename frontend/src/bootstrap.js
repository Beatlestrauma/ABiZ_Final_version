/**
 * Minimal bootstrap: load the app via dynamic import so we can catch
 * load/import errors and show them instead of staying on "Loading ABiZ…"
 */
const root = document.getElementById('root');
if (!root) {
  document.body.innerHTML = '<div style="padding:20px;font-family:sans-serif;">No #root element.</div>';
} else {
  root.innerHTML = '<div style="padding:2rem;text-align:center;font-family:Inter,sans-serif;color:#ff5e5b;font-size:1.25rem;">Loading ABiZ…</div>';
  import('./main.jsx').catch(function (err) {
    const msg = (err && err.message) ? err.message : String(err);
    root.innerHTML =
      '<div style="padding:2rem;max-width:32rem;margin:0 auto;font-family:Inter,sans-serif;text-align:center;">' +
      '<h1 style="color:#ff5e5b;margin-bottom:1rem;">ABiZ</h1>' +
      '<p style="color:#1a1a1a;margin-bottom:0.5rem;">App failed to load:</p>' +
      '<pre style="text-align:left;background:#f5f5f5;padding:1rem;border-radius:8px;overflow:auto;font-size:0.875rem;">' +
      escapeHtml(msg) +
      '</pre>' +
      '<button onclick="location.reload()" style="margin-top:1rem;padding:0.5rem 1rem;background:#ff5e5b;color:white;border:none;border-radius:8px;cursor:pointer;">Reload</button>' +
      '</div>';
    console.error('ABiZ load error:', err);
  });
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}
