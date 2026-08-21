## 2026-08-21 - Form Control Labeling and Screen Reader Live Announcements in Resume Analyzer
**Learning:** Textarea inputs and icon-only dismiss buttons in multi-step form cards lacked explicit label associations and live region announcements for dynamic analysis updates, impairing keyboard and screen reader navigation.
**Action:** Link section titles as explicit `<label>` tags with `htmlFor`/`id` on inputs, add `aria-label` to icon-only buttons (`✕`), set `type="button"` on non-submit buttons, and apply `aria-live="polite"` with `aria-busy` to dynamic status containers.
