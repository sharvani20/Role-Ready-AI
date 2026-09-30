## 2025-05-18 - Accessible Modal Overlay Pattern
**Learning:** Modal dialogs in this app often missing key UX/accessibility features like close buttons (`aria-label="Close modal"`), `Escape` key event handling, backdrop dismiss, and explicit label-input `htmlFor`/`id` bindings.
**Action:** Always ensure modal components wrap content in `role="dialog"` and `aria-modal="true"`, attach keydown listeners for `Escape`, provide visible and screen-reader accessible close buttons, and explicitly associate form inputs with `<label>` tags.
