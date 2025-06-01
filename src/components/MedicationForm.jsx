import React, { useEffect } from "react";
import SearchableSelect from "./SearchableSelect";
import { showToast } from "../components/ToasterHelper"; // adjust the path as needed

const MedicationForm = ({
  selectedMedications = [], // [{ id, name, dosage, eye }]
  setSelectedMedications,
  medications = [], // full list
}) => {
  // When user selects meds from the dropdown
  const handleMedicationSelect = (selectedOption) => {
    if (!selectedOption || !selectedOption.id) return;

    const id = selectedOption.id;
    const name = selectedOption.name;

    if (selectedMedications.some((med) => med.id === id)) {
      showToast("Medication already selected.", "info");
      return;
    }

    const newMedication = {
      id,
      name,
      dosage: "",
      eye: "",
    };

    setSelectedMedications((prev) => [...prev, newMedication]);
  };

  const handleFieldChange = (id, field, value) => {
    const updated = selectedMedications.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    setSelectedMedications(updated);
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* Multi Medication Selector */}
      <SearchableSelect
        label="Select Medications"
        options={medications.map((m) => ({
          value: m.id,
          label: m.name,
        }))}
        selectedValues={selectedMedications.map((m) => ({
          id: m.id,
          name: m.name,
        }))}
        onSelect={handleMedicationSelect}
      />

      {/* Render fields for selected meds */}
      {selectedMedications.map((med) => (
        <div key={med.id} className="border p-4 rounded-md bg-gray-50">
          <h4 className="font-semibold mb-2">{med.name}</h4>

          {/* Eye Selection */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="font-medium text-base">Prescribed Eye</label>
            <div className="flex gap-4">
              {["OD", "OS", "OU"].map((eye) => (
                <label key={eye} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`eye_${med.id}`}
                    value={eye}
                    checked={med.eye === eye}
                    onChange={(e) =>
                      handleFieldChange(med.id, "eye", e.target.value)
                    }
                  />
                  {eye}
                </label>
              ))}
            </div>
          </div>

          {/* Dosage */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-base">Dosage</label>
            <textarea
              placeholder="e.g. TID x 1/52"
              value={med.dosage}
              onChange={(e) =>
                handleFieldChange(med.id, "dosage", e.target.value)
              }
              className="border border-[#d0d5dd] h-24 rounded-md p-3 text-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicationForm;
