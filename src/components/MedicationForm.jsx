import React from "react";
import SearchableSelect from "./SearchableSelect";

const MedicationForm = ({
  medicationEntry,
  setMedicationEntry,
  medicationTypes = [],
  medications = [], // full list passed in
  filteredMedications = [],
  setSelectedTypeId,
}) => {
  const handleChange = (field, value) => {
    setMedicationEntry((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectedTypeLabel =
    medicationTypes.find((t) => t.id === medicationEntry.medication_type)
      ?.name || "";

  const selectedMedLabel =
    medications.find((m) => m.id === medicationEntry.medication_name)?.name ||
    "";

  return (
    <div className="flex flex-col gap-6 mt-6 max-w-lg">
      {/* Medication Type */}
      <SearchableSelect
        label="Medication Type"
        options={medicationTypes.map((type) => ({
          value: type.id,
          label: type.name,
        }))}
        selectedValues={
          medicationEntry.medication_type
            ? [
                {
                  value: medicationEntry.medication_type,
                  label: selectedTypeLabel,
                },
              ]
            : []
        }
        onSelect={(selected) => {
          handleChange("medication_type", selected.value);
          setSelectedTypeId?.(selected.value);
          handleChange("medication_name", ""); // reset name on type change
        }}
        placeholder="Select medication type"
      />

      {/* Medication Name */}
      <SearchableSelect
        label="Medication Name"
        options={filteredMedications.map((med) => ({
          value: med.id,
          label: med.name,
        }))}
        selectedValues={
          medicationEntry.medication_name
            ? [
                {
                  value: medicationEntry.medication_name,
                  label: selectedMedLabel,
                },
              ]
            : []
        }
        onSelect={(selected) => handleChange("medication_name", selected.value)}
        placeholder="Search medication by name"
      />

      {/* Eye Selection */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-base">Prescribed Eye</label>
        <div className="flex gap-4">
          {["OD", "OS", "OU"].map((eye) => (
            <label key={eye} className="flex items-center gap-1">
              <input
                type="radio"
                name="medication_eye"
                value={eye}
                checked={medicationEntry.medication_eye === eye}
                onChange={(e) => handleChange("medication_eye", e.target.value)}
              />
              {eye}
            </label>
          ))}
        </div>
      </div>

      {/* Dosage */}
      <div className="flex flex-col gap-1">
        <label className="font-medium text-base">Medication Dosage</label>
        <textarea
          placeholder="Example: TID x 2/52"
          value={medicationEntry.medication_dosage}
          onChange={(e) => handleChange("medication_dosage", e.target.value)}
          className="border border-[#d0d5dd] h-32 rounded-md p-3 text-sm"
        />
      </div>
    </div>
  );
};

export default MedicationForm;
