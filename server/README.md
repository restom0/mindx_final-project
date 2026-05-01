# MindX Todo Server

Express API using Prisma 7, PostgreSQL, Redis cache, Swagger, Zod DTOs, and server-side i18n.

## Run

```bash
copy .env.example .env
npm install
npm run prisma:generate
npm run prisma:deploy
npm run seed
npm run dev
```

Default URL: http://localhost:3000/api

## Docker Runtime

The Docker command runs:

```bash
npm run prisma:deploy && npm run seed && npm start
```

## API

- `GET /api/health`
- `GET /api/todos`
- `GET /api/todos/:id`
- `POST /api/todos`
- `PATCH /api/todos/:id`
- `DELETE /api/todos/:id`
- `DELETE /api/todos`
- `POST /api/todos/focus-sessions`
- `GET /api/habits`
- `POST /api/habits`
- `POST /api/habits/:habitId/check-ins`
- `POST /api/ai/task-breakdown`
- `GET /api/docs`

## Query Options

`GET /api/todos` supports:

- `filter=all|active|completed`
- `search=text`
- `sort=createdAt|updatedAt|title`
- `order=asc|desc`
- `page=1`
- `limit=100`

## Prisma

Todo entity:

- `id`
- `title`
- `description`
- `completed`
- `createdAt`
- `updatedAt`
- `version`
- advanced fields: `priority`, `important`, `status`, `category`, `dueDate`, `reminderAt`, `recurrenceType`,
  `repeatRule`, `estimatedMinutes`, `attachments`, `locationReminder`, `ownerId`, `assigneeId`, `sharedWith`

Each update increments `version`. The seed script inserts at least 100 deterministic records and uses `skipDuplicates`.
When a recurring task is completed, the service moves it to its next due date and keeps it active for the next cycle.

## i18n

Server reads `Accept-Language` and falls back to `en`. Locales:

- `en`
- `ca`
- `fr`
- `de`
- `es`
- `it`

## Cache

List and detail responses are cached by URL and locale. Mutations invalidate all Todo cache keys. Redis is used when
`REDIS_URL` is available; otherwise the server falls back to in-memory cache for local development.

## Commands

```bash
npm run check
npm run build
npm run prisma:generate
npm run prisma:migrate -- --name change-name
npm run prisma:deploy
npm run seed
npm audit
```
