// server/routes/getReports.js
// GET /api/reports: returns all reports, newest first.

const express = require('express');
const router = express.Router();
const { listReports } = require('../data/reportStore');

// GET /api/reports
router.get('/', async (req, res) => {
  try {
    const reports = await listReports();
    res.status(200).json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err.message);
    res.status(500).json({ error: 'Failed to fetch reports. Please try again.' });
  }
});

module.exports = router;
