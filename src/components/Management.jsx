import React, { useEffect, useMemo, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";
import PatientModal from "./SelectClinicModal";
import { showToast } from "../components/ToasterHelper";
import RefractiveCorrectionSection from "./RefractiveCorrectionSection";
import MedicationForm from "./MedicationForm";
import SupervisorGradingButton from "./SupervisorGradingButton";

// RTK Query
import useManagementData from "../hooks/useManagementData";

/* =========================================================================
   Inline Case Management Guide (kept inside this file; no router navigation)
   ========================================================================= */
const storageKeyFor = (id) => `cmg-reviewed-${id}`;

const CaseManagementGuide = ({
  appointmentId,
  setActiveTab,
  setTabCompletionStatus,
  role = "student",
}) => {
  const [reviewed, setReviewed] = useState(false);
  const [saving, setSaving] = useState(false);
  const nextBtnRef = useRef(null);

  const KEY = useMemo(() => storageKeyFor(appointmentId), [appointmentId]);

  // Load saved state for this appointment
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = window.localStorage.getItem(KEY);
        setReviewed(saved === "1");
      }
    } catch {/* noop */}
  }, [KEY]);

  // Persist + notify parent (mark tab complete)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(KEY, reviewed ? "1" : "0");
      }
    } catch {/* noop */}
    if (reviewed) setTabCompletionStatus?.("case_guide", true);
  }, [KEY, reviewed, setTabCompletionStatus]);

  const handleToggle = (e) => setReviewed(e.target.checked);

  const handleNext = async () => {
    if (!reviewed || saving) return;
    setSaving(true);
    try {
      // Mark complete was already handled in the effect above
      setActiveTab?.("logs");
    } finally {
      setSaving(false);
    }
  };

  // Keyboard: Enter advances when checkbox focused & checked
  const onKeyDown = (e) => {
    if (e.key === "Enter" && reviewed) {
      e.preventDefault();
      nextBtnRef.current?.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow border">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#101928]">Case Management Guide</h1>
        <p className="text-gray-600 mt-1">
          Appointment: <span className="font-mono">{appointmentId}</span>
        </p>
      </header>

      <section className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          Use this guide to review protocols and decision points before finalizing your Management plan.
        </p>

        <div className="rounded-lg border bg-gray-50 p-4">
          <h2 className="font-semibold mb-2">Quick checklist</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-800">
            <li>Confirm selected management options are clinically justified.</li>
            <li>Verify refractive prescription values (SPH/CYL/AXIS/ADD) and lens details.</li>
            <li>Ensure medication dosage/frequency/duration are complete.</li>
            <li>Add necessary counselling/referral/surgery/therapy notes.</li>
            <li>Cross-check documentation for accuracy and completeness.</li>
          </ul>
        </div>

        <label className="flex items-start gap-3 mt-4 cursor-pointer">
          <input
            id="cmg-reviewed"
            type="checkbox"
            className="mt-1 h-5 w-5"
            checked={reviewed}
            onChange={handleToggle}
            onKeyDown={onKeyDown}
            aria-describedby="cmg-reviewed-help"
          />
          <span className="text-sm text-gray-800" id="cmg-reviewed-help">
            I have reviewed the Case Management Guide and completed the checklist above.
          </span>
        </label>
      </section>

      <footer className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab?.("management")}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          ← Back to Management
        </button>

        <button
          type="button"
          ref={nextBtnRef}
          onClick={handleNext}
          disabled={!reviewed || saving}
          className={[
            "px-4 py-2 rounded-md text-white",
            reviewed && !saving ? "bg-[#2f3192] hover:opacity-90" : "bg-[#2f3192]/60 cursor-not-allowed",
          ].join(" ")}
          aria-disabled={!reviewed || saving}
        >
          Next: Logs →
        </button>
      </footer>
    </div>
  );
};

/* ===============================
   Small Logs panel (inline)
   =============================== */
