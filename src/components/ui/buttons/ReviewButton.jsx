// src/components/ui/buttons/ReviewButton.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ReviewModal from "../../ReviewModal";

/**
 * ReviewButton Component (Simplified)
 *
 * Single button that:
 * 1. Shows for lecturers on "submitted for review" / "under review" appointments
 * 2. Opens unified ReviewModal
 * 3. Modal handles: check existing → create if needed → navigate
 *
 * Much simpler than before - delegates all logic to ReviewModal
 */

const ReviewButton = ({ appointment }) => {
  const access = useSelector((s) => s.auth?.user?.access || {});
  const [showModal, setShowModal] = useState(false);

  // 🔹 Show only for lecturers on submitted/under-review appointments
  if (!ReviewButton.shouldShow(access, appointment)) return null;

  const status = (appointment.status || "").toLowerCase();

  let label = "Review Case";
  let tooltip = "";

  if (status === "under review") {
    label = "Continue Review";
    tooltip = "Review and finalize this case";
  } else if (status === "submitted for review") {
    label = "Start Review";
    tooltip = "Initiate review of this consultation";
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        title={tooltip}
        className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
      >
        📋 {label}
      </button>

      {/* Unified Review Modal */}
      {showModal && (
        <ReviewModal
          appointmentId={appointment.id}
          studentVersionId={appointment.latest_version_id} // Latest student version
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            // Modal auto-navigates on success
          }}
        />
      )}
    </>
  );
};

// 🔹 Visibility logic
ReviewButton.shouldShow = (access, appointment = {}) => {
  const status = (appointment.status || "").toLowerCase();

  // Only lecturers can review
  if (!access?.canGradeStudents) {
    return false;
  }

  // Only on submitted or under-review appointments
  if (["submitted for review", "under review"].includes(status)) {
    return true;
  }

  return false;
};

export default ReviewButton;