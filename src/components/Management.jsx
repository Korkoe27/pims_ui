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
import useManagementData from "../hooks/useManagementData";
import {
  useGetCaseManagementGuideQuery,
  useUpdateCaseManagementGuideMutation,
} from "../redux/api/features/managementApi";

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
  const [guideData, setGuideData] = useState({
    table_rows: [{ id: 1, diagnosis: "", management_plan: "", notes: "" }],
    completed: false,
  });
  const nextBtnRef = useRef(null);

  // API hooks
  const {
    data: caseGuide,
    isLoading: isLoadingGuide,
    error: guideError,
  } = useGetCaseManagementGuideQuery(appointmentId);

  const [updateCaseGuide] = useUpdateCaseManagementGuideMutation();

  // Initialize data when API response is received
  useEffect(() => {
    if (caseGuide) {
      setGuideData({
        table_rows: caseGuide.table_rows || [
          { id: 1, diagnosis: "", management_plan: "", notes: "" },
        ],
        completed: caseGuide.completed || false,
      });
      setReviewed(caseGuide.completed || false);
    }
  }, [caseGuide]);

  // Auto-save functionality with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        appointmentId &&
        guideData.table_rows.some(
          (row) => row.diagnosis || row.management_plan || row.notes
        )
      ) {
        handleAutoSave();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [guideData, appointmentId]);

  const handleAutoSave = async () => {
    try {
      await updateCaseGuide({
        appointmentId,
        payload: {
          ...guideData,
          completed: reviewed,
        },
      }).unwrap();
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  };

  const handleReviewedChange = async (checked) => {
    setReviewed(checked);
    setGuideData((prev) => ({ ...prev, completed: checked }));

    if (checked) {
      setTabCompletionStatus?.("case_guide", true);
    }

    // Save immediately when review status changes
    try {
      await updateCaseGuide({
        appointmentId,
        payload: {
          ...guideData,
          completed: checked,
        },
      }).unwrap();
    } catch (error) {
      showToast("Failed to save review status", "error");
    }
  };

  const handleNext = async () => {
    if (!reviewed || saving) return;
    setSaving(true);
    try {
      // Final save before proceeding
      await updateCaseGuide({
        appointmentId,
        payload: {
          ...guideData,
          completed: true,
        },
      }).unwrap();

      showToast("Case management guide completed successfully", "success");
      setActiveTab?.("logs");
    } catch (error) {
      showToast("Failed to save case management guide", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleNotesChange = (value) => {
    setGuideData((prev) => ({ ...prev, notes: value }));
  };

  const handleRowChange = (rowId, field, value) => {
    setGuideData((prev) => ({
      ...prev,
      table_rows: prev.table_rows.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row
      ),
    }));
  };

  const addNewRow = () => {
    const newId = Math.max(...guideData.table_rows.map((row) => row.id)) + 1;
    setGuideData((prev) => ({
      ...prev,
      table_rows: [
        ...prev.table_rows,
        { id: newId, diagnosis: "", management_plan: "", notes: "" },
      ],
    }));
  };

  const removeRow = (rowId) => {
    if (guideData.table_rows.length > 1) {
      setGuideData((prev) => ({
        ...prev,
        table_rows: prev.table_rows.filter((row) => row.id !== rowId),
      }));
    }
  };

  const hasContent = guideData.table_rows.some(
    (row) => row.diagnosis || row.management_plan || row.notes
  );

  if (isLoadingGuide) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow border">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (guideError) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow border">
        <div className="text-center text-red-600">
          <p>Failed to load case management guide</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow border">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#101928]">
          Case Management Guide
        </h1>
        <p className="text-gray-600 mt-1">
          Appointment: <span className="font-mono">{appointmentId}</span>
        </p>
      </header>

      <section className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          Document diagnosis and corresponding management plans for this case.
        </p>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Management Guide</h2>
            <button
              onClick={addNewRow}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              + Add Row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700 w-1/3">
                    Diagnosis
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700 w-1/3">
                    Management Plan
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700 w-1/3">
                    Notes
                  </th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {guideData.table_rows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100">
                    <td className="py-2 px-3">
                      <textarea
                        value={row.diagnosis}
                        onChange={(e) =>
                          handleRowChange(row.id, "diagnosis", e.target.value)
                        }
                        placeholder="Enter diagnosis..."
                        className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <textarea
                        value={row.management_plan}
                        onChange={(e) =>
                          handleRowChange(
                            row.id,
                            "management_plan",
                            e.target.value
                          )
                        }
                        placeholder="Enter management plan..."
                        className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <textarea
                        value={row.notes}
                        onChange={(e) =>
                          handleRowChange(row.id, "notes", e.target.value)
                        }
                        placeholder="Enter notes..."
                        className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                      />
                    </td>
                    <td className="py-2 px-3">
                      {guideData.table_rows.length > 1 && (
                        <button
                          onClick={() => removeRow(row.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remove row"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Data is automatically saved as you type
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              id="cmg-reviewed"
              type="checkbox"
              className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={reviewed}
              onChange={(e) => handleReviewedChange(e.target.checked)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && reviewed) nextBtnRef.current?.click();
              }}
              aria-describedby="cmg-reviewed-help"
            />
            <div>
              <span
                className="text-sm font-medium text-gray-800"
                id="cmg-reviewed-help"
              >
                I have completed the Case Management Guide
              </span>
              {!hasContent && (
                <p className="text-xs text-amber-600 mt-1">
                  ⚠ Please add at least one diagnosis with management plan
                  before marking as reviewed
                </p>
              )}
            </div>
          </label>
        </div>
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
          disabled={!reviewed || saving || !hasContent}
          className={[
            "px-4 py-2 rounded-md text-white flex items-center gap-2",
            reviewed && !saving && hasContent
              ? "bg-[#2f3192] hover:opacity-90"
              : "bg-[#2f3192]/60 cursor-not-allowed",
          ].join(" ")}
          aria-disabled={!reviewed || saving || !hasContent}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              Next: Logs →
              {!hasContent && (
                <span className="text-xs bg-white/20 px-1 rounded">
                  Add content
                </span>
              )}
            </>
          )}
        </button>
      </footer>
    </div>
  );
};

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
  if (typeof raw === "object") return Object.values(raw);
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
  const apptId = appointmentId ?? appointmentIdParam;

  // ✅ Get role from Redux (student | lecturer | admin)
  const { user } = useSelector((s) => s.auth || {});
  const role = (user?.role || "student").toLowerCase();

  // ---- localStorage key for this appointment ----
  const LOCAL_TAB_KEY = `management-${apptId}-activeTab`;

  const [activeTab, _setActiveTab] = useState(() => {
    try {
      const stored = apptId ? localStorage.getItem(LOCAL_TAB_KEY) : null;
      return stored || "management";
    } catch {
      return "management";
    }
  });
  const setActiveTab = (tab) => {
    try {
      if (apptId) localStorage.setItem(LOCAL_TAB_KEY, tab);
    } catch {}
    _setActiveTab(tab);
  };

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

  // ---------------- PREFILL FROM BACKEND ----------------
  useEffect(() => {
    if (!managementPlan) return;

    const optsRaw = managementPlan.options;
    const rx = managementPlan.refractive_prescription;
    const medsRaw = managementPlan.medications;
    const extra = managementPlan.extra_details || {};

    if (optsRaw && typeof optsRaw === "object") {
      setCheckboxes((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.keys(prev).map((k) => [k, Boolean(optsRaw[k])])
        ),
      }));
    }

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

    setDetails({
      surgery_details: extra.surgery_details ?? "",
      referral_details: extra.referral_details ?? "",
      counselling_details: extra.counselling_details ?? "",
      low_vision_aid_details: extra.low_vision_aid_details ?? "",
      therapy_details: extra.therapy_details ?? "",
    });

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
      await createManagementPlan({
        appointmentId: apptId,
        data: payload,
      }).unwrap();
      showToast("Management saved.", "success");
    } catch (err) {
      console.error("Save failed:", err);
      const msg =
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Failed to save management plan.";
      showToast(msg, "error");
      throw err;
    }
  };

  const onSaveDraftAndNext = async () => {
    if (!validateBeforeConfirm()) return;
    try {
      await saveManagement();
      if (role === "student") {
        setActiveTab("case_guide");
      } else {
        setActiveTab("logs");
      }
    } catch {}
  };

  const onSubmitForReview = async () => {
    if (!validateBeforeConfirm()) return;
    try {
      await saveManagement();
      showToast("Submitted for supervisor review.", "success");
      setActiveTab("logs");
    } catch {}
  };

  const onComplete = async () => {
    try {
      await saveManagement(); // optional final save
      setFlowStep?.("payment");
    } catch {}
  };

  // ---------------- TABS (role-based) ----------------
  const baseTabs = [
    { key: "management", label: "Management" },
    ...(role === "student"
      ? [{ key: "case_guide", label: "Case Management Guide" }]
      : []),
    { key: "logs", label: "Logs" },
    ...(role === "student" ? [{ key: "submit", label: "Submit" }] : []),
    ...(role !== "student" ? [{ key: "grading", label: "Grading" }] : []),
  ];
  const TABS = [...baseTabs, { key: "complete", label: "Complete" }];

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
              onClick={() => setFlowStep?.("diagnosis")}
              className="text-[#2f3192] border border-[#2f3192] hover:bg-[#2f3192] hover:text-white px-4 py-2 rounded-md transition font-medium"
            >
              ← Back to Diagnosis
            </button>

            <button
              type="button"
              onClick={onSaveDraftAndNext}
              className="px-4 py-2 rounded-md bg-[#2f3192] text-white disabled:opacity-60"
              disabled={isCreatingManagementPlan}
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
            Submitting will notify your supervisor that the Management section
            is ready for review.
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
            appointmentId={apptId}
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
              Are you sure you want to save this treatment record?
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
                  } catch {}
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
