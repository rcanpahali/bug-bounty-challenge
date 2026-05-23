---
"bug-bounty-challenge": minor
---

Refactor timer and user session into MobX stores with cross-tab sync, and add timer controls to the app header.

- Introduced `TimerStore` to manage countdown state with localStorage persistence
- Renamed storage key `TIMER_START` to `ELAPSED_SECONDS` and added `INTERVAL_START`; removed `useUserStorage` and `useTimerStartStorage` hooks.
- Added helpers for safely parsing JSON from storage and handling missing/null values
