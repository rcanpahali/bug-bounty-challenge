---
"bug-bounty-challenge": minor
---

Add a language switcher to the app header and improve language detection/persistence for i18n.

- Introduce a header language toggle (EN/DE) to switch UI language at runtime.
- Configure i18next browser language detection with localStorage caching and add a shared language storage key.
