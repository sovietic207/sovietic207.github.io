// js/votacion.js

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("candidatos");
  const boton = document.getElementById("continuar");
  const seleccionados = new Set();
  const idVotante = localStorage.getItem("votanteIdActual");

  if (!idVotante) window.location.href = "index.html";

  fetch(archivo)
    .then((res) => res.text())
    .then((texto) => {
      const lineas = texto.trim().split("\n");
      lineas.push("votoenblanco"); // Agrega el voto en blanco

      lineas.forEach((linea) => {
        const id = linea.trim();
        const div = document.createElement("div");
        div.className = "candidato";
        div.innerHTML = `
          <img src="imagenes/${id}.jpg" alt="${id}" width="100"><br>
          ${id.replace(/^\d+/, "")}  
        `;
        div.addEventListener("click", () => {
          if (seleccionados.has(id)) {
            seleccionados.delete(id);
            div.classList.remove("selected");
          } else {
            if (seleccionados.size < maxSeleccion) {
              seleccionados.add(id);
              div.classList.add("selected");
            }
          }
          boton.disabled = seleccionados.size === 0;
        });
        contenedor.appendChild(div);
      });
    });

  boton.addEventListener("click", () => {
    const actual = window.location.pathname.includes("boletin1")
      ? "boletin1"
      : window.location.pathname.includes("boletin2")
      ? "boletin2"
      : "boletin3";

    let votos = JSON.parse(localStorage.getItem("votante:" + idVotante)) || {};
    votos[actual] = Array.from(seleccionados);
    localStorage.setItem("votante:" + idVotante, JSON.stringify(votos));

    window.location.href = siguiente;
  });
});