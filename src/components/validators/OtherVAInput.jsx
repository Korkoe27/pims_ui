import React, { useState, useEffect } from "react";

const OtherVAInput = ({
  value,
  onChange,
  required = false,
  label,
  vaChart, // used to toggle placeholder
}) => {
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const placeholder = vaChart ? "CF / HM / PL / NPL" : "";

  useEffect(() => {
    if (!touched) return;

    const trimmed = value.trim();
    if (!trimmed && required) {
      setIsValid(false);
    } else {
      setIsValid(true); // We don't validate content for "Others"
    }
  }, [value, touched, required]);

  const handleBlur = () => setTouched(true);

  return (
    <div className="space-y-1">
      {label && <label className="block font-medium">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full border px-2 py-1 rounded ${
          !isValid ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
      />
      {!isValid && (
        <p className="text-sm text-red-600">
          {required ? "This field is required." : "Invalid input."}
        </p>
      )}
    </div>
  );
};

export default OtherVAInput;
