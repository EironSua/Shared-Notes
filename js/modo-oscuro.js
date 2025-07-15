// archivo modo-oscuro-global.js (o directamente en un <script> en cada página)

window.addEventListener('DOMContentLoaded', () => {
  const modoGuardado = localStorage.getItem('modo') || 'claro';
  if (modoGuardado === 'oscuro') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});