const express = require('express');
const router = express.Router();
const { createReport: saveReport } = require('../data/reportStore');

router.post('/', async (req, res) => {
  try {
    const { area, date, caseCount, notes, latitude, longitude } = req.body;

    // ── Required field validation ──────────────────────────────
    if (!area || typeof area !== 'string' || !area.trim()) {
      return res.status(400).json({ error: 'Area is required.' });
    }
    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({ error: 'A valid date is required.' });
    }
    if (new Date(date) > new Date()) {
      return res.status(400).json({ error: 'Date cannot be in the future.' });
    }
    if (caseCount === undefined || isNaN(caseCount) || Number(caseCount) <= 0) {
      return res.status(400).json({ error: 'Case count must be a positive number.' });
    }

    // ── Optional lat/lng validation ────────────────────────────
    let lat = null;
    let lng = null;
    if (latitude !== undefined && latitude !== null && latitude !== '') {
      lat = Number(latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({ error: 'Latitude must be between -90 and 90.' });
      }
    }
    if (longitude !== undefined && longitude !== null && longitude !== '') {
      lng = Number(longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        return res.status(400).json({ error: 'Longitude must be between -180 and 180.' });
      }
    }

    const report = {
      area: area.trim(),
      date,
      caseCount: Number(caseCount),
      notes: notes || '',
      verified: false,
      latitude: lat,
      longitude: lng,
    };

    const saved = await saveReport(report);
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while saving report.' });
  }
});

module.exports = router;