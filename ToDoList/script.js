const API_BASE_URL = "https://localhost:7177";

const form = document.querySelector("#item-form");
const input = document.querySelector("#item-name");
const descriptionInput = document.querySelector("#item-description");
const list = document.querySelector("#item-list");
const count = document.querySelector("#item-count");
const status = document.querySelector("#status");
const button = form.querySelector("button");

function renderItem(item) {
  const li = document.createElement("li");
  const name = item.name ?? item.Name ?? "";
  const description = item.description ?? item.Description ?? "";
  const heading = document.createElement("h3");
  const editButton = document.createElement("button");
  const icon = document.createElement("img");
  icon.src = "./icons/edit-icon.png";
  icon.alt = "";
  icon.width = 16;
  icon.height = 16;

  editButton.appendChild(icon);
  editButton.setAttribute("aria-label", "Editar tarefa");
  editButton.title = "Editar tarefa";
  editButton.classList.add("edit-button");
  editButton.addEventListener("click", () => {
    startEdition(item)
  })

  heading.textContent = name;
  li.appendChild(heading);
  li.appendChild(editButton);
  if (description) {
    const details = document.createElement("p");
    details.textContent = description;
    li.appendChild(details);
  }
  list.appendChild(li);
  const total = list.children.length;
  count.textContent = `${total} ${total === 1 ? "tarefa" : "tarefas"}`;
}

let taskInEditionId = null;

function startEdition(task){
  taskInEditionId = task.id ?? task.id;
  input.value = task.name ?? task.name ?? "";
  descriptionInput.value = task.description ?? task.description ?? "";
  button.textContent = "Salvar alterações";
  input.focus();
}

async function loadItems() {
  status.textContent = "Carregando tarefas...";

  try {
    const response = await fetch(`${API_BASE_URL}/items`);

    if (!response.ok) {
      throw new Error(`Erro ao buscar tarefas: HTTP ${response.status}`);
    }

    const items = await response.json();

    list.replaceChildren();
    items.forEach(renderItem);

    status.textContent = items.length === 0
      ? "Nenhuma tarefa cadastrada."
      : "";
  } catch (error) {
    status.textContent = "Não foi possível carregar as tarefas.";
    console.error(error);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const isEditingTask = taskInEditionId != null;

  const data = {
    Name: input.value.trim(),
    Description: descriptionInput.value.trim()
  };

  const url = isEditingTask
      ? `${API_BASE_URL}/items/${taskInEditionId}`
      : `${API_BASE_URL}/items`;

  try {
    const response = await fetch(url, {
      method: isEditingTask ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Não foi possível salvar a tarefa.");
    }

    taskInEditionId = null;
    form.reset();
    button.textContent = "Adicionar tarefa";

    await loadItems();
  } catch (error) {
    alert(error.message);
  }
});

loadItems();
