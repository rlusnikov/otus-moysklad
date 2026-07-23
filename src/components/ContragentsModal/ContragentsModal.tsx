import { type MouseEvent } from 'react';
import { Field, Form, type FieldRenderProps } from 'react-final-form';
import type { Contragent, ContragentFormValues } from '../../types/contragent';
import { validateContragentForm } from '../../utils/validation';
import styles from './ContragentsModal.module.css';

const emptyForm: ContragentFormValues = {
  name: '',
  inn: '',
  address: '',
  kpp: '',
};

function getInitialValues(counterparty: Contragent | null): ContragentFormValues {
  if (!counterparty) {
    return emptyForm;
  }

  return {
    name: counterparty.name,
    inn: counterparty.inn,
    address: counterparty.address,
    kpp: counterparty.kpp,
  };
}

function trimFormValues(values: Partial<ContragentFormValues>): ContragentFormValues {
  return {
    name: values.name?.trim() ?? '',
    inn: values.inn?.trim() ?? '',
    address: values.address?.trim() ?? '',
    kpp: values.kpp?.trim() ?? '',
  };
}

function validateForm(values: ContragentFormValues) {
  return validateContragentForm(trimFormValues(values));
}

interface FormFieldProps {
  name: keyof ContragentFormValues;
  label: string;
  placeholder: string;
  inputMode?: 'numeric';
  maxLength?: number;
}

function FormField({ name, label, placeholder, inputMode, maxLength }: FormFieldProps) {
  return (
    <Field<string, HTMLInputElement, ContragentFormValues> name={name} parse={(value: string) => value}>
      {({ input, meta }: FieldRenderProps<string, HTMLInputElement>) => {
        const error = meta.submitFailed && meta.error ? String(meta.error) : null;

        return (
          <label className={styles.field}>
            <span className={styles.label}>{label}</span>
            <input
              {...input}
              type="text"
              inputMode={inputMode}
              maxLength={maxLength}
              placeholder={placeholder}
              className={error ? styles.inputError : styles.input}
              aria-label={label}
            />
            {error ? <span className={styles.error}>{error}</span> : null}
          </label>
        );
      }}
    </Field>
  );
}

interface ContragentsModalProps {
  isOpen: boolean;
  counterparty: Contragent | null;
  operationError?: string | null;
  onSave: (values: ContragentFormValues) => void | Promise<void>;
  onClose: () => void;
}

function ContragentsModal({
  isOpen,
  counterparty,
  operationError = null,
  onSave,
  onClose,
}: ContragentsModalProps) {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const initialValues = getInitialValues(counterparty);
  const formKey = counterparty ? `edit-${counterparty.id}` : 'create';

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      aria-hidden="false"
      role="presentation"
    >
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="contragent-modal-title">
        <div className={styles.header}>
          <div>
            <h2 id="contragent-modal-title" className={styles.title}>
              Контрагент
            </h2>
            <p className={styles.subtitle}>Заполните данные контрагента.</p>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
            <svg className={styles.closeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <Form<ContragentFormValues>
          key={formKey}
          initialValues={initialValues}
          onSubmit={(values) => onSave(trimFormValues(values))}
          validate={validateForm}
        >
          {({ handleSubmit, submitting }) => (
            <form className={styles.form} onSubmit={handleSubmit}>
              {operationError ? (
                <p className={styles.error} role="alert">
                  {operationError}
                </p>
              ) : null}

              <FormField name="name" label="Наименование" placeholder='Например, ООО "Ромашка"' />

              <FormField
                name="inn"
                label="ИНН"
                inputMode="numeric"
                maxLength={12}
                placeholder="10 или 12 цифр, например 7707083893"
              />

              <FormField name="address" label="Адрес" placeholder="Например, г. Москва, ул. Ленина, 1" />

              <FormField
                name="kpp"
                label="КПП"
                inputMode="numeric"
                maxLength={9}
                placeholder="9 цифр, например 770101001"
              />

              <div className={styles.actions}>
                <button type="button" className={styles.buttonSecondary} onClick={onClose}>
                  Отменить
                </button>
                <button type="submit" className={styles.buttonPrimary} disabled={submitting}>
                  Сохранить
                </button>
              </div>
            </form>
          )}
        </Form>
      </div>
    </div>
  );
}

export default ContragentsModal;
