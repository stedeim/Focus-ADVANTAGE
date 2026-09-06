import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, '') || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

export const SUPABASE_CONFIG_MESSAGE =
  'Cloud sign-in is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, or continue as a guest.';

let client: SupabaseClient | null = null;
let missingConfigWarned = false;

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);

export const getAuthRedirectUrl = () => {
  const configured = import.meta.env.VITE_APP_URL?.trim();
  return (configured || window.location.origin).replace(/\/$/, '');
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
