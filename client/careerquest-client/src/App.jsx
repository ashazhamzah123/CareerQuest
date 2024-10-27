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
import Adminprofile from './components/Adminprofile';
import Createjob from './components/CreateJobs';
import Managejobs from './components/ManageJobs';
import Jobapplicants from './components/JobApplicants';
import Jobedit from './components/JobEdit';
import Jobdetails from './components/JobDetails';
import ProfileEdit from './components/ProfileEdit';
import ProfileEditAdmin from './components/AdminProfileEdit';


function App() {
  return (

    <Router>
      <div>
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/register" element={<AdminRegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/jobs" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='/check-applications' element = {<ProtectedRoute><CheckApplications/></ProtectedRoute>}/>
          <Route path='/profile' element = {<ProtectedRoute><EditProfile/></ProtectedRoute>}/>
          <Route path='/adminProfile' element = {<ProtectedRoute><Adminprofile/></ProtectedRoute>}/>
          <Route path='/createjob' element = {<ProtectedRoute><Createjob/></ProtectedRoute>}/>
          <Route path='/managejobs' element = {<ProtectedRoute><Managejobs/></ProtectedRoute>}/>
          <Route path='/jobs/:jobId/applicants' element = {<ProtectedRoute><Jobapplicants/></ProtectedRoute>}/>
          <Route path='/jobs/:jobId/update' element = {<ProtectedRoute><Jobedit/></ProtectedRoute>}/>
          <Route path='/jobs/:jobId/details' element = {<ProtectedRoute><Jobdetails/></ProtectedRoute>}/>
          <Route path='/edit-profile' element = {<ProtectedRoute><ProfileEdit/></ProtectedRoute>}/>
          <Route path='/edit-profile/admin' element = {<ProtectedRoute><ProfileEditAdmin/></ProtectedRoute>}/>
        </Routes>
      </div>
    </Router>

  );
}

export default App;
