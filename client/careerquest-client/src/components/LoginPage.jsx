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
    <div >
      <div className={styles.logincontainer}>
      <div className={styles.logindiv}>
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
              <p>
                Haven't Registered yet? <Link to="/register">Register</Link>
              </p>
            </form>
        </div>
        </div>

    </div>
    
  );
};

export default LoginPage;
