import { useFetchVisualAcuityQuery, useCreateVisualAcuityMutation } from "../redux/api/features/visualAcuityApi";
import useApiData from "./useApiData";

const useVisualAcuityData = (appointmentId, versionId) => {
  const { data: visualAcuity, isLoading: loadingVA } = useApiData(
    useFetchVisualAcuityQuery,
    { appointmentId, versionId },
    { skip: !appointmentId }
  );

  const [createVisualAcuity, createVASubmissionStatus] = useCreateVisualAcuityMutation();

  return {
    visualAcuity,
    loadingVA,
    createVisualAcuity,
    createVASubmissionStatus,
  };
};

export default useVisualAcuityData;
