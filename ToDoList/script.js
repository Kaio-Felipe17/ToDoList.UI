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
  heading.textContent = name;
  li.appendChild(heading);
  if (description) {
    const details = document.createElement("p");
    details.textContent = description;
    li.appendChild(details);
  }
  list.appendChild(li);
  const total = list.children.length;
  count.textContent = `${total} ${total === 1 ? "tarefa" : "tarefas"}`;
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

  const name = input.value.trim();
  const description = descriptionInput.value.trim();

  if (!name) {
    status.textContent = "Digite o nome da tarefa.";
    return;
  }

  button.disabled = true;
  button.textContent = "Salvando...";
  status.textContent = "Salvando tarefa...";

  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Name: name, Description: description }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar tarefa: HTTP ${response.status}`);
    }

    const createdItem = await response.json();

    renderItem(createdItem);
    form.reset();
    input.focus();
    status.textContent = "Tarefa criada.";
  } catch (error) {
    status.textContent = "Não foi possível salvar a tarefa. Tente novamente.";
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = "Adicionar tarefa +";
  }
});

loadItems();
