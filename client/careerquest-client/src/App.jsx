import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard'; // Example of a protected route
import CheckApplications from './components/CheckApplications'
import EditProfile from './components/EditProfile'
import HomePage from './components/HomePage'
import AdminRegisterPage from './components/AdminRegisterPage';

function App() {
  return (

    <Router>
      <div>
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/register" element={<AdminRegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/jobs" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path='/check-applications' element = {<ProtectedRoute><CheckApplications/></ProtectedRoute>}/>
          <Route path='/profile' element = {<ProtectedRoute><EditProfile/></ProtectedRoute>}/>
        </Routes>
      </div>
    </Router>

  );
}

export default App;
