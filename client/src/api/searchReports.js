const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

/**
 * GET /api/reports  (with optional filters)
 *
 * @param {string} searchTerm  - partial area name (existing behaviour)
 * @param {object} filters     - { from, to, verified, minCases } (new, all optional)
 * @param {AbortSignal} signal - for request cancellation
 */
export const searchReports = async (searchTerm = '', filters = {}, signal) => {
  const params = new URLSearchParams();

  const trimmed = searchTerm.trim();
  if (trimmed) params.set('search', trimmed);

  if (filters.from)                          params.set('from',     filters.from);
  if (filters.to)                            params.set('to',       filters.to);
  if (filters.verified !== undefined && filters.verified !== '')
                                             params.set('verified', filters.verified);
  if (filters.minCases && Number(filters.minCases) > 0)
                                             params.set('minCases', filters.minCases);

  const url = `${API_URL}/api/reports?${params.toString()}`;

  const response = await fetch(url, { signal });

  if (!response.ok) throw new Error('Failed to search reports');

  return response.json();
};