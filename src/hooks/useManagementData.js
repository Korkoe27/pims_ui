import {
    useGetMedicationsQuery,
    useGetMedicationTypesQuery,
    useFilterMedicationsQuery,
  } from "../api/features/managementApi";
  
  const useManagementData = (typeId = null) => {
    // Fetch all medications
    const {
      data: medications = [],
      isLoading: isMedicationsLoading,
      isError: isMedicationsError,
      error: medicationsError,
      refetch: refetchMedications,
    } = useGetMedicationsQuery();
  
    // Fetch all medication types
    const {
      data: medicationTypes = [],
      isLoading: isMedicationTypesLoading,
      isError: isMedicationTypesError,
      error: medicationTypesError,
      refetch: refetchMedicationTypes,
    } = useGetMedicationTypesQuery();
  
    // Filter medications by type
    const {
      data: filteredMedications = [],
      isLoading: isFilteringMedications,
      isError: isFilterMedicationsError,
      error: filterMedicationsError,
      refetch: refetchFilterMedications,
    } = useFilterMedicationsQuery(typeId, {
      skip: !typeId, // Only run if typeId is provided
    });
  
    return {
      medications,
      isMedicationsLoading,
      isMedicationsError,
      medicationsError,
      refetchMedications,
  
      medicationTypes,
      isMedicationTypesLoading,
      isMedicationTypesError,
      medicationTypesError,
      refetchMedicationTypes,
  
      filteredMedications,
      isFilteringMedications,
      isFilterMedicationsError,
      filterMedicationsError,
      refetchFilterMedications,
    };
  };
  
  export default useManagementData;
  