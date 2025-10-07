import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetAppointmentDetailsQuery } from "../redux/api/features/appointmentsApi";
import {
  useStartConsultationMutation,
  useGetConsultationQuery,
  useTransitionConsultationMutation,
  useSubmitConsultationMutation,
  useCompleteConsultationMutation,
} from "../redux/api/features/consultationApi";
import {
  setConsultationData,
  clearConsultationData,
} from "../redux/slices/consultationSlice";

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
import Logs from "../components/Logs";
import { SubmitTab, GradingTab, CompleteTab } from "../components/Management/";
import BouncingBallsLoader from "../components/BouncingBallsLoader";

// ✅ New flow components (post-management ops)
import Payment from "../components/Payment";
import MedicationDispensing from "../components/MedicationDispensing";

const Consultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const LOCAL_TAB_KEY = `consultation-${appointmentId}-activeTab`;

  // Local tab state
  const [activeTab, _setActiveTab] = useState(() => {
    const stored = localStorage.getItem(LOCAL_TAB_KEY);
    return stored || "exams";
  });

  // Prevent infinite retry loops
  const [consultationStartAttempted, setConsultationStartAttempted] =
    useState(false);

  const setActiveTab = (tab) => {
    localStorage.setItem(LOCAL_TAB_KEY, tab);
    _setActiveTab(tab);
  };

  // ================================
  // Backend Data
  // ================================
  const {
    data: selectedAppointment,
    error: appointmentError,
    isLoading: appointmentLoading,
  } = useGetAppointmentDetailsQuery(appointmentId);

  // Consultation API hooks
  const [startConsultation, { isLoading: starting }] =
    useStartConsultationMutation();
  const [transitionConsultation] = useTransitionConsultationMutation();
  const [submitConsultation] = useSubmitConsultationMutation();
  const [completeConsultation] = useCompleteConsultationMutation();

  const consultationState = useSelector((state) => state.consultation || {});
  const consultationId = consultationState.consultationId;

  const {
    data: consultationData,
    error: consultationError,
    isLoading: consultationLoading,
    refetch: refetchConsultation,
  } = useGetConsultationQuery(consultationId, {
    skip: !consultationId,
  });

  // Start consultation on mount
  useEffect(() => {
    if (
      appointmentId &&
      !consultationId &&
      !starting &&
      !consultationStartAttempted
    ) {
      setConsultationStartAttempted(true);
      startConsultation(appointmentId)
        .unwrap()
        .then((data) => {
          dispatch(setConsultationData(data));
        })
        .catch((error) => {
          console.error("Failed to start consultation:", error);
          // Reset the flag after a delay to allow retry on navigation
          setTimeout(() => setConsultationStartAttempted(false), 5000);
        });
    }
  }, [
    appointmentId,
    consultationId,
    startConsultation,
    dispatch,
    starting,
    consultationStartAttempted,
  ]);

  // Update consultation state when data is fetched
  useEffect(() => {
    if (consultationData) {
      dispatch(setConsultationData(consultationData));
    }
  }, [consultationData, dispatch]);

  // Clear consultation data on unmount
  useEffect(() => {
    return () => {
      dispatch(clearConsultationData());
    };
  }, [dispatch]);

  // Loading gate
  if (
    appointmentLoading ||
    starting ||
    (consultationId && consultationLoading)
  ) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <BouncingBallsLoader />
      </div>
    );
  }

  // Error/empty gate
  if (appointmentError || consultationError || !selectedAppointment) {
    console.error("❌ Error fetching data. Redirecting...");
    setTimeout(() => navigate("/"), 0);
    return <p>Redirecting to Dashboard...</p>;
  }

  // Determine visible tabs based on role and status
  const getVisibleTabs = () => {
    const { role, status } = consultationState || {};

    if (role === "student") {
      return [
        "exams",
        "diagnosis",
        "management",
        "case management guide",
        "logs",
        "submit",
      ];
    } else if (role === "lecturer" && status === "SUBMITTED_FOR_REVIEW") {
      return [
        "exams",
        "diagnosis",
        "management",
        "case management guide",
        "logs",
        "grading",
        "complete",
      ];
    } else if (role === "lecturer") {
      return ["exams", "diagnosis", "management", "complete"];
    } else if (role === "admin") {
      return [
        "exams",
        "diagnosis",
        "management",
        "case management guide",
        "logs",
        "grading",
        "complete",
      ];
    }
    return ["exams"];
  };

  const visibleTabs = getVisibleTabs();

  // --------------------------------
  // Tab Content
  // --------------------------------
  const renderTabContent = () => {
    const tab = (activeTab || "").toLowerCase();
    const idStr = String(appointmentId);

    switch (tab) {
      case "exams":
        // Group all examination components under "exams" tab
        return (
          <div>
            <CaseHistory appointmentId={idStr} setActiveTab={setActiveTab} />
            <PersonalHistory
              patientId={selectedAppointment?.patient}
              appointmentId={idStr}
              setActiveTab={setActiveTab}
            />
            <VisualAcuity appointmentId={idStr} setActiveTab={setActiveTab} />
            <Externals appointmentId={idStr} setActiveTab={setActiveTab} />
            <Internals appointmentId={idStr} setActiveTab={setActiveTab} />
            <Refraction appointmentId={idStr} setActiveTab={setActiveTab} />
            <ExtraTests appointmentId={idStr} setActiveTab={setActiveTab} />
          </div>
        );
      case "diagnosis":
        return <Diagnosis appointmentId={idStr} setActiveTab={setActiveTab} />;
      case "management":
        return <Management appointmentId={idStr} setActiveTab={setActiveTab} />;
      case "case management guide":
        return (
          <CaseManagementGuide
            appointmentId={idStr}
            setActiveTab={setActiveTab}
          />
        );
      case "logs":
        return <Logs appointmentId={idStr} />;
      case "grading":
        return <GradingTab appointmentId={idStr} setActiveTab={setActiveTab} />;
      case "submit":
        return <SubmitTab appointmentId={idStr} setActiveTab={setActiveTab} />;
      case "complete":
        return (
          <CompleteTab appointmentId={idStr} setActiveTab={setActiveTab} />
        );
      default:
        return <p>Select a tab to continue.</p>;
    }
  };

  // -------------------------------
  // Render consultation content
  // -------------------------------
  const renderConsultationContent = () => {
    return (
      <>
        <NavMenu
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          visibleTabs={visibleTabs}
        />
        <div className="mt-4">{renderTabContent()}</div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-6 px-4 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-extrabold text-xl mb-2">Consultation</h1>
        <Header
          patient={selectedAppointment}
          appointmentId={String(appointmentId)}
        />

        <div className="mb-10">{renderConsultationContent()}</div>
      </div>
    </div>
  );
};

export default Consultation;
