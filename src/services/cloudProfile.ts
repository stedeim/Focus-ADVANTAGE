import type { User } from '@supabase/supabase-js';
import { displayNameFromUser, getSupabaseClient } from '../lib/supabaseClient';
import { OnboardingAnswers } from '../types/onboarding';

export type CloudProfile = {
  id: string;
  email: string | null;
  name: string | null;
  onboarding: OnboardingAnswers | null;
  current_mission: string | null;
  last_review: string | null;
  streak: number;
  premium_active: boolean;
};

export type LocalSnapshot = {
  name?: string;
  onboarding?: OnboardingAnswers | null;
  mission?: string;
  review?: string;
  streak?: number;
};

export type ProfilePatch = {
  email?: string | null;
  name?: string | null;
  onboarding?: OnboardingAnswers | null;
  current_mission?: string | null;
  last_review?: string | null;
  streak?: number;
  premium_active?: boolean;
};

const isBlank = (value: string | null | undefined) => !value || !value.trim();

const isOnboardingAnswers = (value: unknown): value is OnboardingAnswers => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<OnboardingAnswers>;
  return (
    typeof candidate.workType === 'string' &&
    typeof candidate.capacity === 'string' &&
    typeof candidate.goal30Days === 'string'
  );
};

const toCloudProfile = (row: Record<string, unknown>, fallbackId: string): CloudProfile => ({
  id: typeof row.id === 'string' ? row.id : fallbackId,
  email: typeof row.email === 'string' ? row.email : null,
  name: typeof row.name === 'string' ? row.name : null,
  onboarding: isOnboardingAnswers(row.onboarding) ? row.onboarding : null,
  current_mission: typeof row.current_mission === 'string' ? row.current_mission : null,
  last_review: typeof row.last_review === 'string' ? row.last_review : null,
  streak: typeof row.streak === 'number' && Number.isFinite(row.streak) ? row.streak : 0,
  premium_active: row.premium_active === true,
});

export async function fetchProfile(userId: string): Promise<CloudProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error || !data) {
    return null;
  }

  return toCloudProfile(data as Record<string, unknown>, userId);
}

export async function saveProfile(userId: string, patch: ProfilePatch): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return false;
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.warn('Failed to save profile', error.message);
    return false;
  }

  return true;
}

const emptyProfile = (user: User, snapshot: LocalSnapshot = {}): CloudProfile => ({
  id: user.id,
  email: user.email ?? null,
  name: snapshot.name?.trim() || displayNameFromUser(user),
  onboarding: snapshot.onboarding ?? null,
  current_mission: snapshot.mission?.trim() || null,
  last_review: snapshot.review?.trim() || null,
  streak: snapshot.streak ?? 0,
  premium_active: false,
});

export async function ensureProfile(user: User, snapshot: LocalSnapshot = {}): Promise<CloudProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  const existing = await fetchProfile(user.id);
  if (existing) {
    return existing;
  }

  const created = emptyProfile(user, snapshot);
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: created.id,
        email: created.email,
        name: created.name,
        onboarding: created.onboarding,
        current_mission: created.current_mission,
        last_review: created.last_review,
        streak: created.streak,
        premium_active: created.premium_active,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    .select('*')
    .maybeSingle();

  if (error) {
    console.warn('Failed to create profile', error.message);
    return created;
  }

  return data ? toCloudProfile(data as Record<string, unknown>, user.id) : created;
}

export async function migrateLocalToCloud(
  user: User,
  snapshot: LocalSnapshot,
  alreadyMigrated: boolean,
): Promise<CloudProfile | null> {
  const profile = await ensureProfile(user, alreadyMigrated ? {} : snapshot);
  if (!profile) {
    return null;
  }

  if (alreadyMigrated) {
    return profile;
  }

  const patch: ProfilePatch = {};

  if (!profile.onboarding && snapshot.onboarding) {
    patch.onboarding = snapshot.onboarding;
  }
  if (isBlank(profile.current_mission) && snapshot.mission?.trim()) {
    patch.current_mission = snapshot.mission.trim();
  }
  if (isBlank(profile.last_review) && snapshot.review?.trim()) {
    patch.last_review = snapshot.review.trim();
  }
  if ((!profile.streak || profile.streak === 0) && (snapshot.streak ?? 0) > 0) {
    patch.streak = snapshot.streak;
  }
  if (isBlank(profile.name) && snapshot.name?.trim()) {
    patch.name = snapshot.name.trim();
  }
  if (isBlank(profile.email) && user.email) {
    patch.email = user.email;
  }

  if (Object.keys(patch).length === 0) {
    return profile;
  }

  const saved = await saveProfile(user.id, patch);
  return saved ? { ...profile, ...patch } : profile;
}

export async function recordFocusSession(input: {
  userId: string;
  mission: string;
  durationSeconds: number;
  streak: number;
}): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return false;
  }

  const completedAt = new Date().toISOString();
  const { error: sessionError } = await supabase.from('focus_sessions').insert({
    user_id: input.userId,
    mission: input.mission,
    duration_seconds: input.durationSeconds,
    completed_at: completedAt,
  });

  if (sessionError) {
    console.warn('Failed to save focus session', sessionError.message);
    return false;
  }

  const profileSaved = await saveProfile(input.userId, {
    streak: input.streak,
    current_mission: input.mission,
  });

  return profileSaved;
}
