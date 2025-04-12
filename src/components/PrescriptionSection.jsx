import React from "react";

const EYES = ["OD", "OS"];
const PRESCRIPTION_TYPES = ["Spectacles", "Contact Lenses"];

// 🔍 Validator Function (unchanged)
export function validatePrescription(rx, hasPrescription) {
  if (!hasPrescription) return true;

  const isQuarterStep = (value) =>
    /^[-+]?\d+(\.0{0,2}25|\.50|\.75|\.00)?$/.test(value);

  const isPositiveQuarter = (value) =>
    /^\+?\d+(\.0{0,2}25|\.50|\.75|\.00)?$/.test(value);

  const isNegativeQuarter = (value) =>
    /^-\d+(\.0{0,2}25|\.50|\.75|\.00)?$/.test(value);

  const isAxisValid = (value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0 && num <= 180 && Number.isInteger(num);
  };

  return EYES.every((eye) => {
    const fields = rx[eye];
    if (Object.values(fields).some((val) => val.trim() === "")) return false;

    const { sph, cyl, axis, va, add, nearVa } = fields;

    return (
      isQuarterStep(sph) &&
      isNegativeQuarter(cyl) &&
      isAxisValid(axis) &&
      isPositiveQuarter(va) &&
      isPositiveQuarter(add) &&
      isPositiveQuarter(nearVa)
    );
  });
}

export default function PrescriptionSection({
  hasPrescription,
  setHasPrescription,
  prescriptionType,
  setPrescriptionType,
  currentRx,
  onRxChange,
  spectaclesType,
  setSpectaclesType,
  rxFieldErrors = {}, // 🆕 added
}) {
  const placeholders = {
    sph: "+1.00 / -2.25",
    cyl: "-0.50",
    axis: "0 - 180",
    va: "6/6 or 0.00",
    add: "+1.00",
    nearVa: "6/9 or 0.00",
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-1 font-medium">
          Did patient come with a prescription?
        </label>
        <div className="flex gap-4 mt-1">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="prescription"
              value="yes"
              checked={hasPrescription === true}
              onChange={() => setHasPrescription(true)}
            />
            Yes
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="prescription"
              value="no"
              checked={hasPrescription === false}
              onChange={() => setHasPrescription(false)}
            />
            No
          </label>
        </div>
      </div>

      {hasPrescription && (
        <>
          <div>
            <label className="block mb-1 font-medium">
              Type of Prescription
            </label>
            <select
              value={prescriptionType}
              onChange={(e) => setPrescriptionType(e.target.value)}
              className="border rounded px-4 py-2 w-full"
            >
              <option value="">Select an option</option>
              {PRESCRIPTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              Patient’s Current Prescription{" "}
              <span className="text-red-500">*</span>
            </h3>

            <div className="grid grid-cols-7 gap-4 text-sm font-semibold mb-1">
              <div></div>
              <div>SPH</div>
              <div>CYL</div>
              <div>AXIS</div>
              <div>VA</div>
              <div>ADD</div>
              <div>VA (near)</div>
            </div>

            <div className="grid grid-cols-7 gap-4">
              {EYES.map((eye) => (
                <React.Fragment key={eye}>
                  <div className="font-bold self-center">{eye}</div>
                  {["sph", "cyl", "axis", "va", "add", "nearVa"].map(
                    (field) => {
                      const hasError = rxFieldErrors?.[eye]?.[field] ?? false;
                      return (
                        <input
                          key={field}
                          type="text"
                          value={currentRx[eye][field]}
                          placeholder={placeholders[field]}
                          onChange={(e) =>
                            onRxChange(eye, field, e.target.value)
                          }
                          className={`border rounded px-2 py-1 ${
                            hasError ? "border-red-500" : ""
                          }`}
                        />
                      );
                    }
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
