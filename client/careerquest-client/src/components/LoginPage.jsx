import React, { useState } from 'react';
import styles from "./LoginPage.module.css";
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        window.location.href = '/dashboard'; // Redirect after login
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className={styles.logincontainer}>
      <div className={styles.logincontainer}>
        {/*Nav bar */}
        <nav className={styles.navbar}>
        <div className={styles.navbarLeft}>
          {/*<img src="/path-to-your-logo" alt="logo" className={styles.navbarLogo} />*/}
          <h1 className={styles.navbarTitle}>CareerQuest</h1>
        </div>
        <div className={styles.navbarRight}>
          <img src="/path-to-profile-icon" alt="Profile" className={styles.profileIcon} />
        </div>
      </nav>
      {/*login window*/}
      <div className={styles.logindiv}>
        <div className={styles.logincard}>
          <h1>Login</h1>
            <form onSubmit={handleSubmit}>
              <input className={styles.login_form_input}
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              <input className={styles.login_form_input}
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button className={styles.login_form_button} type="submit">Login</button>
            </form>
            <p>
              Haven't Registered yet? <Link to="/register" className={styles.link}>Create Account</Link>
            </p>     
            </div>
        </div>
        </div>

    </div>
    
  );
};

export default LoginPage;
