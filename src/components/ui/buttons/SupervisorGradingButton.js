import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetAppointmentDetailsQuery } from "../../../redux/api/features/appointmentsApi";
import useGrading from "../../../hooks/useGrading";

const SupervisorGradingButton = ({
  appointmentId,
  section,
  sectionLabel = "Supervisor Grading",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState("");
  const [remarks, setRemarks] = useState("");

  // ✅ Hooks must always come first
  const userAccess = useSelector((state) => state.auth?.user?.access);
  const canGradeStudents = userAccess?.canGradeStudents;

  // ✅ Fetch appointment details to check review status
  const { data: appointment, isLoading: loadingAppointment } =
    useGetAppointmentDetailsQuery(appointmentId, {
      skip: !appointmentId,
    });

  // ✅ Grading logic hook
  const { existingGrading, submitGrading, isLoading } = useGrading(
    appointmentId,
    section
  );

  // ✅ Pre-fill form if existing grading found
  useEffect(() => {
    if (existingGrading) {
      setScore(existingGrading.score?.toString() || "");
      setRemarks(existingGrading.remarks || "");
    }
  }, [existingGrading]);

  // 🚫 Hide button until we have both user access and appointment data
  if (!userAccess || loadingAppointment) return null;

  // 🚫 Show only if BOTH conditions are met
  const isSubmittedForReview =
    appointment?.status?.toLowerCase?.() === "submitted for review" ||
    appointment?.is_submitted_for_review === true;

  const canShowButton = canGradeStudents && isSubmittedForReview;
  const hasGrade = !!existingGrading;

  // ✅ Submit handler
  const handleSubmit = async () => {
    const parsedScore = parseFloat(score);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      alert("Please enter a valid score between 0 and 100.");
      return;
    }
    await submitGrading({ score: parsedScore, remarks });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (existingGrading) {
      setScore(existingGrading.score?.toString() || "");
      setRemarks(existingGrading.remarks || "");
    } else {
      setScore("");
      setRemarks("");
    }
  };

  // ✅ Elegant inline score display
  const renderGradeDisplay = () => {
    if (!hasGrade) return null;
    const colorClass =
      existingGrading.score >= 70
        ? "text-green-600"
        : existingGrading.score >= 50
        ? "text-yellow-600"
        : "text-red-600";

    return (
      <div className="flex items-center gap-2 mr-2">
        <span className="text-sm text-gray-600 font-medium">
          Score:
          <span className={`ml-1 font-semibold ${colorClass}`}>
            {existingGrading.score}%
          </span>
        </span>
      </div>
    );
  };

  // ✅ Final render
  return (
    <>
      <div className="flex items-center gap-3">
        {/* 📊 Display grading summary if exists */}
        {renderGradeDisplay()}

        {/* 🎓 Only graders see the button */}
        {canShowButton && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow ml-auto"
          >
            {hasGrade ? "Edit Grading" : sectionLabel}
          </button>
        )}
      </div>

      {/* 🪟 Modal for grading */}
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
