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

  if (!user) {
    console.warn(
      "ProtectedRoute: User not authenticated, redirecting to /login"
    );
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
