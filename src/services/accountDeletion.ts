import { getSupabaseClient, signOutSupabase } from '../lib/supabaseClient';
import { clearLocalAppData } from '../lib/localStore';

export type AccountDeletionResult = {
  authUserDeleted: boolean;
  appDataDeleted: boolean;
  error?: string;
};

const deleteOwnedRows = async (userId: string) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return false;
  }

  const sessions = await supabase.from('focus_sessions').delete().eq('user_id', userId);
  const profile = await supabase.from('profiles').delete().eq('id', userId);

  if (sessions.error) {
    console.warn('Failed to delete focus sessions', sessions.error.message);
  }
  if (profile.error) {
    console.warn('Failed to delete profile', profile.error.message);
  }

  return !sessions.error && !profile.error;
};

export async function deleteSignedInAccount(): Promise<AccountDeletionResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    clearLocalAppData();
    return { authUserDeleted: false, appDataDeleted: true };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    clearLocalAppData();
    await signOutSupabase();
    return {
      authUserDeleted: false,
      appDataDeleted: true,
      error: 'No active session. Local data was cleared.',
    };
  }

  let authUserDeleted = false;

  try {
    const { error: functionError } = await supabase.functions.invoke('delete-account', {
      method: 'POST',
      body: {},
    });
    if (!functionError) {
      authUserDeleted = true;
    } else {
      console.warn('delete-account function failed', functionError.message);
    }
  } catch (error) {
    console.warn('delete-account function threw', error);
  }

  if (!authUserDeleted) {
    const { error: rpcError } = await supabase.rpc('delete_own_account');
    if (!rpcError) {
      authUserDeleted = true;
    } else {
      console.warn('delete_own_account RPC failed', rpcError.message);
    }
  }

  let appDataDeleted = authUserDeleted;
  if (!authUserDeleted) {
    appDataDeleted = await deleteOwnedRows(user.id);
  }

  try {
    await signOutSupabase();
  } catch (error) {
    console.warn('Sign out after deletion skipped', error);
  }
  clearLocalAppData();

  return {
    authUserDeleted,
    appDataDeleted: authUserDeleted || appDataDeleted,
    error: authUserDeleted || appDataDeleted ? undefined : 'Could not delete cloud data from this device.',
  };
}

export function deleteGuestData() {
  clearLocalAppData();
}
