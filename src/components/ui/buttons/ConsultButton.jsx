// components/ui/buttons/ConsultButton.jsx
import { useSelector } from "react-redux";
import React from "react";

const ConsultButton = ({ appointment, onClick }) => {
  const access = useSelector((s) => s.auth?.user?.access || {});
  if (!ConsultButton.shouldShow(access, appointment)) return null;

  const status = appointment.status.toLowerCase();
  let label = "Start Consultation";

  if (
    [
      "consultation in progress",
      "examinations recorded",
      "diagnosis added",
      "management created",
    ].includes(status)
  ) label = "Continue Consultation";
  else if (status === "consultation completed") label = "View Consultation";

  return (
    <button
      onClick={() => onClick(appointment)}
      className="px-4 py-2 bg-[#2f3192] hover:bg-[#24267a] text-white rounded-lg font-medium transition-all"
    >
      {label}
    </button>
  );
};

// 🧠 Static helper: tells whether this button is relevant for current user
ConsultButton.shouldShow = (access, appointment = null) => {
  return Boolean(access?.canStartConsultation);
};

export default ConsultButton;
