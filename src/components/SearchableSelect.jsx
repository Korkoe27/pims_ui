import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Trash2, ChevronDown } from "lucide-react";
import NotesModal from "./NotesModal"; // ✅ Import Notes Modal

const SearchableSelect = ({ label, name, options, value, onChange }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [symptomDetails, setSymptomDetails] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const dropdownRef = useRef(null); // ✅ For closing dropdown on outside click

  // ✅ Ensure selected symptoms have unique details
  useEffect(() => {
    const updatedDetails = { ...symptomDetails };

    value.forEach((symptomName) => {
      const symptom = options.find((s) => s.name === symptomName);
      if (symptom && !updatedDetails[symptomName]) {
        updatedDetails[symptomName] = {
          affectedEye: symptom.requires_affected_eye ? "" : null,
          grading: symptom.requires_grading ? "" : null,
          notes: symptom.requires_notes ? "" : null,
        };
      }
    });

    setSymptomDetails(updatedDetails);
  }, [value, options]);

  // ✅ Handle selection & initialize additional fields if required
  const handleSelect = (selectedOption) => {
    if (!value.includes(selectedOption.name)) {
      onChange([...value, selectedOption.name]);
    }
    setIsOpen(false);
    setSearch("");
  };

  // ✅ Handle removing a selected item
  const handleDelete = (symptom) => {
    onChange(value.filter((item) => item !== symptom));
    setSymptomDetails((prev) => {
      const updated = { ...prev };
      delete updated[symptom];
      return updated;
    });
  };

  // ✅ Open Notes Modal
  const openNoteModal = (field) => {
    setSelectedField(field);
    setModalOpen(true);
  };

  // ✅ Save Notes
  const saveNote = (note) => {
    setSymptomDetails((prev) => ({
      ...prev,
      [selectedField]: { ...prev[selectedField], notes: note },
    }));
  };

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
            {options
              .filter(
                (option) =>
                  !value.includes(option.name) &&
                  option.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((option) => (
                <div
                  key={option.name}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(option)}
                >
                  {option.name}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Display selected items with additional options */}
      {value.length > 0 && (
        <div className="mt-2 space-y-2">
          {value.map((selected) => {
            const selectedOption = options.find((opt) => opt.name === selected);
            if (!selectedOption) return null;

            return (
              <div key={selected} className="flex flex-col p-3 border rounded-md bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">{selected}</h2>
                  <button
                    onClick={() => handleDelete(selected)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    <Trash2 size={18} strokeWidth={2} color="red" />
                  </button>
                </div>

                {/* Conditionally Show Affected Eye */}
                {selectedOption.requires_affected_eye && (
                  <div className="mt-2">
                    <label className="text-sm font-medium">Affected Eye</label>
                    <select
                      value={symptomDetails[selected]?.affectedEye || ""}
                      onChange={(e) =>
                        setSymptomDetails((prev) => ({
                          ...prev,
                          [selected]: { ...prev[selected], affectedEye: e.target.value },
                        }))
                      }
                      className="p-2 border rounded-md"
                    >
                      <option value="OD">Right Eye</option>
                      <option value="OS">Left Eye</option>
                      <option value="OU">Both Eyes</option>
                    </select>
                  </div>
                )}

                {/* Conditionally Show Grading */}
                {selectedOption.requires_grading && (
                  <div className="mt-2">
                    <label className="text-sm font-medium">Grading</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={symptomDetails[selected]?.grading || ""}
                      onChange={(e) =>
                        setSymptomDetails((prev) => ({
                          ...prev,
                          [selected]: { ...prev[selected], grading: e.target.value },
                        }))
                      }
                      className="p-2 border rounded-md"
                    />
                  </div>
                )}

                {/* Conditionally Show Notes */}
                {selectedOption.requires_notes && (
                  <div className="mt-2">
                    <label className="text-sm font-medium">Notes</label>
                    <textarea
                      value={symptomDetails[selected]?.notes || ""}
                      onChange={(e) =>
                        setSymptomDetails((prev) => ({
                          ...prev,
                          [selected]: { ...prev[selected], notes: e.target.value },
                        }))
                      }
                      placeholder="Add notes..."
                      className="p-3 border border-gray-300 rounded-md w-full h-20"
                    ></textarea>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Notes Modal */}
      <NotesModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={saveNote} fieldLabel={selectedField} />
    </div>
  );
};

SearchableSelect.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      requires_affected_eye: PropTypes.bool,
      requires_grading: PropTypes.bool,
      requires_notes: PropTypes.bool,
    })
  ).isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

SearchableSelect.defaultProps = {
  value: [],
};  1

export default SearchableSelect;
