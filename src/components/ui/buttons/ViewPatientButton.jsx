import React from "react";
import { useSelector } from "react-redux";

/**
 * 🔹 ViewPatientButton — opens detailed patient info.
 * Handles its own access control.
 */
const ViewPatientButton = ({ onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const access = user?.access || {};

  if (!ViewPatientButton.shouldShow(access)) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-200 
                 font-medium rounded-lg text-sm px-4 py-2 transition-all"
    >
      View
    </button>
  );
};

ViewPatientButton.shouldShow = (access) => Boolean(access?.canViewPatients);

export default ViewPatientButton;
