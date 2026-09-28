import { supabase } from '../../supabase.js';
import { crearFila, crearBotonEditar } from '../utils/componentes.js';
import { crearBotonEliminar, guardarOActualizar } from '../utils/api.js';

export async function cargarPasajeros(callbackRecarga) {
  const { data, error } = await supabase.from('pasajeros').select('*');
  if (error) return console.error(error);

  const listaPasajeros = document.getElementById('lista-pasajeros');
  const selectPasajero = document.getElementById('select-pasajero');

  if (listaPasajeros) listaPasajeros.innerHTML = '';
  if (selectPasajero) selectPasajero.innerHTML = '<option value="">Seleccione Pasajero...</option>';

  data.forEach(p => {
    const principal = `<strong>[${p.dni}] ${p.nombre_apellidos}</strong>`;
    const detalles = `📞 <strong>Tel:</strong> ${p.telefono}`; // Teléfono movido a detalles

    const btnEdit = crearBotonEditar(document.getElementById('form-pasajero'), p.dni, { 'dni-pasajero': p.dni, 'nombre-pasajero': p.nombre_apellidos, 'tel-pasajero': p.telefono });
    const btnDel = crearBotonEliminar('pasajeros', 'dni', p.dni, p.nombre_apellidos, callbackRecarga);

    listaPasajeros.appendChild(crearFila(principal, detalles, btnEdit, btnDel));
    if (selectPasajero) selectPasajero.insertAdjacentHTML('beforeend', `<option value="${p.dni}">${p.nombre_apellidos}</option>`);
  });
}

export async function cargarBilletes(callbackRecarga) {
  const { data, error } = await supabase.from('billetes').select('id_billete, dni_pasajero, id_servicio, fecha_viaje, hora_llegada_prevista, pasajeros(nombre_apellidos, telefono), servicios_diarios(hora_salida, rutas(nombre))');
  if (error) return console.error(error);

  const listaBilletes = document.getElementById('lista-billetes');
  if (listaBilletes) listaBilletes.innerHTML = '';

  data.forEach(b => {
    const ruta = b.servicios_diarios?.rutas?.nombre || 'Ruta no asignada';
    const salida = b.servicios_diarios?.hora_salida || 'Sin hora';

    const principal = `<strong>🎟️ Ticket #${b.id_billete}</strong> - ${b.pasajeros?.nombre_apellidos}`;
    const detalles = `<strong>Destino:</strong> ${ruta}<br><strong>Fecha:</strong> ${b.fecha_viaje}<br><strong>Salida:</strong> ${salida} | <strong>Llegada:</strong> ${b.hora_llegada_prevista}<br><strong>Tel. Pasajero:</strong> ${b.pasajeros?.telefono}`;

    const btnEdit = crearBotonEditar(document.getElementById('form-billete'), b.id_billete, { 'select-pasajero': b.dni_pasajero, 'select-servicio-billete': b.id_servicio, 'fecha-viaje': b.fecha_viaje, 'hora-llegada-prevista': b.hora_llegada_prevista });
    const btnDel = crearBotonEliminar('billetes', 'id_billete', b.id_billete, `Ticket #${b.id_billete}`, callbackRecarga);

    listaBilletes.appendChild(crearFila(principal, detalles, btnEdit, btnDel));
  });
}

export function initVentas(callbackRecarga) {
  document.getElementById('form-pasajero')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarOActualizar('pasajeros', 'dni', { dni: document.getElementById('dni-pasajero').value, nombre_apellidos: document.getElementById('nombre-pasajero').value, telefono: document.getElementById('tel-pasajero').value }, e.target, callbackRecarga);
  });

  document.getElementById('form-billete')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarOActualizar('billetes', 'id_billete', { dni_pasajero: document.getElementById('select-pasajero').value, id_servicio: parseInt(document.getElementById('select-servicio-billete').value), fecha_viaje: document.getElementById('fecha-viaje').value, hora_llegada_prevista: document.getElementById('hora-llegada-prevista').value }, e.target, callbackRecarga);
  });
}