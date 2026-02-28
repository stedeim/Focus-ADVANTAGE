
/**
 * Activity Tracker Service
 * Handles client-side tracking of user engagement metrics.
 * In a production environment, these functions would call your backend API.
 */

export const updateLastLogin = async (userId: string) => {
  console.log(`[ActivityTracker] Updating last login for user: ${userId}`);
  // Mock API Call
  // await fetch('/api/user/activity', { method: 'POST', body: JSON.stringify({ type: 'login', userId }) });
  localStorage.setItem('focus_last_login', new Date().toISOString());
};

export const trackFocusBlockCompletion = async (userId: string) => {
  console.log(`[ActivityTracker] Tracking focus block completion for user: ${userId}`);
  
  const stats = JSON.parse(localStorage.getItem('focus_stats') || '{"total_blocks": 0, "streak": 0}');
  stats.total_blocks += 1;
  stats.last_block_at = new Date().toISOString();
  
  localStorage.setItem('focus_stats', JSON.stringify(stats));
  localStorage.setItem('focus_last_focus_block', new Date().toISOString());
};

export const trackCircleCheckin = async (userId: string) => {
  console.log(`[ActivityTracker] Tracking circle check-in for user: ${userId}`);
  localStorage.setItem('focus_last_circle_checkin', new Date().toISOString());
};
