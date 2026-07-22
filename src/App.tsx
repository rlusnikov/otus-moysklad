import { useState } from 'react';
import type { Contragent, ContragentFormValues } from './types/contragent';
import ContragentsModal from './components/ContragentsModal/ContragentsModal';
import ContragentsTable from './components/ContragentsTable/ContragentsTable';
import styles from './App.module.css';

const initialContragents: Contragent[] = [
  {
    id: 1,
    name: 'ООО "Ромашка"',
    inn: '77012345678',
    address: 'г. Москва, ул. Ленина, 1',
    kpp: '770101001',
  },
  {
    id: 2,
    name: 'АО "Вектор"',
    inn: '78123456789',
    address: 'г. Санкт-Петербург, Невский проспект, 25',
    kpp: '781201001',
  },
  {
    id: 3,
    name: 'ИП Иванов Иван Иванович',
    inn: '54012345678',
    address: 'г. Новосибирск, Красный проспект, 10',
    kpp: '540101001',
  },
];

function App() {
  const [contragents, setContragents] = useState<Contragent[]>(initialContragents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(
    Math.max(...initialContragents.map((contragent) => contragent.id)) + 1,
  );

  const editingCounterparty = editingId
    ? contragents.find((contragent) => contragent.id === editingId) ?? null
    : null;

  const handleOpenAdd = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (contragent: Contragent) => {
    setEditingId(contragent.id);
    setIsModalOpen(true);
  };

  const handleSave = (values: ContragentFormValues) => {
    if (editingId) {
      setContragents((current) =>
        current.map((contragent) =>
          contragent.id === editingId ? { ...contragent, ...values } : contragent,
        ),
      );
    } else {
      setContragents((current) => [...current, { id: nextId, ...values }]);
      setNextId((current) => current + 1);
    }

    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setContragents((current) => current.filter((contragent) => contragent.id !== id));
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.card}>
          <header className={styles.header}>
            <div className={styles.headerTop}>
              <a
                href="https://www.moysklad.ru/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="МойСклад"
                className={styles.logoLink}
              >
                <img
                  src="https://www.moysklad.ru/includes/logo/logo.svg"
                  alt="МойСклад"
                  className={styles.logo}
                />
              </a>

              <button type="button" className={styles.addButton} onClick={handleOpenAdd}>
                Добавить
              </button>
            </div>
          </header>

          <ContragentsTable
            contragents={contragents}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <ContragentsModal
        isOpen={isModalOpen}
        counterparty={editingCounterparty}
        onSave={handleSave}
        onClose={handleClose}
      />
    </div>
  );
}

export default App;
