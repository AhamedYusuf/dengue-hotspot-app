const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

router.post('/', async (req, res) => {
  try {
    const { area, date, caseCount, notes } = req.body;

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

    const report = new Report({
      area: area.trim(),
      date,
      caseCount: Number(caseCount),
      notes: notes || '',
      verified: false,
    });

    const saved = await report.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while saving report.' });
  }
});

module.exports = router;