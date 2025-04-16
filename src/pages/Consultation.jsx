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

const Consultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("case history");
  const [flowStep, setFlowStep] = useState("consultation");
  const [tabCompletionStatus, setTabCompletionStatus] = useState({});

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

  if (isLoading) {
    return <p>Loading patient details...</p>;
  }

  if (error || !selectedAppointment) {
    console.error(
      "Error fetching appointment details. Redirecting to Dashboard..."
    );
    navigate("/dashboard");
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
