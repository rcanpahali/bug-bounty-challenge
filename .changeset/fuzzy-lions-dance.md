---
"bug-bounty-challenge": minor
---

Add light/dark theme switching with persistent user preference.

- Introduce `ThemeModeProvider` and `ThemeSwitcher` component in the app header.
- Persist theme and language selections to localStorage via shared storage hooks.
- Remove hardcoded theme values in favour of MUI palette and component style overrides.
