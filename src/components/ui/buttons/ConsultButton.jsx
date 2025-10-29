import React from "react";
import { useSelector } from "react-redux";

const ConsultButton = ({ appointment, onClick }) => {
  const access = useSelector((s) => s.auth?.user?.access || {});
  if (!ConsultButton.shouldShow(access, appointment)) return null;

  const status = (appointment.status || "").toLowerCase();
  let label = "Start Consultation";

  // 🧩 Determine label based on status
  if (
    [
      "consultation in progress",
      "case history recorded",
      "visual acuity recorded",
      "examinations recorded",
      "diagnosis added",
      "management created",
      "case management guide created",
      "returned for changes",
    ].includes(status)
  ) {
    label = "Continue Consultation";
  } else if (status === "consultation completed") {
    label = "View Consultation";
  } else if (
    ["submitted for review", "under review"].includes(status) &&
    access?.canGradeStudents
  ) {
    // Lecturer reviewing a case
    label = "Review Case";
  }

  return (
    <button
      onClick={() =>
        onClick(appointment, {
          isReview: ["submitted for review", "under review"].includes(status),
        })
      }
      className="px-4 py-2 bg-[#2f3192] hover:bg-[#24267a] text-white rounded-lg font-medium transition-all"
    >
      {label}
    </button>
  );
};

// 🧠 Decide visibility based on user access and appointment status
ConsultButton.shouldShow = (access, appointment = null) => {
  const status = (appointment?.status || "").toLowerCase();

  // Lecturer can see review button for review states
  if (
    access?.canGradeStudents &&
    ["submitted for review", "under review"].includes(status)
  ) {
    return true;
  }

  // Student can see consult button if case is editable
  if (
    access?.canStartConsultation &&
    ![
      "submitted for review",
      "under review",
      "scored",
      "consultation completed",
    ].includes(status)
  ) {
    return true;
  }

  return false;
};

export default ConsultButton;
