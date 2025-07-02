import React from "react";
import { useSelector } from "react-redux";

const CanAccess = ({ allowedRoles = [], children, fallback = null }) => {
  const user = useSelector((state) => state.auth.user);

  // If no user or roles info yet, don't render anything
  if (!user || !user.role) return null;

  const hasAccess = allowedRoles.includes(user.role);

  return hasAccess ? children : fallback;
};

export default CanAccess;
