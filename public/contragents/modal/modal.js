const TEMPLATE_URL = new URL('./modal.html', import.meta.url);
const STYLE_URL = new URL('./modal.css', import.meta.url);

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
  };

  const open = (counterparty = null) => {
    form.reset();

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

    const values = getFormValues(form);

    if (!values.name || !values.inn || !values.address || !values.kpp) {
      return;
    }

    onSave(values);
    close();
  });

  return { open, close };
}
