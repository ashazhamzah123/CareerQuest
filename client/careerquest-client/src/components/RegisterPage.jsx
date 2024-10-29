import React, { useState } from 'react';
import styles from "./LoginPage.module.css"; // Reuse the CSS from the login page
import { Link } from 'react-router-dom';
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

const RegisterPage = () => {
  const backend_url = "http://127.0.0.1:8000/api";
  const [formData, setFormData] = useState({
    first_name:'',
    last_name:'',
    username: '',
    email: '',
    password: '',
    roll_number: '',
    branch: '',
    course:'',
    cgpa: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "cgpa" ? parseFloat(value) || "" : value  // Ensures cgpa is a number or empty
    });
  };
  const handleSelectChange = (selectedOptions) => {
    setFormData({
        ...formData,
        branch: selectedOptions.value,
    });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    const cgpaValue = parseFloat(formData.cgpa);
    if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 10) {
        alert('CGPA should be between 0 and 10');
        return;
    }
    else{
    try {
      const response = await fetch(`${backend_url}/register/student/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Registration successful!');
      } else{
      const errorData = await response.json();
      alert(`Registration failed: ${errorData.detail || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }
  };
  const customStyles = {//STYLE FOR SELECT DROP DOWN IN REGISTER PAGE
    control: (provided) => ({
        ...provided,
        width: '98%', // Match input width
        marginBottom: '15px',
        padding: '10px',
        fontSize: '1em',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Background color
        color: 'white', // Text color
        border: 'none', // Remove border
        borderRadius: '2px', // Optional: add border-radius
        boxShadow:'none',
        '&:hover': {
            borderColor: 'none', // Change border color on hover
        },
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#2f2f2f', // Background for selected values
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#ebebeb', // Color of selected value text
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#ebebeb', // Color of remove icon
        ':hover': {
            backgroundColor: '#c82333', // Hover effect on remove icon
            color: 'white', // Color when hovering
        },
    }),
    menu: (provided) => ({
        ...provided,
        width: '98%', // Match dropdown width to input
        backgroundColor: 'black', // Dropdown background
        color: '#ebebeb', // Dropdown text color
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)', // Change background on hover
        color: '#ebebeb', // Option text color
        cursor: 'pointer',
        '&:active': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)', // Active background
        },
    }),
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
          <Select 
            styles={customStyles}
            options={branchOptions}
            onChange={handleSelectChange}
            value={branchOptions.find(option => option.value === formData.branch) || null}
            placeholder="Branch"
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

