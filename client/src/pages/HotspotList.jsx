import { useCallback, useEffect, useState } from 'react';
import { getReports } from '../api/getReports';
import ReportCard from '../components/ReportCard';
import SearchBar from '../components/SearchBar';

const SKELETON_COUNT = 6;

export default function HotspotList() {
  const [allReports, setAllReports]   = useState([]);
  const [reports, setReports]         = useState([]);
  const [status, setStatus]           = useState('loading'); // 'loading' | 'ready' | 'error'
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFiltered, setIsFiltered]   = useState(false);

  // Initial fetch
  useEffect(() => {
    let isMounted = true;

    getReports()
      .then((data) => {
        if (!isMounted) return;
        setAllReports(data);
        setReports(data);
        setStatus('ready');
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMessage(err.message);
        setStatus('error');
      });

    return () => { isMounted = false; };
  }, []);

  // SearchBar callbacks (stable refs to avoid re-triggering the debounce effect)
  const handleResults = useCallback((results) => {
    setReports(results);
    setIsFiltered(true);
  }, []);

  const handleClear = useCallback(() => {
    setReports(allReports);
    setIsFiltered(false);
  }, [allReports]);

  const handleLoadingChange = useCallback((loading) => {
    setIsSearching(loading);
  }, []);

  // Keep a card's verified state in sync without re-fetching everything
  const handleReportUpdate = useCallback((updatedReport) => {
    const merge = (list) =>
      list.map((r) =>
        (r._id || r.id) === (updatedReport._id || updatedReport.id)
          ? { ...r, ...updatedReport }
          : r
      );
    setAllReports((prev) => merge(prev));
    setReports((prev) => merge(prev));
  }, []);

  const isLoading = status === 'loading' || isSearching;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">

      {/* Page header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Dengue Hotspots
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {status === 'ready' && !isSearching && (
            isFiltered
              ? `${reports.length} result${reports.length === 1 ? '' : 's'} found`
              : `${reports.length} report${reports.length === 1 ? '' : 's'} on record`
          )}
          {isSearching && 'Searching…'}
        </p>
      </header>

      {/* Search */}
      <div className="mb-8">
        <SearchBar
          onResults={handleResults}
          onClear={handleClear}
          onLoadingChange={handleLoadingChange}
        />
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(SKELETON_COUNT)].map((_, i) => (
            <div key={i} className="skeleton h-36 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <span className="text-3xl" aria-hidden="true">⚠️</span>
          <p className="font-semibold text-red-700">Couldn't load reports</p>
          <p className="text-sm text-red-500">
            {errorMessage} — make sure the server is running and{' '}
            <code className="rounded bg-red-100 px-1 py-0.5 text-xs">VITE_API_URL</code>{' '}
            is set correctly.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && status === 'ready' && reports.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <span className="text-4xl" aria-hidden="true">
            {isFiltered ? '🔍' : '📭'}
          </span>
          <p className="font-semibold text-slate-700">
            {isFiltered ? 'No results for that area' : 'No reports yet'}
          </p>
          <p className="text-sm text-slate-400">
            {isFiltered
              ? 'Try a different search term or clear the filter.'
              : 'Be the first to submit a dengue hotspot report.'}
          </p>
        </div>
      )}

      {/* Report cards */}
      {!isLoading && status === 'ready' && reports.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <ReportCard
              key={report._id || report.id}
              report={report}
              onReportUpdate={handleReportUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}