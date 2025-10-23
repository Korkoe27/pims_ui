import React, { useState, useEffect } from "react";
import useGrading from "../hooks/useGrading";

const SupervisorGradingButton = ({
  appointmentId,
  section,
  sectionLabel = "Supervisor Grading",
  consultation_flow, // 🔹 Determines if we should show
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState("");
  const [remarks, setRemarks] = useState("");

  // ✅ Always call hooks at the top level
  const { existingGrading, submitGrading, isLoading } = useGrading(
    appointmentId,
    section
  );

  // Pre-populate form with existing grading data
  useEffect(() => {
    if (existingGrading) {
      setScore(existingGrading.score?.toString() || "");
      setRemarks(existingGrading.remarks || "");
    }
  }, [existingGrading]);

  // ✅ Safe early return AFTER hooks
  if (consultation_flow !== "consultation_review") {
    return null;
  }

  const handleSubmit = async () => {
    const parsedScore = parseFloat(score);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      return alert("Please enter a valid score between 0 and 100.");
    }

    await submitGrading({ score: parsedScore, remarks });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    // Reset to existing values if available
    if (existingGrading) {
      setScore(existingGrading.score?.toString() || "");
      setRemarks(existingGrading.remarks || "");
    } else {
      setScore("");
      setRemarks("");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow ml-auto"
      >
        {sectionLabel}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{sectionLabel}</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Score (0 - 100)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter score as decimal (e.g. 85.5)"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter any feedback..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Score"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupervisorGradingButton;
