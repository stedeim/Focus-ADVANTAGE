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

export const TermsPage: React.FC = () => {
  return (
    <LegalShell title="Terms of Service" updated={LEGAL_UPDATED}>
      <p>
        These terms are the rules for using Focus Advantage, the productivity app operated by{' '}
        {OPERATOR_NAME} in {OPERATOR_LOCATION}. By using the app or{' '}
        <a href={SITE_URL} className="text-gold hover:underline" target="_blank" rel="noreferrer">
          {SITE_URL}
        </a>
        , you agree to them. If you do not agree, do not use the service.
      </p>

      <LegalSection title="The service">
        <p>
          Focus Advantage helps you set one mission, run a focus session, and leave a short review. The
          current product is an MVP. Features can change, pause, or be removed. The web site is a
          foundation for the iOS and Android apps; phone apps are the primary product.
        </p>
      </LegalSection>

      <LegalSection title="Accounts">
        <p>
          You can continue as a guest (data stays on the device) or sign in with an email magic link.
          You are responsible for the email inbox you use to sign in. Do not use the service to harm
          others or to break the law.
        </p>
      </LegalSection>

      <LegalSection title="Premium">
        <p>
          Optional Premium is currently offered on the web through Stripe at $9.99 USD per month, unless
          a later price is shown in the app. In-app purchases on the App Store and Google Play are not
          part of this MVP. Checkout, invoices, and card handling are Stripe’s. Cancel through Stripe’s
          customer flow or email us at {SUPPORT_EMAIL} if you need help finding it.
        </p>
      </LegalSection>

      <LegalSection title="Your content">
        <p>
          You keep ownership of the missions, reviews, and other notes you type. You give us permission
          to store and display that content so the app can work (including syncing it to your signed-in
          account).
        </p>
      </LegalSection>

      <LegalSection title="Availability and disclaimers">
        <p>
          The app is provided “as is.” We work to keep it running, but we do not promise uninterrupted
          service, perfect streak counts, or any particular productivity result. To the extent the law
          allows, we are not liable for lost data, lost profits, or indirect damages. If a court finds
          we owe you money, it will not exceed the amount you paid us in the 12 months before the claim,
          or $20 if you have not paid.
        </p>
      </LegalSection>

      <LegalSection title="Privacy and deletion">
        <p>
          How we handle personal data is described in the{' '}
          <AppLink to={LEGAL_ROUTES.privacy} className="text-gold hover:underline">
            Privacy Policy
          </AppLink>
          . You can delete your account and app data as explained on{' '}
          <AppLink to={LEGAL_ROUTES.deleteAccount} className="text-gold hover:underline">
            Delete account
          </AppLink>
          .
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by the laws of the Province of Alberta and the federal laws of Canada
          that apply there, without regard to conflict-of-law rules. If a dispute cannot be resolved by
          email, courts in Alberta will have jurisdiction, unless consumer law in your home place says
          otherwise.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms: {OPERATOR_NAME}, {OPERATOR_LOCATION}. Email{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
};
