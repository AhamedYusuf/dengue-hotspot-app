import { useState } from 'react';

const INPUT_BASE =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100';

const VERIFIED_OPTIONS = [
  { value: '',      label: 'All' },
  { value: 'true',  label: '✓ Verified only' },
  { value: 'false', label: '○ Unverified only' },
];

/**
 * FilterBar
 *
 * Props:
 *   onApply(filters)  — called with { from, to, verified, minCases }
 *   onReset()         — called when user clears all filters
 *   isFiltered        — boolean, shows "active" indicator on the toggle
 */
export default function FilterBar({ onApply, onReset, isFiltered }) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    from: '', to: '', verified: '', minCases: '',
  });

  function setField(field) {
    return (e) => setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleApply() {
    onApply(filters);
  }

  function handleReset() {
    const cleared = { from: '', to: '', verified: '', minCases: '' };
    setFilters(cleared);
    onReset();
  }

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="w-full">
      {/* Toggle row */}
      <button
        id="filter-toggle-btn"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        aria-expanded={open}
      >
        <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 10h10M11 16h2" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {activeCount}
          </span>
        )}
        <svg
          className={`ml-auto h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"
        >
          <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded panel */}
      {open && (
        <div className="mt-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-md">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* From date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="filter-from" className="text-xs font-semibold text-slate-600">From date</label>
              <input
                id="filter-from"
                type="date"
                value={filters.from}
                onChange={setField('from')}
                className={INPUT_BASE}
              />
            </div>

            {/* To date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="filter-to" className="text-xs font-semibold text-slate-600">To date</label>
              <input
                id="filter-to"
                type="date"
                value={filters.to}
                onChange={setField('to')}
                className={INPUT_BASE}
              />
            </div>

            {/* Verified toggle */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="filter-verified" className="text-xs font-semibold text-slate-600">Verification status</label>
              <select
                id="filter-verified"
                value={filters.verified}
                onChange={setField('verified')}
                className={INPUT_BASE}
              >
                {VERIFIED_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Min cases */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="filter-min-cases" className="text-xs font-semibold text-slate-600">Min. case count</label>
              <input
                id="filter-min-cases"
                type="number"
                min="1"
                placeholder="e.g. 10"
                value={filters.minCases}
                onChange={setField('minCases')}
                className={INPUT_BASE}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              id="filter-apply-btn"
              type="button"
              onClick={handleApply}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              Apply filters
            </button>
            {isFiltered && (
              <button
                id="filter-reset-btn"
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
