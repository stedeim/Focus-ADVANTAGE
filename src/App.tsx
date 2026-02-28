/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Crown, Zap } from 'lucide-react';
import { Layout } from './components/Layout';
import { AICoach } from './components/AICoach';
import { FocusTimer } from './components/FocusTimer';
import { Dashboard } from './components/Dashboard';
import { BoundaryVault } from './components/BoundaryVault';
import { Onboarding } from './components/Onboarding';
import { Auth } from './components/Auth';
import { Planner } from './components/Planner';
import { Paywall } from './components/Paywall';
import { FocusProfile, OnboardingAnswers } from './types/onboarding';
import { CircleHomeScreen } from './components/CircleHomeScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { MorningLockIn } from './components/MorningLockIn';
import { SundayReview } from './components/SundayReview';
import { DistractionDebtCalculator } from './components/DistractionDebtCalculator';

import { updateLastLogin } from './services/activityTracker';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLockingIn, setIsLockingIn] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [currentMission, setCurrentMission] = useState<string | null>(null);
  
  // Onboarding Assessment State
  const [onboarded, setOnboarded] = useState(() => {
    return localStorage.getItem('focus_onboarded') === 'true';
  });
  
  // Auth State
  const [authenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem('focus_authenticated') === 'true';
  });
  
  // Subscription State
  const [tier, setTier] = useState<'recruit' | 'pro' | 'master' | null>(() => {
    return (localStorage.getItem('focus_tier') as any) || null;
  });

  // Training Plan State
  const [currentWeek, setCurrentWeek] = useState(() => {
    const savedWeek = localStorage.getItem('focus_current_week');
    return savedWeek ? parseInt(savedWeek, 10) : 1;
  });

  // Avatar State
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    return localStorage.getItem('focus_avatar');
  });

  // Track login on mount if authenticated
  useEffect(() => {
    const user = localStorage.getItem('focus_user');
    if (authenticated && user) {
      const userData = JSON.parse(user);
      updateLastLogin(userData.email || 'guest');
    }
  }, [authenticated]);

  useEffect(() => {
    try {
      localStorage.setItem('focus_current_week', currentWeek.toString());
    } catch (e) {
      console.warn('Failed to save current week', e);
    }
  }, [currentWeek]);

  useEffect(() => {
    if (avatarUrl) {
      try {
        localStorage.setItem('focus_avatar', avatarUrl);
      } catch (e) {
        console.error('Failed to save avatar (likely quota exceeded)', e);
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          alert('The image is too large to save. Please try a smaller file.');
        }
      }
    }
  }, [avatarUrl]);

  const [profile, setProfile] = useState<FocusProfile | null>(() => {
    const saved = localStorage.getItem('focus_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [answers, setAnswers] = useState<OnboardingAnswers | null>(() => {
    const saved = localStorage.getItem('focus_answers');
    return saved ? JSON.parse(saved) : null;
  });

  const handleOnboardingComplete = (newProfile: FocusProfile, newAnswers: OnboardingAnswers) => {
    setProfile(newProfile);
    setAnswers(newAnswers);
    setOnboarded(true);
    try {
      localStorage.setItem('focus_onboarded', 'true');
      localStorage.setItem('focus_profile', JSON.stringify(newProfile));
      localStorage.setItem('focus_answers', JSON.stringify(newAnswers));
    } catch (e) {
      console.warn('Failed to save onboarding data', e);
    }
  };

  const handleAuthComplete = (user: { email: string; name: string }) => {
    setAuthenticated(true);
    try {
      localStorage.setItem('focus_authenticated', 'true');
      localStorage.setItem('focus_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save auth data', e);
    }
  };

  const handleTierSelect = (selectedTier: 'recruit' | 'pro' | 'master') => {
    setTier(selectedTier);
    try {
      localStorage.setItem('focus_tier', selectedTier);
    } catch (e) {
      console.warn('Failed to save tier selection', e);
    }
  };

  const handleLockInComplete = (data: any) => {
    setIsLockingIn(false);
    setCurrentMission(data.priority);
    setActiveTab('timer'); // Go to timer after lock-in
  };

  const handleReviewComplete = (data: any) => {
    setIsReviewing(false);
    // Advance week logic could go here
    if (currentWeek < 6) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const handleGuestLogin = () => {
    handleAuthComplete({ email: 'guest@focusos.com', name: 'Guest User' });
    handleTierSelect('master'); // Give guest users master access for testing
  };

  // Flow: Assessment -> Auth -> Paywall -> App
  if (!onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!authenticated) {
    return <Auth onAuthComplete={handleAuthComplete} onGuestLogin={handleGuestLogin} onBack={() => setOnboarded(false)} />;
  }

  if (!tier) {
    return <Paywall onSelectTier={handleTierSelect} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onboarded={onboarded} 
            setActiveTab={setActiveTab} 
            currentWeek={currentWeek} 
            setCurrentWeek={setCurrentWeek} 
            onStartLockIn={() => setIsLockingIn(true)} 
            onStartReview={() => setIsReviewing(true)}
          />
        );
      case 'coach':
        if (tier !== 'master') {
          return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 p-8">
              <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400">
                <Crown size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Focus Master Required</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto">
                  The AI Focus Coach is an exclusive feature for Focus Master members.
                </p>
              </div>
              <button 
                onClick={() => setTier(null)}
                className="gold-button px-8"
              >
                Upgrade to Master
              </button>
            </div>
          );
        }
        return <AICoach profile={profile} answers={answers} />;
      case 'timer':
        return <FocusTimer mission={currentMission} />;
      case 'circle':
        return <CircleHomeScreen />;
      case 'vault':
        if (tier === 'recruit') {
          return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 p-8">
              <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                <Zap size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Focus Pro Required</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto">
                  The Boundary Vault is available for Focus Pro and Master members.
                </p>
              </div>
              <button 
                onClick={() => setTier(null)}
                className="gold-button px-8"
              >
                Upgrade to Pro
              </button>
            </div>
          );
        }
        return <BoundaryVault />;
      case 'planner':
        return <Planner />;
      case 'analytics':
        if (tier === 'recruit') {
          return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 p-8">
              <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                <Zap size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Focus Pro Required</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto">
                  Advanced Analytics are available for Focus Pro and Master members.
                </p>
              </div>
              <button 
                onClick={() => setTier(null)}
                className="gold-button px-8"
              >
                Upgrade to Pro
              </button>
            </div>
          );
        }
        return <AnalyticsScreen />;
      case 'debt-calculator':
        return <DistractionDebtCalculator />;
      default:
        return <Dashboard onboarded={onboarded} setActiveTab={setActiveTab} currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      currentWeek={currentWeek}
      avatarUrl={avatarUrl}
      onAvatarUpload={setAvatarUrl}
    >
      {isLockingIn && <MorningLockIn onComplete={handleLockInComplete} onClose={() => setIsLockingIn(false)} />}
      {isReviewing && <SundayReview onComplete={handleReviewComplete} onClose={() => setIsReviewing(false)} />}
      {renderContent()}
    </Layout>
  );
}

