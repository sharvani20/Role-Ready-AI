## 2025-09-01 - Modal Dismiss Controls & Form Accessibility
**Learning:** Modal dialogs missing explicit close buttons and `Escape` key event handlers leave keyboard and screen-reader users trapped in overlay states. Furthermore, form inputs inside modals must have explicit `id` and `htmlFor` association for proper assistive technology label reading.
**Action:** Always ensure modal headers render a close button with `type="button"`, `aria-label="Close modal"`, and an `Escape` key listener, while explicitly associating form input labels with `htmlFor` and `id`.
