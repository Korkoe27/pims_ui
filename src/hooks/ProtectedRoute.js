/**
 * ProtectedRoute Component
 * Ensures only authenticated users can access the route.
 */
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  // Get user from Redux state
  const { user } = useSelector((state) => state.auth);

  // Debugging: Log the user state for troubleshooting
  console.log("ProtectedRoute: user state:", user);

  // If the user is not authenticated, redirect to the login page
  if (!user) {
    console.warn("ProtectedRoute: User not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the children
  return children;
};

export default ProtectedRoute;


