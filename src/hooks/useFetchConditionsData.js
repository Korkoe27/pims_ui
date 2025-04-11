// hooks/useFetchConditionsData.js
import useApiData from "./useApiData";
import {
  useFetchOcularConditionsQuery,
  useFetchMedicalConditionsQuery,
  useFetchDirectQuestioningConditionsQuery,
} from "../redux/api/features/conditionsApi";

const useFetchConditionsData = () => {
  const { data: ocularConditions, isLoading: loadingOcular } = useApiData(
    useFetchOcularConditionsQuery
  );

  const { data: medicalConditions, isLoading: loadingMedical } = useApiData(
    useFetchMedicalConditionsQuery
  );

  const {
    data: directQuestioningConditions,
    isLoading: loadingDirectQuestioning,
  } = useApiData(useFetchDirectQuestioningConditionsQuery);

  return {
    ocularConditions,
    medicalConditions,
    directQuestioningConditions,
    isLoading: loadingOcular || loadingMedical || loadingDirectQuestioning,
  };
};

export default useFetchConditionsData;