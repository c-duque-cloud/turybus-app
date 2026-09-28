import { supabase } from '../../supabase.js';

export function crearBotonEliminar(tabla, columnaId, valorId, nombreElemento, callbackRecarga) {
  const btn = document.createElement('button');
  btn.textContent = '❌ Eliminar';
  btn.style.cssText = 'margin-left: 15px; background-color: #ff4d4d; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;';

  btn.addEventListener('click', async () => {
    if (confirm(`¿Estás seguro de eliminar "${nombreElemento}"?`)) {
      const { error } = await supabase.from(tabla).delete().eq(columnaId, valorId);
      if (error) { alert('Error al eliminar. Revisa restricciones.'); console.error(error); }
      else { callbackRecarga(); }
    }
  });
  return btn;
}

export async function guardarOActualizar(tabla, columnaId, datos, formElement, callbackRecarga) {
  const editId = formElement.dataset.editId;
  if (editId) {
    const { error } = await supabase.from(tabla).update(datos).eq(columnaId, editId);
    if (error) { console.error(error); alert("Error al actualizar"); }
    else {
      delete formElement.dataset.editId;
      const btnSubmit = formElement.querySelector('button[type="submit"]');
      if (btnSubmit && formElement.dataset.textoOriginal) btnSubmit.textContent = formElement.dataset.textoOriginal;
    }
  } else {
    const { error } = await supabase.from(tabla).insert([datos]);
    if (error) { console.error(error); alert("Error al guardar"); }
  }
  formElement.reset();
  callbackRecarga();
}