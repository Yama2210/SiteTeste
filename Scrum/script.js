document.addEventListener("DOMContentLoaded", function () {
  let templates = JSON.parse(localStorage.getItem("templates")) || [];
  let currentTemplate = null;
  let editingTemplateIndex = null;

  updateTemplateSelect();

  document
    .getElementById("create-template-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const templateName = document.getElementById("template-name").value;
      const numColumns = parseInt(document.getElementById("num-columns").value);
      const columnNames = Array.from(
        document.getElementById("columns-inputs").children
      ).map((input) => input.value);

      const newTemplate = {
        name: templateName,
        columns: columnNames,
      };

      if (editingTemplateIndex !== null) {
        templates[editingTemplateIndex] = newTemplate;
        editingTemplateIndex = null;
      } else {
        templates.push(newTemplate);
      }

      localStorage.setItem("templates", JSON.stringify(templates));Vc 
      updateTemplateSelect();
      closeModal();
    });

  document
    .getElementById("delete-template-btn")
    .addEventListener("click", function () {
      if (currentTemplate !== null) {
        const index = templates.findIndex(
          (template) => template.name === currentTemplate.name
        );
        if (index > -1) {
          templates.splice(index, 1);
          localStorage.setItem("templates", JSON.stringify(templates));
          updateTemplateSelect();
          document.getElementById("columns-container").innerHTML = "";
          document.getElementById("template-title").textContent = "";
          document.getElementById("delete-template-btn").style.display = "none";
          alert("Template deletado com sucesso!");
        }
      }
    });

  function updateTemplateSelect() {
    const select = document.getElementById("template-select");
    select.innerHTML =
      '<option value="criar-template">Criar Novo Template</option>';

    templates.forEach((template, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = template.name;
      select.appendChild(option);
    });

    select.addEventListener("change", function () {
      if (this.value === "criar-template") {
        openModal();
      } else {
        currentTemplate = templates[this.value];
        renderTemplate(currentTemplate);
        document.getElementById("delete-template-btn").style.display = "block";
      }
    });
  }

  function openModal() {
    document.getElementById("create-template-modal").style.display = "block";
    document.getElementById("template-name").value = "";
    document.getElementById("num-columns").value = 1;
    document.getElementById("columns-inputs").innerHTML = "";
  }

  function closeModal() {
    document.getElementById("create-template-modal").style.display = "none";
  }

  document.querySelector(".close-modal").addEventListener("click", function () {
    closeModal();
  });

  window.addEventListener("click", function (e) {
    if (e.target === document.getElementById("create-template-modal")) {
      closeModal();
    }
  });

  function renderTemplate(template) {
    const container = document.getElementById("columns-container");
    container.innerHTML = "";
    document.getElementById("template-title").textContent = template.name;

    template.columns.forEach((columnName, columnIndex) => {
      const column = document.createElement("div");
      column.classList.add("column");

      const header = document.createElement("div");
      header.classList.add("column-header");
      header.textContent = columnName;

      const addTaskButton = document.createElement("button");
      addTaskButton.classList.add("add-card-btn");
      addTaskButton.innerHTML = "<i>+</i> Adicionar Tarefa";
      addTaskButton.addEventListener("click", function () {
        openTaskModal(columnIndex);
      });

      column.appendChild(header);
      column.appendChild(addTaskButton);
      container.appendChild(column);
    });
  }

  function closeTaskModal() {
    document.getElementById("add-task-modal").style.display = "none";
  }
});
