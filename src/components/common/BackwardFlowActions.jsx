import React, { useState } from "react";
import { canPerformBackwardFlow } from "../../utils/permissionUtils";

/**
 * Component for backward flow actions like "Return for Changes" and "Lecturer Override"
 */
const BackwardFlowActions = ({
  userRole,
  appointmentStatus,
  appointmentId,
  isStudentCase = false,
  onReturnForChanges,
  onLecturerOverride,
  isLoading = false,
}) => {
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");

  const canReturn = canPerformBackwardFlow(
    userRole,
    appointmentStatus,
    "return_for_changes"
  );
  const canOverride = canPerformBackwardFlow(
    userRole,
    appointmentStatus,
    "lecturer_override"
  );

  if (!canReturn && !canOverride) {
    return null;
  }

  const handleReturnForChanges = async () => {
    if (!returnReason.trim()) {
      alert("Please provide a reason for returning this case.");
      return;
    }

    try {
      await onReturnForChanges?.(appointmentId, returnReason);
      setShowReturnModal(false);
      setReturnReason("");
    } catch (error) {
      console.error("Failed to return for changes:", error);
    }
  };

  const handleLecturerOverride = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to override and edit this case? This will allow you to make changes and may require re-grading."
    );

    if (confirmed) {
      try {
        await onLecturerOverride?.(appointmentId);
      } catch (error) {
        console.error("Failed to override:", error);
      }
    }
  };

  return (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <h4 className="font-semibold text-blue-800 mb-2">Reviewer Actions</h4>
      <div className="flex gap-3">
        {/* Return for Changes */}
        {canReturn && isStudentCase && (
          <button
            onClick={() => setShowReturnModal(true)}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
          >
            📤 Return for Changes
          </button>
        )}

        {/* Lecturer Override */}
        {canOverride && (
          <button
            onClick={handleLecturerOverride}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            ⚡ Lecturer Override
          </button>
        )}
      </div>

      {/* Return for Changes Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Return Case for Changes
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Reason for returning (required):
              </label>
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full p-3 border rounded-md"
                rows={4}
                placeholder="Please provide specific feedback on what needs to be changed..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReturnForChanges}
                disabled={!returnReason.trim() || isLoading}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
              >
                {isLoading ? "Returning..." : "Return Case"}
              </button>
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setReturnReason("");
                }}
                className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackwardFlowActions;
