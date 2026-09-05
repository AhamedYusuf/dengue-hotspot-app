const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

/**
 * GET /api/reports/analytics
 * Returns { byDay, byArea, summary }
 */
export async function getAnalytics() {
  const res = await fetch(`${API_URL}/api/reports/analytics`);
  if (!res.ok) throw new Error('Failed to load analytics data.');
  return res.json();
}
