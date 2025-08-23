import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";
import PatientModal from "./SelectClinicModal";
import { showToast } from "../components/ToasterHelper";
import RefractiveCorrectionSection from "./RefractiveCorrectionSection";
import MedicationForm from "./MedicationForm";
import SupervisorGradingButton from "./SupervisorGradingButton";

// RTK Query
import useManagementData from "../hooks/useManagementData";

// --- helper small components (placeholders you can replace later) ---
const CaseManagementGuide = ({ appointmentId }) => (
  <div className="rounded-md border bg-white p-4">
    <h3 className="text-lg font-semibold mb-2">Case Management Guide</h3>
    <p className="text-sm text-gray-600">
      Checklist / tips for students (appointment: {appointmentId})
    </p>
  </div>
);

const LogsPanel = ({ appointmentId }) => (
  <div className="rounded-md border bg-white p-4">
    <h3 className="text-lg font-semibold mb-2">Logs</h3>
    <p className="text-sm text-gray-600">
      Audit trail & activity for this management plan (appointment:{" "}
      {appointmentId})
    </p>
  </div>
);

const Tab = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "px-4 py-2 rounded-md text-sm font-medium border",
      active
        ? "bg-[#2f3192] text-white border-[#2f3192]"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
    ].join(" ")}
  >
    {children}
  </button>
);

// ---------- helpers ----------
const toMedArray = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "object") return Object.values(raw); // handle dict keyed by id
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object") return Object.values(parsed);
  } catch {}
  return [];
};

