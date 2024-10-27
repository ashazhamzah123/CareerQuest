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
          </nav>
      <div className={styles.textdiv}>
      <div className={styles['text-section']}>
        
      <div className={styles.homeTextCard}>
      <h1>Welcome to CareerQuest</h1>
      <div className={styles.description}>CareerQuest is your dedicated platform for discovering on-campus job opportunities tailored to your qualifications and interests. Designed with students and administrators in mind, CareerQuest simplifies the placement process, helping students find roles that match their academic achievements and career aspirations.</div>
      </div>
      <div className={styles.row}>
      <div className={styles['text-section']}>
        
      <div className={styles.newTextCard}>
          <h2>For Administrators</h2>
          <div className={styles.description}>
            <ul>
              <li>Post new job listings with ease, detailing the specific qualifications required.</li>
              <li>Access tools to review applicants and communicate with top candidates.</li>
              <li>Manage and update job opportunities to keep students informed.</li>
            </ul>
          </div>
          <div className={styles['button-container']}>
            <Link to="/admin/register" className={styles['register-button']}>Create Admin Account</Link>
            <Link to="/login" className={styles['register-button']}>Login</Link>
          </div>
      </div>
      </div>
      <div className={styles['text-section']}>
      <div className={styles.h2TextCard}>
      <h2>For Students:</h2>
      <div className={styles.description}>
        <ul>
          <li>Browse a curated list of job opportunities specifically aligned with your profile.</li>
          <li>Apply directly to positions you qualify for based on your CGPA, branch, and course.</li>
          <li>Stay organized with your applications and track your progress as you move through the placement process.</li>
        </ul>
      </div>
      <div className={styles['button-container']}>
        <Link to="/register" className={styles['register-button']}>Create Student Account</Link>
        <Link to="/login" className={styles['register-button']}>Login</Link>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Homepage;
