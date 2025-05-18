import React, { useState, useEffect } from "react";

// List of accepted denominators for Snellen
const VALID_DENOMINATORS = [
  "5", "6", "7.5", "9", "12", "15", "18", "21", "24", "30", "36", "48", "60", "75", "120",
];

const SnellenInputValidator = ({
  value,
  onChange,
  required = false,
  label,
}) => {
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const isValidSnellen = (val) => {
    const match = val.trim().match(/^6\/(\d+(\.\d+)?)$/);
    return match && VALID_DENOMINATORS.includes(match[1]);
  };

  useEffect(() => {
    if (!touched) return;

    const trimmed = value.trim();
    if (!trimmed && required) {
      setIsValid(false);
    } else if (trimmed && !isValidSnellen(trimmed)) {
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
        placeholder="6/6"
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
            : "Please enter a valid Snellen value (e.g. 6/5, 6/6,)."}
        </p>
      )}
    </div>
  );
};

export default SnellenInputValidator;
