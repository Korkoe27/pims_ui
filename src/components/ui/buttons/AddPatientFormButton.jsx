import React from "react";
import { useSelector } from "react-redux";

/**
 * 🔹 AddPatientFormButton — used on the Personal Info form.
 * Handles its own access control and visual styling.
 */
const AddPatientFormButton = ({ onClick, isLoading = false }) => {
  const { user } = useSelector((state) => state.auth);
  const roleCodes = user?.role_codes || [];

  if (!AddPatientFormButton.shouldShow(roleCodes)) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="w-56 p-4 rounded-lg text-white bg-[#2f3192] hover:bg-[#24267a] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Adding Patient...</span>
        </>
      ) : (
        "Add Patient"
      )}
    </button>
  );
};

// 🔹 static helper for conditional rendering elsewhere
AddPatientFormButton.shouldShow = (roleCodes) => {
  const allowedRoles = ["frontdesk", "supervisor", "coordinator"];
  return roleCodes.some((code) => allowedRoles.includes(code));
};

export default AddPatientFormButton;
