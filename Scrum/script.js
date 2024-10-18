document.addEventListener("DOMContentLoaded", function () {
  let templates = JSON.parse(localStorage.getItem("templates")) || [];
  let currentTemplate = null;
  let deleteTemplateIndex = null;

  updateTemplateSelect();

  document
    .getElementById("num-columns")
    .addEventListener("change", function () {
      const numColumns = parseInt(this.value);
      const columnsInputs = document.getElementById("columns-inputs");
      columnsInputs.innerHTML = "";

      for (let i = 1; i <= numColumns; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Nome da Coluna ${i}`;
        input.required = true;
        columnsInputs.appendChild(input);
      }
    });

  document
    .getElementById("create-template-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const templateName = document.getElementById("template-name").value;
      const numColumns = parseInt(document.getElementById("num-columns").value);
      const columnNames = Array.from(
        document.getElementById("columns-inputs").children
      ).map((input) => input.value);

      const newTemplate = { name: templateName, columns: columnNames };

      templates.push(newTemplate);

      localStorage.setItem("templates", JSON.stringify(templates));
      updateTemplateSelect();
      closeModal();
    });

  document
    .getElementById("template-select")
    .addEventListener("change", function () {
      const selectedValue = this.value;

      if (selectedValue === "criar-template") {
        openModal();
        document.getElementById("modal-title").textContent =
          "Criar Novo Template";
        document.getElementById("template-name").value = "";
        document.getElementById("num-columns").value = 1;
        document.getElementById("columns-inputs").innerHTML =
          '<input type="text" placeholder="Nome da Coluna 1" required />';
        return;
      }

      const selectedTemplate = templates.find(
        (template) => template.name === selectedValue
      );

      if (selectedTemplate) {
        currentTemplate = selectedTemplate;
        renderTemplate(currentTemplate);
        document.getElementById("welcome-text").style.display = "none";
      }
    });

  function deleteTemplate(templateIndex) {
    templates.splice(templateIndex, 1);
    localStorage.setItem("templates", JSON.stringify(templates));
    updateTemplateSelect();
  }

  document
    .getElementById("close-create-modal")
    .addEventListener("click", closeModal);

  function openModal() {
    document.getElementById("create-template-modal").style.display = "block";
  }

  function closeModal() {
    document.getElementById("create-template-modal").style.display = "none";
  }

  function updateTemplateSelect() {
    const select = document.getElementById("template-select");
    select.innerHTML = '<option value="">Selecione um Template</option>';
    select.innerHTML +=
      '<option value="criar-template">Criar Novo Template</option>';

    templates.forEach((template) => {
      const option = document.createElement("option");
      option.value = template.name;
      option.textContent = template.name;
      select.appendChild(option);
    });
  }

  function renderTemplate(template) {
    const columnsContainer = document.getElementById("columns-container");
    columnsContainer.innerHTML = "";

    template.columns.forEach((columnName, columnIndex) => {
      const columnDiv = document.createElement("div");
      columnDiv.className = "column";

      const columnHeader = document.createElement("div");
      columnHeader.className = "column-header";
      columnHeader.textContent = columnName;

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-column-btn";
      deleteButton.textContent = "X";
      deleteButton.addEventListener("click", function () {
        deleteTemplate(columnIndex);
      });

      const taskList = document.createElement("div");
      taskList.className = "task-list";

      const addCardBtn = document.createElement("button");
      addCardBtn.className = "add-card-btn";
      addCardBtn.textContent = "Adicionar Tarefa";
      addCardBtn.addEventListener("click", function () {
        document.getElementById("add-task-modal").style.display = "block";
        document.getElementById("current-column").value = columnIndex;
      });

      columnHeader.appendChild(deleteButton); 
      columnDiv.appendChild(columnHeader);
      columnDiv.appendChild(taskList);
      columnDiv.appendChild(addCardBtn);

      columnsContainer.appendChild(columnDiv);
    });

    enableDragAndDrop();
  }

  function enableDragAndDrop() {
    const tasks = document.querySelectorAll(".task");
    const columns = document.querySelectorAll(".task-list");

    tasks.forEach((task) => {
      task.setAttribute("draggable", true);

      task.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", e.target.id);
      });
    });

    columns.forEach((column) => {
      column.addEventListener("dragover", function (e) {
        e.preventDefault();
      });

      column.addEventListener("drop", function (e) {
        const id = e.dataTransfer.getData("text");
        const task = document.getElementById(id);
        e.target.appendChild(task);
      });
    });
  }
});
