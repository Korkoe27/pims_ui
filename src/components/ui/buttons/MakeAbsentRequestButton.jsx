import React from "react";
import { useSelector } from "react-redux";

/**
 * 🔹 MakeAbsentRequestButton — opens the create request modal.
 * Checks backend-provided access before rendering.
 */
const MakeAbsentRequestButton = ({ onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const roleCodes = user?.role_codes || [];

  if (!MakeAbsentRequestButton.shouldShow(roleCodes)) return null;

  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Make Request
    </button>
  );
};

MakeAbsentRequestButton.shouldShow = (roleCodes) => {
  // All staff can create absent requests
  const allowedRoles = ["student", "clinician", "supervisor", "frontdesk", "coordinator", "pharmacy", "finance"];
  return roleCodes.some((code) => allowedRoles.includes(code));
};

export default MakeAbsentRequestButton;
