const mongoose = require("mongoose");
const Report = require("../models/Report");

async function verifyReport(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid report ID" });
        }

        const report = await Report.findById(id);

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        report.verified = true;
        const updatedReport = await report.save();

        return res.status(200).json(updatedReport);
    } catch (error) {
        console.error("Verify report error:", error);
        return res.status(500).json({ message: "Server error while verifying report" });
    }
}

module.exports = { verifyReport };