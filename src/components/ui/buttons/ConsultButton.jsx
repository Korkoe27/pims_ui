import React from "react";

/**
 * 🔹 ConsultButton — Access-based action button for consultations.
 *
 * Rules:
 * - Uses `access` object instead of `role`.
 * - Displays appropriate label based on appointment status.
 * - Disables button for completed consultations.
 */
const ConsultButton = ({ appointment, access = {}, onClick }) => {
  if (!appointment?.status) return null;

  const status = appointment.status.toLowerCase();
  let label = null;

  const isConsultationCompleted =
    status === "consultation completed" ||
    status === "completed" ||
    status === "consultation finalized";

  // ✅ Determine allowed actions by access permissions
  const canConsult = access?.canConsultPatient;
  const canReview = access?.canReviewConsultation;

  // 🩺 Consultation permissions
  if (canConsult) {
    if (status === "scheduled") {
      label = "Consult";
    } else if (
      [
        "consultation in progress",
        "examination created",
        "examinations recorded",
        "diagnosis added",
        "management created",
        "case management guide created",
      ].includes(status)
    ) {
      label = "Continue Consultation";
    }
  }

  // 🧾 Review permissions
  if (canReview) {
    if (status === "submitted for review") {
      label = "Review Case";
    } else if (status === "under review") {
      label = "Continue Review";
    } else if (
      [
        "consultation in progress",
        "examination created",
        "examinations recorded",
        "diagnosis added",
        "management created",
        "case management guide created",
      ].includes(status)
    ) {
      label = "Continue Consultation";
    }
  }

  // ❌ If no applicable label and not completed, skip rendering
  if (!label && !isConsultationCompleted) return null;

  const finalLabel = label || "Continue Consultation";

  return (
    <button
      className={[
        "px-4 py-2 rounded-lg font-medium text-white transition",
        isConsultationCompleted
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#2f3192] hover:bg-[#262777]",
      ].join(" ")}
      onClick={() => !isConsultationCompleted && onClick?.(appointment)}
      disabled={isConsultationCompleted}
      aria-disabled={isConsultationCompleted}
    >
      {finalLabel}
    </button>
  );
};

export default ConsultButton;
