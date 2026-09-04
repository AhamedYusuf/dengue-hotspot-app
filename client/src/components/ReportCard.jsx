// client/src/components/ReportCard.jsx
// P2 — one report, rendered as a row/card.
// Severity accent (left border) is driven by caseCount, not decoration —
// it's the fastest way for a reader to scan for hotspots that need attention.
//
// NOTE for P4: there's a marked slot below for your <VerifyButton /> —
// import it and drop it in where indicated. It's commented out for now
// so this renders cleanly before your branch is merged.

// import VerifyButton from './VerifyButton';

function severityLevel(caseCount) {
  if (caseCount >= 15) return 'high';
  if (caseCount >= 7) return 'medium';
  return 'low';
}

const accentClasses = {
  high: 'border-l-red-600',
  medium: 'border-l-amber-500',
  low: 'border-l-emerald-600',
};

const dotClasses = {
  high: 'bg-red-600',
  medium: 'bg-amber-500',
  low: 'bg-emerald-600',
};

const severityLabel = {
  high: 'High',
  medium: 'Watch',
  low: 'Low',
};

export default function ReportCard({ report }) {
  const { area, date, caseCount, notes, verified } = report;
  const severity = severityLevel(caseCount);

  const formattedDate = new Date(date).toLocaleDateString('en-LK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article
      className={`flex flex-col gap-2 rounded-sm border border-slate-200 border-l-4 ${accentClasses[severity]} bg-white p-4 sm:p-5`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
            {area}
          </h3>
          <p className="text-sm text-slate-500">{formattedDate}</p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-2xl font-semibold tabular-nums text-slate-900 sm:text-3xl">
            {caseCount}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className={`h-1.5 w-1.5 rounded-full ${dotClasses[severity]}`} />
            {severityLabel[severity]} · cases
          </span>
        </div>
      </div>

      {notes && (
        <p className="text-sm leading-relaxed text-slate-600">{notes}</p>
      )}

      <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-3">
        <span
          className={`text-xs font-medium ${
            verified ? 'text-emerald-700' : 'text-slate-400'
          }`}
        >
          {verified ? 'Verified by health authority' : 'Pending verification'}
        </span>

        {/* P4: drop your button here, e.g. <VerifyButton report={report} /> */}
      </div>
    </article>
  );
}