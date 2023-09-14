document.addEventListener("DOMContentLoaded", function () {
  const addRowButton = document.getElementById("addRowButton");
  const exportButton = document.getElementById("exportButton");
  const dataBody = document.getElementById("dataBody");
  let data = [];

  // Цвета для каждого значения (0, 1, 2)
  const colors = {
    0: "#ffcdcd", // Замените на желаемый цвет для 0
    1: "#feec90", // Замените на желаемый цвет для 1
    2: "#92d050", // Замените на желаемый цвет для 2
  };

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

    parameters.forEach((parameter) => {
      const selectCell = document.createElement("td");
      const radioGroup = document.createElement("div");
      const groupName = `group_${data.length}_${parameters.indexOf(parameter)}`;
      radioGroup.classList.add("radio-group");

      const radio0 = createRadioInput("0", groupName, colors[0]);
      const radio1 = createRadioInput("1", groupName, colors[1]);
      const radio2 = createRadioInput("2", groupName, colors[2]);

      radioGroup.appendChild(radio0);
      radioGroup.appendChild(radio1);
      radioGroup.appendChild(radio2);

      selectCell.appendChild(radioGroup);
      newRow.appendChild(selectCell);
    });

    dataBody.appendChild(newRow);
    data.push([name, ...parameters.map((_, index) => getSelectedValue(newRow, index))]);
    document.getElementById("input_name").value = "";
  });

  exportButton.addEventListener("click", function () {
    // Обновляем данные перед экспортом
    data = Array.from(dataBody.querySelectorAll("tr")).map((row) => {
      const name = row.querySelector("td").textContent;
      return [name, ...Array.from({ length: 6 }, (_, index) => getSelectedValue(row, index))];
    });

    exportToExcel(data);
  });

  function createRadioInput(value, groupName, color) {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = groupName;
    radio.value = value;
    radio.addEventListener("change", function () {
      radio.parentNode.querySelectorAll("input").forEach((input) => {
        input.parentNode.style.backgroundColor = ""; // Очищаем цвет для всех кнопок
      });
      radio.parentNode.style.backgroundColor = color; // Устанавливаем цвет для выбранной кнопки
    });

    return radio;
  }

  function getSelectedValue(row, index) {
    const radioGroups = row.querySelectorAll(".radio-group");
    const selectedGroup = radioGroups[index];
    const selectedRadio = selectedGroup.querySelector("input:checked");
    return selectedRadio ? selectedRadio.value : "";
  }

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
