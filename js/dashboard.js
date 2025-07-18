// js/dashboard.js

import { obtenerDatosUsuario, cerrarSesion } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  const uid = localStorage.getItem('uid');
  if (!uid) {
    window.location.href = 'login.html';
    return;
  }

  const userData = await obtenerDatosUsuario(uid);
  if (userData) {
    document.getElementById('nombre-usuario').textContent = userData.nombre;
    document.getElementById('codigo-vinculo').textContent = userData.codigoVinculo;
  }

  // Menú lateral
  const toggleButton = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

toggleButton.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
});

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await cerrarSesion();
      localStorage.removeItem('uid');
      window.location.href = 'login.html';
    });
  }
});



