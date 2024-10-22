import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem('access_token');

  if (!isAuthenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" />;
  }

  // If authenticated, render the children (the protected component)
  return children;
};

export default ProtectedRoute;
