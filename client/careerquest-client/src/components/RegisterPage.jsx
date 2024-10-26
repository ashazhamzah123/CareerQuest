import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import styles from "./LoginPage.module.css"; // Reuse the CSS from the login page
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const backend_url = "http://127.0.0.1:8000/api";
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
    if (formData.cgpa>10){
      alert('CGPA can only be out of 10');
    }
    else{
    try {
      const response = await fetch(`${backend_url}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Registration successful!');
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }
  };

  return (
    <div className={styles.loginContainer}>
        <div className={styles.registercontainer}>
          {/*Nav bar */}
          <nav className={styles.navbar}>
            <div className={styles.navbarLeft}>
              {/*<img src="/path-to-your-logo" alt="logo" className={styles.navbarLogo} />*/}
              <Link to="/" className={styles.navbarTitle}>
            <h1>CareerQuest</h1>
          </Link>
            </div>
            <div className={styles.navbarRight}>
              <img src="/path-to-profile-icon" alt="Profile" className={styles.profileIcon} />
            </div>
          </nav>
      <div className={styles.registerdiv}>
        <div className={styles.loginTextSection}>
      <div className={styles.logincard}>
        <h1>Registration</h1>
        <form onSubmit={handleSubmit}>
          <input className={styles.login_form_input}
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
          />
          <input className={styles.login_form_input}
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
          />
          <input className={styles.login_form_input}
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input className={styles.login_form_input}
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input className={styles.login_form_input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input className={styles.login_form_input}
            type="text"
            name="roll_number"
            placeholder="Roll Number"
            value={formData.roll_number}
            onChange={handleChange}
          />
          <input className={styles.login_form_input}
            type="text"
            name="course"
            placeholder="Course"
            value={formData.course}
            onChange={handleChange}
          />
          <input className={styles.login_form_input}
            type="number"
            name="branch"
            placeholder="Branch"
            value={formData.branch}
            onChange={handleChange}
          />
          <input className={styles.login_form_input}
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
            className={styles.login_form_button}  // Reuse login button styles
          >
            Register
          </button>
          <p>Already Have an account? <Link to='/login' className={styles.link}>Login</Link></p>
        </form>
        </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default RegisterPage;

