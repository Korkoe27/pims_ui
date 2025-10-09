import { useEffect } from "react";
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

  // Get consultation data
  const {
    data: consultation,
    isLoading: isConsultationLoading,
    error: consultationError,
    refetch: refetchConsultation,
  } = useGetConsultationQuery(appointmentId, {
    skip: !appointmentId,
  });

  // Mutations
  const [startConsultation, { isLoading: isStarting }] =
    useStartConsultationMutation();
  const [transitionConsultation, { isLoading: isTransitioning }] =
    useTransitionConsultationMutation();
  const [submitConsultation, { isLoading: isSubmitting }] =
    useSubmitConsultationMutation();
  const [completeConsultation, { isLoading: isCompleting }] =
    useCompleteConsultationMutation();

  // Update consultation state when data changes
  useEffect(() => {
    if (consultation) {
      dispatch(setCurrentConsultation(consultation));
    }
  }, [consultation, dispatch]);

  // Get current consultation state from Redux
  const consultationState = useSelector((state) => state.consultation);

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

  const completeConsultationFlow = async (consultationId) => {
    try {
      dispatch(setTransitioning(true));
      dispatch(clearTransitionMessages());

      const result = await completeConsultation(consultationId).unwrap();
      // Refresh the consultation data so UI reflects the new state immediately
      try {
        await refetchConsultation?.();
      } catch (e) {
        // Non-fatal: if refetch fails, we'll still treat the complete as successful
        // and surface the transition success message.
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
    consultation,
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
