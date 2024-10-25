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
    const [userDetails, setUserDetails] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        is_admin: false,
    });
    const [formData, setFormData] = useState(userDetails);

    const handleEdit = () => {
        navigate(`/edit-profile`);
    };

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
            const response = await fetch(`${backend_url}/user/update/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData)
            });
            if (response.status === 401) {
                alert('Session timed out. Please log in again.'); // Popup alert
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
      
                window.location.href = '/login';
                return; 
              }
            if (response.ok) {
                alert('Updated successfully');
            } else {
                alert('Failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during profile update:', error);
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
                const response = await fetch(`${backend_url}/user-details/`, {
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
                    throw new Error('Failed to fetch user details');
                }
                const data = await response.json();
                setUserDetails(data);
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
                        <li className={location.pathname === '/check-applications' ? styles.active : ''}>
                            <Link to="/check-applications">Check Applications</Link>
                        </li>
                        <li>
                        <button onClick={handleLogout} className={styles.logoutButton}>
                        Logout
                        </button>
                        </li>
                    </ul>
                </aside>

                <div className={styles.carddiv}>
                    <Card className={styles.profileCard}>
                        <CardContent>
                            <Typography variant="h5" component="div" gutterBottom className={styles.cardTitle}>
                                Admin Details
                            </Typography>
                            <Grid2 container spacing={2}>
                                <Grid2 item xs={12} sm={4}>
                                    <Avatar
                                        alt={userDetails.first_name}
                                        src="/path/to/profile-picture.jpg"
                                        sx={{ width: 120, height: 120 }}
                                        className={styles.profileAvatar}
                                    />
                                </Grid2>

                                <Grid2 item xs={12} sm={8}>
                                    <Typography variant='body1'>Username: {userDetails.username}</Typography>
                                    <Typography variant='body1'>Name: {userDetails.first_name} {userDetails.last_name}</Typography>
                                    <Typography variant='body1'>Email: {userDetails.email}</Typography>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={styles.applyButton}
                                        onClick={handleEdit}
                                        sx={{ marginTop: 2 }}
                                    >
                                        Edit Profile
                                    </Button>
                                </Grid2>
                            </Grid2>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Adminprofile;
