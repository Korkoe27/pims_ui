import { showToast } from "../components/ToasterHelper";

const MedicationForm = ({
  selectedMedications = [], // [{ id, name, dosage, eye }]
  setSelectedMedications,
  medications = [], // full list (not used in input mode)
}) => {
  // Add a new medication manually
  const handleAddMedication = () => {
    const newMedication = {
      id: Date.now(), // Unique ID for new medications
      name: "",
      dosage: "",
      eye: "",
    };
    setSelectedMedications((prev) => [...prev, newMedication]);
  };

  // Remove a medication
  const handleRemoveMedication = (id) => {
    setSelectedMedications((prev) => prev.filter((med) => med.id !== id));
    showToast("Medication removed.", "info");
  };

  const handleFieldChange = (id, field, value) => {
    const updated = selectedMedications.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    setSelectedMedications(updated);
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* Add Medication Button */}
      <button
        type="button"
        onClick={handleAddMedication}
        className="w-fit px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
      >
        + Add Medication
      </button>

      {/* Render fields for medications */}
      {selectedMedications.map((med) => (
        <div key={med.id} className="border p-4 rounded-md bg-gray-50">
          {/* Medication Name */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="font-medium text-base">
              Medication Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Ciprofloxacin, Timolol, Lubricating Drops"
              value={med.name}
              onChange={(e) =>
                handleFieldChange(med.id, "name", e.target.value)
              }
              className="border border-[#d0d5dd] rounded-md p-3 text-sm"
            />
            {!med.name && <span className="text-xs text-red-500">Medication name is required</span>}
          </div>

          {/* Eye Selection */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="font-medium text-base">
              Prescribed Eye <span className="text-red-500">*</span>
            </label>
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
            {!med.eye && <span className="text-xs text-red-500">Please select an eye</span>}
          </div>

          {/* Dosage */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="font-medium text-base">
              Dosage <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="e.g., TID x 1/52, BD x 2/52, Instil 1-2 drops TID"
              value={med.dosage}
              onChange={(e) =>
                handleFieldChange(med.id, "dosage", e.target.value)
              }
              className="border border-[#d0d5dd] h-20 rounded-md p-3 text-sm"
            />
            {!med.dosage && <span className="text-xs text-red-500">Dosage is required</span>}
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => handleRemoveMedication(med.id)}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      {/* Empty State */}
      {selectedMedications.length === 0 && (
        <p className="text-gray-500 text-sm italic">
          No medications added yet. Click "+ Add Medication" to add one.
        </p>
      )}
    </div>
  );
};

export default MedicationForm;
