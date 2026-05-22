---
"bug-bounty-challenge": minor
---

Refactor async store actions to use `neverthrow` and fix user bootstrap flow.

- Replaced custom `resultOrError` / `ActionSuccess | ActionError` pattern with `neverthrow` `ResultAsync<T, Error>` across the User domain.
- Refactored `UserStore` to model state as a discriminated union (`idle | loading | ready | error`)
- Exposed hooks `useUser`, `useUserLoading`, and `useUserError` from the User context. Removed the raw `useUserStore` export.
- Fixed `Grow`component bug which uses enter/exit animations when the user logs in/out.
