import React, { useState, useEffect } from "react";
import useVisualAcuityData from "../hooks/useVisualAcuityData";
import VisualAcuitySection, { validateVASection } from "./VisualAcuitySection";
import NearVisualAcuitySection from "./NearVisualAcuitySection";
import PrescriptionSection, {
  validatePrescription,
} from "./PrescriptionSection";
import { showToast } from "../components/ToasterHelper";
import { hasFormChanged } from "../utils/deepCompare";
import NavigationButtons from "../components/NavigationButtons";

const CHART_OPTIONS = [
  { value: "SNELLEN", label: "Snellen" },
  { value: "LOGMAR", label: "LogMAR" },
  { value: "Others", label: "Others" },
];

export default function VisualAcuityForm({
  onBack,
  appointmentId,
  setActiveTab,
  setTabCompletionStatus,
}) {
  const {
    visualAcuity,
    loadingVA,
    createVisualAcuity,
    createVASubmissionStatus,
  } = useVisualAcuityData(appointmentId);

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
  const [initialPayload, setInitialPayload] = useState(null);

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

      setInitialPayload({
        appointment: appointmentId,
        va_chart_used: visualAcuity.va_chart_used || "",
        distance_unaided_od: visualAcuity.distance_unaided_od || "",
        distance_ph_od: visualAcuity.distance_ph_od || "",
        distance_plus1_od: visualAcuity.distance_plus1_od || "",
        distance_unaided_os: visualAcuity.distance_unaided_os || "",
        distance_ph_os: visualAcuity.distance_ph_os || "",
        distance_plus1_os: visualAcuity.distance_plus1_os || "",
        near_va_od: visualAcuity.near_va_od || "",
        near_va_os: visualAcuity.near_va_os || "",
        came_with_prescription: visualAcuity.came_with_prescription ?? null,
        prescription_type: visualAcuity.prescription_type || null,
        rx_sph_od: visualAcuity.rx_sph_od || "",
        rx_cyl_od: visualAcuity.rx_cyl_od || "",
        rx_axis_od: visualAcuity.rx_axis_od || "",
        rx_va1_od: visualAcuity.rx_va1_od || "",
        rx_add_od: visualAcuity.rx_add_od || "",
        rx_va2_od: visualAcuity.rx_va2_od || "",
        rx_sph_os: visualAcuity.rx_sph_os || "",
        rx_cyl_os: visualAcuity.rx_cyl_os || "",
        rx_axis_os: visualAcuity.rx_axis_os || "",
        rx_va1_os: visualAcuity.rx_va1_os || "",
        rx_add_os: visualAcuity.rx_add_os || "",
        rx_va2_os: visualAcuity.rx_va2_os || "",
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
      showToast("Enter Unaided Distance VA per eye. 👍", "error");
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

    // ✅ First: check prescription type
    if (
      hasPrescription &&
      (!prescriptionType || prescriptionType.trim() === "")
    ) {
      showToast(
        "Please select a prescription type before proceeding. 👍",
        "error"
      );
      return;
    }

    // ✅ (Optional UX) Second: check prescription field validity if you still want to highlight invalid/empty fields
    if (hasPrescription) {
      const newErrors = { OD: {}, OS: {} };
      let hasErrors = false;

      ["OD", "OS"].forEach((eye) => {
        Object.entries(currentRx[eye]).forEach(([field, value]) => {
          const trimmed = value.trim();
          const num = Number(trimmed);

          if (trimmed === "") {
            // OPTIONAL: If you still want to highlight empty fields for UX, enable this:
            // newErrors[eye][field] = true;
            return; // skip further validation if empty
          }

          if (
            field === "sph" &&
            !/^[-+]?[0-9]+(\.25|\.50|\.75|\.00)?$/.test(trimmed)
          ) {
            newErrors[eye][field] = true;
            hasErrors = true;
          }
          if (
            field === "cyl" &&
            !/^-[0-9]+(\.25|\.50|\.75|\.00)?$/.test(trimmed)
          ) {
            newErrors[eye][field] = true;
            hasErrors = true;
          }
          if (
            field === "axis" &&
            (!Number.isInteger(num) || num < 0 || num > 180)
          ) {
            newErrors[eye][field] = true;
            hasErrors = true;
          }
          if (
            ["va", "add", "nearVa"].includes(field) &&
            !/^\+?[0-9]+(\.25|\.50|\.75|\.00)?$/.test(trimmed)
          ) {
            newErrors[eye][field] = true;
            hasErrors = true;
          }
        });
      });

      // if (hasErrors) {
      //   console.log("📛 Prescription validation errors:", newErrors);

      //   showToast(
      //     "Some prescription values look invalid. Please check and correct them 👍.",
      //     "error"
      //   );
      //   setRxFieldErrors(newErrors);
      //   return;
      // }

      // ✅ Check SPH for both eyes
      if (hasPrescription) {
        const newErrors = { OD: {}, OS: {} };
        let hasSPHErrors = false;

        ["OD", "OS"].forEach((eye) => {
          const value = currentRx[eye]?.sph ?? "";
          const trimmed = value.trim();
          const isValidSPH = /^[-+]?[0-9]+(\.25|\.50|\.75|\.00)?$/.test(
            trimmed
          );

          if (trimmed === "" || !isValidSPH) {
            newErrors[eye].sph = true;
            hasSPHErrors = true;
          }
        });

        if (hasSPHErrors) {
          showToast(
            "SPH is required and must be a valid value for both eyes (e.g., +1.00, -2.25). 👍",
            "error"
          );
          setRxFieldErrors(newErrors);
          return;
        }
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

    if (initialPayload && !hasFormChanged(initialPayload, payload)) {
      showToast("No changes detected", "info");
      setTabCompletionStatus?.((prev) => ({
        ...prev,
        "visual acuity": true,
      }));
      setActiveTab("externals");
      return;
    }

    try {
      await createVisualAcuity(payload).unwrap();
      showToast("Saving visual acuity...", "loading");
      setTabCompletionStatus?.((prev) => ({
        ...prev,
        "visual acuity": true,
      }));
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

      {loadingVA ? (
        <p className="text-gray-600 italic">Loading visual acuity...</p>
      ) : (
        <>
          <div>
            <label className="block font-semibold mb-1">
              VA Chart used <span className="text-red-500">*</span>
            </label>
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
            fields={[
              { key: "unaided", label: "Unaided", required: true },
              { key: "ph", label: "PH" },
              { key: "plusOne", label: "+1.00" },
            ]}
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

          <NavigationButtons
            backLabel="← Back to Personal History"
            backTo="personal history"
            onBack={setActiveTab}
            onSave={handleSaveAndProceed}
            saving={createVASubmissionStatus.isLoading}
            saveLabel="Save & Proceed"
          />
        </>
      )}
    </div>
  );
}
