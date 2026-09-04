import { useEffect, useState } from "react";
import { searchReports } from "../api/searchReports";

const SearchBar = ({
  onResults,
  onClear,
  onLoadingChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // If search box becomes empty,
    // restore the full report list.
    if (!searchTerm.trim()) {
      setError("");

      if (onClear) {
        onClear();
      }

      return;
    }

    // Abort old requests if the user types again.
    const controller = new AbortController();

    // Debounce API request by 400ms.
    const timer = setTimeout(async () => {
      try {
        setError("");

        if (onLoadingChange) {
          onLoadingChange(true);
        }

        const results = await searchReports(
          searchTerm,
          controller.signal
        );

        if (onResults) {
          onResults(results);
        }
      } catch (err) {
        // Ignore errors caused by aborting an old request.
        if (err.name !== "AbortError") {
          console.error(err);

          setError(
            "Unable to search reports. Please try again."
          );
        }
      } finally {
        if (onLoadingChange) {
          onLoadingChange(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    searchTerm,
    onResults,
    onClear,
    onLoadingChange,
  ]);

  const handleClear = () => {
    setSearchTerm("");
    setError("");

    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by area e.g. Colombo"
          aria-label="Search dengue reports by area"
          className="
            w-full
            rounded-lg
            border
            border-gray-300
            bg-white
            px-4
            py-3
            pr-20
            text-gray-900
            outline-none
            transition
            focus:border-red-500
            focus:ring-2
            focus:ring-red-200
          "
        />

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              rounded-md
              px-3
              py-1
              text-sm
              text-gray-600
              hover:bg-gray-100
            "
          >
            Clear
          </button>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Search reported dengue hotspots by area.
      </p>

      {error && (
        <p
          className="mt-2 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default SearchBar;