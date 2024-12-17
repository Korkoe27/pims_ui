import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  // Get user from Redux state
  const { user } = useSelector((state) => state.auth);

  // If the user is not authenticated, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the protected component
  return children;
};

export default PrivateRoute;
