import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css'; // Import CSS module
import Select from 'react-select';

const branchOptions = [
    { value: '3', label: 'Computer Science Engineering' },
    { value: '1', label: 'Electronics and Communication Engineering' },
    { value: '7', label: 'Mechanical Engineering' },
    { value: '9', label: 'Civil Engineering' },
    { value: '2', label: 'Electrical and Electronics Engineering' },
    { value: '5', label: 'Biotechnology Engineering' },
    { value: '4', label: 'Chemical Engineering' },
    { value: '8', label: 'Maths and Computing' },
    { value: '6', label: 'MME' },
  ];

const Createjob = () => {
    const backend_url = "http://127.0.0.1:8000/api";
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company: '',
        location: '',
        min_cgpa: '',
        salary: '',
        OT_date: '',
        due_date: '',
        eligible_branches: ''
      });

    const handleSelectChange = (selectedOptions) => {
        setFormData({
            ...formData,
            eligible_branches: selectedOptions.map(option => option.value)
        });
    };
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`${backend_url}/jobs/create/`, {
                method: 'POST',
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
                alert('Job created successfully');
            } else {
                alert('Failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during job creation:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate("/Login");
    };

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

                <div className={styles.carddiv}>
                <section className={styles.EditContent}>
            <h1>Add Job</h1>
            <form onSubmit={handleSubmit}>

  <div className={styles.fieldContainer}>
    <label>Title</label>
    <input className={styles.input} type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Description</label>
    <textarea className={styles.textArea} name="description" placeholder="Description" value={formData.description} onChange={handleChange} rows={5} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Company</label>
    <input className={styles.input} type="text" name="company" placeholder="Company" value={formData.company} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Location</label>
    <input className={styles.input} type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Min. CGPA</label>
    <input className={styles.input} type="number" name="min_cgpa" placeholder="Min. CGPA" value={formData.min_cgpa} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Eligible Branches</label>
    <Select
      isMulti
      options={branchOptions}
      onChange={handleSelectChange}
      value={branchOptions.filter(option => formData.eligible_branches.includes(option.value))}
      placeholder="Select eligible branches"
    />
  </div>

  <div className={styles.fieldContainer}>
    <label>OT Date (Optional)</label>
    <input className={styles.input} type="date" name="OT_date" placeholder="OT Date" value={formData.OT_date} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Due Date</label>
    <input className={styles.input} type="date" name="due_date" placeholder="Due Date" value={formData.due_date} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Salary</label>
    <input className={styles.input} type="number" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} />
  </div>


  <button type="submit" className={styles['details-button']}>create</button>
</form>
          </section>

                </div>
            </div>
        </div>
    );
};

export default Createjob;