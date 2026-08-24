## 2026-08-24 - Form Input Association & Screen Reader Context
**Learning:** Icon buttons without visible text (like removal buttons or icon actions) and form textareas using section header spans need explicit ARIA bindings (`id`, `htmlFor`, `aria-labelledby`, `aria-label`) and `aria-hidden="true"` on decorative icons for proper screen reader navigation.
**Action:** Always bind textareas/inputs with explicit labels and provide descriptive ARIA labels for icon-only action buttons.
