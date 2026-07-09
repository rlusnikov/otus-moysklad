import { createContragentsModal } from './contragents/modal/modal.js';
import { createContragentsTable } from './contragents/table/table.js';

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

const tableContainer = document.getElementById('contragents-table');
const modalContainer = document.getElementById('contragents-modal');
const openModalButton = document.getElementById('open-add-data-modal');

let editingId = null;
let nextCounterpartyId = Math.max(...counterparties.map((counterparty) => counterparty.id)) + 1;
let table;

const renderTable = () => {
  table.render(counterparties);
};

const saveCounterparty = (values) => {
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
};

const deleteCounterparty = (id) => {
  const index = counterparties.findIndex((counterparty) => counterparty.id === id);

  if (index === -1) {
    return;
  }

  counterparties.splice(index, 1);
};

const modal = await createContragentsModal(modalContainer, {
  onSave: (values) => {
    saveCounterparty(values);
    renderTable();
    editingId = null;
  },
});

table = await createContragentsTable(tableContainer, {
  onEdit: (counterparty) => {
    editingId = counterparty.id;
    modal.open(counterparty);
  },
  onDelete: (id) => {
    deleteCounterparty(id);
    renderTable();
  },
});

openModalButton.addEventListener('click', () => {
  editingId = null;
  modal.open();
});

renderTable();
