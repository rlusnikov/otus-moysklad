import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Contragent } from '../../types/contragent';
import ContragentsModal from './ContragentsModal';

const counterparty: Contragent = {
  id: 1,
  name: 'ООО "Ромашка"',
  inn: '77012345678',
  address: 'г. Москва, ул. Ленина, 1',
  kpp: '770101001',
};

describe('ContragentsModal', () => {
  it('renders modal when isOpen is true', () => {
    render(
      <ContragentsModal
        isOpen
        counterparty={null}
        onSave={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Контрагент' })).toBeInTheDocument();
    expect(screen.getByLabelText('Наименование')).toBeInTheDocument();
    expect(screen.getByLabelText('ИНН')).toBeInTheDocument();
    expect(screen.getByLabelText('Адрес')).toBeInTheDocument();
    expect(screen.getByLabelText('КПП')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(
      <ContragentsModal
        isOpen={false}
        counterparty={null}
        onSave={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(screen.queryByRole('heading', { name: 'Контрагент' })).not.toBeInTheDocument();
  });

  it('prefills form when counterparty is provided', () => {
    render(
      <ContragentsModal
        isOpen
        counterparty={counterparty}
        onSave={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Наименование')).toHaveValue('ООО "Ромашка"');
    expect(screen.getByLabelText('ИНН')).toHaveValue('77012345678');
    expect(screen.getByLabelText('Адрес')).toHaveValue('г. Москва, ул. Ленина, 1');
    expect(screen.getByLabelText('КПП')).toHaveValue('770101001');
  });

  it('calls onSave with valid data', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(
      <ContragentsModal
        isOpen
        counterparty={null}
        onSave={onSave}
        onClose={jest.fn()}
      />,
    );

    await user.type(screen.getByLabelText('Наименование'), '  ООО "Тест"  ');
    await user.type(screen.getByLabelText('ИНН'), '12345678901');
    await user.type(screen.getByLabelText('Адрес'), '  г. Москва  ');
    await user.type(screen.getByLabelText('КПП'), '123456789');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        name: 'ООО "Тест"',
        inn: '12345678901',
        address: 'г. Москва',
        kpp: '123456789',
      });
    });
  });

  it('shows validation errors for invalid INN and KPP', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(
      <ContragentsModal
        isOpen
        counterparty={null}
        onSave={onSave}
        onClose={jest.fn()}
      />,
    );

    await user.type(screen.getByLabelText('Наименование'), 'ООО "Тест"');
    await user.type(screen.getByLabelText('ИНН'), '123');
    await user.type(screen.getByLabelText('Адрес'), 'г. Москва');
    await user.type(screen.getByLabelText('КПП'), '12');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(screen.getByText('ИНН должен содержать 11 цифр')).toBeInTheDocument();
    expect(screen.getByText('КПП должен содержать 9 цифр')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(
      <ContragentsModal
        isOpen
        counterparty={null}
        onSave={onSave}
        onClose={jest.fn()}
      />,
    );

    await user.type(screen.getByLabelText('ИНН'), '12345678901');
    await user.type(screen.getByLabelText('КПП'), '123456789');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(screen.getByText('Наименование обязательно')).toBeInTheDocument();
    expect(screen.getByText('Адрес обязателен')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('renders operation error separately from validation errors', () => {
    render(
      <ContragentsModal
        isOpen
        counterparty={null}
        operationError="Не удалось сохранить контрагента"
        onSave={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Не удалось сохранить контрагента');
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <ContragentsModal
        isOpen
        counterparty={counterparty}
        onSave={jest.fn()}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Отменить' }));

    expect(onClose).toHaveBeenCalled();
  });
});
