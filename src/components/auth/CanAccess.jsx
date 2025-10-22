import React from "react";
import { useSelector } from "react-redux";

/**
 * 🔒 CanAccess — Wrapper for permission-based rendering
 * Example:
 * <CanAccess accessKeys={["canStartConsultation", "canViewConsultations"]}>
 *   <Button>Consult</Button>
 * </CanAccess>
 */
const CanAccess = ({ children, accessKeys = [] }) => {
  const { user } = useSelector((state) => state.auth);
  const access = user?.access || {};

  const hasPermission = accessKeys.every((key) => access[key]);
  return hasPermission ? children : null;
};

export default CanAccess;
