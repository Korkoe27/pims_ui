import React, { useState } from "react";

const EYES = ["OD", "OS"];
const VA_OPTIONS = [
  "6/6",
  "6/9",
  "6/12",
  "6/18",
  "6/24",
  "6/36",
  "6/60",
  "CF",
  "HM",
  "PL",
  "NLP",
];
const CHART_OPTIONS = ["Snellen", "LogMAR"];
const PRESCRIPTION_TYPES = ["Spectacles", "Contact Lenses"];

export default function VisualAcuityForm({
  onBack,
  onProceed,
  isSaving = false,
}) {
  const [vaChart, setVaChart] = useState("");
  const [distanceVA, setDistanceVA] = useState({
    OD: { unaided: "", ph: "", plusOne: "" },
    OS: { unaided: "", ph: "", plusOne: "" },
  });
  const [nearVA, setNearVA] = useState({ OD: "", OS: "" });
  const [hasPrescription, setHasPrescription] = useState(null);
  const [prescriptionType, setPrescriptionType] = useState("");
  const [currentRx, setCurrentRx] = useState({
    OD: { sph: "", cyl: "", axis: "", va: "", add: "", nearVa: "" },
    OS: { sph: "", cyl: "", axis: "", va: "", add: "", nearVa: "" },
  });

  const handleDistanceVAChange = (eye, field, value) => {
    setDistanceVA((prev) => ({
      ...prev,
      [eye]: { ...prev[eye], [field]: value },
    }));
  };

  const handleRxChange = (eye, field, value) => {
    setCurrentRx((prev) => ({
      ...prev,
      [eye]: { ...prev[eye], [field]: value },
    }));
  };

  const handleSaveAndProceed = () => {
    const payload = {
      va_chart_used: vaChart,
      distance_va: distanceVA,
      near_va: nearVA,
      came_with_prescription: hasPrescription,
      prescription_type: hasPrescription ? prescriptionType : null,
      current_prescription: hasPrescription ? currentRx : null,
    };

    if (onProceed) {
      onProceed(payload);
    }
  };

  return (
    <div className="space-y-6">
      {/* VA Chart */}
      <div>
        <label className="block font-semibold mb-1">VA Chart used</label>
        <select
          value={vaChart}
          onChange={(e) => setVaChart(e.target.value)}
          className="w-full border rounded px-4 py-2"
        >
          <option value="">Select an option</option>
          {CHART_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Distance VA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Distance VA */}
        <div>
          <h3 className="font-semibold text-lg">
            Distance VA<span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div />
            <div>Unaided</div>
            <div>PH</div>
            <div>+1.00</div>

            {EYES.map((eye) => (
              <React.Fragment key={eye}>
                <div className="font-bold">{eye}</div>
                {["unaided", "ph", "plusOne"].map((field) => (
                  <select
                    key={field}
                    value={distanceVA[eye][field]}
                    onChange={(e) =>
                      handleDistanceVAChange(eye, field, e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="">Select</option>
                    {VA_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Near VA */}
        <div>
          <h3 className="font-semibold text-lg">
            Near VA (unaided)<span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {EYES.map((eye) => (
              <div key={eye} className="flex flex-col">
                <label className="font-bold">{eye}</label>
                <select
                  value={nearVA[eye]}
                  onChange={(e) =>
                    setNearVA({ ...nearVA, [eye]: e.target.value })
                  }
                  className="border rounded px-2 py-1"
                >
                  <option value="">Select</option>
                  {VA_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prescription Info */}
      <div className="flex items-center gap-8">
        <div>
          <label className="block mb-1">
            Did patient come with a prescription?
          </label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name="prescription"
                onChange={() => setHasPrescription(true)}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="prescription"
                onChange={() => setHasPrescription(false)}
              />{" "}
              No
            </label>
          </div>
        </div>

        {hasPrescription && (
          <div>
            <label className="block mb-1">Type of Prescription</label>
            <select
              value={prescriptionType}
              onChange={(e) => setPrescriptionType(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option value="">Select an option</option>
              {PRESCRIPTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Current Prescription */}
      {hasPrescription && (
        <div>
          <h3 className="font-semibold text-lg">
            Patient’s Current Prescription
            <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-7 gap-4 text-sm font-semibold">
            <div />
            <div>SPH</div>
            <div>CYL</div>
            <div>AXIS</div>
            <div>VA</div>
            <div>ADD</div>
            <div>VA (near)</div>

            {EYES.map((eye) => (
              <React.Fragment key={eye}>
                <div className="font-bold">{eye}</div>
                {["sph", "cyl", "axis", "va", "add", "nearVa"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    value={currentRx[eye][field]}
                    onChange={(e) => handleRxChange(eye, field, e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleSaveAndProceed}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save & Proceed"}
        </button>
      </div>
    </div>
  );
}
