## 2025-05-18 - Hybrid File & Text Input Accessibility in Resume Analyzer
**Learning:** Hybrid document inputs (allowing both file upload via hidden input and direct text insertion via textarea) often obscure accessible form controls for assistive technologies if textareas and file removal actions lack explicit label bindings (`htmlFor`/`id`) and ARIA labels.
**Action:** Always provide explicit `id` and `htmlFor` pairings for textareas and file inputs, set `type="button"` on file badge dismissal controls, and supply descriptive `aria-label` text for removal actions.
