const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../data/reportStore');

/**
 * GET /api/reports/analytics
 *
 * Returns two aggregations:
 *   - byDay:  [ { date: "YYYY-MM-DD", reportCount, totalCases } ]  last 30 days
 *   - byArea: [ { area: String, totalCases, reportCount } ]         top 10 areas
 */
router.get('/analytics', async (req, res) => {
  try {
    res.status(200).json(await getAnalytics());
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to load analytics.' });
  }
});

module.exports = router;
