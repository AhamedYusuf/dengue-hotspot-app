import VerifyButton from './VerifyButton';

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Intl.DateTimeFormat('en-LK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default function ReportCard({ report, onReportUpdate }) {
  if (!report) return null;

  const handleVerified = (updatedReport) => {
    if (typeof onReportUpdate === 'function') onReportUpdate(updatedReport);
  };

  const formattedDate = formatDate(report.date);

  return (
    <article className="animate-fade-in-up group flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">

      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Area */}
          <h3 className="truncate text-base font-semibold text-slate-800">
            {report.area || 'Unknown area'}
          </h3>
          {/* Date */}
          {formattedDate && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              {formattedDate}
            </p>
          )}
        </div>

        {/* Verify */}
        <VerifyButton
          reportId={report._id || report.id}
          verified={Boolean(report.verified)}
          onVerified={handleVerified}
        />
      </div>

      {/* Case count badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-100">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          {report.caseCount ?? 0} {report.caseCount === 1 ? 'case' : 'cases'}
        </span>
      </div>

      {/* Notes */}
      {report.notes && (
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-500">
          {report.notes}
        </p>
      )}
    </article>
  );
}
