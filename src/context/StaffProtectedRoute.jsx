import { Navigate } from 'react-router-dom';
import React from 'react';

// Protected route for staff
const StaffProtectedRoute = ({ children }) => {
  const userRole = localStorage.getItem('userRole'); 

  if (userRole !== '1') {  // Assuming '1' is the role for staff
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    return <Navigate to="/login" />;
  }

  return children;
};

export default StaffProtectedRoute;

