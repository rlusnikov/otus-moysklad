const counterparties = [
  {
    id: 1,
    name: 'ООО "Ромашка"',
    inn: '7701234567',
    address: 'г. Москва, ул. Ленина, 1',
    kpp: '770101001',
  },
  {
    id: 2,
    name: 'АО "Вектор"',
    inn: '7812345678',
    address: 'г. Санкт-Петербург, Невский проспект, 25',
    kpp: '781201001',
  },
  {
    id: 3,
    name: 'ИП Иванов Иван Иванович',
    inn: '540123456789',
    address: 'г. Новосибирск, Красный проспект, 10',
    kpp: '-',
  },
];

const openModalButton = document.getElementById('open-add-data-modal');
const modal = document.getElementById('add-data-modal');
const closeModalButton = document.getElementById('close-add-data-modal');
const cancelButton = document.getElementById('cancel-add-data');
const form = document.getElementById('add-data-form');
const tableBody = document.querySelector('tbody');

let editingId = null;
let nextCounterpartyId = Math.max(...counterparties.map((counterparty) => counterparty.id)) + 1;

const fillForm = (counterparty) => {
  form.elements.name.value = counterparty.name;
  form.elements.inn.value = counterparty.inn;
  form.elements.address.value = counterparty.address;
  form.elements.kpp.value = counterparty.kpp;
};

const openModal = (counterparty = null) => {
  editingId = counterparty ? counterparty.id : null;
  form.reset();

  if (counterparty) {
    fillForm(counterparty);
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  modal.setAttribute('aria-hidden', 'false');

  const firstField = form.querySelector('input[name="name"]');
  if (firstField) {
    firstField.focus();
  }
};

const closeModal = () => {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  modal.setAttribute('aria-hidden', 'true');
  form.reset();
  editingId = null;
};

const getFormValues = () => {
  const formData = new FormData(form);

  return {
    name: String(formData.get('name') || '').trim(),
    inn: String(formData.get('inn') || '').trim(),
    address: String(formData.get('address') || '').trim(),
    kpp: String(formData.get('kpp') || '').trim(),
  };
};

const createCell = (text, className = 'px-6 py-4') => {
  const cell = document.createElement('td');
  cell.className = className;
  cell.textContent = text;

  return cell;
};

const createDeleteButton = (id) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className =
    'inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50';
  button.textContent = 'Удалить';

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    deleteCounterparty(id);
  });

  return button;
};

const renderTable = () => {
  tableBody.textContent = '';

  counterparties.forEach((counterparty) => {
    const row = document.createElement('tr');
    row.className = 'cursor-pointer hover:bg-slate-50/80';

    const nameCell = document.createElement('th');
    nameCell.scope = 'row';
    nameCell.className = 'whitespace-nowrap px-6 py-4 font-medium text-slate-900';
    nameCell.textContent = counterparty.name;

    const actionsCell = createCell('', 'px-6 py-4 text-right');
    actionsCell.appendChild(createDeleteButton(counterparty.id));

    row.append(
      nameCell,
      createCell(counterparty.inn),
      createCell(counterparty.address),
      createCell(counterparty.kpp, 'px-6 py-4 font-medium text-slate-900'),
      actionsCell,
    );

    row.addEventListener('dblclick', () => openModal(counterparty));
    tableBody.appendChild(row);
  });
};

const saveCounterparty = () => {
  const values = getFormValues();

  if (!values.name || !values.inn || !values.address || !values.kpp) {
    return;
  }

  if (editingId) {
    const counterparty = counterparties.find((item) => item.id === editingId);

    if (counterparty) {
      Object.assign(counterparty, values);
    }
  } else {
    counterparties.push({
      id: nextCounterpartyId,
      ...values,
    });
    nextCounterpartyId += 1;
  }

  renderTable();
  closeModal();
};

const deleteCounterparty = (id) => {
  const index = counterparties.findIndex((counterparty) => counterparty.id === id);

  if (index === -1) {
    return;
  }

  counterparties.splice(index, 1);
  renderTable();
};

openModalButton.addEventListener('click', () => openModal());
closeModalButton.addEventListener('click', closeModal);
cancelButton.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  saveCounterparty();
});

renderTable();
