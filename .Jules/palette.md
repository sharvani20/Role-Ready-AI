## 2025-05-18 - Modal Accessibility & Dismissal Pattern
**Learning:** Modals in the app lacked standard screen reader ARIA dialog attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`), `Escape` key handling, backdrop click handlers, and `htmlFor`/`id` input label links.
**Action:** Always include ARIA roles, an explicit `X` close button with `aria-label`, Escape key event listener, backdrop click-to-dismiss, and form label associations for all modal overlay components.
