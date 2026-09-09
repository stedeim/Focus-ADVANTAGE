import React from 'react';
import { Mail } from 'lucide-react';
import {
  LEGAL_ROUTES,
  OPERATOR_LOCATION,
  OPERATOR_NAME,
  SITE_URL,
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
} from '../lib/brand';
import { AppLink } from '../components/AppLink';
import { LegalSection, LegalShell } from '../components/LegalShell';

export const SupportPage: React.FC = () => {
  return (
    <LegalShell title="Support">
      <p>
        Need help with Focus Advantage? Email is the fastest way to reach a person. There is no phone
        queue and no chatbot in front of this inbox.
      </p>

      <a
        href={SUPPORT_MAILTO}
        className="gold-button w-full sm:w-auto px-6"
      >
        <Mail size={16} />
        Email {SUPPORT_EMAIL}
      </a>

      <LegalSection title="What to include">
        <ul className="list-disc pl-5 space-y-1">
          <li>The email you use to sign in (if you have an account)</li>
          <li>Whether you are on iPhone, Android, or the web</li>
          <li>What you expected, and what happened instead</li>
        </ul>
      </LegalSection>

      <LegalSection title="Common requests">
        <ul className="list-disc pl-5 space-y-1">
          <li>Magic-link sign-in not arriving</li>
          <li>Restoring a session after reinstalling the app</li>
          <li>Premium checkout on the web</li>
          <li>
            Deleting your account — you can also use the{' '}
            <AppLink to={LEGAL_ROUTES.deleteAccount} className="text-gold hover:underline">
              Delete account
            </AppLink>{' '}
            page
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Operator">
        <p>
          {OPERATOR_NAME} · {OPERATOR_LOCATION}
          <br />
          <a href={SITE_URL} className="text-gold hover:underline" target="_blank" rel="noreferrer">
            {SITE_URL}
          </a>
        </p>
        <p>
          Privacy:{' '}
          <AppLink to={LEGAL_ROUTES.privacy} className="text-gold hover:underline">
            Policy
          </AppLink>
          {' · '}
          Terms:{' '}
          <AppLink to={LEGAL_ROUTES.terms} className="text-gold hover:underline">
            Service
          </AppLink>
        </p>
      </LegalSection>
    </LegalShell>
  );
};
