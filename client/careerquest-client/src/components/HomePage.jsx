// src/pages/Homepage.js
import React from 'react';
import {useInView} from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import styles from './Homepage.module.css';  // Create a CSS module for styling if needed

const Homepage = () => {
  const {ref, inView} = useInView({triggerOnce: true});
  return (
    <div className={styles.homeContainer}>
      <div className={styles.homecontainer}>
          <nav className={styles.navbar}>
            <div className={styles.navbarLeft}>
              {/*<img src="/path-to-your-logo" alt="logo" className={styles.navbarLogo} />*/}
              <h1 className={styles.navbarTitle}>CareerQuest</h1>
            </div>
            <div className={styles.navbarRight}>
              <img src="/path-to-profile-icon" alt="Profile" className={styles.profileIcon} />
            </div>
          </nav>
      <div className={styles.textdiv}>
      <div
        className={styles['text-section']}
      >
      <div className={styles.homeTextCard}>
      <h1>Welcome to CareerQuest</h1>
      <p>Explore job opportunities and manage your career with us. Get Started</p>
      <Link to="/register" className={styles['register-button']}>Create Student Account</Link>
      <Link to="/admin/register" className={styles['register-button']}>Create Admin Account</Link>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Homepage;
