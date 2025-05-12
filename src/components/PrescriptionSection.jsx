import React from "react";
import SPHValidator from "../components/validators/SPHValidator";
import CYLValidator from "../components/validators/CYLValidator";
import AXISValidator from "../components/validators/AXISValidator";
import VAValidator from "../components/validators/VAValidator";
import ADDValidator from "../components/validators/ADDValidator";
import MNNotationValidator from "../components/validators/MNNotationValidator";

const EYES = ["OD", "OS"];
const PRESCRIPTION_TYPES = ["Spectacles", "Contact Lenses"];

export function validatePrescription(
  hasPrescription,
  prescriptionType,
  currentRx
) {
  if (!hasPrescription) return true;

  const isPrescriptionTypeValid =
    typeof prescriptionType === "string" && prescriptionType.trim() !== "";

  const isSPHValid = ["OD", "OS"].every((eye) => {
    const sph = currentRx?.[eye]?.sph;
    return (
      typeof sph === "string" &&
      sph.trim() !== "" &&
      /^[-+][0-9]+(\.25|\.50|\.75|\.00)?$/.test(sph.trim())
    );
  });

  return isPrescriptionTypeValid && isSPHValid;
}

export default function PrescriptionSection({
  hasPrescription,
  setHasPrescription,
  prescriptionType,
  setPrescriptionType,
  currentRx,
  onRxChange,
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-1 font-medium">
          Did patient come with a prescription?{" "}
          <span className="text-red-500">*</span>
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
              Type of Prescription <span className="text-red-500">*</span>
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
              Patient’s Current Prescription
            </h3>

            <div className="grid grid-cols-7 gap-4 text-sm font-semibold mb-1">
              <div></div>
              <div>
                SPH <span className="text-red-500">*</span>
              </div>
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

                  <SPHValidator
                    value={currentRx[eye].sph}
                    onChange={(val) => onRxChange(eye, "sph", val)}
                    required
                  />
                  <CYLValidator
                    value={currentRx[eye].cyl}
                    onChange={(val) => onRxChange(eye, "cyl", val)}
                  />
                  <AXISValidator
                    value={currentRx[eye].axis}
                    onChange={(val) => onRxChange(eye, "axis", val)}
                    required={!!currentRx[eye].cyl?.trim()}
                  />
                  <VAValidator
                    value={currentRx[eye].va}
                    onChange={(val) => onRxChange(eye, "va", val)}
                  />
                  <ADDValidator
                    value={currentRx[eye].add}
                    onChange={(val) => onRxChange(eye, "add", val)}
                  />
                  <MNNotationValidator
                    value={currentRx[eye].nearVa}
                    onChange={(val) => onRxChange(eye, "nearVa", val)}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
