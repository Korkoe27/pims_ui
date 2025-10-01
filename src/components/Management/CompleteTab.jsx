import React from "react";
import { useNavigate } from "react-router-dom";

const CompleteTab = ({ onComplete }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border bg-white p-6 w-full max-w-xl">
      <h3 className="text-lg font-semibold mb-2">Complete</h3>
      <p className="text-sm text-gray-600 mb-4">
        Proceed to Payment to continue the main flow.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onComplete}
          className="px-4 py-2 rounded-md bg-[#0F973D] text-white"
        >
          Continue to Payment
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
