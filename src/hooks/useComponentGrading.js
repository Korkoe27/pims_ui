import { useSelector } from "react-redux";
import { useGetAppointmentDetailsQuery } from "../redux/api/features/appointmentsApi";
import { getSectionConfigByKey } from "../constants/gradingSections";

/**
 * Custom hook for components that need grading functionality
 * @param {string} sectionKey - The section key from GRADING_SECTIONS
 * @param {string} appointmentId - The appointment ID
 * @returns {object} - Section config and grading state
 */
export const useComponentGrading = (sectionKey, appointmentId) => {
  const { role } = useSelector((state) => state.auth.user || {});

  const { data: appointment } = useGetAppointmentDetailsQuery(appointmentId, {
    skip: !appointmentId,
  });

  const sectionConfig = getSectionConfigByKey(sectionKey);

  const shouldShowGrading =
    appointment?.is_student_case &&
    role === "lecturer";

  return {
    sectionConfig,
    shouldShowGrading,
    appointment,
    role,
    // Convenience properties
    section: sectionConfig?.value,
    sectionLabel: sectionConfig?.gradingLabel,
    displayLabel: sectionConfig?.label,
  };
};

export default useComponentGrading;
