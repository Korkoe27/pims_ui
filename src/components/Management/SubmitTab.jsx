import React from "react";

const SubmitTab = ({
  onSubmitForReview,
  isCreatingManagementPlan,
  isSubmittingForReview,
  setActiveTab,
}) => {
  return (
    <div className="rounded-md border bg-white p-6 w-full max-w-2xl">
      <h3 className="text-lg font-semibold mb-2">Submit for Review</h3>
      <p className="text-sm text-gray-600 mb-4">
        Submitting will notify your supervisor that the Management section is
        ready for review.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onSubmitForReview}
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
          className="px-4 py-2 rounded-md border"
        >
          Back to Logs
        </button>
      </div>
    </div>
  );
};

export default SubmitTab;
