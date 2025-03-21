import React, { useEffect, useState } from "react";
import useCaseHistoryData from "../hooks/useCaseHistoryData";
import ErrorModal from "./ErrorModal";

const CaseHistory = ({ patientId, appointmentId, nextTab, setActiveTab }) => {
  const {
    caseHistory,
    isLoading,
    createCaseHistory,
    createCaseHistoryStatus: { isLoading: isSaving },
  } = useCaseHistoryData(patientId, appointmentId);

  const [chiefComplaint, setChiefComplaint] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (caseHistory) {
      console.log("🔥 Fetched case history:", caseHistory);
      setChiefComplaint(caseHistory?.chief_complaint || "");
    }
  }, [caseHistory]);

  // ✅ Local save-and-proceed handler
  const handleSaveAndProceed = async () => {
    setErrorMessage(null);
    setShowErrorModal(false);

    if (!chiefComplaint.trim()) {
      setErrorMessage({ detail: "Chief complaint cannot be empty." });
      setShowErrorModal(true);
      return;
    }

    const payload = {
      appointment: appointmentId,
      chief_complaint: chiefComplaint,
      condition_details: [], // We'll add these later
    };

    try {
      await createCaseHistory(payload).unwrap();
      console.log("✅ Chief complaint saved");
      setActiveTab("personal history"); // ⏭️ move to the next tab
    } catch (error) {
      console.error("❌ Error saving:", error);
      setErrorMessage(
        error?.data || { detail: "An unexpected error occurred." }
      );
      setShowErrorModal(true);
    }
  };

  if (isLoading) return <p>Loading case history...</p>;

  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hello World 👋</h1>

      {/* Chief Complaint Input */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Chief Complaint</label>
        <textarea
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          className="w-full border p-3 rounded-md"
          placeholder="Enter chief complaint..."
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSaveAndProceed}
          disabled={isSaving}
          className={`px-6 py-2 rounded-md transition text-white ${
            isSaving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSaving ? "Saving..." : "Save and Proceed"}
        </button>
      </div>

      {/* Error Modal */}
      {showErrorModal && errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default CaseHistory;
