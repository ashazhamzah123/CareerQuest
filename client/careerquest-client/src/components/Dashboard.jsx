import React, {useState, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css'; // Import CSS module
import LogoutIcon from '@mui/icons-material/Logout';

const DashboardPage = () => {
  const backend_url = "http://127.0.0.1:8000/api";
  const location = useLocation(); // Get current route to highlight active link
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [appliedJobs, setAppliedJobs] = useState([]); 

  const handleLogout = () => {
        const appliedJobsKey = `appliedJobs_${userDetails.id}`;
        localStorage.removeItem('acess_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem(appliedJobsKey);

        navigate("/Login");
  }
  const applyToJob = async (jobId) => {
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`${backend_url}/jobs/${jobId}/apply/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Pass token in headers
        },
        body: JSON.stringify({ job_id: jobId }) // Send job ID to apply
      });

      if (response.status === 400) {
        alert('You have already applied for this Job');
      }

      else if (!response.ok) {
        throw new Error('Failed to apply for the job');
      }
      else{
        alert('Application successful!');
      }
      
      const appliedJobsKey = `appliedJobs_${userDetails.roll_number}`; // Store applied jobs per user
      setAppliedJobs((prevApplied) => {
        const updatedAppliedJobs = [...prevApplied, jobId];
        localStorage.setItem(appliedJobsKey, JSON.stringify(updatedAppliedJobs)); // Store applied jobs in localStorage for this user
        return updatedAppliedJobs;
      });

    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    const savedAppliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];
    setAppliedJobs(savedAppliedJobs);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('access_token'); // Retrieve the access token

      try {
        const response = await fetch(`${backend_url}/jobs/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Adding the token in the Authorization header
          }
        });
        if (response.status === 401) {
          alert('Session timed out. Please log in again.'); // Popup alert
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');

          window.location.href = '/login';
          return; 
        }
        if (!response.ok) {
          throw new Error('Failed to fetch job listings');
        }
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  useEffect(() => {
    const fetchUserDetails = async () => {
    const token = localStorage.getItem('access_token'); // Retrieve token from local storage
  
    try {
      const response = await fetch(`${backend_url}/user-details/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Add token in headers
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json();
      setUserDetails(data);

      const appliedJobsKey = `appliedJobs_${data.id}`;
      const savedAppliedJobs = JSON.parse(localStorage.getItem(appliedJobsKey)) || [];
      setAppliedJobs(savedAppliedJobs);
  
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchUserDetails();
}, []);

  if (loading) {
    return (
      <div className={styles['dashboard-container']}>
        <div className={styles.loading}>Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['dashboard-container']}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

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

        {/* Main Dashboard Area */}
        <section className={styles.dashboardContent}>
          {/* Add your dashboard-specific content here */}
            <div className={styles.dashboardContainer}>
                <h2>Available Job Listings</h2>
                <div className={styles['job-list']}>
                    {jobs.map((job) => (
                      <div className={styles['job-card']} key={job.id}>
                      <h3>{job.title}</h3>
                      <p className={styles['company-name']}>- {job.company}</p>
                      <p>📅 {job.due_date}</p>
                      <p>📍 {job.location}</p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        className={styles['details-button']}
                        onClick={() => (window.location.href = `/jobs/${job.id}/details`)} // Assuming job details have their own page
                      >
                      View Details
                      </button>
                      <button
                        className={styles['apply-button']}
                        onClick={() => applyToJob(job.id)}
                        disabled={appliedJobs.includes(job.id)} // Disable button if already applied
                      >
                          {appliedJobs.includes(job.id) ? 'Applied' : 'Apply'}
                      </button>
                      </div>
                      </div>
                    ))}
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;

