import React from "react";

const TextAreaField = ({ label, value, onChange, required = false, placeholder = "" }) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border rounded-md mt-2"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextAreaField;
