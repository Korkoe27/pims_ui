import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CompleteTab = ({ onComplete, isCompleting = false, setActiveTab }) => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleCompleteClick = () => setShowConfirmModal(true);
  const handleConfirmComplete = async () => {
    setShowConfirmModal(false);
    await onComplete();
  };
  const handleCancelComplete = () => setShowConfirmModal(false);

  return (
    <>
      <div className="rounded-md border bg-white p-6 w-full max-w-xl">
        <h3 className="text-lg font-semibold mb-2">Complete</h3>
        <p className="text-sm text-gray-600 mb-4">
          Complete the consultation.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleCompleteClick}
            disabled={isCompleting}
            className={`px-4 py-2 rounded-md text-white ${
              isCompleting
                ? "bg-[#0F973D]/60 cursor-not-allowed"
                : "bg-[#0F973D]"
            }`}
          >
            {isCompleting ? (
              <>
                <span className="animate-spin inline-block mr-2 h-4 w-4 rounded-full border-b-2 border-white"></span>
                Completing...
              </>
            ) : (
              "Complete Consultation"
            )}
          </button>

          <button
            onClick={() => setActiveTab?.("management")}
            className="px-4 py-2 rounded-md border"
          >
            Back to Management
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-md border"
          >
            Go to Dashboard
          </button>
        </div>
      </div>

      {/* ✅ Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Complete Consultation
              </h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to complete this consultation? This action
                cannot be undone and will finalize all consultation data.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelComplete}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmComplete}
                disabled={isCompleting}
                className="px-4 py-2 bg-[#0F973D] text-white rounded-md hover:bg-[#0F973D]/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isCompleting ? (
                  <>
                    <span className="animate-spin inline-block mr-2 h-4 w-4 rounded-full border-b-2 border-white"></span>
                    Completing...
                  </>
                ) : (
                  "Yes, Complete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompleteTab;
