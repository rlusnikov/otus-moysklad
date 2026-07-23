# otus-moysklad

React-приложение для управления контрагентами на TypeScript с json-server и React Context.

## Запуск

```bash
npm install
npm run build
npm run start
```

Команда `start` одновременно запускает:
- json-server на `http://127.0.0.1:3001`
- HTTP-сервер приложения на `http://127.0.0.1:3000`

Для разработки:

```bash
npm run dev:all
```

Только API:

```bash
npm run api
```

## Тесты

```bash
npm test
```

## Структура

- `db.json` — данные контрагентов для json-server
- `src/context/ContragentsContext.tsx` — контекст с API получения, создания, обновления и удаления
- `src/api/contragentsApi.ts` — HTTP-клиент для json-server
- `src/App.tsx` — главный компонент
- `src/types/contragent.ts` — типы данных контрагента
- `src/components/ContragentsTable/` — таблица контрагентов
- `src/components/ContragentsModal/` — модальное окно редактирования
- `server.js` — HTTP-сервер для `dist/` и проксирования `/api` на json-server
