/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { FocusTimer } from './components/FocusTimer';
import { Dashboard } from './components/Dashboard';
import { Onboarding } from './components/Onboarding';
import { Auth } from './components/Auth';
import { Paywall } from './components/Paywall';
import { OnboardingAnswers } from './types/onboarding';
import { updateLastLogin } from './services/activityTracker';
import { fetchBillingStatus } from './services/billing';

type TabId = 'dashboard' | 'timer';

const STORAGE_KEYS = {
  onboarded: 'focus_onboarded',
  authenticated: 'focus_authenticated',
  currentMission: 'focus_current_mission',
  lastReview: 'focus_last_review',
  premium: 'focus_premium',
  paywallPrompted: 'focus_paywall_prompted',
  user: 'focus_user',
  onboarding: 'focus_onboarding',
} as const;

const readBoolean = (key: string) => localStorage.getItem(key) === 'true';
const readString = (key: string) => localStorage.getItem(key) || '';

const readStoredUserEmail = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.user);
    if (!user) {
      return '';
    }

    const parsed = JSON.parse(user) as { email?: string };
    return parsed.email?.trim().toLowerCase() || '';
  } catch {
    return '';
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [onboarded, setOnboarded] = useState(() => readBoolean(STORAGE_KEYS.onboarded));
  const [authenticated, setAuthenticated] = useState(() => readBoolean(STORAGE_KEYS.authenticated));
  const [currentMission, setCurrentMission] = useState(() => readString(STORAGE_KEYS.currentMission));
  const [reviewNote, setReviewNote] = useState(() => readString(STORAGE_KEYS.lastReview));
  const [pendingPaywall, setPendingPaywall] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPremium, setIsPremium] = useState(() => readBoolean(STORAGE_KEYS.premium));
  const [hasPromptedPaywall, setHasPromptedPaywall] = useState(() => readBoolean(STORAGE_KEYS.paywallPrompted));
  const [userEmail, setUserEmail] = useState(() => readStoredUserEmail());
  const [billingRefreshToken, setBillingRefreshToken] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const billingSuccess = params.get('billing') === 'success';

    if (billingSuccess) {
      setHasPromptedPaywall(true);
      setBillingRefreshToken((value) => value + 1);

      try {
        localStorage.setItem(STORAGE_KEYS.paywallPrompted, 'true');
      } catch {
        // noop
      }

      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const user = localStorage.getItem(STORAGE_KEYS.user);
    if (authenticated && user) {
      try {
        const userData = JSON.parse(user) as { email?: string };
        updateLastLogin(userData.email || 'guest');
      } catch {
        updateLastLogin('guest');
      }
    }
  }, [authenticated]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.currentMission, currentMission);
    } catch (error) {
      console.warn('Failed to save mission', error);
    }
  }, [currentMission]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.lastReview, reviewNote);
    } catch (error) {
      console.warn('Failed to save review note', error);
    }
  }, [reviewNote]);

  useEffect(() => {
    if (!authenticated || !userEmail) {
      return;
    }

    let cancelled = false;

    const syncBillingStatus = async () => {
      const serverPremium = await fetchBillingStatus(userEmail);
      if (cancelled || serverPremium === null) {
        return;
      }

      setIsPremium(serverPremium);
      try {
        localStorage.setItem(STORAGE_KEYS.premium, serverPremium ? 'true' : 'false');
      } catch {
        // noop
      }
    };

    void syncBillingStatus();

    return () => {
      cancelled = true;
    };
  }, [authenticated, userEmail, billingRefreshToken]);

  const handleOnboardingComplete = (answers: OnboardingAnswers) => {
    setOnboarded(true);
    try {
      localStorage.setItem(STORAGE_KEYS.onboarded, 'true');
      localStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify(answers));
    } catch (error) {
      console.warn('Failed to save onboarding data', error);
    }
  };

  const handleAuthComplete = (user: { email: string; name: string }) => {
    const normalizedUser = {
      ...user,
      email: user.email.trim().toLowerCase(),
      name: user.name.trim(),
    };

    setAuthenticated(true);
    setUserEmail(normalizedUser.email);
    try {
      localStorage.setItem(STORAGE_KEYS.authenticated, 'true');
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(normalizedUser));
    } catch (error) {
      console.warn('Failed to save auth data', error);
    }
  };

  const handleGuestLogin = () => {
    handleAuthComplete({ email: 'guest@focusadvantage.app', name: 'Guest User' });
  };

  const handleMissionStart = (mission: string) => {
    setCurrentMission(mission);
    setActiveTab('timer');
  };

  const openPaywall = () => {
    setPendingPaywall(false);
    setShowPaywall(true);
    setHasPromptedPaywall(true);
    try {
      localStorage.setItem(STORAGE_KEYS.paywallPrompted, 'true');
    } catch {
      // noop
    }
  };

  const handleSessionComplete = () => {
    setActiveTab('dashboard');
    setPendingPaywall(true);
  };

  const handleSaveReview = (note: string) => {
    const trimmedNote = note.trim();
    setReviewNote(trimmedNote);

    if (pendingPaywall && !isPremium && !hasPromptedPaywall) {
      openPaywall();
    }

    setPendingPaywall(false);

    try {
      localStorage.setItem(STORAGE_KEYS.lastReview, trimmedNote);
    } catch (error) {
      console.warn('Failed to save review note', error);
    }
  };

  const handleUpgradeNow = () => {
    const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK_URL || 'https://buy.stripe.com/28E28r3bb6dd1iUg1224001';
    window.location.href = paymentLink;
  };

  const handleNotNow = () => {
    setShowPaywall(false);
    setHasPromptedPaywall(true);
    try {
      localStorage.setItem(STORAGE_KEYS.paywallPrompted, 'true');
    } catch {
      // noop
    }
  };

  if (!onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!authenticated) {
    return <Auth onAuthComplete={handleAuthComplete} onGuestLogin={handleGuestLogin} />;
  }

  if (showPaywall) {
    return <Paywall onUpgradeNow={handleUpgradeNow} onNotNow={handleNotNow} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' ? (
        <Dashboard
          mission={currentMission}
          reviewNote={reviewNote}
          setMission={setCurrentMission}
          onMissionStart={handleMissionStart}
          onSaveReview={handleSaveReview}
          onOpenPaywall={openPaywall}
          isPremium={isPremium}
        />
      ) : (
        <FocusTimer mission={currentMission || null} onSessionComplete={handleSessionComplete} />
      )}
    </Layout>
  );
}
