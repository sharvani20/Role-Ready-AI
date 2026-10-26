## 2025-05-18 - Accessible Modal Dialogs and Inputs
**Learning:** Modal dialogs without ARIA roles (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`), dismiss buttons (`aria-label`), Escape key bindings, or explicit label-input association (`htmlFor`/`id`) hinder keyboard and screen reader users from navigating or exiting modal forms easily.
**Action:** Always include proper ARIA dialog attributes, an explicit close button with `aria-label`, Escape key event listener, backdrop click dismiss, and `htmlFor`/`id` paired form labels whenever creating or editing React modal components.
