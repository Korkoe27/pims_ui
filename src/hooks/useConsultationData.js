import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetConsultationQuery,
  useStartConsultationMutation,
  useTransitionConsultationMutation,
  useSubmitConsultationMutation,
  useCompleteConsultationMutation,
} from "../redux/api/features/consultationApi";
import {
  setCurrentConsultation,
  setTransitioning,
  setTransitionError,
  setTransitionSuccess,
  clearTransitionMessages,
} from "../redux/slices/consultationSlice";

// 🔹 Maps frontend consultation type → internal flow name used in UI
const typeToFlowType = {
  expert_consultation: "lecturer_consulting",
  student_consultation: "student_consulting",
  consultation_review: "lecturer_reviewing",
};

const useConsultationData = (
  appointmentId,
  appointmentData = null,
  consultationType = null
) => {
  const dispatch = useDispatch();

  // --- Queries ------------------------------------------------------
  const {
    data: consultation,
    isLoading: isConsultationLoading,
    error: consultationError,
    refetch: refetchConsultation,
  } = useGetConsultationQuery(appointmentId, {
    skip: true,
  });

  // --- Flow & Permission Mapping ------------------------------------
  const flowType = typeToFlowType[consultationType] || null;
  const appointmentStatus =
    appointmentData?.status || "Consultation In Progress";

  const determinePermissions = (type, status) => {
    const s = status?.toLowerCase() || "";
    switch (type) {
      case "student_consultation":
        return {
          can_edit_exams: !s.includes("submitted") && !s.includes("completed"),
          can_edit_diagnosis: !s.includes("submitted") && !s.includes("completed"),
          can_edit_management: !s.includes("submitted") && !s.includes("completed"),
          can_submit_for_review: true,
          can_grade: false,
          can_complete: false,
          can_override: false,
        };
      case "consultation_review":
        return {
          can_edit_exams: true,
          can_edit_diagnosis: true,
          can_edit_management: true,
          can_submit_for_review: false,
          can_grade: true,
          can_complete: true,
          can_override: true,
        };
      case "expert_consultation":
      default:
        return {
          can_edit_exams: true,
          can_edit_diagnosis: true,
          can_edit_management: true,
          can_submit_for_review: false,
          can_grade: false,
          can_complete: true,
          can_override: true,
        };
    }
  };

  const permissions = determinePermissions(consultationType, appointmentStatus);

  // --- Build fallback consultation object ---------------------------
  const fallbackConsultation = useMemo(() => {
    const now = new Date().toISOString();
    return {
      id: `fallback_${appointmentId}`,
      appointment_id: appointmentId,
      status: appointmentStatus,
      flowType,
      flowState: appointmentStatus,
      permissions,
      created_at: now,
      updated_at: now,
    };
  }, [appointmentId, appointmentStatus, flowType, permissions]);

  // --- Mutations ----------------------------------------------------
  const [startConsultation, { isLoading: isStarting }] =
    useStartConsultationMutation();
  const [transitionConsultation, { isLoading: isTransitioning }] =
    useTransitionConsultationMutation();
  const [submitConsultation, { isLoading: isSubmitting }] =
    useSubmitConsultationMutation();
  const [completeConsultation, { isLoading: isCompleting }] =
    useCompleteConsultationMutation();

  // --- Redux state --------------------------------------------------
  const consultationState = useSelector((state) => state.consultation);

  // ================================================================
  // 🔧 FIXED: Prevent infinite update loop
  // ================================================================
  useEffect(() => {
    if (!fallbackConsultation) return;

    const current = consultationState?.currentConsultation;
    const isSame =
      current &&
      current.id === fallbackConsultation.id &&
      current.flowState === fallbackConsultation.flowState &&
      current.flowType === fallbackConsultation.flowType;

    if (!isSame) {
      dispatch(setCurrentConsultation(fallbackConsultation));
    }
  }, [
    dispatch,
    fallbackConsultation.id,
    fallbackConsultation.flowState,
    fallbackConsultation.flowType,
    consultationState?.currentConsultation,
  ]);

  // --- Helper functions ---------------------------------------------
  const startConsultationFlow = async (data) => {
    try {
      dispatch(setTransitioning(true));
      dispatch(clearTransitionMessages());
      const result = await startConsultation(data).unwrap();
      dispatch(setTransitionSuccess("Consultation started successfully"));
      return result;
    } catch (error) {
      dispatch(
        setTransitionError(
          error?.data?.detail ||
            error?.data?.error ||
            "Failed to start consultation"
        )
      );
      throw error;
    } finally {
      dispatch(setTransitioning(false));
    }
  };

  const transitionToState = async (appointmentId, newState, reason = "") => {
    try {
      dispatch(setTransitioning(true));
      dispatch(clearTransitionMessages());
      const result = await transitionConsultation({
        consultationId: appointmentId,
        data: { to: newState, meta: { reason } },
      }).unwrap();
      dispatch(setTransitionSuccess(`Transitioned to ${newState}`));
      return result;
    } catch (error) {
      dispatch(
        setTransitionError(
          error?.data?.detail ||
            error?.data?.error ||
            "Failed to transition consultation"
        )
      );
      throw error;
    } finally {
      dispatch(setTransitioning(false));
    }
  };

  const submitForReview = async (appointmentId) => {
    try {
      dispatch(setTransitioning(true));
      dispatch(clearTransitionMessages());
      const result = await submitConsultation(appointmentId).unwrap();
      dispatch(setTransitionSuccess("Submitted for review successfully"));
      return result;
    } catch (error) {
      dispatch(
        setTransitionError(
          error?.data?.detail ||
            error?.data?.error ||
            "Failed to submit for review"
        )
      );
      throw error;
    } finally {
      dispatch(setTransitioning(false));
    }
  };

  const completeConsultationFlow = async (appointmentId) => {
    try {
      dispatch(setTransitioning(true));
      dispatch(clearTransitionMessages());
      const result = await completeConsultation(appointmentId).unwrap();
      await refetchConsultation?.().catch(() => {});
      dispatch(setTransitionSuccess("Consultation completed successfully"));
      return result;
    } catch (error) {
      dispatch(
        setTransitionError(
          error?.data?.detail ||
            error?.data?.error ||
            "Failed to complete consultation"
        )
      );
      throw error;
    } finally {
      dispatch(setTransitioning(false));
    }
  };

  // --- Return unified data + actions --------------------------------
  return {
    consultation: fallbackConsultation,
    consultationState: {
      ...fallbackConsultation,
      flowType,
      permissions,
      nextAllowedStates: appointmentData?.next_allowed_states || [],
      flowState: appointmentStatus,
      isTransitioning:
        isStarting || isTransitioning || isSubmitting || isCompleting,
    },

    isConsultationLoading,
    isStarting,
    isTransitioning,
    isSubmitting,
    isCompleting,

    consultationError,
    transitionError: consultationState.transitionError,
    transitionSuccess: consultationState.transitionSuccess,

    startConsultationFlow,
    transitionToState,
    submitForReview,
    completeConsultationFlow,
    refetchConsultation,
    clearTransitionMessages: () => dispatch(clearTransitionMessages()),
  };
};

export default useConsultationData;
