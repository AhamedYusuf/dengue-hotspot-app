import { useEffect, useState } from 'react';
import { searchReports } from '../api/searchReports';

export default function SearchBar({ onResults, onClear, onLoadingChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError]           = useState('');

  useEffect(() => {
    if (!searchTerm.trim()) {
      setError('');
      if (onClear) onClear();
      return;
    }

    const controller = new AbortController();

    // Debounce: 400 ms
    const timer = setTimeout(async () => {
      try {
        setError('');
        if (onLoadingChange) onLoadingChange(true);

        const results = await searchReports(searchTerm, controller.signal);
        if (onResults) onResults(results);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setError('Unable to search reports. Please try again.');
        }
      } finally {
        if (onLoadingChange) onLoadingChange(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm, onResults, onClear, onLoadingChange]);

  const handleClear = () => {
    setSearchTerm('');
    setError('');
    if (onClear) onClear();
  };

  return (
    <div className="w-full">
      <div className="relative">
        {/* Search icon */}
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400" aria-hidden="true">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
        </span>

        <input
          id="search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by area — e.g. Colombo, Nugegoda…"
          aria-label="Search dengue reports by area"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-24 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />

        {searchTerm && (
          <button
            type="button"
            id="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute inset-y-0 right-3 my-auto flex h-7 items-center gap-1 rounded-lg px-2.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
}