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

/*
Mount this in server.js like:

  const getReportsRoute = require('./routes/getReports');
  app.use('/api/reports', getReportsRoute);

Note: P3's search route (GET /api/reports?search=...) hits the SAME base path.
Easiest way to avoid a collision when merging: have this route check
req.query.search and, if it's present, delegate/filter — or just make sure
whoever mounts routes last checks both are wired against '/api/reports'
without double-registering the path. Flag this in your Polish-phase merge.
*/