## 2025-05-18 - Accessibility and Keyboard Interaction for Upload Modal
**Learning:** Modal dialogs require proper dialog ARIA roles (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`), an explicit close button with `aria-label`, keydown handling for `Escape`, and `htmlFor`/`id` field linkages to provide a fully accessible keyboard and screen reader experience.
**Action:** Always include modal ARIA roles, an explicit `aria-label` close button, overlay click-dismiss, and `Escape` key listener on interactive modal dialogs.
