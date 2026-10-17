# Palette's Journal - Critical UX & Accessibility Learnings

## 2025-05-20 - Modal Accessibility Standard Patterns
**Learning:** Modal dialogs in this repository lacked standard keyboard dismiss capabilities (`Escape` key binding), close controls with accessible labels (`aria-label="Close modal"` and `type="button"`), and proper dialog landmark attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`).
**Action:** When implementing or touching modal overlays in React components, ensure full keyboard accessibility, proper ARIA labeling, and an explicit close button with appropriate attributes.
