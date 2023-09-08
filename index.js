document.addEventListener("DOMContentLoaded", function () {
  const addRowButton = document.getElementById("addRowButton");
  const exportButton = document.getElementById("exportButton");
  const dataBody = document.getElementById("dataBody");
  let data = [];

  addRowButton.addEventListener("click", function () {
    const name = document.getElementById("input_name").value;
    const newRow = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.textContent = name;
    newRow.appendChild(nameCell);

    const parameters = [
      "Ребенок выполняет бросание и катание мяча вниз, вдаль",
      "Ребенок выполняет подлезание, пролезание в обруч, лазанье по лесенке-стремянке вверх-вниз",
      "Ребенок выполняет ходьбу за педагогом стайкой в прямом направлении",
      "Ребенок выполняет ходьбу по дорожке, вверх-вниз по наклонной доске, подъем-спуск на ступеньки, перешагивание",
      "Ребенок может держать в одной руке сразу 2 предмета",
      "Ребенок может переворачивать страницы книги",
    ];

    parameters.forEach((parameter, index) => {
      const selectCell = document.createElement("td");
      const select = document.createElement("select");
      select.name = `parameter${index + 1}`;
      select.id = `select${index + 1}`;

      const options = ["2", "1", "0"]; // Только значения, без текстовых описаний

      options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
      });

      selectCell.appendChild(select);
      newRow.appendChild(selectCell);
    });

    dataBody.appendChild(newRow);
    data.push([name, ...parameters.map((_, index) => document.getElementById(`select${index + 1}`).value)]);
    document.getElementById("input_name").value = "";
  });

  exportButton.addEventListener("click", function () {
    // Обновляем данные перед экспортом
    data = Array.from(dataBody.querySelectorAll("tr")).map((row) => {
      const name = row.querySelector("td").textContent;
      const selects = Array.from(row.querySelectorAll("select"));
      return [name, ...selects.map((select) => select.value)];
    });

    exportToExcel(data);
  });

  function exportToExcel(data) {
    const wsData = [
      ['Имя', ...Array.from({ length: 6 }, (_, index) => `Параметр ${index + 1}`)],
      ...data
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const fileName = "exported_data.xlsx";
    XLSX.writeFile(wb, fileName);
  }
});
