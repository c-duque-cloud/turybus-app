import { supabase } from '../supabase.js';

// Importación de módulos
import { cargarRutas, cargarLugares, cargarServicios, initOperaciones } from './modulos/operaciones.js';
import { cargarAutobuses, cargarConductores, cargarRevisiones, cargarReparaciones, initFlota } from './modulos/flota.js';
import { cargarPasajeros, cargarBilletes, initVentas } from './modulos/ventas.js';

// ==========================================
// ELEMENTOS DEL DOM DE AUTENTICACIÓN
// ==========================================
const vistaLogin = document.getElementById('vista-login');
const appContenedor = document.getElementById('app-contenedor');
const formLogin = document.getElementById('form-login');
const btnLogout = document.getElementById('btn-logout');

// ==========================================
// DESCARGA Y MAPEO DE DATOS
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

// Inicialización de los formularios
initOperaciones(recargarTodo);
initFlota(recargarTodo);
initVentas(recargarTodo);

// ==========================================
// LÓGICA DE AUTENTICACIÓN (LOGIN)
// ==========================================
async function verificarSesion() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (session) {
    // Sesión activa: Oculta login, muestra app, descarga datos
    vistaLogin.style.display = 'none';
    appContenedor.style.display = 'block';
    recargarTodo();
  } else {
    // Sin sesión: Muestra login, oculta app
    vistaLogin.style.display = 'flex';
    appContenedor.style.display = 'none';
  }
}

// Evento de Iniciar Sesión
if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert('Credenciales incorrectas o usuario no encontrado.');
      console.error(error);
    } else {
      formLogin.reset();
      verificarSesion();
    }
  });
}

// Evento de Cerrar Sesión
if (btnLogout) {
  btnLogout.addEventListener('click', async (e) => {
    e.preventDefault();
    const confirmar = confirm('¿Deseas cerrar la sesión segura?');
    if (confirmar) {
      await supabase.auth.signOut();
      verificarSesion(); // Regresa al estado de login
    }
  });
}

// ==========================================
// NAVEGACIÓN DE PESTAÑAS Y ARRANQUE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.content-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Ignoramos el clic si es el botón de cerrar sesión
      if (e.target.id === 'btn-logout') return;

      e.preventDefault();

      // Limpiamos clases activas
      navItems.forEach(nav => nav.classList.remove('active'));
      sections.forEach(section => section.classList.remove('active'));

      // Activamos la pestaña seleccionada
      e.target.classList.add('active');
      const targetId = e.target.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
      }
    });
  });

  // Verificamos el estado del usuario al abrir la página
  verificarSesion();
});