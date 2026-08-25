## 2025-08-25 - Form Accessibility & Autofill Standards
**Learning:** Form input elements without explicit `<label>` elements and `htmlFor`/`id` bindings hinder screen-reader accessibility and browser autofill support. Providing screen-reader accessible labels with `.sr-only` along with standard `autoComplete` and `aria-required` attributes significantly improves accessibility without affecting the visual layout.
**Action:** Always pair form inputs with `<label htmlFor="...">` and `id`, using standard `autoComplete` and `sr-only` styling where visual labels are omitted.
