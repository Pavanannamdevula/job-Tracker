const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Rejected", "Offer"],
      default: "Applied"
    },
    location: {
      type: String,
      trim: true
    },
    salary: {
      type: String,
      trim: true
    },
    jobType: {
      type: String,
      enum: ["Internship", "Full-Time", "Part-Time", "Remote"],
      default: "Internship"
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);