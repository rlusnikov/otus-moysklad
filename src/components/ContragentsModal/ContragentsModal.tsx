import { type ChangeEvent, type FormEvent, type MouseEvent, useEffect, useState } from 'react';
import type { Contragent, ContragentFormValues, ValidationErrors } from '../../types/contragent';
import { validateContragentForm } from '../../utils/validation';
import styles from './ContragentsModal.module.css';

const emptyForm: ContragentFormValues = {
  name: '',
  inn: '',
  address: '',
  kpp: '',
};

interface ContragentsModalProps {
  isOpen: boolean;
  counterparty: Contragent | null;
  onSave: (values: ContragentFormValues) => void | Promise<void>;
  onClose: () => void;
}

function ContragentsModal({ isOpen, counterparty, onSave, onClose }: ContragentsModalProps) {
  const [formValues, setFormValues] = useState<ContragentFormValues>(emptyForm);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (counterparty) {
      setFormValues({
        name: counterparty.name,
        inn: counterparty.inn,
        address: counterparty.address,
        kpp: counterparty.kpp,
      });
    } else {
      setFormValues(emptyForm);
    }

    setErrors({});
  }, [isOpen, counterparty]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (field: keyof ContragentFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => {
        const nextErrors = { ...current };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values: ContragentFormValues = {
      name: formValues.name.trim(),
      inn: formValues.inn.trim(),
      address: formValues.address.trim(),
      kpp: formValues.kpp.trim(),
    };

    const validationErrors = validateContragentForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSave(values);
  };

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

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

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>Наименование</span>
            <input
              name="name"
              type="text"
              value={formValues.name}
              onChange={handleChange('name')}
              placeholder='Например, ООО "Ромашка"'
              className={errors.name ? styles.inputError : styles.input}
              aria-label="Наименование"
            />
            {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>ИНН</span>
            <input
              name="inn"
              type="text"
              inputMode="numeric"
              maxLength={11}
              value={formValues.inn}
              onChange={handleChange('inn')}
              placeholder="11 цифр, например 77012345678"
              className={errors.inn ? styles.inputError : styles.input}
              aria-label="ИНН"
            />
            {errors.inn ? <span className={styles.error}>{errors.inn}</span> : null}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Адрес</span>
            <input
              name="address"
              type="text"
              value={formValues.address}
              onChange={handleChange('address')}
              placeholder="Например, г. Москва, ул. Ленина, 1"
              className={errors.address ? styles.inputError : styles.input}
              aria-label="Адрес"
            />
            {errors.address ? <span className={styles.error}>{errors.address}</span> : null}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>КПП</span>
            <input
              name="kpp"
              type="text"
              inputMode="numeric"
              maxLength={9}
              value={formValues.kpp}
              onChange={handleChange('kpp')}
              placeholder="9 цифр, например 770101001"
              className={errors.kpp ? styles.inputError : styles.input}
              aria-label="КПП"
            />
            {errors.kpp ? <span className={styles.error}>{errors.kpp}</span> : null}
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.buttonSecondary} onClick={onClose}>
              Отменить
            </button>
            <button type="submit" className={styles.buttonPrimary}>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContragentsModal;
