const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const liveJobRoutes = require("./routes/liveJobRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Job Tracker API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/live-jobs", liveJobRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message);
  });