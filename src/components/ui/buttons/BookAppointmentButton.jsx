import React from "react";
import { useSelector } from "react-redux";

/**
 * 🔹 BookAppointmentButton — used anywhere a patient can be scheduled.
 * Self-contained and access-aware.
 */
const BookAppointmentButton = ({ onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const roleCodes = user?.role_codes || [];

  if (!BookAppointmentButton.shouldShow(roleCodes)) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 
                 font-medium rounded-lg text-sm px-4 py-2 transition-all"
    >
      Book Appointment
    </button>
  );
};

/* ✅ static helper for table header or conditional UI logic */
BookAppointmentButton.shouldShow = (roleCodes) => {
  const allowedRoles = ["frontdesk"];
  return roleCodes.some((code) => allowedRoles.includes(code));
};

export default BookAppointmentButton;
