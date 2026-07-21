import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import * as contragentsApi from '../api/contragentsApi';
import { ContragentsProvider, useContragents } from './ContragentsContext';
import { mockContragents } from '../test/mockContragentsApi';
import { resetContragentsApiMock } from "../api/__mocks__/contragentsApi.ts";

jest.mock('../api/contragentsApi');

function wrapper({ children }: { children: ReactNode }) {
  return <ContragentsProvider>{children}</ContragentsProvider>;
}

describe('ContragentsContext', () => {
  beforeEach(() => {
    resetContragentsApiMock();
  });

  it('loads contragents on mount', async () => {
    const { result } = renderHook(() => useContragents(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.contragents).toEqual(mockContragents);
    expect(contragentsApi.getContragents).toHaveBeenCalled();
  });

  it('creates, updates and deletes contragents', async () => {
    const { result } = renderHook(() => useContragents(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.createContragent({
        name: 'ООО "Новый"',
        inn: '99999999999',
        address: 'г. Казань',
        kpp: '999999999',
      });
    });

    await waitFor(() => {
      expect(result.current.contragents).toHaveLength(4);
    });

    await act(async () => {
      await result.current.updateContragent(1, {
        name: 'ООО "Обновлено"',
        inn: '77012345678',
        address: 'г. Москва, ул. Ленина, 1',
        kpp: '770101001',
      });
    });

    await waitFor(() => {
      expect(result.current.contragents[0].name).toBe('ООО "Обновлено"');
    });

    await act(async () => {
      await result.current.deleteContragent(1);
    });

    await waitFor(() => {
      expect(result.current.contragents.find((item) => item.id === 1)).toBeUndefined();
    });
  });
});
