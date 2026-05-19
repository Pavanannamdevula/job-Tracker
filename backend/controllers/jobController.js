const mongoose = require("mongoose");
const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const {
      company,
      role,
      status,
      location,
      salary,
      jobType,
      appliedDate,
      notes
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" });
    }

    const job = await Job.create({
      user: req.user._id,
      company,
      role,
      status,
      location,
      salary,
      jobType,
      appliedDate,
      notes
    });

    res.status(201).json({
      message: "Job created successfully",
      job
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } }
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findOne({
      _id: id,
      user: req.user._id
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findOne({
      _id: id,
      user: req.user._id
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updatedJob = await Job.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findOne({
      _id: id,
      user: req.user._id
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id)
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      Applied: 0,
      Interview: 0,
      Rejected: 0,
      Offer: 0
    };

    stats.forEach((item) => {
      result[item._id] = item.count;
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getStats
};