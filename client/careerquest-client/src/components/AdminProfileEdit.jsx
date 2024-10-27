import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css'; // Import CSS module
import { Card, CardContent, Typography, Button, Avatar, Grid2 } from '@mui/material';

const Adminprofile = () => {
    const backend_url = "http://127.0.0.1:8000/api";
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        is_admin: false,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`${backend_url}/admin/update/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Profile updated successfully!');
                navigate('/adminProfile'); // Redirect to profile page or desired page
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate("/Login");
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const response = await fetch(`${backend_url}/admin-details/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
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
                    throw new Error('Failed to fetch admin details');
                }
                const data = await response.json();
                setFormData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserDetails();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

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

                <section className={styles.EditContent}>
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit}>
        <div className={styles.fieldContainer}>
    <label>First Name</label>
    <input className={styles.input} type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Last Name</label>
    <input className={styles.input} type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} rows={5} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Username</label>
    <input className={styles.input} type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
  </div>
  <div className={styles.fieldContainer}>
    <label>New Password</label>
    <input className={styles.input} type="password" name="password" placeholder="New Password" value={formData.password} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Email</label>
    <input className={styles.input} type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
  </div>

  <button type="submit" className={styles['details-button']}>Update</button>
        </form>
        </section>
            </div>
        </div>
    );
};

export default Adminprofile;
