import React from "react";

const ConsultButton = ({ appointment, access, onClick }) => {
  if (!appointment || !appointment.status) return null;

  const status = appointment.status.toLowerCase();
  let label = null;

  // ✅ Lecturer flow (based on access permissions)
  if (access.canGradeStudents || access.canEditConsultations ) {
    if (
      [
        "consultation in progress",
        "examinations recorded",
        "diagnosis added",
        "management created",
      ].includes(status)
    ) {
      label = "Review Consultation";
    } else if (status === "scheduled" && access.canStartConsultation) {
      label = "Start Consultation";
    }
  }

  // ✅ Student flow (based on access permissions)
  else if (access.canStartConsultation) {
    if (status === "scheduled") {
      label = "Consult";
    } else if (
      [
        "consultation in progress",
        "examinations recorded",
        "diagnosis added",
        "management created",
      ].includes(status)
    ) {
      label = "Continue Consultation";
    }
  }

  if (!label) return null;

  return (
    <button
      onClick={() => onClick(appointment)}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
    >
      {label}
    </button>
  );
};

export default ConsultButton;
