import type { Contragent } from '../../types/contragent';
import styles from './ContragentsTable.module.css';

interface ContragentsTableProps {
  contragents: Contragent[];
  onEdit: (contragent: Contragent) => void;
  onDelete: (id: number) => void;
}

function ContragentsTable({ contragents, onEdit, onDelete }: ContragentsTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.head}>
          <tr>
            <th scope="col" className={styles.headCell}>
              Наименование
            </th>
            <th scope="col" className={styles.headCell}>
              ИНН
            </th>
            <th scope="col" className={styles.headCell}>
              Адрес
            </th>
            <th scope="col" className={styles.headCell}>
              КПП
            </th>
            <th scope="col" className={styles.headCell} />
          </tr>
        </thead>
        <tbody className={styles.body}>
          {contragents.map((contragent) => (
            <tr
              key={contragent.id}
              className={styles.row}
              onDoubleClick={() => onEdit(contragent)}
            >
              <th scope="row" className={styles.nameCell}>
                {contragent.name}
              </th>
              <td className={styles.cell}>{contragent.inn}</td>
              <td className={styles.cell}>{contragent.address}</td>
              <td className={styles.kppCell}>{contragent.kpp}</td>
              <td className={styles.actionsCell}>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(contragent.id);
                  }}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContragentsTable;
