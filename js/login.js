// js/login.js

import { loginUsuario } from './auth.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const uid = await loginUsuario(email, password);
    localStorage.setItem('uid', uid);
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert('Error al iniciar sesión: ' + error.message);
  }
});
