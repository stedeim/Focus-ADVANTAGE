<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Focus Advantage

Vite + React + TypeScript focus MVP. Live app: https://focus-advantage.vercel.app

The shipped path is **Onboarding → Auth → Dashboard / Focus Timer → Paywall**. Guest mode stays local. Signed-in users persist mission, review, onboarding, streak, and completed sessions in Supabase.

## Run locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and fill in values
3. Run the app: `npm run dev`

`npm run lint` typechecks the live MVP path.

## Environment variables

Required for magic-link sign-in and cloud save (also set these on Vercel):

- `VITE_SUPABASE_URL` — `https://zsswidmafowdlwymuide.supabase.co`
- `VITE_SUPABASE_ANON_KEY` — project anon/public key

Optional:

- `VITE_APP_URL` — magic-link redirect override (defaults to `window.location.origin`)
- `VITE_STRIPE_PAYMENT_LINK_URL` — paywall checkout link (USD, $9.99 / month; hardcoded fallback is the USD Premium Payment Link)
- `GEMINI_API_KEY` / `APP_URL` — kept for compatibility; unused by the current MVP path

Without the Supabase vars, the **signed-in** path shows a configure-Supabase message. **Continue as Guest** still works on-device.

## Enable magic-link auth

1. In Supabase → **Authentication → URL Configuration**:
   - Site URL: `https://focus-advantage.vercel.app`
   - Redirect URLs:
     - `https://focus-advantage.vercel.app`
     - `https://focus-advantage.vercel.app/**`
     - `http://localhost:3000`
     - `http://localhost:3000/**`
2. Keep the Email provider enabled and allow magic links.
3. Run `supabase/migrations/20260906152400_profiles_and_focus_sessions.sql` in the SQL editor (or `supabase db push`). Do not drop existing billing tables.
4. In Vercel → Project → Settings → Environment Variables, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Production (and Preview if you test there).
5. Redeploy. Send yourself a magic link and confirm the callback returns to the app with a session.
