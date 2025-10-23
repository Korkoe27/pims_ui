import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAppointmentDetailsQuery } from "../redux/api/features/appointmentsApi";
import useConsultationData from "../hooks/useConsultationData";

import Header from "../components/Header";
import ProgressBar from "../components/ProgressBar";
import NavMenu from "../components/NavMenu";
import CaseHistory from "../components/CaseHistory";
import PersonalHistory from "../components/PersonalHistory";
import VisualAcuity from "../components/VisualAcuity";
import Externals from "../components/Externals";
import Internals from "../components/Internals";
import Refraction from "../components/Refraction";
import ExtraTests from "../components/ExtraTests";
import Diagnosis from "../components/Diagnosis";
import Management from "../components/Management";
import CaseManagementGuide from "../components/CaseManagementGuide";
import MedicationDispensing from "../components/MedicationDispensing";
import BouncingBallsLoader from "../components/BouncingBallsLoader";

// ------------------------------------------------------------
// 🔹 Determine consultation type dynamically (no roles used)
// ------------------------------------------------------------
const determineConsultationType = (access = {}, appointment = {}) => {
  const canComplete = access.canCompleteConsultations;
  const canSubmit = access.canSubmitConsultations;
  const isSubmittedForReview = !!appointment.is_submitted_for_review;

  if (canComplete && !isSubmittedForReview) return "expert_consultation";
  if (canSubmit && !isSubmittedForReview) return "student_consultation";
  if (canComplete && isSubmittedForReview) return "consultation_review";
  return null;
};

