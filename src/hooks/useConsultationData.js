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

const useConsultationData = (appointmentId) => {
  const dispatch = useDispatch();

  // Get consultation data (optional - may not exist with new appointment-based system)
  const {
    data: consultation,
    isLoading: isConsultationLoading,
    error: consultationError,
    refetch: refetchConsultation,
  } = useGetConsultationQuery(appointmentId, {
    skip: true, // Skip consultation queries since backend uses appointment-based system
  });

  // Provide fallback consultation state when queries are skipped
  const fallbackConsultation = useMemo(() => {
    if (consultation) return consultation;

    const now = new Date().toISOString();
    return {
      id: `fallback_${appointmentId}`,
      appointment_id: appointmentId,
      status: "Consultation In Progress",
      flowType: "lecturer_consulting", // Default to most permissive
      flowState: "Consultation In Progress",
      is_student_case: false,
      permissions: {
        can_edit_exams: true,
        can_edit_diagnosis: true,
        can_edit_management: true,
        can_submit_for_review: true,
        can_grade: false,
        can_complete: true,
        can_override: true,
      },
      created_at: now,
      updated_at: now,
    };
  }, [consultation, appointmentId]);

  // Mutations
  const [startConsultation, { isLoading: isStarting }] =
    useStartConsultationMutation();
  const [transitionConsultation, { isLoading: isTransitioning }] =
    useTransitionConsultationMutation();
  const [submitConsultation, { isLoading: isSubmitting }] =
    useSubmitConsultationMutation();
  const [completeConsultation, { isLoading: isCompleting }] =
    useCompleteConsultationMutation();

  // Get current consultation state from Redux
  const consultationState = useSelector((state) => state.consultation);

  // Update consultation state when data changes (use fallback if no real data)
  useEffect(() => {
    if (
      fallbackConsultation &&
      consultationState?.id !== fallbackConsultation.id
    ) {
      dispatch(setCurrentConsultation(fallbackConsultation));
    }
  }, [fallbackConsultation, dispatch, consultationState?.id]);

  // Helper functions
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
    }
  };

  const transitionToState = async (consultationId, newState, reason = "") => {
    try {
      dispatch(setTransitioning(true));
      dispatch(clearTransitionMessages());

      const result = await transitionConsultation({
        consultationId,
        data: {
          to: newState,
          meta: { reason },
        },
      }).unwrap();

      dispatch(setTransitionSuccess(`Transitioned to ${newState}`));
      return result;
    } catch (error) {
      dispatch(
        setTransitionError(
          error?.data?.detail ||
            error?.data?.error ||
            "Failed to transition state"
        )
      );
      throw error;
    }
  };

  const submitForReview = async (consultationId) => {
    try {
      dispatch(setTransitioning(true));
      dispatch(clearTransitionMessages());

      const result = await submitConsultation(consultationId).unwrap();
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
    }
  };

  const completeConsultationFlow = async (appointmentId) => {
    try {
      dispatch(setTransitioning(true));
      dispatch(clearTransitionMessages());

      // Use appointment ID directly (simplified approach)
      const result = await completeConsultation(appointmentId).unwrap();

      // Refresh the consultation data so UI reflects the new state immediately
      try {
        await refetchConsultation?.();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Refetch after complete failed:", e);
      }

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
    }
  };

  return {
    // Data
    consultation: fallbackConsultation,
    consultationState,

    // Loading states
    isConsultationLoading,
    isStarting,
    isTransitioning,
    isSubmitting,
    isCompleting,

    // Errors
    consultationError,
    transitionError: consultationState.transitionError,
    transitionSuccess: consultationState.transitionSuccess,

    // Actions
    startConsultationFlow,
    transitionToState,
    submitForReview,
    completeConsultationFlow,
    refetchConsultation,
    clearTransitionMessages: () => dispatch(clearTransitionMessages()),
  };
};

export default useConsultationData;
