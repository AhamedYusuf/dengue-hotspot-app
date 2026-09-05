// client/src/api/getReports.js
// P2 — fetch helper for GET /api/reports

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export async function getReports() {
  const res = await fetch(`${API_URL}/api/reports`);

  if (!res.ok) {
    throw new Error('Could not load reports from the server.');
  }

  return res.json();
}
