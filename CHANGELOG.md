# bug-bounty-challenge

## 2.0.0

### Major Changes

- b9b93bb: Upgrade dependencies for better developer experience
  - Renamed project from `react-typescript` to `bug-bounty-challenge`
  - Added `@changesets/cli` for version control
  - Migrated build tooling from react-scripts to Vite 6
  - Upgraded low risk dependencies
  - Upgraded to React 19, MUI 6, react-router-dom 6, TypeScript 5.9
  - Removed `@mui/styles` replaced with `StyledEngineProvider`
  - Updated router hooks and app entry point for new API compatibility

### Minor Changes

- a4e9c62: Introduce Zod for runtime type safety at storage boundaries.
  - Add `User` type via `z.infer` instead of a hand-written interface
  - Replace blind `as T` casts in `UserStore` with `UserSchema.safeParse()`
  - Replace the `Theme` and `Language` union types

- 31a3f1a: Add a language switcher to the app header and improve language detection/persistence for i18n.
  - Introduce a header language toggle (EN/DE) to switch UI language at runtime.
  - Configure i18next browser language detection with localStorage caching and add a shared language storage key.

- 07c6759: Added login page and auth guard layout route, refactored project routing.
  - Created `Login` page with a login button; redirects to `/home` if already logged in
  - Created `AuthGuard` layout route that redirects unauthenticated users to `/login`
  - Created `AppLayout` layout route that wraps all pages with the app header
  - Refactored `Root` into a clean routing table using React Router `<Routes>`
  - Added `ERoute.LOGIN`; `/` and unknown paths now redirect to `/login`

- cbfb6fa: Implement persistent user session storage and countdown timer across tabs.
  - Store user session and timer start time in localStorage to persist across page reloads and browser tabs.
  - Sync session state across tabs.
  - Refactoring CountdownTimer ensuring the timer continues accurately.

- f4d9538: Add light/dark theme switching with persistent user preference.
  - Introduce `ThemeModeProvider` and `ThemeSwitcher` component in the app header.
  - Persist theme and language selections to localStorage via shared storage hooks.
  - Remove hardcoded theme values in favour of MUI palette and component style overrides.

- f30efed: Refactor timer and user session into MobX stores with cross-tab sync, and add timer controls to the app header.
  - Introduced `TimerStore` to manage countdown state with localStorage persistence
  - Renamed storage key `TIMER_START` to `ELAPSED_SECONDS` and added `INTERVAL_START`; removed `useUserStorage` and `useTimerStartStorage` hooks.
  - Added helpers for safely parsing JSON from storage and handling missing/null values

- 63719c5: Refactor async store actions to use `neverthrow` and fix user bootstrap flow.
  - Replaced custom `resultOrError` / `ActionSuccess | ActionError` pattern with `neverthrow` `ResultAsync<T, Error>` across the User domain.
  - Refactored `UserStore` to model state as a discriminated union (`idle | loading | ready | error`)
  - Exposed hooks `useUser`, `useUserLoading`, and `useUserError` from the User context. Removed the raw `useUserStore` export.
  - Fixed `Grow`component bug which uses enter/exit animations when the user logs in/out.

### Patch Changes

- 111eb8a: Improve issues list and add custom SnackbarProvider
  - Extracted hardcoded issue list, added `id` and `isSolved` fields
  - Added custom `SnackbarProvider` wrapper with MUI variant colors for notistack v3

- 51f9a58: Refactor countdown timer into a dedicated `CountdownTimer` component.
  - Extracted inline countdown logic into a new component.
  - Timer now persists start time in `localStorage` for the first iteration, can be revised to use a more secure storage mechanism since `localStorage` or any other client-side storage is vulnerable to tampering.

- aa4af6a: Create i18n extraction workflow and update translations.
  - Added i18next-cli config and npm scripts, restructured locale JSON content, and updated i18n typing
  - Added new lint rules and fixed existing i18n issues.

- b9b93bb: Set up development tooling and project conventions
  - Added ESLint 9 + Prettier with config files (`eslint.config.js`, `.prettierrc`) and scripts for linting and formatting
  - Added `AGENTS.md` and `conventions.md` documenting project guidelines and coding conventions

- 111eb8a: Fix React key warning, store recreation, and notistack v3 compatibility
  - Simplified `App` provider tree
  - Fixed missing `key` prop on `<ListItem>` component
  - Fixed `UserStore` being recreated on every render
  - Extracted `TransitionWrapper` as a stable component to avoid recreation on each render
