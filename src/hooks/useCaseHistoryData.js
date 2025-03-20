import useApiData from "./useApiData";
import {
  useFetchCaseHistoryQuery,
} from "../redux/api/features/caseHistoryApi";
import {
  useFetchOcularConditionsQuery,
  useFetchMedicalConditionsQuery
} from "../redux/api/features/conditionsApi";

const useCaseHistoryData = (patientId, appointmentId) => {
  const { data: caseHistory, isLoading: loadingCaseHistory } = useApiData(useFetchCaseHistoryQuery, appointmentId, { skip: !appointmentId });
  const { data: ocularConditions, isLoading: loadingOcularConditions } = useApiData(useFetchOcularConditionsQuery);
  const { data: medicalConditions, isLoading: loadingMedicalConditions } = useApiData(useFetchMedicalConditionsQuery);

  const isLoading = loadingCaseHistory || loadingOcularConditions || loadingMedicalConditions;

  return { caseHistory, ocularConditions, medicalConditions, isLoading };
};

export default useCaseHistoryData;
