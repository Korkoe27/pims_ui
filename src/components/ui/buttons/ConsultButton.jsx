const ConsultButton = ({ appointment, role, onClick }) => {
  const status = appointment.status?.toLowerCase();
  console.log("🔍 status:", status);
  let label = null;

  if (role === "student") {
    if (status === "scheduled") label = "Consult";
    else if (status === "consultation in progress")
      label = "Continue Consultation";
    else if (["management_created", "case_mgmt_guide_created"].includes(status))
      label = "Submit for Review";
  }

  if (role === "lecturer") {
    if (status === "submitted_for_review") label = "Review Case";
    else if (status === "under_review") label = "Continue Review";
    else if (status === "scheduled")
      label = "Consult"; // 👈 allow lecturers too
    else if (status === "consultation in progress")
      label = "Continue Consultation";
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
