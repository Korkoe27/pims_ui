import React from "react";
import { GrAdd } from "react-icons/gr";
import { useSelector } from "react-redux";

/**
 * 🔹 AddPatientButton — Self-contained button for creating patients.
 * It checks user roles dynamically via Redux `user.role_codes`.
 */
const AddPatientButton = ({ onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const roleCodes = user?.role_codes || [];

  if (!AddPatientButton.shouldShow(roleCodes)) return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-white bg-[#2f3192] rounded-md text-sm hover:bg-[#24267a] transition"
    >
      <GrAdd />
      Add New Patient
    </button>
  );
};

/**
 * 🔹 Static helper: determines if this button should appear.
 * Only frontdesk can add patients.
 */
AddPatientButton.shouldShow = (roleCodes) => {
  const allowedRoles = ["frontdesk"];
  return roleCodes.some((code) => allowedRoles.includes(code));
};

export default AddPatientButton;
