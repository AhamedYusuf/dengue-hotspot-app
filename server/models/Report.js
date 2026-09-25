const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  area: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  caseCount: { type: Number, required: true, min: 0 },
  notes: { type: String, default: '' },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  aiRecommendation: {
    confidence: { type: String, enum: ['low', 'medium', 'high'] },
    flags: [{ type: String }],
    reasoning: { type: String },
    generatedAt: { type: Date },
  },
  verifiedBy: { type: String },
  verifiedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Backward compatibility: any code reading report.verified still works
ReportSchema.virtual('verified').get(function () {
  return this.status === 'verified';
});
ReportSchema.set('toJSON', { virtuals: true });
ReportSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Report', ReportSchema);