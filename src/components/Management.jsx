import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../components/ToasterHelper";
import useManagementData from "../hooks/useManagementData";
import {
  useSubmitAppointmentForReviewMutation,
  useMarkAppointmentCompletedMutation,
} from "../redux/api/features/appointmentsApi";
import { ManagementForm, SubmitTab, CompleteTab, LogsTab } from "./Management/";
import CaseManagementGuide from "./CaseManagementGuide";

const Management = ({ setFlowStep, appointmentId }) => {
  const navigate = useNavigate();
  const { appointmentId: paramId } = useParams();
  const apptId = appointmentId ?? paramId;

  const [activeTab, setActiveTab] = useState("management");
  const user = useSelector((state) => state.auth?.user);
  const permissions = user?.access || {};

  // ✅ Management Data
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

  // ✅ Mutations
  const [submitAppointmentForReview, { isLoading: isSubmittingForReview }] =
    useSubmitAppointmentForReviewMutation();
  const [markAppointmentCompleted, { isLoading: isCompleting }] =
    useMarkAppointmentCompletedMutation();

  // ✅ Form state
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

  // ✅ Hydrate data for editing existing Management Plan
  useEffect(() => {
    if (managementPlan) {
      setCheckboxes({
        refractiveCorrection: managementPlan.refractive_correction || false,
        medications: managementPlan.medications || false,
        counselling: managementPlan.counselling || false,
        lowVisionAid: managementPlan.low_vision_aid || false,
        therapy: managementPlan.therapy || false,
        surgery: managementPlan.surgery || false,
        referral: managementPlan.referral || false,
      });

      setPrescription({
        od_sph: managementPlan.od_sph || "",
        od_cyl: managementPlan.od_cyl || "",
        od_axis: managementPlan.od_axis || "",
        od_add: managementPlan.od_add || "",
        os_sph: managementPlan.os_sph || "",
        os_cyl: managementPlan.os_cyl || "",
        os_axis: managementPlan.os_axis || "",
        os_add: managementPlan.os_add || "",
        type_of_lens: managementPlan.type_of_lens || "",
        type_of_refractive_correction:
          managementPlan.type_of_refractive_correction || "",
        pd: managementPlan.pd || "",
        segment_height: managementPlan.segment_height || "",
        fitting_cross_height: managementPlan.fitting_cross_height || "",
      });

      setDetails({
        counselling_details: managementPlan.counselling_details || "",
        low_vision_aid_details: managementPlan.low_vision_aid_details || "",
        therapy_details: managementPlan.therapy_details || "",
        surgery_details: managementPlan.surgery_details || "",
        referral_details: managementPlan.referral_details || "",
      });
    }
  }, [managementPlan]);

  // ✅ Tabs visibility
  const ALL_TABS = [
    { key: "management", label: "Management" },
    { key: "case_guide", label: "Case Management Guide" },
    { key: "logs", label: "Logs" },
    { key: "submit", label: "Submit" },
    { key: "complete", label: "Complete" },
  ];

  let visibleTabs = [];
  if (permissions.canSubmitConsultations) {
    visibleTabs = ALL_TABS.filter((tab) => tab.key !== "complete");
  } else if (permissions.canCompleteConsultations) {
    visibleTabs = ALL_TABS.filter(
      (tab) => tab.key === "management" || tab.key === "complete"
    );
  }

  /* ------------------------------------------------------------------
     ✅ SAVE HANDLER
  ------------------------------------------------------------------ */
  const onSaveAndNext = async () => {
    try {
      const anySelected =
        checkboxes.refractiveCorrection ||
        checkboxes.medications ||
        checkboxes.counselling ||
        checkboxes.lowVisionAid ||
        checkboxes.therapy ||
        checkboxes.surgery ||
        checkboxes.referral;

      if (!anySelected) {
        showToast("Select at least one management option.", "warning");
        return;
      }

      const payload = {
        appointment: apptId,
        refractive_correction: !!checkboxes.refractiveCorrection,
        medications: !!checkboxes.medications,
        counselling: !!checkboxes.counselling,
        low_vision_aid: !!checkboxes.lowVisionAid,
        therapy: !!checkboxes.therapy,
        surgery: !!checkboxes.surgery,
        referral: !!checkboxes.referral,
        ...prescription,
        counselling_details: details.counselling_details || null,
        low_vision_aid_details: details.low_vision_aid_details || null,
        therapy_details: details.therapy_details || null,
        surgery_details: details.surgery_details || null,
        referral_details: details.referral_details || null,
        medication_instructions: checkboxes.medications
          ? selectedMedications
          : [],
      };

      console.log("📦 Payload being sent:", payload);

      await createManagementPlan({ appointmentId: apptId, data: payload }).unwrap();
      showToast("Saved successfully ✅", "success");

      if (permissions.canCompleteConsultations) setActiveTab("complete");
      else if (permissions.canSubmitConsultations) setActiveTab("case_guide");
      else setActiveTab("logs");
    } catch (error) {
      console.error("❌ Save failed:", error);
      showToast("Save failed ❌", "error");
    }
  };

  /* ------------------------------------------------------------------
     ✅ SUBMIT & COMPLETE HANDLERS
  ------------------------------------------------------------------ */
  const onSubmitForReview = async () => {
    try {
      await submitAppointmentForReview(apptId).unwrap();
      showToast("Submitted for review ✅", "success");
      navigate("/");
    } catch {
      showToast("Submit failed ❌", "error");
    }
  };

  const onComplete = async () => {
    try {
      await markAppointmentCompleted(apptId).unwrap();
      showToast("Consultation marked as completed ✅", "success");
      navigate("/consultations/completed");
    } catch (error) {
      console.error("❌ Completion failed:", error);
      showToast("Failed to complete consultation ❌", "error");
    }
  };

  /* ------------------------------------------------------------------
     ✅ RENDER
  ------------------------------------------------------------------ */
  return (
    <div className="flex flex-col items-center justify-start py-10 px-6 w-full">
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
            onSaveDraftAndNext={onSaveAndNext}
            saveButtonLabel="Save & Next"
            setFlowStep={setFlowStep}
            managementPlan={managementPlan}
          />
        )}

        {activeTab === "case_guide" && (
          <CaseManagementGuide
            appointmentId={apptId}
            setActiveTab={setActiveTab}
            onComplete={() => {
              setActiveTab("logs");
              showToast("Case Management Guide reviewed.", "success");
            }}
          />
        )}

        {activeTab === "logs" && (
          <LogsTab
            appointmentId={apptId}
            setActiveTab={setActiveTab}
            onComplete={() => {
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
          <CompleteTab
            onComplete={onComplete}
            isCompleting={isCompleting}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );
};

export default Management;
