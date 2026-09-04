// server/models/Report.js
// This is the SHARED schema — your team already agreed on this shape.
// If your friend's dev branch brings its own copy of this file, use theirs
// and delete this one; it's here so you can run/test your route standalone.

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  area: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  caseCount: {
    type: Number,
    required: true,
    min: 0,
  },
  notes: {
    type: String,
    default: '',
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false }, // gives us createdAt automatically
});

module.exports = mongoose.model('Report', reportSchema);