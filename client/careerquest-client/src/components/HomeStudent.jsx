import React, {useState, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css'; // Import CSS module
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";


const HomeStudent = () => {
    const backend_url = "http://127.0.0.1:8000/api";
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [Appliedjobs, setAppliedJobs] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [messages, setMessages] = useState([]);
    const [statusCounts, setStatusCounts] = useState({});

    const handleLogout = () => {
        localStorage.removeItem('acess_token');
        localStorage.removeItem('refresh_token');

        navigate("/Login");
  }
  useEffect(() => {
      // Fetch applications data
      const fetchApplications = async () => {
          const token = localStorage.getItem('access_token');
          try {
              const response = await fetch(`${backend_url}/message/`, {
                method: "GET",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
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
                throw new Error('Failed to fetch user details');
              }
              const data = await response.json();

              setMessages(data.messages || []);
              setStatusCounts(data.status_counts||[])
          } catch (err) {
              setError("An error occurred while fetching applications.");
          } finally {
              setLoading(false);
          }
      };

      fetchApplications();
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
    // Prepare data for PieChart
    const pieData = Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
  }));

  // Define colors for each status
  const COLORS = {
      Pending: "#d34d00",
      Shortlisted: "#008fbf",
      Selected: "#00da00",
      Rejected: "#d11f00",
      "On hold": "#868686",
  };


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
          <li className={location.pathname === '/dashboard' ? styles.active : ''}>
              <Link to="/dashboard">Dashboard</Link>
            </li>
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
        <h2>Welcome, {userDetails.first_name}</h2>
        {/*Status Overview */}
        <div className="status-overview">
                <h3>Application Status Overview</h3>
                <PieChart width={300} height={300}>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>
        <h3>Updates</h3>
            {messages.length > 0 ? (
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            ) : (
                <p>You haven’t applied for anything. You can start applying to jobs by clicking the Job listings section in the sidebar.</p>
            )}
        <p>In the mean time you can apply to jobs by clicking the Job listings section in the sidebar.</p>
        </section>
        </div>
    </div>
    );
};

export default HomeStudent;