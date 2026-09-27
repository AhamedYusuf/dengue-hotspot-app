import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      if (isRegister) {
        await registerApi(email, password, registrationCode);
        setSuccessMsg('Account registered successfully! Logging you in...');
        const { token, email: userEmail } = await loginApi(email, password);
        login(token, userEmail);
        navigate('/queue');
      } else {
        const { token, email: userEmail } = await loginApi(email, password);
        login(token, userEmail);
        navigate('/queue');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
            🩺
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            {isRegister ? 'Official Registration' : 'Health Official Portal'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isRegister
              ? 'Authorized health personnel account creation'
              : 'Sign in to access the AI-assisted verification queue'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600" htmlFor="official-email">
              Official Email
            </label>
            <input
              id="official-email"
              type="email"
              required
              autoComplete="email"
              placeholder="official@health.gov.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600" htmlFor="official-password">
              Password
            </label>
            <input
              id="official-password"
              type="password"
              required
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {isRegister && (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600" htmlFor="reg-code">
                Official Registration Code
              </label>
              <input
                id="reg-code"
                type="password"
                required
                placeholder="Institutional passkey"
                value={registrationCode}
                onChange={(e) => setRegistrationCode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="mt-1 text-xs text-slate-400">
                Gated registration code issued to authorized health units.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-50"
          >
            {submitting
              ? 'Processing...'
              : isRegister
              ? 'Register Official Account'
              : 'Log In'}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setSuccessMsg('');
            }}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            {isRegister
              ? 'Already registered? Sign in instead'
              : 'Need an account? Register with official code'}
          </button>
        </div>
      </div>
    </div>
  );
}
