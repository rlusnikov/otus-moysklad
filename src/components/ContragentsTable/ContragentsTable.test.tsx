import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Contragent } from '../../types/contragent';
import ContragentsTable from './ContragentsTable';

const contragents: Contragent[] = [
  {
    id: 1,
    name: 'ООО "Ромашка"',
    inn: '7707083893',
    address: 'г. Москва, ул. Ленина, 1',
    kpp: '770101001',
  },
  {
    id: 2,
    name: 'АО "Вектор"',
    inn: '7812345675',
    address: 'г. Санкт-Петербург, Невский проспект, 25',
    kpp: '781201001',
  },
];

describe('ContragentsTable', () => {
  it('renders table headers', () => {
    render(<ContragentsTable contragents={[]} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByRole('columnheader', { name: 'Наименование' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'ИНН' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Адрес' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'КПП' })).toBeInTheDocument();
  });

  it('renders contragents data', () => {
    render(<ContragentsTable contragents={contragents} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByRole('rowheader', { name: 'ООО "Ромашка"' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '7707083893' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'АО "Вектор"' })).toBeInTheDocument();
  });

  it('calls onEdit when row is double clicked', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();

    render(<ContragentsTable contragents={contragents} onEdit={onEdit} onDelete={jest.fn()} />);

    await user.dblClick(screen.getByRole('rowheader', { name: 'ООО "Ромашка"' }));

    expect(onEdit).toHaveBeenCalledWith(contragents[0]);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(<ContragentsTable contragents={contragents} onEdit={jest.fn()} onDelete={onDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: 'Удалить' });
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
