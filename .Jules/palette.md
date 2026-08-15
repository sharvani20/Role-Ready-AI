## 2025-08-15 - Explicit Form Label Association for Custom File Dropzones
**Learning:** In modal components featuring custom drag-and-drop file areas, hiding `<input type="file">` inside a visual `<label>` without an explicit `id` and `htmlFor` association degrades screen reader accessibility and form field detection.
**Action:** Always provide explicit `id` on inputs/textareas and match `htmlFor` on labels, even for custom drag-and-drop file upload containers.
