import React, { useState } from "react";
import SearchableSelect from "./SearchableSelect";
import CaseHistoryConditionItem from "./CaseHistoryConditionItem";

// Dummy options - replace with your fetched options
const OCULAR_CONDITIONS = [
  { value: 1, label: "Cataract" },
  { value: 2, label: "Glaucoma" },
  { value: 3, label: "Macular Degeneration" },
];

const CaseHistory = () => {
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [ocularConditions, setOcularConditions] = useState([]);

  /** Handle new selection */
  const handleSelect = (newCondition) => {
    setOcularConditions((prev) => [
      ...prev,
      {
        ...newCondition,
        affected_eye: "",
        grading: "",
        notes: "",
      },
    ]);
  };

  /** Update condition details */
  const handleUpdate = (updatedCondition) => {
    setOcularConditions((prev) =>
      prev.map((c) => (c.id === updatedCondition.id ? updatedCondition : c))
    );
  };

  /** Delete a condition */
  const handleDelete = (id) => {
    setOcularConditions((prev) => prev.filter((c) => c.id !== id));
  };

  /** Final case history object */
  const caseHistoryData = {
    chief_complaint: chiefComplaint,
    ocular_conditions: ocularConditions,
  };

  /** Handle Save */
  const handleSave = () => {
    console.log("📝 Case History Saved:", caseHistoryData);
    // You can call an API or move to the next step here
    alert("Case history saved successfully!");
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Patient Case History</h2>

      {/* ✅ Chief Complaint */}
      <div>
        <label className="block font-medium mb-1">Chief Complaint</label>
        <textarea
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          className="w-full p-3 border rounded-md"
          placeholder="Describe the main reason for the patient's visit..."
        />
      </div>

      {/* ✅ Ocular Conditions */}
      <div>
        <SearchableSelect
          label="Ocular Conditions"
          options={OCULAR_CONDITIONS}
          selectedValues={ocularConditions}
          onSelect={handleSelect}
          conditionKey="id"
          conditionNameKey="name"
        />

        {ocularConditions.map((condition) => (
          <CaseHistoryConditionItem
            key={condition.id}
            condition={condition}
            type="ocular"
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* ✅ Action Buttons */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save and Proceed
        </button>
      </div>

      {/* ✅ Optional: Debug Output */}
      {/* <pre className="bg-gray-100 p-3 rounded-md text-sm">
        {JSON.stringify(caseHistoryData, null, 2)}
      </pre> */}
    </div>
  );
};

export default CaseHistory;
