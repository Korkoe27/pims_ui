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
    isError,
    error,
    ocularConditions,
    medicalConditions,
    createPatientHistory,
    createPatientHistoryStatus,
    isLoading: loadingConditions || loadingHistory,
  };
};

export default usePersonalHistoryData;
