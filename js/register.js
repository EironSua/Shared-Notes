// js/register.js

import { registrarUsuario } from './auth.js';

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  
  const nombre = document.getElementById('nombre').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();
  
  const genero = document.getElementById('genero').value;

  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  try {
    await registrarUsuario(email, password, nombre, genero);
    alert('Registro exitoso. Inicia sesión.');
    window.location.href = 'login.html';
  } catch (error) {
    alert('Error al registrar: ' + error.message);
  }
});

