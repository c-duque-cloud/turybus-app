import { supabase } from '../../supabase.js';
import { crearFila, crearBotonEditar } from '../utils/componentes.js';
import { crearBotonEliminar, guardarOActualizar } from '../utils/api.js';

export async function cargarRutas(callbackRecarga) {
  const { data, error } = await supabase.from('rutas').select('*');
  if (error) return console.error(error);

  const listaRutas = document.getElementById('lista-rutas');
  const selectRuta = document.getElementById('select-ruta');
  const selectRutaLugar = document.getElementById('select-ruta-lugar');

  if (listaRutas) listaRutas.innerHTML = '';
  if (selectRuta) selectRuta.innerHTML = '<option value="">Seleccione una Ruta...</option>';
  if (selectRutaLugar) selectRutaLugar.innerHTML = '<option value="">Seleccione la Ruta...</option>';

  data.forEach(ruta => {
    const principal = `<strong>ID: ${ruta.id_ruta}</strong> | ${ruta.nombre} - $${ruta.importe_fijo}`;
    const btnEdit = crearBotonEditar(document.getElementById('form-ruta'), ruta.id_ruta, { 'nombre-ruta': ruta.nombre, 'precio-ruta': ruta.importe_fijo });
    const btnDel = crearBotonEliminar('rutas', 'id_ruta', ruta.id_ruta, ruta.nombre, callbackRecarga);

    listaRutas.appendChild(crearFila(principal, null, btnEdit, btnDel));
    if (selectRuta) selectRuta.insertAdjacentHTML('beforeend', `<option value="${ruta.id_ruta}">${ruta.nombre}</option>`);
    if (selectRutaLugar) selectRutaLugar.insertAdjacentHTML('beforeend', `<option value="${ruta.id_ruta}">${ruta.nombre}</option>`);
  });
}

export async function cargarLugares(callbackRecarga) {
  const { data, error } = await supabase.from('lugares').select('*, rutas(nombre)').order('id_ruta').order('orden');
  if (error) return console.error(error);

  const listaLugares = document.getElementById('lista-lugares');
  if (listaLugares) listaLugares.innerHTML = '';

  data.forEach(lugar => {
    const principal = `<strong>${lugar.rutas?.nombre}</strong> - Parada ${lugar.orden}: ${lugar.nombre_lugar}`;
    const actividad = lugar.actividad ? `<br><strong>Actividad:</strong> ${lugar.actividad}` : '';
    const parada = lugar.tiempo_parada ? ` | <strong>Tiempo detenido:</strong> ${lugar.tiempo_parada}` : '';
    const detalles = `<strong>Llegada desde salida:</strong> ${lugar.tiempo_desde_salida} ${parada} ${actividad}`;

    const btnEdit = crearBotonEditar(document.getElementById('form-lugar'), lugar.id_lugar, { 'select-ruta-lugar': lugar.id_ruta, 'orden-lugar': lugar.orden, 'nombre-lugar': lugar.nombre_lugar, 'actividad-lugar': lugar.actividad, 'tiempo-desde': lugar.tiempo_desde_salida, 'tiempo-parada': lugar.tiempo_parada });
    const btnDel = crearBotonEliminar('lugares', 'id_lugar', lugar.id_lugar, lugar.nombre_lugar, callbackRecarga);

    listaLugares.appendChild(crearFila(principal, detalles, btnEdit, btnDel));
  });
}

export async function cargarServicios(callbackRecarga) {
  const { data, error } = await supabase.from('servicios_diarios').select('id_servicio, id_ruta, hora_salida, dias_programados, matricula_autobus, dni_conductor, rutas(nombre), conductores(nombre_apellidos)');
  if (error) return console.error(error);

  const listaServicios = document.getElementById('lista-servicios');
  const selectServicioBillete = document.getElementById('select-servicio-billete');

  if (listaServicios) listaServicios.innerHTML = '';
  if (selectServicioBillete) selectServicioBillete.innerHTML = '<option value="">Seleccione Viaje...</option>';

  data.forEach(srv => {
    const nombreRuta = srv.rutas?.nombre || 'Desconocida';
    const principal = `<strong>Servicio ${nombreRuta}</strong> | 🕐 Salida: ${srv.hora_salida}`;
    const detalles = `<strong>Frecuencia:</strong> ${srv.dias_programados}<br><strong>Bus asignado:</strong> ${srv.matricula_autobus}<br><strong>Conductor:</strong> ${srv.conductores?.nombre_apellidos} (${srv.dni_conductor})`;

    const btnEdit = crearBotonEditar(document.getElementById('form-servicio'), srv.id_servicio, { 'select-ruta': srv.id_ruta, 'select-autobus': srv.matricula_autobus, 'select-conductor': srv.dni_conductor, 'hora-salida': srv.hora_salida, 'dias-prog': srv.dias_programados });
    const btnDel = crearBotonEliminar('servicios_diarios', 'id_servicio', srv.id_servicio, `Servicio de ${nombreRuta}`, callbackRecarga);

    listaServicios.appendChild(crearFila(principal, detalles, btnEdit, btnDel));
    if (selectServicioBillete) selectServicioBillete.insertAdjacentHTML('beforeend', `<option value="${srv.id_servicio}">${nombreRuta} - Salida: ${srv.hora_salida}</option>`);
  });
}

export function initOperaciones(callbackRecarga) {
  document.getElementById('form-ruta')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarOActualizar('rutas', 'id_ruta', { nombre: document.getElementById('nombre-ruta').value, importe_fijo: parseFloat(document.getElementById('precio-ruta').value) }, e.target, callbackRecarga);
  });

  document.getElementById('form-lugar')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarOActualizar('lugares', 'id_lugar', { id_ruta: parseInt(document.getElementById('select-ruta-lugar').value), orden: parseInt(document.getElementById('orden-lugar').value), nombre_lugar: document.getElementById('nombre-lugar').value, actividad: document.getElementById('actividad-lugar').value || null, tiempo_desde_salida: document.getElementById('tiempo-desde').value, tiempo_parada: document.getElementById('tiempo-parada').value || null }, e.target, callbackRecarga);
  });

  document.getElementById('form-servicio')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarOActualizar('servicios_diarios', 'id_servicio', { id_ruta: parseInt(document.getElementById('select-ruta').value), matricula_autobus: document.getElementById('select-autobus').value, dni_conductor: document.getElementById('select-conductor').value, hora_salida: document.getElementById('hora-salida').value, dias_programados: document.getElementById('dias-prog').value }, e.target, callbackRecarga);
  });
}