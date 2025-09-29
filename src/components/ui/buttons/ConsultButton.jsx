const ConsultButton = ({ appointment, role, onClick }) => {
  // guard: if appointment is missing, don't render
  if (!appointment || !appointment.status) return null;

  const status = appointment.status.toLowerCase();
  let label = null;

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
      label = "Submit for Review";
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
    } else if (status === "management created") {
      label = null; // lecturers shouldn't act here
    }
  }

  if (!label) return null;

  return (
    <button
      className="text-white bg-[#2f3192] px-4 py-2 rounded-lg"
      onClick={() => onClick(appointment)}
    >
      {label}
    </button>
  );
};

export default ConsultButton;
