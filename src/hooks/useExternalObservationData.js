import { useEffect } from "react";
import {
  useFetchExternalObservationsQuery,
  useFetchExternalConditionsQuery,
  useCreateExternalObservationMutation,
} from "../redux/api/features/externalsApi";
import useApiData from "./useApiData";

const useExternalObservationData = (appointmentId) => {
  // Fetch observations by appointment ID
  const { data: externals, isLoading: loadingExternals } = useApiData(
    useFetchExternalObservationsQuery,
    appointmentId,
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
