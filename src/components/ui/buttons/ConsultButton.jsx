const ConsultButton = ({ appointment, role, onClick }) => {
  // guard: if appointment is missing, don't render
  if (!appointment || !appointment.status) return null;

  const status = appointment.status.toLowerCase();
  let label = null;

  // If the consultation is already completed, we'll render a disabled
  // Continue Consultation button so users can see the action but not perform it.
  const isConsultationCompleted =
    status === "consultation completed" || status === "completed";

  if (role === "student") {
    if (status === "scheduled") {
      label = "Consult";
    } else if (
      [
        "consultation in progress",
        "examinations recorded",
        "diagnosis added",
      ].includes(status)
    ) {
      label = "Continue Consultation";
    } else if (
      ["management created", "case management guide created"].includes(status)
    ) {
      // Management exists but consultation is not finished — continue the consultation
      label = "Continue Consultation";
    }
  }

  if (role === "lecturer") {
    if (status === "submitted for review") {
      label = "Review Case";
    } else if (status === "under review") {
      label = "Continue Review";
    } else if (status === "scheduled") {
      label = "Consult";
    } else if (
      [
        "consultation in progress",
        "examinations recorded",
        "diagnosis added",
      ].includes(status)
    ) {
      label = "Continue Consultation";
    } else if (
      status === "management created" ||
      status === "case management guide created"
    ) {
      // For lecturers allow continuing (to review/complete the consultation)
      label = "Continue Consultation";
    }
  }

  // If there's no label for this status, only render a disabled
  // Continue Consultation button when consultation is completed.
  if (!label && !isConsultationCompleted) return null;

  const finalLabel = label || "Continue Consultation";

  return (
    <button
      className={[
        "text-white px-4 py-2 rounded-lg",
        isConsultationCompleted
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#2f3192]",
      ].join(" ")}
      onClick={() => !isConsultationCompleted && onClick(appointment)}
      disabled={isConsultationCompleted}
      aria-disabled={isConsultationCompleted}
    >
      {finalLabel}
    </button>
  );
};

export default ConsultButton;
