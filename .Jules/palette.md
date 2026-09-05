## 2025-09-05 - Accessible Modal Keydown Handling & Form Association
**Learning:** Modal dialogs built using custom div overlays often lack keyboard dismissal (`Escape` key event listener) and a visible close button with an accessible `aria-label`, making them difficult to navigate for screen readers and keyboard-only users.
**Action:** Always attach an `Escape` keydown event listener to modal overlays and ensure modal close/dismiss buttons have `type="button"` and `aria-label="Close modal"`. Also explicitly pair `<label>` and form inputs/textareas using `htmlFor` and `id`.
