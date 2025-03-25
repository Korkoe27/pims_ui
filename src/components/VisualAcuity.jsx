import React, { useState, useEffect } from "react";
import ErrorModal from "./ErrorModal";
import useVisualAcuityData from "../hooks/useVisualAcuityData";

const EYES = ["OD", "OS"];
const CHART_OPTIONS = [
  { value: "SNELLEN", label: "Snellen" },
  { value: "LOGMAR", label: "LogMAR" },
];
const PRESCRIPTION_TYPES = ["Spectacles", "Contact Lenses"];

export default function VisualAcuityForm({
  onBack,
  appointmentId,
  setActiveTab,
}) {
  const {
    createVisualAcuity,
    visualAcuity,
    loadingVA,
    createVASubmissionStatus,
  } = useVisualAcuityData(appointmentId);

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

  useEffect(() => {
    if (visualAcuity) {
      setVaChart(visualAcuity.va_chart_used || "");
      setDistanceVA({
        OD: {
          unaided: visualAcuity.distance_unaided_od || "",
          ph: visualAcuity.distance_ph_od || "",
          plusOne: visualAcuity.distance_plus1_od || "",
        },
        OS: {
          unaided: visualAcuity.distance_unaided_os || "",
          ph: visualAcuity.distance_ph_os || "",
          plusOne: visualAcuity.distance_plus1_os || "",
        },
      });
      setNearVA({
        OD: visualAcuity.near_va_od || "",
        OS: visualAcuity.near_va_os || "",
      });
      setHasPrescription(visualAcuity.came_with_prescription ?? null);
      setPrescriptionType(
        visualAcuity.prescription_type === "GLASSES"
          ? "Spectacles"
          : visualAcuity.prescription_type === "CONTACTS"
          ? "Contact Lenses"
          : ""
      );
      setCurrentRx({
        OD: {
          sph: visualAcuity.rx_sph_od || "",
          cyl: visualAcuity.rx_cyl_od || "",
          axis: visualAcuity.rx_axis_od || "",
          va: visualAcuity.rx_va1_od || "",
          add: visualAcuity.rx_add_od || "",
          nearVa: visualAcuity.rx_va2_od || "",
        },
        OS: {
          sph: visualAcuity.rx_sph_os || "",
          cyl: visualAcuity.rx_cyl_os || "",
          axis: visualAcuity.rx_axis_os || "",
          va: visualAcuity.rx_va1_os || "",
          add: visualAcuity.rx_add_os || "",
          nearVa: visualAcuity.rx_va2_os || "",
        },
      });
    }
  }, [visualAcuity]);

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

  const isValidSnellen = (value) => /^\d{1,2}\/\d{1,2}$/.test(value.trim());
  const isValidLogMAR = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= -0.02 && num <= 3.5;
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

    const allDistanceValues = [
      distanceVA.OD.unaided,
      distanceVA.OD.ph,
      distanceVA.OD.plusOne,
      distanceVA.OS.unaided,
      distanceVA.OS.ph,
      distanceVA.OS.plusOne,
    ];
    const allNearValues = [nearVA.OD, nearVA.OS];

    const isValidVAEntry = (value) => {
      if (!value) return true;
      if (vaChart === "Snellen") return isValidSnellen(value);
      if (vaChart === "LogMAR") return isValidLogMAR(value);
      return false;
    };

    const allVAEntriesValid = [...allDistanceValues, ...allNearValues].every(
      isValidVAEntry
    );
    if (!allVAEntriesValid) {
      setErrorMessage({
        detail:
          vaChart === "Snellen"
            ? "All VA entries must be in the format e.g. 6/6 or 6/18 for Snellen chart. 👍"
            : "All VA entries must be decimal values between -0.02 and 3.50 for LogMAR chart. 👍",
      });
      setShowErrorModal(true);
      return;
    }

    if (hasPrescription) {
      const correctedRx = { ...currentRx };
      const fieldsToValidate = ["sph", "cyl", "axis", "va", "add"];

      for (const eye of EYES) {
        for (const field of fieldsToValidate) {
          const rawValue = correctedRx[eye][field];
          if (rawValue === "") continue;

          const value = parseFloat(rawValue);
          if (isNaN(value)) {
            setErrorMessage({
              detail: `Invalid number for ${field.toUpperCase()} (${eye}).`,
            });
            setShowErrorModal(true);
            return;
          }

          if (field === "sph") {
            if (value % 0.25 !== 0) {
              setErrorMessage({
                detail: `SPH (${eye}) must be a multiple of 0.25.`,
              });
              setShowErrorModal(true);
              return;
            }
            correctedRx[eye][field] = value > 0 ? `+${value}` : `${value}`;
          }

          if (field === "cyl") {
            const negValue = value > 0 ? -value : value;
            if (Math.abs(negValue) % 0.25 !== 0) {
              setErrorMessage({
                detail: `CYL (${eye}) must be a negative multiple of 0.25.`,
              });
              setShowErrorModal(true);
              return;
            }
            correctedRx[eye][field] = `${negValue}`;
          }

          if (field === "axis") {
            if (value < 0 || value > 180) {
              setErrorMessage({
                detail: `AXIS (${eye}) must be between 0 and 180.`,
              });
              setShowErrorModal(true);
              return;
            }
            correctedRx[eye][field] = `${Math.round(value)}`;
          }

          if (field === "va" || field === "add") {
            if (value <= 0 || value % 0.25 !== 0) {
              setErrorMessage({
                detail: `${field.toUpperCase()} (${eye}) must be a positive value divisible by 0.25.`,
              });
              setShowErrorModal(true);
              return;
            }
            correctedRx[eye][field] = `${value}`;
          }
        }
      }

      setCurrentRx(correctedRx);
    }

    const payload = {
      appointment: appointmentId,
      va_chart_used: vaChart,
      distance_unaided_od: distanceVA.OD.unaided,
      distance_unaided_os: distanceVA.OS.unaided,
      distance_ph_od: distanceVA.OD.ph,
      distance_ph_os: distanceVA.OS.ph,
      distance_plus1_od: distanceVA.OD.plusOne,
      distance_plus1_os: distanceVA.OS.plusOne,
      near_va_od: nearVA.OD,
      near_va_os: nearVA.OS,
      came_with_prescription: hasPrescription,
      prescription_type: hasPrescription
        ? prescriptionType === "Spectacles"
          ? "GLASSES"
          : "CONTACTS"
        : null,
      rx_sph_od: currentRx.OD.sph,
      rx_cyl_od: currentRx.OD.cyl,
      rx_axis_od: currentRx.OD.axis,
      rx_add_od: currentRx.OD.add,
      rx_va1_od: currentRx.OD.va,
      rx_va2_od: currentRx.OD.nearVa,
      rx_sph_os: currentRx.OS.sph,
      rx_cyl_os: currentRx.OS.cyl,
      rx_axis_os: currentRx.OS.axis,
      rx_add_os: currentRx.OS.add,
      rx_va1_os: currentRx.OS.va,
      rx_va2_os: currentRx.OS.nearVa,
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

      <div>
        <label className="block font-semibold mb-1">VA Chart used</label>
        <select
          value={vaChart}
          onChange={(e) => setVaChart(e.target.value)}
          className="w-full border rounded px-4 py-2"
        >
          <option value="">Select an option</option>
          {CHART_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
          disabled={createVASubmissionStatus.isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {createVASubmissionStatus.isLoading ? "Saving..." : "Save & Proceed"}
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
