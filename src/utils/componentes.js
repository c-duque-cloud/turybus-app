export function crearFila(htmlPrincipal, htmlDetalles, btnEditar, btnEliminar) {
  const li = document.createElement('li');
  li.style.marginBottom = '12px';
  li.style.paddingBottom = '12px';
  li.style.borderBottom = '1px solid #333';

  let contenido = `<div>${htmlPrincipal}</div>`;
  if (htmlDetalles) {
    contenido += `
      <details style="margin-top: 6px; font-size: 14px; color: #aaa;">
        <summary style="cursor: pointer; outline: none;">👁️ Mostrar más detalles</summary>
        <div style="padding-left: 20px; margin-top: 6px; border-left: 2px solid #555;">
          ${htmlDetalles}
        </div>
      </details>
    `;
  }

  const divContenido = document.createElement('div');
  divContenido.innerHTML = contenido;
  li.appendChild(divContenido);

  const divBotones = document.createElement('div');
  divBotones.style.marginTop = '8px';
  divBotones.appendChild(btnEditar);
  divBotones.appendChild(btnEliminar);
  li.appendChild(divBotones);

  return li;
}

export function crearBotonEditar(formularioElemento, idRegistro, mapeoDatos) {
  const btn = document.createElement('button');
  btn.textContent = '✏️ Editar';
  btn.style.cssText = 'margin-left: 10px; background-color: #ffc107; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;';

  btn.addEventListener('click', () => {
    for (const [idInput, valorDato] of Object.entries(mapeoDatos)) {
      const input = document.getElementById(idInput);
      if (input && valorDato !== null) input.value = valorDato;
    }
    formularioElemento.dataset.editId = idRegistro;
    const btnSubmit = formularioElemento.querySelector('button[type="submit"]');
    if (btnSubmit) {
      if (!formularioElemento.dataset.textoOriginal) formularioElemento.dataset.textoOriginal = btnSubmit.textContent;
      btnSubmit.textContent = '💾 Actualizar';
    }
  });
  return btn;
}