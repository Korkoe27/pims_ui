import React, { useState } from "react";
import PropTypes from "prop-types";

const SearchableSelect = ({ label, name, options, value, onChange }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({});

  // Filter out already selected items from the dropdown
  const filteredOptions = options.filter(
    (option) =>
      !value.includes(option) &&
      option.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (selectedOption) => {
    const newValue = [...value, selectedOption];

    setAdditionalInfo((prev) => ({
      ...prev,
      [selectedOption]: { laterality: "OD", note: "", symptomGrade: "" },
    }));

    onChange(newValue);
    setIsOpen(false); // Close the dropdown after selection
    setSearch(""); // Clear search input after selecting an item
  };

  const handleLateralityChange = (option, laterality) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      [option]: { ...prev[option], laterality },
    }));
  };

  const handleDelete = (option) => {
    const newValue = value.filter((item) => item !== option);
    onChange(newValue);
    setAdditionalInfo((prev) => {
      const newInfo = { ...prev };
      delete newInfo[option];
      return newInfo;
    });
  };

  return (
    <div className="relative w-full">
      <h1 className="text-base font-medium">{label}</h1>
      <div
        className="border p-3 rounded-md cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length > 0 ? value.join(", ") : "Select options..."}
      </div>

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
            <div key={selected} className="flex flex-col p-3 border rounded-md bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">{selected}</h2>
                <button
                  onClick={() => handleDelete(selected)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ❌
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
                      onChange={() => handleLateralityChange(selected, side)}
                    />
                    <span>{side}</span>
                  </label>
                ))}
              </div>

              {/* Additional Options */}
              <div className="flex space-x-4 mt-2 text-blue-600 text-sm">
                <button className="hover:underline">✏️ Add a note</button>
                <button className="hover:underline">📊 Grade Symptom</button>
              </div>
            </div>
          ))}
        </div>
      )}
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
