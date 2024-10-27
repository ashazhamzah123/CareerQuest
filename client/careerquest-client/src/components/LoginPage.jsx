import React, { useState } from 'react';
import styles from "./LoginPage.module.css";
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const backend_url = "http://127.0.0.1:8000/api";
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backend_url}/login/`, {
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
        const userResponse = await fetch(`${backend_url}/user-details/`, {
          headers: {
            'Authorization': `Bearer ${data.access}`
          }
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.is_admin === true) {
            navigate('/adminProfile');
          } else {
            navigate('/profile');
          }
        } else {
          console.error("Failed to fetch user details.");
        }
      } else {
        alert('Invalid credentials. Please try again.');
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
          
          <Link to="/" className={styles.navbarTitle}>
            <h1>CareerQuest</h1>
          </Link>
        
        </div>
      </nav>
      {/*login window*/}
      <div className={styles.logindiv}>
        <div className={styles.loginTextSection}>
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

    </div>
    
  );
};

export default LoginPage;
