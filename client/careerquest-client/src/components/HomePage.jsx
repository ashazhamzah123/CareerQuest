// src/pages/Homepage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Homepage.module.css';  // Create a CSS module for styling if needed

const Homepage = () => {
  return (
    <div className={styles.homeContainer}>
      <h1>Welcome to CareerQuest</h1>
      <p>Explore job opportunities and manage your career with us.</p>
      <Link to="/register" className={styles['explore-button']}>Create Student Account</Link>
      <Link to="/admin/register" className={styles['explore-button']}>Create Admin Account</Link>
    </div>
  );
};

export default Homepage;
