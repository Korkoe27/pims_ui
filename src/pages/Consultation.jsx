import React, { useState } from "react";
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
import BouncingBallsLoader from "../components/BouncingBallsLoader";

const Consultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  // LocalStorage keys
  const LOCAL_TAB_KEY = `consultation-${appointmentId}-activeTab`;
  const LOCAL_FLOW_KEY = `consultation-${appointmentId}-flowStep`;
  const LOCAL_STATUS_KEY = `consultation-${appointmentId}-tabCompletionStatus`;

  // Initial state setup
  const [activeTab, _setActiveTab] = useState(() => {
    const stored = localStorage.getItem(LOCAL_TAB_KEY);
    return stored || "case history";
  });

  const [flowStep, _setFlowStep] = useState(() => {
    const stored = localStorage.getItem(LOCAL_FLOW_KEY);
    return stored || "consultation";
  });

  const [tabCompletionStatus, _setTabCompletionStatus] = useState(() => {
    const stored = localStorage.getItem(LOCAL_STATUS_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  // Persisting active tab
  const setActiveTab = (tab) => {
    localStorage.setItem(LOCAL_TAB_KEY, tab);
    _setActiveTab(tab);
  };

  // Persisting flow step
  const setFlowStep = (step) => {
    localStorage.setItem(LOCAL_FLOW_KEY, step);
    _setFlowStep(step);
  };

  // Persisting completion status
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

  // API
  const {
    data: selectedAppointment,
    error,
    isLoading,
  } = useGetAppointmentDetailsQuery(appointmentId);

  const stepMap = {
    consultation: 1,
    diagnosis: 2,
    management: 3,
  };

  // Handle loading/errors
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <BouncingBallsLoader />
      </div>
    );
  }

  if (error || !selectedAppointment) {
    console.error("❌ Error fetching appointment details. Redirecting...");
    navigate("/");
    return <p>Redirecting to Dashboard...</p>;
  }

  // Render selected tab
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
      default:
        return <p>Select a tab to continue.</p>;
    }
  };

  // Render current flow step
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
      default:
        return null;
    }
  };

  return (
    <div className="px-8 ml-72 flex flex-col mt-8 gap-8 bg-[#f9fafb] w-full shadow-md sm:rounded-lg">
      <h1 className="font-extrabold text-xl">Consultation</h1>
      <Header patient={selectedAppointment} appointmentId={appointmentId} />
      <ProgressBar step={stepMap[flowStep] || 1} setStep={setFlowStep} />
      {renderFlowStep()}
    </div>
  );
};

export default Consultation;
