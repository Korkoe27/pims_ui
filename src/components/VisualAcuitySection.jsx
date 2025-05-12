import React from "react";

const EYES = ["OD", "OS"];

export const isValidSnellen = (value) =>
  /^\d{1,2}\/\d{1,2}$/.test(value.trim());

export const isValidLogMAR = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= -0.02 && num <= 3.5;
};

export const isValidNearVA = (value) => /^[MN]\d+(\.\d+)?$/i.test(value.trim());

export const validateVASection = (sectionData, chartType, isNear = false) => {
  if (chartType === "Others") return true;

  const validator = isNear
    ? isValidNearVA
    : chartType === "SNELLEN"
    ? isValidSnellen
    : isValidLogMAR;

  return Object.values(sectionData).every((eye) =>
    Object.values(eye).every((val) => {
      const trimmed = typeof val === "string" ? val.trim() : val;
      return !trimmed || validator(trimmed);
    })
  );
};

const getPlaceholder = (chartType) => {
  if (chartType === "SNELLEN") return "6/6";
  if (chartType === "LOGMAR") return "0.00";
  if (chartType === "Others") return "Enter CF/HM/PL/NPL";
  return "";
};

export default function VisualAcuitySection({
  title,
  fields,
  vaData,
  onChange,
  vaChart,
}) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>

      {fields.length > 1 && (
        <div className="grid grid-cols-[80px_repeat(3,_1fr)] gap-4 text-sm font-medium mb-2">
          <div></div>
          {fields.map((field) => (
            <div key={field.key}>
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </div>
          ))}
        </div>
      )}

      <div
        className={`grid ${
          fields.length > 1 ? "grid-cols-[80px_repeat(3,_1fr)]" : "grid-cols-2"
        } gap-4`}
      >
        {EYES.map((eye) => (
          <React.Fragment key={eye}>
            <div className="font-bold self-center">{eye}</div>
            {fields.map((field) => (
              <input
                key={field.key}
                type="text"
                placeholder={getPlaceholder(vaChart)}
                value={vaData[eye][field.key]}
                onChange={(e) => onChange(eye, field.key, e.target.value)}
                className="border rounded px-2 py-1"
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
