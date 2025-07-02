import { useSelector } from "react-redux";

/**
 * Renders children only if the user's role matches allowedRoles
 */
const CanAccess = ({ allowedRoles = [], children }) => {
  const userRole = useSelector((state) => state.auth.user?.role?.toLowerCase());

  if (
    !userRole ||
    !allowedRoles.map((r) => r.toLowerCase()).includes(userRole)
  ) {
    return null;
  }

  return <>{children}</>;
};

export default CanAccess;
