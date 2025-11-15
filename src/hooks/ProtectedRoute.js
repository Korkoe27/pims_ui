import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * 🔒 ProtectedRoute — Role-based route guard
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
    const roleCodes = user?.role_codes || [];
    
    // Map access keys to required roles
    const permissionRoleMap = {
      canViewPatients: ["frontdesk", "student", "clinician", "supervisor"],
      canAddPatient: ["frontdesk", "supervisor", "coordinator"],
      canViewAppointments: ["frontdesk", "student", "clinician", "supervisor", "coordinator"],
      canCreateAppointment: ["frontdesk", "supervisor", "coordinator"],
      canViewReports: ["supervisor", "coordinator", "finance"],
      canViewClinicSchedule: ["frontdesk", "student", "clinician", "supervisor", "coordinator"],
      canViewGrades: ["student"], // Students view their own grades
      canGradeStudents: ["supervisor"], // Only supervisors can grade
      canViewConsultations: ["student", "clinician", "supervisor"],
      canViewPharmacy: ["pharmacy"],
      canStartConsultation: ["student", "clinician", "supervisor"],
      canAccessStudentPortal: ["student"],
      canViewBills: ["finance"],
    };

    // Check if user has any of the required roles for ALL accessKeys
    const hasAllAccess = accessKeys.every((key) => {
      const allowedRoles = permissionRoleMap[key] || [];
      return roleCodes.some((code) => allowedRoles.includes(code));
    });

    if (!hasAllAccess) {
      // 🚫 No permission → redirect to dashboard
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
