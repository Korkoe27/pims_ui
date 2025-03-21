import useApiData from "./useApiData";
import {
  useFetchCaseHistoryQuery,
  useCreateCaseHistoryMutation, // 👈 add this
} from "../redux/api/features/caseHistoryApi";
import {
  useFetchOcularConditionsQuery,
  useFetchMedicalConditionsQuery,
} from "../redux/api/features/conditionsApi";

const useCaseHistoryData = (patientId, appointmentId) => {
  const { data: caseHistory, isLoading: loadingCaseHistory } = useApiData(
    useFetchCaseHistoryQuery,
    appointmentId,
    { skip: !appointmentId }
  );

  const { data: ocularConditions, isLoading: loadingOcularConditions } = useApiData(
    useFetchOcularConditionsQuery
  );

  const { data: medicalConditions, isLoading: loadingMedicalConditions } = useApiData(
    useFetchMedicalConditionsQuery
  );

  const [createCaseHistory, createCaseHistoryStatus] = useCreateCaseHistoryMutation(); // ✅

  const isLoading = loadingCaseHistory || loadingOcularConditions || loadingMedicalConditions;

  return {
    caseHistory,
    ocularConditions,
    medicalConditions,
    createCaseHistory, // ✅ expose mutation function
    createCaseHistoryStatus, // ✅ optional: expose status like isLoading, isError
    isLoading,
  };
};

export default useCaseHistoryData;
