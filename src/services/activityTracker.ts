/**
 * Activity Tracker Service
 * Minimal client-side tracking for the MVP.
 */

const readStats = () => {
  try {
    return JSON.parse(localStorage.getItem('focus_stats') || '{"total_blocks": 0}');
  } catch {
    return { total_blocks: 0 };
  }
};

export const updateLastLogin = async (userId: string) => {
  localStorage.setItem('focus_last_login', new Date().toISOString());
  localStorage.setItem('focus_last_login_user', userId);
};

export const trackFocusBlockCompletion = async (userId: string) => {
  const stats = readStats();
  stats.total_blocks = (stats.total_blocks || 0) + 1;
  stats.last_block_at = new Date().toISOString();
  stats.last_block_user = userId;

  localStorage.setItem('focus_stats', JSON.stringify(stats));
  localStorage.setItem('focus_last_focus_block', new Date().toISOString());
};
