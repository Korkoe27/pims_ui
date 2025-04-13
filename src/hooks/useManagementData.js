import {
  useGetAllMedicationsQuery,
  useGetMedicationTypesQuery,
  useFilterMedicationsQuery,
  useGetManagementPlanQuery,
  useCreateManagementPlanMutation,
} from "../redux/api/features/managementApi";

const useManagementData = (appointmentId = null, typeId = null) => {
  // Fetch all medications
  const {
    data: medications = [],
    isLoading: isMedicationsLoading,
    isError: isMedicationsError,
    error: medicationsError,
    refetch: refetchMedications,
  } = useGetAllMedicationsQuery();

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
    skip: !typeId,
  });

  // Fetch latest management plan
  const {
    data: managementPlan = null,
    isLoading: isManagementPlanLoading,
    isError: isManagementPlanError,
    error: managementPlanError,
    refetch: refetchManagementPlan,
  } = useGetManagementPlanQuery(appointmentId, {
    skip: !appointmentId,
  });

  // Mutation to create a new management plan
  const [
    createManagementPlan,
    {
      isLoading: isCreatingManagementPlan,
      isError: isCreateManagementPlanError,
      error: createManagementPlanError,
    },
  ] = useCreateManagementPlanMutation();

  return {
    // Medications
    medications,
    isMedicationsLoading,
    isMedicationsError,
    medicationsError,
    refetchMedications,

    // Medication types
    medicationTypes,
    isMedicationTypesLoading,
    isMedicationTypesError,
    medicationTypesError,
    refetchMedicationTypes,

    // Filtered medications
    filteredMedications,
    isFilteringMedications,
    isFilterMedicationsError,
    filterMedicationsError,
    refetchFilterMedications,

    // Management Plan
    managementPlan,
    isManagementPlanLoading,
    isManagementPlanError,
    managementPlanError,
    refetchManagementPlan,

    // Create Management Plan
    createManagementPlan,
    isCreatingManagementPlan,
    isCreateManagementPlanError,
    createManagementPlanError,
  };
};

export default useManagementData;
