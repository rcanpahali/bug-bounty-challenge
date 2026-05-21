---
"bug-bounty-challenge": patch
---

Fix React key warning, store recreation, and notistack v3 compatibility

- Simplified `App` provider tree
- Fixed missing `key` prop on `<ListItem>` component
- Fixed `UserStore` being recreated on every render
- Extracted `TransitionWrapper` as a stable component to avoid recreation on each render
