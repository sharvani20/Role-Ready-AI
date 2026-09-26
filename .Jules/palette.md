## 2025-05-20 - Modal Accessibility and Keyboard Dismissal
**Learning:** Modal dialogs in single-page apps must support keyboard dismissal via the Escape key and provide accessible close controls (`aria-label`, `type="button"`, `role="dialog"`, `aria-modal="true"`) to meet standard WCAG guidelines.
**Action:** Always include keyboard event listeners (`Escape`) and ARIA dialog properties whenever building or enhancing modal overlays.
