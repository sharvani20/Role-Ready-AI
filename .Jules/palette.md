# Palette's Journal - Critical Learnings

## 2025-02-18 - [Fix Login Disconnect between Username Label and Email Endpoint]
**Learning:** In applications where the login endpoint expects the user's registered email address as the 'username' key in the form-data request, labeling the login input field as 'Username' or using a 'Username' placeholder causes major user friction, as users will naturally input their display username and fail to authenticate. Aligning form labels and placeholder prompts with the expected technical payload (i.e. 'Email Address') eliminates this cognitive mismatch.
**Action:** Always verify backend payload expectations for login endpoints and update frontend form labels and inputs to ask for the exact required identifier (e.g. Email instead of Username).
