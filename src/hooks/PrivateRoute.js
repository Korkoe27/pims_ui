import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider'; // Use the AuthProvider for context

const PrivateRoute = ({ children }) => {
  const { user } = useAuth(); // Check the user state from context
  
  // If user is not authenticated, redirect to login page
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
