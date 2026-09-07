<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Focus Advantage

Vite + React + TypeScript focus MVP, wrapped with Capacitor for **iOS and Android**. The web build is the codebase that ships on phones. Live web (reference / magic-link host): https://focus-advantage.vercel.app

The shipped path is **Onboarding → Auth → Dashboard / Focus Timer → Paywall**. Guest mode stays local. Signed-in users persist mission, review, onboarding, streak, and completed sessions in Supabase.

App ID: `app.focusadvantage` (reverse of `focusadvantage.app`). Custom URL scheme: `focusadvantage://`.

## Run locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and fill in values
3. Run the app: `npm run dev`

`npm run lint` typechecks the live MVP path.

| Script | What it does |
| --- | --- |
| `npm run build` | Vite production build → `dist/` |
| `npm run cap:sync` | Build web assets, then `npx cap sync` into native projects |
| `npm run cap:android` | Sync, then open the Android project in Android Studio |
| `npm run cap:ios` | Sync, then open the iOS project in Xcode (Mac only) |

## Environment variables

Required for magic-link sign-in and cloud save (also set these on Vercel):

- `VITE_SUPABASE_URL` — `https://zsswidmafowdlwymuide.supabase.co`
- `VITE_SUPABASE_ANON_KEY` — project anon/public key

Optional:

- `VITE_APP_URL` — magic-link redirect override on **web** (defaults to `window.location.origin`). Native builds always use `focusadvantage://auth/callback`.
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
     - `focusadvantage://`
     - `focusadvantage://auth/callback`
     - `focusadvantage://**`
2. Keep the Email provider enabled and allow magic links.
3. Run `supabase/migrations/20260906152400_profiles_and_focus_sessions.sql` in the SQL editor (or `supabase db push`). Do not drop existing billing tables.
4. In Vercel → Project → Settings → Environment Variables, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Production (and Preview if you test there).
5. Redeploy. Send yourself a magic link and confirm the callback returns to the app with a session.

On a phone, the magic link should return via `focusadvantage://auth/callback`. The Capacitor App plugin listens for that URL and exchanges the PKCE `code` (or hash tokens) for a Supabase session. Keep the app installed and recently used so the PKCE verifier is still in WebView storage.

## Native iOS / Android (Capacitor)

Primary product targets are the phone apps. Stripe checkout stays on the **web paywall only** for now. Apple IAP and Google Play Billing are a later ticket.

### Prerequisites

- Node.js 20+
- Same `.env.local` (or CI env) as web — `VITE_*` values are baked in at `npm run build`
- **Android:** Android Studio (Ladybug / recent) + Android SDK
- **iOS:** a Mac with Xcode 16+ and CocoaPods. This Linux/CI environment cannot generate a complete `ios/` project.

Do **not** set `server.url` to localhost in `capacitor.config.ts` for a release build. That file is production-safe (`webDir: dist`, HTTPS schemes, no live-reload URL).

### Android (in this repo)

The `android/` project is committed and can be opened in Android Studio.

```bash
npm install
# Bake Supabase keys into the web bundle
npm run cap:sync
npm run cap:android
# or: npx cap open android
```

In Android Studio: wait for Gradle sync, pick an emulator or device, then Run. The `focusadvantage://` scheme is registered in `AndroidManifest.xml` / `strings.xml` (`custom_url_scheme`).

### iOS (project is in-repo; Xcode still needs a Mac)

The `ios/` Xcode project is committed (Capacitor 8 + Swift Package Manager). Generating it did **not** require a Mac. **Building, signing, and running still do** — Xcode is macOS-only.

The `focusadvantage://` URL type is already in `ios/App/App/Info.plist`.

On a Mac with Xcode 16+:

```bash
npm install
npm run cap:sync
npm run cap:ios
# or: npx cap open ios
```

In Xcode: set your Apple Developer team under **Signing & Capabilities**, pick a simulator or device, then Run. CocoaPods is not required for this Capacitor 8 SPM project.

### Known blockers (later tickets)

- **Store IAP is not implemented.** Premium on phones still uses the existing Stripe Payment Link. That is fine for TestFlight / Play internal testing of the wrap, not for App Store / Play production billing.
- Universal Links / App Links for `https://focus-advantage.vercel.app` are not configured yet. Custom-scheme return (`focusadvantage://`) is the auth path for devices.
- Live-reload (`server.url` + `cleartext`) is a local-only Capacitor tweak. Never ship it.
