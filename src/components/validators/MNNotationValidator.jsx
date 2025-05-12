import React, { useState, useEffect } from "react";

const MNNotationValidator = ({ value, onChange, required = false, label, vaChart }) => {
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const isValidMN = (val) => /^[MN]\d+(\.\d+)?$/i.test(val.trim());

  const dynamicPlaceholder = vaChart ? "M/N Notation" : "";

  useEffect(() => {
    if (!touched) return;
    const trimmed = value.trim();
    if (!trimmed && required) {
      setIsValid(false);
    } else if (trimmed && !isValidMN(trimmed)) {
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
        placeholder={dynamicPlaceholder}
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
            : "Invalid MN notation (e.g., M1, N5, M2.5)"}
        </p>
      )}
    </div>
  );
};

export default MNNotationValidator;
