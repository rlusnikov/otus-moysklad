import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as contragentsApi from '../api/contragentsApi';
import type { Contragent, ContragentFormValues } from '../types/contragent';

interface ContragentsContextValue {
  contragents: Contragent[];
  loading: boolean;
  error: string | null;
  loadContragents: () => Promise<void>;
  createContragent: (values: ContragentFormValues) => Promise<void>;
  updateContragent: (id: number, values: ContragentFormValues) => Promise<void>;
  deleteContragent: (id: number) => Promise<void>;
}

const ContragentsContext = createContext<ContragentsContextValue | null>(null);

interface ContragentsProviderProps {
  children: ReactNode;
}

export function ContragentsProvider({ children }: ContragentsProviderProps) {
  const [contragents, setContragents] = useState<Contragent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContragents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await contragentsApi.getContragents();
      setContragents(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить контрагентов');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContragents();
  }, [loadContragents]);

  const createContragent = useCallback(async (values: ContragentFormValues) => {
    const created = await contragentsApi.createContragent(values);
    setContragents((current) => [...current, created]);
  }, []);

  const updateContragent = useCallback(async (id: number, values: ContragentFormValues) => {
    const updated = await contragentsApi.updateContragent(id, values);
    setContragents((current) =>
      current.map((contragent) => (contragent.id === id ? updated : contragent)),
    );
  }, []);

  const deleteContragent = useCallback(async (id: number) => {
    await contragentsApi.deleteContragent(id);
    setContragents((current) => current.filter((contragent) => contragent.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      contragents,
      loading,
      error,
      loadContragents,
      createContragent,
      updateContragent,
      deleteContragent,
    }),
    [
      contragents,
      loading,
      error,
      loadContragents,
      createContragent,
      updateContragent,
      deleteContragent,
    ],
  );

  return <ContragentsContext.Provider value={value}>{children}</ContragentsContext.Provider>;
}

export function useContragents(): ContragentsContextValue {
  const context = useContext(ContragentsContext);

  if (!context) {
    throw new Error('useContragents must be used within ContragentsProvider');
  }

  return context;
}
