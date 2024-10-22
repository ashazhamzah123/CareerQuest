import React, {useState, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css'; // Import CSS module

const DashboardPage = () => {
  const location = useLocation(); // Get current route to highlight active link
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);

  const handleLogout = () => {
        localStorage.removeItem('acess_token');
        localStorage.removeItem('refresh_token');

        navigate("/Login");
  }
  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('access_token'); // Retrieve the access token

      try {
        const response = await fetch('http://127.0.0.1:8000/api/jobs/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Adding the token in the Authorization header
          }
        });

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
  /*
  useEffect(() => {
    const fetchUserDetails = async () => {
    const token = localStorage.getItem('access_token'); // Retrieve token from local storage
  
    try {
      const response = await fetch('http://127.0.0.1:8000/user-details/', {
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchUserDetails();
}, []);
*/
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
            <li className={location.pathname === '/dashboard' ? styles.active : ''}>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className={location.pathname === '/edit-profile' ? styles.active : ''}>
              <Link to="/edit-profile">Edit Profile</Link>
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
          <h2>Welcome to the Dashboard</h2>
          {/* Add your dashboard-specific content here */}
            <div className={styles.dashboardContainer}>
                <h2>Available Job Listings</h2>
                <div className={styles['job-list']}>
                    {jobs.map((job) => (
                      <div className={styles['job-card']} key={job.id}>
                      <h3>{job.title}</h3>
                      <p className={styles['company-name']}>{job.company_name}</p>
                      <p>{job.description}</p>
                      <button
                        className={styles['details-button']}
                        onClick={() => (window.location.href = `/jobs/${job.id}`)} // Assuming job details have their own page
                      >
                      View Details
                      </button>
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

