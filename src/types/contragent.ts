export interface Contragent {
  id: number;
  name: string;
  inn: string;
  address: string;
  kpp: string;
}

export interface ContragentFormValues {
  name: string;
  inn: string;
  address: string;
  kpp: string;
}

export type ValidationErrors = Partial<Record<keyof ContragentFormValues, string>>;
