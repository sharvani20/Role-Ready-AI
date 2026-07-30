# Palette's Journal - UX & Accessibility Learnings

## 2025-02-17 - [Accessible File Upload Controls via sr-only and focus-within]
**Learning:** Standard hidden `<input type="file" />` with `display: none` (`hidden` class) completely removes the element from the document tab flow, making it impossible for keyboard or screen reader users to interact with drag-and-drop or custom file upload zones. By utilizing the `sr-only` class to visually hide the input while keeping it in the document flow, keyboard users can focus and trigger the file dialog. Applying `focus-within` styling to the parent label wrapper dynamically exposes the focus state, maintaining a cohesive and polished visual cue.
**Action:** Always replace hidden input patterns (especially for files) with `sr-only`, and wrap with a custom label using `focus-within:ring-2` to visually project the hidden focus state to the parent design wrapper.
