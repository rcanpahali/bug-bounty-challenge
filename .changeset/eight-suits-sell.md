---
"bug-bounty-challenge": patch
---

Refactor countdown timer into a dedicated `CountdownTimer` component.

- Extracted inline countdown logic into a new component.
- Timer now persists start time in `localStorage` for the first iteration, can be revised to use a more secure storage mechanism since `localStorage` or any other client-side storage is vulnerable to tampering.
