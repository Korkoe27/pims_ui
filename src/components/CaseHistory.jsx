import React, { useEffect, useState } from "react";
import useCaseHistoryData from "../hooks/useCaseHistoryData";
import SearchableSelect from "./SearchableSelect";
import ErrorModal from "./ErrorModal";

const CaseHistory = ({ patientId, appointmentId, nextTab, setActiveTab }) => {
  const {
    caseHistory,
    ocularConditions,
    isLoading,
    createCaseHistory,
    createCaseHistoryStatus: { isLoading: isSaving },
  } = useCaseHistoryData(patientId, appointmentId);

  const [chiefComplaint, setChiefComplaint] = useState("");
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (caseHistory) {
      console.log("🔥 Fetched case history:", caseHistory);
      setChiefComplaint(caseHistory?.chief_complaint || "");

      const mapped = (caseHistory?.condition_details || []).map((item) => ({
        id: item.ocular_condition,
        name: item.ocular_condition_name || "",
      }));

      setSelectedConditions(mapped);
    }
  }, [caseHistory]);

  // ✅ Save and proceed with only chiefComplaint for now
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
      condition_details: [], // conditions will be added later
    };

    try {
      await createCaseHistory(payload).unwrap();
      console.log("✅ Case history saved");
      setActiveTab("personal history");
    } catch (error) {
      console.error("❌ Error saving:", error);
      setErrorMessage(
        error?.data || { detail: "An unexpected error occurred." }
      );
      setShowErrorModal(true);
    }
  };

  if (isLoading) return <p>Loading case history...</p>;

  // ✅ Format for SearchableSelect: value + label
  const formattedOcularOptions = (ocularConditions || []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Case History</h1>

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

      {/* Ocular Conditions Dropdown */}
      <div className="mb-6">
        <SearchableSelect
          label="Ocular Conditions"
          options={formattedOcularOptions}
          selectedValues={selectedConditions.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          onSelect={(option) => {
            if (selectedConditions.some((c) => c.id === option.value)) {
              setErrorMessage({
                detail: "This condition is already selected.",
              });
              setShowErrorModal(true);
              return;
            }

            setSelectedConditions((prev) => [
              ...prev,
              { id: option.value, name: option.label },
            ]);
          }}
          conditionKey="value"
          conditionNameKey="label"
        />

        {/* Display selected condition names */}
        {selectedConditions.length > 0 && (
          <ul className="mt-4 space-y-2">
            {selectedConditions.map((c) => (
              <li key={c.id} className="p-2 bg-gray-100 rounded">
                {c.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSaveAndProceed}
          disabled={isSaving}
          className={`px-6 py-2 rounded-md text-white ${
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
