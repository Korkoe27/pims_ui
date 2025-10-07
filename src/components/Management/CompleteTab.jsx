import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCompleteConsultationMutation } from "../../redux/api/features/consultationApi";
import { showToast } from "../ToasterHelper";

const CompleteTab = ({ appointmentId }) => {
  const navigate = useNavigate();
  const consultationState = useSelector((state) => state.consultation);
  const consultationId = consultationState.consultationId;
  const canComplete = consultationState.permissions.can_complete;

  const [completeConsultation, { isLoading }] =
    useCompleteConsultationMutation();

  const handleComplete = async () => {
    if (!consultationId) {
      showToast("Consultation not found.", "error");
      return;
    }

    try {
      await completeConsultation(consultationId).unwrap();
      showToast("Consultation completed successfully!", "success");
      navigate("/");
    } catch (error) {
      if (error.status === 409 && error.data?.error === "GUARD_FAILED") {
        const missing = error.data.missing || [];
        showToast(`Cannot complete: Missing ${missing.join(", ")}`, "error");
      } else {
        const errorMessage =
          error?.data?.error || "Failed to complete consultation";
        showToast(errorMessage, "error");
      }
    }
  };

  return (
    <div className="rounded-md border bg-white p-6 w-full max-w-xl">
      <h3 className="text-lg font-semibold mb-2">Complete Consultation</h3>
      <p className="text-sm text-gray-600 mb-4">
        Finalize the consultation. This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleComplete}
          disabled={!canComplete || isLoading}
          className="px-4 py-2 rounded-md bg-[#0F973D] text-white disabled:opacity-60"
        >
          {isLoading ? "Completing..." : "Complete Consultation"}
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-md border"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CompleteTab;
