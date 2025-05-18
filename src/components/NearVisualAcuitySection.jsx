import React from "react";
import MNNotationValidator from "./validators/MNNotationValidator";

const EYES = ["OD", "OS"];

export default function NearVisualAcuitySection({
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
              <MNNotationValidator
                key={field}
                value={vaData[eye][field]}
                onChange={(val) => onChange(eye, field, val)}
                required={false}
                label={null}
                vaChart={vaChart} // ✅ pass chart info here
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
