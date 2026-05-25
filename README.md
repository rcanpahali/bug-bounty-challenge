# Frontend Coding Challenge

Implementation PR with inline comments: [github.com/rcanpahali/bug-bounty-challenge/pull/1](https://github.com/rcanpahali/bug-bounty-challenge/pull/1)

A React 19 + TypeScript SPA built with Vite. This document covers what was implemented and how to verify each area.

---

## Getting Started

```bash
npm install
npm run dev
```

Additional commands:

```bash
npm run typecheck   # TypeScript type check
npm run lint        # ESLint + Prettier check
npm run lint:fix    # Auto-fix lint and formatting issues
```

---

## What Was Built / Improved

### Theme Switching (Light / Dark)

- Header has a toggle between light and dark modes.
- Preference is persisted in `localStorage` under key `app.theme`.
- Validated with a Zod enum schema (`"light" | "dark"`) before reading from storage.
- Survives page refresh; syncs across tabs.

**To test:** Toggle the theme switcher in the header → refresh the page → preference is restored.

---

### Internationalization (EN / DE)

- Header has a language toggle between English and German.
- All UI strings go through `i18next` — no hardcoded display text.
- Language preference persisted in `localStorage` under `app.language`.
- i18next `LanguageDetector` reads from localStorage first, then falls back to browser locale, then `"en"`.

**To test:** Switch to German → refresh → still German. Switch back to English → labels update instantly.

---

### User Login & Session

- `UserStore` is a MobX store with a typed state machine: `idle → loading → ready | error`.
- `bootstrapUser()` returns `ResultAsync<User, Error>` (neverthrow) — no thrown exceptions.
- User data is validated with a Zod schema (`firstName`, `lastName`, `email`) before being stored.
- Session is persisted in `localStorage` under `app.session`; restored on next load.
- Cross-tab sync: logging in or out in one tab reflects immediately in other open tabs via the `storage` event.

**To test:**

1. Click **Login** — avatar appears in the header.
2. Refresh the page — user is still logged in (session restored from localStorage).
3. Open a second tab → log out in one → the other tab reflects it automatically.

---

### Countdown Timer Store

- `TimerStore` is its own MobX domain, fully separated from the rest of the app.
- It accepts `UserStore` as a constructor dependency and uses a MobX `reaction()` to auto-start on login and auto-pause on logout.
- State stored in localStorage:
  - `app.timer.elapsed` — total accumulated seconds
  - `app.timer.intervalStart` — timestamp of the current running interval
- Elapsed time is calculated as `stored elapsed + (now − intervalStart)`, which means the clock stays accurate even if the tab is hidden or the interval fires late.
- Cross-tab & cross-session: because state is a timestamp rather than a tick counter, opening a new tab or refreshing always shows the correct time; pausing in one tab pauses all.

**To test:**

1. Log in — timer starts automatically.
2. Log out — timer pauses (time is saved).
3. Log back in — timer resumes from where it left off.
4. Open a second tab — both tabs show the same time and advance together.
5. Use the **Skip** button to jump to expiry, or **Reset** to restart.

---

### Tooling & Code Quality

| Tool                 | Purpose                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| **Vite 6**           | Fast dev server and production bundler with path alias (`~` → `src/`)                          |
| **TypeScript 5.9**   | Strict mode enabled; `tsc --noEmit` only (Vite handles transpilation)                          |
| **ESLint 9**         | Flat config with React, React Hooks, and TypeScript ESLint rules                               |
| **Prettier**         | Enforced via ESLint Prettier plugin                                                            |
| **Zod**              | Schema validation for user data from storage (prevents bad data from crashing the app)         |
| **neverthrow**       | `ResultAsync<T, Error>` return types on async store actions — no uncaught promise rejections   |
| **MobX**             | Observable state with `reaction()` for side effects (persistence, timer control)               |
| **@react-hookz/web** | `useLocalStorageValue` for reactive localStorage reads; `useIntervalEffect` for the timer tick |

---

### Routing & Auth Guards

- `/` redirects to `/login`. Unauthenticated visits to any protected route also redirect there.
- Protected routes are wrapped by `AuthGuard`, a layout route that reads MobX auth state and renders `<Outlet />` or redirects — no auth logic inside page components.
- `Root` is a thin routing table: `<Routes>` declarations only, no business logic.

**To test:**

1. Open `/` — redirected to `/login`.
2. Manually navigate to `/#/home` while logged out — redirected back to `/login`.
3. Log in — redirected to `/home` automatically.
4. Log in from one tab and open `/login` in another — immediately redirected to `/home`.

---

## Architecture Notes

- **Provider order** in `App.tsx`: `ThemeModeProvider` → `UserStoreProvider` → `TimerStoreProvider` — each layer only depends on what's above it.
- **Storage keys** are centralized in `src/storage/keys.ts`.
- **Route paths** are defined in the `ERoute` enum (`src/types/global.ts`).
- **Routing layers**: `AppLayout` (chrome) → `AuthGuard` (auth boundary) → page component. Each layer has one responsibility.
- State mutations inside async MobX actions use `runInAction()` per MobX conventions.

## Next Steps

Because of time constraints, some main functionalities are still missing, and there are plenty of opportunities for improvement:

- Add tests (unit, coverage, e2e).
- Add error handling UI (e.g. toast notifications).
- Add a CI pipeline with lint/typecheck steps and maybe even automated tests.
