import React, { useState, useEffect } from "react";
import ErrorModal from "./ErrorModal";
import useVisualAcuityData from "../hooks/useVisualAcuityData";
import VisualAcuitySection, { validateVASection } from "./VisualAcuitySection";
import PrescriptionSection, {
  validatePrescription,
} from "./PrescriptionSection";

const EYES = ["OD", "OS"];
const CHART_OPTIONS = [
  { value: "SNELLEN", label: "Snellen" },
  { value: "LOGMAR", label: "LogMAR" },
];

export default function VisualAcuityForm({
  onBack,
  appointmentId,
  setActiveTab,
}) {
  const { createVisualAcuity, visualAcuity, createVASubmissionStatus } =
    useVisualAcuityData(appointmentId);

  const [vaChart, setVaChart] = useState("");
  const [distanceVA, setDistanceVA] = useState({
    OD: { unaided: "", ph: "", plusOne: "" },
    OS: { unaided: "", ph: "", plusOne: "" },
  });

  const [nearVA, setNearVA] = useState({
    OD: { near: "" },
    OS: { near: "" },
  });

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
        OD: { near: visualAcuity.near_va_od || "" },
        OS: { near: visualAcuity.near_va_os || "" },
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

  const handleNearVAChange = (eye, field, value) => {
    setNearVA((prev) => ({
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

    const isDistancePresent = Object.values(distanceVA).every(
      (eye) => eye.unaided || eye.ph || eye.plusOne
    );

    if (!isDistancePresent) {
      setErrorMessage({ detail: "Enter at least one Distance VA per eye. 👍" });
      setShowErrorModal(true);
      return;
    }

    const isDistanceValid = validateVASection(distanceVA, vaChart);
    const isNearValid = validateVASection(nearVA, vaChart);

    if (!isDistanceValid || !isNearValid) {
      setErrorMessage({
        detail:
          vaChart === "SNELLEN"
            ? "All VA entries must be in the format e.g. 6/6 or 6/18 for Snellen chart. 👍"
            : "All VA entries must be decimal values between -0.02 and 3.50 for LogMAR chart. 👍",
      });
      setShowErrorModal(true);
      return;
    }

    if (hasPrescription) {
      const result = validatePrescription(currentRx);
      if (!result.valid) {
        setErrorMessage({ detail: result.message });
        setShowErrorModal(true);
        return;
      }
    }

    const payload = {
      appointment: appointmentId,
      va_chart_used: vaChart,
      distance_unaided_od: distanceVA.OD.unaided,
      distance_ph_od: distanceVA.OD.ph,
      distance_plus1_od: distanceVA.OD.plusOne,
      distance_unaided_os: distanceVA.OS.unaided,
      distance_ph_os: distanceVA.OS.ph,
      distance_plus1_os: distanceVA.OS.plusOne,
      near_va_od: nearVA.OD.near,
      near_va_os: nearVA.OS.near,
      came_with_prescription: hasPrescription,
      prescription_type:
        hasPrescription && prescriptionType === "Spectacles"
          ? "GLASSES"
          : hasPrescription && prescriptionType === "Contact Lenses"
          ? "CONTACTS"
          : null,
      rx_sph_od: currentRx.OD.sph,
      rx_cyl_od: currentRx.OD.cyl,
      rx_axis_od: currentRx.OD.axis,
      rx_va1_od: currentRx.OD.va,
      rx_add_od: currentRx.OD.add,
      rx_va2_od: currentRx.OD.nearVa,
      rx_sph_os: currentRx.OS.sph,
      rx_cyl_os: currentRx.OS.cyl,
      rx_axis_os: currentRx.OS.axis,
      rx_va1_os: currentRx.OS.va,
      rx_add_os: currentRx.OS.add,
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

      <VisualAcuitySection
        title="Distance VA"
        fields={["unaided", "ph", "plusOne"]}
        vaData={distanceVA}
        onChange={handleDistanceVAChange}
        vaChart={vaChart}
      />

      <VisualAcuitySection
        title="Near VA (unaided)"
        fields={["near"]}
        vaData={nearVA}
        onChange={handleNearVAChange}
        vaChart={vaChart}
      />

      <PrescriptionSection
        hasPrescription={hasPrescription}
        setHasPrescription={setHasPrescription}
        prescriptionType={prescriptionType}
        setPrescriptionType={setPrescriptionType}
        currentRx={currentRx}
        onRxChange={handleRxChange}
      />

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
