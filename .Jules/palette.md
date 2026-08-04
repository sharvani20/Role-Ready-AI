# Palette's Journal - Critical UX & Accessibility Learnings

## 2025-02-15 - Strict AST Linter Hook Constraints & Escaped CSS selectors
**Learning:** Strict AST React Hooks linter configurations (e.g., set-state-in-effect) can flag any synchronous state setter inside `useEffect`, even when calling local wrappers. Defining API calling routines inside the `useEffect` closure or wrapping them in microtasks avoids warnings. Additionally, custom classes containing brackets or decimals (like Tailwind classes `max-w-[1600px]` or `h-2.5`) must be escaped when written in pure `.css` files (e.g. `.max-w-\[1600px\]` and `.h-2\.5`) to prevent LightningCSS compilation crashes.
**Action:** Define fetch logic entirely inside the effect or use lazy initialization on mount, and escape any special Tailwind characters in custom CSS stylesheets.
