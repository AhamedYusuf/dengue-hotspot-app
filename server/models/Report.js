const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        location: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        reportedBy: {
            type: String,
            required: true,
            trim: true
        },

        verified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Report", reportSchema);