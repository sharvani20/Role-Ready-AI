# Palette's Journal

## 2025-08-05 - [Escaped Selectors & Form Accessibility in Vite/LightningCSS]
**Learning:** In Vite environments using LightningCSS (like tailwindcss v4/vite builds), custom arbitrary utilities in custom CSS files like `.max-w-[1600px]` or `.h-2.5` must have their special characters (`[`, `]`, `.`) escaped in the CSS file (`.max-w-\[1600px\]`, `.h-2\.5`) to prevent syntax compilation errors during production builds. Furthermore, inputs and textareas should always be associated with their labels using `id` and `htmlFor` to adhere to web accessibility standards.
**Action:** Always check build outputs and make sure custom utility classes in `.css` files are escaped correctly, and always associate form labels with form inputs explicitly using `id`/`htmlFor`.
