import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './Dashboard.module.css'; // Import CSS module
import { Card, CardContent, Typography, Button, Avatar, Grid2 } from '@mui/material';
import Select from 'react-select';

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

const Jobedit = () => {
    const backend_url = "http://127.0.0.1:8000/api";
    const location = useLocation();
    const navigate = useNavigate();
    const { jobId } = useParams();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate("/Login");
    };

    const [jobData, setJobData] = useState({
        title: '',
        description: '',
        company:'',
        min_cgpa: '',
        due_date:'',
        eligible_branches:[],
        location: '',
        salary: '',
      });

    const handleSelectChange = (selectedOptions) => {
        setJobData({
            ...jobData,
            eligible_branches: selectedOptions.map(option => option.value)
        });
    };
    
      // Fetch job details when the component loads
      useEffect(() => {
        const fetchJobDetails = async () => {
            const token = localStorage.getItem('access_token'); // Retrieve token here
            if (!token) {
                alert('No token found. Redirecting to login.');
                window.location.href = '/login';
                return;
            }
          try {
            const response = await fetch(`${backend_url}/jobs/${jobId}/`, {
                headers: {
                  'Authorization': `Bearer ${token}`, // Add the token here
                  'Content-Type': 'application/json',
                },
              });
            if (response.status === 401) {
                alert('Session timed out. Please log in again.'); // Popup alert
                handleLogout();
                return; }
            if (response.ok) {
              const data = await response.json();
              console.log("Eligible branches:", data.eligible_branches);
              const eligibleBranchIds= data.eligible_branches;

              setJobData({
                
                title: data.title,
                description: data.description,
                company: data.company,
                min_cgpa: data.min_cgpa,
                due_date: data.due_date,
                eligible_branches: eligibleBranchIds ,
                location: data.location,
                salary: data.salary,
              });
            } 
            else {
              console.error("Failed to fetch job details");
            }
          } catch (error) {
            console.error("Error fetching job details:", error);
          }
        };
    
        fetchJobDetails();
      }, [jobId, navigate]);
    
      // Handle form input change
      const handleChange = (e) => {
        const { name, value } = e.target;
        setJobData({
          ...jobData,
          [name]: value,
        });
      };
    
      // Handle form submission
      const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token'); // Retrieve token here
        if (!token) {
            alert('No token found. Redirecting to login.');
            window.location.href = '/login';
            return;
        }
        try {
          const response = await fetch(`${backend_url}/jobs/${jobId}/update/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jobData),
          });
          if (response.ok) {
            alert('Job updated successfully!');
            navigate('/managejobs'); // Redirect to job list or desired page
          } else {
            alert('Failed to update job. Please try again.');
          }
        } catch (error) {
          console.error("Error updating job:", error);
        }
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
            <h1>Edit Job</h1>
            <form onSubmit={handleSubmit}>

  <div className={styles.fieldContainer}>
    <label>Title</label>
    <input className={styles.input} type="text" name="title" placeholder="Title" value={jobData.title} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Description</label>
    <textarea className={styles.textArea} name="description" placeholder="Description" value={jobData.description} onChange={handleChange} rows={5} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Company</label>
    <input className={styles.input} type="text" name="company" placeholder="Company" value={jobData.company} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Location</label>
    <input className={styles.input} type="text" name="location" placeholder="Location" value={jobData.location} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Min. CGPA</label>
    <input className={styles.input} type="number" name="min_cgpa" placeholder="Min. CGPA" value={jobData.min_cgpa} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Salary</label>
    <input className={styles.input} type="number" name="salary" placeholder="Salary" value={jobData.salary} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Due Date</label>
    <input className={styles.input} type="date" name="due_date" placeholder="Due Date" value={jobData.due_date} onChange={handleChange} />
  </div>

  <div className={styles.fieldContainer}>
    <label>Eligible Branches</label>
    <Select
      isMulti
      options={branchOptions}
      onChange={handleSelectChange}
      value={branchOptions.filter(option => jobData.eligible_branches.includes(option.value))}
      placeholder="Select eligible branches"
    />
  </div>

  <button type="submit" className={styles['details-button']}>Update</button>
</form>
          </section>
          </div>
            </div>
            </div>
    );
};

export default Jobedit;