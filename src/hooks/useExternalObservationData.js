import {
    useFetchExternalObservationsQuery,
    useCreateExternalObservationMutation,
  } from "../redux/api/features/externalsApi";
  import useApiData from "./useApiData";
  
  const useExternalObservationData = (appointmentId) => {
    const { data: externals, isLoading: loadingExternals } = useApiData(
      useFetchExternalObservationsQuery,
      appointmentId,
      { skip: !appointmentId }
    );
  
    const [createExternalObservation, createExternalSubmissionStatus] =
      useCreateExternalObservationMutation();
  
    return {
      externals, // all existing observations
      loadingExternals,
      createExternalObservation, // call this inside a loop or bulk function
      createExternalSubmissionStatus,
    };
  };
  
  export default useExternalObservationData;
  