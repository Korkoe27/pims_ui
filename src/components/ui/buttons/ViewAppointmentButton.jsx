import React from "react";
import { useSelector } from "react-redux";

const ViewAppointmentButton = ({ appointment, onView }) => {
  const access = useSelector((s) => s.auth?.user?.access || {});

  if (!ViewAppointmentButton.shouldShow(access)) return null;

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
ViewAppointmentButton.shouldShow = (access = {}) => {
  return access?.canViewAppointments || access?.canStartConsultation || access?.canCompleteConsultations;
};

export default ViewAppointmentButton;
