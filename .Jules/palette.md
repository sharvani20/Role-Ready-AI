## 2025-02-20 - Accessible Icon-Only File Removal Buttons
**Learning:** Icon-only remove buttons (e.g. '✕' badge dismiss buttons) in file attachment sections lacked `type="button"` and `aria-label`s, causing screen reader users to miss context and potentially triggering accidental form submissions.
**Action:** Always assign explicit `type="button"` and descriptive `aria-label` attributes to file badge close/dismiss buttons and link textareas/inputs with explicit `id` and `htmlFor` attributes across all form components.
