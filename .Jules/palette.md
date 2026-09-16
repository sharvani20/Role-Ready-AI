## 2025-05-18 - File Badge Removal Button Accessibility
**Learning:** Icon-only file dismissal buttons ("✕") in file attachment badges lack accessible names and explicit button types by default, making them unannounced to screen readers.
**Action:** Always provide `type="button"` and descriptive `aria-label`s (e.g. `aria-label="Remove uploaded resume file"`) on icon-only file remove triggers.
