import React from "react";
import { useSelector } from "react-redux";

/**
 * 🔒 CanAccess — Access-based visibility component
 *
 * Example usage:
 * <CanAccess accessKeys={["canAddPatient", "canViewReports"]}>
 *   <button>Add Patient</button>
 * </CanAccess>
 *
 * Optional:
 * - fallback: component or element to show if user lacks permission
 */
export default function CanAccess({ accessKeys = [], children, fallback = null }) {
  const user = useSelector((s) => s.auth?.user);
  const access = user?.access || {};

  // ✅ If no keys are required, allow by default
  if (!accessKeys || accessKeys.length === 0) return <>{children}</>;

  // ✅ Must have *all* required permissions
  const hasAllAccess = accessKeys.every((key) => access[key]);

  return hasAllAccess ? <>{children}</> : fallback;
}
