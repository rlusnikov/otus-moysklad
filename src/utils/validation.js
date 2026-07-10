export const INN_PATTERN = /^\d{11}$/;
export const KPP_PATTERN = /^\d{9}$/;

export function validateContragentForm(values) {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name = 'Наименование обязательно';
  }

  if (!values.address?.trim()) {
    errors.address = 'Адрес обязателен';
  }

  if (!INN_PATTERN.test(values.inn || '')) {
    errors.inn = 'ИНН должен содержать 11 цифр';
  }

  if (!KPP_PATTERN.test(values.kpp || '')) {
    errors.kpp = 'КПП должен содержать 9 цифр';
  }

  return errors;
}
