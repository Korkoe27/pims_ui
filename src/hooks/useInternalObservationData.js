import {
  useFetchInternalObservationsQuery,
  useFetchInternalConditionsQuery,
  useCreateInternalObservationMutation,
} from "../redux/api/features/internalsApi";
import useApiData from "./useApiData";

const useInternalObservationData = (appointmentId) => {
  // Fetch observations by appointment ID
  const { data: internals, isLoading: loadingInternals } = useApiData(
    useFetchInternalObservationsQuery,
    appointmentId,
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
