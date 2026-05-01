# MindX Todo App

Full-stack Todo App refactored to a Vite React client, Express API, Prisma PostgreSQL database, Redis cache, and Nginx
reverse proxy.

## Stack

- Client: React 19, Vite 8, Redux Toolkit, SCSS design system, i18next, Google OAuth button.
- Server: Express 5, Prisma 7, PostgreSQL, Redis cache, Swagger, Zod DTO validation, server i18n.
- DevOps: Docker Compose, Nginx reverse proxy, PostgreSQL volume, Redis service.

## Run Everything

```bash
docker compose up --build
```

Open:

- Client: http://localhost:8080
- Swagger: http://localhost:8080/api/docs
- Health: http://localhost:8080/api/health
- API direct: http://localhost:3000/api

The server container runs `prisma migrate deploy` and an idempotent seed before start. The seed creates 100 todos using
deterministic IDs, so repeated starts do not duplicate seed rows.

## Local Development

Server:

```bash
cd server
copy .env.example .env
npm install
npm run prisma:generate
npm run prisma:deploy
npm run seed
npm run dev
```

Client:

```bash
cd client
copy .env.example .env
npm install
npm run dev
```

## Useful Commands

```bash
# client
cd client
npm run build
npm audit

# server
cd server
npm run build
npm run check
npm run prisma:deploy
npm run prisma:migrate -- --name change-name
npm run seed
npm audit
```

## Environment

Client variables:

- `VITE_API_BASE_URL`: API prefix, default `/api`.
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID.

Server variables:

- `PORT`
- `API_PREFIX`
- `CORS_ORIGIN`
- `DATABASE_URL`
- `REDIS_URL`
- `CACHE_TTL_SECONDS`

## Project Structure

```text
client/
  src/components/        reusable UI components
  src/features/          Redux slices
  src/i18n/locales/      en, ca, fr, de, es, it
  src/styles/            SCSS design system
server/
  prisma/                schema, migrations, seed
  src/common/            shared middleware/helpers
  src/config/            env, cache, prisma, swagger
  src/controllers/       HTTP controllers
  src/dto/               Zod request schemas
  src/repositories/      Prisma data access
  src/services/          business logic/cache invalidation
nginx.conf
docker-compose.yml
```

## Notes

- Swagger is available under `/api/docs`.
- Server messages are localized from `Accept-Language` with fallback `en`.
- Client language can be changed from the top bar and sends `Accept-Language` to the API.
- Todo updates increment the `version` field automatically.
- Advanced UX includes smart task parsing, recurring tasks, subtasks, priority, Eisenhower Matrix, Pomodoro focus,
  habits, calendar drag/drop, Kanban drag/drop, mock AI breakdown, dashboard, attachment metadata, collaboration
  placeholders, location reminder schema, My Day, and gamification.
