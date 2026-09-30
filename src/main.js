import { supabase } from '../supabase.js';

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

initOperaciones(recargarTodo);
initFlota(recargarTodo);
initVentas(recargarTodo);

// ==========================================
// LÓGICA DE AUTENTICACIÓN 
// ==========================================
async function verificarSesion() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (session) {
    // Si hay sesión: Muestra la app y descarga los datos de Supabase
    vistaLogin.style.display = 'none';
    appContenedor.style.display = 'block';
    recargarTodo();
  } else {
    // Si no hay sesión: Muestra solo el login
    vistaLogin.style.display = 'flex';
    appContenedor.style.display = 'none';
  }
}

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

if (btnLogout) {
  btnLogout.addEventListener('click', async (e) => {
    e.preventDefault();
    const confirmar = confirm('¿Deseas cerrar la sesión segura?');
    if (confirmar) {
      await supabase.auth.signOut();
      verificarSesion(); // Regresa al login
    }
  });
}

// ==========================================
// NAVEGACIÓN Y ARRANQUE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.content-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Evita que el botón de cerrar sesión active la lógica de pestañas
      if (e.target.id === 'btn-logout') return;

      e.preventDefault();
      navItems.forEach(nav => nav.classList.remove('active'));
      sections.forEach(section => section.classList.remove('active'));

      e.target.classList.add('active');
      const targetId = e.target.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
      }
    });
  });

  // Verificamos quién entra en lugar de forzar la carga
  verificarSesion();
});