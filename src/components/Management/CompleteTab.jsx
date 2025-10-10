import React from "react";
import { useNavigate } from "react-router-dom";

const CompleteTab = ({ onComplete, isCompleting = false, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border bg-white p-6 w-full max-w-xl">
      <h3 className="text-lg font-semibold mb-2">Complete</h3>
      <p className="text-sm text-gray-600 mb-4">Complete the consultation.</p>
      <div className="flex gap-3">
        <button
          onClick={onComplete}
          disabled={isCompleting}
          className={[
            "px-4 py-2 rounded-md text-white",
            isCompleting
              ? "bg-[#0F973D]/60 cursor-not-allowed"
              : "bg-[#0F973D]",
          ].join(" ")}
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
  );
};

export default CompleteTab;