import React, { useState, useEffect } from "react";

const ADDValidator = ({
  value,
  onChange,
  required = false,
  label,
  placeholder = "+1.00",
  disabled = false,
}) => {
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // ✅ Enforce + sign
  const isValidAdd = (val) =>
    /^\+[0-9]+(\.25|\.50|\.75|\.00)?$/.test(val.trim());

  useEffect(() => {
    if (!touched) return;
    const trimmed = value.trim();
    if (!trimmed && required) {
      setIsValid(false);
    } else if (trimmed && !isValidAdd(trimmed)) {
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
        disabled={disabled}
      />
      {!isValid && (
        <p className="text-sm text-red-600">
          {required && !value.trim()
            ? "This field is required."
            : "Value must start with '+' and be a valid decimal (e.g., +1.00)"}
        </p>
      )}
    </div>
  );
};

export default ADDValidator;
