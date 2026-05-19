const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { searchLiveJobs } = require("../controllers/liveJobController");

router.get("/search", protect, searchLiveJobs);

module.exports = router;