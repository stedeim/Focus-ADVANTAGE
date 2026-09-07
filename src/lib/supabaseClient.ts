import { Capacitor } from '@capacitor/core';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, '') || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

export const SUPABASE_CONFIG_MESSAGE =
  'Cloud sign-in is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, or continue as a guest.';

export const NATIVE_AUTH_REDIRECT = 'focusadvantage://auth/callback';

let client: SupabaseClient | null = null;
let missingConfigWarned = false;
let lastHandledAuthUrl = '';

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);

export const getAuthRedirectUrl = () => {
  if (Capacitor.isNativePlatform()) {
    return NATIVE_AUTH_REDIRECT;
  }

  const configured = import.meta.env.VITE_APP_URL?.trim();
  return (configured || window.location.origin).replace(/\/$/, '');
};

const parseAuthParams = (url: string) => {
  const hashIndex = url.indexOf('#');
  const queryIndex = url.indexOf('?');

  let query = '';
  let hash = '';

  if (hashIndex >= 0) {
    hash = url.slice(hashIndex + 1);
    if (queryIndex >= 0 && queryIndex < hashIndex) {
      query = url.slice(queryIndex + 1, hashIndex);
    }
  } else if (queryIndex >= 0) {
    query = url.slice(queryIndex + 1);
  }

  const queryParams = new URLSearchParams(query);
  const hashParams = new URLSearchParams(hash);

  return {
    code: queryParams.get('code') || hashParams.get('code'),
    accessToken: hashParams.get('access_token') || queryParams.get('access_token'),
    refreshToken: hashParams.get('refresh_token') || queryParams.get('refresh_token'),
  };
};

export const handleNativeAuthUrl = async (url: string) => {
  if (!url || url === lastHandledAuthUrl) {
    return;
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return;
  }

  const { code, accessToken, refreshToken } = parseAuthParams(url);
  if (!code && !(accessToken && refreshToken)) {
    return;
  }

  lastHandledAuthUrl = url;

  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.warn('Magic-link code exchange failed', error.message);
      }
      return;
    }

    const { error } = await supabase.auth.setSession({
      access_token: accessToken!,
      refresh_token: refreshToken!,
    });
    if (error) {
      console.warn('Magic-link session restore failed', error.message);
    }
  } catch (error) {
    console.warn('Failed to handle native auth URL', error);
  }
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    if (!missingConfigWarned) {
      console.warn(SUPABASE_CONFIG_MESSAGE);
      missingConfigWarned = true;
    }
    return null;
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return client;
};

export const sendMagicLink = async (email: string, name?: string) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { error: SUPABASE_CONFIG_MESSAGE };
  }

  const trimmedName = name?.trim();
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      emailRedirectTo: getAuthRedirectUrl(),
      shouldCreateUser: true,
      data: trimmedName ? { name: trimmedName } : undefined,
    },
  });

  return { error: error?.message ?? null };
};

export const signOutSupabase = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
};

export const displayNameFromUser = (user: User, fallback = '') => {
  const metadataName =
    typeof user.user_metadata?.name === 'string' ? user.user_metadata.name.trim() : '';
  if (metadataName) {
    return metadataName;
  }

  const emailName = user.email?.split('@')[0]?.trim();
  return emailName || fallback || 'Member';
};
