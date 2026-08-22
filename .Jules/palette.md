# Palette's Journal - Critical Learnings

## 2025-05-18 - Form Label Association and Focus States in Textarea Form Cards
**Learning:** Textarea inputs inside section-styled form containers often lack explicit `<label htmlFor="...">` associations and proper `:focus-visible` styling, hindering accessibility for screen readers and keyboard users.
**Action:** Always link form labels explicitly with `htmlFor` and input/textarea `id`s, provide `aria-label`s on icon-only buttons like badge removers, and ensure `:focus-visible` outlines are styled clearly.
