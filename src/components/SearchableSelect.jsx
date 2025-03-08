import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Trash2, ChevronDown } from "lucide-react";
import NotesModal from "./NotesModal"; // Import Notes Modal

const SearchableSelect = ({ label, name, options, value, onChange }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const dropdownRef = useRef(null); // For closing dropdown on outside click

  // Filter options to exclude already selected items
  const filteredOptions = options.filter(
    (option) =>
      !value.includes(option) &&
      option.toLowerCase().includes(search.toLowerCase())
  );

  // Handle selection & keep previous notes intact
  const handleSelect = (selectedOption) => {
    const newValue = [...value, selectedOption];
    setAdditionalInfo((prev) => ({
      ...prev,
      [selectedOption]: prev[selectedOption] || {
        laterality: "OD",
        note: "",
        symptomGrade: "",
      },
    }));
    onChange(newValue);
    setIsOpen(false);
    setSearch("");
  };

  // Handle deleting a selected item
  const handleDelete = (option) => {
    const newValue = value.filter((item) => item !== option);
    onChange(newValue);
    setAdditionalInfo((prev) => {
      const newInfo = { ...prev };
      delete newInfo[option];
      return newInfo;
    });
  };

  // Open modal for adding/updating a note
  const openNoteModal = (field) => {
    setSelectedField(field);
    setModalOpen(true);
  };

  // Save note and update the UI
  const saveNote = (note) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      [selectedField]: { ...prev[selectedField], note },
    }));
  };

  // Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <h1 className="text-base font-medium">{label}</h1>

      {/* Dropdown Input Field with Arrow */}
      <div
        className="flex items-center border p-3 rounded-md cursor-pointer bg-white relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-1">
          {value.length > 0 ? value.join(", ") : "Select any that apply"}
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
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))
            ) : (
              <p className="p-2 text-gray-400">No results found</p>
            )}
          </div>
        </div>
      )}

      {/* Display selected items with additional options */}
      {value.length > 0 && (
        <div className="mt-2 space-y-2">
          {value.map((selected) => (
            <div
              key={selected}
              className="flex flex-col p-3 border rounded-md bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">{selected}</h2>
                <button
                  onClick={() => handleDelete(selected)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  <Trash2 size={18} strokeWidth={2} color="red" />
                </button>
              </div>

              {/* Laterality Options */}
              <div className="flex items-center space-x-4 mt-2">
                {["OD", "OS", "OU"].map((side) => (
                  <label key={side} className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name={`laterality-${selected}`}
                      value={side}
                      checked={additionalInfo[selected]?.laterality === side}
                      onChange={() =>
                        setAdditionalInfo((prev) => ({
                          ...prev,
                          [selected]: { ...prev[selected], laterality: side },
                        }))
                      }
                    />
                    <span>{side}</span>
                  </label>
                ))}
              </div>

              {/* Additional Options */}
              <div className="flex space-x-4 mt-2 text-blue-600 text-sm">
                {/* Note Button with Hover Tooltip */}
                <div className="relative group">
                  <button
                    className="hover:underline"
                    onClick={() => openNoteModal(selected)}
                  >
                    {additionalInfo[selected]?.note
                      ? "✏️ Update note"
                      : "✏️ Add a note"}
                  </button>

                  {/* Tooltip for displaying the note on hover */}
                  {additionalInfo[selected]?.note && (
                    <div className="absolute left-0 bottom-full mb-1 w-48 bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {additionalInfo[selected]?.note}
                    </div>
                  )}
                </div>

                {/* Grading Symptom Button */}
                <button className="hover:underline">📊 Grade Symptom</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notes Modal */}
      <NotesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveNote}
        fieldLabel={selectedField}
      />
    </div>
  );
};

SearchableSelect.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

SearchableSelect.defaultProps = {
  value: [],
};

export default SearchableSelect;
