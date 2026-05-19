const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getStats
} = require("../controllers/jobController");

router.post("/", protect, createJob);
router.get("/", protect, getJobs);
router.get("/stats", protect, getStats);
router.get("/:id", protect, getJobById);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;