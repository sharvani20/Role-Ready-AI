## 2025-10-10 - Modal Accessibility and Keyboard Dismissal
**Learning:** Overlay modal components require explicit keyboard event listeners for the `Escape` key, visual dismiss buttons with `aria-label`, proper `role="dialog"` / `aria-modal="true"` attributes, and explicit `htmlFor`/`id` associations to be accessible to screen reader and keyboard users.
**Action:** When creating or reviewing modal components, always verify `Escape` key dismissal, backdrop click closing, explicit form input labeling, and `aria-label` attributes on close buttons.
