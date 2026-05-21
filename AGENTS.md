# AGENTS.md

Guidelines for AI coding agents working in this repository.

## Repository Overview

A React 19 + TypeScript 5 single-page application built with Vite 6. It uses MUI v6 for UI, MobX 6 for state management, React Router v6 (HashRouter) for navigation, and i18next for internationalization.

## Commands

Always run both `npm run typecheck` (TypeScript) and `npm run lint` (ESLint) after making changes — they catch different types of errors.

## Key Conventions

- **Components**: `React.FC` with explicit prop interfaces; PascalCase folders under `src/components/` and `src/pages/`, each with an `index.tsx` entry.
- **State**: MobX store class per domain in `src/api/services/<Domain>/store.ts`; state mutations inside async actions must use `runInAction`. Context + Provider + hook exported from the domain's `index.tsx`.
- **Async actions**: Use `resultOrError` from `src/utils/global.ts` to get a `[result, error]` tuple; return `ActionSuccess<T> | ActionError` (types in `src/types/global.ts`).
- **Routing**: Paths defined in the `ERoute` enum (`src/types/global.ts`); route list in `src/pages/routes.tsx`.
- **i18n**: All display strings go through `useTranslation("app")` and must have entries in both `src/i18n/locales/en.json` and `de.json`. Never hardcode UI text.
- **Styling**: Use MUI `sx` prop or `styled()` for all styles; prefer `theme.tokens.*`, `theme.palette.*`, and `theme.spacing()` over hardcoded values.
- **Enums**: prefix with `E` (e.g. `ERoute`). **Type aliases**: prefix with `T` (e.g. `TRoute`).

See [conventions.md](conventions.md) for the full reference.

## Changesets

Add a changeset for every user-facing or API change:

```bash
npx changeset   # interactive prompt
```

Changeset files live in `.changeset/` and must be committed with the change.

## Commit Messages

Follow the Conventional Commits format:

```
<type>(<optional scope>): <short description>
```

| Type       | When to use                                                    |
| ---------- | -------------------------------------------------------------- |
| `feat`     | A new feature visible to users or consumers of the API         |
| `fix`      | A bug fix                                                      |
| `chore`    | Maintenance tasks: dependency updates, tooling, config changes |
| `docs`     | Documentation-only changes (README, comments, guides)          |
| `style`    | Formatting, whitespace, semicolons — no logic change           |
| `refactor` | Code restructuring without feature addition or bug fix         |

A common order: feat > fix > refactor > chore > style > docs.

---
