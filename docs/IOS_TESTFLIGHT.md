# iOS TestFlight runbook (Owner)

This repo is as store-ready as a Linux agent can make it: branding, bundle id, URL scheme, ATS, orientation, status bar, privacy manifest, and placeholder icon/splash. **Signing, Archive, and TestFlight upload still require a Mac + an Apple Developer Program account.** There is no Mac pool on this agent.

Capacitor 8 uses Swift Package Manager. Open **`ios/App/App.xcodeproj`**. Do **not** expect `ios/App/App.xcworkspace` (that file exists only if CocoaPods is added later). Xcode’s inner `App.xcodeproj/project.xcworkspace` is not the file you open.

## Already set in git

| Item | Value |
| --- | --- |
| Display name | Focus Advantage |
| Bundle id | `app.focusadvantage` |
| Marketing version | `1.0` (`MARKETING_VERSION`) |
| Build number | `1` (`CURRENT_PROJECT_VERSION`) — bump this for every new TestFlight upload |
| URL scheme | `focusadvantage://` (magic-link return: `focusadvantage://auth/callback`) |
| ATS | HTTPS only (`NSAllowsArbitraryLoads` = false). Covers Supabase (`*.supabase.co`) and Stripe (`buy.stripe.com`) |
| iPhone orientation | Portrait |
| Status bar | Light content on `#050B15` |
| Encryption export | `ITSAppUsesNonExemptEncryption` = false (HTTPS only) |
| Team / signing | **Empty — you set this in Xcode** |

Associated Domains / Universal Links are **not** enabled. Native auth uses the custom scheme above. Enabling `applinks:` without a hosted `apple-app-site-association` file does nothing useful; add it later on a Mac after the AASA file is live on `focus-advantage.vercel.app` (or `focusadvantage.io` / `focusadvantage.app`).

## Billing warning (read this first)

**Apple In-App Purchase is required before a public App Store release of Premium.** Stripe Checkout / Payment Links are **web-only**. TestFlight *internal* testing of the wrap can still open the existing Stripe paywall in Safari; App Review will reject Guideline 3.1.1 if iOS users pay for Premium through Stripe. Do **not** implement Apple IAP in this pass. Do **not** submit the app for App Store review until IAP exists.

## Owner steps

### 1. Mac prerequisites

