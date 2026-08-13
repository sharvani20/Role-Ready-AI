# Palette's Journal

## 2025-08-13 - [Accessible Drag-and-Drop File Upload Pattern]
**Learning:** Standard file inputs styled with `hidden` or `display: none` are completely inaccessible to screen readers and are excluded from the keyboard tab sequence.
**Action:** Always style the underlying file input with Tailwind's `sr-only` utility instead of `hidden` or custom display rules, and wrap/couple it with a container `<label>` that implements `focus-within:ring-2 focus-within:ring-primary` to provide high-visibility focus indicators for keyboard-only users.
