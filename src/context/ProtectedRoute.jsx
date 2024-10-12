import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isLoggedIn, userRole } = useAuth();

  if (!isLoggedIn || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
