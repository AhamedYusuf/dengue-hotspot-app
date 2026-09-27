import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getQueue, reviewReport } from '../api/reportQueue';

function confidenceBadge(confidence) {
  const c = (confidence || '').toLowerCase();
  if (c === 'high') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        High Confidence
      </span>
    );
  }
  if (c === 'medium') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
        Medium Confidence
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
      <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
      Low Confidence
    </span>
  );
}

export default function ReportQueue() {
  const { token, email } = useAuth();
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState('loading');
  const [processingId, setProcessingId] = useState(null);
  const [actionError, setActionError] = useState('');

  const load = useCallback(async () => {
    setStatus('loading');
    setActionError('');
    try {
      const data = await getQueue(token);
      setReports(data);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }, [token]);

  useEffect(() => {
    let ignore = false;
    async function fetchInitial() {
      try {
        const data = await getQueue(token);
        if (!ignore) {
          setReports(data);
          setStatus('done');
        }
      } catch {
        if (!ignore) {
          setStatus('error');
        }
      }
    }
    fetchInitial();
    return () => {
      ignore = true;
    };
  }, [token]);

  async function handleReview(id, decision) {
    setProcessingId(id);
    setActionError('');
    try {
      await reviewReport(id, decision, token);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setActionError(err.message || `Failed to ${decision} report.`);
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Verification Queue</h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              Official Portal
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Review incoming dengue outbreak submissions with Gemini AI automated findings.
            Logged in as <span className="font-medium text-slate-700">{email}</span>.
          </p>
        </div>

        <button
          onClick={load}
          disabled={status === 'loading'}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          <svg
            className={`h-3.5 w-3.5 ${status === 'loading' ? 'animate-spin' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Queue
        </button>
      </div>

      {actionError && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {actionError}
        </div>
      )}

      {/* Loading state */}
      {status === 'loading' && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="h-5 w-1/3 rounded bg-slate-200 mb-4"></div>
              <div className="h-4 w-1/4 rounded bg-slate-100 mb-3"></div>
              <div className="h-16 w-full rounded bg-slate-100"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
          <p className="font-semibold">Unable to load verification queue</p>
          <p className="mt-1 text-xs text-rose-600">Please check your authentication token or connection.</p>
          <button
            onClick={load}
            className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {status === 'done' && reports.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
            ✅
          </div>
          <h3 className="text-base font-semibold text-slate-800">Queue is Clear</h3>
          <p className="mt-1 text-sm text-slate-500">
            All submitted outbreak reports have been reviewed and verified.
          </p>
        </div>
      )}

      {/* Queue items */}
      {status === 'done' && reports.length > 0 && (
        <div className="space-y-5">
          {reports.map((r) => {
            const isProcessing = processingId === r._id;
            return (
              <article
                key={r._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Main report details header */}
                <div className="border-b border-slate-100 p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900">{r.area}</h2>
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
                          Pending Decision
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        Submitted report date: {new Date(r.date).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' })}
                        {r.createdAt && ` • Submitted ${new Date(r.createdAt).toLocaleDateString()}`}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-100">
                      🦟 {r.caseCount} {r.caseCount === 1 ? 'case' : 'cases'}
                    </div>
                  </div>

                  {r.notes && (
                    <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
                      <span className="font-semibold text-slate-700">Citizen notes: </span>
                      {r.notes}
                    </div>
                  )}
                </div>

                {/* AI Assistant Investigation Box */}
                <div className="bg-slate-50/70 p-5 sm:p-6">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 text-xs font-bold text-indigo-700">
                        AI
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Gemini Investigation
                      </span>
                    </div>

                    {r.aiRecommendation && confidenceBadge(r.aiRecommendation.confidence)}
                  </div>

                  {r.aiRecommendation ? (
                    <div className="space-y-3">
                      {/* Flags */}
                      {r.aiRecommendation.flags && r.aiRecommendation.flags.length > 0 && (
                        <div>
                          <p className="mb-1 text-xs font-medium text-slate-500">Observed Signals:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {r.aiRecommendation.flags.map((flag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded-md bg-slate-200/80 px-2 py-0.5 text-xs text-slate-700"
                              >
                                🏷️ {flag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reasoning */}
                      <div>
                        <p className="mb-1 text-xs font-medium text-slate-500">Agent Reasoning:</p>
                        <p className="rounded-xl border border-slate-200/80 bg-white p-3.5 text-xs leading-relaxed text-slate-700 shadow-2xs">
                          {r.aiRecommendation.reasoning}
                        </p>
                      </div>

                      {r.aiRecommendation.generatedAt && (
                        <p className="text-[11px] text-slate-400">
                          Automated investigation timestamp: {new Date(r.aiRecommendation.generatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white/70 p-4">
                      <span className="inline-block h-2 w-2 animate-ping rounded-full bg-amber-400"></span>
                      <p className="text-xs text-slate-500 italic">
                        AI recommendation pending — the background agent will poll and investigate this report shortly.
                      </p>
                    </div>
                  )}
                </div>

                {/* Official action decision buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-6">
                  <span className="mr-auto text-xs text-slate-400">
                    Health Official Decision:
                  </span>

                  <button
                    onClick={() => handleReview(r._id, 'reject')}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                  >
                    ✕ Reject Report
                  </button>

                  <button
                    onClick={() => handleReview(r._id, 'approve')}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-50"
                  >
                    ✓ Approve & Verify
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
