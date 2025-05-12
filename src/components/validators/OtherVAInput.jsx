import React from "react";

export default function OtherVAInput({
  value,
  onChange,
  placeholder = "Enter CF / HM / PL / NPL",
  hasError = false,
}) {
  return (
    <input
      type="text"
      className={`w-full border px-2 py-1 rounded ${
        hasError ? "border-red-500" : "border-gray-300"
      }`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
