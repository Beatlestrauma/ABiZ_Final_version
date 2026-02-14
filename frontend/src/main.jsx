import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

function showLoadError(message) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = '<div style="padding:2rem;max-width:28rem;margin:0 auto;font-family:Inter,sans-serif;text-align:center;"><h1 style="color:#ff5e5b;margin-bottom:1rem;">ABiZ</h1><p style="color:#1a1a1a;">' + message + '</p><button onclick="location.reload()" style="margin-top:1rem;padding:0.5rem 1rem;background:#ff5e5b;color:white;border:none;border-radius:8px;cursor:pointer;">Reload</button></div>';
  }
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  document.body.innerHTML = '<div style="padding:20px;font-family:sans-serif;">No root element found. Check index.html for id="root".</div>';
} else {
  try {
    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    // Load Capacitor after app is up so it never blocks or breaks initial render
    setTimeout(() => {
      const cap = document.createElement('script');
      cap.src = 'https://cdn.jsdelivr.net/npm/@capacitor/core@latest/dist/capacitor.js';
      cap.async = true;
      document.body.appendChild(cap);
    }, 100);
  } catch (err) {
    console.error('App failed to render:', err);
    showLoadError('App failed to start. ' + (err && err.message ? err.message : ''));
  }
}

