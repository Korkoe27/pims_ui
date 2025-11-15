// src/components/ui/buttons/ReviewButton.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFetchConsultationVersionsQuery } from "../../../redux/api/features/consultationsApi";
import ReviewModal from "../../ReviewModal";

/**
 * ReviewButton Component (Dynamic)
 *
 * Single button that:
 * 1. Shows for lecturers on "submitted for review" / "under review" appointments
 * 2. Checks if review version exists
 * 3. Shows "Continue Review" if exists, "Start Review" if not
 * 4. Opens unified ReviewModal
 * 5. Modal handles: check existing → create if needed → navigate
 */

const ReviewButton = ({ appointment }) => {
  const { user } = useSelector((s) => s.auth);
  const roleCodes = user?.role_codes || [];
  const [showModal, setShowModal] = useState(false);

  // 🔹 Fetch consultation versions to check for existing review
  const { data: versions = [] } = useFetchConsultationVersionsQuery(
    appointment?.id,
    { skip: !appointment?.id }
  );

  // 🔹 Show only for lecturers on submitted/under-review appointments
  if (!ReviewButton.shouldShow(roleCodes, appointment)) return null;

  // 🔹 Check if review version already exists
  const hasReview = versions.some(
    (v) => v.version_type === "review" && !v.is_final
  );

  // 🔹 Determine button label based on review existence
  let label = "Start Review";
  let tooltip = "Initiate review of this consultation";

  if (hasReview) {
    label = "Continue Review";
    tooltip = "Review and finalize this case";
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
ReviewButton.shouldShow = (roleCodes, appointment = {}) => {
  const status = (appointment.status || "").toLowerCase();

  // Only supervisors can review
  if (!roleCodes.includes("supervisor")) {
    return false;
  }

  // Only on submitted or under-review appointments
  if (["submitted for review", "under review"].includes(status)) {
    return true;
  }

  return false;
};

export default ReviewButton;