const LogsPanel = ({ appointmentId }) => (
  <div className="rounded-md border bg-white p-4">
    <h3 className="text-lg font-semibold mb-2">Logs</h3>
    <p className="text-sm text-gray-600">
      Audit trail & activity for this management plan (appointment: {appointmentId})
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
  const { appointmentId: appointmentIdParam } = useParams();
  const apptId = appointmentId ?? appointmentIdParam; // robust fallback

  // ---- role (swap with your real auth state) ----
  // expected: "student" | "lecturer" | "admin"
  const role = window?.__APP_ROLE__ || "student";

  // ---- localStorage key for this appointment ----
  const LOCAL_TAB_KEY = `management-${apptId}-activeTab`;

  const [activeTab, _setActiveTab] = useState(() => {
    const stored = apptId ? localStorage.getItem(LOCAL_TAB_KEY) : null;
    return stored || "management";
  });
  const setActiveTab = (tab) => {
    if (apptId) localStorage.setItem(LOCAL_TAB_KEY, tab);
    _setActiveTab(tab);
  };

  // Optionally record completion of sub-tabs (kept simple via localStorage)
  const setTabCompletionStatus = (key, value) => {
    try {
      localStorage.setItem(`cmg-${apptId}-${key}`, value ? "1" : "0");
    } catch {}
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
  } = useManagementData(apptId, selectedTypeId);

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
      if (!isValidSPH(prescription.od_sph) || !isValidSPH(prescription.os_sph)) {
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
        showToast("AXIS is required and must be 0–180 if CYL is provided.", "error");
        return false;
      }
      if (
        (prescription.od_add && !isValidADD(prescription.od_add)) ||
        (prescription.os_add && !isValidADD(prescription.os_add))
      ) {
        showToast("ADD must start with '+' and be valid (e.g., +1.00).", "error");
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
      surgery_details: checkboxes.surgery ? details.surgery_details || null : null,
      referral_details: checkboxes.referral ? details.referral_details || null : null,
      counselling_details: checkboxes.counselling ? details.counselling_details || null : null,
      therapy_details: checkboxes.therapy ? details.therapy_details || null : null,
      low_vision_aid_details: checkboxes.lowVisionAid ? details.low_vision_aid_details || null : null,
    };

    return {
      appointment: apptId,
      options,
      refractive_prescription,
      medications: meds,
      extra_details,
    };
  };

  // ---------------- SAVE / SUBMIT ----------------
  const saveManagement = async () => {
    if (!apptId) {
      showToast("Missing appointment ID for this management session.", "error");
      throw new Error("Missing appointment ID");
    }
    const payload = buildPayload();
    showToast("Saving management plan...", "info");
    try {
      await createManagementPlan({ appointmentId: apptId, data: payload }).unwrap();
      showToast("Management saved.", "success");
    } catch (err) {
      console.error("Save failed:", err);
      const msg =
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Failed to save management plan.";
      showToast(msg, "error");
      throw err; // prevent tab change on failure
    }
  };

  const onSaveDraftAndNext = async () => {
    if (!validateBeforeConfirm()) return;
    try {
      await saveManagement();
      if (role === "student") {
        setActiveTab("case_guide"); // ✅ switch inline, no navigation
      } else {
        setActiveTab("logs");
      }
    } catch {
      // error toast already shown
    }
  };

  const onSubmitForReview = async () => {
    if (!validateBeforeConfirm()) return;
    try {
      await saveManagement();
      showToast("Submitted for supervisor review.", "success");
      setActiveTab("logs");
    } catch {
      // error toast already shown
    }
  };

  const onComplete = async () => {
    try {
      await saveManagement(); // optional final save
      setFlowStep("payment");
    } catch {
      // error toast already shown
    }
  };

  // ---------------- TABS (role-based) ----------------
  const baseTabs = [
    { key: "management", label: "Management" },
    ...(role === "student" ? [{ key: "case_guide", label: "Case Management Guide" }] : []),
    { key: "logs", label: "Logs" },
    ...(role === "student" ? [{ key: "submit", label: "Submit" }] : []),
    ...(role !== "student" ? [{ key: "grading", label: "Grading" }] : []),
  ];
  const TABS = [...baseTabs, { key: "complete", label: "Complete" }];

  // ---------------- RENDER ----------------
  return (
    <div className="ml-72 py-8 px-8 w-fit flex flex-col gap-8">
      {/* Tabs header */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Tab
            key={t.key}
            active={activeTab === t.key}
            onClick={() => setActiveTab(t.key)} // 👈 keep everything inline
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
                    <label key={key} className="flex items-center gap-1 capitalize">
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

              {["surgery", "referral", "counselling", "therapy", "lowVisionAid"].map((field) => {
                if (!checkboxes[field]) return null;
                const label = `${field.replace(/([A-Z])/g, " $1")} Details`.replace(
                  /^./,
                  (s) => s.toUpperCase()
                );
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
                      placeholder={field === "therapy" ? "Type of therapy or exercises..." : ""}
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
              disabled={isCreatingManagementPlan} // only block during mutation
            >
              Save Draft & Continue
            </button>
          </div>
        </form>
      )}

      {activeTab === "case_guide" && role === "student" && (
        <CaseManagementGuide
          appointmentId={apptId}
          setActiveTab={setActiveTab}
          setTabCompletionStatus={setTabCompletionStatus}
          role={role}
        />
      )}

      {activeTab === "submit" && role === "student" && (
        <div className="rounded-md border bg-white p-6 w-full max-w-2xl">
          <h3 className="text-lg font-semibold mb-2">Submit for Review</h3>
          <p className="text-sm text-gray-600 mb-4">
            Submitting will notify your supervisor that the Management section is ready for review.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onSubmitForReview}
              className="px-4 py-2 rounded-md bg-[#2f3192] text-white disabled:opacity-60"
              disabled={isCreatingManagementPlan}
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

      {activeTab === "logs" && <LogsPanel appointmentId={apptId} />}

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
            <button onClick={onComplete} className="px-4 py-2 rounded-md bg-[#0F973D] text-white">
              Continue to Payment
            </button>
            <button onClick={() => navigate("/")} className="px-4 py-2 rounded-md border">
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Confirm modal (optional) */}
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
              Are you sure you want to save this treatment record? This action cannot be undone.
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
                  try {
                    setConfirmSave(false);
                    await saveManagement();
                  } catch {
                    /* error toast already shown */
                  }
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
