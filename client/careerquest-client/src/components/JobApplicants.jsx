import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './Dashboard.module.css'; // Import CSS module

const branchOptions = [
  { value: 3, label: 'Computer Science Engineering' },
  { value: 1, label: 'Electronics and Communication Engineering' },
  { value: 7, label: 'Mechanical Engineering' },
  { value: 9, label: 'Civil Engineering' },
  { value: 2, label: 'Electrical and Electronics Engineering' },
  { value: 5, label: 'Biotechnology Engineering' },
  { value: 4, label: 'Chemical Engineering' },
  { value: 8, label: 'Maths and Computing' },
  { value: 6, label: 'MME' },
];

const Jobapplicants = () => {
    const backend_url = "http://127.0.0.1:8000/api";
    const location = useLocation();
    const navigate = useNavigate();
    const { jobId } = useParams(); // Assuming jobId is passed via route params
    const [applicants, setApplicants] = useState([]);
    const [jobTitle, setJobTitle] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate("/Login");
    };

    const getBranchName = (branchId) => {
      const branch = branchOptions.find(option => option.value === branchId);
      return branch ? branch.label : "Unknown Branch";
    };

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(`${backend_url}/jobs/${jobId}/applicants/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (response.status === 401) {
          alert('Session timed out. Please log in again.'); // Popup alert
          handleLogout();
          return; }
        if (response.ok) {
          const data = await response.json();
          setApplicants(data);
        } else {
          console.error('Failed to fetch applicants');
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };

  

    fetchApplicants();
  }, [jobId]); // State to hold the job title

  // Fetch job details to get the title
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${backend_url}/jobs/${jobId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setJobTitle(data.title); // Set job title in state
        } else {
          console.error("Failed to fetch job details");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    fetchJobDetails();
  }, [jobId]);

    return (
        <div className={styles.dashboardContainer}>
            <nav className={styles.navbar}>
                <h1 className={styles.navbarTitle}>CareerQuest  Admin Portal</h1>
            </nav>

            <div className={styles.mainContent}>
                <aside className={styles.sidebar}>
                    <ul>
                        <li className={location.pathname === '/createjob' ? styles.active : ''}>
                            <Link to="/createjob">Create Job</Link>
                        </li>
                        <li className={location.pathname === '/adminProfile' ? styles.active : ''}>
                            <Link to="/adminProfile">Profile</Link>
                        </li>
                        <li className={location.pathname === '/managejobs' ? styles.active : ''}>
                            <Link to="/managejobs">Manage Jobs</Link>
                        </li>
                        <li>
                        <button onClick={handleLogout} className={styles.logoutButton}>
                        Logout
                        </button>
                        </li>
                    </ul>
                </aside>
                <section className={styles.dashboardContent}>
                <div className={styles.dashboardContainer}>
                <h1 className={styles.title}>Applicants for {jobTitle}</h1>
      {applicants.length > 0 ? (
        <div className={styles.applicantList}>
          {applicants.map((applicant) => (
            <div key={applicant.username} className={styles.applicantCard}>
              <div className={styles.applicantDetails}>
                <span className={styles.detailLabel}>Name:</span> {applicant.first_name} {applicant.last_name}
              </div>
              <div className={styles.applicantDetails}>
                <span className={styles.detailLabel}>Username:</span> {applicant.username}
              </div>
              <div className={styles.applicantDetails}>
                <span className={styles.detailLabel}>Email:</span> {applicant.email}
              </div>
              <div className={styles.applicantDetails}>
                <span className={styles.detailLabel}>Roll Number:</span> {applicant.roll_number}
              </div>
              <div className={styles.applicantDetails}>
                <span className={styles.detailLabel}>Course:</span> {applicant.course}
              </div>
              <div className={styles.applicantDetails}>
                <span className={styles.detailLabel}>Branch:</span> {getBranchName(applicant.branch)}
              </div>
              <div className={styles.applicantDetails}>
                <span className={styles.detailLabel}>CGPA:</span> {applicant.cgpa}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noApplicants}>No applicants found for this job.</p>
      )}
            </div>
            </section>
            </div>
        </div>
    );
};

export default Jobapplicants;