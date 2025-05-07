// components/TextInput.jsx
import React from "react";

const TextInput = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default TextInput;
