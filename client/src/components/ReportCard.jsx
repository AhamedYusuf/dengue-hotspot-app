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

function StatusBadge({ status }) {
  const s = (status || 'pending').toLowerCase();
  if (s === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
        <svg className="h-3 w-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Verified
      </span>
    );
  }
  if (s === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
        <svg className="h-3 w-3 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
      <svg className="h-3 w-3 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      Pending
    </span>
  );
}

export default function ReportCard({ report }) {
  if (!report) return null;

  const currentStatus = report.status || (report.verified ? 'verified' : 'pending');
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

        {/* Status Badge */}
        <StatusBadge status={currentStatus} />
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

        {report.verifiedBy && (
          <span className="text-[11px] text-slate-400">
            Verified by: {report.verifiedBy}
          </span>
        )}
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
