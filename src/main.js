import { cargarRutas, cargarLugares, cargarServicios, initOperaciones } from './modulos/operaciones.js';
import { cargarAutobuses, cargarConductores, cargarRevisiones, cargarReparaciones, initFlota } from './modulos/flota.js';
import { cargarPasajeros, cargarBilletes, initVentas } from './modulos/ventas.js';

// ==========================================
// LÓGICA DE NAVEGACIÓN (MENÚ PRINCIPAL)
// ==========================================
const vistas = document.querySelectorAll('.vista');
const botonesVolver = document.querySelectorAll('.btn-volver');

function mostrarVista(idVista) {
  vistas.forEach(vista => vista.classList.remove('activa'));
  document.getElementById(idVista).classList.add('activa');
}

document.getElementById('nav-ventas').addEventListener('click', () => mostrarVista('vista-ventas'));
document.getElementById('nav-operaciones').addEventListener('click', () => mostrarVista('vista-operaciones'));
document.getElementById('nav-flota').addEventListener('click', () => mostrarVista('vista-flota'));

botonesVolver.forEach(btn => {
  btn.addEventListener('click', () => mostrarVista('vista-menu'));
});

// ==========================================
// RECARGA GLOBAL (Inyección de Dependencias)
// ==========================================
function recargarTodo() {
  cargarRutas(recargarTodo);
  cargarLugares(recargarTodo);
  cargarServicios(recargarTodo);

  cargarAutobuses(recargarTodo);
  cargarConductores(recargarTodo);
  cargarRevisiones(recargarTodo);
  cargarReparaciones(recargarTodo);

  cargarPasajeros(recargarTodo);
  cargarBilletes(recargarTodo);
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
// 1. Conectar los eventos Submit
initOperaciones(recargarTodo);
initFlota(recargarTodo);
initVentas(recargarTodo);

// ==========================================
// AUTENTICACIÓN Y SEGURIDAD
// ==========================================
const vistaLogin = document.getElementById('vista-login');
const appContenedor = document.getElementById('app-contenedor');
const formLogin = document.getElementById('form-login');
const btnLogout = document.getElementById('btn-logout');

// Función que decide qué pantalla mostrar
async function verificarSesion() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (session) {
    // Si hay sesión guardada: Oculta el login, muestra la app y descarga los datos
    vistaLogin.style.display = 'none';
    appContenedor.style.display = 'block';
    recargarTodo();
  } else {
    // Si no hay sesión: Muestra el login y oculta la app
    vistaLogin.style.display = 'flex';
    appContenedor.style.display = 'none';
  }
}

// Evento para procesar el inicio de sesión
if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    // Conectar con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert('Credenciales incorrectas o usuario no encontrado.');
      console.error(error);
    } else {
      // Limpiar formulario y verificar sesión para entrar
      formLogin.reset();
      verificarSesion();
    }
  });
}

// Evento para cerrar sesión
if (btnLogout) {
  btnLogout.addEventListener('click', async () => {
    const confirmar = confirm('¿Deseas cerrar la sesión segura?');
    if (confirmar) {
      await supabase.auth.signOut();
      verificarSesion(); // Te devolverá a la pantalla de login
    }
  });
}

// INICIALIZACIÓN
// En lugar de cargar todo directamente, primero verificamos quién entra
initOperaciones(recargarTodo);
initFlota(recargarTodo);
initVentas(recargarTodo);

verificarSesion();