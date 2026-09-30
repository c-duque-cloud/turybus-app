import { supabase } from '../supabase.js';

import { cargarRutas, cargarLugares, cargarServicios, initOperaciones } from './modulos/operaciones.js';
import { cargarAutobuses, cargarConductores, cargarRevisiones, cargarReparaciones, initFlota } from './modulos/flota.js';
import { cargarPasajeros, cargarBilletes, initVentas } from './modulos/ventas.js';

// Carga completa de todos los módulos sin restricciones
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

// Lógica Visual: Menú de Pestañas
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.content-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
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

  // Ejecutar carga inicial de datos
  recargarTodo();
});