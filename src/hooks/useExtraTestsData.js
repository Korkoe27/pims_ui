// hooks/useExtraTestsData.js
import {
    useFetchExtraTestsQuery,
    useCreateExtraTestMutation,
  } from "../redux/api/features/extraTestsApi";
  
  const useExtraTestsData = (appointmentId, versionId) => {
    const {
      data: extraTests = [],
      isLoading: loadingExtraTests,
      error: fetchError,
      refetch,
    } = useFetchExtraTestsQuery({ appointmentId, versionId }, {
      skip: !appointmentId,
    });
  
    const [
      createExtraTest,
      {
        isLoading: creatingExtraTest,
        error: createError,
        isSuccess: createSuccess,
      },
    ] = useCreateExtraTestMutation();
  
    const uploadExtraTest = async ({ name, file, notes }) => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);
      formData.append("notes", notes || "");
  
      return await createExtraTest({ appointmentId, versionId, formData }).unwrap();
    };
  
    return {
      extraTests,
      loadingExtraTests,
      creatingExtraTest,
      fetchError,
      createError,
      createSuccess,
      uploadExtraTest,
      refetchExtraTests: refetch,
    };
  };
  
  export default useExtraTestsData;
  