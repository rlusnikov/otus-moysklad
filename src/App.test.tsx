import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContragentsProvider } from './context/ContragentsContext';
import App from './App';

jest.mock('./api/contragentsApi');

const {
  resetContragentsApiMock,
  getContragents,
  createContragent,
  updateContragent,
  deleteContragent,
} = jest.requireMock('./api/contragentsApi') as typeof import('./api/__mocks__/contragentsApi');

function renderApp() {
  return render(
    <ContragentsProvider>
      <App />
    </ContragentsProvider>,
  );
}

describe('App', () => {
  beforeEach(() => {
    resetContragentsApiMock();
  });
  it('renders initial contragents in the table', async () => {
    renderApp();

    expect(await screen.findByRole('rowheader', { name: 'ООО "Ромашка"' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'АО "Вектор"' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'ИП Иванов Иван Иванович' })).toBeInTheDocument();
  });

  it('opens modal when add button is clicked', async () => {
    const user = userEvent.setup();

    renderApp();
    await screen.findByRole('rowheader', { name: 'ООО "Ромашка"' });

    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(screen.getByRole('heading', { name: 'Контрагент' })).toBeInTheDocument();
    expect(screen.getByLabelText('Наименование')).toHaveValue('');
  });

  it('adds a new contragent on save', async () => {
    const user = userEvent.setup();

    renderApp();
    await screen.findByRole('rowheader', { name: 'ООО "Ромашка"' });

    await user.click(screen.getByRole('button', { name: 'Добавить' }));
    await user.type(screen.getByLabelText('Наименование'), 'ООО "Новый"');
    await user.type(screen.getByLabelText('ИНН'), '99999999999');
    await user.type(screen.getByLabelText('Адрес'), 'г. Казань');
    await user.type(screen.getByLabelText('КПП'), '999999999');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(await screen.findByRole('rowheader', { name: 'ООО "Новый"' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '99999999999' })).toBeInTheDocument();
  });

  it('shows an error and keeps the modal open when save fails', async () => {
    const user = userEvent.setup();
    createContragent.mockRejectedValueOnce(new Error('Save failed'));

    renderApp();
    await screen.findByRole('rowheader', { name: 'ООО "Ромашка"' });

    await user.click(screen.getByRole('button', { name: 'Добавить' }));
    await user.type(screen.getByLabelText('Наименование'), 'ООО "Новый"');
    await user.type(screen.getByLabelText('ИНН'), '99999999999');
    await user.type(screen.getByLabelText('Адрес'), 'г. Казань');
    await user.type(screen.getByLabelText('КПП'), '999999999');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Не удалось сохранить контрагента. Попробуйте ещё раз',
    );
    expect(screen.getByRole('heading', { name: 'Контрагент' })).toBeInTheDocument();
  });

  it('edits contragent on double click and save', async () => {
    const user = userEvent.setup();

    renderApp();
    await screen.findByRole('rowheader', { name: 'ООО "Ромашка"' });

    await user.dblClick(screen.getByRole('rowheader', { name: 'ООО "Ромашка"' }));

    const nameInput = screen.getByLabelText('Наименование');
    await user.clear(nameInput);
    await user.type(nameInput, 'ООО "Обновлено"');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    await waitFor(() => {
      expect(screen.getByRole('rowheader', { name: 'ООО "Обновлено"' })).toBeInTheDocument();
    });
    expect(screen.queryByRole('rowheader', { name: 'ООО "Ромашка"' })).not.toBeInTheDocument();
  });

  it('edits a contragent whose id is zero', async () => {
    const user = userEvent.setup();
    getContragents.mockResolvedValueOnce([
      {
        id: 0,
        name: 'ООО "Нулевой"',
        inn: '99999999999',
        address: 'г. Казань',
        kpp: '999999999',
      },
    ]);

    renderApp();
    await user.dblClick(await screen.findByRole('rowheader', { name: 'ООО "Нулевой"' }));

    expect(screen.getByLabelText('Наименование')).toHaveValue('ООО "Нулевой"');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(updateContragent).toHaveBeenCalledWith(0, {
      name: 'ООО "Нулевой"',
      inn: '99999999999',
      address: 'г. Казань',
      kpp: '999999999',
    });
    expect(createContragent).not.toHaveBeenCalled();
  });

  it('deletes contragent from the table', async () => {
    const user = userEvent.setup();

    renderApp();
    await screen.findByRole('rowheader', { name: 'ООО "Ромашка"' });

    const deleteButtons = screen.getAllByRole('button', { name: 'Удалить' });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByRole('rowheader', { name: 'ООО "Ромашка"' })).not.toBeInTheDocument();
    });
  });

  it('shows an error and keeps the contragent when delete fails', async () => {
    const user = userEvent.setup();
    deleteContragent.mockRejectedValueOnce(new Error('Delete failed'));

    renderApp();
    await screen.findByRole('rowheader', { name: 'ООО "Ромашка"' });

    const deleteButtons = screen.getAllByRole('button', { name: 'Удалить' });
    await user.click(deleteButtons[0]);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Не удалось удалить контрагента. Попробуйте ещё раз',
    );
    expect(screen.getByRole('rowheader', { name: 'ООО "Ромашка"' })).toBeInTheDocument();
  });

  it('does not change data when edit is cancelled', async () => {
    const user = userEvent.setup();

    renderApp();
    await screen.findByRole('rowheader', { name: 'ООО "Ромашка"' });

    await user.dblClick(screen.getByRole('rowheader', { name: 'ООО "Ромашка"' }));

    const nameInput = screen.getByLabelText('Наименование');
    await user.clear(nameInput);
    await user.type(nameInput, 'ООО "Не должно сохраниться"');
    await user.click(screen.getByRole('button', { name: 'Отменить' }));

    expect(screen.getByRole('rowheader', { name: 'ООО "Ромашка"' })).toBeInTheDocument();
    expect(screen.queryByRole('rowheader', { name: 'ООО "Не должно сохраниться"' })).not.toBeInTheDocument();
  });
});
