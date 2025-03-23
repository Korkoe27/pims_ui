import React, { useEffect, useState } from "react";
import useFetchConditionsData from "../hooks/useFetchConditionsData";
import {
  useCreateCaseHistoryMutation,
  useFetchCaseHistoryQuery,
} from "../redux/api/features/caseHistoryApi";
import SearchableSelect from "./SearchableSelect";
import ErrorModal from "./ErrorModal";
import AffectedEyeSelect from "./AffectedEyeSelect";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea";
import DeleteButton from "./DeleteButton";

const CaseHistory = ({ patientId, appointmentId, nextTab, setActiveTab }) => {
  const { data: caseHistory, isLoading: loadingCaseHistory } =
    useFetchCaseHistoryQuery(appointmentId, {
      skip: !appointmentId,
    });

  const { ocularConditions, isLoading: loadingConditions } =
    useFetchConditionsData();
  const [createCaseHistory, { isLoading: isSaving }] =
    useCreateCaseHistoryMutation();

  const [chiefComplaint, setChiefComplaint] = useState("");
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const isLoading = loadingCaseHistory || loadingConditions;

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

  const handleDeleteCondition = (id) => {
    setSelectedConditions((prev) => prev.filter((c) => c.id !== id));
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
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{c.name}</h4>
                  <DeleteButton onClick={() => handleDeleteCondition(c.id)} />
                </div>

                {/* Affected Eye */}
                <AffectedEyeSelect
                  value={c.affected_eye}
                  onChange={(val) => updateCondition(c.id, "affected_eye", val)}
                />

                {/* Grading (Dropdown) */}
                <GradingSelect
                  value={c.grading}
                  onChange={(val) => updateCondition(c.id, "grading", val)}
                />

                {/* Notes */}
                <NotesTextArea
                  value={c.notes}
                  onChange={(val) => updateCondition(c.id, "notes", val)}
                />
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
          className={`px-6 py-2 font-semibold text-white rounded-full shadow-md transition-colors duration-200 ${
            isSaving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-800 hover:bg-indigo-900"
          }`}
        >
          {isSaving ? "Saving..." : "Save and proceed"}
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
