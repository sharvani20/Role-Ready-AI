# Palette's Journal - Critical Learnings

## 2025-10-01 - Accessible Modal Dialog Overlay Pattern
**Learning:** Modal overlay components must combine keydown listeners for the 'Escape' key, backdrop click dismiss handlers (`e.stopPropagation()` on content wrapper), and ARIA dialog attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`) to ensure keyboard and screen-reader accessibility.
**Action:** Always ensure modal overlays have accessible close icon buttons with `aria-label`, backdrop click dismiss, `Escape` key listeners, and explicit label associations on form inputs.
