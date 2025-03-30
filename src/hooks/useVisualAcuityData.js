import { useFetchVisualAcuityQuery, useCreateVisualAcuityMutation } from "../redux/api/features/visualAcuityApi";
import useApiData from "./useApiData";

const useVisualAcuityData = (appointmentId) => {
  const { data: visualAcuity, isLoading: loadingVA } = useApiData(
    useFetchVisualAcuityQuery,
    appointmentId,
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
