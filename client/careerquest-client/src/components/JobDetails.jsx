import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

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

const Jobdetails = () => {
    const backend_url = "http://127.0.0.1:8000/api";
    const { jobId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [jobData, setJobData] = useState(null);

    const handleLogout = () => {
        const appliedJobsKey = `appliedJobs_${userDetails.id}`;
        localStorage.removeItem('acess_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem(appliedJobsKey);

        navigate("/Login");
  }

    useEffect(() => {
        const fetchJobDetails = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('No token found. Redirecting to login.');
                navigate('/login');
                return;
            }
            try {
                const response = await fetch(`${backend_url}/jobs/${jobId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setJobData(data);
                } else {
                    console.error("Failed to fetch job details");
                }
            } catch (error) {
                console.error("Error fetching job details:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId, navigate]);

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error in landing a job.</div>
    return (
        <div className={styles.dashboardContainer}>
      {/* Top Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navbarLeft}>
          {/*<img src="/path-to-your-logo" alt="logo" className={styles.navbarLogo} />*/}
          <h1 className={styles.navbarTitle}>CareerQuest</h1>
        </div>
        <div className={styles.navbarRight}>
          <img src="/path-to-profile-icon" alt="Profile" className={styles.profileIcon} />
        </div>
      </nav>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <ul>
            <li className={location.pathname === '/jobs' ? styles.active : ''}>
              <Link to="/jobs">Job Listing</Link>
            </li>
            <li className={location.pathname === '/profile' ? styles.active : ''}>
              <Link to="/profile">Profile</Link>
            </li>
            <li className={location.pathname === '/check-applications' ? styles.active : ''}>
              <Link to="/check-applications">Check Applications</Link>
            </li>
            <li>
                <button onClick={handleLogout} className={styles.logoutButton} type="submit">
                    Logout
                </button>
            </li>
          </ul>
        </aside>
                <div className={styles.carddiv}>
                    <section className={styles.EditContent}>
                        <h2>{jobData.title}</h2>
                        <div className={styles.fieldContainer}>
                            <strong>Company:</strong> {jobData.company}
                        </div>
                        <div className={styles.fieldContainer}>
                            <strong>Description:</strong>
                            <p>{jobData.description}</p>
                        </div>
                        <div className={styles.fieldContainer}>
                            <strong>Location:</strong> {jobData.location}
                        </div>
                        <div className={styles.fieldContainer}>
                            <strong>Salary:</strong> {jobData.salary}
                        </div>
                        <div className={styles.fieldContainer}>
                            <strong>Due Date:</strong> {jobData.due_date}
                        </div>
                        <div className={styles.fieldContainer}>
                            <strong>Eligible Branches:</strong>
                            <ul>
                                {jobData.eligible_branches.map(branchId => {
                                    const branch = branchOptions.find(option => option.value === branchId);
                                    return <li key={branchId}>{branch ? branch.label : 'Unknown Branch'}</li>;
                                })}
                            </ul>
                        </div>
                        <button onClick={() => navigate(-1)} className={styles.backButton}>Back</button>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Jobdetails;