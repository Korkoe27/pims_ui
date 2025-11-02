// src/pages/Consultation.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
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
import MedicationDispensing from "../components/MedicationDispensing";
import BouncingBallsLoader from "../components/BouncingBallsLoader";

// ---------------------------------------------------------------------
// 🔹 Main Consultation Page
// ---------------------------------------------------------------------
const Consultation = () => {
  const { appointmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userAccess = useSelector((state) => state.auth.user?.access);

  // ✅ Extract versionId from query string (?version=<id>)
  const queryParams = new URLSearchParams(location.search);
  const versionId = queryParams.get("version");

  // -------------------------------------------------------------------
  // 🔹 Local storage keys for persistence
  // -------------------------------------------------------------------
  const LOCAL_TAB_KEY = `consultation-${appointmentId}-activeTab`;
  const LOCAL_FLOW_KEY = `consultation-${appointmentId}-flowStep`;
  const LOCAL_STATUS_KEY = `consultation-${appointmentId}-tabCompletionStatus`;

  // -------------------------------------------------------------------
  // 🔹 Local state
  // -------------------------------------------------------------------
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

  // -------------------------------------------------------------------
  // 🔹 Helper setters (persisted)
  // -------------------------------------------------------------------
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

  // -------------------------------------------------------------------
  // 🔹 Fetch Appointment Details
  // -------------------------------------------------------------------
  const {
    data: selectedAppointment,
    error,
    isLoading,
  } = useGetAppointmentDetailsQuery(appointmentId);

  // Derive flow step from appointment status
  useEffect(() => {
    if (!selectedAppointment?.status) return;

    const stateToFlowStep = {
      scheduled: "consultation",
      "in progress": "consultation",
      diagnosed: "diagnosis",
      management: "management",
      completed: "dispensing",
    };

    const nextStep =
      stateToFlowStep[selectedAppointment.status.toLowerCase?.()] || "consultation";
    setFlowStep(nextStep);
  }, [selectedAppointment?.status, setFlowStep]);

  // -------------------------------------------------------------------
  // 🔹 Handle Loading / Error States
  // -------------------------------------------------------------------
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

  const idStr = String(appointmentId);

  // -------------------------------------------------------------------
  // 🔹 Render Tab Content (for Consultation Flow)
  // -------------------------------------------------------------------
  const renderTabContent = () => {
    const tab = (activeTab || "").toLowerCase();

    switch (tab) {
      case "case history":
        return (
          <CaseHistory
            appointmentId={idStr}
            versionId={versionId} // ✅ added
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
            versionId={versionId} // ✅ added
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "visual acuity":
        return (
          <VisualAcuity
            appointmentId={idStr}
            versionId={versionId} // ✅ added
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "externals":
        return (
          <Externals
            appointmentId={idStr}
            versionId={versionId} // ✅ added
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "internals":
        return (
          <Internals
            appointmentId={idStr}
            versionId={versionId} // ✅ added
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "refraction":
        return (
          <Refraction
            appointmentId={idStr}
            versionId={versionId} // ✅ added
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "extra tests":
        return (
          <ExtraTests
            appointmentId={idStr}
            versionId={versionId} // ✅ added
            setFlowStep={setFlowStep}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      case "case management guide":
        return (
          <CaseManagementGuide
            appointmentId={idStr}
            versionId={versionId} // ✅ added
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
          />
        );
      default:
        return <p>Select a tab to continue.</p>;
    }
  };

  // -------------------------------------------------------------------
  // 🔹 Render Flow Step (Consultation → Diagnosis → Management → Dispensing)
  // -------------------------------------------------------------------
  const renderFlowStep = () => {
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
            appointmentId={idStr}
            versionId={versionId} // ✅ added
            setFlowStep={setFlowStep}
            setActiveTab={setActiveTab}
          />
        );
      case "management":
        return (
          <Management
            appointmentId={idStr}
            versionId={versionId} // ✅ added
            setFlowStep={setFlowStep}
            setActiveTab={setActiveTab}
          />
        );
      case "dispensing":
        return (
          <MedicationDispensing
            appointmentId={idStr}
            versionId={versionId} // ✅ added
            setFlowStep={setFlowStep}
          />
        );
      default:
        return null;
    }
  };

  // -------------------------------------------------------------------
  // 🔹 Final Render
  // -------------------------------------------------------------------
  const stepMap = {
    consultation: 1,
    diagnosis: 2,
    management: 3,
    dispensing: 4,
  };

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
