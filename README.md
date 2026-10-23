# Testlane

SEO-oriented Android closed-testing service website. React + TypeScript + Tailwind, using the Sites Vinext starter's Next.js App Router API and server-rendered HTML. The portable local profile and Cloudflare deployment integration are retained.

## Included

- Responsive marketing page, package details, FAQ and a sourced testing guide.
- Animated Android device demo with four selectable testing scenes, pause/replay controls, viewport-aware playback, reduced-motion support, and progressive section reveals. No animation library or external media requests.
- Three-step validated app intake, review and consent.
- Explicit browser-only demo drafts, deletion controls, sample dashboard, feedback and text report export.
- Admin demo: search, status filters and session-only status updates.
- Supabase REST integration for email magic-link login, customer requests and admin status updates; no client service-role key.
- Per-page metadata/canonicals, robots, sitemap, private-route noindex, favicon and social image.

## Run

Install dependencies with the Sites `install-dependencies.mjs` helper; the starter's `install:ci` runs a locked install. Run `npm run dev`. `npm run build` builds the Worker application. `node node_modules/typescript/bin/tsc --noEmit` checks types.

On Windows with an ampersand in the workspace path, npm's cmd-based lifecycle scripts may fail. Set `npm_config_script_shell` to the absolute `pwsh.exe` path for installation. Invoke npm's JavaScript CLI entrypoint directly if the system npm shim resolves the wrong prefix.

## Connect Supabase

1. Create a Supabase project. Run `supabase/schema.sql` once in its SQL editor.
2. Enable email sign-in. Configure Site URL to the site's real origin and allow `https://YOUR_ORIGIN/auth/callback` in redirect URLs. This implementation consumes the implicit magic-link fragment returned by Supabase's default email OTP link. Custom email templates must preserve that supported flow.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and the public anon/publishable key as `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the deployment environment or `.env.local`. Never put service-role keys here.
4. Set `NEXT_PUBLIC_SITE_URL` to the final domain and rebuild. The safe `/api/config` endpoint exposes only public connection settings.
5. Sign in once as the operator. Promote the specific user UUID through the SQL editor using the commented SQL statement. Clients cannot change their role.
6. Verify with two customers and an admin that each customer sees only their own requests, cannot update statuses, and cannot access admin records. The SQL policies enforce access independently of the UI.

## Before accepting customers

Supabase, email delivery and payment credentials are not connected. The SQL and live integration are prepared but have not been exercised against an actual project. Real tester enrollment, daily activity, screenshots, feedback management, automated email, tester assignment and paid checkout remain to be integrated. In live mode the customer view intentionally shows request records only; sample testing data is displayed exclusively in demo mode.

Finalize actual pricing, tester staffing, business contact details and service/privacy/refund terms. Set up a payment provider's server-side order creation and signed, idempotent webhook handling before collecting money. Do not mark a request paid from a browser callback. Social previews use a raster PNG rendered from the included brand SVG.

A deployment created through Sites starts private. Public SEO indexing requires public access and a crawlable domain; technical SEO preparation alone does not guarantee rankings.
