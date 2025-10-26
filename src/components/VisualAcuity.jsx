import React, { useState, useEffect } from "react";
import useVisualAcuityData from "../hooks/useVisualAcuityData";
import VisualAcuitySection, { validateVASection } from "./VisualAcuitySection";
import NearVisualAcuitySection from "./NearVisualAcuitySection";
import PrescriptionSection from "./PrescriptionSection";
import { showToast } from "../components/ToasterHelper";
import { hasFormChanged } from "../utils/deepCompare";
import NavigationButtons from "../components/NavigationButtons";
import SupervisorGradingButton from "./ui/buttons/SupervisorGradingButton";
import { useGetAppointmentDetailsQuery } from "../redux/api/features/appointmentsApi";
import useComponentGrading from "../hooks/useComponentGrading";

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

  const { data: appointmentDetails } = useGetAppointmentDetailsQuery(
    appointmentId,
    { skip: !appointmentId }
  );

  const { section, sectionLabel } = useComponentGrading(
    "VISUAL_ACUITY",
    appointmentId
  );

  const [vaChart, setVaChart] = useState("");
  const [distanceVA, setDistanceVA] = useState({
    OD: { unaided: "", ph: "", plusOne: "" },
    OS: { unaided: "", ph: "", plusOne: "" },
  });
  const [nearVA, setNearVA] = useState({ OD: { near: "" }, OS: { near: "" } });
  const [hasPrescription, setHasPrescription] = useState(null);
  const [prescriptionType, setPrescriptionType] = useState("");
  const [currentRx, setCurrentRx] = useState({
    OD: { sph: "", cyl: "", axis: "", va: "", add: "", nearVa: "" },
    OS: { sph: "", cyl: "", axis: "", va: "", add: "", nearVa: "" },
  });
  const [rxFieldErrors, setRxFieldErrors] = useState({ OD: {}, OS: {} });
  const [initialPayload, setInitialPayload] = useState(null);

  useEffect(() => {
    if (!visualAcuity) return;

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

    setInitialPayload(visualAcuity);
  }, [visualAcuity]);

  const handleDistanceVAChange = (eye, field, value) =>
    setDistanceVA((prev) => ({ ...prev, [eye]: { ...prev[eye], [field]: value } }));

  const handleNearVAChange = (eye, field, value) =>
    setNearVA((prev) => ({ ...prev, [eye]: { ...prev[eye], [field]: value } }));

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

  const handleSaveAndProceed = async () => {
    if (!vaChart) return showToast("Please select the VA chart used. 👍", "error");

    const isDistancePresent = Object.values(distanceVA).every(
      (eye) => eye.unaided || eye.ph || eye.plusOne
    );
    if (!isDistancePresent)
      return showToast("Enter Unaided Distance VA per eye. 👍", "error");

    const isDistanceValid = validateVASection(distanceVA, vaChart);
    const isNearValid = validateVASection(nearVA, vaChart, true);

    if (!isDistanceValid || !isNearValid) {
      let message = "";
      if (!isDistanceValid)
        message +=
          vaChart === "SNELLEN"
            ? "Distance VA must follow Snellen format (e.g. 6/6). 👍\n"
            : vaChart === "LOGMAR"
            ? "Distance VA must be decimal between -0.02 and 3.50 for LogMAR. 👍\n"
            : "Use appropriate notation (CF, HM, PL, NPL). 👍\n";
      if (!isNearValid)
        message += "Near VA must be in M/N notation (e.g. M1, N5). 👍";
      return showToast(message.trim(), "error");
    }

    if (hasPrescription && !prescriptionType)
      return showToast("Please select a prescription type. 👍", "error");

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
      setTabCompletionStatus?.((prev) => ({ ...prev, "visual acuity": true }));
      return setActiveTab("externals");
    }

    try {
      await createVisualAcuity(payload).unwrap();
      showToast("Visual acuity saved successfully!", "success");
      setTabCompletionStatus?.((prev) => ({ ...prev, "visual acuity": true }));
      setActiveTab("externals");
    } catch (error) {
      console.error("❌ Error saving visual acuity:", error);
      showToast("Failed to save visual acuity. Please try again.", "error");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Visual Acuity</h1>
        <SupervisorGradingButton
          appointmentId={appointmentId}
          section={section}
          sectionLabel={sectionLabel}
        />
      </div>

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
            rxFieldErrors={rxFieldErrors}
          />

          <NavigationButtons
            backLabel="← Back to Oculo Medical History"
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
