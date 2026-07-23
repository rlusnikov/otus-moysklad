import { useState } from 'react';
import type { Contragent, ContragentFormValues } from './types/contragent';
import { useContragents } from './context/ContragentsContext';
import ContragentsModal from './components/ContragentsModal/ContragentsModal';
import ContragentsTable from './components/ContragentsTable/ContragentsTable';
import styles from './App.module.css';

function App() {
  const { contragents, loading, error, createContragent, updateContragent, deleteContragent } =
    useContragents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);

  const editingCounterparty =
    editingId !== null
      ? (contragents.find((contragent) => contragent.id === editingId) ?? null)
      : null;

  const handleOpenAdd = () => {
    setOperationError(null);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (contragent: Contragent) => {
    setOperationError(null);
    setEditingId(contragent.id);
    setIsModalOpen(true);
  };

  const handleSave = async (values: ContragentFormValues) => {
    setOperationError(null);

    try {
      if (editingId !== null) {
        await updateContragent(editingId, values);
      } else {
        await createContragent(values);
      }

      setIsModalOpen(false);
      setEditingId(null);
    } catch {
      setOperationError('Не удалось сохранить контрагента. Попробуйте ещё раз');
    }
  };

  const handleDelete = async (id: number) => {
    setOperationError(null);

    try {
      await deleteContragent(id);
    } catch {
      setOperationError('Не удалось удалить контрагента. Попробуйте ещё раз');
    }
  };

  const handleClose = () => {
    setOperationError(null);
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

          {loading ? <p className={styles.status}>Загрузка контрагентов...</p> : null}
          {error ? <p className={styles.error}>{error}</p> : null}
          {operationError && !isModalOpen ? (
            <p className={styles.error} role="alert">
              {operationError}
            </p>
          ) : null}

          {!loading && !error ? (
            <ContragentsTable
              contragents={contragents}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : null}
        </div>
      </main>

      <ContragentsModal
        isOpen={isModalOpen}
        counterparty={editingCounterparty}
        operationError={operationError}
        onSave={handleSave}
        onClose={handleClose}
      />
    </div>
  );
}

export default App;
