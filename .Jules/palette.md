## 2025-05-18 - Accessible Modal Dialog Overlay Standards
**Learning:** Modal overlays require accessible heading associations (`role="dialog"`, `aria-labelledby`), Escape key handlers, explicit backdrop click dismissals, and visible close buttons with standard `aria-label` and `type="button"` attributes to ensure seamless keyboard and screen reader accessibility.
**Action:** Always include keydown listeners for Escape key dismissals and explicit close button standard accessibility attributes when building modal components.
