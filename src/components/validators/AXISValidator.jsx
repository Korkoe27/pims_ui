import React, { useState, useEffect } from "react";

const AXISValidator = ({ value, onChange, required = false, label, placeholder = "0 - 180" }) => {
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (!touched) return;
    const num = Number(value.trim());
    setIsValid(!value.trim() || (!isNaN(num) && Number.isInteger(num) && num >= 0 && num <= 180));
  }, [value, touched]);

  return (
    <div className="space-y-1">
      {label && <label className="block font-medium">{label}</label>}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        className={`w-full border px-3 py-2 rounded ${!isValid ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-1 focus:ring-indigo-500`}
      />
      {!isValid && <p className="text-sm text-red-600">AXIS must be between 0 - 180</p>}
    </div>
  );
};

export default AXISValidator;
