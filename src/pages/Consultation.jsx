import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAppointmentDetailsQuery } from "../redux/api/features/appointmentsApi";

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

// ✅ New flow components (post-management ops)
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

  // ================================
  // Backend Data
  // ================================
  const {
    data: selectedAppointment,
    error,
    isLoading,
  } = useGetAppointmentDetailsQuery(appointmentId);

  // ✅ Align with the progress bar (5 local steps; bar shows 3 and clamps)
  const stepMap = {
    consultation: 1,
    diagnosis: 2,
    management: 3,
    payment: 4,
    dispensing: 5,
  };

  // ✅ Map appointment.status to flowStep
  useEffect(() => {
    if (!selectedAppointment) return;

    const status = selectedAppointment.status;

    if (
      [
        "Scheduled",
        "Consultation In Progress",
        "Examinations Recorded",
        "Diagnosis Added",
        "Management Created",
        "Case Management Guide Created",
      ].includes(status)
    ) {
      setFlowStep("consultation");
    } else if (["Submitted For Review", "Under Review"].includes(status)) {
      setFlowStep("diagnosis");
    } else if (status === "Scored") {
      setFlowStep("management");
    } else if (status === "Payment Completed") {
      setFlowStep("payment");
    } else if (status === "Medications Disbursed") {
      setFlowStep("dispensing");
    }
  }, [selectedAppointment, setFlowStep]);

  // Loading gate
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <BouncingBallsLoader />
      </div>
    );
  }

  // Error/empty gate
  if (error || !selectedAppointment) {
    console.error("❌ Error fetching appointment details. Redirecting...");
    // Redirect out of render to avoid rendering an object as a child
    setTimeout(() => navigate("/"), 0);
    return <p>Redirecting to Dashboard...</p>;
  }

  // --------------------------------
  // Tab Content (inside consultation)
  // --------------------------------
  const renderTabContent = () => {
    const tab = (activeTab || "").toLowerCase();
    const idStr = String(appointmentId);

    switch (tab) {
      case "case history":
        return (
          <CaseHistory
            appointmentId={idStr}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
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
          />
        );
      case "externals":
        return (
          <Externals
            appointmentId={idStr}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "internals":
        return (
          <Internals
            appointmentId={idStr}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "refraction":
        return (
          <Refraction
            appointmentId={idStr}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "extra tests":
        return (
          <ExtraTests
            appointmentId={idStr}
            setFlowStep={setFlowStep}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
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
  // Render flow-level content
  // -------------------------
  const renderFlowStep = () => {
    const idStr = String(appointmentId);

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
            canEdit={
              selectedAppointment?.consultation?.can_edit_diagnosis ?? true
            }
          />
        );
      case "management":
        return (
          <Management
            setActiveTab={setActiveTab}
            appointmentId={idStr}
            setFlowStep={setFlowStep}
            canEdit={
              selectedAppointment?.consultation?.can_edit_management ?? true
            }
          />
        );
      case "payment":
        return <Payment appointmentId={idStr} setFlowStep={setFlowStep} />;
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

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-6 px-4 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-extrabold text-xl mb-2">Consultation</h1>
        <Header
          patient={selectedAppointment}
          appointmentId={String(appointmentId)}
        />

        <div className="mt-4 mb-6">
          {/* ProgressBar ends at Management (3 steps). stepMap values > 3 are clamped */}
          <ProgressBar step={stepMap[flowStep] || 1} />
        </div>

        <div className="mb-10">{renderFlowStep()}</div>
      </div>
    </div>
  );
};

export default Consultation;
