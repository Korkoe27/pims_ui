import React from "react";

const EYES = ["OD", "OS"];

export default function NearVisualAcuitySection({
  title,
  fields,
  vaData,
  onChange,
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
                placeholder="M/N Notation"
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
