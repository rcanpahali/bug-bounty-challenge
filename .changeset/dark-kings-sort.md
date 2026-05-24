---
"bug-bounty-challenge": minor
---

Added login page and auth guard layout route, refactored project routing.

- Created `Login` page with a login button; redirects to `/home` if already logged in
- Created `AuthGuard` layout route that redirects unauthenticated users to `/login`
- Created `AppLayout` layout route that wraps all pages with the app header
- Refactored `Root` into a clean routing table using React Router `<Routes>`
- Added `ERoute.LOGIN`; `/` and unknown paths now redirect to `/login`
