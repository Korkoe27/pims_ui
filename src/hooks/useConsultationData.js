// src/hooks/useConsultationData.js
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useStartConsultationMutation,
  useFetchConsultationVersionsQuery,
} from "../redux/api/features/consultationsApi";
import { setCurrentConsultation } from "../redux/slices/consultationSlice";

/* ---------------------------------------------------------------
   🔹 Flow mapping for consistency
--------------------------------------------------------------- */
const typeToFlowType = {
  expert_consultation: "lecturer_consulting",
  student_consultation: "student_consulting",
  consultation_review: "lecturer_reviewing",
};

/* ==================================================================
   ✅ Simplified consultation data hook
================================================================== */
const useConsultationData = (
  appointmentId,
  appointmentData = null,
  consultationType = "student_consultation"
) => {
  const dispatch = useDispatch();
  const consultationState = useSelector((state) => state.consultation);

  /* ---------------------------------------------------------------
     Determine consultation flow and permissions
  --------------------------------------------------------------- */
  const flowType = typeToFlowType[consultationType];
  const appointmentStatus =
    appointmentData?.status || "Consultation In Progress";

  const permissions = useMemo(() => {
    const s = appointmentStatus.toLowerCase();
    return {
      can_edit_exams: !s.includes("submitted") && !s.includes("completed"),
      can_edit_diagnosis: !s.includes("submitted") && !s.includes("completed"),
      can_edit_management: !s.includes("submitted") && !s.includes("completed"),
      can_submit_for_review: consultationType === "student_consultation",
      can_grade: consultationType === "consultation_review",
      can_complete: true,
    };
  }, [consultationType, appointmentStatus]);

  /* ---------------------------------------------------------------
     Build fallback consultation object (used before API returns)
  --------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------
     API: start consultation + fetch versions
  --------------------------------------------------------------- */
  const [startConsultation, { isLoading: isStarting }] =
    useStartConsultationMutation();

  const {
    data: versions,
    isLoading: isFetchingVersions,
    refetch: refetchVersions,
  } = useFetchConsultationVersionsQuery(appointmentId, {
    skip: !appointmentId,
  });

  /* ---------------------------------------------------------------
     Keep Redux in sync with fallback
  --------------------------------------------------------------- */
  useEffect(() => {
    if (!fallbackConsultation) return;
    const current = consultationState?.currentConsultation;

    if (!current || current.id !== fallbackConsultation.id) {
      dispatch(setCurrentConsultation(fallbackConsultation));
    }
  }, [dispatch, fallbackConsultation, consultationState?.currentConsultation]);

  /* ---------------------------------------------------------------
     Start consultation wrapper
  --------------------------------------------------------------- */
  const startConsultationFlow = async (appointmentId) => {
    const result = await startConsultation({ appointmentId }).unwrap();
    return result;
  };

  /* ---------------------------------------------------------------
     Unified return
  --------------------------------------------------------------- */
  return {
    consultation: fallbackConsultation,
    versions,
    isStarting,
    isFetchingVersions,
    startConsultationFlow,
    refetchVersions,
  };
};

export default useConsultationData;
