# MindX Todo Client

React client built with Vite, Redux Toolkit, SCSS design system, responsive layout, light/dark theme, i18n, virtualized
Todo list, skeleton loading, quotes, music player, and Google login button.

## Run

```bash
copy .env.example .env
npm install
npm run dev
```

Default dev URL: http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Environment

- `VITE_API_BASE_URL=/api`
- `VITE_GOOGLE_CLIENT_ID=` then replace with a Google OAuth client ID when ready.

If the Google client ID is missing, the Google button remains visible but disabled.

## Features

- Redux Toolkit state for todos, settings, and Google auth session.
- Todo add, edit, delete, complete, filter, search, and sort.
- Fixed-row virtual list for fast rendering with large Todo collections.
- Lazy loaded pages through React `lazy` and `Suspense`.
- Skeleton loading with random localized fun facts.
- Random localized motivation quotes.
- Web Audio background music player.
- Smart natural-language input, recurring task controls, subtasks, priority, Eisenhower Matrix, Pomodoro focus, habit
  tracker, calendar and Kanban drag/drop, mock AI breakdown, productivity dashboard, attachment metadata, collaboration
  placeholders, location reminder placeholder, My Day, and gamification.
- Six client locales: `en`, `ca`, `fr`, `de`, `es`, `it`.
- SCSS design system under `src/styles`.

## Structure

```text
src/app/store.js
src/components/
src/features/
src/hooks/useVirtualList.js
src/i18n/locales/
src/pages/
src/services/todoApi.js
src/styles/
```
