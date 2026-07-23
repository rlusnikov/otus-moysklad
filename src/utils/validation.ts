import type { ContragentFormValues, ValidationErrors } from '../types/contragent';

const INN_PATTERN = /^\d{10}$|^\d{12}$/;
const KPP_PATTERN = /^\d{9}$/;

const INN_10_COEFFICIENTS = [2, 4, 10, 3, 5, 9, 4, 6, 8];
const INN_11_COEFFICIENTS = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
const INN_12_COEFFICIENTS = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];

function getChecksum(digits: number[], coefficients: number[]): number {
  const sum = coefficients.reduce((total, coefficient, index) => total + coefficient * digits[index], 0);
  return (sum % 11) % 10;
}

function hasValidInnChecksum(inn: string): boolean {
  const digits = inn.split('').map(Number);

  if (digits.length === 10) {
    return getChecksum(digits, INN_10_COEFFICIENTS) === digits[9];
  }

  return (
    getChecksum(digits, INN_11_COEFFICIENTS) === digits[10] &&
    getChecksum(digits, INN_12_COEFFICIENTS) === digits[11]
  );
}

function hasValidKppStructure(kpp: string): boolean {
  const taxOfficeCode = kpp.slice(0, 4);
  const reasonCode = kpp.slice(4, 6);

  // Код налогового органа и причина постановки не могут быть нулевыми.
  return taxOfficeCode !== '0000' && reasonCode !== '00';
}

export function isValidInn(inn: string): boolean {
  return INN_PATTERN.test(inn) && hasValidInnChecksum(inn);
}

export function isValidKpp(kpp: string): boolean {
  return KPP_PATTERN.test(kpp) && hasValidKppStructure(kpp);
}

export function validateContragentForm(values: ContragentFormValues): ValidationErrors {
  const errors: ValidationErrors = {};
  const inn = values.inn.trim();
  const kpp = values.kpp.trim();

  if (!values.name.trim()) {
    errors.name = 'Наименование обязательно';
  }

  if (!values.address.trim()) {
    errors.address = 'Адрес обязателен';
  }

  if (!INN_PATTERN.test(inn)) {
    errors.inn = 'ИНН должен содержать 10 или 12 цифр';
  } else if (!hasValidInnChecksum(inn)) {
    errors.inn = 'ИНН указан некорректно';
  }

  if (!KPP_PATTERN.test(kpp)) {
    errors.kpp = 'КПП должен содержать 9 цифр';
  } else if (!hasValidKppStructure(kpp)) {
    errors.kpp = 'КПП указан некорректно';
  }

  return errors;
}
