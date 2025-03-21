import React, { useState, useEffect } from "react";
import useCaseHistoryData from "../hooks/useCaseHistoryData";
import SearchableSelect from "./SearchableSelect";
import CaseHistoryConditionItem from "./CaseHistoryConditionItem";
import ErrorModal from "./ErrorModal";
import SaveAndProceedButton from "./SaveAndProceedButton"; // Import the SaveAndProceedButton component

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
  const [errorMessage, setErrorMessage] = useState(null); // ✅ For ErrorModal

  // Populate existing case history on load
  useEffect(() => {
    if (caseHistory) {
      setChiefComplaint(caseHistory?.chief_complaint || "");
      setSelectedConditions(
        (caseHistory?.condition_details || []).map((detail) => ({
          id: detail.ocular_condition, // for tracking and identifying
          name: detail.ocular_condition_name, // show label in CaseHistoryConditionItem
          affected_eye: detail.affected_eye || "",
          grading: detail.grading || "",
          notes: detail.notes || "",
        }))
      );
    }
  }, [caseHistory]);

  // Handle adding new condition (Ensures affected_eye is included)
  const handleSelect = (newCondition) => {
    setSelectedConditions((prev) => [
      ...prev,
      {
        ...newCondition,
        affected_eye: "", // ✅ Ensure affected_eye is initialized
        grading: "",
        notes: "",
      },
    ]);
  };

  // Handle updates to condition detail
  const handleUpdate = (updatedCondition) => {
    setSelectedConditions((prev) =>
      prev.map((c) => (c.id === updatedCondition.id ? updatedCondition : c))
    );
  };

  // Handle deletion
  const handleDelete = (id) => {
    setSelectedConditions((prev) => prev.filter((c) => c.id !== id));
  };

  // Define getPayload function
  const getPayload = () => ({
    appointment: appointmentId, // ✅ match backend format
    chief_complaint: chiefComplaint,
    condition_details: selectedConditions.map(
      ({ id, affected_eye, grading, notes }) => ({
        ocular_condition: id, // ✅ correct key name
        affected_eye, // ✅ Ensure affected_eye is sent
        grading,
        notes,
      })
    ),
  });

  // Handle saving to API
  const handleSave = async (payload) => {
    try {
      await createCaseHistory(payload);
      alert("✅ Case history saved successfully!");
    } catch (error) {
      console.error("❌ Error saving case history:", error);
      const errResponse = error?.data || { detail: "Something went wrong." };
      setErrorMessage(errResponse); // ✅ show error modal
    }
  };

  // Map fetched conditions to searchable options
  const formattedOcularOptions = (ocularConditions || []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  if (isLoading) return <p>Loading case history...</p>;

  return (
    <div className="space-y-6 p-6 bg-white rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Patient Case History</h2>

      {/* Chief Complaint */}
      <div>
        <label className="block font-medium mb-1">Chief Complaint</label>
        <textarea
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          className="w-full p-3 border rounded-md"
          placeholder="Describe the main reason for the patient's visit..."
        />
      </div>

      {/* Ocular Conditions Select */}
      <SearchableSelect
        label="Ocular Conditions"
        options={formattedOcularOptions}
        selectedValues={selectedConditions}
        onSelect={handleSelect}
        conditionKey="id"
        conditionNameKey="name"
      />

      {/* Ocular Condition Details */}
      {selectedConditions.map((condition) => (
        <CaseHistoryConditionItem
          key={condition.id}
          condition={condition}
          type="ocular"
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <SaveAndProceedButton
          getPayload={getPayload}
          saveFunction={handleSave}
          isSaving={isSaving}
          nextTab={nextTab}
          setActiveTab={setActiveTab}
          onError={(error) =>
            setErrorMessage(error?.data || { detail: "Something went wrong." })
          }
        />
      </div>

      {/* Error Modal */}
      {errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </div>
  );
};

export default CaseHistory;
