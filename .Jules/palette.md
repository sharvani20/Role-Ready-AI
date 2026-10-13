# Palette's Journal - UX & Accessibility Learnings

## 2025-05-18 - Modal Dialog Accessibility and Dismiss Controls
**Learning:** Modals in React without proper ARIA dialog roles (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`) are invisible to assistive technology as dialogs. Additionally, modals missing an explicit visible close button and `Escape` key listeners trap keyboard/screen-reader users.
**Action:** Always include dialog ARIA attributes, keyboard `Escape` dismissal handlers, backdrop click handlers, and an accessible close icon button with `type="button"` and `aria-label="Close modal"`.
