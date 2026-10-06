import { supabase } from '../../supabase.js';

export function crearBotonEliminar(tabla, columnaId, valorId, nombreElemento, callbackRecarga) {
  const btn = document.createElement('button');
  btn.textContent = '❌ Eliminar';
  btn.className = 'btn-delete';

  btn.addEventListener('click', async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar "${nombreElemento}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from(tabla).delete().eq(columnaId, valorId);
      if (error) { 
        Swal.fire('Error', 'Error al eliminar. Revisa restricciones.', 'error');
        console.error(error); 
      }
      else { 
        Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
        callbackRecarga(); 
      }
    }
  });
  return btn;
}

export async function guardarOActualizar(tabla, columnaId, datos, formElement, callbackRecarga) {
  const editId = formElement.dataset.editId;
  if (editId) {
    const { error } = await supabase.from(tabla).update(datos).eq(columnaId, editId);
    if (error) { console.error(error); Swal.fire('Error', 'Error al actualizar', 'error'); }
    else {
      delete formElement.dataset.editId;
      const btnSubmit = formElement.querySelector('button[type="submit"]');
      if (btnSubmit && formElement.dataset.textoOriginal) btnSubmit.textContent = formElement.dataset.textoOriginal;
      Swal.fire('¡Actualizado!', 'Registro guardado correctamente.', 'success');
    }
  } else {
    const { error } = await supabase.from(tabla).insert([datos]);
    if (error) { console.error(error); Swal.fire('Error', 'Error al guardar', 'error'); }
    else { Swal.fire('¡Guardado!', 'Registro creado exitosamente.', 'success'); }
  }
  formElement.reset();
  callbackRecarga();
}