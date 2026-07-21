import type { Contragent, ContragentFormValues } from '../../types/contragent';
import { mockContragents } from '../../test/mockContragentsApi';

let contragents: Contragent[] = [...mockContragents];
let nextId = 4;

export function resetContragentsApiMock() {
  contragents = [...mockContragents];
  nextId = 4;
  getContragents.mockClear();
  createContragent.mockClear();
  updateContragent.mockClear();
  deleteContragent.mockClear();
}

export const getContragents = jest.fn(async () => [...contragents]);

export const createContragent = jest.fn(async (values: ContragentFormValues) => {
  const created: Contragent = { id: nextId, ...values };
  nextId += 1;
  contragents = [...contragents, created];
  return created;
});

export const updateContragent = jest.fn(async (id: number, values: ContragentFormValues) => {
  const updated: Contragent = { id, ...values };
  contragents = contragents.map((contragent) => (contragent.id === id ? updated : contragent));
  return updated;
});

export const deleteContragent = jest.fn(async (id: number) => {
  contragents = contragents.filter((contragent) => contragent.id !== id);
});
