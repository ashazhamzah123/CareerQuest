import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css'; // Import CSS module

const DashboardPage = () => {
  const location = useLocation(); // Get current route to highlight active link
  const navigate = useNavigate();

  const handleLogout = () => {
        localStorage.removeItem('acess_token');
        localStorage.removeItem('refresh_token');

        navigate("/Login");
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
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;

