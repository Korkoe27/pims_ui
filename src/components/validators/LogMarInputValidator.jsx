import React, { useState, useEffect } from "react";

const LogMarInputValidator = ({ value, onChange, required = false, label, vaChart }) => {
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const isValidLogMar = (val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= -0.02 && num <= 3.5;
  };

  const dynamicPlaceholder = vaChart ? "0.00" : "";

  useEffect(() => {
    if (!touched) return;
    const trimmed = value.trim();
    if (!trimmed && required) {
      setIsValid(false);
    } else if (trimmed && !isValidLogMar(trimmed)) {
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
            : "Value must be between -0.02 and 3.5 (decimal)"}
        </p>
      )}
    </div>
  );
};

export default LogMarInputValidator;
