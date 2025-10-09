import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAppointmentDetailsQuery } from "../redux/api/features/appointmentsApi";
import useConsultationData from "../hooks/useConsultationData";

import Header from "../components/Header";
import ProgressBar from "../components/ProgressBar";
import NavMenu from "../components/NavMenu";
import { formatErrorMessage } from "../components/ToasterHelper";
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
// Payment step removed from flow
import MedicationDispensing from "../components/MedicationDispensing";

// Consultation flow transition controls
const TransitionControls = ({
  consultationState,
  transitionToState,
  submitForReview,
  completeConsultationFlow,
  isTransitioning,
  transitionError,
  transitionSuccess,
  clearTransitionMessages,
  appointmentId,
}) => {
  const {
    nextAllowedStates = [],
    permissions = {},
    flowType,
    flowState,
  } = consultationState || {};

  // Don't show controls if no permissions or states available
  if (
    !nextAllowedStates.length &&
    !permissions.can_submit_for_review &&
    !permissions.can_complete
  ) {
    return null;
  }

  // Get flow-specific messaging
  const getFlowTitle = () => {
    switch (flowType) {
      case "lecturer_consulting":
        return "Lecturer Consultation Controls";
      case "student_consulting":
        return "Student Consultation Progress";
      case "lecturer_reviewing":
        return "Review & Grading Controls";
      default:
        return "Consultation Flow Controls";
    }
  };

  const getFlowDescription = () => {
    switch (flowType) {
      case "lecturer_consulting":
        return "You have full control over this consultation.";
      case "student_consulting":
        return "Complete your work and submit for lecturer review.";
      case "lecturer_reviewing":
        return "Review student work and provide grading.";
      default:
        return "";
    }
  };

  // Debug info
  console.log("TransitionControls Debug:", {
    flowType,
    flowState,
    permissions,
    nextAllowedStates,
  });

  return (
    <div className="mb-6 p-4 bg-white rounded-md shadow-sm border">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{getFlowTitle()}</h3>
          <p className="text-sm text-gray-600 mt-1">{getFlowDescription()}</p>
        </div>
        <div className="text-xs bg-gray-100 px-2 py-1 rounded">
          {flowType?.replace("_", " ").toUpperCase()}
        </div>
      </div>

      {/* Transition messages */}
      {transitionError && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {formatErrorMessage(transitionError)}
          <button
            onClick={clearTransitionMessages}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {transitionSuccess && (
        <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded text-green-700">
          {typeof transitionSuccess === "string"
            ? transitionSuccess
            : formatErrorMessage(transitionSuccess)}
          <button
            onClick={clearTransitionMessages}
            className="ml-2 text-green-500 hover:text-green-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Flow-specific controls */}
      <div className="flex flex-wrap gap-3">
        {/* Lecturer Consulting: Full transition control */}
        {flowType === "lecturer_consulting" &&
          nextAllowedStates.map((state) => (
            <button
              key={state}
              onClick={() => transitionToState(appointmentId, state)}
              disabled={isTransitioning}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTransitioning ? "Transitioning..." : `→ ${state}`}
            </button>
          ))}

        {/* Student Consulting: Only submit for review */}
        {flowType === "student_consulting" &&
          permissions.can_submit_for_review && (
            <button
              onClick={() => submitForReview(appointmentId)}
              disabled={isTransitioning}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTransitioning ? "Submitting..." : "📤 Submit for Review"}
            </button>
          )}

        {/* Lecturer Reviewing: Grading and transition controls */}
        {flowType === "lecturer_reviewing" && (
          <>
            {nextAllowedStates.map((state) => (
              <button
                key={state}
                onClick={() => transitionToState(appointmentId, state)}
                disabled={isTransitioning}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTransitioning ? "Transitioning..." : `✓ ${state}`}
              </button>
            ))}
            {permissions.can_complete && (
              <button
                onClick={() => completeConsultationFlow(appointmentId)}
                disabled={isTransitioning}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTransitioning ? "Completing..." : "🏁 Complete Consultation"}
              </button>
            )}
          </>
        )}

        {/* General complete for lecturer consulting */}
        {flowType === "lecturer_consulting" && permissions.can_complete && (
          <button
            onClick={() => completeConsultationFlow(appointmentId)}
            disabled={isTransitioning}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTransitioning ? "Completing..." : "🏁 Complete Consultation"}
          </button>
        )}
      </div>

      {/* Current state info */}
      <div className="mt-3 text-sm text-gray-600">
        <span className="font-medium">Current State:</span>{" "}
        {flowState || "Loading..."}
        {flowType === "student_consulting" &&
          flowState === "Submitted For Review" && (
            <span className="ml-2 text-orange-600">
              ⏳ Awaiting lecturer review
            </span>
          )}
        {flowType === "lecturer_reviewing" && (
          <span className="ml-2 text-purple-600">👨‍🏫 Review in progress</span>
        )}
      </div>
    </div>
  );
};

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

  // Consultation flow data
  const {
    consultation,
    consultationState,
    isConsultationLoading,
    transitionError,
    transitionSuccess,
    transitionToState,
    submitForReview,
    completeConsultationFlow,
    clearTransitionMessages,
  } = useConsultationData(appointmentId);

  // ✅ Align with the progress bar (5 local steps; bar shows 3 and clamps)
  const stepMap = {
    consultation: 1,
    diagnosis: 2,
    management: 3,
    dispensing: 5,
  };

  // ✅ Map consultation status to flowStep
  useEffect(() => {
    if (!consultationState?.flowState) return;

    const consultationStatus = consultationState.flowState;

    // Map consultation states to UI flow steps
    const stateToFlowStep = {
      "Consultation In Progress": "consultation",
      "Exams Recorded": "consultation",
      "Diagnosis Added": "diagnosis",
      // Keep the user in the consultation step even if management has been created;
      // this prevents auto-switching away from exams/diagnosis when a management
      // record exists but the clinician still needs to complete the consultation.
      "Management Created": "consultation",
      "Case Management Guide Created": "management",
      "Logs Created": "management",
      "Submitted For Review": "diagnosis",
      "Under Review": "diagnosis",
      Graded: "management",
      "Consultation Completed": "dispensing",
    };

    const mappedFlowStep =
      stateToFlowStep[consultationStatus] || "consultation";
    setFlowStep(mappedFlowStep);
  }, [consultationState?.flowState, setFlowStep]);

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
            canEdit={
              consultationState?.flowType === "lecturer_consulting" ||
              (consultationState?.flowType === "student_consulting" &&
                consultationState?.permissions?.can_edit_exams) ||
              (consultationState?.flowType === "lecturer_reviewing" &&
                consultationState?.permissions?.can_override)
            }
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
            canEdit={
              consultationState?.flowType === "lecturer_consulting" ||
              (consultationState?.flowType === "student_consulting" &&
                consultationState?.permissions?.can_edit_exams) ||
              (consultationState?.flowType === "lecturer_reviewing" &&
                consultationState?.permissions?.can_override)
            }
          />
        );
      case "externals":
        return (
          <Externals
            appointmentId={idStr}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
            canEdit={
              consultationState?.flowType === "lecturer_consulting" ||
              (consultationState?.flowType === "student_consulting" &&
                consultationState?.permissions?.can_edit_exams) ||
              (consultationState?.flowType === "lecturer_reviewing" &&
                consultationState?.permissions?.can_override)
            }
          />
        );
      case "internals":
        return (
          <Internals
            appointmentId={idStr}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
            canEdit={
              consultationState?.flowType === "lecturer_consulting" ||
              (consultationState?.flowType === "student_consulting" &&
                consultationState?.permissions?.can_edit_exams) ||
              (consultationState?.flowType === "lecturer_reviewing" &&
                consultationState?.permissions?.can_override)
            }
          />
        );
      case "refraction":
        return (
          <Refraction
            appointmentId={idStr}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
            canEdit={
              consultationState?.flowType === "lecturer_consulting" ||
              (consultationState?.flowType === "student_consulting" &&
                consultationState?.permissions?.can_edit_exams) ||
              (consultationState?.flowType === "lecturer_reviewing" &&
                consultationState?.permissions?.can_override)
            }
          />
        );
      case "extra tests":
        return (
          <ExtraTests
            appointmentId={idStr}
            setFlowStep={setFlowStep}
            setActiveTab={setActiveTab}
            setTabCompletionStatus={setTabCompletionStatus}
            canEdit={
              consultationState?.flowType === "lecturer_consulting" ||
              (consultationState?.flowType === "student_consulting" &&
                consultationState?.permissions?.can_edit_exams) ||
              (consultationState?.flowType === "lecturer_reviewing" &&
                consultationState?.permissions?.can_override)
            }
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
              consultationState?.flowType === "lecturer_consulting" ||
              (consultationState?.flowType === "student_consulting" &&
                consultationState?.permissions?.can_edit_diagnosis) ||
              (consultationState?.flowType === "lecturer_reviewing" &&
                consultationState?.permissions?.can_override)
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
              consultationState?.flowType === "lecturer_consulting" ||
              (consultationState?.flowType === "student_consulting" &&
                consultationState?.permissions?.can_edit_management) ||
              (consultationState?.flowType === "lecturer_reviewing" &&
                consultationState?.permissions?.can_override)
            }
          />
        );
      // payment step intentionally removed; proceed from management -> dispensing
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

        {/* Consultation flow transition controls */}
        <TransitionControls
          consultationState={consultationState}
          transitionToState={transitionToState}
          submitForReview={submitForReview}
          completeConsultationFlow={completeConsultationFlow}
          isTransitioning={consultationState?.isTransitioning || false}
          transitionError={transitionError}
          transitionSuccess={transitionSuccess}
          clearTransitionMessages={clearTransitionMessages}
          appointmentId={appointmentId}
        />

        <div className="mb-10">{renderFlowStep()}</div>
      </div>
    </div>
  );
};

export default Consultation;
