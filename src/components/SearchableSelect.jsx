import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Trash2, Pencil } from "lucide-react";
import GradeSelector from "./GradeSelector";
import AddNoteModal from "./NotesModal";

const EYE_OPTIONS = [
  { value: "OD", label: "Right Eye" },
  { value: "OS", label: "Left Eye" },
  { value: "OU", label: "Both Eyes" },
];

/**
 * Universal Searchable Select Component
 * ✅ Supports both Medical and Ocular conditions
 * ✅ Handles different key names dynamically
 * ✅ Displays correct names for fetched records
 */
const SearchableSelect = ({
  label,
  options = [], // List of available conditions
  value = [], // Selected conditions
  onChange,
  type = "ocular", // "ocular" or "medical"
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState(value);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingConditionId, setEditingConditionId] = useState(null);
  const dropdownRef = useRef(null);

  // Dynamically set the key names for medical vs ocular conditions
  const conditionKey = type === "medical" ? "medical_condition" : "ocular_condition";
  const conditionNameKey = `${conditionKey}_name`;

  useEffect(() => {
    console.log(`🔍 [${type.toUpperCase()}] Selected Conditions:`, value);
    setSelectedConditions(value || []);
  }, [value]);

  /** ✅ Handles Selecting a Condition */
  const handleSelect = (selectedOption) => {
    if (!selectedConditions.some((c) => c[conditionKey] === selectedOption.value)) {
      const newConditions = [
        ...selectedConditions,
        {
          [conditionKey]: selectedOption.value,
          [conditionNameKey]: selectedOption.label, // ✅ Store name correctly
          affected_eye: type === "ocular" ? "" : undefined, // Only ocular has this field
          grading: type === "ocular" ? "" : undefined, // Only ocular has this field
          notes: "",
        },
      ];
      setSelectedConditions(newConditions);
      onChange(newConditions);
    }
    setIsOpen(false);
    setSearch("");
  };

  /** ✅ Handles Deleting a Condition */
  const handleDelete = (id) => {
    const updatedConditions = selectedConditions.filter(
      (condition) => condition[conditionKey] !== id
    );
    setSelectedConditions(updatedConditions);
    onChange(updatedConditions);
  };

  /** ✅ Handles Updating Condition Details */
  const updateConditionDetail = (id, key, newValue) => {
    const updatedConditions = selectedConditions.map((condition) =>
      condition[conditionKey] === id ? { ...condition, [key]: newValue } : condition
    );
    setSelectedConditions(updatedConditions);
    onChange(updatedConditions);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <h1 className="text-base font-medium">{label}</h1>

      {/* Dropdown Input Field */}
      <div
        className="flex items-center border p-3 rounded-md cursor-pointer bg-white relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-1">
          {selectedConditions.length > 0
            ? selectedConditions.map((s) => s[conditionNameKey]).join(", ")
            : "Select any that apply"}
        </span>
        <ChevronDown className="text-gray-500 absolute right-3" size={18} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute w-full bg-white border rounded-md shadow-md mt-1 z-10">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border-b"
          />
          <div className="max-h-40 overflow-y-auto">
            {options
              .filter(
                (option) =>
                  !selectedConditions.some((s) => s[conditionKey] === option.value) &&
                  option.label.toLowerCase().includes(search.toLowerCase())
              )
              .map((option) => (
                <div
                  key={option.value}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Selected Conditions */}
      {selectedConditions.length > 0 && (
        <div className="mt-2 space-y-2">
          {selectedConditions.map((selected) => {
            const displayName = selected[conditionNameKey] || "Unknown Condition";

            return (
              <div
                key={selected[conditionKey]}
                className="flex flex-col p-3 border rounded-md bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-medium">{displayName}</h2>
                  {/* ✅ Delete Button */}
                  <Trash2
                    size={18}
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(selected[conditionKey])}
                  />
                </div>

                {/* ✅ Affected Eye Selector (Only for Ocular Conditions) */}
                {type === "ocular" && (
                  <select
                    value={selected.affected_eye || ""}
                    onChange={(e) =>
                      updateConditionDetail(selected[conditionKey], "affected_eye", e.target.value)
                    }
                    className="w-full p-2 border rounded-md mt-2"
                  >
                    <option value="">Select Eye</option>
                    {EYE_OPTIONS.map((eye) => (
                      <option key={eye.value} value={eye.value}>
                        {eye.label}
                      </option>
                    ))}
                  </select>
                )}

                {/* ✅ Grading (Only for Ocular Conditions) */}
                {type === "ocular" && (
                  <GradeSelector
                    selectedGrade={selected.grading || ""}
                    onGradeChange={(newGrade) =>
                      updateConditionDetail(selected[conditionKey], "grading", newGrade)
                    }
                  />
                )}

                {/* ✅ Notes */}
                <button
                  onClick={() => {
                    setEditingConditionId(selected[conditionKey]);
                    setNoteModalOpen(true);
                  }}
                  className="text-blue-600 hover:underline mt-2 flex items-center"
                >
                  <Pencil size={14} className="mr-1" /> Add a Note
                </button>

                {/* ✅ Notes Input */}
                <input
                  type="text"
                  value={selected.notes || ""}
                  onChange={(e) =>
                    updateConditionDetail(selected[conditionKey], "notes", e.target.value)
                  }
                  className="w-full p-2 border rounded-md mt-2"
                  placeholder="Add notes"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Note Modal */}
      <AddNoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        onSave={(notes) => updateConditionDetail(editingConditionId, "notes", notes)}
      />
    </div>
  );
};

export default SearchableSelect;
