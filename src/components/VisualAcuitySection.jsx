import React from "react";

const EYES = ["OD", "OS"];

export const isValidSnellen = (value) =>
  /^\d{1,2}\/\d{1,2}$/.test(value.trim());

export const isValidLogMAR = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= -0.02 && num <= 3.5;
};

export const validateVASection = (sectionData, chartType) => {
  if (chartType === "Others") return true;

  const validator = chartType === "SNELLEN" ? isValidSnellen : isValidLogMAR;

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
      <h3 className="font-semibold text-lg mb-2">
        {title} <span className="text-red-500">*</span>
      </h3>

      {fields.length > 1 && (
        <div className="grid grid-cols-[80px_repeat(3,_1fr)] gap-4 text-sm font-medium mb-2">
          <div></div>
          {fields.map((f) => (
            <div key={f}>
              {f === "plusOne"
                ? "+1.00"
                : f.charAt(0).toUpperCase() + f.slice(1)}
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
                key={field}
                type="text"
                placeholder={getPlaceholder(vaChart)}
                value={vaData[eye][field]}
                onChange={(e) => onChange(eye, field, e.target.value)}
                className="border rounded px-2 py-1"
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
