import {
  useCreateDiagnosisMutation,
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

  // Log the fetched appointment diagnosis data
  console.log(
    "🔍 useDiagnosisData - Appointment diagnosis data:",
    appointmentDiagnosis
  );
  console.log("🔍 useDiagnosisData - Diagnosis list:", diagnosisList);

  const [createDiagnosis, { isLoading: isCreatingDiagnosis }] =
    useCreateDiagnosisMutation();

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
    isCreatingDiagnosis,
  };
};

export default useDiagnosisData;
