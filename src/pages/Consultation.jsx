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
import CompleteConsultation from "../components/CompleteConsultation";
import BouncingBallsLoader from "../components/BouncingBallsLoader";

const Consultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const LOCAL_TAB_KEY = `consultation-${appointmentId}-activeTab`;
  const LOCAL_FLOW_KEY = `consultation-${appointmentId}-flowStep`;
  const LOCAL_STATUS_KEY = `consultation-${appointmentId}-tabCompletionStatus`;

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

  const {
    data: selectedAppointment,
    error,
    isLoading,
  } = useGetAppointmentDetailsQuery(appointmentId);

  const stepMap = {
    consultation: 1,
    diagnosis: 2,
    management: 3,
    complete: 4,
  };

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
      case "complete":
        return (
          <CompleteConsultation
            appointmentId={appointmentId}
            navigate={navigate}
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
        <div className="mt-4 mb-6">
          <ProgressBar step={stepMap[flowStep] || 1} setStep={setFlowStep} />
        </div>
        <div className="mb-10">{renderFlowStep()}</div>
      </div>
    </div>
  );
};

export default Consultation;
