# Issue Tracker

This file is maintained by [Claude Code](https://claude.ai/code) (an AI coding agent) and updated each iteration. It serves as a living audit log of bugs found, architectural improvements identified, and the status of each fix.

---

## How this works

Each section below corresponds to one agent iteration. The agent audits the codebase, proposes changes, implements fixes, and appends a new iteration entry here before committing. Reviewers can follow the progression directly in git history.

---

## Iteration 1 — Initial Audit

> **Date:** 2026-05-21
> **Agent:** Claude Code (claude-sonnet-4-6)
> **Scope:** Full codebase read — no changes made yet

### Bugs

| ID | File | Line | Severity | Status | Description |
|----|------|------|----------|--------|-------------|
| BUG-1 | `src/api/services/User/store.ts` | 48 | 🔴 High | `[ ] Open` | Typo `this.urser = result` — user is never written to the store, so the avatar never appears in the app bar. Root cause of `missing-user-avatar`. |
| BUG-2 | `src/types/global.ts` | 27 | 🟡 Medium | `[ ] Open` | `knownErrors` is required on `ActionError` but never provided by the store — TypeScript type mismatch causes silent cast via `as ActionError`. Should be optional (`knownErrors?`). |
| BUG-3 | `src/pages/Home/index.tsx` | 19 | 🟡 Medium | `[ ] Open` | `t("home.intro")` renders the i18n string as plain text; `<b>known</b>` is never bolded. Needs the `<Trans>` component with a `components` map. Constraint: i18n source strings must not be changed. |
| BUG-4 | `src/components/AppHeader/index.tsx` | 45 | 🟡 Medium | `[ ] Open` | `setInterval` is started in `useEffect` but never cleared. On remount (e.g. React 18+ Strict Mode double-invoke) multiple intervals stack, causing the countdown to skip seconds unpredictably. |
| BUG-5 | `src/components/AvatarMenu/index.tsx` | 25, 38 | 🟡 Medium | `[ ] Open` | `_[0]` in `getInitials` crashes when `firstName` or `lastName` is `undefined` (both are optional on `User`). `user?.firstName[1]` in `stringAvatar` also crashes when `firstName` is undefined — missing optional chaining `?.`. |
| BUG-6 | `src/pages/Root/index.tsx` | 29 | 🟢 Low | `[ ] Open` | `console.log(user)` left in production code — leaks user PII on every MobX re-render. |

### Architectural Improvements

| ID | File | Severity | Status | Description |
|----|------|----------|--------|-------------|
| ARCH-1 | `src/api/services/User/index.tsx` | 🟡 Medium | `[ ] Open` | `useUserStore()` returns `null` when called outside the provider instead of throwing. Every consumer is forced to add a `\|\| {}` null guard. Should throw a descriptive error — fails fast and eliminates defensive checks at call sites. |
| ARCH-2 | `src/api/services/index.tsx` | 🟡 Medium | `[ ] Open` | Dead file — uses commented-out `require.context` (webpack API, incompatible with Vite). The active code imports the `User` module's default export, which does not exist, so the array is `[undefined]`. File is not imported anywhere. Should be removed. |
| ARCH-3 | `src/components/AppHeader/index.tsx` | 🟢 Low | `[ ] Open` | Background color `#08140C` is hardcoded in the `Toolbar` `sx` prop, bypassing the theme system. Violates the project convention: *prefer `theme.palette.*` over hardcoded values*. |
| ARCH-4 | `src/pages/Root/index.tsx` | 🟢 Low | `[ ] Open` | Background color `#f5f5f5` is hardcoded in the `Box` `sx` prop — same theme bypass as ARCH-3. |
| ARCH-5 | `src/components/AppHeader/index.tsx` | 🟢 Low | `[ ] Open` | `React.forwardRef` component has no `displayName` — shows as `ForwardRef` in React DevTools instead of `AppHeader`. |
| ARCH-6 | `src/i18n/i18n.tsx` | 🟢 Low | `[ ] Open` | `lng: FALLBACK_LANGUAGE \|\| browserLanguage` always resolves to `"en"` (non-empty string is truthy) — browser language detection is dead code. Operands should be swapped. Also uses `@ts-ignore` for `navigator.userLanguage`; the non-standard property should be typed via an interface extension instead. |
| ARCH-7 | `src/themes/default/index.ts` | 🟢 Low | `[ ] Open` | `tokensLight` and `tokensDark` are typed as `any`. The project has a perfectly good `OsapiensThemeTokens` interface — use `ThemeOptions` from MUI to restore type safety. |
| ARCH-8 | `src/i18n/locales/de.json` | 🟢 Low | `[ ] Open` | German locale file is empty `{}`. The optional language-switcher feature (starred in `issues.ts`) requires full German translations to be functional. |

### Optional Features (from `src/data/issues.ts`)

| ID | Status | Description |
|----|--------|-------------|
| FEAT-1 | `[ ] Open` | Language switcher — add a language select control in the app bar to switch between English and German. |

---

## Iteration 2 — Bug Fixes

> **Date:** 2026-05-21
> **Agent:** Claude Code (claude-sonnet-4-6)
> **Scope:** All six bugs fixed; two pre-existing compile errors resolved as collateral

### Bug Status After This Iteration

| ID | Status | Resolution |
|----|--------|------------|
| BUG-1 | `[x] Fixed` | Typo corrected: `this.urser` → `this.user` in `UserStore.getOwnUser`. Avatar now renders on app start. |
| BUG-2 | `[x] Fixed` | Replaced custom `ActionSuccess/ActionError/resultOrError` pattern with [`neverthrow`](https://github.com/supermacro/neverthrow) `ResultAsync`. `getOwnUser` now returns `ResultAsync<User, Error>` — type-safe, no silent casts, no required-but-never-provided `knownErrors` field. Removed `ActionResultStatus`, `ActionSuccess`, `ActionError` from `types/global.ts` and deleted `utils/global.ts` (no longer needed). |
| BUG-3 | `[x] Fixed` | Used `<Trans i18nKey="home.intro" components={{ b: <strong /> }} />` in `Home`. The `<b>known</b>` tag in the i18n string now renders as bold without touching the source strings. Also introduced [`i18next-cli`](https://github.com/i18next/i18next-cli) (the maintained successor to the deprecated `i18next-parser`) with `i18next.config.ts` and two new npm scripts: `i18n:extract` (scan source files and sync locale keys) and `i18n:status` (translation completeness report). Locale files migrated to the conventional `{{language}}/{{namespace}}` structure (`src/i18n/locales/en/app.json`, `src/i18n/locales/de/app.json`). |
| BUG-4 | `[x] Fixed` | Replaced `useEffect + setInterval` (no cleanup) with `useIntervalEffect` from [`@react-hookz/web`](https://react-hookz.github.io/web/). The hook handles cleanup automatically — no stacked intervals on remount. |
| BUG-5 | `[x] Fixed` | `getInitials`: replaced unsafe `_[0]` on possibly-undefined values with `.filter(Boolean).map(name => name![0])`. `stringAvatar`: replaced `user?.firstName[1]` with `user?.firstName?.[1] ?? "m"`. |
| BUG-6 | `[x] Fixed` | Removed `console.log(user)` from `Root` — was leaking user data on every MobX re-render. |

### Pre-existing Compile Errors Resolved

These were not in the original issue list but were exposed by `npm run typecheck` after the fixes:

| File | Error | Fix |
|------|-------|-----|
| `src/api/services/index.tsx` | Default import of non-existent export; commented-out `require.context` (webpack API incompatible with Vite); entire file unused. | Deleted file. Tracked as ARCH-2 — closing early since it was blocking compilation. |
| `src/components/AppHeader/index.tsx` | `React.forwardRef` missing type parameters → `ForwardedRef<unknown>` not assignable to `Ref<HTMLElement>`. | Added `React.forwardRef<HTMLElement, AppHeaderProps>`. Also added `AppHeader.displayName` (ARCH-5). |
| `src/i18n/i18n.tsx` | `JSX.Element` in `Language` interface — JSX namespace not available without explicit import. Also `@ts-ignore` masking untyped `navigator.userLanguage`. | Replaced with `ReactElement` from `react`. Typed legacy `navigator.userLanguage` via `NavigatorWithLegacyLang` interface extension. |
| `src/pages/AccessDenied/index.tsx` | `theme` destructured in `styled()` callback but never used — flagged by `noUnusedParameters`. | Removed unused param from the callback. |

### Architectural Issues (Unchanged — Iteration 3)

| ID | Status |
|----|--------|
| ARCH-1 | `[ ] Open` — `useUserStore` returns null outside provider |
| ARCH-3 | `[ ] Open` — Hardcoded `#08140C` in AppHeader toolbar |
| ARCH-4 | `[ ] Open` — Hardcoded `#f5f5f5` in Root background |
| ARCH-6 | `[ ] Open` — `lng` init order (browser language vs fallback) |
| ARCH-7 | `[ ] Open` — `tokensLight`/`tokensDark` typed as `any` |
| ARCH-8 | `[ ] Open` — `de/app.json` keys present but values empty (needs translation) |

---
