import { isValidInn, isValidKpp, validateContragentForm } from './validation';

describe('isValidInn', () => {
  it('accepts valid 10-digit INN', () => {
    expect(isValidInn('7707083893')).toBe(true);
    expect(isValidInn('7812345675')).toBe(true);
  });

  it('accepts valid 12-digit INN', () => {
    expect(isValidInn('540123456723')).toBe(true);
  });

  it('rejects INN with invalid length', () => {
    expect(isValidInn('770708389')).toBe(false);
    expect(isValidInn('77070838931')).toBe(false);
  });

  it('rejects INN with invalid checksum', () => {
    expect(isValidInn('7707083890')).toBe(false);
    expect(isValidInn('540123456722')).toBe(false);
  });
});

describe('isValidKpp', () => {
  it('accepts structurally valid KPP', () => {
    expect(isValidKpp('770101001')).toBe(true);
    expect(isValidKpp('781201001')).toBe(true);
  });

  it('rejects KPP with invalid length or non-digits', () => {
    expect(isValidKpp('77010100')).toBe(false);
    expect(isValidKpp('77010100a')).toBe(false);
  });

  it('rejects KPP with zero tax office or reason code', () => {
    expect(isValidKpp('000001001')).toBe(false);
    expect(isValidKpp('770100001')).toBe(false);
  });
});

describe('validateContragentForm', () => {
  it('returns field errors for invalid INN and KPP', () => {
    expect(
      validateContragentForm({
        name: 'ООО "Тест"',
        inn: '7707083890',
        address: 'г. Москва',
        kpp: '770100001',
      }),
    ).toEqual({
      inn: 'ИНН указан некорректно',
      kpp: 'КПП указан некорректно',
    });
  });

  it('returns length errors for short INN and KPP', () => {
    expect(
      validateContragentForm({
        name: 'ООО "Тест"',
        inn: '123',
        address: 'г. Москва',
        kpp: '12',
      }),
    ).toEqual({
      inn: 'ИНН должен содержать 10 или 12 цифр',
      kpp: 'КПП должен содержать 9 цифр',
    });
  });
});
