  import { Navigate } from 'react-router-dom';
  import React from 'react';

  // Protected route for admin
  const AdminProtectedRoute = ({ children }) => {
    const userRole = localStorage.getItem('userRole'); 

    if (userRole !== '0') {  
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      return <Navigate to="/login" />;
    }

    return children;
  };

  export default AdminProtectedRoute;