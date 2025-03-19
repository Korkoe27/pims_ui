import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Trash2, ChevronDown, Pencil } from "lucide-react";
import GradeSelector from "./GradeSelector";
import AddNoteModal from "./NotesModal";

const DEFAULT_AFFECTED_EYE_OPTIONS = [
  { value: "OD", label: "Right Eye" },
  { value: "OS", label: "Left Eye" },
  { value: "OU", label: "Both Eyes" },
];

const SearchableSelect = ({ label, name, options = [], value = [], onChange }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState(value);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingSymptomId, setEditingSymptomId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedSymptoms(value || []);
  }, [value]);

  // ✅ Handles Selecting a Symptom
  const handleSelect = (selectedOption) => {
    if (!selectedSymptoms.some((s) => s.ocular_condition === selectedOption.id)) {
      const newSymptoms = [
        ...selectedSymptoms,
        {
          ocular_condition: selectedOption.id,
          affected_eye: "OU",
          grading: "1",
          notes: "",
        },
      ];
      setSelectedSymptoms(newSymptoms);
      onChange(newSymptoms);
    }
    setIsOpen(false);
    setSearch("");
  };

  // ✅ Ensure selected items display
  return (
    <div className="relative w-full" ref={dropdownRef}>
      <h1 className="text-base font-medium">{label}</h1>

      {/* Dropdown Input Field */}
      <div
        className="flex items-center border p-3 rounded-md cursor-pointer bg-white relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-1">
          {selectedSymptoms.length > 0
            ? selectedSymptoms
                .map((s) => options.find((o) => o.id === s.ocular_condition)?.name)
                .join(", ")
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
                  !selectedSymptoms.some((s) => s.ocular_condition === option.id) &&
                  option.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((option) => (
                <div key={option.id} className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSelect(option)}>
                  {option.name}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Selected Conditions */}
      {selectedSymptoms.length > 0 && (
        <div className="mt-2 space-y-2">
          {selectedSymptoms.map((selected) => {
            const selectedOption = options.find((opt) => opt.id === selected.ocular_condition);
            if (!selectedOption) return null;

            return (
              <div key={selected.ocular_condition} className="flex flex-col p-3 border rounded-md bg-gray-50">
                <h2 className="text-sm font-medium">{selectedOption.name}</h2>

                {/* Grading */}
                <GradeSelector
                  selectedGrade={selected.grading}
                  onGradeChange={(newGrade) => {
                    setSelectedSymptoms((prev) =>
                      prev.map((s) =>
                        s.ocular_condition === selected.ocular_condition ? { ...s, grading: newGrade } : s
                      )
                    );
                  }}
                />

                {/* Notes */}
                <button
                  onClick={() => {
                    setEditingSymptomId(selected.ocular_condition);
                    setNoteModalOpen(true);
                  }}
                  className="text-blue-600 hover:underline mt-2"
                >
                  <Pencil size={14} /> Add a Note
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Note Modal */}
      <AddNoteModal isOpen={noteModalOpen} onClose={() => setNoteModalOpen(false)} onSave={() => {}} />
    </div>
  );
};

export default SearchableSelect;
