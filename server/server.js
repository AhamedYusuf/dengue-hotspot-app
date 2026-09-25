const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
const { setMongoReady } = require('./data/reportStore');
require("dotenv").config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not permitted
}

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    setMongoReady(true);
    console.log('MongoDB connected');
  })
  .catch((err) => {
    setMongoReady(false);
    console.error('MongoDB connection error; using in-memory report store:', err.message);
  });

app.get('/api/health', (req, res) => {
  res.json({ ok: true, database: mongoose.connection.readyState === 1 ? 'mongodb' : 'memory' });
});

// Official Authentication Routes (/api/auth/register, /api/auth/login)
const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);

// GET /api/reports/analytics — mounted before report routes
const analyticsRoute = require('./routes/analytics');
app.use('/api/reports', analyticsRoute);

// Official Verification Queue & Review Routes (/api/reports/queue, /api/reports/:id/review)
const reportReviewRoute = require('./routes/reportReview');
app.use('/api/reports', reportReviewRoute);

// POST /api/reports — create a report
const createReportRoute = require('./routes/createReport');
app.use('/api/reports', createReportRoute);

// GET /api/reports?search=... — mounted BEFORE getReports so fallthrough works
const searchReportsRoute = require('./routes/searchReports');
app.use('/api/reports', searchReportsRoute);

// GET /api/reports — list all reports
const getReportsRoute = require('./routes/getReports');
app.use('/api/reports', getReportsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));