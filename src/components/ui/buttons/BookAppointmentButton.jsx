import React from "react";
import { useSelector } from "react-redux";

/**
 * 🔹 BookAppointmentButton — used anywhere a patient can be scheduled.
 * Self-contained and access-aware.
 */
const BookAppointmentButton = ({ onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const access = user?.access || {};

  if (!BookAppointmentButton.shouldShow(access)) return null;

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
BookAppointmentButton.shouldShow = (access) => Boolean(access?.canCreateAppointment);

export default BookAppointmentButton;
