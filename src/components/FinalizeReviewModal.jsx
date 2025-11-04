import React, { useState } from "react";
import { useFinalizeConsultationMutation } from "../redux/api/features/consultationsApi";
import { showToast } from "./ToasterHelper";

/**
 * FinalizeReviewModal Component
 *
 * Allows a lecturer/supervisor to finalize a reviewed consultation:
 * 1. Confirms finalization - reviewed version becomes immutable
 * 2. Displays diff_snapshot showing all changes made
 * 3. Marks version as is_final=true
 * 4. Backend records finalized_by and finalized_at timestamps
 *
 * After finalization:
 * - The reviewed version is locked (read-only)
 * - All changes are recorded in diff_snapshot
 * - Student version remains as reference
 * - If further review needed, must create new student version
 */

const FinalizeReviewModal = ({ version, onClose, onSuccess }) => {
  const [finalizeConsultation, { isLoading }] = useFinalizeConsultationMutation();
  const [error, setError] = useState(null);

  const handleFinalize = async () => {
    try {
      setError(null);

      const result = await finalizeConsultation(version.id).unwrap();

      showToast("Consultation finalized successfully. Version is now locked.", "success");

      // Call parent callback to refresh versions list
      onSuccess?.();
    } catch (err) {
      console.error("Error finalizing consultation:", err);
      const errorMsg = err.data?.detail || "Failed to finalize consultation. Please try again.";
      setError(errorMsg);
      showToast(errorMsg, "error");
    }
  };

  // Extract diff_snapshot if available
  const diffSnapshot = version.diff_snapshot || {};
  const changes = diffSnapshot.changes || {};
  const changeCount = Object.keys(changes).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="border-b p-6 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Finalize Reviewed Consultation</h2>
          <p className="text-sm text-gray-600 mt-1">Lock this version and record finalization</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Info Box */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900">
              <strong>What happens:</strong>
            </p>
            <ul className="text-sm text-green-800 mt-2 space-y-1 list-disc list-inside">
              <li>This reviewed version will be locked permanently</li>
              <li>All changes will be recorded in the audit trail</li>
              <li>Read-only access will remain available</li>
              <li>No further edits can be made to this version</li>
              <li>If corrections needed, a new version must be created</li>
            </ul>
          </div>

          {/* Reviewed Version Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Reviewed Consultation</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <span className="font-semibold">ID:</span> {version.id.substring(0, 8)}...
              </p>
              <p>
                <span className="font-semibold">Type:</span> Reviewed
              </p>
              <p>
                <span className="font-semibold">Created:</span>{" "}
                {new Date(version.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Changes Summary */}
          {changeCount > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                Changes Made ({changeCount} field{changeCount !== 1 ? "s" : ""})
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(changes).map(([field, change]) => (
                  <div key={field} className="text-xs bg-white rounded p-2 border border-blue-100">
                    <p className="font-semibold text-blue-800">{field}</p>
                    {change.before && (
                      <p className="text-red-700">
                        <span className="font-semibold">Before:</span> {String(change.before).substring(0, 100)}
                        {String(change.before).length > 100 ? "..." : ""}
                      </p>
                    )}
                    {change.after && (
                      <p className="text-green-700">
                        <span className="font-semibold">After:</span> {String(change.after).substring(0, 100)}
                        {String(change.after).length > 100 ? "..." : ""}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cloning Info */}
          {diffSnapshot.cloned_from && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-purple-900 mb-2">Cloning Information</p>
              <div className="text-xs text-purple-700 space-y-1">
                <p>
                  <span className="font-semibold">Cloned from:</span> {diffSnapshot.cloned_from.substring(0, 8)}...
                </p>
                {diffSnapshot.cloned_at && (
                  <p>
                    <span className="font-semibold">Cloned at:</span>{" "}
                    {new Date(diffSnapshot.cloned_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Warning Box */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-xs text-red-900">
              ⚠️ <strong>IMPORTANT:</strong> This action is permanent. The version will be locked and cannot be
              edited. All changes will be permanently recorded.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex gap-3 justify-end sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleFinalize}
            disabled={isLoading}
            className="px-4 py-2 rounded font-semibold text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
                Finalizing...
              </>
            ) : (
              "Finalize Consultation"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalizeReviewModal;
