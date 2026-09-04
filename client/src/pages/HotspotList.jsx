// client/src/pages/HotspotList.jsx
// P2 — fetches all reports and displays them as cards.
//
// Integration slots for teammates:
//   - P3: import SearchBar and drop it in where marked below. Simplest wiring
//     is to lift `reports` into state here and let SearchBar call setReports
//     with the filtered result from GET /api/reports?search=...
//   - P4: VerifyButton is rendered inside ReportCard.jsx (see that file).

import { useEffect, useState } from 'react';
import { getReports } from '../api/getReports';
import ReportCard from '../components/ReportCard';

// import SearchBar from '../components/SearchBar';

export default function HotspotList() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    getReports()
      .then((data) => {
        if (!isMounted) return;
        setReports(data);
        setStatus('ready');
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMessage(err.message);
        setStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Reported hotspots
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {status === 'ready' &&
            `${reports.length} report${reports.length === 1 ? '' : 's'} on record`}
        </p>
      </header>

      {/* P3: drop <SearchBar onResults={setReports} /> here */}

      {status === 'loading' && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-sm border border-slate-200 bg-slate-50"
            />
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Couldn't load reports: {errorMessage}. Check that the server is
          running and VITE_API_URL is set correctly.
        </div>
      )}

      {status === 'ready' && reports.length === 0 && (
        <div className="rounded-sm border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
          No reports yet. Once someone submits a report, it'll show up here.
        </div>
      )}

      {status === 'ready' && reports.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {reports.map((report) => (
            <ReportCard key={report._id} report={report} />
          ))}
        </div>
      )}
    </section>
  );
}