import useFetchConditionsData from "./useFetchConditionsData";
import { useCreatePatientHistoryMutation } from "../redux/api/features/patientHistoryApi";

const usePersonalHistoryData = (patientId, appointmentId) => {
  const { ocularConditions, medicalConditions, isLoading } = useFetchConditionsData();
  const [createPatientHistory, createPatientHistoryStatus] = useCreatePatientHistoryMutation();

  return {
    ocularConditions,
    medicalConditions,
    createPatientHistory,
    createPatientHistoryStatus,
    isLoading,
  };
};

export default usePersonalHistoryData;