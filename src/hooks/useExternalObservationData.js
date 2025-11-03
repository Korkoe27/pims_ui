import {
  useFetchExternalObservationsQuery,
  useFetchExternalConditionsQuery,
  useCreateExternalObservationMutation,
} from "../redux/api/features/externalsApi";
import useApiData from "./useApiData";

const useExternalObservationData = (appointmentId, versionId) => {
  // Fetch observations by appointment ID and optionally version
  const { data: externals, isLoading: loadingExternals } = useApiData(
    useFetchExternalObservationsQuery,
    { appointmentId, versionId },
    { skip: !appointmentId }
  );

  // Fetch all external conditions
  const {
    data: conditions = [],
    isLoading: loadingConditions,
    error: conditionsError,
  } = useFetchExternalConditionsQuery();

  const [createExternalObservation, createExternalSubmissionStatus] =
    useCreateExternalObservationMutation();

  return {
    existingObservations: externals,
    loadingExternals,
    conditions,
    loadingConditions,
    createExternalObservation,
    createExternalSubmissionStatus,
    conditionsError,
  };
};

export default useExternalObservationData;
