/**
 * roleUtils.js
 *
 * Utility functions for role-based access control.
 * Uses role_codes from user object to determine permissions.
 *
 * Available role codes:
 * - frontdesk: Front desk staff
 * - student: Students
 * - clinician: Clinical staff (optometrists)
 * - supervisor: Supervisors (lecturers, can grade students)
 * - coordinator: Coordinators (administrative)
 * - pharmacy: Pharmacy staff
 * - finance: Finance staff
 */

/**
 * Map of permission keys to required role codes
 */
export const PERMISSION_ROLE_MAP = {
  // Patient management
  canViewPatients: ["frontdesk", "student", "clinician", "supervisor"],
  canAddPatient: ["frontdesk", "supervisor", "coordinator"],
  
  // Appointments
  canViewAppointments: ["frontdesk", "student", "clinician", "supervisor", "coordinator"],
  canCreateAppointment: ["frontdesk", "supervisor", "coordinator"],
  
  // Consultations
  canViewConsultations: ["student", "clinician", "supervisor"],
  canStartConsultation: ["student", "clinician", "supervisor"],
  
  // Grading
  canViewGrades: ["student"], // Students view their own grades
  canGradeStudents: ["supervisor"], // Only supervisors can grade
  
  // Clinic
  canViewClinicSchedule: ["frontdesk", "student", "clinician", "supervisor", "coordinator"],
  
  // Reports
  canViewReports: ["supervisor", "coordinator", "finance"],
  
  // Pharmacy
  canViewPharmacy: ["pharmacy"],
  
  // Finance
  canViewBills: ["finance"],
  
  // Student Portal
  canAccessStudentPortal: ["student"],
  
  // Absent Requests
  canViewAbsentRequests: ["supervisor", "coordinator"],
};

/**
 * Check if user has permission based on role codes
 * @param {string[]} roleCodes - User's role codes
 * @param {string} permissionKey - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (roleCodes, permissionKey) => {
  if (!permissionKey) return true; // No permission required
  const allowedRoles = PERMISSION_ROLE_MAP[permissionKey] || [];
  return roleCodes.some((code) => allowedRoles.includes(code));
};

/**
 * Check if user has all specified permissions
 * @param {string[]} roleCodes - User's role codes
 * @param {string[]} permissionKeys - Permissions to check
 * @returns {boolean}
 */
export const hasAllPermissions = (roleCodes, permissionKeys) => {
  return permissionKeys.every((key) => hasPermission(roleCodes, key));
};

/**
 * Check if user has any of the specified permissions
 * @param {string[]} roleCodes - User's role codes
 * @param {string[]} permissionKeys - Permissions to check
 * @returns {boolean}
 */
export const hasAnyPermission = (roleCodes, permissionKeys) => {
  return permissionKeys.some((key) => hasPermission(roleCodes, key));
};

/**
 * Check if user has specific role
 * @param {string[]} roleCodes - User's role codes
 * @param {string} roleCode - Role to check
 * @returns {boolean}
 */
export const hasRole = (roleCodes, roleCode) => {
  return roleCodes.includes(roleCode);
};

/**
 * Check if user has any of the specified roles
 * @param {string[]} roleCodes - User's role codes
 * @param {string[]} roles - Roles to check
 * @returns {boolean}
 */
export const hasAnyRole = (roleCodes, roles) => {
  return roleCodes.some((code) => roles.includes(code));
};

/**
 * Check if user has all specified roles
 * @param {string[]} roleCodes - User's role codes
 * @param {string[]} roles - Roles to check
 * @returns {boolean}
 */
export const hasAllRoles = (roleCodes, roles) => {
  return roles.every((role) => roleCodes.includes(role));
};

/**
 * Example usage in components:
 *
 * import { useSelector } from 'react-redux';
 * import { hasPermission, hasRole } from '../utils/roleUtils';
 *
 * const MyComponent = () => {
 *   const { user } = useSelector(state => state.auth);
 *   const roleCodes = user?.role_codes || [];
 *
 *   const canGrade = hasPermission(roleCodes, 'canGradeStudents');
 *   const isSupervisor = hasRole(roleCodes, 'supervisor');
 *
 *   if (!canGrade) return null;
 *
 *   return <GradingButton />;
 * };
 */
