---
"bug-bounty-challenge": minor
---

Introduce Zod for runtime type safety at storage boundaries.

- Add `User` type via `z.infer` instead of a hand-written interface
- Replace blind `as T` casts in `UserStore` with `UserSchema.safeParse()`
- Replace the `Theme` and `Language` union types
