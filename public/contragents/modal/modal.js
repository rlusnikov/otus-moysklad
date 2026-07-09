const TEMPLATE_URL = new URL('./modal.html', import.meta.url);
const STYLE_URL = new URL('./modal.css', import.meta.url);

const INN_PATTERN = /^\d{11}$/;
const KPP_PATTERN = /^\d{9}$/;

const loadStylesheet = (url) => {
  const href = url.pathname;

  if (document.querySelector(`link[href="${href}"]`)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
};

const getFormValues = (form) => {
  const formData = new FormData(form);

  return {
    name: String(formData.get('name') || '').trim(),
    inn: String(formData.get('inn') || '').trim(),
    address: String(formData.get('address') || '').trim(),
    kpp: String(formData.get('kpp') || '').trim(),
  };
};

export async function createContragentsModal(container, { onSave }) {
  loadStylesheet(STYLE_URL);

  const template = await fetch(TEMPLATE_URL).then((response) => response.text());
  container.innerHTML = template;

  const modal = container.querySelector('[data-modal]');
  const form = container.querySelector('[data-modal-form]');
  const closeButton = container.querySelector('[data-close-modal]');
  const cancelButton = container.querySelector('[data-cancel-modal]');
  const innInput = form.elements.inn;
  const kppInput = form.elements.kpp;

  const fieldErrorClasses = ['border-red-300', 'focus:border-red-500', 'focus:ring-red-200'];
  const fieldDefaultClasses = ['border-slate-300', 'focus:border-[#2855AF]', 'focus:ring-[#2855AF]/15'];

  const setFieldError = (fieldName, message) => {
    const input = form.querySelector(`[data-field="${fieldName}"]`);
    const error = form.querySelector(`[data-error="${fieldName}"]`);

    if (!input || !error) {
      return;
    }

    input.classList.remove(...fieldDefaultClasses);
    input.classList.add(...fieldErrorClasses);
    error.textContent = message;
    error.classList.remove('hidden');
  };

  const clearFieldError = (fieldName) => {
    const input = form.querySelector(`[data-field="${fieldName}"]`);
    const error = form.querySelector(`[data-error="${fieldName}"]`);

    if (!input || !error) {
      return;
    }

    input.classList.remove(...fieldErrorClasses);
    input.classList.add(...fieldDefaultClasses);
    error.textContent = '';
    error.classList.add('hidden');
  };

  const clearValidation = () => {
    clearFieldError('inn');
    clearFieldError('kpp');
  };

  const validateForm = () => {
    clearValidation();

    const values = getFormValues(form);
    let isValid = true;

    if (!values.name || !values.address) {
      isValid = false;
    }

    if (!INN_PATTERN.test(values.inn)) {
      setFieldError('inn', 'ИНН должен содержать 11 цифр');
      isValid = false;
    }

    if (!KPP_PATTERN.test(values.kpp)) {
      setFieldError('kpp', 'КПП должен содержать 9 цифр');
      isValid = false;
    }

    return isValid ? values : null;
  };

  const fillForm = (counterparty) => {
    form.elements.name.value = counterparty.name;
    form.elements.inn.value = counterparty.inn;
    form.elements.address.value = counterparty.address;
    form.elements.kpp.value = counterparty.kpp;
  };

  const close = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    modal.setAttribute('aria-hidden', 'true');
    form.reset();
    clearValidation();
  };

  const open = (counterparty = null) => {
    form.reset();
    clearValidation();

    if (counterparty) {
      fillForm(counterparty);
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.setAttribute('aria-hidden', 'false');

    const firstField = form.querySelector('input[name="name"]');
    if (firstField) {
      firstField.focus();
    }
  };

  closeButton.addEventListener('click', close);
  cancelButton.addEventListener('click', close);

  innInput.addEventListener('input', () => clearFieldError('inn'));
  kppInput.addEventListener('input', () => clearFieldError('kpp'));

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      close();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
      close();
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const values = validateForm();

    if (!values) {
      return;
    }

    onSave(values);
    close();
  });

  return { open, close };
}
