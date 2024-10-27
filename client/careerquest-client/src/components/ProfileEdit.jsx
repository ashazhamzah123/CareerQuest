import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import Select from 'react-select';
import styles from './dashboard.module.css';


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


const ProfileEdit = () => {
    const backend_url = "http://127.0.0.1:8000/api";
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate("/Login");
    };

    const [formData, setFormData] = useState({
        first_name:'',
        last_name:'',
        roll_number: '',
        email:'',
        username:'',
        branch: '',
        cgpa: '',
        course: '',
        password: ''
    });

    // Fetch profile details
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('No token found. Redirecting to login.');
                navigate('/login');
                return;
            }
            try {
                const response = await fetch(`${backend_url}/student-details/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 401) {
                    alert('Session timed out. Please log in again.'); // Popup alert
                    handleLogout();
                    return; }
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                } else {
                    setError("Failed to fetch profile details.");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSelectChange = (selectedOptions) => {
        setFormData({
            ...formData,
            branch: selectedOptions.value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`${backend_url}/user/update/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Profile updated successfully!');
                navigate('/profile'); // Redirect to profile page or desired page
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.dashboardContainer}>
      {/* Top Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navbarLeft}>
          {/*<img src="/path-to-your-logo" alt="logo" className={styles.navbarLogo} />*/}
          <h1 className={styles.navbarTitle}>CareerQuest</h1>
        </div>
      </nav>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <ul>
            <li className={location.pathname === '/jobs' ? styles.active : ''}>
              <Link to="/jobs">Job Listing</Link>
            </li>
            <li className={location.pathname === '/profile' ? styles.active : ''}>
              <Link to="/profile">Profile</Link>
            </li>
            <li className={location.pathname === '/check-applications' ? styles.active : ''}>
              <Link to="/check-applications">Check Applications</Link>
            </li>
            <li>
                <button onClick={handleLogout} className={styles.logoutButton} type="submit">
                    Logout
                </button>
            </li>
          </ul>
        </aside>
        {/*<div className={styles.carddiv}> */}
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
    <label>Roll Number</label>
    <input className={styles.input} type="text" name="roll_number" placeholder="Roll Number" value={formData.roll_number} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>CGPA</label>
    <input className={styles.input} type="number" name="cgpa" placeholder="CGPA" value={formData.cgpa} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Email</label>
    <input className={styles.input} type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Course</label>
    <input className={styles.input} type="text" name="course" placeholder="Course" value={formData.course} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Branch</label>
    <Select
      options={branchOptions}
      onChange={handleSelectChange}
      value={branchOptions.find(option => option.value === formData.branch) || null}
      placeholder="Branch"
    />
  </div>

  <button type="submit" className={styles['details-button']}>Update</button>
        </form>
        </section>
        </div>
        </div>
    );
};

export default ProfileEdit;

