import React, {useState, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css'; // Import CSS module
import { Card, CardContent, Typography, Button, Avatar, Grid2 } from '@mui/material';

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

const EditProfile = () => {
    const backend_url = "http://127.0.0.1:8000/api";
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userDetails, setUserDetails] = useState({
      username: '',
      first_name: '',
      last_name:'',
      email: '',
      password: '',
      roll_number: '',
      branch: {name:''},
      cgpa: ''
    });

    const getBranchName = (branchId) => {
      const branch = branchOptions.find(option => option.value === branchId);
      return branch ? branch.label : "Unknown Branch";
    };

    const handleEdit = () => {
      navigate(`/edit-profile`);
    };

    const handleLogout = () => {
        const appliedJobsKey = `appliedJobs_${userDetails.id}`;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem(appliedJobsKey);

        navigate("/Login");
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
          const token = localStorage.getItem('access_token'); // Retrieve token from local storage
        
          try {
            const response = await fetch(`${backend_url}/student-details/`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Add token in headers
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
            setUserDetails(data);
            
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
        fetchUserDetails();
      }, []);
    return(
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
                <Link to="/jobs">Job Listings</Link>
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
          {/*Profile card */}
          <div className={styles.carddiv}>
          <div className={styles.profileCard}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom className={styles.cardTitle}>
          User Details
        </Typography>

        <Grid2 container spacing={2}>
          {/* Profile picture section */}
          <Grid2 item xs={12} sm={4}>
            <Avatar
              alt={userDetails.first_name}
              src="/path/to/profile-picture.jpg" // Replace with actual image source or dynamic image URL
              sx={{ width: 120, height: 120 }}
              className={styles.profileAvatar}
            />
          </Grid2>

          {/* User details section */}
          <Grid2 item xs={12} sm={8}>
            <Typography variant='body1'>Username: {userDetails.username}</Typography>
            <Typography variant='body1'>Name: {userDetails.first_name} {userDetails.last_name}</Typography>
            {/*<p >Email: {userDetails.email}</p>*/}
            <Typography variant='body1'>Roll Number: {userDetails.roll_number}</Typography>
            {!userDetails.isadmin && (<Typography variant='body1'>Branch: {getBranchName(userDetails.branch)}</Typography>)}
            <Typography variant='body1'>CGPA: {userDetails.cgpa}</Typography>
            <button
              className={styles['apply-button']}
              onClick={handleEdit}
              sx={{ marginTop: 2 }}
            >
              Edit Profile
            </button>
          </Grid2>
        </Grid2>
      </CardContent>
    </div>
    </div>
        </div>
        </div>
       
    );
};

export default EditProfile;