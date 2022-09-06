// DOM elements
// ================================================================================
const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// App state
// ================================================================================
let items = [];

// Handlers
// ================================================================================
function handleFormSubmit(e) {
  e.preventDefault();

  const name = e.target.item.value;

  if (!name.trim()) return;

  const item = {
    id: Date.now(),
    name,
    completed: false
  };

  items.push(item);
  e.target.reset();
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function renderList() {
  const html = items
    .map(
      ({ id, name, completed }) => `
    <li class="shopping-item">
      <input type="checkbox" ${completed && 'checked'} data-id="${id}" />
      <span class="itemName">${name}</span>
      <button aria-label="Remove ${name}" data-id="${id}">&times;</button>
    </li>
  `
    )
    .join('');

  list.innerHTML = html;
}

function saveToLocalStorage() {
  localStorage.setItem('items', JSON.stringify(items));
}

function restoreFromLocalStorage() {
  const lsItems = JSON.parse(localStorage.getItem('items'));

  if (lsItems.length) {
    items.push(...lsItems);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

function deleteItem(id) {
  const newItems = items.filter((item) => item.id !== id);
  items = newItems;

  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function checkItem(id) {
  const newItems = items.map((item) =>
    item.id === id ? { ...item, completed: !item.completed } : item
  );
  items = newItems;

  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

// Event listeners
// ================================================================================
shoppingForm.addEventListener('submit', handleFormSubmit);
list.addEventListener('itemsUpdated', () => {
  renderList();
  saveToLocalStorage();
});
list.addEventListener('click', (e) => {
  const clickedElement = e.target;
  const id = parseInt(clickedElement.dataset.id);
  if (clickedElement.matches('button')) deleteItem(id);
  else if (clickedElement.matches('input[type="checkbox"]')) checkItem(id);
});

// On load
// ================================================================================
restoreFromLocalStorage();
