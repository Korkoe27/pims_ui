import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAppointmentDetailsQuery,
  useGetAppointmentFlowContextQuery,
} from "../redux/api/features/appointmentsApi";

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
import BouncingBallsLoader from "../components/BouncingBallsLoader";

// ✅ New flow components
import Payment from "../components/Payment";
import MedicationDispensing from "../components/MedicationDispensing";

const Consultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const LOCAL_TAB_KEY = `consultation-${appointmentId}-activeTab`;
  const LOCAL_FLOW_KEY = `consultation-${appointmentId}-flowStep`;
  const LOCAL_STATUS_KEY = `consultation-${appointmentId}-tabCompletionStatus`;

  // Local tab state (case history, VA, externals, etc.)
  const [activeTab, _setActiveTab] = useState(() => {
    const stored = localStorage.getItem(LOCAL_TAB_KEY);
    return stored || "case history";
  });

  // Local fallback for flow step
  const [flowStep, _setFlowStep] = useState(() => {
    const stored = localStorage.getItem(LOCAL_FLOW_KEY);
    return stored || "consultation";
  });

  const [tabCompletionStatus, _setTabCompletionStatus] = useState(() => {
    const stored = localStorage.getItem(LOCAL_STATUS_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const setActiveTab = (tab) => {
    localStorage.setItem(LOCAL_TAB_KEY, tab);
    _setActiveTab(tab);
  };

  const setFlowStep = (step) => {
    localStorage.setItem(LOCAL_FLOW_KEY, step);
    _setFlowStep(step);
  };

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

  // ================================
  // Backend Data
  // ================================
  const {
    data: selectedAppointment,
    error,
    isLoading,
  } = useGetAppointmentDetailsQuery(appointmentId);

  const {
    data: flowContext,
    isLoading: loadingFlow,
    error: flowError,
  } = useGetAppointmentFlowContextQuery(appointmentId, {
    skip: !appointmentId,
  });

  // Keep backend flow in sync with local state
  useEffect(() => {
    if (flowContext?.current_step) {
      _setFlowStep(flowContext.current_step);
      localStorage.setItem(LOCAL_FLOW_KEY, flowContext.current_step);
    }
  }, [flowContext]);

  // ✅ Align with the progress bar (5 visible steps)
  const stepMap = {
    consultation: 1,
    diagnosis: 2,
    management: 3,
    payment: 4,
    dispensing: 5,
  };

  // Normalize backend flow kinds into our UI step keys
  const normalizeStep = (flowContext, fallback = "consultation") => {
    if (!flowContext) return fallback;

    switch (flowContext.flow) {
      case "STUDENT_CONSULTING":
      case "LECTURER_CONSULTING":
      case "LECTURER_REVIEWING":
        return "consultation";
      default:
        // allow backend to override if it sends current_step
        return flowContext.current_step || fallback;
    }
  };

  const currentStep = normalizeStep(flowContext, flowStep);

  if (isLoading || loadingFlow) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <BouncingBallsLoader />
      </div>
    );
  }

  if (error || flowError || !selectedAppointment) {
    console.error("❌ Error fetching appointment details/flow. Redirecting...");
    navigate("/");
    return <p>Redirecting to Dashboard...</p>;
  }

  // --------------------------------
  // Tab Content (inside consultation)
  // --------------------------------
  const renderTabContent = () => {
    const tab = activeTab.toLowerCase();
    switch (tab) {
      case "case history":
        return (
          <CaseHistory
            appointmentId={appointmentId}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "personal history":
      case "oculo-medical history":
        return (
          <PersonalHistory
            patientId={selectedAppointment?.patient}
            appointmentId={appointmentId}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "visual acuity":
        return (
          <VisualAcuity
            appointmentId={appointmentId}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "externals":
        return (
          <Externals
            appointmentId={appointmentId}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "internals":
        return (
          <Internals
            appointmentId={appointmentId}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "refraction":
        return (
          <Refraction
            appointmentId={appointmentId}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "extra tests":
        return (
          <ExtraTests
            appointmentId={appointmentId}
            setFlowStep={setFlowStep}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "case management guide":
        return (
          <CaseManagementGuide
            appointmentId={appointmentId}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      default:
        return <p>Select a tab to continue.</p>;
    }
  };

  // -------------------------
  // Render flow-level content
  // -------------------------
  const renderFlowStep = () => {
    switch (currentStep) {
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
            appointmentId={appointmentId}
            setFlowStep={setFlowStep}
          />
        );
      case "management":
        return (
          <Management
            setActiveTab={setActiveTab}
            appointmentId={appointmentId}
            setFlowStep={setFlowStep}
          />
        );
      case "payment":
        return (
          <Payment appointmentId={appointmentId} setFlowStep={setFlowStep} />
        );
      case "dispensing":
        return (
          <MedicationDispensing
            appointmentId={appointmentId}
            setFlowStep={setFlowStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-6 px-4 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-extrabold text-xl mb-2">Consultation</h1>
        <Header patient={selectedAppointment} appointmentId={appointmentId} />

        {/* Debug / status panel */}
        {flowContext && (
          <div className="p-3 bg-blue-50 rounded mb-4 text-sm">
            <p>
              <strong>Status:</strong> {flowContext.status}
            </p>
            <p>
              <strong>Flow:</strong> {flowContext.flow}
            </p>
            <p>
              <strong>Role:</strong> {flowContext.role}
            </p>
            <p>
              <strong>Permissions:</strong>{" "}
              {Object.entries(flowContext.permissions || {})
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ")}
            </p>
          </div>
        )}

        <div className="mt-4 mb-6">
          <ProgressBar step={stepMap[currentStep] || 1} />
        </div>

        <div className="mb-10">{renderFlowStep()}</div>
      </div>
    </div>
  );
};

export default Consultation;
