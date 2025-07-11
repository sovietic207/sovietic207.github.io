function iniciarBoletin(rutaArchivo, maxSeleccion, siguientePagina, claveBoletin) {
  const contenedor = document.getElementById("candidatos");
  const btn = document.getElementById("continuar");
  const seleccionados = new Set();

  const id = localStorage.getItem("votanteIdActual");
  if (!id) {
    window.location.href = "index.html";
    return;
  }

  fetch(rutaArchivo)
    .then(res => res.text())
    .then(texto => {
      const nombres = texto.split("\n").map(n => n.trim()).filter(Boolean);
      nombres.push("votoenblanco");

      nombres.forEach(nombre => {
        const div = document.createElement("div");
        div.className = "tarjeta";

        const img = document.createElement("img");
        img.alt = nombre;
        cargarImagen(img, nombre);

        const label = document.createElement("label");
        label.textContent = nombre;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = nombre;

        // ✅ Manejador para limitar selección y actualizar botón
        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            if (seleccionados.size >= maxSeleccion) {
              checkbox.checked = false;
              alert(`Solo puedes seleccionar hasta ${maxSeleccion} candidatos.`);
              return;
            }
            seleccionados.add(nombre);
          } else {
            seleccionados.delete(nombre);
          }

          btn.disabled = seleccionados.size === 0;
        });

        // ✅ Permitir clic en toda la tarjeta (foto, texto, etc.)
        div.addEventListener("click", (e) => {
          if (e.target.tagName !== "INPUT") {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event("change"));
          }
        });

        div.appendChild(img);
        div.appendChild(label);
        div.appendChild(checkbox);
        contenedor.appendChild(div);
      });
    });

  // ✅ Guardar selección y pasar al siguiente boletín
  btn.addEventListener("click", () => {
    const votos = JSON.parse(localStorage.getItem("votante:" + id)) || {};
    votos[claveBoletin] = Array.from(seleccionados);
    localStorage.setItem("votante:" + id, JSON.stringify(votos));
    window.location.href = siguientePagina;
  });
}

// ✅ Cargar imagen del candidato (soporte .jpeg, .jpg, .png)
function cargarImagen(img, nombre) {
  const extensiones = ['jpeg', 'jpg', 'png'];
  let encontrada = false;

  for (const ext of extensiones) {
    const ruta = `imagenes/${nombre.toLowerCase().replace(/\s+/g, "")}.${ext}`;

    img.onerror = function () {
      if (!encontrada) {
        this.onerror = null;
        img.src = "imagenes/default.jpg";
      }
    };

    img.onload = function () {
      encontrada = true;
    };

    img.src = ruta;
    break; // Deja que onerror/onload maneje lo demás
  }
}

