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

// 2. Cargar los datos iniciales
recargarTodo();