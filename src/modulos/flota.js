import { supabase } from '../../supabase.js';
import { crearFila, crearBotonEditar } from '../utils/componentes.js';
import { crearBotonEliminar, guardarOActualizar } from '../utils/api.js';

export async function cargarAutobuses(callbackRecarga) {
  const { data, error } = await supabase.from('autobuses').select('*');
  if (error) return console.error(error);

  const listaAutobuses = document.getElementById('lista-autobuses');
  const selectAutobus = document.getElementById('select-autobus');
  const selectBusRev = document.getElementById('select-bus-rev');

  if (listaAutobuses) listaAutobuses.innerHTML = '';
  if (selectAutobus) selectAutobus.innerHTML = '<option value="">Seleccione un Autobús...</option>';
  if (selectBusRev) selectBusRev.innerHTML = '<option value="">Seleccione Autobús...</option>';

  data.forEach(bus => {
    const principal = `<strong>[${bus.matricula}]</strong> ${bus.fabricante} ${bus.modelo} - ${bus.numero_plazas} plz`;
    const btnEdit = crearBotonEditar(document.getElementById('form-autobus'), bus.matricula, { 'matricula-bus': bus.matricula, 'modelo-bus': bus.modelo, 'fabricante-bus': bus.fabricante, 'plazas-bus': bus.numero_plazas });
    const btnDel = crearBotonEliminar('autobuses', 'matricula', bus.matricula, bus.matricula, callbackRecarga);

    listaAutobuses.appendChild(crearFila(principal, null, btnEdit, btnDel));
    if (selectAutobus) selectAutobus.insertAdjacentHTML('beforeend', `<option value="${bus.matricula}">[${bus.matricula}] ${bus.modelo}</option>`);
    if (selectBusRev) selectBusRev.insertAdjacentHTML('beforeend', `<option value="${bus.matricula}">[${bus.matricula}] ${bus.modelo}</option>`);
  });
}

export async function cargarConductores(callbackRecarga) {
  const { data, error } = await supabase.from('conductores').select('*');
  if (error) return console.error(error);

  const listaConductores = document.getElementById('lista-conductores');
  const selectConductor = document.getElementById('select-conductor');

  if (listaConductores) listaConductores.innerHTML = '';
  if (selectConductor) selectConductor.innerHTML = '<option value="">Seleccione Conductor...</option>';

  data.forEach(chofer => {
    // Teléfono y dirección consistentes dentro del acordeón
    const principal = `<strong>[${chofer.dni}] ${chofer.nombre_apellidos}</strong>`;
    const detalles = `📞 <strong>Tel:</strong> ${chofer.telefono}<br>📍 <strong>Dirección:</strong> ${chofer.direccion}`;

    const btnEdit = crearBotonEditar(document.getElementById('form-conductor'), chofer.dni, { 'dni-conductor': chofer.dni, 'nombre-conductor': chofer.nombre_apellidos, 'tel-conductor': chofer.telefono, 'dir-conductor': chofer.direccion });
    const btnDel = crearBotonEliminar('conductores', 'dni', chofer.dni, chofer.nombre_apellidos, callbackRecarga);

    listaConductores.appendChild(crearFila(principal, detalles, btnEdit, btnDel));
    if (selectConductor) selectConductor.insertAdjacentHTML('beforeend', `<option value="${chofer.dni}">${chofer.nombre_apellidos}</option>`);
  });
}

export async function cargarRevisiones(callbackRecarga) {
  const { data, error } = await supabase.from('revisiones').select('*, autobuses(modelo)');
  if (error) return console.error(error);

  const listaRevisiones = document.getElementById('lista-revisiones');
  const selectRevRep = document.getElementById('select-rev-rep');

  if (listaRevisiones) listaRevisiones.innerHTML = '';
  if (selectRevRep) selectRevRep.innerHTML = '<option value="">Seleccione Revisión...</option>';

  data.forEach(r => {
    const principal = `<strong>Rev #${r.id_revision}</strong> - Bus: [${r.matricula_autobus}] 📅 ${r.fecha_revision}`;
    const detalles = `🛠️ <strong>Diagnóstico:</strong> ${r.diagnostico}`;

    const btnEdit = crearBotonEditar(document.getElementById('form-revision'), r.id_revision, { 'select-bus-rev': r.matricula_autobus, 'fecha-rev': r.fecha_revision, 'diag-rev': r.diagnostico });
    const btnDel = crearBotonEliminar('revisiones', 'id_revision', r.id_revision, `Revisión #${r.id_revision}`, callbackRecarga);

    listaRevisiones.appendChild(crearFila(principal, detalles, btnEdit, btnDel));
    if (selectRevRep) selectRevRep.insertAdjacentHTML('beforeend', `<option value="${r.id_revision}">Rev #${r.id_revision} - Bus: ${r.matricula_autobus}</option>`);
  });
}

export async function cargarReparaciones(callbackRecarga) {
  const { data, error } = await supabase.from('reparaciones').select('*, revisiones(matricula_autobus)');
  if (error) return console.error(error);

  const listaReparaciones = document.getElementById('lista-reparaciones');
  if (listaReparaciones) listaReparaciones.innerHTML = '';

  data.forEach(rep => {
    const principal = `<strong>Reparación ${rep.codigo_reparacion}</strong> (Rev #${rep.id_revision}) | ⏱️ Tiempo: ${rep.tiempo_empleado}`;
    const detalles = rep.comentario ? `💬 <strong>Comentarios:</strong> ${rep.comentario}` : null;

    const btnEdit = crearBotonEditar(document.getElementById('form-reparacion'), rep.id_reparacion, { 'select-rev-rep': rep.id_revision, 'codigo-rep': rep.codigo_reparacion, 'tiempo-rep': rep.tiempo_empleado, 'comentario-rep': rep.comentario });
    const btnDel = crearBotonEliminar('reparaciones', 'id_reparacion', rep.id_reparacion, `Reparación ${rep.codigo_reparacion}`, callbackRecarga);

    listaReparaciones.appendChild(crearFila(principal, detalles, btnEdit, btnDel));
  });
}

export function initFlota(callbackRecarga) {
  document.getElementById('form-autobus')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarOActualizar('autobuses', 'matricula', { matricula: document.getElementById('matricula-bus').value, modelo: document.getElementById('modelo-bus').value, fabricante: document.getElementById('fabricante-bus').value, numero_plazas: parseInt(document.getElementById('plazas-bus').value) }, e.target, callbackRecarga);
  });

  document.getElementById('form-conductor')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarOActualizar('conductores', 'dni', { dni: document.getElementById('dni-conductor').value, nombre_apellidos: document.getElementById('nombre-conductor').value, telefono: document.getElementById('tel-conductor').value, direccion: document.getElementById('dir-conductor').value }, e.target, callbackRecarga);
  });

  document.getElementById('form-revision')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarOActualizar('revisiones', 'id_revision', { matricula_autobus: document.getElementById('select-bus-rev').value, fecha_revision: document.getElementById('fecha-rev').value, diagnostico: document.getElementById('diag-rev').value }, e.target, callbackRecarga);
  });

  document.getElementById('form-reparacion')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarOActualizar('reparaciones', 'id_reparacion', { id_revision: parseInt(document.getElementById('select-rev-rep').value), codigo_reparacion: document.getElementById('codigo-rep').value, tiempo_empleado: document.getElementById('tiempo-rep').value, comentario: document.getElementById('comentario-rep').value || null }, e.target, callbackRecarga);
  });
}