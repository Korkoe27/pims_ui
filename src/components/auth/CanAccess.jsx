import { useSelector } from "react-redux";
import { hasAllPermissions } from "../../utils/roleUtils";

/**
 * 🔒 CanAccess — Wrapper for role-based rendering
 * Example:
 * <CanAccess accessKeys={["canStartConsultation", "canViewConsultations"]}>
 *   <Button>Consult</Button>
 * </CanAccess>
 */
const CanAccess = ({ children, accessKeys = [] }) => {
  const { user } = useSelector((state) => state.auth);
  const roleCodes = user?.role_codes || [];

  const hasPermission = hasAllPermissions(roleCodes, accessKeys);
  return hasPermission ? children : null;
};

export default CanAccess;
