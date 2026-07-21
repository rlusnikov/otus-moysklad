import type { Contragent, ContragentFormValues } from '../types/contragent';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getContragents(): Promise<Contragent[]> {
  return request<Contragent[]>('/contragents');
}

export function createContragent(values: ContragentFormValues): Promise<Contragent> {
  return request<Contragent>('/contragents', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export function updateContragent(id: number, values: ContragentFormValues): Promise<Contragent> {
  return request<Contragent>(`/contragents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(values),
  });
}

export function deleteContragent(id: number): Promise<void> {
  return request<void>(`/contragents/${id}`, {
    method: 'DELETE',
  });
}
