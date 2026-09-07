// server/routes/searchReports.js
// GET /api/reports — supports optional search + filter query params.
// Falls through to getReports when NO params are present.

const express = require('express');
const router = express.Router();
const { listReports } = require('../data/reportStore');

/**
 * Supported query params (all optional, all backward-compatible):
 *   ?search=<string>        case-insensitive partial match on area
 *   ?from=<YYYY-MM-DD>      reports on or after this date
 *   ?to=<YYYY-MM-DD>        reports on or before this date
 *   ?verified=true|false
 *   ?minCases=<number>
 */
router.get('/', async (req, res, next) => {
  try {
    const { search, from, to, verified, minCases } = req.query;

    // Only skip if ALL params are absent/empty
    const hasSearch   = typeof search   === 'string' && search.trim() !== '';
    const hasFrom     = typeof from     === 'string' && from.trim()   !== '';
    const hasTo       = typeof to       === 'string' && to.trim()     !== '';
    const hasVerified = verified === 'true' || verified === 'false';
    const hasMinCases = typeof minCases === 'string' && minCases.trim() !== '' && !isNaN(Number(minCases));

    const hasFilters = hasSearch || hasFrom || hasTo || hasVerified || hasMinCases;

    // No active filters → let getReports handle it (preserves original fallthrough)
    if (!hasFilters) {
      return next();
    }

    const reports = await listReports({
      search: hasSearch ? search.trim() : undefined,
      from: hasFrom ? from : undefined,
      to: hasTo ? to : undefined,
      verified: hasVerified ? verified === 'true' : undefined,
      minCases: hasMinCases ? Number(minCases) : undefined,
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error('Search/filter reports error:', error);
    res.status(500).json({ message: 'Unable to search or filter reports. Please try again.' });
  }
});

module.exports = router;