import React from "react";
import { GrAdd } from "react-icons/gr";
import { useSelector } from "react-redux";

/**
 * 🔹 AddPatientButton — Self-contained button for creating patients.
 * It checks backend access dynamically via Redux `user.access`.
 */
const AddPatientButton = ({ onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const access = user?.access || {};

  if (!AddPatientButton.shouldShow(access)) return null;

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
 * You can call this from other components (like tables or dashboards)
 * without re-implementing access logic.
 */
AddPatientButton.shouldShow = (access) => Boolean(access?.canAddPatient);

export default AddPatientButton;
