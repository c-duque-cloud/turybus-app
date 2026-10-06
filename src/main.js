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
async function actualizarDashboard() {
  try {
    const [buses, servicios, boletos] = await Promise.all([
      supabase.from('autobuses').select('*', { count: 'exact', head: true }),
      supabase.from('servicios_diarios').select('*', { count: 'exact', head: true }),
      supabase.from('billetes').select('*', { count: 'exact', head: true })
    ]);

    const numBuses = buses.count || 0;
    document.getElementById('dash-autobuses').textContent = numBuses;
    document.getElementById('dash-en-ruta').textContent = Math.floor(numBuses / 2); // Simulado por ahora
    document.getElementById('dash-servicios').textContent = servicios.count || 0;
    document.getElementById('dash-boletos').textContent = boletos.count || 0;
  } catch (err) {
    console.error("Error al actualizar dashboard:", err);
  }
}

function recargarTodo() {
  actualizarDashboard();
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
    vistaLogin.classList.add('hidden');
    appContenedor.classList.remove('hidden');
    recargarTodo();
  } else {
    // Si no hay sesión: Muestra solo el login
    vistaLogin.classList.remove('hidden');
    appContenedor.classList.add('hidden');
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
      Swal.fire({
        icon: 'error',
        title: 'Error de Autenticación',
        text: 'Credenciales incorrectas o usuario no encontrado.'
      });
      console.error(error);
    } else {
      formLogin.reset();
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Sesión iniciada correctamente',
        timer: 1500,
        showConfirmButton: false
      });
      verificarSesion();
    }
  });
}

if (btnLogout) {
  btnLogout.addEventListener('click', async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: 'Cerrar Sesión',
      text: '¿Deseas cerrar tu sesión segura?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
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