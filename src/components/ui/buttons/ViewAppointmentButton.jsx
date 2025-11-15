import React from "react";
import { useSelector } from "react-redux";

const ViewAppointmentButton = ({ appointment, onView }) => {
  const { user } = useSelector((s) => s.auth);
  const roleCodes = user?.role_codes || [];

  if (!ViewAppointmentButton.shouldShow(roleCodes)) return null;

  return (
    <button
      onClick={() => onView(appointment)}
      className="bg-[#2f3192] text-white px-4 py-2 rounded hover:bg-[#1e226d] transition"
    >
      View More
    </button>
  );
};

// 🔹 Visibility logic - show only if user can view appointments
ViewAppointmentButton.shouldShow = (roleCodes = []) => {
  const allowedRoles = ["frontdesk", "student", "clinician", "supervisor", "coordinator"];
  return roleCodes.some((code) => allowedRoles.includes(code));
};

export default ViewAppointmentButton;
