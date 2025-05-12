import React, { useState, useEffect } from "react";

const CYLValidator = ({ value, onChange, required = false, label, placeholder = "-0.50" }) => {
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const isValidCYL = (val) => /^-[0-9]+(\.25|\.50|\.75|\.00)?$/.test(val.trim());

  useEffect(() => {
    if (!touched) return;
    const trimmed = value.trim();
    setIsValid(!trimmed || isValidCYL(trimmed));
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
      {!isValid && <p className="text-sm text-red-600">CYL must be negative (e.g., -0.75)</p>}
    </div>
  );
};

export default CYLValidator;