import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css'; // Import CSS module
import { Card, CardContent, Typography, Button, Avatar, Grid2 } from '@mui/material';

const Managejobs = () => {
    const backend_url = "http://127.0.0.1:8000/api";
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jobs, setJobs] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate("/Login");
    };

    useEffect(() => {
        const fetchJobs = async () => {
          const token = localStorage.getItem('access_token'); // Retrieve the access token
    
          try {
            const response = await fetch(`${backend_url}/jobs/admin/`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adding the token in the Authorization header
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
              throw new Error('Failed to fetch job listings');
            }
            const data = await response.json();
            setJobs(data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchJobs();
      }, []);

    return (
        <div className={styles.dashboardContainer}>
            <nav className={styles.navbar}>
                <h1 className={styles.navbarTitle}>CareerQuest  Admin Portal</h1>
            </nav>

            <div className={styles.mainContent}>
                <aside className={styles.sidebar}>
                    <ul>
                        <li className={location.pathname === '/createjob' ? styles.active : ''}>
                            <Link to="/createjob">Create Job</Link>
                        </li>
                        <li className={location.pathname === '/adminProfile' ? styles.active : ''}>
                            <Link to="/adminProfile">Profile</Link>
                        </li>
                        <li className={location.pathname === '/managejobs' ? styles.active : ''}>
                            <Link to="/managejobs">Manage Jobs</Link>
                        </li>
                        <li>
                        <button onClick={handleLogout} className={styles.logoutButton}>
                        Logout
                        </button>
                        </li>
                    </ul>
                </aside>
                <div className={styles.dashboardContainer}>
                <h2>Jobs</h2>
                <div className={styles['job-list']}>
                    {jobs.map((job) => (
                      <div className={styles['job-card']} key={job.id}>
                      <h3>{job.title}</h3>
                      <p className={styles['company-name']}>- {job.company}</p>
                      <p>📅 {job.due_date}</p>
                      <p>📍 {job.location}</p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        className={styles['details-button']}
                        onClick={() => (window.location.href = `/jobs/${job.id}/applicants`)} // Assuming job details have their own page
                      >
                      View Applications
                      </button>
                      <button
                        className={styles['apply-button']}
                        onClick={() => (window.location.href = `/jobs/${job.id}/update`)} 
                      >
                        Edit
                      </button>
                      <button
                        className={styles['apply-button']}
                        onClick={() => (window.location.href = `/jobs/${job.id}/delete`)} 
                      >
                        Delete
                      </button>
                      </div>
                      </div>
                    ))}
                </div>
            </div>
            </div>
        </div>
    );
};

export default Managejobs;