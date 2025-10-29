import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../components/ToasterHelper";
import useManagementData from "../hooks/useManagementData";
import useConsultationData from "../hooks/useConsultationData";
import { useSubmitAppointmentForReviewMutation } from "../redux/api/features/appointmentsApi";
import {
  ManagementForm,
  SubmitTab,
  CompleteTab,
  LogsTab,
} from "./Management/";
import CaseManagementGuide from "./CaseManagementGuide";

/* =========================================================================
   Management Component (Permission-based tab visibility)
   ========================================================================= */
const Management = ({ setFlowStep, appointmentId }) => {
  const navigate = useNavigate();
  const { appointmentId: paramId } = useParams();
  const apptId = appointmentId ?? paramId;

  const [activeTab, setActiveTab] = useState("management");

  // ✅ Get permissions from authenticated user state
  const user = useSelector((state) => state.auth?.user);
  const permissions = user?.access || {};

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

  const { completeConsultationFlow, isCompleting } = useConsultationData(apptId);

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

  // ✅ Define all possible tabs
  const ALL_TABS = [
    { key: "management", label: "Management" },
    { key: "case_guide", label: "Case Management Guide" },
    { key: "logs", label: "Logs" },
    { key: "submit", label: "Submit" },
    { key: "complete", label: "Complete" },
  ];

  // ✅ Compute visible tabs based on permissions
  let visibleTabs = [];
  if (permissions.canSubmitConsultations) {
    visibleTabs = ALL_TABS.filter((tab) => tab.key !== "complete");
  } else if (permissions.canCompleteConsultations) {
    visibleTabs = ALL_TABS.filter(
      (tab) => tab.key === "management" || tab.key === "complete"
    );
  } else {
    visibleTabs = [];
  }

  /* ---------------------------------------------------------------------
     Actions
  --------------------------------------------------------------------- */
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

      // 👇 Decide next tab based on permissions
      if (permissions.canCompleteConsultations) {
        setActiveTab("complete"); // Lecturer
      } else if (permissions.canSubmitConsultations) {
        setActiveTab("case_guide"); // Student
      } else {
        setActiveTab("logs"); // Fallback
      }
    } catch {
      showToast("Save failed", "error");
    }
  };

  const onSubmitForReview = async () => {
    try {
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

  /* ---------------------------------------------------------------------
     Render
  --------------------------------------------------------------------- */
  return (
    <div className="flex flex-col items-center justify-start py-10 px-6 w-full">
      {/* Tabs */}
      {visibleTabs.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {visibleTabs.map((t) => (
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
      ) : (
        <div className="text-gray-500 italic mb-8">
          You do not have access to view this section.
        </div>
      )}

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
            onComplete={() => {
              // ✅ Move to Logs when Case Guide is marked complete
              setActiveTab("logs");
              showToast(
                "Case Management Guide reviewed. Proceeding to Logs.",
                "success"
              );
            }}
          />
        )}

        {activeTab === "logs" && (
          <LogsTab
            appointmentId={apptId}
            setActiveTab={setActiveTab}
            onComplete={() => {
              // ✅ Automatically advance to Submit after logs
              setActiveTab("submit");
              showToast("Logs recorded. Proceeding to Submit.", "success");
            }}
          />
        )}

        {activeTab === "submit" && (
          <SubmitTab
            onSubmitForReview={onSubmitForReview}
            isCreatingManagementPlan={isCreatingManagementPlan}
            isSubmittingForReview={isSubmittingForReview}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "complete" && (
          <CompleteTab onComplete={onComplete} isCompleting={isCompleting} />
        )}
      </div>
    </div>
  );
};

export default Management;
