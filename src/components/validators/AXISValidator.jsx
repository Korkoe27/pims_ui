import React, { useState, useEffect } from "react";

const AXISValidator = ({
  value,
  onChange,
  required = false,
  label,
  placeholder = "0 - 180",
  disabled = false,
}) => {
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (!touched) return;

    const trimmed = value?.trim();
    const num = Number(trimmed);

    const validAxis =
      !isNaN(num) && Number.isInteger(num) && num >= 0 && num <= 180;
    const passesRequired = required ? !!trimmed : true;

    setIsValid(passesRequired && (!trimmed || validAxis));
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
        disabled={disabled}
      />
      {!isValid && required && !value?.trim() && (
        <p className="text-sm text-red-600">
          AXIS is required if CYL is entered
        </p>
      )}
      {!isValid && value?.trim() && (
        <p className="text-sm text-red-600">
          AXIS must be a number between 0 and 180
        </p>
      )}
    </div>
  );
};

export default AXISValidator;
