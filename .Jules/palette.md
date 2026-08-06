# Palette's Journal - Critical UX/Accessibility Learnings

## 2025-08-06 - Production Build CSS Escape Rules
**Learning:** When using LightningCSS for minifying Tailwind and general CSS rules inside Vite/Rolldown, standard utility-style bracketed selectors (like `.max-w-[1600px]`) and decimal-containing selectors (like `.h-2.5`) inside standard CSS files must be correctly escaped to `.max-w-\[1600px\]` and `.h-2\.5` respectively to avoid compilation blockages.
**Action:** Always check `.css` files for unescaped bracketed or decimal-containing utility class names before building, and escape them properly.

## 2025-08-06 - CSS Import Precedence Warning
**Learning:** Placing `@import "tailwindcss";` before `@import url(...)` rules triggers CSS post-processing warnings because `@import` statements must precede all other style rules aside from `@charset` and `@layer`.
**Action:** Always import external fonts (e.g., Google Fonts) at the very top of `index.css` before importing Tailwind or writing custom selectors.

## 2025-08-06 - Explicit Input Label Association
**Learning:** Screen readers and accessibility checkers rely on explicit `id` and `htmlFor` attributes to map form controls directly to their text labels. Relying on implicit mapping (like nesting) is fragile, and completely omitting labels (using only placeholder attributes) violates basic screen-reader support.
**Action:** For every form input, select, and textarea, supply a distinct `id` and map it to its respective text label using `htmlFor`. For hidden/visual-only designs, utilize Tailwind's standard `.sr-only` class on labels.
