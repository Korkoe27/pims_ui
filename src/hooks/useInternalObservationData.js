import {
  useFetchInternalObservationsQuery,
  useFetchInternalConditionsQuery,
  useCreateInternalObservationMutation,
} from "../redux/api/features/internalsApi";
import useApiData from "./useApiData";

const useInternalObservationData = (appointmentId, versionId) => {
  // Fetch observations by appointment ID and optionally version
  const { data: internals, isLoading: loadingInternals } = useApiData(
    useFetchInternalObservationsQuery,
    { appointmentId, versionId },
    { skip: !appointmentId }
  );

  // Fetch all internal conditions
  const {
    data: conditions = [],
    isLoading: loadingConditions,
    error: conditionsError,
  } = useFetchInternalConditionsQuery();

  const [createInternalObservation, createInternalSubmissionStatus] =
    useCreateInternalObservationMutation();

  return {
    existingObservations: internals,
    loadingInternals,
    conditions,
    loadingConditions,
    createInternalObservation,
    createInternalSubmissionStatus,
    conditionsError,
  };
};

export default useInternalObservationData;
