import useApiData from "./useApiData";
import {
  useFetchPatientHistoryQuery,
  useFetchCaseHistoryQuery,
  useFetchMedicalConditionsQuery,
  useFetchOcularConditionsQuery,
} from "../redux/api/features/caseHistoryApi";

const useCaseHistoryData = (patientId, appointmentId) => {
  const { data: patientHistory, isLoading: loadingPatientHistory } = useApiData(useFetchPatientHistoryQuery, patientId, { skip: !patientId });
  const { data: caseHistory, isLoading: loadingCaseHistory } = useApiData(useFetchCaseHistoryQuery, appointmentId, { skip: !appointmentId });
  const { data: ocularConditions, isLoading: loadingOcularConditions } = useApiData(useFetchOcularConditionsQuery);
  const { data: medicalConditions, isLoading: loadingMedicalConditions } = useApiData(useFetchMedicalConditionsQuery);

  const isLoading = loadingPatientHistory || loadingCaseHistory || loadingOcularConditions || loadingMedicalConditions;

  return { patientHistory, caseHistory, ocularConditions, medicalConditions, isLoading };
};

export default useCaseHistoryData;
