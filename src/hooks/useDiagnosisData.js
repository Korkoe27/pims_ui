import { useEffect } from "react";
import {
  useCreateDiagnosisMutation,
  useUpdateDiagnosisMutation,
  useGetAllDiagnosisQuery,
  useGetAppointmentDiagnosisQuery,
} from "../redux/api/features/diagnosisApi";

const useDiagnosisData = (appointmentId = null) => {
  const {
    data: diagnosisList = [],
    isLoading: isDiagnosisLoading,
    isError: isDiagnosisError,
    error: diagnosisError,
    refetch: refetchDiagnosis,
  } = useGetAllDiagnosisQuery();

  const {
    data: appointmentDiagnosis = [],
    isLoading: isAppointmentDiagnosisLoading,
    isError: isAppointmentDiagnosisError,
    error: appointmentDiagnosisError,
    refetch: refetchAppointmentDiagnosis,
  } = useGetAppointmentDiagnosisQuery(appointmentId, {
    skip: !appointmentId,
  });

  // If diagnosis list failed to load but appointment diagnosis has data, try to refetch
  useEffect(() => {
    if (
      appointmentDiagnosis &&
      (!diagnosisList || diagnosisList.length === 0) &&
      !isDiagnosisLoading
    ) {
      console.log(
        "🔄 Diagnosis list is empty but appointment has data, refetching diagnosis list..."
      );
      refetchDiagnosis();
    }
  }, [
    appointmentDiagnosis,
    diagnosisList,
    isDiagnosisLoading,
    refetchDiagnosis,
  ]);

  const [createDiagnosis, { isLoading: isCreatingDiagnosis }] =
    useCreateDiagnosisMutation();

  const [updateDiagnosis, { isLoading: isUpdatingDiagnosis }] =
    useUpdateDiagnosisMutation();

  return {
    diagnosisList,
    appointmentDiagnosis,
    isDiagnosisLoading,
    isAppointmentDiagnosisLoading,
    isDiagnosisError,
    isAppointmentDiagnosisError,
    diagnosisError,
    appointmentDiagnosisError,
    refetchDiagnosis,
    refetchAppointmentDiagnosis,
    createDiagnosis,
    updateDiagnosis,
    isCreatingDiagnosis,
    isUpdatingDiagnosis,
  };
};

export default useDiagnosisData;
