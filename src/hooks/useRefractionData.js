import {
    useFetchRefractionQuery,
    useCreateRefractionMutation,
  } from "../redux/api/features/refractionApi";
  import useApiData from "./useApiData";
  
  const useRefractionData = (appointmentId) => {
    // Fetch existing refraction data
    const { data: refraction, isLoading: loadingRefraction } = useApiData(
      useFetchRefractionQuery,
      appointmentId,
      { skip: !appointmentId }
    );
  
    const [createRefraction, createRefractionStatus] =
      useCreateRefractionMutation();
  
    return {
      refraction,
      loadingRefraction,
      createRefraction,
      createRefractionStatus,
    };
  };
  
  export default useRefractionData;
  