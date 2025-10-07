import React, { useState, useEffect } from "react";

const SPHValidator = ({
  value,
  onChange,
  required = false,
  label,
  placeholder = "+1.00 / -2.25",
  disabled = false,
}) => {
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const isValidSPH = (val) =>
    /^[+-][0-9]+(\.25|\.50|\.75|\.00)?$/.test(val.trim());

  useEffect(() => {
    if (!touched) return;
    const trimmed = value.trim();
    setIsValid(!required && !trimmed ? true : isValidSPH(trimmed));
  }, [value, touched, required]);

  return (
    <div className="space-y-1">
      {label && (
        <label className="block font-medium">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
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
            : "Invalid SPH format. Must start with '+' or '-' (e.g., +1.00, -2.25)"}
        </p>
      )}
    </div>
  );
};

export default SPHValidator;
