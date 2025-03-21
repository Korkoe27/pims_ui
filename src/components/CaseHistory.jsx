import React, { useState, useEffect } from "react";
import useCaseHistoryData from "../hooks/useCaseHistoryData";
import SearchableSelect from "./SearchableSelect";
import CaseHistoryConditionItem from "./CaseHistoryConditionItem";

const CaseHistory = ({ patientId, appointmentId }) => {
  const { caseHistory, ocularConditions, isLoading } = useCaseHistoryData(patientId, appointmentId);
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [selectedConditions, setSelectedConditions] = useState([]);

  // Populate existing case history on load
  useEffect(() => {
    if (caseHistory) {
      setChiefComplaint(caseHistory?.chief_complaint || "");
      setSelectedConditions(caseHistory?.ocular_conditions || []);
    }
  }, [caseHistory]);

  const handleSelect = (newCondition) => {
    setSelectedConditions((prev) => [
      ...prev,
      {
        ...newCondition,
        affected_eye: "",
        grading: "",
        notes: "",
      },
    ]);
  };

  const handleUpdate = (updatedCondition) => {
    setSelectedConditions((prev) =>
      prev.map((c) => (c.id === updatedCondition.id ? updatedCondition : c))
    );
  };

  const handleDelete = (id) => {
    setSelectedConditions((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    const caseHistoryData = {
      chief_complaint: chiefComplaint,
      ocular_conditions: selectedConditions,
    };
    console.log("📝 Case History to save:", caseHistoryData);
    // Trigger API mutation here
  };

  if (isLoading) return <p>Loading case history...</p>;

  const formattedOcularOptions = (ocularConditions || []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <div className="space-y-6 p-6 bg-white rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Patient Case History</h2>

      <div>
        <label className="block font-medium mb-1">Chief Complaint</label>
        <textarea
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          className="w-full p-3 border rounded-md"
          placeholder="Describe the main reason for the patient's visit..."
        />
      </div>

      <SearchableSelect
        label="Ocular Conditions"
        options={formattedOcularOptions}
        selectedValues={selectedConditions}
        onSelect={handleSelect}
        conditionKey="id"
        conditionNameKey="name"
      />

      {selectedConditions.map((condition) => (
        <CaseHistoryConditionItem
          key={condition.id}
          condition={condition}
          type="ocular"
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save and Proceed
        </button>
      </div>
    </div>
  );
};

export default CaseHistory;
