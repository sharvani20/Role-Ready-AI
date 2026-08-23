## 2025-02-23 - Modal Close Controls and Accessible Form Labels
**Learning:** Modal dialogs without an explicit close button leave keyboard and screen-reader users unable to dismiss the dialog easily. Additionally, form controls inside modals require explicit `id` and `htmlFor` associations so assistive technology properly announces field labels.
**Action:** Always provide an accessible close button (`aria-label="Close modal"`) in modal headers and explicitly link all form labels to their inputs using `id` and `htmlFor`.
