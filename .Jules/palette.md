# Palette's Journal - Critical UX/A11y Learnings

## 2025-05-20 - Input Wrapper Styling & Box Sizing Layout Alignment
**Learning:** In plain CSS forms with custom field styling (e.g. `Login.css`), wrapping standard `<input>` elements in custom container divs (such as `.password-input-wrapper` for absolute positioned toggle buttons) can break horizontal form alignment unless both the wrapper container and input have explicit `display: block` and `box-sizing: border-box` styling.
**Action:** Always set `display: block` and `box-sizing: border-box` on both input wrapper containers and inner inputs when introducing action buttons inside form fields.
