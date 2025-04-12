import React from "react";

const EYES = ["OD", "OS"];
const PRESCRIPTION_TYPES = ["Spectacles", "Contact Lenses"];

export function validatePrescription(rx) {
  const isValidDecimal = (val) => val === "" || !isNaN(val);

  return EYES.every((eye) => {
    const fields = rx[eye];
    return ["sph", "cyl", "axis", "va", "add", "nearVa"].every((key) =>
      isValidDecimal(fields[key])
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
  errorMessage, // 🆕 Accept error message from parent
}) {
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
                    (field) => (
                      <input
                        key={field}
                        type="text"
                        value={currentRx[eye][field]}
                        onChange={(e) => onRxChange(eye, field, e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    )
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
