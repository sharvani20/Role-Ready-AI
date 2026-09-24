## 2025-05-18 - Accessibility Attributes on File Removal Badges & Text Inputs
**Learning:** Dismiss buttons on file upload badges (like '✕') and form textareas often lack explicit `type="button"`, `aria-label`, and `id` attributes. Screen readers cannot properly announce icon-only file removal actions without `aria-label` attributes.
**Action:** Always include explicit `type="button"` and descriptive `aria-label` attributes on icon-only action buttons (e.g., dismiss/clear buttons) and associate `id`/`aria-label` attributes with form text inputs and textareas.
