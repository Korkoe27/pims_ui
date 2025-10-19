import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasPermission, hasRole } from "../utils/permissionUtils";

/**
 * 🔒 ProtectedRoute
 *
 * Guards routes based on:
 *  - Authentication (always required)
 *  - Optional role list (allowedRoles)
 *  - Optional permission code (requiredPermission)
 *
 * Usage examples:
 *  <ProtectedRoute>
 *      <Dashboard />
 *  </ProtectedRoute>
 *
 *  <ProtectedRoute allowedRoles={["Lecturer", "Administrator"]}>
 *      <Patients />
 *  </ProtectedRoute>
 *
 *  <ProtectedRoute requiredPermission="appointments.create">
 *      <CreateAppointment />
 *  </ProtectedRoute>
 */
const ProtectedRoute = ({ children, allowedRoles, requiredPermission }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1️⃣ Not logged in → redirect
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2️⃣ Role restriction (optional)
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role_name || user?.role;
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  // 3️⃣ Permission restriction (optional)
  if (requiredPermission) {
    if (!hasPermission(user, requiredPermission)) {
      return <Navigate to="/" replace />;
    }
  }

  // 4️⃣ Authorized → render child route
  return children;
};

export default ProtectedRoute;
