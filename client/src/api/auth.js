const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Login failed');
  return json;
}

export async function register(email, password, registrationCode) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, registrationCode }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Registration failed');
  return json;
}
