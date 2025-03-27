// hooks/useFetchConditionsData.js
import useApiData from "./useApiData";
import {
  useFetchOcularConditionsQuery,
  useFetchMedicalConditionsQuery,
} from "../redux/api/features/conditionsApi";

const useFetchConditionsData = () => {
  const { data: ocularConditions, isLoading: loadingOcular } = useApiData(
    useFetchOcularConditionsQuery
  );

  const { data: medicalConditions, isLoading: loadingMedical } = useApiData(
    useFetchMedicalConditionsQuery
  );

  return {
    ocularConditions,
    medicalConditions,
    isLoading: loadingOcular || loadingMedical,
  };
};

export default useFetchConditionsData;
