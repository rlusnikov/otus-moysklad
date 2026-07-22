# otus-moysklad

React-приложение для управления контрагентами на TypeScript.

## Запуск

```bash
npm install
npm run build
npm run serve
```

После запуска страница доступна по адресу `http://localhost:3000`.

Для разработки:

```bash
npm run dev
```

## Тесты

```bash
npm test
```

## Структура

- `src/App.tsx` — главный компонент с состоянием контрагентов
- `src/types/contragent.ts` — типы данных контрагента
- `src/components/ContragentsTable/` — таблица контрагентов
- `src/components/ContragentsModal/` — модальное окно редактирования
- `server.js` — HTTP-сервер для раздачи собранного приложения из `dist/`
