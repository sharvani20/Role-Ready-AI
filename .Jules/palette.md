# Palette's Journal - Critical UX/Accessibility Learnings

## 2025-08-12 - Authentication Input Mapping and Casing Mismatches
**Learning:** In projects using OAuth2PasswordRequestForm or similar specifications where the email address is submitted inside the 'username' field of form payloads, the UI must never present the field as "Username". Doing so creates severe usability issues, as users attempt to log in using their username/name instead of their email. Additionally, case-sensitive filesystems (like Linux) will fail to compile Vite/React apps if components like `ProtectedRoute` have casing mismatches between the file name on disk and the import statement.

**Action:**
1. Always map the "Email Address" input fields to the form's `username` payload key when the OAuth2 backend requires it, keeping the UI intuitive and accessible.
2. Ensure all file imports exactly match disk file casing to avoid Case-Sensitive filesystem compilation errors.
