# Palette UX & Accessibility Journal

## 2025-02-18 - Modal Overlay Accessibility Pattern
**Learning:** Modal dialogs in this app were missing standard keyboard dismiss functionality (`Escape` key), backdrop click handlers, and essential ARIA metadata (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`).
**Action:** When building or enhancing modal components, ensure `Escape` key listeners, backdrop dismissal, explicit `aria-label` close buttons, and `htmlFor`/`id` label associations are included by default.
