// js/validacion.js
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const inputId = document.getElementById("voterId").value.trim();
  const error = document.getElementById("error");

  if (!inputId) {
    error.textContent = "Debe ingresar un ID.";
    return;
  }

  fetch("data/ids.xlsx")
    .then((res) => res.arrayBuffer())
    .then((data) => {
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      const ids = json.map(fila => fila.ID?.toString());
      console.log("IDs extraídos:", ids);

      if (!ids.includes(inputId)) {
        error.textContent = "ID inválido. No está autorizado para votar.";
        return;
      }

      const votante = JSON.parse(localStorage.getItem("votante:" + inputId));
      if (votante && votante.boletin1 && votante.boletin2 && votante.boletin3) {
        error.textContent = "Este ID ya ha votado.";
        return;
      }

      localStorage.setItem("votanteIdActual", inputId);
      window.location.href = "boletin1.html";
    })
    .catch((err) => {
      console.error("Error al cargar el Excel:", err);
      error.textContent = "Error al validar ID. Revisa la consola.";
    });
});
