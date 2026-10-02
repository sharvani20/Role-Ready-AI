# Palette's Journal - UX & Accessibility Learnings

## 2025-05-20 - Modal Accessibility and Keyboard Interactivity
**Learning:** Modal dialogs require proper ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`), an explicit close button with `aria-label="Close modal"` and `type="button"`, and an `Escape` key handler to ensure keyboard and screen reader users can dismiss overlays smoothly.
**Action:** Always include a dismiss close button with `aria-label` and bind keydown listeners for `Escape` when rendering modal overlays.