1. Install **Xcode 16+** from the Mac App Store, then open it once and accept the license.
2. Install the iOS platform: Xcode → Settings → Platforms → iOS.
3. Join / sign in to the [Apple Developer Program](https://developer.apple.com/programs/) ($99/year) with the account that will own `app.focusadvantage`.
4. In a terminal: `xcode-select -p` should print an Xcode path. `sudo xcodebuild -license accept` if prompted.

CocoaPods is **not** required.

### 2. App ID (developer.apple.com)

1. [Certificates, Identifiers & Profiles → Identifiers](https://developer.apple.com/account/resources/identifiers/list) → **+** → App IDs → App.
2. Description: `Focus Advantage`. Bundle ID: **Explicit** `app.focusadvantage`.
3. Capabilities for now: none required (no Push, no Associated Domains, no IAP until that ticket).
4. Register.

### 3. App Store Connect app record

1. [App Store Connect](https://appstoreconnect.apple.com/) → My Apps → **+** → New App.
2. Platform: iOS. Name: **Focus Advantage**. Primary language: English (U.S.).
3. Bundle ID: `app.focusadvantage`. SKU: e.g. `focus-advantage-ios`. User Access: Full Access.
4. Complete the Paid Apps / banking / tax forms if you have not (needed before IAP; not needed for a free TestFlight binary).
5. Skip IAP product setup. Skip store screenshots until you are ready for App Review.

### 4. Build web assets into the iOS project

On the Mac, from the repo root (use the same `VITE_*` secrets you use on Vercel — they are **baked in at build time**):

```bash
cd /path/to/Focus-ADVANTAGE
cp .env.example .env.local   # then fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run cap:sync             # vite build + npx cap sync
```

Do **not** set `server.url` in `capacitor.config.ts`. That would point the binary at localhost.

Optional: `npm run cap:ios` also opens Xcode after sync.

### 5. Sign in Xcode

1. Open **`ios/App/App.xcodeproj`** (File → Open, or `npx cap open ios`).
2. Wait for Swift packages (`CapApp-SPM` → `capacitor-swift-pm` 8.5.1). If it fails: File → Packages → Resolve Package Versions.
3. Select the **App** target → **Signing & Capabilities**.
4. Team: your Apple Developer team. Automatically manage signing: **On**.
5. Bundle Identifier must stay `app.focusadvantage`.
6. Destination: Any iOS Device (arm64) for Archive. A simulator is fine for a smoke run only (Product → Run).

### 6. Archive and upload

1. Product → Scheme → App. Destination → **Any iOS Device (arm64)**.
2. Product → **Archive**. Wait for the Organizer.
3. **Distribute App** → App Store Connect → Upload → defaults (upload symbols, manage version) → Upload.
4. App Store Connect → TestFlight: wait until the build leaves **Processing** (often 5–15 minutes).

If Apple still asks export-compliance on first upload, answer **No** for the current MVP binary (`ITSAppUsesNonExemptEncryption` is already false). The shipped path only uses HTTPS. Unused AES vault helpers exist under `src/services/cryptoService.ts` but are not imported by the live Onboarding → Auth → Dashboard path. If you later ship that vault, revisit this answer.

### 7. TestFlight internal testing

1. TestFlight → Internal Testing → create a group (e.g. `Owner`).
2. Add App Store Connect Users (they must be Users in ASC with at least Developer or Marketing).
3. Add the processed build to the group. Testers install **TestFlight** from the App Store, then install Focus Advantage.
4. Smoke-check: launch splash (`#050B15`), onboarding, guest dashboard, magic-link return via `focusadvantage://auth/callback` (keep the app installed; open the email **on the phone**).

External TestFlight / public App Store: not this ticket. External testing needs Beta App Review; public Premium needs Apple IAP.

### 8. Next upload

In Xcode (App target → General) or `ios/App/App.xcodeproj/project.pbxproj`: increment **`CURRENT_PROJECT_VERSION`** (1 → 2 → 3). Keep `MARKETING_VERSION` at `1.0` until you ship a user-facing version bump. Then `npm run cap:sync`, Archive, Upload.

## Associated Domains (later, Owner Mac)

Custom scheme `focusadvantage://auth/callback` is already in `Info.plist` (`CFBundleURLSchemes` = `focusadvantage`). SceneDelegate + `App.addListener('appUrlOpen')` handle it.

Universal Links (https → app) still need, in this order:

1. Host `/.well-known/apple-app-site-association` on the https host (no file extension, `application/json`) with `appID` `TEAMID.app.focusadvantage` and paths for auth.
2. On the Mac: Signing & Capabilities → **+ Capability** → Associated Domains → `applinks:focus-advantage.vercel.app` (and/or `applinks:focusadvantage.io`).
3. Add those https URLs to Supabase Auth redirect allow-list.

Do not add the entitlement in git until step 1 is live.

## Still requires Owner Mac / Apple account

- Xcode signing (Team), certificates, provisioning profiles
- Archive + upload to App Store Connect
- Creating the ASC app record and TestFlight group
- Device / simulator run and magic-link email on a real iPhone
- Associated Domains entitlement + AASA file on the web host
- Apple IAP products, Paid Apps agreement, and replacing Stripe on iOS before App Review
- App Store listing assets (screenshots, description, privacy policy URL, age rating)
- Replacing the placeholder icon/splash in `resources/` if you want a designed mark (`resources/icon.png` 1024², `resources/splash.png` 2732², both `#050B15`)
