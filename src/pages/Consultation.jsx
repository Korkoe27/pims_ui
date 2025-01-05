import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import ProgressBar from "../components/ProgressBar";
import NavMenu from "../components/NavMenu";
import CaseHistory from "../components/CaseHistory";
import VisualAcuity from "../components/VisualAcuity";
import Externals from "../components/Externals";
import Internals from "../components/Internals";
import Refraction from "../components/Refraction";
import ExtraTests from "../components/ExtraTests";

const Consultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab order for navigation
  const tabOrder = [
    "case history",
    "visual acuity",
    "externals",
    "internals",
    "refraction",
    "extra tests",
  ];

  // Get the active tab from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "case history";

  const [activeTab, setActiveTab] = useState(initialTab);

  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );

  // Redirect if no appointment is selected
  useEffect(() => {
    if (!selectedAppointment) {
      console.error("No appointment selected. Redirecting to Dashboard...");
      navigate("/dashboard");
    }
  }, [selectedAppointment, navigate]);

  // Update the URL when the active tab changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("tab", activeTab);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [activeTab, navigate, location.pathname]);

  const navigateToNextTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex >= 0 && currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "case history":
        return (
          <CaseHistory
            appointmentId={appointmentId}
            onNavigateNext={navigateToNextTab}
          />
        );
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
      <Header
        patient={selectedAppointment.patient} 
        appointmentId={appointmentId}
      />
      <ProgressBar step={1} />
      <NavMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default Consultation;

