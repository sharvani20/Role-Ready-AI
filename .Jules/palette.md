## 2025-05-18 - Accessibility and Button Type Standards for File Badges & Form Textareas
**Learning:** Icon-only file removal buttons and action buttons without explicit `type="button"` attributes or ARIA labels hinder screen readers and keyboard accessibility. In addition, section text labels must be linked to corresponding textareas using `htmlFor` and `id` attributes.
**Action:** Always add explicit `type="button"` and `aria-label` attributes to dismiss/remove icon buttons and link all labels to textareas with `id`/`htmlFor` in form components.
