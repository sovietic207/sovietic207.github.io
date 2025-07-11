// js/resultados.js

document.addEventListener("DOMContentLoaded", () => {
  const todos = Object.keys(localStorage).filter((k) => k.startsWith("votante:"));
  const conteo = {};

  todos.forEach((clave) => {
    const votos = JSON.parse(localStorage.getItem(clave));
    Object.values(votos).flat().forEach((id) => {
      conteo[id] = (conteo[id] || 0) + 1;
    });
  });

  const ctx = document.getElementById("grafico").getContext("2d");
  const labels = Object.keys(conteo);
  const datos = Object.values(conteo);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Votos",
          data: datos,
          backgroundColor: "#4caf50",
        },
      ],
    },
    options: {
      responsive: true,
      indexAxis: "y",
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  // Exportar a Excel
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Descargar resultados en Excel";
  document.body.appendChild(exportBtn);

  exportBtn.addEventListener("click", () => {
    const filas = todos.map((clave) => {
      const id = clave.replace("votante:", "");
      const datos = JSON.parse(localStorage.getItem(clave));
      return {
        ID: id,
        Boletin1: (datos.boletin1 || []).join(", "),
        Boletin2: (datos.boletin2 || []).join(", "),
        Boletin3: (datos.boletin3 || []).join(", "),
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filas);
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    XLSX.writeFile(wb, "resultados.xlsx");
  });
});
