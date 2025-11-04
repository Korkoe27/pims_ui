import React, { useState } from "react";
import { useInitiateReviewMutation } from "../redux/api/features/consultationsApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentConsultation } from "../redux/slices/consultationSlice";
import { showToast } from "./ToasterHelper";

/**
 * ReviewInitiationModal Component
 *
 * Allows a lecturer/supervisor to initiate review process:
 * 1. Confirm initiation of review from student version
 * 2. Backend creates new reviewed version with cloned data
 * 3. Lecturer can then edit the reviewed version
 * 4. After changes, lecturer finalizes the reviewed version
 *
 * Error Handling:
 * - If review already initiated: Extracts reviewed version ID from error message
 * - Offers to navigate to existing reviewed version instead
 *
 * Response from backend:
 * {
 *   "detail": "Review initiated successfully...",
 *   "version": {
 *     "id": "<new_reviewed_version_id>",
 *     "version_type": "reviewed",
 *     "is_final": false,
 *     "diff_snapshot": { ... }
 *   }
 * }
 */

const ReviewInitiationModal = ({ version, appointmentId, onClose, onSuccess }) => {
  const [initiateReview, { isLoading }] = useInitiateReviewMutation();
  const [error, setError] = useState(null);
  const [existingReviewId, setExistingReviewId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Extract reviewed version ID from error message
  // Example: "A review has already been initiated for this student consultation. Review version: 34b156db-b964-43f2-affb-85da2e917a37"
  const extractReviewedVersionId = (errorMsg) => {
    const match = errorMsg.match(/Review version:\s*([a-f0-9\-]+)/i);
    return match ? match[1] : null;
  };

  const handleInitiate = async () => {
    try {
      setError(null);
      setExistingReviewId(null);

      const result = await initiateReview(version.id).unwrap();

      showToast(
        `Review initiated successfully. New reviewed version created: ${result.version.id.substring(0, 8)}...`,
        "success"
      );

      // Call parent callback to refresh versions list and navigate
      onSuccess?.(result.version);
    } catch (err) {
      console.error("Error initiating review:", err);
      const errorMsg = err.data?.detail || "Failed to initiate review. Please try again.";
      
      // 🔹 Check if review already exists
      if (errorMsg.includes("already been initiated")) {
        const reviewedVersionId = extractReviewedVersionId(errorMsg);
        if (reviewedVersionId) {
          setExistingReviewId(reviewedVersionId);
          setError(`A review has already been initiated for this consultation.\nReview Version: ${reviewedVersionId.substring(0, 8)}...`);
          showToast("Review already initiated. You can navigate to the existing reviewed version.", "info");
          return;
        }
      }

      setError(errorMsg);
      showToast(errorMsg, "error");
    }
  };

  const handleNavigateToExisting = async () => {
    try {
      dispatch(
        setCurrentConsultation({
          id: existingReviewId,
          versionId: existingReviewId,
          version_type: "reviewed",
          is_final: false,
          flowType: "lecturer_reviewing",
        })
      );

      showToast("Navigating to reviewed version...", "success");
      navigate(`/consultation/${appointmentId}?version=${existingReviewId}`);
      onClose?.();
    } catch (err) {
      console.error("Error navigating to reviewed version:", err);
      showToast("Failed to navigate to reviewed version", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="border-b p-6">
          <h2 className="text-xl font-bold text-gray-900">Initiate Review</h2>
          <p className="text-sm text-gray-600 mt-1">Create a reviewed version from student consultation</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>What happens:</strong>
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
              <li>Student consultation data will be cloned</li>
              <li>A new "Reviewed" version will be created</li>
              <li>You can then edit the reviewed version</li>
              <li>Student version remains unchanged</li>
              <li>After edits, you can finalize the reviewed version</li>
            </ul>
          </div>

          {/* Student Version Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Student Consultation</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <span className="font-semibold">ID:</span> {version.id.substring(0, 8)}...
              </p>
              <p>
                <span className="font-semibold">Type:</span> Student
              </p>
              <p>
                <span className="font-semibold">Created:</span>{" "}
                {new Date(version.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
              <p className="text-sm text-red-700 whitespace-pre-wrap">{error}</p>
              
              {/* Navigate to existing reviewed version button */}
              {existingReviewId && (
                <button
                  onClick={handleNavigateToExisting}
                  className="w-full px-4 py-2 rounded font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  Go to Existing Reviewed Version
                </button>
              )}
            </div>
          )}

          {/* Warning Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-xs text-yellow-900">
              ⚠️ <strong>Note:</strong> This action cannot be undone. A new version will be created and the
              student version will be locked for review.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleInitiate}
            disabled={isLoading || !!existingReviewId}
            className="px-4 py-2 rounded font-semibold text-white bg-purple-600 hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
                Initiating...
              </>
            ) : (
              "Initiate Review"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewInitiationModal;
