import { supabase } from './config';
import type { User, AuthError } from '@supabase/supabase-js';

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async (): Promise<{ user: User | null; error: AuthError | null }> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    return { user: null, error };
  }

  return { user: null, error: null };
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Get the current user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return subscription;
};
