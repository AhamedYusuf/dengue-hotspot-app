const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export async function getQueue(token) {
  const res = await fetch(`${API_URL}/api/reports/queue`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to load queue');
  }
  return res.json();
}

export async function reviewReport(id, decision, token) {
  const res = await fetch(`${API_URL}/api/reports/${id}/review`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ decision }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to submit review');
  }
  return res.json();
}
