import React, { useState, useEffect } from "react";

const VAValidator = ({ value, onChange, required = false, label, placeholder = "6/6 or 0.00" }) => {
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const isValidVA = (val) => {
    const trimmed = val.trim();
    return /^\d{1,2}\/\d{1,2}$/.test(trimmed) || /^[0-3](\.\d{1,2})?$/.test(trimmed);
  };

  useEffect(() => {
    if (!touched) return;
    const trimmed = value.trim();
    if (!trimmed && required) {
      setIsValid(false);
    } else if (trimmed && !isValidVA(trimmed)) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [value, touched, required]);

  return (
    <div className="space-y-1">
      {label && <label className="block font-medium">{label}</label>}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        className={`w-full border px-3 py-2 rounded ${
          !isValid ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
      />
      {!isValid && (
        <p className="text-sm text-red-600">
          {required && !value.trim()
            ? "This field is required."
            : "Use 6/6 or a float like 0.00"}
        </p>
      )}
    </div>
  );
};

export default VAValidator;
