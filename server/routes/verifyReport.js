const mongoose = require("mongoose");
const { verifyReport: updateReport } = require('../data/reportStore');

async function verifyReport(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid report ID" });
        }

        const report = await updateReport(id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        return res.status(200).json(report);
    } catch (error) {
        console.error("Verify report error:", error);
        return res.status(500).json({ message: "Server error while verifying report" });
    }
}

module.exports = { verifyReport };