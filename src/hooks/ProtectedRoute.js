import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  // Dynamically track authentication state from Redux
  const { user } = useSelector((state) => state.auth);

  // Redirect unauthenticated users to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content for authenticated users
  return children;
};

export default ProtectedRoute;
