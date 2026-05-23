# Project Developer Guide and Conventions

This is an attempt to provide a helpful but not exhaustive developer guide.

## Tech Stack

- **Framework**: React 19 with TypeScript 5.9
- **Build Tool**: Vite 6
- **UI Library**: MUI (Material UI) v6 with Emotion
- **State Management**: MobX 6 + mobx-react
- **Routing**: React Router v6 (HashRouter)
- **Internationalization**: i18next + react-i18next
- **Icons**: Material Design Icons (`@mdi/js`, `@mdi/react`)
- **Utilities**: Lodash
- **Validation**: Zod 4 — schema validation for runtime data (storage, API responses)
- **Error Handling**: neverthrow — `ResultAsync<T, Error>` for async store actions
- **Storage Hooks**: @react-hookz/web — `useLocalStorageValue`, `useIntervalEffect`
- **Notifications**: notistack
- **Formatting**: Prettier (enforced via ESLint Prettier plugin)
- **Versioning**: Changesets (`@changesets/cli`)

---

## Naming Conventions

| Construct             | Convention                    | Example                     |
| --------------------- | ----------------------------- | --------------------------- |
| React components      | PascalCase                    | `AppHeader`, `AvatarMenu`   |
| Component folders     | PascalCase                    | `components/AppHeader/`     |
| Hook files/functions  | camelCase prefixed with `use` | `useMatchedRoute`           |
| MobX store classes    | PascalCase                    | `UserStore`                 |
| Enums                 | `E` prefix + PascalCase       | `ERoute`                    |
| Type aliases          | `T` prefix + PascalCase       | `TRoute`, `PathParams`      |
| i18n translation keys | dot-notated lowercase         | `home.welcome`, `app.title` |

---

## TypeScript

- **Strict mode** is enabled (`"strict": true`).
- `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports` are all enabled.
- Target: `esnext`; module resolution: `bundler`.
- Prefer `interface` for prop shapes (e.g., `AppHeaderProps`); use `type` for unions and utility types.
- Enums are declared in `src/types/global.ts` when shared across the app.
- Do **not** use `any`; use proper generics (e.g., `ResultAsync<T, Error>`).

---

## Components

- Use `React.forwardRef` when a component needs to expose a DOM ref.
- Use `React.FC` with explicit prop interfaces:
  ```tsx
  interface MyProps { title: string; }
  const MyComponent: React.FC<MyProps> = ({ title }) => { ... };
  ```
- Wrap lazily loaded page components with a `<Suspense>` fallback (see `lazyLoad` helper in `routes.tsx`).
- Styled components use MUI's `styled()` API with typed props:
  ```tsx
  const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({ ... }));
  ```
- Use `sx` prop for one-off inline style overrides; avoid plain inline `style={{}}`.

---

## State Management (MobX)

- Each domain has a **store class** in `src/api/services/<Domain>/store.ts`.
- Stores call `makeAutoObservable(this)` in the constructor.
- Side-effectful state mutations inside async actions must be wrapped in `runInAction(() => { ... })`.
- Each store is provided through a **Context + Provider** pattern defined in the domain's `index.tsx`:
  ```tsx
  const DomainContext = createContext<Store | null>(null);
  export const StoreProvider: React.FC = ({ children }) => <DomainContext.Provider value={new Store()}>{children}</DomainContext.Provider>;
  export const useDomainStore = () => useContext(DomainContext);
  ```
- Providers are stacked individually in `App.tsx` in dependency order (e.g. `UserStoreProvider` wraps `TimerStoreProvider` because the timer depends on the user store).
- Stores that depend on other stores receive them as constructor arguments; the provider reads the dependency via its own hook before instantiating the child store.
- Use MobX `reaction()` for side effects that respond to observable state changes (e.g. persisting to localStorage, auto-starting the timer on login).
- Observer components should be wrapped with `observer()` from `mobx-react`.

---

## API / Async Actions

- All async store actions return `ResultAsync<T, Error>` from `neverthrow`.
- Wrap promise-based work with `ResultAsync.fromPromise(promise, toError)` and chain transformations with `.map(...)` / `.andThen(...)`.
- Convert unknown failures to `Error` in one place (e.g., `const toError = (e: unknown): Error => e instanceof Error ? e : new Error(String(e));`).
- At call sites, handle both branches explicitly with `.match(onOk, onErr)`.

---

## Routing

- Routes are defined centrally in `src/pages/routes.tsx` as a `TRoute[]` array.
- Paths are typed via the `ERoute` enum in `src/types/global.ts`.
- Use `buildUrl(path, params)` from `src/utils/router.ts` to construct URLs programmatically.
- The app uses `HashRouter`; keep this in mind when constructing links.

---

## Internationalization (i18n)

- All user-facing strings must use `useTranslation("app")` and reference keys defined in `src/i18n/locales/en.json` and `de.json`.
- Do **not** hardcode display text in JSX—use `t("key")` instead.
- For strings that contain HTML markup (e.g. bold text), use the `Trans` component with a `components` prop — do not embed raw HTML in translation values.
- The default/fallback language is `"en"`. Language preference is persisted in `localStorage` under `app.language`.
- `i18next LanguageDetector` resolves language in this order: localStorage → browser locale → `"en"`.
- Namespace: `app` (default). A `common` namespace is also declared but reserved for shared strings.
- Use `npm run i18n:extract` to extract new keys and `npm run i18n:status` to check for missing translations.

---

## Storage

- All `localStorage` keys are declared as constants in `src/storage/keys.ts` — never use raw string literals elsewhere.
- Use `useLocalStorageValue()` from `@react-hookz/web` for reactive reads/writes (automatically syncs across tabs).
- All values read from storage must be validated with a Zod schema before use. See `src/storage/preferences.ts` for the pattern (Zod enum + custom serializer).
- Preference hooks (`useThemeStorage`, `useLanguageStorage`) live in `src/storage/preferences.ts`.

---

## Theming

- The design system lives in `src/themes/`.
- Use `useTheme()` to access the theme in functional components.
- Prefer `theme.spacing()`, `theme.palette.*`, and `theme.tokens.*` over hardcoded values.

---

## Versioning & Changesets

- The project uses **@changesets/cli** for versioning.
- Changesets live under `.changeset/` for every notable change before merging.
- Run `npx changeset` to generate a new changeset interactively.
