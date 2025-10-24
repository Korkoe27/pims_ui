import React from "react";
import { useSelector } from "react-redux";

/**
 * 🔹 AddPatientFormButton — used on the Personal Info form.
 * Handles its own access control and visual styling.
 */
const AddPatientFormButton = ({ onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const access = user?.access || {};

  if (!AddPatientFormButton.shouldShow(access)) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-56 p-4 rounded-lg text-white bg-[#2f3192] hover:bg-[#24267a] transition"
    >
      Add Patient
    </button>
  );
};

// 🔹 static helper for conditional rendering elsewhere
AddPatientFormButton.shouldShow = (access) => Boolean(access?.canAddPatient);

export default AddPatientFormButton;
