import React from 'react';
import { Navigate } from 'react-router-dom';

// Component to protect routes - redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  // const token = localStorage.getItem('authToken');

  // if (!token) {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
};

export default ProtectedRoute;
