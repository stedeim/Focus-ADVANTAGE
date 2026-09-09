import React, { useState } from 'react';
import { AlertTriangle, Mail } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { DELETE_ACCOUNT_MAILTO, SUPPORT_EMAIL } from '../lib/brand';
import { deleteGuestData, deleteSignedInAccount } from '../services/accountDeletion';
import { AppLink } from '../components/AppLink';
import { LegalSection, LegalShell } from '../components/LegalShell';

type DeleteAccountPageProps = {
  sessionReady: boolean;
  cloudUser: User | null;
  isGuest: boolean;
};

export const DeleteAccountPage: React.FC<DeleteAccountPageProps> = ({
  sessionReady,
  cloudUser,
  isGuest,
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [authUserDeleted, setAuthUserDeleted] = useState(false);

  const signedIn = Boolean(cloudUser);
  const canDeleteNow = signedIn || isGuest;

  const handleDelete = async () => {
    if (!confirmed || status === 'working') {
      return;
    }

    setStatus('working');
    setMessage('');

    try {
      if (signedIn) {
        const result = await deleteSignedInAccount();
        setAuthUserDeleted(result.authUserDeleted);
        setStatus('done');
        setMessage(
          result.authUserDeleted
            ? 'Your Focus Advantage account and app data were deleted. You can close this page.'
            : result.appDataDeleted
              ? `Your focus data on this app was deleted and you were signed out. Email ${SUPPORT_EMAIL} if you still need the sign-in identity removed from our auth provider.`
              : result.error || 'Something went wrong. Email support and we will finish the deletion.',
        );

        if (result.authUserDeleted || result.appDataDeleted) {
          window.setTimeout(() => {
            window.location.replace('/');
          }, 2500);
        }
        return;
      }

      deleteGuestData();
      setAuthUserDeleted(false);
      setStatus('done');
      setMessage('Guest data on this device was cleared. Nothing was stored in a cloud account.');
      window.setTimeout(() => {
        window.location.replace('/');
      }, 1800);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Could not delete account data.');
    }
  };

  return (
    <LegalShell title="Delete account">
      <p>
        You can delete Focus Advantage data from here. This cannot be undone. Billing records held by
        Stripe may remain as required for payments and tax. Email us if you also need help with a
        Premium charge.
      </p>

      {!sessionReady ? (
        <p className="text-white/50">Checking whether you are signed in…</p>
      ) : signedIn ? (
        <div className="rounded-2xl border border-white/10 bg-navy-medium/80 px-4 py-3 text-sm text-white/70">
          Signed in as <span className="text-white font-semibold">{cloudUser?.email || 'your account'}</span>.
          Deleting removes your profile, focus sessions, and — when the server path is available — the
          magic-link user itself.
        </div>
      ) : isGuest ? (
        <div className="rounded-2xl border border-white/10 bg-navy-medium/80 px-4 py-3 text-sm text-white/70">
          You are in guest mode. Data is only on this device. Deleting clears local Focus Advantage
          storage. There is no cloud account to remove.
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          You are not signed in on this device. Sign in first so we can delete the matching cloud
          account, or email{' '}
          <a href={DELETE_ACCOUNT_MAILTO} className="text-gold hover:underline">
            {SUPPORT_EMAIL}
          </a>{' '}
          from the address you used to register.
        </div>
      )}

      <LegalSection title="What we delete">
        <ul className="list-disc pl-5 space-y-1">
          <li>Onboarding answers, mission, review, streak, and completed focus sessions this app stores</li>
          <li>Local copies on this device</li>
          <li>The Supabase Auth user, when the in-app delete path can reach it</li>
        </ul>
      </LegalSection>

      <LegalSection title="If in-app delete cannot remove the login">
        <p>
          Magic-link users are stored in Supabase Auth. The app tries an Edge Function and a database
          function first. If those are not deployed yet, we still delete the profile and sessions we own,
          sign you out, and ask you to email {SUPPORT_EMAIL} so the auth user can be removed by hand.
        </p>
      </LegalSection>

      {canDeleteNow && (
        <div className="space-y-4 pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-1 accent-[#EAB308]"
            />
            <span className="text-sm text-white/70">
              I understand this permanently deletes my Focus Advantage data
              {signedIn ? ' for this signed-in account' : ' on this device'}.
            </span>
          </label>

          <button
            type="button"
            disabled={!confirmed || status === 'working' || status === 'done'}
            onClick={() => void handleDelete()}
            className="w-full rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-4 text-sm font-bold uppercase tracking-widest text-red-200 hover:bg-red-500/25 disabled:opacity-40 disabled:hover:bg-red-500/15 transition-colors flex items-center justify-center gap-2"
          >
            <AlertTriangle size={16} />
            {status === 'working' ? 'Deleting…' : signedIn ? 'Delete my account' : 'Clear guest data'}
          </button>
        </div>
      )}

      {message && (
        <p className={`text-sm leading-relaxed ${status === 'error' ? 'text-amber-200' : 'text-white/80'}`}>
          {message}
          {status === 'done' && !authUserDeleted && signedIn && (
            <>
              {' '}
              <a href={DELETE_ACCOUNT_MAILTO} className="text-gold hover:underline">
                Email support to finish auth deletion
              </a>
              .
            </>
          )}
        </p>
      )}

      <p className="text-sm text-white/45">
        Prefer email?{' '}
        <a href={DELETE_ACCOUNT_MAILTO} className="text-gold hover:underline inline-flex items-center gap-1">
          <Mail size={14} />
          {SUPPORT_EMAIL}
        </a>
        {' · '}
        <AppLink to="/" className="text-gold hover:underline">
          Back to app
        </AppLink>
      </p>
    </LegalShell>
  );
};
