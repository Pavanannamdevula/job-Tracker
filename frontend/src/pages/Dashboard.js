import React, { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [liveJobs, setLiveJobs] = useState([]);
  const [loadingLiveJobs, setLoadingLiveJobs] = useState(false);

  const [stats, setStats] = useState({
    Applied: 0,
    Interview: 0,
    Rejected: 0,
    Offer: 0
  });

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobRole, setSelectedJobRole] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableCompanies, setAvailableCompanies] = useState([]);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    location: "",
    salary: "",
    jobType: "Internship",
    notes: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const indiaLocations = [
    "Hyderabad",
    "Bangalore",
    "Chennai",
    "Pune",
    "Mumbai",
    "Delhi",
    "Noida",
    "Gurgaon",
    "Kolkata",
    "Ahmedabad",
    "Visakhapatnam",
    "Rajahmundry"
  ];

  const jobsByLocation = {
    Hyderabad: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "UI/UX Designer",
      "QA Engineer",
      "DevOps Engineer",
      "Data Analyst",
      "Mobile App Developer",
      "Cloud Engineer"
    ],
    Bangalore: [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "Data Scientist",
      "DevOps Engineer",
      "AI Engineer",
      "Machine Learning Engineer",
      "Full Stack Developer"
    ],
    Chennai: [
      "Java Developer",
      "Frontend Developer",
      "Testing Engineer",
      "Support Engineer",
      "Backend Developer",
      "React Developer"
    ],
    Pune: [
      "Full Stack Developer",
      "React Developer",
      "Node.js Developer",
      "QA Tester",
      "Backend Developer",
      "Angular Developer"
    ],
    Mumbai: [
      "Web Developer",
      "Business Analyst",
      "Frontend Developer",
      "Project Manager",
      "Backend Developer",
      "UI Designer"
    ],
    Delhi: [
      "Backend Developer",
      "Software Engineer",
      "MERN Developer",
      "Tech Support",
      "Frontend Developer",
      "QA Engineer"
    ],
    Noida: [
      "Frontend Developer",
      "Full Stack Developer",
      "QA Engineer",
      "Angular Developer",
      "Backend Developer"
    ],
    Gurgaon: [
      "React Developer",
      "Node.js Developer",
      "Software Engineer",
      "UI Developer",
      "Backend Developer"
    ],
    Kolkata: [
      "Java Developer",
      "Testing Engineer",
      "Support Engineer",
      "Backend Developer",
      "Frontend Developer"
    ],
    Ahmedabad: [
      "MERN Developer",
      "Web Developer",
      "Frontend Developer",
      "PHP Developer",
      "Backend Developer"
    ],
    Visakhapatnam: [
      "Frontend Developer",
      "Backend Developer",
      "Java Developer",
      "Support Engineer",
      "QA Engineer"
    ],
    Rajahmundry: [
      "Web Developer",
      "Frontend Developer",
      "Technical Support",
      "Junior Developer",
      "Backend Developer"
    ]
  };

  const companiesByLocationAndRole = {
    Hyderabad: {
      "Frontend Developer": ["TCS", "Infosys", "Wipro", "Accenture", "Deloitte"],
      "Backend Developer": ["Tech Mahindra", "Cognizant", "Capgemini"],
      "Full Stack Developer": ["HCL", "Mindtree", "Infosys"],
      "UI/UX Designer": ["Infosys", "Accenture", "Deloitte"],
      "QA Engineer": ["Wipro", "Cognizant", "Capgemini"],
      "DevOps Engineer": ["Amazon", "Google", "Microsoft"],
      "Data Analyst": ["Deloitte", "PwC", "EY"],
      "Mobile App Developer": ["Flipkart", "Swiggy", "PhonePe"],
      "Cloud Engineer": ["AWS", "Oracle", "IBM"]
    },
    Bangalore: {
      "Software Engineer": ["Google", "Microsoft", "Infosys", "TCS"],
      "Frontend Developer": ["Flipkart", "Swiggy", "Razorpay"],
      "Backend Developer": ["Amazon", "SAP", "Zoho"],
      "Data Scientist": ["Amazon", "PhonePe", "Meesho"],
      "DevOps Engineer": ["Oracle", "IBM", "Cisco"],
      "AI Engineer": ["Google", "IBM", "Microsoft"],
      "Machine Learning Engineer": ["Meta", "Amazon", "Google"],
      "Full Stack Developer": ["TCS", "Infosys", "Wipro"]
    },
    Chennai: {
      "Java Developer": ["Zoho", "TCS", "Infosys"],
      "Frontend Developer": ["Cognizant", "Wipro", "Accenture"],
      "Testing Engineer": ["Capgemini", "HCL", "Wipro"],
      "Support Engineer": ["Tech Mahindra", "Accenture", "Infosys"],
      "Backend Developer": ["Capgemini", "HCL", "Zoho"],
      "React Developer": ["Zoho", "Freshworks", "Cognizant"]
    },
    Pune: {
      "Full Stack Developer": ["TCS", "Infosys", "Cognizant"],
      "React Developer": ["Persistent", "Capgemini", "Infosys"],
      "Node.js Developer": ["Wipro", "HCL", "TCS"],
      "QA Tester": ["Accenture", "Tech Mahindra", "Capgemini"],
      "Backend Developer": ["Infosys", "TCS", "Cognizant"],
      "Angular Developer": ["Cognizant", "Capgemini", "Wipro"]
    },
    Mumbai: {
      "Web Developer": ["L&T", "TCS", "Infosys"],
      "Business Analyst": ["Deloitte", "EY", "KPMG"],
      "Frontend Developer": ["Accenture", "Capgemini", "Wipro"],
      "Project Manager": ["Infosys", "TCS", "Cognizant"],
      "Backend Developer": ["Wipro", "Cognizant", "Tech Mahindra"],
      "UI Designer": ["Accenture", "Cognizant", "Infosys"]
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Applied":
        return "status-badge applied";
      case "Interview":
        return "status-badge interview";
      case "Rejected":
        return "status-badge rejected";
      case "Offer":
        return "status-badge offer";
      default:
        return "status-badge";
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/jobs/stats");
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLiveJobs = async (location, role) => {
    if (!location || !role) {
      setLiveJobs([]);
      return;
    }

    try {
      setLoadingLiveJobs(true);
      const res = await API.get(
        `/live-jobs/search?location=${encodeURIComponent(location)}&role=${encodeURIComponent(role)}`
      );
      setLiveJobs(res.data.jobs || []);
    } catch (error) {
      console.log(error);
      setLiveJobs([]);
    } finally {
      setLoadingLiveJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setAvailableRoles(jobsByLocation[selectedLocation] || []);
      setSelectedJobRole("");
      setSelectedCompany("");
      setAvailableCompanies([]);
      setLiveJobs([]);
    } else {
      setAvailableRoles([]);
      setSelectedJobRole("");
      setSelectedCompany("");
      setAvailableCompanies([]);
      setLiveJobs([]);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedLocation && selectedJobRole) {
      const companies =
        companiesByLocationAndRole[selectedLocation]?.[selectedJobRole] || [];
      setAvailableCompanies(companies);
      setSelectedCompany("");
      fetchLiveJobs(selectedLocation, selectedJobRole);
    } else {
      setAvailableCompanies([]);
      setSelectedCompany("");
      setLiveJobs([]);
    }
  }, [selectedLocation, selectedJobRole]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await API.post("/jobs", formData);
      setFormData({
        company: "",
        role: "",
        status: "Applied",
        location: "",
        salary: "",
        jobType: "Internship",
        notes: ""
      });
      fetchJobs();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add job");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/jobs/${id}`);
      fetchJobs();
      fetchStats();
    } catch (error) {
      alert("Failed to delete job");
    }
  };

  const handleQuickApply = (job) => {
    if (job.applyUrl) {
      window.open(job.applyUrl, "_blank");
    } else {
      alert("Apply link not available");
    }
  };

  const handleSaveLiveJob = async (job) => {
    try {
      await API.post("/jobs", {
        company: job.company,
        role: job.title,
        status: "Applied",
        location: job.location,
        salary:
          job.salaryMin && job.salaryMax
            ? `${job.salaryMin} - ${job.salaryMax}`
            : "",
        jobType: job.contractTime || "Internship",
        notes: "Saved from live jobs section"
      });

      fetchJobs();
      fetchStats();
      alert("Job saved to tracker");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save job");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const filteredSavedJobs = jobs.filter(
    (job) =>
      (!selectedLocation || job.location?.includes(selectedLocation)) &&
      (!selectedCompany || job.company === selectedCompany)
  );

  const filteredLiveJobs = liveJobs.filter(
    (job) => !selectedCompany || job.company === selectedCompany
  );

  return (
    <div className="dashboard-container">
      <div className="top-bar">
        <div>
          <h1>Job Tracker Dashboard</h1>
          <p className="top-subtitle">
            Welcome back{user?.name ? `, ${user.name}` : ""}. Manage your saved jobs and explore live opportunities.
          </p>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="stats-container">
        <div className="stat-card">Applied: {stats.Applied}</div>
        <div className="stat-card">Interview: {stats.Interview}</div>
        <div className="stat-card">Rejected: {stats.Rejected}</div>
        <div className="stat-card">Offer: {stats.Offer}</div>
      </div>

      <form className="job-form" onSubmit={handleAddJob}>
        <input
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          required
        />

        <input
          name="role"
          placeholder="Role"
          value={formData.role}
          onChange={handleChange}
          required
        />

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
        </select>

        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />

        <input
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
        />

        <select name="jobType" value={formData.jobType} onChange={handleChange}>
          <option value="Internship">Internship</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Remote">Remote</option>
        </select>

        <textarea
          name="notes"
          placeholder="Write notes about this job"
          value={formData.notes}
          onChange={handleChange}
        />

        <button type="submit">Add Job</button>
      </form>

      <div className="filter-box">
        <h2>Explore Live Jobs</h2>

        <div className="filter-row">
          <div>
            <label><strong>Select Location:</strong></label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {indiaLocations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label><strong>Select Job Role:</strong></label>
            <select
              value={selectedJobRole}
              onChange={(e) => setSelectedJobRole(e.target.value)}
              disabled={!selectedLocation}
            >
              <option value="">All Job Roles</option>
              {availableRoles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label><strong>Select Company:</strong></label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              disabled={!selectedJobRole}
            >
              <option value="">All Companies</option>
              {availableCompanies.map((company, index) => (
                <option key={index} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="job-list">
        <h2>Live Jobs</h2>
        {loadingLiveJobs ? (
          <p>Loading live jobs...</p>
        ) : filteredLiveJobs.length === 0 ? (
          <p>Select a location and role to explore live job openings.</p>
        ) : (
          filteredLiveJobs.map((job) => (
            <div className="job-card" key={job.id}>
              <h3>{job.title}</h3>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p>
                <strong>Salary:</strong>{" "}
                {job.salaryMin && job.salaryMax
                  ? `${job.salaryMin} - ${job.salaryMax}`
                  : "Not disclosed"}
              </p>
              <p><strong>Type:</strong> {job.contractType || "Not specified"}</p>

              <div className="job-notes">
                <strong>Description:</strong>
                <p>{job.description || "No description available"}</p>
              </div>

              <div className="action-row">
                <button onClick={() => handleQuickApply(job)}>Apply Now</button>
                <button onClick={() => handleSaveLiveJob(job)}>Save to Tracker</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="job-list">
        <h2>Your Saved Jobs</h2>
        {filteredSavedJobs.length === 0 ? (
          <p>No saved jobs found.</p>
        ) : (
          filteredSavedJobs.map((job) => (
            <div className="job-card" key={job._id}>
              <h3>{job.company}</h3>
              <p><strong>Role:</strong> {job.role}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={getStatusClass(job.status)}>{job.status}</span>
              </p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salary || "Not specified"}</p>
              <p><strong>Type:</strong> {job.jobType}</p>

              <div className="job-notes">
                <strong>Notes:</strong>
                <p>{job.notes || "No notes added"}</p>
              </div>

              <div className="action-row">
                <button onClick={() => handleDelete(job._id)}>Delete Job</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;