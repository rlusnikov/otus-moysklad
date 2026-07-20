const TEMPLATE_URL = new URL('./table.html', import.meta.url);
const STYLE_URL = new URL('./table.css', import.meta.url);

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

const createCell = (text, className) => {
  const cell = document.createElement('td');
  cell.className = className;
  cell.textContent = text;

  return cell;
};

export async function createContragentsTable(container, { onEdit, onDelete }) {
  loadStylesheet(STYLE_URL);

  const template = await fetch(TEMPLATE_URL).then((response) => response.text());
  container.innerHTML = template;

  const tableBody = container.querySelector('[data-table-body]');

  const render = (items) => {
    tableBody.textContent = '';

    items.forEach((item) => {
      const row = document.createElement('tr');
      row.className = 'cursor-pointer hover:bg-slate-50/80';

      const nameCell = document.createElement('th');
      nameCell.scope = 'row';
      nameCell.className = 'whitespace-nowrap px-6 py-4 font-medium text-slate-900';
      nameCell.textContent = item.name;

      const actionsCell = createCell('', 'px-6 py-4 text-right');
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className =
        'inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50';
      deleteButton.textContent = 'Удалить';

      deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        onDelete(item.id);
      });

      actionsCell.appendChild(deleteButton);

      row.append(
        nameCell,
        createCell(item.inn, 'px-6 py-4'),
        createCell(item.address, 'px-6 py-4'),
        createCell(item.kpp, 'px-6 py-4 font-medium text-slate-900'),
        actionsCell,
      );

      row.addEventListener('dblclick', () => onEdit(item));
      tableBody.appendChild(row);
    });
  };

  return { render };
}
