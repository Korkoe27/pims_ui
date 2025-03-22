import React, { useEffect, useState } from "react";
import useCaseHistoryData from "../hooks/useCaseHistoryData";
import SearchableSelect from "./SearchableSelect";
import ErrorModal from "./ErrorModal";
import AffectedEyeSelect from "./AffectedEyeSelect";

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

  const gradingOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "NA", label: "Not Applicable" },
  ];

  useEffect(() => {
    if (caseHistory) {
      setChiefComplaint(caseHistory?.chief_complaint || "");

      const mapped = (caseHistory?.condition_details || []).map((item) => ({
        id: item.ocular_condition,
        name: item.ocular_condition_name || "",
        affected_eye: item.affected_eye || "",
        grading: item.grading || "",
        notes: item.notes || "",
      }));

      setSelectedConditions(mapped);
    }
  }, [caseHistory]);

  const handleSelect = (option) => {
    if (selectedConditions.some((c) => c.id === option.value)) {
      setErrorMessage({ detail: "This condition is already selected." });
      setShowErrorModal(true);
      return;
    }

    setSelectedConditions((prev) => [
      ...prev,
      {
        id: option.value,
        name: option.label,
        affected_eye: "",
        grading: "",
        notes: "",
      },
    ]);
  };

  const updateCondition = (id, field, value) => {
    setSelectedConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

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
      condition_details: selectedConditions.map((c) => ({
        ocular_condition: c.id,
        affected_eye: c.affected_eye,
        grading: c.grading,
        notes: c.notes,
      })),
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

      {/* Ocular Conditions Selection */}
      <div className="mb-6">
        <SearchableSelect
          label="Ocular Conditions"
          options={formattedOcularOptions}
          selectedValues={selectedConditions.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          onSelect={handleSelect}
          conditionKey="value"
          conditionNameKey="label"
        />

        {selectedConditions.length > 0 && (
          <div className="mt-4 space-y-4">
            {selectedConditions.map((c) => (
              <div key={c.id} className="p-4 bg-gray-50 border rounded">
                <h4 className="font-semibold">{c.name}</h4>

                {/* Affected Eye */}
                <AffectedEyeSelect
                  value={c.affected_eye}
                  onChange={(val) => updateCondition(c.id, "affected_eye", val)}
                />

                {/* Grading (Dropdown) */}
                <div className="mt-2">
                  <label className="block text-sm font-medium">Grading</label>
                  <select
                    value={c.grading}
                    onChange={(e) =>
                      updateCondition(c.id, "grading", e.target.value)
                    }
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select grading</option>
                    {gradingOptions.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="mt-2">
                  <label className="block text-sm font-medium">Notes</label>
                  <textarea
                    value={c.notes}
                    onChange={(e) =>
                      updateCondition(c.id, "notes", e.target.value)
                    }
                    className="w-full border rounded p-2"
                    rows={2}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
            ))}
          </div>
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
