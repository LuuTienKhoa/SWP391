  import { Navigate } from 'react-router-dom';
  import React from 'react';

  // Protected route for admin
  const AdminProtectedRoute = ({ children , requiredRole}) => {
    const userRole = localStorage.getItem('userRole'); 

    if (userRole !== requiredRole) {  
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userAddress');
      localStorage.removeItem('userPhone');
      return <Navigate to="/login" />;
    }

    return children;
  };

  export default AdminProtectedRoute;