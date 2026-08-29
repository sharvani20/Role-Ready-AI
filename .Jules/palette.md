# Palette's Journal - Critical UX & Accessibility Learnings

## 2025-05-18 - Attachment Remove Buttons & Form Textareas Accessibility
**Learning:** File badge remove buttons (e.g. `✕`) without explicit `type="button"` and `aria-label` cause screen readers to announce generic or ambiguous symbols like "multiplication sign" or "cross mark", leaving assistive technology users unaware of their purpose. Additionally, multi-line textareas need explicit `id` and `aria-label` attributes when separate visual label tags are not directly attached.
**Action:** Always provide descriptive `aria-label` attributes and explicit `type="button"` attributes on dismiss/remove icon buttons, and ensure all input and textarea fields have `id` and `aria-label` attributes.
