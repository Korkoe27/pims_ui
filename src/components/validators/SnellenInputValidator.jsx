import React, { useState, useEffect } from "react";

const SnellenInputValidator = ({ value, onChange, required = false, label, placeholder }) => {
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const isValidSnellen = (val) => /^\d{1,2}\/\d{1,2}$/.test(val.trim());

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

  const handleBlur = () => setTouched(true);

  return (
    <div className="space-y-1">
      {label && <label className="block font-medium">{label}</label>}
      <input
        type="text"
        value={value}
        placeholder={placeholder || "6/6"}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        className={`w-full border px-3 py-2 rounded ${
          !isValid ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
      />
      {!isValid && (
        <p className="text-sm text-red-600">
          {required && !value.trim()
            ? "This field is required."
            : "Invalid Snellen format (e.g. 6/6, 6/18)"}
        </p>
      )}
    </div>
  );
};

export default SnellenInputValidator;
