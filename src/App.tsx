/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { Layout } from './components/Layout';
import { FocusTimer } from './components/FocusTimer';
import { Dashboard } from './components/Dashboard';
import { Onboarding } from './components/Onboarding';
import { Auth } from './components/Auth';
import { Paywall } from './components/Paywall';
import { OnboardingAnswers } from './types/onboarding';
import { updateLastLogin, trackFocusBlockCompletion } from './services/activityTracker';
import { pollBillingStatus } from './services/billing';
import { useSupabaseSession } from './hooks/useSupabaseSession';
import { displayNameFromUser } from './lib/supabaseClient';
import {
  STORAGE_KEYS,
  cloudMigratedKey,
  readBoolean,
  readOnboardingAnswers,
  readStoredUser,
  readStreak,
  readString,
  writeBoolean,
  writeJson,
  writeString,
} from './lib/localStore';
import { migrateLocalToCloud, recordFocusSession, saveProfile } from './services/cloudProfile';

type TabId = 'dashboard' | 'timer';

const GUEST_USER = { email: 'guest@focusadvantage.app', name: 'Guest User' };

export default function App() {
  const { ready: sessionReady, user: cloudUser, configured: supabaseConfigured, signOut } = useSupabaseSession();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [onboarded, setOnboarded] = useState(() => readBoolean(STORAGE_KEYS.onboarded));
  const [authenticated, setAuthenticated] = useState(() => readBoolean(STORAGE_KEYS.guest));
  const [isGuest, setIsGuest] = useState(() => readBoolean(STORAGE_KEYS.guest));
  const [currentMission, setCurrentMission] = useState(() => readString(STORAGE_KEYS.currentMission));
  const [reviewNote, setReviewNote] = useState(() => readString(STORAGE_KEYS.lastReview));
  const [streak, setStreak] = useState(() => readStreak());
  const [pendingPaywall, setPendingPaywall] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPremium, setIsPremium] = useState(() => readBoolean(STORAGE_KEYS.premium));
  const [hasPromptedPaywall, setHasPromptedPaywall] = useState(() => readBoolean(STORAGE_KEYS.paywallPrompted));
  const [userEmail, setUserEmail] = useState(() => readStoredUser()?.email || '');
  const [userName, setUserName] = useState(() => readStoredUser()?.name || '');
  const [billingRefreshToken, setBillingRefreshToken] = useState(0);
  const [awaitingCheckout, setAwaitingCheckout] = useState(false);
  const [hydratedUserId, setHydratedUserId] = useState<string | null>(null);
  const hydrateRequest = useRef(0);

  const cloudPending = Boolean(cloudUser && hydratedUserId !== cloudUser.id);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const billingSuccess = params.get('billing') === 'success';

    if (billingSuccess) {
      setHasPromptedPaywall(true);
      setAwaitingCheckout(true);
      setBillingRefreshToken((value) => value + 1);
      writeBoolean(STORAGE_KEYS.paywallPrompted, true);

      const next = new URL(window.location.href);
      next.searchParams.delete('billing');
      window.history.replaceState({}, '', `${next.pathname}${next.search}${next.hash}`);
    }
  }, []);

  useEffect(() => {
    if (!sessionReady) {
      return;
    }

    if (!cloudUser) {
      setHydratedUserId(null);
      const guest = readBoolean(STORAGE_KEYS.guest);
      setIsGuest(guest);
      setAuthenticated(guest);
      return;
    }

    if (hydratedUserId === cloudUser.id) {
      return;
    }

    const requestId = ++hydrateRequest.current;
    const user = cloudUser;

    const hydrate = async () => {
      const localUser = readStoredUser();
      const profile = await migrateLocalToCloud(
        user,
        {
          name: localUser?.name,
          onboarding: readOnboardingAnswers(),
          mission: readString(STORAGE_KEYS.currentMission),
          review: readString(STORAGE_KEYS.lastReview),
          streak: readStreak(),
        },
        readBoolean(cloudMigratedKey(user.id)),
      );

      writeBoolean(cloudMigratedKey(user.id), true);

      if (hydrateRequest.current !== requestId) {
        return;
      }

      const email = (profile?.email || user.email || '').trim().toLowerCase();
      const name = profile?.name || displayNameFromUser(user, localUser?.name || '');

      setAuthenticated(true);
      setIsGuest(false);
      setUserEmail(email);
      setUserName(name);
      writeBoolean(STORAGE_KEYS.authenticated, true);
      writeBoolean(STORAGE_KEYS.guest, false);
      writeJson(STORAGE_KEYS.user, { email, name });

      if (profile?.onboarding) {
        setOnboarded(true);
        writeBoolean(STORAGE_KEYS.onboarded, true);
        writeJson(STORAGE_KEYS.onboarding, profile.onboarding);
      }

      if (typeof profile?.current_mission === 'string') {
        setCurrentMission(profile.current_mission);
        writeString(STORAGE_KEYS.currentMission, profile.current_mission);
      }

      if (typeof profile?.last_review === 'string') {
        setReviewNote(profile.last_review);
        writeString(STORAGE_KEYS.lastReview, profile.last_review);
      }

      if (typeof profile?.streak === 'number') {
        setStreak(profile.streak);
        writeString(STORAGE_KEYS.streak, String(profile.streak));
      }

      if (profile?.premium_active) {
        setIsPremium(true);
        writeBoolean(STORAGE_KEYS.premium, true);
      }

      setHydratedUserId(user.id);
    };

    void hydrate();
  }, [cloudUser, hydratedUserId, sessionReady]);

  useEffect(() => {
    if (authenticated && userEmail) {
      updateLastLogin(userEmail);
    }
  }, [authenticated, userEmail]);

  useEffect(() => {
    writeString(STORAGE_KEYS.currentMission, currentMission);
    if (!cloudUser || !sessionReady || cloudPending) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void saveProfile(cloudUser.id, { current_mission: currentMission });
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [cloudPending, cloudUser, currentMission, sessionReady]);

  useEffect(() => {
    writeString(STORAGE_KEYS.lastReview, reviewNote);
  }, [reviewNote]);

  useEffect(() => {
    if (!authenticated || !userEmail || isGuest) {
      return;
    }

    const signal = { cancelled: false };

    const syncBillingStatus = async () => {
      const serverPremium = await pollBillingStatus(userEmail, {
        attempts: awaitingCheckout ? 8 : 1,
        delayMs: 1500,
        signal,
      });
      if (signal.cancelled || serverPremium === null) {
        return;
      }

      setIsPremium(serverPremium);
      writeBoolean(STORAGE_KEYS.premium, serverPremium);
      if (awaitingCheckout) {
        setAwaitingCheckout(false);
      }

      if (cloudUser) {
        void saveProfile(cloudUser.id, { premium_active: serverPremium });
      }
    };

    void syncBillingStatus();

    return () => {
      signal.cancelled = true;
    };
  }, [authenticated, awaitingCheckout, cloudUser, isGuest, userEmail, billingRefreshToken]);

  const handleOnboardingComplete = (answers: OnboardingAnswers) => {
    setOnboarded(true);
    writeBoolean(STORAGE_KEYS.onboarded, true);
    writeJson(STORAGE_KEYS.onboarding, answers);

    if (cloudUser) {
      void saveProfile(cloudUser.id, { onboarding: answers });
    }
  };

  const handleGuestLogin = () => {
    setAuthenticated(true);
    setIsGuest(true);
    setUserEmail(GUEST_USER.email);
    setUserName(GUEST_USER.name);
    writeBoolean(STORAGE_KEYS.authenticated, true);
    writeBoolean(STORAGE_KEYS.guest, true);
    writeJson(STORAGE_KEYS.user, GUEST_USER);
  };

  const handleSignOut = async () => {
    hydrateRequest.current += 1;
    await signOut();
    setHydratedUserId(null);
    setAuthenticated(false);
    setIsGuest(false);
    setShowPaywall(false);
    setPendingPaywall(false);
    writeBoolean(STORAGE_KEYS.authenticated, false);
    writeBoolean(STORAGE_KEYS.guest, false);
  };

  const handleMissionStart = (mission: string) => {
    setCurrentMission(mission);
    setActiveTab('timer');

    if (cloudUser) {
      void saveProfile(cloudUser.id, { current_mission: mission });
    }
  };

  const openPaywall = () => {
    setPendingPaywall(false);
    setShowPaywall(true);
    setHasPromptedPaywall(true);
    writeBoolean(STORAGE_KEYS.paywallPrompted, true);
  };

  const handleSessionComplete = ({ durationSeconds }: { durationSeconds: number }) => {
    const nextStreak = streak + 1;
    const mission = currentMission || 'Deep Work Session';

    setStreak(nextStreak);
    writeString(STORAGE_KEYS.streak, String(nextStreak));
    trackFocusBlockCompletion(userEmail || 'guest');

    if (cloudUser) {
      void recordFocusSession({
        userId: cloudUser.id,
        mission,
        durationSeconds,
        streak: nextStreak,
      });
    }

    setActiveTab('dashboard');
    setPendingPaywall(true);
  };

  const handleSaveReview = (note: string) => {
    const trimmedNote = note.trim();
    setReviewNote(trimmedNote);
    writeString(STORAGE_KEYS.lastReview, trimmedNote);

    if (cloudUser) {
      void saveProfile(cloudUser.id, { last_review: trimmedNote });
    }

    if (pendingPaywall && !isPremium && !hasPromptedPaywall) {
      openPaywall();
    }

    setPendingPaywall(false);
  };

  const handleUpgradeNow = () => {
    const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK_URL || 'https://buy.stripe.com/3cI8wP3bbeJJ0eQ02424002';
    const checkoutUrl = new URL(paymentLink);
    if (!isGuest && userEmail.includes('@')) {
      checkoutUrl.searchParams.set('prefilled_email', userEmail);
    }
    window.location.href = checkoutUrl.toString();
  };

  const handleNotNow = () => {
    setShowPaywall(false);
    setHasPromptedPaywall(true);
    writeBoolean(STORAGE_KEYS.paywallPrompted, true);
  };

  if (!sessionReady || cloudPending) {
    return (
      <div className="min-h-screen bg-navy-dark text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="atmosphere" />
        <div className="relative z-10 text-center space-y-3">
          <h1 className="text-4xl font-serif italic text-gold tracking-tight">Focus Advantage</h1>
          <p className="text-sm text-white/40 uppercase tracking-[0.3em]">Restoring session</p>
        </div>
      </div>
    );
  }

  if (!onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!authenticated) {
    return <Auth supabaseConfigured={supabaseConfigured} onGuestLogin={handleGuestLogin} />;
  }

  if (showPaywall) {
    return <Paywall onUpgradeNow={handleUpgradeNow} onNotNow={handleNotNow} />;
  }

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      userLabel={isGuest ? 'Guest' : userEmail || userName}
      isGuest={isGuest}
      onSignOut={handleSignOut}
    >
      {activeTab === 'dashboard' ? (
        <Dashboard
          mission={currentMission}
          reviewNote={reviewNote}
          setMission={setCurrentMission}
          onMissionStart={handleMissionStart}
          onSaveReview={handleSaveReview}
          onOpenPaywall={openPaywall}
          isPremium={isPremium}
          saveDestination={cloudUser ? 'cloud' : 'local'}
        />
      ) : (
        <FocusTimer
          mission={currentMission || null}
          streak={streak}
          onSessionComplete={handleSessionComplete}
        />
      )}
    </Layout>
  );
}
