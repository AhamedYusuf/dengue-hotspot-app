const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { requireOfficial } = require('../middleware/authMiddleware');

// GET /api/reports/queue — pending reports for officials to review
router.get('/queue', requireOfficial, async (req, res) => {
  try {
    const pending = await Report.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(pending);
  } catch (err) {
    console.error('Failed to load queue:', err);
    res.status(500).json({ error: 'Failed to fetch verification queue.' });
  }
});

// PUT /api/reports/:id/review — approve or reject
router.put('/:id/review', requireOfficial, async (req, res) => {
  try {
    const { decision } = req.body; // 'approve' | 'reject'
    if (!['approve', 'reject'].includes(decision)) {
      return res.status(400).json({ error: 'decision must be "approve" or "reject".' });
    }
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found.' });

    report.status = decision === 'approve' ? 'verified' : 'rejected';
    report.verifiedBy = req.user.email;
    report.verifiedAt = new Date();
    await report.save();

    res.json(report);
  } catch (err) {
    console.error('Failed to review report:', err);
    res.status(500).json({ error: 'Failed to update report.' });
  }
});

module.exports = router;
