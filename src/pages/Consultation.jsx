import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ProgressBar from "../components/ProgressBar";
import NavMenu from "../components/NavMenu";
import CaseHistory from "../components/CaseHistory";
import VisualAcuity from "../components/VisualAcuity";
import Externals from "../components/Externals";
import Internals from "../components/Internals";
import Refraction from "../components/Refraction";
import ExtraTests from "../components/ExtraTests";
import {Consultation_nav} from "../extras/data"

const Consultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("case history"); // Default to the first tab

  // Get the selected appointment from Redux
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );

  // Redirect if no appointment is selected
  if (!selectedAppointment) {
    console.error("No appointment selected. Redirecting to Dashboard...");
    navigate("/dashboard");
    return <p>Redirecting to Dashboard...</p>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "case history":
        return <CaseHistory appointmentId={appointmentId} />;
      case "visual acuity":
        return <VisualAcuity appointmentId={appointmentId} />;
      case "externals":
        return <Externals appointmentId={appointmentId} />;
      case "internals":
        return <Internals appointmentId={appointmentId} />;
      case "refraction":
        return <Refraction appointmentId={appointmentId} />;
      case "extra tests":
        return <ExtraTests appointmentId={appointmentId} />;
      default:
        return <p>Select a tab to continue.</p>;
    }
  };

  return (
    <div className="px-8 ml-72 flex flex-col mt-8 gap-8 bg-[#f9fafb] w-full shadow-md sm:rounded-lg">
      <h1 className="font-extrabold text-xl">Consultation</h1>
      {/* Pass patient and appointmentId dynamically */}
      <Header 
        patient={selectedAppointment.patient} 
        appointmentId={appointmentId} 
      />
      <ProgressBar step={1} />
      <NavMenu 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default Consultation;
