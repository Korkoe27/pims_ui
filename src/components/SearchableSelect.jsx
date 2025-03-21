import React, { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

const SearchableSelect = ({
  label,
  options = [],
  selectedValues = [],
  onSelect,
  conditionKey = "id", // unique id field
  conditionNameKey = "name", // display name field
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    if (!selectedValues.some((val) => val[conditionKey] === option.value)) {
      onSelect({
        [conditionKey]: option.value,
        [conditionNameKey]: option.label,
      });
    }
    setSearch("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <h1 className="text-base font-medium">{label}</h1>

      <div
        className="flex items-center border p-3 rounded-md cursor-pointer bg-white relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-1">
          {selectedValues.length > 0
            ? selectedValues.map((s) => s[conditionNameKey]).join(", ")
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
          />
          <div className="max-h-40 overflow-y-auto">
            {options
              .filter(
                (option) =>
                  !selectedValues.some((s) => s[conditionKey] === option.value) &&
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
    </div>
  );
};

export default SearchableSelect;
