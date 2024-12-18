import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css'; // Import CSS module
import { Card, CardContent, Typography, Button, Avatar, Grid2 } from '@mui/material';

const branchOptions = [
  { value: 3, label: 'Computer Science Engineering' },
  { value: 1, label: 'Electronics and Communication Engineering' },
  { value: 7, label: 'Mechanical Engineering' },
  { value: 9, label: 'Civil Engineering' },
  { value: 2, label: 'Electrical and Electronics Engineering' },
  { value: 5, label: 'Biotechnology Engineering' },
  { value: 4, label: 'Chemical Engineering' },
  { value: 8, label: 'Maths and Computing' },
  { value: 6, label: 'MME' },
];

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

    const deleteJob = async (jobId) => {
        const token = localStorage.getItem('access_token');
        console.log("Deleting job with ID:", jobId);
      
        try {
          const response = await fetch(`${backend_url}/jobs/${jobId}/delete/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Pass token in headers
            },
          });
      
          if (response.status === 401) {
            alert('Session timed out. Please log in again.');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return;
          } else if (response.status === 404) {
            alert('No such job exists');
          } else if (response.ok) {
            alert('Job deleted successfully!');
            setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
          } else {
            throw new Error('Failed to delete the job');
          }
        } catch (err) {
          alert(`Error: ${err.message}`);
        }
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
                <section className={styles.dashboardContent}>
                <h2>Jobs</h2>
                <div className={styles['job-list']}>
                    {jobs.map((job) => (
                      <div className={styles['job-card']} key={job.id}>
                      <h3>{job.title}</h3>
                      <p className={styles['company-name']}>- {job.company}</p>
                      <p>📅 {job.due_date}</p>
                      <p>📍 {job.location}</p>
                      <p>Min. CGPA: {job.min_cgpa}</p>
                      <strong>Eligible Branches:</strong>
                          <ul>
                              {job.eligible_branches.map(branchId => {
                                  const branch = branchOptions.find(option => option.value === branchId);
                                  return <li key={branchId}>{branch ? branch.label : 'Unknown Branch'}</li>;
                              })}
                          </ul>
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
                        className={styles['delete-button']}
                        onClick={() => deleteJob(job.id)}
                      >
                        Delete
                      </button>
                      </div>
                      </div>
                    ))}
            </div>
            </section>
            </div>
        </div>
    );
};

export default Managejobs;