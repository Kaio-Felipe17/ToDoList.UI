const API_BASE_URL = "https://localhost:7177";

const form = document.querySelector("#item-form");
const input = document.querySelector("#item-name");
const descriptionInput = document.querySelector("#item-description");
const list = document.querySelector("#item-list");
const count = document.querySelector("#item-count");
const status = document.querySelector("#status");
const button = form.querySelector("button");

async function renderItem(item) {
  const li = document.createElement("li");
  const name = item.name ?? item.Name ?? "";
  const description = item.description ?? item.Description ?? "";
  const heading = document.createElement("h3");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  const activateButton = document.createElement("button");
  const deactivateButton = document.createElement("button");
  const completeButton = document.createElement("button");
  const pendingButton = document.createElement("button");

  const icon = document.createElement("img");
  icon.src = "./icons/edit-icon.png";
  icon.alt = "";
  icon.width = 16;
  icon.height = 16;

  editButton.appendChild(icon);
  editButton.setAttribute("aria-label", "Editar tarefa");
  editButton.title = "Editar tarefa";
  editButton.type = "button";
  editButton.classList.add("edit-button");
  editButton.addEventListener("click", () => {
    startEdition(item)
  })

  const deleteIcon = document.createElement("img");
  deleteIcon.src = "./icons/delete-icon.png";
  deleteIcon.alt = "";
  deleteIcon.width = 16;
  deleteIcon.height = 16;

  deleteButton.appendChild(deleteIcon)
  deleteButton.setAttribute("aria-label", "Excluir tarefa");
  deleteButton.title = "Excluir tarefa";
  deleteButton.type = "button";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", async () => {
    await startDelete(item)
  })

  const active = item.active ?? item.Active ?? false;

  if (active) {
    const deactivateIcon = document.createElement("img");
    deactivateIcon.src = "./icons/deactivate-icon.png";
    deactivateIcon.alt = "";
    deactivateIcon.width = 16;
    deactivateIcon.height = 16;

    deactivateButton.appendChild(deactivateIcon);
    deactivateButton.setAttribute("aria-label", "Desativar tarefa");
    deactivateButton.title = "Desativar tarefa";
    deactivateButton.type = "button";
    deactivateButton.classList.add("activate-or-inactivate-button");
    deactivateButton.addEventListener("click", () => {
      activateOrDeactivate(item, false)
    })

    li.appendChild(deactivateButton);
  }

  if (!active){
    const activateIcon = document.createElement("img");
    activateIcon.src = "./icons/activate-icon.png";
    activateIcon.alt = "";
    activateIcon.width = 16;
    activateIcon.height = 16;

    activateButton.appendChild(activateIcon);
    activateButton.setAttribute("aria-label", "Ativar tarefa");
    activateButton.title = "Ativar tarefa";
    activateButton.type = "button";
    activateButton.classList.add("activate-or-inactivate-button");
    activateButton.addEventListener("click", () => {
      activateOrDeactivate(item)
    })

    li.appendChild(activateButton);
  }

  const completed = item.isCompleted ?? item.IsCompleted ?? false;

  if (completed){
    const completeIcon = document.createElement("img");
    completeIcon.src = "./icons/completed-icon.png";
    completeIcon.alt = "";
    completeIcon.width = 16;
    completeIcon.height = 16;

    completeButton.appendChild(completeIcon);
    completeButton.setAttribute("aria-label", "Desativar tarefa");
    completeButton.title = "Marcar tarefa como pendente";
    completeButton.type = "button";
    completeButton.classList.add("complete-or-pending-button");
    completeButton.addEventListener("click", () => {
      completedOrPending(item, false)
    })

    li.appendChild(completeButton);
  }

  if (!completed){
    const pendingIcon = document.createElement("img");
    pendingIcon.src = "./icons/pending-icon.png";
    pendingIcon.alt = "";
    pendingIcon.width = 16;
    pendingIcon.height = 16;

    pendingButton.appendChild(pendingIcon);
    pendingButton.setAttribute("aria-label", "Desativar tarefa");
    pendingButton.title = "Marcar tarefa como completa";
    pendingButton.type = "button";
    pendingButton.classList.add("complete-or-pending-button");
    pendingButton.addEventListener("click", () => {
      completedOrPending(item)
    })

    li.appendChild(pendingButton);
  }

  heading.textContent = name;
  li.appendChild(heading);
  li.appendChild(editButton);
  li.appendChild(deleteButton);
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

async function startDelete(task){
  const taskToDeleteId = task.id ?? task.Id;
  const url = `${API_BASE_URL}/items/${taskToDeleteId}`

  try {
    const response = await fetch(url, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Não foi possível excluir a tarefa.");
    }

    await loadItems();
  } catch (error){
    console.error(error);
  }
}

async function activateOrDeactivate(task, active = true) {
  const taskToUpdateId = task.id ?? task.Id;
  const url = `${API_BASE_URL}/items/toggleActive/${taskToUpdateId}`

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
      "Content-Type": "application/json"
    },
      body: JSON.stringify({
      Active: active ? true : false
    })
    })

    if (!response.ok) {
      throw new Error(`Não foi possível ${active ? "ativar" : "desativar"} a tarefa.`);
    }

    await loadItems();
  } catch (error){
    console.error(error)
  }
}

async function completedOrPending(task, isCompleted = true) {
  const taskToUpdateId = task.id ?? task.Id;
  const url = `${API_BASE_URL}/items/isCompleted/${taskToUpdateId}`

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
      "Content-Type": "application/json"
    },
      body: JSON.stringify({
      IsCompleted: isCompleted ? true : false
    })
    })

    if (!response.ok) {
      throw new Error(`Não foi possível ${active ? "completar a tarefa." : "marcar a tarefa como pendente."} `);
    }

    await loadItems();
  } catch (error){
    console.error(error)
  }
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
