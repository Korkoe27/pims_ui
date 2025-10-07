import React, { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

const ConditionPicker = ({
  label = "Select Condition",
  options = [],
  selectedValues = [],
  onSelect,
  conditionKey = "id",
  conditionNameKey = "name",
  disabled = false,
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selected = Array.isArray(selectedValues) ? selectedValues : [];

  const handleSelect = (option) => {
    if (!selected.some((val) => val[conditionKey] === option.value)) {
      if (typeof onSelect === "function") {
        onSelect(option); // Send full object (not just value + label)
      }
    }
    setSearch("");
    setIsOpen(false);
  };

  const filteredOptions = options.filter(
    (option) =>
      !selected.some((s) => s[conditionKey] === option.value) &&
      option.label?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <h1 className="text-base font-medium">{label}</h1>
      <div
        className={`flex items-center border p-3 rounded-md cursor-pointer bg-white relative ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="flex-1">
          {selected.length > 0
            ? selected.map((s) => s[conditionNameKey]).join(", ")
            : "Select any that apply"}
        </span>
        <ChevronDown className="text-gray-500 absolute right-3" size={18} />
      </div>

      {isOpen && (
        <div className="absolute w-full bg-white border rounded-md shadow-md mt-1 z-10">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border-b"
            disabled={disabled}
          />
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    disabled ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  onClick={() => !disabled && handleSelect(option)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-500">No options found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConditionPicker;
