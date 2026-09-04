import { useState } from 'react';
import verifyReport from '../api/verifyReport';

export default function VerifyButton({ reportId, verified, onVerified }) {
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState('');
  const [isVerified, setIsVerified] = useState(Boolean(verified));

  const alreadyVerified = isVerified || Boolean(verified);

  const handleVerify = async () => {
    if (!reportId || isLoading || alreadyVerified) return;

    setIsLoading(true);
    setError('');

    try {
      const updatedReport = await verifyReport(reportId);
      setIsVerified(true);
      if (typeof onVerified === 'function') onVerified(updatedReport);
    } catch (requestError) {
      setError(requestError?.message || 'Unable to verify this report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (alreadyVerified) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
        aria-live="polite"
      >
        {/* checkmark */}
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Verified
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        id={`verify-btn-${reportId}`}
        type="button"
        onClick={handleVerify}
        disabled={isLoading || !reportId}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-400 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        aria-live="polite"
      >
        {isLoading ? (
          <>
            {/* spinner */}
            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
            Verifying…
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Verify
          </>
        )}
      </button>

      {error && (
        <p className="text-right text-xs text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
}