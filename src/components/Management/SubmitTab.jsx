import React from "react";
import { useSelector } from "react-redux";
import { useSubmitConsultationMutation } from "../../redux/api/features/consultationApi";
import { showToast } from "../ToasterHelper";

const SubmitTab = ({ appointmentId, setActiveTab }) => {
  const consultationState = useSelector((state) => state.consultation || {});
  const consultationId = consultationState.consultationId;
  const canSubmit = consultationState.permissions?.can_submit_for_review;

  const [submitConsultation, { isLoading }] = useSubmitConsultationMutation();

  const handleSubmit = async () => {
    if (!consultationId) {
      showToast("Consultation not found.", "error");
      return;
    }

    try {
      await submitConsultation(consultationId).unwrap();
      showToast("Successfully submitted for review!", "success");
      // Optionally, refetch consultation or navigate
    } catch (error) {
      if (error.status === 409 && error.data?.error === "GUARD_FAILED") {
        // Show guard failure dialog
        const missing = error.data.missing || [];
        showToast(`Cannot submit: Missing ${missing.join(", ")}`, "error");
      } else {
        const errorMessage =
          error?.data?.error || "Failed to submit for review";
        showToast(errorMessage, "error");
      }
    }
  };

  return (
    <div className="rounded-md border bg-white p-6 w-full max-w-2xl">
      <h3 className="text-lg font-semibold mb-2">Submit for Review</h3>
      <p className="text-sm text-gray-600 mb-4">
        Submitting will notify your supervisor that the consultation is ready
        for review.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 rounded-md bg-[#2f3192] text-white disabled:opacity-60 flex items-center gap-2"
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            "Submit for Review"
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("logs")}
          className="px-4 py-2 rounded-md border"
        >
          Back to Logs
        </button>
      </div>
    </div>
  );
};

export default SubmitTab;
