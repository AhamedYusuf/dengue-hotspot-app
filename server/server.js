const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { setMongoReady } = require('./data/reportStore');
require("dotenv").config();

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

// GET /api/reports/analytics — must come FIRST so "analytics" isn't
// swallowed by the /:id verifyReport router below.
const analyticsRoute = require('./routes/analytics');
app.use('/api/reports', analyticsRoute);

// POST /api/reports — create a report
const createReportRoute = require('./routes/createReport');
app.use('/api/reports', createReportRoute);

// GET /api/reports?search=... — must be mounted BEFORE getReports so its
// next() fallthrough reaches the plain GET handler below.
const searchReportsRoute = require('./routes/searchReports');
app.use('/api/reports', searchReportsRoute);

// GET /api/reports — list all reports
const getReportsRoute = require('./routes/getReports');
app.use('/api/reports', getReportsRoute);

// PUT /api/reports/:id — mark a report as verified
// verifyReport.js exports a plain handler function, so we wrap it in a router.
const { verifyReport } = require('./routes/verifyReport');
const verifyRouter = express.Router();
verifyRouter.put('/:id', verifyReport);
app.use('/api/reports', verifyRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));