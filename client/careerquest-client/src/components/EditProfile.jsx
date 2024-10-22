import React, {useState, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css'; // Import CSS module


const EditProfile = () => {
    const backend_url = "http://127.0.0.1:8000/api";
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        roll_number: '',
        branch: '',
        cgpa: ''
      });
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        try {
          const response = await fetch(`${backend_url}/user/update/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData)
          });
          if (response.ok) {
            alert('Updated successfully');
          } else {
            alert('Failed. Please try again.');
          }
        } catch (error) {
          console.error('Error during registration:', error);
        }
      };
    

    const handleLogout = () => {
        const appliedJobsKey = `appliedJobs_${userDetails.id}`;
        localStorage.removeItem('acess_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem(appliedJobsKey);

        navigate("/Login");
  }
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
          {/*Profile form */}
          <section className={styles.EditContent}>
            <h1>Profile</h1>
            <form onSubmit={handleSubmit}>
            <input className={styles.input}
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
          />
          <input className={styles.input}
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
          />
          <input className={styles.input}
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input className={styles.input}
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input className={styles.input}
            type="text"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input className={styles.input}
            type="text"
            name="roll_number"
            placeholder="Roll Number"
            value={formData.roll_number}
            onChange={handleChange}
          />
          <input className={styles.input}
            type="text"
            name="branch"
            placeholder="Branch"
            value={formData.branch}
            onChange={handleChange}
          />
          <input className={styles.input}
            type="number"
            name="cgpa"
            placeholder="CGPA"
            value={formData.cgpa}
            onChange={handleChange}
          />
          <button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            className={styles['details-button']}  // Reuse login button styles
          >
            Update
          </button>
            </form>
          </section>
        </div>
        </div>
    );
};

export default EditProfile;