// ------------------------------------------------------------
// 🔹 Main Consultation Component
// ------------------------------------------------------------
const Consultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const LOCAL_TAB_KEY = `consultation-${appointmentId}-activeTab`;
  const LOCAL_FLOW_KEY = `consultation-${appointmentId}-flowStep`;
  const LOCAL_STATUS_KEY = `consultation-${appointmentId}-tabCompletionStatus`;

  const [activeTab, _setActiveTab] = useState(
    localStorage.getItem(LOCAL_TAB_KEY) || "case history"
  );
  const [flowStep, _setFlowStep] = useState(
    localStorage.getItem(LOCAL_FLOW_KEY) || "consultation"
  );
  const [tabCompletionStatus, _setTabCompletionStatus] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STATUS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const setActiveTab = (tab) => {
    localStorage.setItem(LOCAL_TAB_KEY, tab);
    _setActiveTab(tab);
  };
  const setFlowStep = useCallback(
    (step) => {
      localStorage.setItem(LOCAL_FLOW_KEY, step);
      _setFlowStep(step);
    },
    [LOCAL_FLOW_KEY]
  );
  const setTabCompletionStatus = (updateFnOrObject) => {
    _setTabCompletionStatus((prev) => {
      const update =
        typeof updateFnOrObject === "function"
          ? updateFnOrObject(prev)
          : { ...prev, ...updateFnOrObject };
      localStorage.setItem(LOCAL_STATUS_KEY, JSON.stringify(update));
      return update;
    });
  };

  // --- Data and Consultation Type ---------------------------------
  const userAccess = useSelector((state) => state.auth.user?.access);
  const {
    data: selectedAppointment,
    error,
    isLoading,
  } = useGetAppointmentDetailsQuery(appointmentId);

  const consultationType = determineConsultationType(
    userAccess,
    selectedAppointment
  );

  const {
    consultationState,
  } = useConsultationData(appointmentId, selectedAppointment, consultationType);

  const stepMap = {
    consultation: 1,
    diagnosis: 2,
    management: 3,
    dispensing: 5,
  };

  useEffect(() => {
    if (!consultationState?.flowState) return;
    const stateToFlowStep = {
      "Consultation In Progress": "consultation",
      "Exams Recorded": "consultation",
      "Diagnosis Added": "diagnosis",
      "Management Created": "consultation",
      "Case Management Guide Created": "management",
      "Submitted For Review": "diagnosis",
      "Under Review": "diagnosis",
      Graded: "management",
      "Consultation Completed": "dispensing",
    };
    setFlowStep(stateToFlowStep[consultationState.flowState] || "consultation");
  }, [consultationState?.flowState, setFlowStep]);

  if (isLoading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <BouncingBallsLoader />
      </div>
    );

  if (error || !selectedAppointment) {
    setTimeout(() => navigate("/"), 0);
    return <p>Redirecting to Dashboard...</p>;
  }

  // -------------------------
  // Tab Content Renderer
  // -------------------------
  const renderTabContent = () => {
    const tab = (activeTab || "").toLowerCase();
    const idStr = String(appointmentId);
    const canEdit =
      consultationState?.flowType === "lecturer_consulting" ||
      (consultationState?.flowType === "student_consulting" &&
        consultationState?.permissions?.can_edit_exams) ||
      (consultationState?.flowType === "lecturer_reviewing" &&
        consultationState?.permissions?.can_override);

    switch (tab) {
      case "case history":
        return (
          <CaseHistory
            appointmentId={idStr}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
            consultationType="consultation_review"
          />
        );
      case "personal history":
      case "oculo-medical history":
        return (
          <PersonalHistory
            patientId={selectedAppointment?.patient}
            appointmentId={idStr}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "visual acuity":
        return (
          <VisualAcuity
            appointmentId={idStr}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
            canEdit={canEdit}
            consultationType={consultationType}
          />
        );
      case "externals":
        return (
          <Externals
            appointmentId={idStr}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
            canEdit={canEdit}
          />
        );
      case "internals":
        return (
          <Internals
            appointmentId={idStr}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
            canEdit={canEdit}
          />
        );
      case "refraction":
        return (
          <Refraction
            appointmentId={idStr}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
            canEdit={canEdit}
          />
        );
      case "extra tests":
        return (
          <ExtraTests
            appointmentId={idStr}
            setFlowStep={setFlowStep}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
            canEdit={canEdit}
          />
        );
      case "case management guide":
        return (
          <CaseManagementGuide
            appointmentId={idStr}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      default:
        return <p>Select a tab to continue.</p>;
    }
  };

  // -------------------------
  // Flow Step Renderer
  // -------------------------
  const renderFlowStep = () => {
    const idStr = String(appointmentId);
    const canEdit =
      consultationState?.flowType === "lecturer_consulting" ||
      (consultationState?.flowType === "student_consulting" &&
        consultationState?.permissions?.can_edit_management) ||
      (consultationState?.flowType === "lecturer_reviewing" &&
        consultationState?.permissions?.can_override);

    switch (flowStep) {
      case "consultation":
        return (
          <>
            <NavMenu
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabCompletionStatus={tabCompletionStatus}
            />
            <div className="mt-4">{renderTabContent()}</div>
          </>
        );
      case "diagnosis":
        return (
          <Diagnosis
            setActiveTab={setActiveTab}
            appointmentId={idStr}
            setFlowStep={setFlowStep}
            canEdit={canEdit}
          />
        );
      case "management":
        return (
          <Management
            setActiveTab={setActiveTab}
            appointmentId={idStr}
            setFlowStep={setFlowStep}
            canEdit={canEdit}
          />
        );
      case "dispensing":
        return (
          <MedicationDispensing
            appointmentId={idStr}
            setFlowStep={setFlowStep}
          />
        );
      default:
        return null;
    }
  };

  // -------------------------
  // Main Render
  // -------------------------
  const idStr = String(appointmentId);
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-6 px-4 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-extrabold text-xl mb-2">Consultation</h1>
        <Header patient={selectedAppointment} appointmentId={idStr} />

        <div className="mt-4 mb-6">
          <ProgressBar step={stepMap[flowStep] || 1} />
        </div>


        <div className="mb-10">{renderFlowStep()}</div>
      </div>
    </div>
  );
};

export default Consultation;
