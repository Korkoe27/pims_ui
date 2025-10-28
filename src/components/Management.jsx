import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";
import PatientModal from "./SelectClinicModal";
import { showToast } from "../components/ToasterHelper";
import useManagementData from "../hooks/useManagementData";
import useConsultationData from "../hooks/useConsultationData";
import {
  useGetCaseManagementGuideQuery,
  useUpdateCaseManagementGuideMutation,
} from "../redux/api/features/managementApi";
import { useSubmitAppointmentForReviewMutation } from "../redux/api/features/appointmentsApi";
import {
  ManagementForm,
  SubmitTab,
  GradingTab,
  CompleteTab,
  LogsTab,
} from "./Management/";

/* =========================================================================
   Case Management Guide
   ========================================================================= */
const CaseManagementGuide = ({ appointmentId, setActiveTab }) => {
  const [saving, setSaving] = useState(false);
  const [guideData, setGuideData] = useState({
    table_rows: [{ id: 1, diagnosis: "", management_plan: "", notes: "" }],
    completed: false,
  });
  const nextBtnRef = useRef(null);

  const { data: caseGuide, isLoading, error } =
    useGetCaseManagementGuideQuery(appointmentId);
  const [updateCaseGuide] = useUpdateCaseManagementGuideMutation();

  useEffect(() => {
    if (caseGuide) {
      const tableRows = caseGuide.table_rows
        ? caseGuide.table_rows.map((row) => ({
            id: row.id,
            diagnosis: row.diagnosis || "",
            management_plan: row.management_plan || "",
            notes: row.comments || "",
          }))
        : [
            {
              id: 1,
              diagnosis: caseGuide.diagnosis || "",
              management_plan: caseGuide.management_plan || "",
              notes: caseGuide.comments || "",
            },
          ];
      setGuideData({
        table_rows:
          tableRows.length > 0
            ? tableRows
            : [{ id: 1, diagnosis: "", management_plan: "", notes: "" }],
        completed: caseGuide.completed || false,
      });
    }
  }, [caseGuide]);

  const hasContent = guideData.table_rows.some(
    (row) => row.diagnosis || row.management_plan || row.notes
  );

  const handleNext = async () => {
    if (saving || !hasContent) return;
    setSaving(true);
    try {
      const payload = {
        table_rows: guideData.table_rows.map((row) => ({
          diagnosis: row.diagnosis,
          management_plan: row.management_plan,
          comments: row.notes,
        })),
        completed: true,
      };
      await updateCaseGuide({ appointmentId, payload }).unwrap();
      showToast("Case management guide saved successfully", "success");
      setActiveTab?.("logs");
    } catch {
      showToast("Failed to save case management guide", "error");
    } finally {
      setSaving(false);
    }
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
    const newId = Math.max(...guideData.table_rows.map((r) => r.id)) + 1;
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
        table_rows: prev.table_rows.filter((r) => r.id !== rowId),
      }));
    }
  };

  if (isLoading)
    return (
      <div className="p-6 text-center">Loading Case Management Guide...</div>
    );
  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load Case Management Guide.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow border">
      <h1 className="text-2xl font-bold mb-4 text-[#101928]">
        Case Management Guide
      </h1>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Entries</h2>
        <button
          onClick={addNewRow}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          + Add Row
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 px-3">Diagnosis</th>
              <th className="text-left py-2 px-3">Management Plan</th>
              <th className="text-left py-2 px-3">Notes</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {guideData.table_rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100">
                <td className="p-2">
                  <textarea
                    className="w-full border rounded p-2"
                    rows="2"
                    value={row.diagnosis}
                    onChange={(e) =>
                      handleRowChange(row.id, "diagnosis", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <textarea
                    className="w-full border rounded p-2"
                    rows="2"
                    value={row.management_plan}
                    onChange={(e) =>
                      handleRowChange(row.id, "management_plan", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <textarea
                    className="w-full border rounded p-2"
                    rows="2"
                    value={row.notes}
                    onChange={(e) =>
                      handleRowChange(row.id, "notes", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  {guideData.table_rows.length > 1 && (
                    <button
                      onClick={() => removeRow(row.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setActiveTab?.("management")}
          className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
        >
          ← Back to Management
        </button>
        <button
          onClick={handleNext}
          disabled={!hasContent || saving}
          className={`px-4 py-2 rounded text-white ${
            !hasContent || saving
              ? "bg-gray-400"
              : "bg-[#2f3192] hover:opacity-90"
          }`}
        >
          {saving ? "Saving..." : "Next → Logs"}
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   Management Component (no roles, no permissions)
   ========================================================================= */
const Management = ({ setFlowStep, appointmentId }) => {
  const navigate = useNavigate();
  const { appointmentId: paramId } = useParams();
  const apptId = appointmentId ?? paramId;

  const [activeTab, setActiveTab] = useState("management");

  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const {
    medications,
    medicationTypes,
    filteredMedications,
    managementPlan,
    isMedicationsLoading,
    isMedicationTypesLoading,
    isFilteringMedications,
    createManagementPlan,
    isCreatingManagementPlan,
  } = useManagementData(apptId, selectedTypeId);

  const [submitAppointmentForReview, { isLoading: isSubmittingForReview }] =
    useSubmitAppointmentForReviewMutation();

  const {
    completeConsultationFlow,
    isCompleting,
  } = useConsultationData(apptId);

  const [checkboxes, setCheckboxes] = useState({
    refractiveCorrection: false,
    medications: false,
    counselling: false,
    lowVisionAid: false,
    therapy: false,
    surgery: false,
    referral: false,
  });
  const [prescription, setPrescription] = useState({});
  const [details, setDetails] = useState({});
  const [selectedMedications, setSelectedMedications] = useState([]);

  const medsList = useMemo(
    () => (selectedTypeId ? filteredMedications : medications) ?? [],
    [selectedTypeId, filteredMedications, medications]
  );

  const TABS = [
    { key: "management", label: "Management" },
    { key: "case_guide", label: "Case Management Guide" },
    { key: "logs", label: "Logs" },
    { key: "submit", label: "Submit" },
    { key: "grading", label: "Grading" },
    { key: "complete", label: "Complete" },
  ];

  const onSaveDraftAndNext = async () => {
    try {
      await createManagementPlan({
        appointmentId: apptId,
        data: {
          appointment: apptId,
          options: checkboxes,
          refractive_prescription: prescription,
          medications: selectedMedications,
          extra_details: details,
        },
      }).unwrap();
      showToast("Saved successfully", "success");
      setActiveTab("case_guide");
    } catch {
      showToast("Save failed", "error");
    }
  };

  const onSubmitForReview = async () => {
    try {
      await onSaveDraftAndNext();
      await submitAppointmentForReview(apptId).unwrap();
      showToast("Submitted for review", "success");
      navigate("/");
    } catch {
      showToast("Submit failed", "error");
    }
  };

  const onComplete = async () => {
    try {
      await completeConsultationFlow(apptId);
      showToast("Consultation completed.", "success");
      navigate("/");
    } catch {
      showToast("Failed to complete consultation.", "error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start py-10 px-6 w-full">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-5 py-2 rounded-md text-sm font-medium border ${
              activeTab === t.key
                ? "bg-[#2f3192] text-white border-[#2f3192]"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="w-full max-w-5xl flex justify-center">
        {activeTab === "management" && (
          <ManagementForm
            checkboxes={checkboxes}
            setCheckboxes={setCheckboxes}
            prescription={prescription}
            setPrescription={setPrescription}
            details={details}
            setDetails={setDetails}
            selectedMedications={selectedMedications}
            setSelectedMedications={setSelectedMedications}
            medsList={medsList}
            medicationTypes={medicationTypes}
            selectedTypeId={selectedTypeId}
            setSelectedTypeId={setSelectedTypeId}
            isLoadingMeds={
              isMedicationsLoading ||
              isMedicationTypesLoading ||
              isFilteringMedications
            }
            isCreatingManagementPlan={isCreatingManagementPlan}
            onSaveDraftAndNext={onSaveDraftAndNext}
            setFlowStep={setFlowStep}
          />
        )}

        {activeTab === "case_guide" && (
          <CaseManagementGuide
            appointmentId={apptId}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "logs" && (
          <LogsTab appointmentId={apptId} setActiveTab={setActiveTab} />
        )}

        {activeTab === "submit" && (
          <SubmitTab
            onSubmitForReview={onSubmitForReview}
            isCreatingManagementPlan={isCreatingManagementPlan}
            isSubmittingForReview={isSubmittingForReview}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "grading" && (
          <GradingTab appointmentId={apptId} setActiveTab={setActiveTab} />
        )}

        {activeTab === "complete" && (
          <CompleteTab onComplete={onComplete} isCompleting={isCompleting} />
        )}
      </div>
    </div>
  );
};

export default Management;