// ---------------------------------------------------------------
// Management Flow (mini-sub-steps just like Consultation tabs)
// ---------------------------------------------------------------
const Management = ({ setFlowStep, appointmentId }) => {
  const navigate = useNavigate();

  // ---- role (swap with your real auth state) ----
  // expected: "student" | "lecturer" | "admin"
  const role = window?.__APP_ROLE__ || "student";

  // ---- localStorage keys for this appointment ----
  const LOCAL_TAB_KEY = `management-${appointmentId}-activeTab`;

  const [activeTab, _setActiveTab] = useState(() => {
    const stored = localStorage.getItem(LOCAL_TAB_KEY);
    return stored || "management";
  });
  const setActiveTab = (tab) => {
    localStorage.setItem(LOCAL_TAB_KEY, tab);
    _setActiveTab(tab);
  };

  // ---------------- RTK QUERY ----------------
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const {
    medications,
    medicationTypes,
    filteredMedications,
    managementPlan,
    isMedicationsLoading,
    isMedicationTypesLoading,
    isFilteringMedications,
    isManagementPlanLoading,
    createManagementPlan,
    isCreatingManagementPlan,
  } = useManagementData(appointmentId, selectedTypeId);

  // ---------------- UI STATE ----------------
  const [modal, setModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);

  const [checkboxes, setCheckboxes] = useState({
    refractiveCorrection: false,
    medications: false,
    counselling: false,
    lowVisionAid: false,
    therapy: false,
    surgery: false,
    referral: false,
  });

  const [prescription, setPrescription] = useState({
    type_of_refractive_correction: "",
    od_sph: "",
    od_cyl: "",
    od_axis: "",
    od_add: "",
    os_sph: "",
    os_cyl: "",
    os_axis: "",
    os_add: "",
    type_of_lens: "",
    pd: "",
    segment_height: "",
    fitting_cross_height: "",
  });

  const [details, setDetails] = useState({
    surgery_details: "",
    referral_details: "",
    counselling_details: "",
    low_vision_aid_details: "",
    therapy_details: "",
  });

  const [selectedMedications, setSelectedMedications] = useState([]);

  const medsList = useMemo(
    () => (selectedTypeId ? filteredMedications : medications) ?? [],
    [selectedTypeId, filteredMedications, medications]
  );

  // ---------------- PREFILL FROM BACKEND (robust) ----------------
  useEffect(() => {
    if (!managementPlan) return;

    const optsRaw = managementPlan.options;
    const rx = managementPlan.refractive_prescription;
    const medsRaw = managementPlan.medications;
    const extra = managementPlan.extra_details || {};

    // options
    if (optsRaw && typeof optsRaw === "object") {
      setCheckboxes((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.keys(prev).map((k) => [k, Boolean(optsRaw[k])])
        ),
      }));
    }

    // refractive prescription
    if (rx) {
      setPrescription({
        type_of_refractive_correction: rx.type_of_refractive_correction ?? "",
        od_sph: rx.od?.sph ?? "",
        od_cyl: rx.od?.cyl ?? "",
        od_axis: rx.od?.axis ?? "",
        od_add: rx.od?.add ?? "",
        os_sph: rx.os?.sph ?? "",
        os_cyl: rx.os?.cyl ?? "",
        os_axis: rx.os?.axis ?? "",
        os_add: rx.os?.add ?? "",
        type_of_lens: rx.type_of_lens ?? "",
        pd: rx.pd ?? "",
        segment_height: rx.segment_height ?? "",
        fitting_cross_height: rx.fitting_cross_height ?? "",
      });
    }

    // extra details
    setDetails({
      surgery_details: extra.surgery_details ?? "",
      referral_details: extra.referral_details ?? "",
      counselling_details: extra.counselling_details ?? "",
      low_vision_aid_details: extra.low_vision_aid_details ?? "",
      therapy_details: extra.therapy_details ?? "",
    });

    // medications (normalize!)
    const medsArr = toMedArray(medsRaw);
    setSelectedMedications(
      medsArr.map((m) => ({
        medication_id: m.medication_id ?? m.id ?? m.value ?? m.medId ?? null,
        dosage: m.dosage ?? "",
        frequency: m.frequency ?? "",
        duration: m.duration ?? "",
        notes: m.notes ?? "",
        name: m.name ?? m.label ?? "",
      }))
    );
  }, [managementPlan]);

  // ---------------- VALIDATION ----------------
  const validateBeforeConfirm = () => {
    const isValidSPH = (v) =>
      /^[+-][0-9]+(\.25|\.50|\.75|\.00)?$/.test((v || "").trim());
    const isValidCYL = (v) =>
      /^-[0-9]+(\.25|\.50|\.75|\.00)?$/.test((v || "").trim());
    const isValidAXIS = (v) => {
      const n = Number((v || "").trim());
      return Number.isInteger(n) && n >= 0 && n <= 180;
    };
    const isValidADD = (v) =>
      /^\+[0-9]+(\.25|\.50|\.75|\.00)?$/.test((v || "").trim());

    const atLeastOneSelected = Object.values(checkboxes).some(Boolean);
    if (!atLeastOneSelected) {
      showToast("Please select at least one management option.", "error");
      return false;
    }

    if (checkboxes.refractiveCorrection) {
      if (!prescription.type_of_refractive_correction) {
        showToast("Please select a type of refractive correction.", "error");
        return false;
      }
      if (
        !isValidSPH(prescription.od_sph) ||
        !isValidSPH(prescription.os_sph)
      ) {
        showToast("SPH is required and must be valid for both eyes.", "error");
        return false;
      }
      if (
        (prescription.od_cyl && !isValidCYL(prescription.od_cyl)) ||
        (prescription.os_cyl && !isValidCYL(prescription.os_cyl))
      ) {
        showToast("CYL must be negative and valid (e.g., -0.75).", "error");
        return false;
      }
      if (
        (prescription.od_cyl && !isValidAXIS(prescription.od_axis)) ||
        (prescription.os_cyl && !isValidAXIS(prescription.os_axis))
      ) {
        showToast(
          "AXIS is required and must be 0–180 if CYL is provided.",
          "error"
        );
        return false;
      }
      if (
        (prescription.od_add && !isValidADD(prescription.od_add)) ||
        (prescription.os_add && !isValidADD(prescription.os_add))
      ) {
        showToast(
          "ADD must start with '+' and be valid (e.g., +1.00).",
          "error"
        );
        return false;
      }
    }
    return true;
  };

  // ---------------- PAYLOAD ----------------
  const buildPayload = () => {
    const options = Object.fromEntries(
      Object.entries(checkboxes).map(([k, v]) => [k, !!v])
    );

    const refractive_prescription = checkboxes.refractiveCorrection
      ? {
          type_of_refractive_correction:
            prescription.type_of_refractive_correction || null,
          od: {
            sph: prescription.od_sph || null,
            cyl: prescription.od_cyl || null,
            axis: prescription.od_axis || null,
            add: prescription.od_add || null,
          },
          os: {
            sph: prescription.os_sph || null,
            cyl: prescription.os_cyl || null,
            axis: prescription.os_axis || null,
            add: prescription.os_add || null,
          },
          type_of_lens: prescription.type_of_lens || null,
          pd: prescription.pd || null,
          segment_height: prescription.segment_height || null,
          fitting_cross_height: prescription.fitting_cross_height || null,
        }
      : null;

    const meds = checkboxes.medications
      ? selectedMedications.map((m) => ({
          medication_id: m.medication_id ?? m.id ?? m.value,
          dosage: m.dosage ?? null,
          frequency: m.frequency ?? null,
          duration: m.duration ?? null,
          notes: m.notes ?? null,
        }))
      : [];

    const extra_details = {
      surgery_details: checkboxes.surgery
        ? details.surgery_details || null
        : null,
      referral_details: checkboxes.referral
        ? details.referral_details || null
        : null,
      counselling_details: checkboxes.counselling
        ? details.counselling_details || null
        : null,
      therapy_details: checkboxes.therapy
        ? details.therapy_details || null
        : null,
      low_vision_aid_details: checkboxes.lowVisionAid
        ? details.low_vision_aid_details || null
        : null,
    };

    return {
      appointment: appointmentId,
      options,
      refractive_prescription,
      medications: meds,
      extra_details,
    };
  };

  // ---------------- SAVE / SUBMIT ----------------
  const saveManagement = async () => {
    const payload = buildPayload();
    showToast("Saving management plan...", "info");
    await createManagementPlan({ appointmentId, data: payload }).unwrap();
    showToast("Management saved.", "success");
  };

  const onSaveDraftAndNext = async () => {
    if (!validateBeforeConfirm()) return;
    await saveManagement();
    // next sensible tab based on role
    if (role === "student") setActiveTab("case_guide");
    else setActiveTab("logs");
  };

  const onSubmitForReview = async () => {
    if (!validateBeforeConfirm()) return;
    await saveManagement();
    showToast("Submitted for supervisor review.", "success");
    setActiveTab("logs");
  };

  const onComplete = async () => {
    // optional final save
    await saveManagement();
    // move main flow forward like Consultation does
    setFlowStep("payment");
  };

  // ---------------- TABS (role-based) ----------------
  const baseTabs = [
    { key: "management", label: "Management" },
    ...(role === "student"
      ? [{ key: "case_guide", label: "Case Management Guide" }]
      : []),
    { key: "logs", label: "Logs" },
    ...(role === "student" ? [{ key: "submit", label: "Submit" }] : []), // 👈 moved here
    ...(role !== "student" ? [{ key: "grading", label: "Grading" }] : []),
  ];

  const TABS = [...baseTabs, { key: "complete", label: "Complete" }]; // always last

  // ---------------- RENDER ----------------
  return (
    <div className="ml-72 py-8 px-8 w-fit flex flex-col gap-8">
      {/* Tabs header */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Tab
            key={t.key}
            active={activeTab === t.key}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </Tab>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "management" && (
        <form className="flex flex-col gap-5 w-fit">
          <main className="flex gap-40">
            <section className="flex flex-col gap-12 w-fit">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-base">
                  Treatment / Management Option(s)
                </label>
                <div className="grid grid-cols-2 gap-5">
                  {Object.keys(checkboxes).map((key) => (
                    <label
                      key={key}
                      className="flex items-center gap-1 capitalize"
                    >
                      <input
                        type="checkbox"
                        name={key}
                        checked={checkboxes[key]}
                        onChange={(e) =>
                          setCheckboxes((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.checked,
                          }))
                        }
                        className="h-5 w-5"
                      />
                      {key.replace(/([A-Z])/g, " $1")}
                    </label>
                  ))}
                </div>
              </div>

              {checkboxes.refractiveCorrection && (
                <RefractiveCorrectionSection
                  prescription={prescription}
                  handleInputChange={(e) =>
                    setPrescription((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
              )}

              {checkboxes.medications && (
                <MedicationForm
                  selectedMedications={selectedMedications}
                  setSelectedMedications={setSelectedMedications}
                  medications={medsList}
                  medicationTypes={medicationTypes}
                  selectedTypeId={selectedTypeId}
                  setSelectedTypeId={setSelectedTypeId}
                  isLoadingMeds={
                    isMedicationsLoading ||
                    isMedicationTypesLoading ||
                    isFilteringMedications
                  }
                />
              )}

              {[
                "surgery",
                "referral",
                "counselling",
                "therapy",
                "lowVisionAid",
              ].map((field) => {
                if (!checkboxes[field]) return null;
                const label = `${field.replace(
                  /([A-Z])/g,
                  " $1"
                )} Details`.replace(/^./, (s) => s.toUpperCase());
                const name = `${field}_details`;
                return (
                  <div key={field} className="flex flex-col gap-2">
                    <label className="font-medium">{label}</label>
                    <textarea
                      name={name}
                      value={details[name]}
                      onChange={(e) =>
                        setDetails((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-md"
                      placeholder={
                        field === "therapy"
                          ? "Type of therapy or exercises..."
                          : ""
                      }
                    />
                  </div>
                );
              })}
            </section>
          </main>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFlowStep("diagnosis")}
              className="text-[#2f3192] border border-[#2f3192] hover:bg-[#2f3192] hover:text-white px-4 py-2 rounded-md transition font-medium"
            >
              ← Back to Diagnosis
            </button>

            <button
              type="button"
              onClick={onSaveDraftAndNext}
              className="px-4 py-2 rounded-md bg-[#2f3192] text-white disabled:opacity-60"
              disabled={isCreatingManagementPlan || isManagementPlanLoading}
            >
              Save Draft & Continue
            </button>
          </div>
        </form>
      )}

      {activeTab === "case_guide" && role === "student" && (
        <CaseManagementGuide appointmentId={appointmentId} />
      )}

      {activeTab === "submit" && role === "student" && (
        <div className="rounded-md border bg-white p-6 w-full max-w-2xl">
          <h3 className="text-lg font-semibold mb-2">Submit for Review</h3>
          <p className="text-sm text-gray-600 mb-4">
            Submitting will notify your supervisor that the Management section
            is ready for review.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onSubmitForReview}
              className="px-4 py-2 rounded-md bg-[#2f3192] text-white disabled:opacity-60"
              disabled={isCreatingManagementPlan || isManagementPlanLoading}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("management")}
              className="px-4 py-2 rounded-md border"
            >
              Back to Management
            </button>
          </div>
        </div>
      )}

      {activeTab === "logs" && <LogsPanel appointmentId={appointmentId} />}

      {activeTab === "grading" && role !== "student" && (
        <div className="rounded-md border bg-white p-6 w-full max-w-2xl">
          <SupervisorGradingButton
            sectionLabel="Grading: Management"
            onSubmit={() => {
              showToast("Grading submitted.", "success");
              setActiveTab("complete");
            }}
          />
        </div>
      )}

      {activeTab === "complete" && (
        <div className="rounded-md border bg-white p-6 w-full max-w-xl">
          <h3 className="text-lg font-semibold mb-2">Complete</h3>
          <p className="text-sm text-gray-600 mb-4">
            Proceed to Payment to continue the main flow.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onComplete}
              className="px-4 py-2 rounded-md bg-[#0F973D] text-white"
            >
              Continue to Payment
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-md border"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Keep your old confirm modal if you still want it elsewhere */}
      {confirmSave && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmSave(false);
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
            <h2 className="text-lg font-bold mb-2">Confirm Save</h2>
            <p className="mb-4">
              Are you sure you want to save this treatment record? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmSave(false)}
                className="px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!validateBeforeConfirm()) return;
                  setConfirmSave(false);
                  await saveManagement();
                }}
                disabled={isCreatingManagementPlan}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
              >
                {isCreatingManagementPlan ? "Saving..." : "Yes, Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && <PatientModal setIsModalOpen={setIsModalOpen} />}
      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-15 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(false);
          }}
        >
          <div className="relative mt-20 bg-white p-6 rounded-lg border border-l-4 border-[#0F973D] w-fit">
            <button
              className="absolute top-4 right-3 text-xl font-semibold cursor-pointer"
              onClick={() => setModal(false)}
              aria-label="Close"
            >
              <IoClose size={20} />
            </button>
            <div className="flex items-start gap-6 pr-8">
              <span className="w-10 h-10 rounded-lg justify-center items-center p-1.5 bg-green-100">
                <IoIosCheckmarkCircle size={20} color="#0f973d" />
              </span>
              <div className="flex flex-col items-start gap-2 pr-6 border-l border-gray-300 pl-4">
                <h3 className="text-base font-bold">Success!</h3>
                <p className="text-base font-medium">
                  You have finished attending to your patient.
                </p>
                <div className="flex justify-between gap-4 mt-4">
                  <button
                    onClick={() => {
                      setModal(false);
                      navigate("/appointments");
                    }}
                    className="bg-[#0F973D] text-white px-4 py-2 rounded-lg"
                  >
                    Attend to next patient
                  </button>
                  <button
                    onClick={() => {
                      setModal(false);
                      navigate("/");
                    }}
                    className="border border-gray-600 px-4 py-2 rounded-lg"
                  >
                    Go to dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Management;
