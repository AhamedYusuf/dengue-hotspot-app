const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { verifyReport } = require("./routes/verifyReport");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Dengue Hotspot API is running"
    });
});

app.put("/api/reports/:id", verifyReport);

const startServer = () => {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

if (process.env.MONGO_URI) {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("MongoDB connected successfully");
            startServer();
        })
        .catch((error) => {
            console.error("MongoDB connection error:", error);
            startServer();
        });
} else {
    console.warn("MONGO_URI not set. Starting server without MongoDB connection.");
    startServer();
}