// components/ui/buttons/ConsultButton.jsx
import React from "react";
import { useSelector } from "react-redux";

const ConsultButton = ({ appointment, onClick }) => {
  const access = useSelector((state) => state.auth?.user?.access || {});
  const { canStartConsultation } = access;

  // 🔒 Hide if user doesn’t have consultation rights
  if (!canStartConsultation) return null;
  if (!appointment || !appointment.status) return null;

  const status = appointment.status.toLowerCase();
  let label = null;

  // 🔹 Status-based label (consistent for all users)
  if (status === "scheduled") {
    label = "Start Consultation";
  } else if (
    [
      "consultation in progress",
      "examinations recorded",
      "diagnosis added",
      "management created",
    ].includes(status)
  ) {
    label = "Continue Consultation";
  } else if (status === "consultation completed") {
    label = "View Consultation";
  }

  if (!label) return null;

  return (
    <button
      onClick={() => onClick(appointment)}
      className="px-4 py-2 bg-[#2f3192] hover:bg-[#24267a] text-white rounded-lg font-medium transition-all"
    >
      {label}
    </button>
  );
};

export default ConsultButton;
