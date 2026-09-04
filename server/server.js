const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Root route
app.get("/", (req, res) => {
  res.send("Dengue Hotspot API is running");
});

// POST /api/reports — create a report
const createReportRoute = require("./routes/createReport");
app.use("/api/reports", createReportRoute);

// GET /api/reports?search=...
const searchReportsRoute = require("./routes/searchReports");
app.use("/api/reports", searchReportsRoute);

// GET /api/reports — list all reports
const getReportsRoute = require("./routes/getReports");
app.use("/api/reports", getReportsRoute);

// PUT /api/reports/:id — verify report
const { verifyReport } = require("./routes/verifyReport");
const verifyRouter = express.Router();

verifyRouter.put("/:id", verifyReport);
app.use("/api/reports", verifyRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});