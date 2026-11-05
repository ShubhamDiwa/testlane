# Testlane Supabase setup

Use a dedicated project. Apply `community.sql` once in its SQL Editor. Do not apply the older `schema.sql` for the community flow. The community migration separates public listings from tester contact details, private links, and feedback.

Set the project's Auth Site URL to the actual Testlane deployment origin, and add that origin followed by `/auth/google/callback` to the redirect allowlist. Enable Google in Supabase Authentication → Sign In / Providers. In Google Auth Platform, use a Web application client and add the exact Supabase callback URL displayed on the provider page as an authorized redirect URI. Put the Google Client ID and Client Secret in the Supabase provider settings.

Set `TESTLANE_SUPABASE_URL` and `TESTLANE_SUPABASE_KEY` to the project URL and publishable key in the Sites runtime. With both absent, the original ChatGPT/D1 flow remains available. Google uses a PKCE exchange and a short-lived, HTTP-only session cookie; users sign in again when it expires. Do not use a service-role key in the browser or share the database password or OAuth client secret in chat.

Keep the current D1 deployment active until the Supabase-backed app is tested. Existing profiles use Sites identity IDs; they must not be reassigned to Supabase UUIDs based on display name. Verify existing data and plan account linking before migrating any real records. Test anonymous listing access, member sign-in, developer-only approval, approved-only test links, and feedback visibility with two accounts.

Sites visibility is a separate setting. While the current preview is private, its ChatGPT access gate applies before Testlane's own login.
