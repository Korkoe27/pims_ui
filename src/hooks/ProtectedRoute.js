import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * 🔒 ProtectedRoute — Access-based route guard
 *
 * Example:
 * <ProtectedRoute accessKeys={["canViewReports"]}>
 *    <Reports />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children, accessKeys = [] }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return <div className="text-center p-8">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (accessKeys.length > 0) {
    const access = user?.access || {};
    const hasAllAccess = accessKeys.every((key) => access[key]);

    if (!hasAllAccess) {
      // 🚫 No permission → redirect to dashboard
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
