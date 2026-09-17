# Palette's Journal - UX & Accessibility Learnings

## 2025-09-17 - Modal Overlay Accessibility & Dismissibility
**Learning:** Modal dialogs missing close buttons, Escape key handlers, or backdrop click handlers create keyboard focus traps and poor user experience.
**Action:** Ensure all modal components implement `Escape` key listeners, backdrop dismissal, explicit close buttons with `aria-label="Close modal"`, and proper `aria-dialog` attributes.
