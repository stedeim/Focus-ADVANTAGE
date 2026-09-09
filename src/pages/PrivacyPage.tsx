import React from 'react';
import {
  LEGAL_UPDATED,
  LEGAL_ROUTES,
  OPERATOR_LOCATION,
  OPERATOR_NAME,
  SITE_URL,
  SUPPORT_EMAIL,
} from '../lib/brand';
import { AppLink } from '../components/AppLink';
import { LegalSection, LegalShell } from '../components/LegalShell';

export const PrivacyPage: React.FC = () => {
  return (
    <LegalShell title="Privacy Policy" updated={LEGAL_UPDATED}>
      <p>
        This policy explains what Focus Advantage collects, why we collect it, and how you can ask us
        to change or delete it. It is written in plain language. It is not a substitute for legal advice.
      </p>

      <LegalSection title="Who we are">
        <p>
          Focus Advantage is a productivity app operated by {OPERATOR_NAME} in {OPERATOR_LOCATION}.
          The public website is{' '}
          <a href={SITE_URL} className="text-gold hover:underline" target="_blank" rel="noreferrer">
            {SITE_URL}
          </a>
          . For privacy questions, email{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="What we collect">
        <p>Depending on how you use the app, we may have:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="text-white/80">Account email and optional name</span> if you sign in with a
            magic link (handled by Supabase Auth).
          </li>
          <li>
            <span className="text-white/80">Focus data you create</span>: onboarding answers, current
            mission, quick review notes, streak count, and completed focus sessions.
          </li>
          <li>
            <span className="text-white/80">Billing status</span> tied to your email if you start a
            Premium checkout on the web (paid / not paid). Card details are handled by Stripe, not stored
            in this app.
          </li>
          <li>
            <span className="text-white/80">Device-local data</span> in your browser or phone storage,
            including guest progress that never leaves the device.
          </li>
        </ul>
        <p>We do not ask for your precise location, contacts, photos, or microphone for this MVP.</p>
      </LegalSection>

      <LegalSection title="How we use it">
        <p>
          We use this information to sign you in, restore your mission and streak across devices, show
          whether Premium is active, and reply when you email us. We do not use your focus notes to train
          public AI models, and we do not sell personal information.
        </p>
      </LegalSection>

      <LegalSection title="Third parties">
        <p>The live product relies on a small set of processors:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="text-white/80">Supabase</span> — authentication and database for signed-in
            users.
          </li>
          <li>
            <span className="text-white/80">Stripe</span> — web checkout for Premium. Payment cards stay
            with Stripe.
          </li>
          <li>
            <span className="text-white/80">Vercel</span> — hosts the web app at {SITE_URL.replace('https://', '')}{' '}
            and related domains.
          </li>
        </ul>
        <p>
          Those companies process data under their own terms. We do not sell, rent, or share your personal
          information for advertising.
        </p>
      </LegalSection>

      <LegalSection title="Guest mode">
        <p>
          If you continue as a guest, your mission, review, and streak stay on this device. We do not
          create a cloud account unless you later sign in with email.
        </p>
      </LegalSection>

      <LegalSection title="Retention">
        <p>
          Cloud profile and session data stay until you delete your account or ask us to remove them.
          Guest and local copies stay on the device until you clear app data, delete the guest session in
          the app, or uninstall. Billing records needed for taxes or payment disputes may be kept as the
          payment processor requires.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          Focus Advantage is not directed at children under 13, and we do not knowingly collect personal
          information from children. If you believe a child has created an account, email us and we will
          delete it.
        </p>
      </LegalSection>

      <LegalSection title="Your choices (Canada, California, and elsewhere)">
        <p>
          You can ask us for a copy of the account data we hold, ask us to correct it, or ask us to
          delete it. Signed-in users can start deletion in the app on the{' '}
          <AppLink to={LEGAL_ROUTES.deleteAccount} className="text-gold hover:underline">
            Delete account
          </AppLink>{' '}
          page. You can also email {SUPPORT_EMAIL}. We do not sell personal information, and we do not
          use it for cross-context behavioral advertising.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          Sign-in uses a magic link through Supabase. We do not store your password. No method of
          transmission or storage is perfectly secure; we take reasonable steps and will tell you if we
          learn of a breach that affects your account.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          If this policy changes in a meaningful way, we will update the date above and post the new
          version at this page. Continued use after an update means you have had a chance to read it.
        </p>
      </LegalSection>
    </LegalShell>
  );
};
