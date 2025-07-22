import { auth, db } from './firebase-config.js';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

let uid = localStorage.getItem('uid');
if (!uid) window.location.href = 'login.html';

const listaNotas = document.getElementById('lista-notas');
const crearNotaBtn = document.getElementById('crear-nota');
const modal = document.getElementById('modal-edicion');
const tituloInput = document.getElementById('titulo-nota');
const contenidoTextarea = document.getElementById('contenido-nota');
const metaInfo = document.getElementById('meta-info');
const guardarBtn = document.getElementById('guardar-nota');
const eliminarBtn = document.getElementById('eliminar-nota');
const cerrarModalBtn = document.getElementById('cerrar-modal');

let notaActualId = null;

// Cargar notas
async function cargarNotas() {
  listaNotas.innerHTML = '';
  const querySnapshot = await getDocs(collection(db, 'notas'));
  querySnapshot.forEach((docSnap) => {
    const nota = docSnap.data();
    if (nota.creador === uid || (nota.colaboradores || []).includes(uid)) {
      const div = document.createElement('div');
      div.classList.add('nota-preview');
      div.innerHTML = `<h3>${nota.titulo}</h3><p>${nota.contenido.slice(0, 100)}...</p>`;
      div.addEventListener('click', () => abrirNota(docSnap.id, nota));
      listaNotas.appendChild(div);
    }
  });
}

// Abrir nota
function abrirNota(id, nota) {
  notaActualId = id;
  tituloInput.value = nota.titulo;
  contenidoTextarea.value = nota.contenido;
  const fecha = nota.fechaModificacion?.toDate().toLocaleString() || '';
  metaInfo.textContent = `Última modificación: ${fecha} por ${nota.ultimoEditor || 'N/A'}`;
  modal.classList.remove('oculto');
}

// Guardar nota
guardarBtn.addEventListener('click', async () => {
  const titulo = tituloInput.value.trim();
  const contenido = contenidoTextarea.value.trim();

  if (!titulo || !contenido) return alert('Completa ambos campos.');

  if (notaActualId) {
    await updateDoc(doc(db, 'notas', notaActualId), {
      titulo,
      contenido,
      fechaModificacion: serverTimestamp(),
      ultimoEditor: uid
    });
  } else {
    await addDoc(collection(db, 'notas'), {
      titulo,
      contenido,
      creador: uid,
      colaboradores: [],
      fechaModificacion: serverTimestamp(),
      ultimoEditor: uid,
      codigoVinculo: generarCodigoVinculo()
    });
  }

  modal.classList.add('oculto');
  notaActualId = null;
  await cargarNotas();
});

// Eliminar nota
eliminarBtn.addEventListener('click', async () => {
  if (!notaActualId) return;
  const ref = doc(db, 'notas', notaActualId);
  const snap = await getDoc(ref);

  if (snap.exists() && snap.data().creador === uid) {
    await deleteDoc(ref);
    modal.classList.add('oculto');
    await cargarNotas();
  } else {
    alert('Solo el creador puede eliminar esta nota.');
  }
});

// Crear nueva nota
crearNotaBtn.addEventListener('click', () => {
  notaActualId = null;
  tituloInput.value = '';
  contenidoTextarea.value = '';
  metaInfo.textContent = '';
  modal.classList.remove('oculto');
});

// Cerrar modal
cerrarModalBtn.addEventListener('click', () => {
  modal.classList.add('oculto');
  notaActualId = null;
});

function generarCodigoVinculo() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 9; i++) {
    if (i > 0 && i % 3 === 0) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

cargarNotas();
