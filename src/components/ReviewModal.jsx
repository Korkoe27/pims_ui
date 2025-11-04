import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useFetchConsultationVersionsQuery,
} from "../redux/api/features/consultationsApi";
import { setCurrentConsultation } from "../redux/slices/consultationSlice";
import { showToast } from "./ToasterHelper";
import useInitiateReview from "../hooks/useInitiateReview";

/**
 * ReviewModal Component (Unified)
 *
 * Single modal that:
 * 1. Fetches all consultation versions
 * 2. Checks if reviewed version exists
 * 3. If exists → Fetch and navigate to it
 * 4. If not → Initiate review (create new reviewed version)
 * 5. Auto-navigates to reviewed version
 *
 * Uses new endpoint: POST /consultations/versions/{version_id}/initiate-review/
 * Handles both 200 OK (review exists) and 201 CREATED (review created)
 * 
 * Error Handling:
 * - Shows clear steps: "Checking... → Creating/Fetching... → Navigating..."
 * - Handles already-initiated reviews gracefully
 * - Shows cloned records count on successful creation
 */

const ReviewModal = ({ appointmentId, studentVersionId, onClose, onSuccess }) => {
  const [step, setStep] = useState("checking"); // checking → processing → navigating
  const [error, setError] = useState(null);
  const [reviewedVersion, setReviewedVersion] = useState(null);
  const [recordsCloned, setRecordsCloned] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Fetch all versions to check if reviewed version exists
  const { data: versions = [], isLoading: loadingVersions } =
    useFetchConsultationVersionsQuery(appointmentId, {
      skip: !appointmentId,
    });

  // 🔹 Use new review initiation hook
  const { initiateReview, isLoading: initiating } =
    useInitiateReview(appointmentId);

  // 🔹 Auto-start the review process when modal opens
  useEffect(() => {
    const processReview = async () => {
      try {
        setStep("checking");
        setError(null);

        // 1️⃣ Check if reviewed version already exists
        const existingReviewed = versions.find(
          (v) => v.version_type === "review" && !v.is_final
        );

        if (existingReviewed) {
          console.log("✅ Found existing review version:", existingReviewed.id);
          setReviewedVersion(existingReviewed);
          setStep("navigating");
          handleNavigateToReviewed(existingReviewed);
          return;
        }

        // 2️⃣ If not, initiate review to create new review version
        console.log("📋 No review version found, initiating review...");
        setStep("processing");

        const result = await initiateReview(studentVersionId);

        if (!result.success) {
          throw new Error(result.error);
        }

        console.log("✅ Review initiated successfully:", result.version);
        setReviewedVersion(result.version);
        if (result.recordsCloned) {
          setRecordsCloned(result.recordsCloned);
        }
        setStep("navigating");

        // Auto-navigate (initiateReview hook already handles navigation)
        // Just close the modal
        onSuccess?.();
        onClose?.();
      } catch (err) {
        console.error("❌ Error processing review:", err);
        const errorMsg = err.message || "Failed to process review";
        setError(errorMsg);
        setStep("error");
      }
    };

    if (versions.length > 0 || !loadingVersions) {
      processReview();
    }
  }, [versions, loadingVersions, studentVersionId, initiateReview, onSuccess, onClose]);

  const handleNavigateToReviewed = (version) => {
    try {
      // Dispatch to Redux
      dispatch(
        setCurrentConsultation({
          id: version.id,
          versionId: version.id,
          version_type: version.version_type || "review",
          is_final: version.is_final || false,
          flowType: "lecturer_reviewing",
          appointmentId,
        })
      );

      // Navigate to consultation view
      navigate(`/consultation/${appointmentId}?version=${version.id}`);

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Navigation error:", err);
      setError("Failed to navigate to review version");
      setStep("error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="border-b p-6">
          <h2 className="text-xl font-bold text-gray-900">Initiating Review</h2>
          <p className="text-sm text-gray-600 mt-1">Processing your review request...</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 min-h-48 flex flex-col justify-center">
          {/* Loading/Processing State */}
          {(step === "checking" || step === "processing") && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-r-transparent"></div>
                <p className="text-sm text-gray-700 font-semibold">
                  {step === "checking"
                    ? "Checking for existing review..."
                    : "Creating review version..."}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                  <li>Checking for existing review version</li>
                  <li>If found: Will fetch and open it</li>
                  <li>If not: Will create new review version</li>
                  <li>Auto-navigating to review view...</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigating State */}
          {step === "navigating" && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="inline-block text-4xl">✅</div>
              </div>
              <p className="text-sm text-gray-700 font-semibold">
                Review ready! Navigating to review editor...
              </p>
            </div>
          )}

          {/* Error State */}
          {step === "error" && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="inline-block text-4xl">⚠️</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700 font-semibold mb-2">Error</p>
                <p className="text-xs text-red-600">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex gap-3 justify-end">
          {step === "error" && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setStep("checking");
                  setError(null);
                }}
                className="px-4 py-2 rounded font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Retry
              </button>
            </>
          )}

          {(step === "checking" || step === "processing" || step === "navigating") && (
            <button
              onClick={onClose}
              disabled
              className="px-4 py-2 rounded font-semibold text-gray-700 bg-gray-200 cursor-not-allowed opacity-50"
            >
              Please wait...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
