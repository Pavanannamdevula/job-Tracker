const axios = require("axios");

const searchLiveJobs = async (req, res) => {
  try {
    const { location = "", role = "", page = 1 } = req.query;

    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    if (!appId || !appKey) {
      return res.status(500).json({ message: "Adzuna API keys are missing" });
    }

    const url = `https://api.adzuna.com/v1/api/jobs/in/search/${page}`;

    const response = await axios.get(url, {
      params: {
        app_id: appId,
        app_key: appKey,
        what: role,
        where: location,
        results_per_page: 20,
        "content-type": "application/json"
      }
    });

    const jobs = (response.data.results || []).map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || "Unknown Company",
      location: job.location?.display_name || location,
      description: job.description || "",
      salaryMin: job.salary_min || null,
      salaryMax: job.salary_max || null,
      contractType: job.contract_type || "",
      contractTime: job.contract_time || "",
      applyUrl: job.redirect_url || ""
    }));

    res.status(200).json({
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch live jobs",
      error: error.response?.data || error.message
    });
  }
};

module.exports = { searchLiveJobs };