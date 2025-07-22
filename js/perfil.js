import { auth, db } from './firebase-config.js';
import {
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import {
  signOut,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// Elementos DOM
const dashboardReturn = document.getElementById('dashboardReturn');

const nombreUsuarioElem = document.getElementById('nombreUsuario');
const estadoUsuarioElem = document.getElementById('estadoUsuario');
const correoUsuarioElem = document.getElementById('correoUsuario');

const codigoVinculoElem = document.getElementById('codigoVinculo');
const btnCopiarCodigo = document.getElementById('btnCopiarCodigo');
const btnRegenerarCodigo = document.getElementById('btnRegenerarCodigo');

const vinculadosList = document.getElementById('vinculadosList');
const btnVincular = document.getElementById('btnVincular');

const btnEditar = document.getElementById('btnEditar');
const btnGuardar = document.getElementById('btnGuardar');

const modoClaroBtn = document.getElementById('modoClaro');
const modoOscuroBtn = document.getElementById('modoOscuro');

const btnCerrarSesion = document.getElementById('btnCerrarSesion');
const btnBorrarCuenta = document.getElementById('btnBorrarCuenta');


// Boton de vuelta al dashboard
dashboardReturn.addEventListener('click', () => {
  window.location.href = '../html/dashboard.html';
});


let userGlobal = null;  // Guardar usuario actual
let datosUsuario = null; // Guardar datos Firestore

// Carga datos usuario al iniciar
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = '../html/login.html';
    return;
  }

  userGlobal = user;

  // Traer datos Firestore para cargar perfil con su información (nombre, estado, email y código de vínculo)
  const docRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    datosUsuario = docSnap.data();

    nombreUsuarioElem.textContent = datosUsuario.nombre || 'Nombre de Usuario';
    estadoUsuarioElem.textContent = datosUsuario.estado || '"Frase de estado..."';
    correoUsuarioElem.textContent = user.email;
    codigoVinculoElem.textContent = datosUsuario.codigoVinculo || '---';

    cargarVinculados(datosUsuario.codigoVinculo);
  } else {
    console.warn('No hay datos de usuario en Firestore');
  }
});


// Función para cargar personas vinculadas (simulado)
async function cargarVinculados(codigoVinculo) {
  vinculadosList.innerHTML = '';

  if (!codigoVinculo) return;

  // Busca todos usuarios con mismo código de vínculo excepto el actual
  const q = query(collection(db, 'users'), where('codigoVinculo', '==', codigoVinculo));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(docSnap => {
    if (docSnap.id !== userGlobal.uid) {
      const usuario = docSnap.data();
      const li = document.createElement('li');
      li.textContent = usuario.nombre || 'Usuario vinculado';
      vinculadosList.appendChild(li);
    }
  });

  if (vinculadosList.children.length === 0) {
    vinculadosList.innerHTML = '<li>No hay personas vinculadas.</li>';
  }
}

// Botón copiar código
btnCopiarCodigo.addEventListener('click', () => {
  navigator.clipboard.writeText(codigoVinculoElem.textContent)
    .then(() => alert('Código copiado al portapapeles'))
    .catch(() => alert('No se pudo copiar el código'));
});

// Botón regenerar código
btnRegenerarCodigo.addEventListener('click', async () => {
  if (!confirm('¿Seguro que quieres regenerar el código de vínculo?')) return;

  const nuevoCodigo = generarCodigoVinculo();
  await updateDoc(doc(db, 'users', userGlobal.uid), { codigoVinculo: nuevoCodigo });
  codigoVinculoElem.textContent = nuevoCodigo;

  // Recargar vinculados con nuevo código
  cargarVinculados(nuevoCodigo);

  alert('Código de vínculo regenerado');
});

// Generar código con formato AAA-111-BbB
function generarCodigoVinculo() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 9; i++) {
    if (i === 3 || i === 6) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Botón vincular con otra persona (pendiente implementar lógica)
btnVincular.addEventListener('click', () => {
  alert('Funcionalidad de vinculación no implementada todavía.');
});

// Editar perfil: habilita edición inline y botones
btnEditar.addEventListener('click', () => {
  nombreUsuarioElem.contentEditable = 'true';
  estadoUsuarioElem.contentEditable = 'true';

  btnEditar.style.display = 'none';
  btnGuardar.style.display = 'inline-block';

  nombreUsuarioElem.focus();
});

// Guardar cambios (nombre y estado)
btnGuardar.addEventListener('click', async () => {
  nombreUsuarioElem.contentEditable = 'false';
  estadoUsuarioElem.contentEditable = 'false';

  btnGuardar.style.display = 'none';
  btnEditar.style.display = 'inline-block';

  const nuevoNombre = nombreUsuarioElem.textContent.trim();
  const nuevoEstado = estadoUsuarioElem.textContent.trim();

  await updateDoc(doc(db, 'users', userGlobal.uid), {
    nombre: nuevoNombre,
    estado: nuevoEstado,
  });

  alert('Cambios guardados.');
});

// Modo claro / oscuro

function aplicarModo(modoOscuro) {
  if (modoOscuro) {
    document.body.classList.add('dark-mode');
    modoOscuroBtn.style.display = 'none';
    modoClaroBtn.style.display = 'inline-block';
  } else {
    document.body.classList.remove('dark-mode');
    modoClaroBtn.style.display = 'none';
    modoOscuroBtn.style.display = 'inline-block';
  }
  localStorage.setItem('modoOscuro', modoOscuro);
}

modoOscuroBtn.addEventListener('click', () => aplicarModo(true));
modoClaroBtn.addEventListener('click', () => aplicarModo(false));

// Aplicar modo guardado
const modoGuardado = localStorage.getItem('modoOscuro') === 'true';
aplicarModo(modoGuardado);

// Cerrar sesión
btnCerrarSesion.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = '../html/login.html';
});

// Borrar cuenta (Firestore + Auth)
btnBorrarCuenta.addEventListener('click', async () => {
  if (!confirm('¿Seguro que quieres borrar tu cuenta? Esta acción no se puede deshacer.')) return;

  try {
    // Eliminar datos Firestore
    await deleteDoc(doc(db, 'users', userGlobal.uid));
    // Eliminar usuario Auth
    await userGlobal.delete();

    alert('Cuenta borrada exitosamente');
    window.location.href = '../index.html';
  } catch (error) {
    console.error('Error borrando cuenta:', error);
    alert('Error borrando cuenta. Por favor refresque y vuelva a intentarlo.');
  }
});
