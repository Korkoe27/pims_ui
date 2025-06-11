import useFetchConditionsData from "./useFetchConditionsData";
import {
  useCreatePatientHistoryMutation,
  useFetchPatientHistoryQuery,
} from "../redux/api/features/patientHistoryApi";

const usePersonalHistoryData = (patientId, appointmentId) => {
  const { ocularConditions, medicalConditions, isLoading: loadingConditions } =
    useFetchConditionsData();

  const {
    data: personalHistory,
    isLoading: loadingHistory,
    isError,
    error,
  } = useFetchPatientHistoryQuery(patientId, {
    skip: !patientId,
  });

  const [createPatientHistory, createPatientHistoryStatus] =
    useCreatePatientHistoryMutation();

  return {
    personalHistory,
    isLoading: loadingConditions || loadingHistory, // ✅ fixed
    isError,
    error,
    ocularConditions,
    medicalConditions,
    createPatientHistory,
    createPatientHistoryStatus,
  };
};

export default usePersonalHistoryData;
