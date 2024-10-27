import React, {useState, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css'; // Import CSS module

const CheckApplications = () => {
    const backend_url = "http://127.0.0.1:8000/api";
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [Appliedjobs, setAppliedJobs] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem('acess_token');
        localStorage.removeItem('refresh_token');

        navigate("/Login");
  }

    const fetchAppliedJobs = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`${backend_url}/jobs/applied/`, {
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
            setAppliedJobs(data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
    };
    useEffect(()=>{
        fetchAppliedJobs()
    }, [])

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


    return(
    <div className={styles.dashboardContainer}>
      {/* Top Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navbarLeft}>
          {/*<img src="/path-to-your-logo" alt="logo" className={styles.navbarLogo} />*/}
          <h1 className={styles.navbarTitle}>CareerQuest</h1>
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
        {/*Applied Jobs view*/}
        <section className={styles.ApplicationsContent}>
            <h1>Applied Jobs</h1>
            <div className={styles['job-list']}>
                    {Appliedjobs.map((Appliedjob) => (
                      <div className={styles['job-card']} key={Appliedjob.job.id}>
                      <h3>{Appliedjob.job.title}</h3>
                      <p className={styles['company-name']}>- {Appliedjob.job.company}</p>
                      <p>📅 {Appliedjob.job.due_date}</p>
                      <p>📍 {Appliedjob.job.location}</p>
                      <p>Rs {Appliedjob.job.salary/100000} LPA</p>
                      <button
                        className={styles['details-button']}
                        onClick={() => (window.location.href = `/jobs/${Appliedjob.job.id}/details`)} // Assuming job details have their own page
                      >
                      View Details
                      </button>
                      </div>
                    ))}
                </div>
        </section>
        </div>
    </div>
    );
};

export default CheckApplications;