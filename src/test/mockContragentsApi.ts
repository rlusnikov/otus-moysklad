import type { Contragent, ContragentFormValues } from '../types/contragent';

export const mockContragents: Contragent[] = [
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
  {
    id: 3,
    name: 'ИП Иванов Иван Иванович',
    inn: '540123456723',
    address: 'г. Новосибирск, Красный проспект, 10',
    kpp: '540101001',
  },
];

export function createContragentsApiMock() {
  let contragents = [...mockContragents];
  let nextId = 4;

  return {
    getContragents: jest.fn(async () => [...contragents]),
    createContragent: jest.fn(async (values: ContragentFormValues) => {
      const created: Contragent = { id: nextId, ...values };
      nextId += 1;
      contragents = [...contragents, created];
      return created;
    }),
    updateContragent: jest.fn(async (id: number, values: ContragentFormValues) => {
      const updated: Contragent = { id, ...values };
      contragents = contragents.map((contragent) => (contragent.id === id ? updated : contragent));
      return updated;
    }),
    deleteContragent: jest.fn(async (id: number) => {
      contragents = contragents.filter((contragent) => contragent.id !== id);
    }),
  };
}
