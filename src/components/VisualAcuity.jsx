import React, { useState } from "react";
import ErrorModal from "./ErrorModal";

const EYES = ["OD", "OS"];
const CHART_OPTIONS = ["Snellen", "LogMAR"];
const PRESCRIPTION_TYPES = ["Spectacles", "Contact Lenses"];

export default function VisualAcuityForm({
  onBack,
  isSaving = false,
  appointmentId,
  createVisualAcuity,
  setActiveTab,
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

  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

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

  const handleSaveAndProceed = async () => {
    setErrorMessage(null);
    setShowErrorModal(false);

    if (!vaChart) {
      setErrorMessage({ detail: "Please select the VA chart used. 👍" });
      setShowErrorModal(true);
      return;
    }

    const isDistanceVAValid = Object.values(distanceVA).every(
      (eye) => eye.unaided || eye.ph || eye.plusOne
    );
    if (!isDistanceVAValid) {
      setErrorMessage({ detail: "Enter at least one Distance VA per eye. 👍" });
      setShowErrorModal(true);
      return;
    }

    if (!nearVA.OD || !nearVA.OS) {
      setErrorMessage({ detail: "Enter Near VA for both eyes. 👍" });
      setShowErrorModal(true);
      return;
    }

    const payload = {
      appointment: appointmentId,
      va_chart_used: vaChart,
      distance_va: distanceVA,
      near_va: nearVA,
      came_with_prescription: hasPrescription,
      prescription_type: hasPrescription ? prescriptionType : null,
      current_prescription: hasPrescription ? currentRx : null,
    };

    try {
      await createVisualAcuity(payload).unwrap();
      console.log("✅ Visual acuity saved");
      setActiveTab("refraction");
    } catch (error) {
      console.error("❌ Error saving visual acuity:", error);
      setErrorMessage(
        error?.data || { detail: "An unexpected error occurred." }
      );
      setShowErrorModal(true);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-2xl font-bold mb-6">Visual Acuity</h1>

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

      {/* Distance VA + Near VA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Distance VA */}
        <div>
          <h3 className="font-semibold text-lg mb-2">
            Distance VA<span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-4 gap-4 text-sm font-medium mb-2">
            <div></div>
            <div>Unaided</div>
            <div>PH</div>
            <div>+1.00</div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {EYES.map((eye) => (
              <React.Fragment key={eye}>
                <div className="font-bold self-center">{eye}</div>
                {["unaided", "ph", "plusOne"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    value={distanceVA[eye][field]}
                    onChange={(e) =>
                      handleDistanceVAChange(eye, field, e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Near VA */}
        <div>
          <h3 className="font-semibold text-lg mb-2">
            Near VA (unaided)<span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {EYES.map((eye) => (
              <div key={eye} className="flex flex-col">
                <label className="font-bold mb-1">{eye}</label>
                <input
                  type="text"
                  value={nearVA[eye]}
                  onChange={(e) =>
                    setNearVA({ ...nearVA, [eye]: e.target.value })
                  }
                  className="border rounded px-2 py-1"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prescription Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <label className="block mb-1 font-medium">
            Did patient come with a prescription?
          </label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="prescription"
                checked={hasPrescription === true}
                onChange={() => setHasPrescription(true)}
              />
              Yes
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="prescription"
                checked={hasPrescription === false}
                onChange={() => setHasPrescription(false)}
              />
              No
            </label>
          </div>
        </div>

        {hasPrescription && (
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
        )}
      </div>

      {/* Current Prescription */}
      {hasPrescription && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">
            Patient’s Current Prescription
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
      <div className="flex justify-end gap-4 pt-10">
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

      {showErrorModal && errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
}
