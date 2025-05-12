// components/SearchableInput.jsx
import React, { useState } from "react";

const SearchableInput = ({ value, onChange, options = [], placeholder }) => {
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          setSearch(e.target.value);
          onChange(e.target.value);
        }}
        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {search && filteredOptions.length > 0 && (
        <div className="absolute w-full bg-white border rounded shadow max-h-40 overflow-y-auto z-10">
          {filteredOptions.map((opt, idx) => (
            <div
              key={idx}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onChange(opt);
                setSearch(opt);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableInput;
