import React, { useState, useEffect } from "react";
import ErrorModal from "./ErrorModal";
import useVisualAcuityData from "../hooks/useVisualAcuityData";
import VisualAcuitySection, { validateVASection } from "./VisualAcuitySection";
import NearVisualAcuitySection from "./NearVisualAcuitySection";
import PrescriptionSection, {
  validatePrescription,
} from "./PrescriptionSection";
import { showToast } from "../components/ToasterHelper";

const CHART_OPTIONS = [
  { value: "SNELLEN", label: "Snellen" },
  { value: "LOGMAR", label: "LogMAR" },
  { value: "Others", label: "Others" },
];

export default function VisualAcuityForm({
  onBack,
  appointmentId,
  setActiveTab,
}) {
  const { visualAcuity, createVisualAcuity, createVASubmissionStatus } =
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
  const [spectaclesType, setSpectaclesType] = useState("");
  const [rxFieldErrors, setRxFieldErrors] = useState({ OD: {}, OS: {} });

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

  useEffect(() => {
    if (showErrorModal && errorMessage) {
      showToast(errorMessage.detail, "error");
      setShowErrorModal(false);
    }
  }, [showErrorModal, errorMessage]);

  const handleDistanceVAChange = (eye, field, value) => {
    setDistanceVA((prev) => ({
      ...prev,
      [eye]: { ...prev[eye], [field]: value },
    }));
  };

  const handleNearVAChange = (eye, field, value) => {
    setNearVA((prev) => ({ ...prev, [eye]: { ...prev[eye], [field]: value } }));
  };

  const handleRxChange = (eye, field, value) => {
    setCurrentRx((prev) => ({
      ...prev,
      [eye]: { ...prev[eye], [field]: value },
    }));
    setRxFieldErrors((prev) => ({
      ...prev,
      [eye]: { ...prev[eye], [field]: false },
    }));
  };

  const formatErrorMessage = (data) => {
    if (!data) return { detail: "An unexpected error occurred." };
    if (typeof data.detail === "string") return { detail: data.detail };
    if (typeof data === "object") {
      const messages = Object.entries(data)
        .map(([key, value]) => {
          const label = key.replace(/_/g, " ").toUpperCase();
          const msg = Array.isArray(value) ? value.join(", ") : value;
          return `${label}: ${msg}`;
        })
        .join("\n");
      return { detail: messages };
    }
    return { detail: "An unexpected error occurred." };
  };

  const handleSaveAndProceed = async () => {
    setErrorMessage(null);
    setShowErrorModal(false);
    setRxFieldErrors({ OD: {}, OS: {} });

    if (!vaChart) {
      showToast("Please select the VA chart used. 👍", "error");
      return;
    }

    const isDistancePresent = Object.values(distanceVA).every(
      (eye) => eye.unaided || eye.ph || eye.plusOne
    );

    if (!isDistancePresent) {
      showToast("Enter at least one Distance VA per eye. 👍", "error");
      return;
    }

    const isDistanceValid = validateVASection(distanceVA, vaChart);
    const isNearValid = validateVASection(nearVA, vaChart, true);

    if (!isDistanceValid || !isNearValid) {
      let message = "";
      if (!isDistanceValid) {
        message +=
          vaChart === "SNELLEN"
            ? "All *Distance VA* entries must be in the format e.g. 6/6 or 6/18 for Snellen chart. 👍\n"
            : vaChart === "LOGMAR"
            ? "All *Distance VA* entries must be decimal values between -0.02 and 3.50 for LogMAR chart. 👍\n"
            : "Use appropriate notation for Distance VA e.g. CF, HM, PL, NPL. 👍\n";
      }
      if (!isNearValid) {
        message +=
          "All *Near VA* entries must be in M/N notation e.g. M1, N5, M2.5. 👍";
      }
      showToast(message.trim(), "error");
      return;
    }

    const isRxValid = validatePrescription(currentRx, hasPrescription);
    if (hasPrescription && !isRxValid) {
      showToast(
        "Please complete all prescription fields with valid values before proceeding. 👍",
        "error"
      );

      // Highlight fields
      const newErrors = { OD: {}, OS: {} };
      ["OD", "OS"].forEach((eye) => {
        Object.entries(currentRx[eye]).forEach(([field, value]) => {
          if (value.trim() === "") {
            newErrors[eye][field] = true;
          } else {
            const num = Number(value);
            if (
              field === "sph" &&
              !/^[-+]?[0-9]+(\.25|\.50|\.75|\.00)?$/.test(value)
            )
              newErrors[eye][field] = true;
            if (
              field === "cyl" &&
              !/^-[0-9]+(\.25|\.50|\.75|\.00)?$/.test(value)
            )
              newErrors[eye][field] = true;
            if (
              field === "axis" &&
              (!Number.isInteger(num) || num < 0 || num > 180)
            )
              newErrors[eye][field] = true;
            if (
              ["va", "add", "nearVa"].includes(field) &&
              !/^\+?[0-9]+(\.25|\.50|\.75|\.00)?$/.test(value)
            )
              newErrors[eye][field] = true;
          }
        });
      });
      setRxFieldErrors(newErrors);
      return;
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
      showToast("Visual acuity saved successfully!", "success");
      setActiveTab("externals");
    } catch (error) {
      console.error("❌ Error saving visual acuity:", error);
      const formatted = formatErrorMessage(error?.data);
      showToast(formatted.detail, "error");
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

      <NearVisualAcuitySection
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
        spectaclesType={spectaclesType}
        setSpectaclesType={setSpectaclesType}
        rxFieldErrors={rxFieldErrors}
      />

      <div className="mt-8 flex justify-between items-center">
        <button
          type="button"
          onClick={() => setActiveTab("personal history")}
          className="px-6 py-2 font-semibold text-indigo-600 border border-indigo-600 rounded-full shadow-sm hover:bg-indigo-50 transition-colors duration-200"
        >
          ← Back to Personal History
        </button>

        <button
          type="button"
          onClick={handleSaveAndProceed}
          disabled={createVASubmissionStatus.isLoading}
          className={`px-6 py-2 font-semibold text-white rounded-full shadow-md transition-colors duration-200 ${
            createVASubmissionStatus.isLoading
              ? "bg-gray-400"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {createVASubmissionStatus.isLoading ? "Saving..." : "Save & Proceed"}
        </button>
      </div>
    </div>
  );
}
