const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { verifyReport } = require("./routes/verifyReport");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- P1's line ---
const createReportRoute = require('./routes/createReport');
app.use('/api/reports', createReportRoute);

// --- P2's line ---
const getReportsRoute = require('./routes/getReports');
app.use('/api/reports', getReportsRoute);

// --- teammates add their own app.use('/api/reports', ...) lines here too ---

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));