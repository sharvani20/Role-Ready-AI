## 2025-05-20 - Modal Accessibility and Dismissability Standard
**Learning:** Modal dialogs without explicit header close buttons or Escape key handlers trap users, especially screen reader and keyboard-only users who cannot rely on background clicks or completion actions to dismiss the dialog.
**Action:** Always provide an explicit icon-only close button with `type="button"`, `aria-label`, dialog semantics (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`), keydown Escape dismissal, and `sr-only` file inputs with `focus-within` focus rings on modal form controls.
