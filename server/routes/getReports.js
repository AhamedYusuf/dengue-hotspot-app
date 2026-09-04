// server/routes/getReports.js
// P2 — GET /api/reports: returns all reports, newest first.

const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// GET /api/reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ date: -1 }) // most recent report date first
      .select('area date caseCount notes verified createdAt');

    res.status(200).json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err.message);
    res.status(500).json({ error: 'Failed to fetch reports. Please try again.' });
  }
});

module.exports = router;
