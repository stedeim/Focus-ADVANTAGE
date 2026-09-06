import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured, signOutSupabase } from '../lib/supabaseClient';

export function useSupabaseSession() {
  const [ready, setReady] = useState(!isSupabaseConfigured());
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setReady(true);
      return;
    }

    let cancelled = false;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!cancelled) {
          setUser(data.session?.user ?? null);
        }
      })
      .catch((error) => {
        console.warn('Failed to restore session', error);
      })
      .finally(() => {
        if (!cancelled) {
          setReady(true);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return {
    ready,
    user,
    configured: isSupabaseConfigured(),
    signOut: signOutSupabase,
  };
}
