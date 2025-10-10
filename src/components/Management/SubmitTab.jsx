import React, { useState } from "react";

const SubmitTab = ({
  onSubmitForReview,
  isCreatingManagementPlan,
  isSubmittingForReview,
  setActiveTab,
  permissions,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmitClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    await onSubmitForReview();
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <div className="rounded-md border bg-white p-6 w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-2">Submit for Review</h3>
        <p className="text-sm text-gray-600 mb-4">
          Submitting will notify your supervisor that the Management section is
          ready for review. You will not be able to make further changes until
          the review is complete.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Important:</strong> Make sure you have completed all
            sections before submitting. Once submitted, you cannot edit until
            your supervisor reviews and potentially returns the case for
            changes.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmitClick}
            className="px-4 py-2 rounded-md bg-[#2f3192] text-white disabled:opacity-60 flex items-center gap-2"
            disabled={isCreatingManagementPlan || isSubmittingForReview}
          >
            {isSubmittingForReview ? (
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
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Back to Logs
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-3">Confirm Submission</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to submit this case for supervisor review?
              This action cannot be undone, and you will not be able to make
              changes until your supervisor completes the review.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <p className="text-sm text-blue-800">
                📋 Please ensure you have:
              </p>
              <ul className="text-sm text-blue-800 mt-1 ml-4 list-disc">
                <li>Completed all examination sections</li>
                <li>Added differential diagnosis</li>
                <li>Created management plan</li>
                <li>Filled case management guide</li>
                <li>Added relevant logs</li>
              </ul>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancelSubmit}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="px-4 py-2 rounded-md bg-[#2f3192] text-white hover:bg-[#1f237a]"
                disabled={isSubmittingForReview}
              >
                {isSubmittingForReview
                  ? "Submitting..."
                  : "Yes, Submit for Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmitTab;
