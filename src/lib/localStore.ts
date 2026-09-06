import { OnboardingAnswers } from '../types/onboarding';

export const STORAGE_KEYS = {
  onboarded: 'focus_onboarded',
  authenticated: 'focus_authenticated',
  guest: 'focus_guest',
  currentMission: 'focus_current_mission',
  lastReview: 'focus_last_review',
  premium: 'focus_premium',
  paywallPrompted: 'focus_paywall_prompted',
  user: 'focus_user',
  onboarding: 'focus_onboarding',
  streak: 'focus_streak',
} as const;

export type StoredUser = {
  email: string;
  name: string;
};

export const readBoolean = (key: string) => {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
};

export const readString = (key: string) => {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
};

export const writeString = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to save ${key}`, error);
  }
};

export const writeBoolean = (key: string, value: boolean) => {
  writeString(key, value ? 'true' : 'false');
};

export const readJson = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key}`, error);
  }
};

export const readStoredUser = (): StoredUser | null => {
  const parsed = readJson<Partial<StoredUser>>(STORAGE_KEYS.user);
  if (!parsed) {
    return null;
  }

  const email = parsed.email?.trim().toLowerCase() || '';
  const name = parsed.name?.trim() || '';
  if (!email && !name) {
    return null;
  }

  return { email, name };
};

export const readStreak = () => {
  const parsed = Number.parseInt(readString(STORAGE_KEYS.streak) || '0', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

export const readOnboardingAnswers = (): OnboardingAnswers | null => {
  return readJson<OnboardingAnswers>(STORAGE_KEYS.onboarding);
};

export const cloudMigratedKey = (userId: string) => `focus_cloud_migrated:${userId}`;
