const express = require("express");
const router = express.Router();

const Report = require("../models/Report");

// GET /api/reports?search=Colombo
router.get("/", async (req, res, next) => {
  try {
    const search = req.query.search?.trim();

    // If there is no search query,
    // let P2's normal GET /api/reports route handle it.
    if (!search) {
      return next();
    }

    const reports = await Report.find({
      area: {
        $regex: search,
        $options: "i",
      },
    }).sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Search reports error:", error);

    res.status(500).json({
      message: "Unable to search reports. Please try again.",
    });
  }
});

module.exports = router;